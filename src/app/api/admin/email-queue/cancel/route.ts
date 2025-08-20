import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

const cancelSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  reason: z.string().min(1).default('cancelled_by_admin')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { ids, reason } = cancelSchema.parse(body)

    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('email_queue')
      .update({ status: 'cancelled', error_message: reason })
      .in('id', ids)
      .eq('status', 'pending')
      .select('id, status, error_message')

    if (error) {
      console.error('Cancel queue items error:', error)
      return NextResponse.json({ error: 'Failed to cancel queue items' }, { status: 500 })
    }

    return NextResponse.json({ cancelled: data?.length || 0, items: data })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 })
    }
    console.error('Cancel API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
