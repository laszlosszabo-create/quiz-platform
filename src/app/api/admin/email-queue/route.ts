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
  const order = searchParams.get('order') // optional: 'updated_desc'

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

    // Get email queue items; filter by quiz via template relation because email_queue may not have quiz_id
    let query = supabase
      .from('email_queue')
      .select(`
        *,
        email_templates (
          id,
          quiz_id,
          template_name,
          template_type,
          subject_template
        ),
        email_automation_rules (
          id,
          rule_name,
          rule_type
        )
      `)

    if (validatedData.status) {
      query = query.eq('status', validatedData.status)
    }

    // Execute query
    // Ordering: default by scheduled_at asc; optional recent ordering by updated_at desc
    if (order === 'updated_desc') {
      query = query.order('updated_at', { ascending: false, nullsFirst: false }).order('scheduled_at', { ascending: false })
    } else {
      query = query.order('scheduled_at', { ascending: true })
    }

    const { data: queueItemsRaw, error } = await query
      .range(validatedData.offset, validatedData.offset + validatedData.limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email queue' },
        { status: 500 }
      )
    }

    // Filter by quiz_id on the application side (based on joined template)
    const queueItems = (queueItemsRaw || []).filter((item: any) => item.email_templates?.quiz_id === validatedData.quiz_id)

    // Count total by re-querying head count and then filtering is not possible; compute from unpaginated count would be expensive.
    // For now, approximate total as filtered length within the current page window.
    const total = queueItems.length + (validatedData.offset || 0)

    return NextResponse.json({ 
      queueItems,
      pagination: {
        total,
        limit: validatedData.limit,
        offset: validatedData.offset,
        hasMore: queueItemsRaw ? queueItemsRaw.length === validatedData.limit : false
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
      status: validatedData.status
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
          rule_type
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
    status: 'cancelled'
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
