// Email scheduling system for Day 2 and Day 5 follow-up emails
import { createClient } from '@supabase/supabase-js'

// Create admin Supabase client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface ScheduledEmail {
  lead_id: string
  quiz_id?: string
  order_id?: string
  template_key: string
  lang: string
  scheduled_for: string
  metadata?: any
}

/**
 * Schedule follow-up emails (Day 2 and Day 5) after order creation
 */
export async function scheduleFollowUpEmails(
  leadId: string,
  orderId: string,
  quizId: string,
  lang: string = 'hu'
): Promise<void> {
  try {
    console.log(`Scheduling follow-up emails for lead ${leadId}`)
    
    const now = new Date()
    
    // Schedule Day 2 email (tips + soft upsell)
    const day2Date = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // +2 days
    
    // Schedule Day 5 email (hard upsell)
    const day5Date = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // +5 days
    
    const scheduledEmails: ScheduledEmail[] = [
      {
        lead_id: leadId,
        quiz_id: quizId,
        order_id: orderId,
        template_key: 'day_2',
        lang,
        scheduled_for: day2Date.toISOString(),
        metadata: {
          trigger: 'scheduled_followup',
          order_id: orderId,
          day_number: 2,
          created_at: now.toISOString()
        }
      },
      {
        lead_id: leadId,
        quiz_id: quizId,
        order_id: orderId,
        template_key: 'day_5',
        lang,
        scheduled_for: day5Date.toISOString(),
        metadata: {
          trigger: 'scheduled_followup',
          order_id: orderId,
          day_number: 5,
          created_at: now.toISOString()
        }
      }
    ]
    
    // Insert scheduled emails using RPC function
    for (const email of scheduledEmails) {
      const { data, error } = await supabaseAdmin.rpc('insert_email_event', {
        p_lead_id: email.lead_id,
        p_template_key: email.template_key,
        p_lang: email.lang,
        p_status: 'scheduled',
        p_metadata: {
          ...email.metadata,
          scheduled_for: email.scheduled_for
        }
      })
      
      if (error) {
        console.error(`Failed to schedule ${email.template_key} email:`, error)
      } else {
        console.log(`✅ Scheduled ${email.template_key} email for ${email.scheduled_for}`)
      }
    }
    
  } catch (error) {
    console.error('Error scheduling follow-up emails:', error)
  }
}

/**
 * Process scheduled emails that are due to be sent
 */
export async function processScheduledEmails(): Promise<{
  processed: number
  activated: number
  errors: string[]
}> {
  console.log('Processing scheduled emails...')
  
  const results = {
    processed: 0,
    activated: 0,
    errors: [] as string[]
  }
  
  try {
    const now = new Date().toISOString()
    
    // Find scheduled emails that are due
    const { data: scheduledEvents, error } = await supabaseAdmin
      .from('email_events')
      .select('*')
      .eq('status', 'scheduled')
      .lte('metadata->scheduled_for', now)
      .order('created_at', { ascending: true })
      .limit(50)
    
    if (error) {
      throw new Error(`Failed to fetch scheduled emails: ${error.message}`)
    }
    
    if (!scheduledEvents || scheduledEvents.length === 0) {
      console.log('No scheduled emails due for processing')
      return results
    }
    
    console.log(`Found ${scheduledEvents.length} scheduled emails due for processing`)
    
    // Activate scheduled emails by changing status to queued
    for (const event of scheduledEvents) {
      results.processed++
      
      try {
        const { error: updateError } = await supabaseAdmin
          .from('email_events')
          .update({
            status: 'queued',
            updated_at: new Date().toISOString()
          })
          .eq('id', event.id)
        
        if (updateError) {
          throw new Error(`Failed to activate email ${event.id}: ${updateError.message}`)
        }
        
        results.activated++
        console.log(`✅ Activated scheduled email: ${event.template_key}/${event.lang} (${event.id})`)
        
      } catch (error: any) {
        results.errors.push(`${event.id}: ${error.message}`)
        console.error(`❌ Failed to activate email ${event.id}:`, error)
      }
    }
    
  } catch (error: any) {
    console.error('Error processing scheduled emails:', error)
    results.errors.push(`General error: ${error.message}`)
  }
  
  console.log(`Scheduled email processing complete: ${results.activated} activated, ${results.processed} processed`)
  
  return results
}

/**
 * Clean up old scheduled emails that are past their send window
 */
export async function cleanupExpiredEmails(daysOld: number = 30): Promise<number> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    // Delete scheduled emails older than cutoff that were never sent
    const { data, error } = await supabaseAdmin
      .from('email_events')
      .delete()
      .eq('status', 'scheduled')
      .lt('created_at', cutoffDate.toISOString())
    
    if (error) {
      console.error('Failed to cleanup expired emails:', error)
      return 0
    }
    
    const deletedCount = data ? 1 : 0
    console.log(`Cleaned up ${deletedCount} expired scheduled emails`)
    
    return deletedCount
    
  } catch (error) {
    console.error('Error cleaning up expired emails:', error)
    return 0
  }
}

/**
 * Get email scheduling statistics
 */
export async function getSchedulingStats(): Promise<{
  scheduled: number
  due_now: number
  sent_today: number
  failed_today: number
}> {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const nowISO = now.toISOString()
    
    const [scheduledResult, dueResult, sentResult, failedResult] = await Promise.all([
      // Total scheduled emails
      supabaseAdmin
        .from('email_events')
        .select('count')
        .eq('status', 'scheduled'),
      
      // Emails due now
      supabaseAdmin
        .from('email_events')
        .select('count')
        .eq('status', 'scheduled')
        .lte('metadata->scheduled_for', nowISO),
      
      // Emails sent today
      supabaseAdmin
        .from('email_events')
        .select('count')
        .eq('status', 'sent')
        .gte('sent_at', todayStart),
      
      // Emails failed today
      supabaseAdmin
        .from('email_events')
        .select('count')
        .eq('status', 'failed')
        .gte('updated_at', todayStart)
    ])
    
    return {
      scheduled: scheduledResult.count || 0,
      due_now: dueResult.count || 0,
      sent_today: sentResult.count || 0,
      failed_today: failedResult.count || 0
    }
    
  } catch (error) {
    console.error('Error getting scheduling stats:', error)
    return {
      scheduled: 0,
      due_now: 0,
      sent_today: 0,
      failed_today: 0
    }
  }
}
