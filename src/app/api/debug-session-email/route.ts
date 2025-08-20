import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    // Try canonical linkage via session.lead_id
    let lead: any = null
    let leadError: any = null
    {
      const { data: sessionLead } = await supabase
        .from('quiz_sessions')
        .select('lead_id')
        .eq('id', sessionId)
        .maybeSingle()
      if (sessionLead?.lead_id) {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .eq('id', sessionLead.lead_id)
          .maybeSingle()
        if (data) lead = data
      }
    }
    if (!lead) {
      const { data: legacyLead, error } = await supabase
        .from('quiz_leads')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (legacyLead) lead = legacyLead
      if (error) leadError = error
    }

    return NextResponse.json({ session, sessionError, lead, leadError })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
