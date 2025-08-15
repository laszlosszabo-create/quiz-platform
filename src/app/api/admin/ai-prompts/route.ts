import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getAdminUser } from '@/lib/admin-auth'
import { createAuditLog } from '@/lib/audit-log'
import { aiPromptCreateSchema, aiPromptUpdateSchema, aiPromptDeleteSchema } from '@/lib/zod-schemas'

export async function GET(request: NextRequest) {
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quiz_id')
  const lang = searchParams.get('lang')
  if (!quizId) return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })

  let q = supabaseAdmin.from('quiz_ai_prompts').select('*').eq('quiz_id', quizId)
  if (lang) q = q.eq('lang', lang)
  const { data, error } = await q.order('lang')
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ success: true, data: data || [] })
}

export async function POST(request: NextRequest) {
  const adminUser = await getAdminUser()
  if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = aiPromptCreateSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.errors }, { status: 400 })
  const { quiz_id, lang, system_prompt, user_prompt, ai_provider, ai_model } = parsed.data

  const { data: exists } = await supabaseAdmin.from('quiz_ai_prompts').select('id').eq('quiz_id', quiz_id).eq('lang', lang).maybeSingle()
  if (exists) return NextResponse.json({ error: 'Prompt already exists for this language' }, { status: 409 })

  const { data, error } = await supabaseAdmin.from('quiz_ai_prompts').insert({
    quiz_id,
    lang,
    system_prompt,
    user_prompt_template: user_prompt,
    ai_provider,
    ai_model
  }).select().single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })

  try { await createAuditLog({ user_id: adminUser.id, user_email: adminUser.email, action: 'CREATE_PROMPT', resource_type: 'quiz_prompt', resource_id: data.id, details: { quiz_id, lang, ai_provider, ai_model } }) } catch {}
  return NextResponse.json({ success: true, data })
}

export async function PUT(request: NextRequest) {
  const adminUser = await getAdminUser()
  if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = aiPromptUpdateSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.errors }, { status: 400 })
  const { id, quiz_id, lang, system_prompt, user_prompt, ai_provider, ai_model } = parsed.data

  const { data: existing } = await supabaseAdmin.from('quiz_ai_prompts').select('*').eq('id', id).eq('quiz_id', quiz_id).maybeSingle()
  if (!existing) return NextResponse.json({ error: 'AI prompt not found' }, { status: 404 })

  const { data, error } = await supabaseAdmin.from('quiz_ai_prompts').update({
    system_prompt,
    user_prompt_template: user_prompt,
    ai_provider,
    ai_model,
    updated_at: new Date().toISOString()
  }).eq('id', id).eq('quiz_id', quiz_id).select().single()
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  try { await createAuditLog({ user_id: adminUser.id, user_email: adminUser.email, action: 'UPDATE_PROMPT', resource_type: 'quiz_prompt', resource_id: data.id, details: { before: existing, after: data } }) } catch {}
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  const adminUser = await getAdminUser()
  if (!adminUser || !['owner', 'editor'].includes(adminUser.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') || undefined
  const quiz_id = searchParams.get('quiz_id') || undefined
  const parsed = aiPromptDeleteSchema.safeParse({ id, quiz_id })
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.errors }, { status: 400 })

  const { data: existing } = await supabaseAdmin.from('quiz_ai_prompts').select('*').eq('id', parsed.data.id).eq('quiz_id', parsed.data.quiz_id).maybeSingle()
  if (!existing) return NextResponse.json({ error: 'AI prompt not found' }, { status: 404 })
  const { error } = await supabaseAdmin.from('quiz_ai_prompts').delete().eq('id', parsed.data.id).eq('quiz_id', parsed.data.quiz_id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  try { await createAuditLog({ user_id: adminUser.id, user_email: adminUser.email, action: 'DELETE_PROMPT', resource_type: 'quiz_prompt', resource_id: parsed.data.id, details: { deleted: existing } }) } catch {}
  return NextResponse.json({ success: true })
}
