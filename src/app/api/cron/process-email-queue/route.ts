import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase-config'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  try {
    // This endpoint processes pending emails in the queue
    // It should be called by a cron job or scheduled task
    
    const supabase = getSupabaseAdmin()
    
    // Get pending emails that are scheduled to be sent
    const { data: queueItems, error } = await supabase
      .from('email_queue')
      .select(`
        *,
        email_templates (
          subject_template,
          body_html,
          body_markdown
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true })
      .limit(50) // Process max 50 emails per run

    if (error) {
      console.error('Error fetching queue items:', error)
      return NextResponse.json({ error: 'Failed to fetch queue items' }, { status: 500 })
    }

    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ 
        message: 'No pending emails to process',
        processed: 0 
      })
    }

    console.log(`Processing ${queueItems.length} emails from queue`)

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each email
    for (const item of queueItems) {
      try {
        // Update status to processing
        await supabase
          .from('email_queue')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)

        // Process template variables
        const { subject, htmlContent } = processTemplate(item.email_templates, item.variables)

        // Send email via Resend
        const result = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@quizapp.hu',
          to: item.recipient_email,
          subject: subject,
          html: htmlContent,
          headers: {
            'X-Email-Type': 'automated',
            'X-Template-Id': item.template_id,
            'X-Queue-Id': item.id
          }
        })

        // Update queue item status to sent
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            external_id: result.data?.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)

        // Log analytics
        await supabase
          .from('email_analytics')
          .insert({
            quiz_id: item.quiz_id,
            template_id: item.template_id,
            recipient_email: item.recipient_email,
            event_type: 'sent',
            event_date: new Date().toISOString(),
            external_id: result.data?.id,
            metadata: {
              queue_id: item.id,
              automation_rule_id: item.automation_rule_id
            }
          })

        results.succeeded++
        console.log(`Email sent successfully: ${result.data?.id} to ${item.recipient_email}`)

      } catch (error) {
        console.error(`Error processing email ${item.id}:`, error)

        // Update queue item status to failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)

        results.failed++
        results.errors.push(`Email ${item.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      results.processed++
    }

    console.log(`Email processing completed: ${results.succeeded} sent, ${results.failed} failed`)

    return NextResponse.json({
      message: 'Email processing completed',
      ...results
    })

  } catch (error) {
    console.error('Email queue processor error:', error)
    return NextResponse.json(
      { error: 'Email queue processing failed' },
      { status: 500 }
    )
  }
}

// Process template variables and generate final content
function processTemplate(template: any, variables: any) {
  if (!template) {
    throw new Error('Template not found')
  }

  let subject = template.subject_template || ''
  let htmlContent = template.body_html || template.body_markdown || ''

  // Default variables
  const allVariables = {
    user_name: 'Értékes Ügyfél',
    user_email: '',
    quiz_title: '',
    quiz_result_percentage: '0',
    quiz_result_text: '',
    quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
    product_name: '',
    product_price: '',
    purchase_date: '',
    order_id: '',
    ai_result: '',
    saved_analysis_code: '',
    discount_code: '',
    expiry_date: '',
    support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
    company_name: 'Quiz Platform',
    unsubscribe_url: '#',
    ...variables
  }

  // Replace all variables in subject and content
  Object.entries(allVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    const stringValue = String(value || '')
    
    subject = subject.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), stringValue)
    htmlContent = htmlContent.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), stringValue)
  })

  return { subject, htmlContent }
}
