import { getSupabaseAdmin } from '@/lib/supabase-config'

export interface EmailTriggerEvent {
  type: 'quiz_complete' | 'purchase' | 'no_purchase_reminder'
  quiz_id: string
  user_email: string
  user_name?: string
  quiz_result?: {
    percentage: number
    text: string
    ai_result?: string
  }
  product_id?: string
  order_id?: string
  metadata?: Record<string, any>
}

export class EmailAutomationTrigger {
  private supabase = getSupabaseAdmin()

  async triggerEmails(event: EmailTriggerEvent): Promise<void> {
    try {
      console.log(`Processing email trigger: ${event.type} for quiz ${event.quiz_id}`)

      // Get matching automation rules
      let rules: any[] | null = null
      // Attempt new schema first
      {
        const { data, error } = await this.supabase
          .from('email_automation_rules')
          .select(`
            *,
            email_templates (*)
          `)
          .eq('quiz_id', event.quiz_id)
          .eq('trigger_event', event.type)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.warn('Rules query (trigger_event) failed, will try legacy rule_type:', error?.message || error)
        } else {
          rules = data
        }
      }
      // Fallback to legacy schema
      if (!rules || rules.length === 0) {
        const { data, error } = await this.supabase
          .from('email_automation_rules')
          .select(`
            *,
            email_templates (*)
          `)
          .eq('quiz_id', event.quiz_id)
          .eq('rule_type', event.type)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.error('Error fetching automation rules (legacy rule_type):', error)
          return
        }
        rules = data
      }

      if (!rules || rules.length === 0) {
        console.log(`No active automation rules found for ${event.type} on quiz ${event.quiz_id}`)
        return
      }

      // Process each rule (double-check type in case of broader query)
  for (const rule of rules) {
        try {
          await this.processRule(rule, event)
        } catch (error) {
          console.error(`Error processing rule ${rule.id}:`, error)
          // Continue with other rules even if one fails
        }
      }

    } catch (error) {
      console.error('Email trigger error:', error)
    }
  }

  private async processRule(rule: any, event: EmailTriggerEvent): Promise<void> {
    // Best-effort enrichment: if user_email is missing but we have session_id, fetch from quiz_sessions
    let enrichedEmail = event.user_email
    let enrichedName = event.user_name
    const sessionId = event.metadata?.session_id
  if ((!enrichedEmail || enrichedEmail.trim() === '') && sessionId) {
      try {
        const { data: sessionRow } = await this.supabase
          .from('quiz_sessions')
          .select('*')
          .eq('id', sessionId)
          .maybeSingle()
        if (sessionRow) {
          enrichedEmail = (sessionRow as any).user_email || (sessionRow as any).email || enrichedEmail
          enrichedName = (sessionRow as any).user_name || (sessionRow as any).name || enrichedName
          console.log('Enrichment from session', sessionId, {
            user_email: (sessionRow as any).user_email,
            email: (sessionRow as any).email,
            user_name: (sessionRow as any).user_name,
            name: (sessionRow as any).name
          })

          // Fallback via linked lead
          if ((!enrichedEmail || enrichedEmail.trim() === '') && (sessionRow as any).lead_id) {
            try {
              const { data: leadRow } = await this.supabase
                .from('leads')
                .select('email, name')
                .eq('id', (sessionRow as any).lead_id)
                .maybeSingle()
              if (leadRow) {
                enrichedEmail = (leadRow as any).email || enrichedEmail
                enrichedName = (leadRow as any).name || enrichedName
                console.log('Enrichment from leads via session.lead_id', (sessionRow as any).lead_id, leadRow)
              }
            } catch (e) {
              console.warn('Failed to enrich from leads via session.lead_id:', e)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to enrich user email/name from session:', e)
      }

      // Secondary fallback chain: quiz_leads by session_id -> recent leads -> recent quiz_leads
      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: ql } = await this.supabase
            .from('quiz_leads')
            .select('email') // legacy schema may not have name column
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (ql) {
            enrichedEmail = (ql as any).email || enrichedEmail
            // name may not exist on legacy schema; keep existing enrichedName
            console.log('Enrichment from quiz_leads by session', sessionId, ql)
          }
        } catch (e) {
          console.warn('Failed to enrich from quiz_leads by session:', e)
        }
      }

      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: lead } = await this.supabase
            .from('leads')
            .select('email, name')
            .eq('quiz_id', event.quiz_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (lead) {
            enrichedEmail = (lead as any).email || enrichedEmail
            enrichedName = (lead as any).name || enrichedName
            console.log('Enrichment from leads recent', lead)
          }
        } catch (e) {
          console.warn('Failed to enrich from leads recent:', e)
        }
      }

      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: qlRecent } = await this.supabase
            .from('quiz_leads')
            .select('email') // legacy schema may not have name column
            .eq('quiz_id', event.quiz_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (qlRecent) {
            enrichedEmail = (qlRecent as any).email || enrichedEmail
            console.log('Enrichment from quiz_leads recent', qlRecent)
          }
        } catch (e) {
          console.warn('Failed to enrich from quiz_leads recent:', e)
        }
      }
    }

    // Check if conditions are met
  if (!this.evaluateConditions(rule.conditions || rule.trigger_conditions, event)) {
      console.log(`Conditions not met for rule ${rule.id}`)
      return
    }

    // Check send limits
  if (await this.hasReachedSendLimit(rule, { ...event, user_email: enrichedEmail || event.user_email })) {
      console.log(`Send limit reached for rule ${rule.id}`)
      return
    }

    // Calculate schedule time. If recipient not yet known, add a small buffer to allow lead capture/backfill.
    const scheduledAt = new Date()
    if (rule.delay_minutes > 0) {
      scheduledAt.setMinutes(scheduledAt.getMinutes() + rule.delay_minutes)
    }
    const willNeedBackfill = !enrichedEmail && !event.user_email
    if (willNeedBackfill) {
      scheduledAt.setMinutes(scheduledAt.getMinutes() + 5) // +5 minutes buffer
    }

    // Prepare email variables
    console.log('Before prepareVariables - event:', JSON.stringify({ ...event, user_email: enrichedEmail || event.user_email, user_name: enrichedName || event.user_name }, null, 2))
  const variables = this.prepareVariables({ ...event, user_email: enrichedEmail || event.user_email, user_name: enrichedName || event.user_name }, rule)
    console.log('After prepareVariables - variables:', variables)

  // Queue the email (only include columns guaranteed by current schema)
  const { error: queueError } = await this.supabase
      .from('email_queue')
      .insert({
        session_id: event.metadata?.session_id || null,
        template_id: rule.email_template_id,
        automation_rule_id: rule.id,
    recipient_email: enrichedEmail || event.user_email,
    recipient_name: enrichedName || event.user_name,
        subject: this.processTemplate(rule.email_templates.subject_template, variables),
        body_html: this.processTemplate(rule.email_templates.body_html || rule.email_templates.body_markdown, variables),
        body_markdown: rule.email_templates.body_markdown,
        variables_used: variables,
        scheduled_at: scheduledAt.toISOString(),
        status: 'pending'
      })

    if (queueError) {
      console.error('Error queuing email:', queueError)
      throw queueError
    }

    console.log(`Email queued for rule ${rule.id}, scheduled for ${scheduledAt.toISOString()}`)
  }

  private evaluateConditions(conditions: Record<string, any>, event: EmailTriggerEvent): boolean {
    if (!conditions || Object.keys(conditions).length === 0) {
      return true // No conditions = always match
    }

    // Evaluate quiz result conditions
    if (conditions.min_percentage && event.quiz_result) {
      if (event.quiz_result.percentage < conditions.min_percentage) {
        return false
      }
    }

    if (conditions.max_percentage && event.quiz_result) {
      if (event.quiz_result.percentage > conditions.max_percentage) {
        return false
      }
    }

    // Evaluate product conditions
    if (conditions.requires_product_id && !event.product_id) {
      return false
    }

    if (conditions.specific_product_ids) {
      const allowedProducts = conditions.specific_product_ids
      if (Array.isArray(allowedProducts) && event.product_id && !allowedProducts.includes(event.product_id)) {
        return false
      }
    }

    // Evaluate time-based conditions
    if (conditions.days_since_completion && event.metadata?.completion_date) {
      const daysSince = Math.floor((Date.now() - new Date(event.metadata.completion_date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince < conditions.days_since_completion) {
        return false
      }
    }

    return true
  }

  private async hasReachedSendLimit(rule: any, event: EmailTriggerEvent): Promise<boolean> {
    if (!rule.max_sends || rule.max_sends <= 0) {
      return false // No limit
    }

    // Count previous sends for this rule and recipient
    const { count, error } = await this.supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('automation_rule_id', rule.id)
      .eq('recipient_email', event.user_email)
      .in('status', ['pending', 'processing', 'sent'])

    if (error) {
      console.error('Error checking send limit:', error)
      return true // Assume limit reached on error to be safe
    }

    return (count || 0) >= rule.max_sends
  }

  private prepareVariables(event: EmailTriggerEvent, rule: any): Record<string, any> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quizapp.hu'
    
    const variables: Record<string, any> = {
      user_name: event.user_name || 'Értékes Ügyfél',
      user_email: event.user_email,
  quiz_id: event.quiz_id,
      quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
      support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
      company_name: 'Quiz Platform',
      quiz_title: 'ADHD Gyorsteszt', // Default quiz title
      percentage: '0',
      score: '0',
      category: 'Alapszintű',
      // URL variables
      result_url: `${baseUrl}/results?session=${event.metadata?.session_id || ''}`,
      booking_url: `${baseUrl}/booking?quiz=${event.quiz_id}`,
  download_url: `${baseUrl}/downloads?quiz=${event.quiz_id}&result=${event.metadata?.session_id || ''}`,
  unsubscribe_url: `${baseUrl}/unsubscribe`
    }

    // Add quiz result data
    console.log('PrepareVariables - event.quiz_result:', JSON.stringify(event.quiz_result, null, 2))
    if (event.quiz_result) {
      console.log('PrepareVariables - processing quiz_result data')
      variables.quiz_result_percentage = event.quiz_result.percentage.toString()
      variables.percentage = event.quiz_result.percentage.toString()
      // Calculate actual score from percentage (assuming max score is based on number of questions)
      const maxScore = 20 // Assuming 20 questions max
      const actualScore = Math.round((event.quiz_result.percentage / 100) * maxScore)
      variables.score = actualScore.toString()
      variables.quiz_result_text = event.quiz_result.text
      variables.category = event.quiz_result.text || 'Alapszintű'
      if (event.quiz_result.ai_result) {
        variables.ai_result = event.quiz_result.ai_result
      }
      console.log('PrepareVariables - Final variables:', {
        percentage: variables.percentage,
        score: variables.score, 
        category: variables.category
      })
    } else {
      console.log('PrepareVariables - no quiz_result data found')
    }

    // Add order/product data
    if (event.order_id) {
      variables.order_id = event.order_id
    }

    if (event.product_id) {
      variables.product_id = event.product_id
      // TODO: Fetch product details from database
    }

    // Add metadata
    if (event.metadata) {
      Object.entries(event.metadata).forEach(([key, value]) => {
        variables[key] = value
      })
    }

    return variables
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template
    
    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      const stringValue = String(value || '')
      processed = processed.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), stringValue)
    })
    
    return processed
  }

  // Helper method to trigger quiz completion emails
  async triggerQuizCompletion(quizId: string, userEmail: string, quizResult: any, userName?: string, sessionId?: string): Promise<void> {
    await this.triggerEmails({
      type: 'quiz_complete',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      quiz_result: quizResult,
      metadata: sessionId ? { session_id: sessionId } : undefined
    })
  }

  // Helper method to trigger purchase confirmation emails
  async triggerPurchaseConfirmation(quizId: string, userEmail: string, productId: string, orderId: string, userName?: string): Promise<void> {
    await this.triggerEmails({
      type: 'purchase',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      product_id: productId,
      order_id: orderId
    })
  }

  // Helper method to trigger reminder emails
  async triggerReminder(quizId: string, userEmail: string, metadata?: Record<string, any>, userName?: string): Promise<void> {
    await this.triggerEmails({
      type: 'no_purchase_reminder',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      metadata: metadata
    })
  }
}

// Singleton instance for use across the app
export const emailTrigger = new EmailAutomationTrigger()
