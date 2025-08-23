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

    const { data, error } = await supabase
      .from('email_queue')
      .select(`*, email_templates ( id, template_name, template_type, subject_template, quiz_id ), email_automation_rules ( id, rule_type, rule_name )`)
      .eq('session_id', parsed.session_id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('by-session email queue fetch error:', error)
      return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
    }

    return NextResponse.json({ session_id: parsed.session_id, items: data || [], count: data?.length || 0 })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_parameters', details: e.errors }, { status: 400 })
    }
    console.error('by-session endpoint error:', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
