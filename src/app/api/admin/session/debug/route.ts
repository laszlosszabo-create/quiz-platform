import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

const schema = z.object({ session_id: z.string().uuid() })

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const session_id = searchParams.get('session_id')
    const parsed = schema.parse({ session_id })
    const supabase = getSupabaseAdmin()

    const { data: session, error: sErr } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', parsed.session_id)
      .maybeSingle()

    const { data: leadsBySession } = await supabase
      .from('quiz_leads')
      .select('*')
      .eq('session_id', parsed.session_id)
      .order('created_at', { ascending: true })

    let quizId: string | null = null
    if (session?.quiz_id) quizId = session.quiz_id
    let latestQuizLead: any = null
    if (quizId) {
      const { data: latest } = await supabase
        .from('quiz_leads')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false })
        .limit(1)
      latestQuizLead = latest?.[0] || null
    }

    return NextResponse.json({
      session_id: parsed.session_id,
      session,
      leads_by_session: leadsBySession || [],
      latest_quiz_lead: latestQuizLead,
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_parameters', details: e.errors }, { status: 400 })
    }
    console.error('Session debug error:', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
