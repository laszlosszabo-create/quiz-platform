import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Event validation schemas
const baseEventSchema = z.object({
  quiz_id: z.string().uuid(),
  session_id: z.string().uuid().optional(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional()
})

const pageViewEventSchema = baseEventSchema.extend({
  event: z.literal('page_view'),
  page_type: z.enum(['landing', 'quiz', 'result']),
  referrer: z.string().optional()
})

const ctaClickEventSchema = baseEventSchema.extend({
  event: z.literal('cta_click'),
  cta_id: z.string(),
  cta_position: z.string()
})

const quizStartEventSchema = baseEventSchema.extend({
  event: z.literal('quiz_start'),
  session_id: z.string().uuid()
})

const answerSelectEventSchema = baseEventSchema.extend({
  event: z.literal('answer_select'),
  session_id: z.string().uuid(),
  question_key: z.string(),
  option_key: z.string()
})

const trackingEventSchema = z.discriminatedUnion('event', [
  pageViewEventSchema,
  ctaClickEventSchema,
  quizStartEventSchema,
  answerSelectEventSchema,
  baseEventSchema.extend({ event: z.literal('quiz_complete') }),
  baseEventSchema.extend({ event: z.literal('email_submitted') }),
  baseEventSchema.extend({ event: z.literal('product_view') }),
  baseEventSchema.extend({ event: z.literal('booking_view') }),
  baseEventSchema.extend({ event: z.literal('checkout_start') }),
  baseEventSchema.extend({ event: z.literal('purchase_succeeded') })
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedEvent = trackingEventSchema.parse(body)

    // Create tracking record in audit_logs table
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: `TRACK_${validatedEvent.event.toUpperCase()}`,
        entity: 'tracking_event',
        entity_id: validatedEvent.session_id || validatedEvent.quiz_id,
        diff: {
          event_type: validatedEvent.event,
          quiz_id: validatedEvent.quiz_id,
          session_id: validatedEvent.session_id,
          timestamp: validatedEvent.timestamp,
          metadata: {
            ...validatedEvent.metadata,
            // Add event-specific data
            ...(validatedEvent.event === 'page_view' && 'page_type' in validatedEvent && {
              page_type: validatedEvent.page_type,
              referrer: validatedEvent.referrer
            }),
            ...(validatedEvent.event === 'cta_click' && 'cta_id' in validatedEvent && {
              cta_id: validatedEvent.cta_id,
              cta_position: validatedEvent.cta_position
            }),
            ...(validatedEvent.event === 'answer_select' && 'question_key' in validatedEvent && {
              question_key: validatedEvent.question_key,
              option_key: validatedEvent.option_key
            })
          }
        }
      })

    if (error) {
      console.error('Tracking insert error:', error)
      // Don't fail the request for tracking errors
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Tracking API error:', error)
    
    if (error instanceof z.ZodError) {
      // Don't return validation errors for tracking - just log them
      console.warn('Invalid tracking data:', error.errors)
    }

    // Always return success for tracking to not break user experience
    return NextResponse.json({ success: true })
  }
}
