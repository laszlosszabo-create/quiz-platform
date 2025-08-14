import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

type EventType = 
  | 'page_view'
  | 'quiz_start' 
  | 'answer_select'
  | 'quiz_complete'
  | 'email_submitted'
  | 'product_view'
  | 'checkout_start'
  | 'purchase_succeeded'
  | 'booking_view'

interface TrackingData {
  quiz_id: string
  session_id?: string
  lead_id?: string
  question_key?: string
  answer_key?: string
  product_id?: string
  order_id?: string
  metadata?: Record<string, any>
}

/**
 * Client-side event tracking utility
 */
export class EventTracker {
  private static instance: EventTracker
  private supabase: ReturnType<typeof createClient<Database>>
  
  private constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker()
    }
    return EventTracker.instance
  }
  
  /**
   * Track an event
   */
  async track(eventType: EventType, data: TrackingData): Promise<void> {
    try {
      // Try to store in audit_logs for analytics
      await this.supabase
        .from('audit_logs')
        .insert({
          action: `USER_${eventType.toUpperCase()}`,
          resource_type: 'session',
          resource_id: data.session_id || data.quiz_id,
          metadata: {
            event_type: eventType,
            ...data,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href
          }
        })
      
      // Also send to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Event tracked: ${eventType}`, data)
      }
      
    } catch (error) {
      // Silent fail - don't break user experience
      console.warn('Event tracking failed:', error)
    }
  }
  
  /**
   * Track page view
   */
  async trackPageView(quizId: string, sessionId?: string): Promise<void> {
    await this.track('page_view', { quiz_id: quizId, session_id: sessionId })
  }
  
  /**
   * Track quiz start
   */
  async trackQuizStart(quizId: string, sessionId: string): Promise<void> {
    await this.track('quiz_start', { quiz_id: quizId, session_id: sessionId })
  }
  
  /**
   * Track answer selection
   */
  async trackAnswerSelect(
    quizId: string, 
    sessionId: string, 
    questionKey: string, 
    answerKey: string
  ): Promise<void> {
    await this.track('answer_select', {
      quiz_id: quizId,
      session_id: sessionId,
      question_key: questionKey,
      answer_key: answerKey
    })
  }
  
  /**
   * Track quiz completion
   */
  async trackQuizComplete(quizId: string, sessionId: string, totalScore: number): Promise<void> {
    await this.track('quiz_complete', {
      quiz_id: quizId,
      session_id: sessionId,
      metadata: { total_score: totalScore }
    })
  }
  
  /**
   * Track email submission
   */
  async trackEmailSubmitted(quizId: string, sessionId: string, leadId: string): Promise<void> {
    await this.track('email_submitted', {
      quiz_id: quizId,
      session_id: sessionId,
      lead_id: leadId
    })
  }
  
  /**
   * Track product view
   */
  async trackProductView(quizId: string, sessionId: string, productId: string): Promise<void> {
    await this.track('product_view', {
      quiz_id: quizId,
      session_id: sessionId,
      product_id: productId
    })
  }
  
  /**
   * Track checkout start
   */
  async trackCheckoutStart(quizId: string, sessionId: string, productId: string): Promise<void> {
    await this.track('checkout_start', {
      quiz_id: quizId,
      session_id: sessionId,
      product_id: productId
    })
  }
  
  /**
   * Track purchase success
   */
  async trackPurchaseSucceeded(
    quizId: string, 
    sessionId: string, 
    orderId: string, 
    amount: number
  ): Promise<void> {
    await this.track('purchase_succeeded', {
      quiz_id: quizId,
      session_id: sessionId,
      order_id: orderId,
      metadata: { amount }
    })
  }
  
  /**
   * Track booking view
   */
  async trackBookingView(quizId: string, sessionId: string): Promise<void> {
    await this.track('booking_view', {
      quiz_id: quizId,
      session_id: sessionId
    })
  }
}

// Export singleton instance
export const tracker = EventTracker.getInstance()
