// Email delivery service using Resend API
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { getEmailTemplate, renderTemplate, validateTemplateVariables, EmailVariables } from './email-templates'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY!)

// Get admin Supabase client
const supabaseAdmin = getSupabaseAdmin()

export interface EmailEvent {
  id: string
  lead_id: string
  template_key: string
  lang: string
  status: 'queued' | 'sent' | 'failed'
  metadata: any
  created_at: string
  updated_at: string
  sent_at?: string
  error_message?: string
  retry_count?: number
}

export interface DeliveryResult {
  success: boolean
  email_id?: string
  error_message?: string
  retry_needed?: boolean
}

/**
 * Send email using Resend API with template rendering
 */
export async function sendEmail(
  eventId: string,
  to: string,
  templateKey: string,
  lang: string = 'hu',
  variables: EmailVariables = {}
): Promise<DeliveryResult> {
  try {
    console.log(`Sending email: ${templateKey}/${lang} to ${to}`)
    
    // Get template with fallback
    const template = await getEmailTemplate(templateKey, lang)
    if (!template) {
      throw new Error(`Template not found: ${templateKey}/${lang}`)
    }
    
    // Validate required variables
    const validation = validateTemplateVariables(template, variables)
    if (!validation.isValid) {
      console.warn(`Missing variables for ${templateKey}/${lang}:`, validation.missing)
      
      // Add fallback values for missing variables
      const fallbackVariables = { ...variables }
      for (const missing of validation.missing) {
        switch (missing) {
          case 'name':
            fallbackVariables.name = 'Kedves Résztvevő'
            break
          case 'result_url':
            fallbackVariables.result_url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/results`
            break
          case 'download_url':
            fallbackVariables.download_url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download`
            break
          default:
            fallbackVariables[missing] = `[${missing}]`
        }
      }
      variables = fallbackVariables
    }
    
    // Render template with variables
    const rendered = renderTemplate(template, variables)
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'ADHD Quiz <quiz@adhd.hu>',
      to: [to],
      subject: rendered.subject,
      html: rendered.html_content,
      text: rendered.text_content,
      headers: {
        'X-Email-Event-ID': eventId,
        'X-Template-Key': templateKey,
        'X-Language': lang
      }
    })
    
    if (error) {
      console.error('Resend API error:', error)
      throw new Error(`Resend error: ${error.message}`)
    }
    
    console.log(`Email sent successfully: ${data?.id}`)
    
    // Update email event status to sent
    await updateEmailEventStatus(eventId, 'sent', {
      email_id: data?.id,
      sent_at: new Date().toISOString(),
      rendered_subject: rendered.subject,
      missing_variables: rendered.missing_variables
    })
    
    return {
      success: true,
      email_id: data?.id
    }
    
  } catch (error: any) {
    console.error(`Email sending failed for event ${eventId}:`, error)
    
    // Update email event status to failed
    await updateEmailEventStatus(eventId, 'failed', {
      error_message: error.message,
      error_timestamp: new Date().toISOString()
    })
    
    return {
      success: false,
      error_message: error.message,
      retry_needed: shouldRetry(error)
    }
  }
}

/**
 * Update email event status in database
 */
async function updateEmailEventStatus(
  eventId: string, 
  status: 'sent' | 'failed',
  additionalData: any = {}
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
      metadata: additionalData
    }
    
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString()
    }
    
    const { error } = await supabaseAdmin
      .from('email_events')
      .update(updateData)
      .eq('id', eventId)
    
    if (error) {
      console.error('Failed to update email event status:', error)
    }
    
  } catch (error) {
    console.error('Error updating email event:', error)
  }
}

/**
 * Determine if email sending should be retried based on error type
 */
function shouldRetry(error: any): boolean {
  const retryableErrors = [
    'rate_limit_exceeded',
    'temporary_failure',
    'network_error',
    'timeout'
  ]
  
  const errorMessage = error.message?.toLowerCase() || ''
  
  return retryableErrors.some(retryableError => 
    errorMessage.includes(retryableError) || 
    errorMessage.includes('5') // 5xx server errors
  )
}

/**
 * Process queued email events for immediate delivery
 */
export async function processQueuedEmails(limit: number = 10): Promise<{
  processed: number
  sent: number
  failed: number
  errors: string[]
}> {
  console.log(`Processing up to ${limit} queued emails...`)
  
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[]
  }
  
  try {
    // Get queued email events
    const { data: events, error } = await supabaseAdmin
      .from('email_events')
      .select(`
        *,
        quiz_sessions!inner(
          id,
          email,
          metadata
        )
      `)
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(limit)
    
    if (error) {
      throw new Error(`Failed to fetch queued emails: ${error.message}`)
    }
    
    if (!events || events.length === 0) {
      console.log('No queued emails found')
      return results
    }
    
    console.log(`Found ${events.length} queued emails to process`)
    
    // Process each email event
    for (const event of events) {
      results.processed++
      
      try {
        const session = event.quiz_sessions
        if (!session?.email) {
          throw new Error('No email address found in session')
        }
        
        // Prepare template variables from session and event metadata
        const variables: EmailVariables = {
          name: session.metadata?.name || session.metadata?.first_name || 'Kedves Résztvevő',
          first_name: session.metadata?.first_name,
          result_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${event.lang}/results/${session.id}`,
          download_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${event.lang}/download/${session.id}`,
          quiz_title: 'ADHD Gyorsteszt',
          quiz_slug: 'adhd-quick-check',
          ...event.metadata
        }
        
        // Send email
        const result = await sendEmail(
          event.id,
          session.email,
          event.template_key,
          event.lang,
          variables
        )
        
        if (result.success) {
          results.sent++
          console.log(`✅ Email sent: ${event.template_key}/${event.lang} to ${session.email}`)
        } else {
          results.failed++
          results.errors.push(`${event.id}: ${result.error_message}`)
          console.error(`❌ Email failed: ${event.template_key}/${event.lang} to ${session.email}`)
        }
        
      } catch (error: any) {
        results.failed++
        results.errors.push(`${event.id}: ${error.message}`)
        console.error(`❌ Processing failed for event ${event.id}:`, error)
        
        // Update event status to failed
        await updateEmailEventStatus(event.id, 'failed', {
          error_message: error.message,
          processing_error: true
        })
      }
    }
    
  } catch (error: any) {
    console.error('Error processing queued emails:', error)
    results.errors.push(`General error: ${error.message}`)
  }
  
  console.log(`Email processing complete: ${results.sent} sent, ${results.failed} failed, ${results.processed} total`)
  
  return results
}

/**
 * Retry failed email events (up to 3 attempts)
 */
export async function retryFailedEmails(maxRetries: number = 3): Promise<{
  retried: number
  sent: number
  skipped: number
}> {
  console.log(`Retrying failed emails (max ${maxRetries} attempts)...`)
  
  const results = {
    retried: 0,
    sent: 0,
    skipped: 0
  }
  
  try {
    // Get failed email events that haven't exceeded retry limit
    const { data: events, error } = await supabaseAdmin
      .from('email_events')
      .select(`
        *,
        quiz_sessions!inner(
          id,
          email,
          metadata
        )
      `)
      .eq('status', 'failed')
      .lt('retry_count', maxRetries)
      .order('created_at', { ascending: true })
      .limit(20)
    
    if (error) {
      throw new Error(`Failed to fetch failed emails: ${error.message}`)
    }
    
    if (!events || events.length === 0) {
      console.log('No failed emails to retry')
      return results
    }
    
    for (const event of events) {
      results.retried++
      
      // Update retry count
      const retryCount = (event.retry_count || 0) + 1
      await supabaseAdmin
        .from('email_events')
        .update({ 
          retry_count: retryCount,
          status: 'queued', // Reset to queued for retry
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id)
      
      console.log(`Retry ${retryCount}/${maxRetries} for event ${event.id}`)
    }
    
    // Process the retried emails
    const processResult = await processQueuedEmails(events.length)
    results.sent = processResult.sent
    
  } catch (error: any) {
    console.error('Error retrying failed emails:', error)
  }
  
  console.log(`Retry complete: ${results.sent} sent, ${results.retried} retried, ${results.skipped} skipped`)
  
  return results
}
