import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { emailTrigger } from '@/lib/email-automation'

// This endpoint safely re-triggers quiz completion emails for historical failed queue items
// Strategy:
// 1. Find failed queue rows for given quiz where template/rule type is quiz_complete (by rule join) OR subject contains markers
// 2. Pull distinct session_ids from variables or session_id column
// 3. For each session, re-fetch session + compute minimal score-only snapshot if needed and call emailTrigger.triggerQuizCompletion
// 4. Do NOT mutate old failed rows; new pending rows will be inserted with fresh variables
// 5. Rate limit the batch via ?limit= (default 20)

const retriggerSchema = z.object({
  quiz_id: z.string().uuid(),
  limit: z.number().min(1).max(200).default(20),
  dry_run: z.boolean().optional().default(false),
  include_sent: z.boolean().optional().default(false)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = retriggerSchema.parse(body)
    const supabase = getSupabaseAdmin()

    // Fetch failed (or optionally sent) quiz-related queue items for this quiz
    const { data: rows, error } = await supabase
      .from('email_queue')
      .select(`id,status,template_id,session_id,variables_used,created_at,updated_at, error_message,
        email_templates(id,quiz_id,template_name,template_type,subject_template),
        email_automation_rules(id,rule_type,rule_name)`)
      .in('status', parsed.include_sent ? ['failed','sent'] : ['failed'])
      .order('created_at', { ascending: true })
      .limit(400)

    if (error) {
      console.error('Retrigger fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch queue items' }, { status: 500 })
    }

    // Filter to this quiz id
  const filtered = (rows||[]).filter(r => (r as any).email_templates?.quiz_id === parsed.quiz_id)
    // Take distinct session ids (prefer explicit column, fallback to variables_used.session_id)
    const sessionIds: string[] = []
    for (const r of filtered) {
      const sid = r.session_id || (r.variables_used as any)?.session_id
      if (sid && !sessionIds.includes(sid)) sessionIds.push(sid)
      if (sessionIds.length >= parsed.limit) break
    }

    if (sessionIds.length === 0) {
      return NextResponse.json({ message: 'No sessions to retrigger', checked: filtered.length, sessions: [] })
    }

    const processed: any[] = []
    for (const sid of sessionIds) {
      const { data: session } = await supabase.from('quiz_sessions').select('*').eq('id', sid).maybeSingle()
      if (!session) {
        processed.push({ session_id: sid, status: 'skipped', reason: 'session_missing' })
        continue
      }
      // Build minimal quizResult from existing snapshot or answers/scores
      let percentage = 0
      let text = 'Eredmény'
      let ai_result: string | undefined = undefined
      try {
        const snap = session.result_snapshot as any
        if (snap?.percentage) percentage = snap.percentage
        if (snap?.text) text = snap.text
        if (snap?.ai_result) ai_result = snap.ai_result
      } catch {}
      if (!percentage || !text) {
        // derive quick percentage
        const answers = (session.answers as Record<string,any>)||{}
        const scores = (session.scores as Record<string,any>)||{}
        const totalScore = Object.values(scores).reduce((s:number,v:any)=> s+(Number(v)||0),0)
        const maxPossible = Math.max(1,Object.keys(answers).length*5)
        percentage = Math.round((totalScore/maxPossible)*100)
        if (percentage > 60) text = 'Magas'; else if (percentage > 30) text = 'Közepes'; else text = 'Alacsony'
      }
      // Ensure ai_result is HTML-ish
      if (!ai_result) {
        ai_result = `<h3>Eredmény összefoglaló</h3><p>Kategória: ${text} (${percentage}%).</p>`
      }

      if (parsed.dry_run) {
        processed.push({ session_id: sid, status: 'dry_run' })
        continue
      }

      try {
        await emailTrigger.triggerQuizCompletion(parsed.quiz_id, session.user_email || (session as any).email || '', { percentage, text, ai_result }, session.user_name || (session as any).name || 'Felhasználó', sid)
        processed.push({ session_id: sid, status: 'queued' })
      } catch (e:any) {
        processed.push({ session_id: sid, status: 'error', error: e?.message || 'trigger_failed' })
      }
    }

    return NextResponse.json({ message: 'Retrigger complete', sessions: processed, total_sessions: processed.length, quiz_id: parsed.quiz_id, dry_run: parsed.dry_run })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }
    console.error('Retrigger endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
