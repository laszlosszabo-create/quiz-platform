import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase-config'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema for sending emails
const sendEmailSchema = z.object({
  template_id: z.string().uuid(),
  recipient_email: z.string().email(),
  variables: z.record(z.any()).default({}),
  schedule_at: z.string().optional(), // ISO string for scheduling
  priority: z.number().min(1).max(10).default(5)
})

const testEmailSchema = z.object({
  template_id: z.string().uuid(),
  recipient_email: z.string().email(),
  variables: z.record(z.any()).default({})
})

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') // 'send' or 'test'
    
    const body = await request.json()

    if (action === 'test') {
      return await handleTestEmail(body)
    } else {
      return await handleSendEmail(body)
    }

  } catch (error) {
    console.error('Email send API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleTestEmail(body: any) {
  const validatedData = testEmailSchema.parse(body)
  const supabase = getSupabaseAdmin()

  // Get template
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', validatedData.template_id)
    .eq('is_active', true)
    .single()

  if (templateError || !template) {
    return NextResponse.json(
      { error: 'Template not found or inactive' },
      { status: 404 }
    )
  }

  // Process template variables
  const { subject, htmlContent } = await processTemplate(template, validatedData.variables, supabase)

  // Send test email directly without queue
  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@quizapp.hu',
      to: validatedData.recipient_email,
      subject: `[TEST] ${subject}`,
      html: htmlContent,
      headers: {
        'X-Email-Type': 'test',
        'X-Template-Id': template.id
      }
    })

    return NextResponse.json({ 
      success: true, 
      emailId: result.data?.id,
      message: 'Test email sent successfully'
    })

  } catch (error) {
    console.error('Test email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}

async function handleSendEmail(body: any) {
  const validatedData = sendEmailSchema.parse(body)
  const supabase = getSupabaseAdmin()

  // Get template
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', validatedData.template_id)
    .eq('is_active', true)
    .single()

  if (templateError || !template) {
    return NextResponse.json(
      { error: 'Template not found or inactive' },
      { status: 404 }
    )
  }

  // Process template variables
  const { subject, htmlContent } = await processTemplate(template, validatedData.variables, supabase)

  // Schedule email in queue
  const scheduledAt = validatedData.schedule_at 
    ? new Date(validatedData.schedule_at)
    : new Date()

  const { data: queueItem, error: queueError } = await supabase
    .from('email_queue')
    .insert({
      quiz_id: template.quiz_id,
      product_id: template.product_id,
      template_id: template.id,
      recipient_email: validatedData.recipient_email,
      subject: subject,
      html_content: htmlContent,
      variables: validatedData.variables,
      scheduled_at: scheduledAt.toISOString(),
      priority: validatedData.priority,
      status: 'pending'
    })
    .select()
    .single()

  if (queueError) {
    console.error('Queue insertion error:', queueError)
    return NextResponse.json(
      { error: 'Failed to queue email' },
      { status: 500 }
    )
  }

  // If scheduled for immediate sending, process it
  if (scheduledAt <= new Date()) {
    await processEmailQueue(queueItem.id)
  }

  return NextResponse.json({ 
    success: true, 
    queueItemId: queueItem.id,
    scheduledAt: scheduledAt.toISOString()
  })
}

// Process template variables and generate final content
async function processTemplate(template: any, variables: any, supabase: any) {
  let subject = template.subject_template
  let htmlContent = template.body_html || template.body_markdown

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quizapp.hu'
  
  // Replace standard variables
  const allVariables = {
    user_name: variables.user_name || 'Értékes Ügyfél',
    user_email: variables.user_email || '',
    quiz_title: variables.quiz_title || 'ADHD Gyorsteszt',
    percentage: variables.percentage || variables.quiz_result_percentage || '75',
    score: variables.score || '15',
    category: variables.category || variables.quiz_result_text || 'Magasabb Szintű',
    quiz_result_percentage: variables.quiz_result_percentage || variables.percentage || '75',
    quiz_result_text: variables.quiz_result_text || variables.category || 'Magasabb Szintű',
    quiz_completion_date: variables.quiz_completion_date || new Date().toLocaleDateString('hu-HU'),
    product_name: variables.product_name || '',
    product_price: variables.product_price || '',
    purchase_date: variables.purchase_date || '',
    order_id: variables.order_id || '',
    ai_result: variables.ai_result || '',
    saved_analysis_code: variables.saved_analysis_code || '',
    discount_code: variables.discount_code || '',
    expiry_date: variables.expiry_date || '',
    support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
    company_name: 'Quiz Platform',
    unsubscribe_url: variables.unsubscribe_url || '#',
    // URL variables
    result_url: variables.result_url || `${baseUrl}/results`,
    booking_url: variables.booking_url || `${baseUrl}/booking`,
    download_url: variables.download_url || `${baseUrl}/downloads`,
    ...variables
  }

  // If saved_analysis_code is provided, fetch saved analysis
  if (allVariables.saved_analysis_code) {
    try {
      const { data: savedAnalysis, error } = await supabase
        .from('quiz_results')
        .select('ai_result')
        .eq('id', allVariables.saved_analysis_code)
        .single()

      if (!error && savedAnalysis) {
        allVariables.ai_result = savedAnalysis.ai_result
      }
    } catch (error) {
      console.warn('Failed to fetch saved analysis:', error)
    }
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

// Process email queue item (send actual email)
async function processEmailQueue(queueItemId: string) {
  const supabase = getSupabaseAdmin()

  try {
    // Get queue item
    const { data: queueItem, error: queueError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('id', queueItemId)
      .single()

    if (queueError || !queueItem) {
      throw new Error('Queue item not found')
    }

    // Update status to processing
    await supabase
      .from('email_queue')
      .update({ status: 'processing' })
      .eq('id', queueItemId)

    // Send email via Resend
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@quizapp.hu',
      to: queueItem.recipient_email,
      subject: queueItem.subject,
      html: queueItem.html_content,
      headers: {
        'X-Email-Type': 'automated',
        'X-Template-Id': queueItem.template_id,
        'X-Queue-Id': queueItem.id
      }
    })

    // Update queue item status to sent
  await supabase
      .from('email_queue')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
        external_id: result.data?.id,
        
      })
      .eq('id', queueItemId)

    // Log analytics
    await supabase
      .from('email_analytics')
      .insert({
        quiz_id: queueItem.quiz_id,
        template_id: queueItem.template_id,
        recipient_email: queueItem.recipient_email,
        event_type: 'sent',
        event_date: new Date().toISOString(),
        external_id: result.data?.id,
        metadata: { queue_id: queueItemId }
      })

    console.log(`Email sent successfully: ${result.data?.id}`)

  } catch (error) {
    console.error('Email processing error:', error)

    // Update queue item status to failed
  await supabase
      .from('email_queue')
      .update({ 
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        
      })
      .eq('id', queueItemId)

    throw error
  }
}
