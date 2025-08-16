import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { getAdminUser } from '@/lib/admin-auth'
import { createAuditLog } from '@/lib/audit-log'
import { aiPromptCreateSchema, aiPromptUpdateSchema, aiPromptDeleteSchema } from '@/lib/zod-schemas'

// AI Prompts CRUD API (quiz_ai_prompts table - canonical single ai_prompt column)
export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser()
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    let { data: prompts, error } = await supabase
      .from('quiz_ai_prompts')
      .select('*')
      .eq('quiz_id', quizId)
      .order('lang')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch AI prompts', code: (error as any)?.code, details: (error as any)?.message },
        { status: 500 }
      )
    }

    // UI alias: expose user_prompt_template mapped from ai_prompt
    const mapped = (prompts || []).map((row: any) => ({
      ...row,
      user_prompt_template: row.ai_prompt,
    }))

    return NextResponse.json({ success: true, data: mapped })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    
    const adminUser = await getAdminUser()
    if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) {
      return NextResponse.json({ error: 'Unauthorized - requires owner or editor role' }, { status: 401 })
    }

    const body = await request.json()
    const normalizedBody = {
      ...body,
      ai_prompt: body?.ai_prompt || body?.user_prompt || body?.user_prompt_template,
    }
    
    // Zod validation
    const validationResult = aiPromptCreateSchema.safeParse(normalizedBody)
    if (!validationResult.success) {
      console.warn('[AI-PROMPTS][POST] validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { quiz_id, lang, ai_prompt } = validationResult.data
    const supabase = getSupabaseAdmin()

    // Check if prompt already exists for this quiz/lang
    const { data: existingPrompt } = await supabase
      .from('quiz_ai_prompts')
      .select('id')
      .eq('quiz_id', quiz_id)
      .eq('lang', lang)
      .maybeSingle()

    if (existingPrompt) {
      return NextResponse.json(
        { error: 'AI prompt already exists for this language. Use PUT to update.' },
        { status: 409 }
      )
    }

    // Insert canonical row - mirroring the successful direct insert
    console.log('[AI-PROMPTS][POST] Attempting insert for:', { quiz_id, lang })
    const { data: prompt, error } = await supabase
      .from('quiz_ai_prompts')
      .insert({ quiz_id, lang, ai_prompt, fallback_results: [] })
      .select()
      .maybeSingle()

    if (error) {
      console.error('[AI-PROMPTS][POST] Database error:', error)
      const code = (error as any)?.code
      const details = (error as any)?.details || (error as any)?.message || String(error)
      const hint = (error as any)?.hint
      const message = (error as any)?.message
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      
      if (code === '23505' || /duplicate key/i.test(details)) {
        const body: any = { error: 'AI prompt already exists for this language. Use PUT to update.' }
        if (debug) Object.assign(body, { code, details, hint, message, raw })
        return NextResponse.json(body, { status: 409 })
      }
      
      const body: any = { error: 'Failed to create AI prompt' }
      if (debug) Object.assign(body, { code, details, hint, message, raw })
      return NextResponse.json(body, { status: 500 })
    }

    // Deterministic return: if maybeSingle() returned null, fetch by (quiz_id, lang)
    let finalPrompt = prompt
    if (!finalPrompt) {
      console.log('[AI-PROMPTS][POST] No data from insert, refetching...')
      const refetch = await supabase
        .from('quiz_ai_prompts')
        .select('*')
        .eq('quiz_id', quiz_id)
        .eq('lang', lang)
        .maybeSingle()
      if (refetch.error) {
        const code = (refetch.error as any)?.code
        const details = (refetch.error as any)?.details || (refetch.error as any)?.message || String(refetch.error)
        const hint = (refetch.error as any)?.hint
        const message = (refetch.error as any)?.message
        let raw: string | undefined
        try { raw = JSON.stringify(refetch.error) } catch {}
        const body: any = { error: 'Failed to load created AI prompt' }
        if (debug) Object.assign(body, { code, details, hint, message, raw })
        return NextResponse.json(body, { status: 500 })
      }
      finalPrompt = refetch.data as any
    }

    console.log('[AI-PROMPTS][POST] Insert successful, ID:', (finalPrompt as any)?.id)

    // Audit log
    try {
      await createAuditLog({
        user_id: adminUser.id,
        user_email: adminUser.email,
        action: 'CREATE_PROMPT',
        resource_type: 'quiz_prompt',
        resource_id: (finalPrompt as any).id,
        details: { quiz_id, lang }
      })
    } catch (logErr) {
      console.error('[AI-PROMPTS][POST] Audit log error:', logErr)
    }

    return NextResponse.json({
      success: true,
      data: finalPrompt
    })
  } catch (error) {
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    console.error('[AI-PROMPTS][POST] API error:', error)
    const body: any = { error: 'Internal server error' }
    if (debug) {
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      Object.assign(body, { raw })
    }
    return NextResponse.json(body, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    const adminUser = await getAdminUser()
    if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) {
      return NextResponse.json({ error: 'Unauthorized - requires owner or editor role' }, { status: 401 })
    }

    const body = await request.json()
    const normalizedBody = {
      ...body,
      ai_prompt: body?.ai_prompt || body?.user_prompt || body?.user_prompt_template,
    }
    
    // Zod validation
    const validationResult = aiPromptUpdateSchema.safeParse(normalizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { id, quiz_id, lang, ai_prompt } = validationResult.data
    const supabase = getSupabaseAdmin()

    // Fetch existing for audit diff
    let existing: any = null
    if (id) {
      const ex = await supabase
        .from('quiz_ai_prompts')
        .select('*')
        .eq('id', id)
        .eq('quiz_id', quiz_id)
        .maybeSingle()
      existing = ex.data || null
    } else {
      const ex = await supabase
        .from('quiz_ai_prompts')
        .select('*')
        .eq('quiz_id', quiz_id)
        .eq('lang', lang)
        .maybeSingle()
      existing = ex.data || null
    }

    if (!existing) {
      return NextResponse.json(
        { error: 'AI prompt not found' },
        { status: 404 }
      )
    }

    let updateBuilder = supabase
      .from('quiz_ai_prompts')
      .update({ ai_prompt, updated_at: new Date().toISOString() })
    if (id) {
      updateBuilder = updateBuilder.eq('id', id).eq('quiz_id', quiz_id)
    } else {
      updateBuilder = updateBuilder.eq('quiz_id', quiz_id).eq('lang', lang)
    }
    const { data: prompt, error } = await updateBuilder.select().single()

    if (error) {
      console.error('Database error:', error)
      const code = (error as any)?.code
      const details = (error as any)?.details || (error as any)?.message || String(error)
      const hint = (error as any)?.hint
      const message = (error as any)?.message
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      const body: any = { error: 'Failed to update AI prompt' }
      if (debug) Object.assign(body, { code, details, hint, message, raw })
      return NextResponse.json(body, { status: 500 })
    }

    // Audit log with diff
    try {
      await createAuditLog({
        user_id: adminUser.id,
        user_email: adminUser.email,
        action: 'UPDATE_PROMPT',
        resource_type: 'quiz_prompt',
        resource_id: prompt.id,
        details: {
          before: existing ? { ai_prompt: existing.ai_prompt } : null,
          after: { ai_prompt: prompt.ai_prompt }
        }
      })
    } catch (logErr) {
      console.error('Audit log error:', logErr)
    }

    return NextResponse.json({
      success: true,
      data: prompt
    })
  } catch (error) {
    console.error('API error:', error)
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    const body: any = { error: 'Internal server error' }
    if (debug) {
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      Object.assign(body, { raw })
    }
    return NextResponse.json(body, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    const adminUser = await getAdminUser()
    if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) {
      return NextResponse.json({ error: 'Unauthorized - requires owner or editor role' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const quiz_id = searchParams.get('quiz_id')

    // Zod validation for delete
    const validationResult = aiPromptDeleteSchema.safeParse({ id, quiz_id })
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data
    const supabase = getSupabaseAdmin()

    // Fetch existing for audit log
    const { data: existing } = await supabase
      .from('quiz_ai_prompts')
      .select('*')
      .eq('id', validatedData.id)
      .eq('quiz_id', validatedData.quiz_id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json(
        { error: 'AI prompt not found' },
        { status: 404 }
      )
    }

    let { error } = await supabase
      .from('quiz_ai_prompts')
      .delete()
      .eq('id', validatedData.id)
      .eq('quiz_id', validatedData.quiz_id)

    if (error) {
      console.error('Database error:', error)
      const code = (error as any)?.code
      const details = (error as any)?.details || (error as any)?.message || String(error)
      const hint = (error as any)?.hint
      const message = (error as any)?.message
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      const body: any = { error: 'Failed to delete AI prompt' }
      if (debug) Object.assign(body, { code, details, hint, message, raw })
      return NextResponse.json(body, { status: 500 })
    }

    // Audit log
    try {
      await createAuditLog({
        user_id: adminUser.id,
        user_email: adminUser.email,
        action: 'DELETE_PROMPT',
        resource_type: 'quiz_prompt',
        resource_id: validatedData.id,
        details: {
          deleted: existing ? {
            id: existing.id,
            quiz_id: existing.quiz_id,
            lang: existing.lang,
            ai_prompt: existing.ai_prompt,
          } : null
        }
      })
    } catch (logErr) {
      console.error('Audit log error:', logErr)
    }

    return NextResponse.json({
      success: true,
      message: 'AI prompt deleted successfully'
    })
  } catch (error) {
    console.error('API error:', error)
    const dbgHeader = request.headers.get('x-debug') || ''
    const debug = /^(true|1)$/i.test(dbgHeader)
    const body: any = { error: 'Internal server error' }
    if (debug) {
      let raw: string | undefined
      try { raw = JSON.stringify(error) } catch {}
      Object.assign(body, { raw })
    }
    return NextResponse.json(body, { status: 500 })
  }
}
