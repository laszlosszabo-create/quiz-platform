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

    // Get email queue items
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

    // Execute query with a larger initial range to filter by quiz_id
    const { data: queueItemsRaw, error } = await query
      .order('created_at', { ascending: false })
      .limit(500) // Get more to filter by quiz

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email queue' },
        { status: 500 }
      )
    }

    // Filter by quiz_id on the application side (based on joined template)
    const filteredItems = (queueItemsRaw || []).filter((item: any) => 
      item.email_templates?.quiz_id === validatedData.quiz_id ||
      item.quiz_id === validatedData.quiz_id // Direct quiz_id if available
    )

    // Apply ordering
    let queueItems = filteredItems
    if (order === 'updated_desc') {
      queueItems = queueItems.sort((a: any, b: any) => 
        new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
      )
    } else {
      queueItems = queueItems.sort((a: any, b: any) => 
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      )
    }

    // Apply pagination
    const paginatedItems = queueItems.slice(validatedData.offset, validatedData.offset + validatedData.limit)

    return NextResponse.json({ 
      queueItems: paginatedItems,
      pagination: {
        total: queueItems.length,
        limit: validatedData.limit,
        offset: validatedData.offset,
        hasMore: queueItems.length > validatedData.offset + validatedData.limit
      }
    })

  } catch (error) {
    console.error('Email queue GET error:', error)
    
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
