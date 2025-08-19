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
      const { data: rules, error } = await this.supabase
        .from('email_automation_rules')
        .select(`
          *,
          email_templates (*)
        `)
        .eq('quiz_id', event.quiz_id)
        .eq('trigger_event', event.type)
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) {
        console.error('Error fetching automation rules:', error)
        return
      }

      if (!rules || rules.length === 0) {
        console.log(`No active automation rules found for ${event.type} on quiz ${event.quiz_id}`)
        return
      }

      // Process each rule
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
    // Check if conditions are met
    if (!this.evaluateConditions(rule.conditions, event)) {
      console.log(`Conditions not met for rule ${rule.id}`)
      return
    }

    // Check send limits
    if (await this.hasReachedSendLimit(rule, event)) {
      console.log(`Send limit reached for rule ${rule.id}`)
      return
    }

    // Calculate schedule time
    const scheduledAt = new Date()
    if (rule.delay_minutes > 0) {
      scheduledAt.setMinutes(scheduledAt.getMinutes() + rule.delay_minutes)
    }

    // Prepare email variables
    const variables = this.prepareVariables(event, rule)

    // Queue the email
    const { error: queueError } = await this.supabase
      .from('email_queue')
      .insert({
        quiz_id: event.quiz_id,
        product_id: event.product_id,
        template_id: rule.template_id,
        automation_rule_id: rule.id,
        recipient_email: event.user_email,
        variables: variables,
        scheduled_at: scheduledAt.toISOString(),
        priority: rule.priority,
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
    const variables: Record<string, any> = {
      user_name: event.user_name || 'Értékes Ügyfél',
      user_email: event.user_email,
      quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
      support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
      company_name: 'Quiz Platform'
    }

    // Add quiz result data
    if (event.quiz_result) {
      variables.quiz_result_percentage = event.quiz_result.percentage.toString()
      variables.quiz_result_text = event.quiz_result.text
      if (event.quiz_result.ai_result) {
        variables.ai_result = event.quiz_result.ai_result
      }
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

  // Helper method to trigger quiz completion emails
  async triggerQuizCompletion(quizId: string, userEmail: string, quizResult: any, userName?: string): Promise<void> {
    await this.triggerEmails({
      type: 'quiz_complete',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      quiz_result: quizResult
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
