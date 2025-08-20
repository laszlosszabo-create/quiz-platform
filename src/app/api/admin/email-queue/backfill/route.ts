import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

type BackfillResult = { checked: number; restored: number; cancelled: number }

export async function POST() {
  const supabase = getSupabaseAdmin()
  const result: BackfillResult = { checked: 0, restored: 0, cancelled: 0 }

  const { data: items } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .or('recipient_email.is.null,recipient_email.eq.')
    .limit(500)

  if (!items || items.length === 0) {
    return NextResponse.json({ message: 'No items to backfill', ...result })
  }

  for (const q of items) {
    result.checked++
    let recipient: { email?: string | null; name?: string | null } = {}

    if (q.session_id) {
      const { data: sess } = await supabase.from('quiz_sessions').select('*').eq('id', q.session_id).maybeSingle()
      const email = (sess?.user_email || sess?.email || null) as string | null
      const name = (sess?.user_name || sess?.name || null) as string | null
      if (email) recipient = { email, name }
      if (!recipient.email) {
        const { data: lead } = await supabase.from('quiz_leads').select('*').eq('session_id', q.session_id).maybeSingle()
        if (lead?.email) recipient = { email: lead.email, name: lead.name || null }
      }
    }

    if (recipient.email) {
      await supabase.from('email_queue').update({ recipient_email: recipient.email, recipient_name: recipient.name || null }).eq('id', q.id)
      result.restored++
    } else {
      await supabase.from('email_queue').update({ status: 'cancelled', error_message: 'missing_recipient' }).eq('id', q.id)
      result.cancelled++
    }
  }

  return NextResponse.json({ message: 'Backfill completed', ...result })
}
