import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Validation schemas
const getQueueSchema = z.object({
  quiz_id: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'sent', 'failed', 'cancelled']).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0)
})

const updateQueueItemSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'sent', 'failed', 'cancelled']),
  error_message: z.string().optional(),
  sent_at: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    if (!quizId) {
      return NextResponse.json(
        { error: 'quiz_id parameter is required' },
        { status: 400 }
      )
    }

    const validatedData = getQueueSchema.parse({ 
      quiz_id: quizId,
      status: status || undefined,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    })

    const supabase = getSupabaseAdmin()

    // Get email queue items with related data
    let query = supabase
      .from('email_queue')
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type,
          subject_template
        ),
        email_automation_rules (
          id,
          rule_name,
          trigger_event
        )
      `)
      .eq('quiz_id', validatedData.quiz_id)

    if (validatedData.status) {
      query = query.eq('status', validatedData.status)
    }

    const { data: queueItems, error } = await query
      .order('scheduled_at', { ascending: true })
      .range(validatedData.offset, validatedData.offset + validatedData.limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email queue' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', validatedData.quiz_id)

    if (countError) {
      console.error('Count error:', countError)
    }

    return NextResponse.json({ 
      queueItems,
      pagination: {
        total: count || 0,
        limit: validatedData.limit,
        offset: validatedData.offset,
        hasMore: (count || 0) > validatedData.offset + validatedData.limit
      }
    })

  } catch (error) {
    console.error('Email queue API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateQueueItemSchema.parse(body)

    const supabase = getSupabaseAdmin()

    const updateData: any = {
      status: validatedData.status,
      updated_at: new Date().toISOString()
    }

    if (validatedData.error_message) {
      updateData.error_message = validatedData.error_message
    }

    if (validatedData.sent_at) {
      updateData.sent_at = validatedData.sent_at
    }

    const { data, error } = await supabase
      .from('email_queue')
      .update(updateData)
      .eq('id', validatedData.id)
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type,
          subject_template
        ),
        email_automation_rules (
          id,
          rule_name,
          trigger_event
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update queue item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ queueItem: data })

  } catch (error) {
    console.error('Email queue update error:', error)
    
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queueItemId = searchParams.get('id')

    if (!queueItemId) {
      return NextResponse.json(
        { error: 'Queue item ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Only allow canceling pending items
    const { data, error } = await supabase
      .from('email_queue')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', queueItemId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to cancel queue item' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Queue item not found or cannot be cancelled' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, queueItem: data })

  } catch (error) {
    console.error('Email queue cancellation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
