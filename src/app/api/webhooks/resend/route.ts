import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()
    const supabase = getSupabaseAdmin()

    // Verify webhook signature if configured
    const signature = request.headers.get('resend-signature')
    if (process.env.RESEND_WEBHOOK_SECRET && signature) {
      // TODO: Implement signature verification
      // This would verify that the webhook is actually from Resend
    }

    // Process different email events
    const { type, data } = webhookData

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook data' },
        { status: 400 }
      )
    }

    // Extract relevant information
    const emailId = data.email_id
    const recipientEmail = data.to?.[0] || data.email
    const eventType = mapResendEventType(type)

    if (!eventType) {
      console.warn(`Unknown Resend event type: ${type}`)
      return NextResponse.json({ success: true })
    }

    // Get queue item by external_id
    const { data: queueItem, error: queueError } = await supabase
      .from('email_queue')
      .select('id, quiz_id, template_id')
      .eq('external_id', emailId)
      .single()

    if (queueError || !queueItem) {
      console.warn(`Queue item not found for email ID: ${emailId}`)
      // Still log the event even if we can't find the queue item
    }

    // Idempotency: prevent duplicate analytics by external event id
    // If your table has a unique constraint on (external_id, event_type), this will naturally dedupe.
    const analyticsData = {
      quiz_id: queueItem?.quiz_id || null,
      template_id: queueItem?.template_id || null,
      recipient_email: recipientEmail,
      event_type: eventType,
      event_date: new Date().toISOString(),
      external_id: emailId,
      metadata: {
        webhook_type: type,
        queue_id: queueItem?.id,
        raw_data: data
      }
    }

    // Try insert, ignore duplicates
    const { error: analyticsError } = await supabase
      .from('email_analytics')
      .insert(analyticsData)

    if (analyticsError) {
      console.error('Analytics insertion error:', analyticsError)
    }

    // Update queue item by event types
    if (queueItem && eventType === 'delivered') {
    await supabase
        .from('email_queue')
        .update({
      status: 'sent' // Confirm delivery
        })
        .eq('id', queueItem.id)
    }

    if (queueItem && (eventType === 'bounced' || eventType === 'failed')) {
      // Classify reason
      const reason: string = data.reason || `Email ${eventType}`
    await supabase
        .from('email_queue')
        .update({
          status: 'failed',
      error_message: reason
        })
        .eq('id', queueItem.id)

      // Log failure analytics best-effort
      try {
        await supabase
          .from('email_analytics')
          .insert({ email_queue_id: queueItem.id, event_type: 'failed', event_data: { reason } })
      } catch {}
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Email webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Map Resend event types to our analytics event types
function mapResendEventType(resendType: string): string | null {
  const eventMap: { [key: string]: string } = {
    'email.sent': 'sent',
    'email.delivered': 'delivered',
    'email.delivery_delayed': 'delayed',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
    'email.unsubscribed': 'unsubscribed'
  }

  return eventMap[resendType] || null
}
