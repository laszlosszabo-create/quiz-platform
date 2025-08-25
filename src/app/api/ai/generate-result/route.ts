// Phase 4: Add product result support + force_real + sanitization.
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { emailTrigger } from '@/lib/email-automation'
import { createAuditLog } from '@/lib/audit-log'
import OpenAI from 'openai'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window as any
const DOMPurify = createDOMPurify(window)
function sanitizeAI(html: string) {
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1','h2','h3','h4','p','div','span','strong','em','ul','ol','li','pre','code','br','hr','table','thead','tbody','tr','td','th'],
      ALLOWED_ATTR: ['class','style']
    })
  } catch { return html }
}

const baseSchema = z.object({
  session_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  lang: z.string().min(2).max(5),
  force: z.boolean().optional(),
  mock: z.boolean().optional(),
  skip_email: z.boolean().optional(),
  result_type: z.enum(['quiz','product']).optional().default('quiz'),
  product_id: z.string().uuid().optional(),
  force_real: z.boolean().optional() // overrides env MOCK_AI when true
}).superRefine((d, ctx) => {
  if (d.result_type === 'product' && !d.product_id) {
    ctx.addIssue({ code:'custom', path:['product_id'], message:'product_id required for product result_type' })
  }
})

const OPENAI_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini'
const QUIZ_AI_TIMEOUT_MS = parseInt(process.env.QUIZ_AI_TIMEOUT_MS || '20000', 10)
const PRODUCT_AI_TIMEOUT_MS = parseInt(process.env.PRODUCT_AI_TIMEOUT_MS || '22000', 10)

export async function POST(req: NextRequest) {
  const started = Date.now()
  let parsed: z.infer<typeof baseSchema>
  try { parsed = baseSchema.parse(await req.json()) } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error:'invalid_request', issues:e.errors }, { status:400 })
    return NextResponse.json({ error:'bad_json' }, { status:400 })
  }

  let supabase: any
  try { supabase = getSupabaseAdmin() } catch { return NextResponse.json({ error:'backend_unavailable' }, { status:503 }) }

  // Load session
  const { data: session, error: sErr } = await supabase
    .from('quiz_sessions')
    .select('id, quiz_id, result_snapshot, answers, scores, user_email, user_name, product_ai_results')
    .eq('id', parsed.session_id)
    .eq('quiz_id', parsed.quiz_id)
    .maybeSingle()
  if (sErr || !session) return NextResponse.json({ error:'session_not_found' }, { status:404 })

  if (parsed.result_type === 'product') {
    return handleProductResult({ supabase, parsed, session, started })
  }
  return handleQuizResult({ supabase, parsed, session, started })
}

async function handleQuizResult(ctx: { supabase:any, parsed: any, session:any, started:number }) {
  const { supabase, parsed, session, started } = ctx
  const snapshot = session.result_snapshot || {}
  if (snapshot.ai_result && !parsed.force) {
    return NextResponse.json({ ai_result: snapshot.ai_result, cached:true })
  }
  const answers = session.answers || {}
  const scoresRaw = session.scores || {}
  const questionCount = Object.keys(answers).length || 0
  const maxPossible = questionCount * 5 || 1
  const numericScores = Object.values(scoresRaw).filter(v => typeof v === 'number') as number[]
  const totalScore = numericScores.length ? numericScores.reduce((a,b)=>a+b,0) : 0
  const percentage = Math.min(100, Math.max(0, Math.round((totalScore / maxPossible) * 100)))
  let category = percentage > 60 ? 'Magas' : percentage > 30 ? 'Közepes' : 'Alacsony'

  // Prompt fetch
  let aiPrompt: any = null
  try { const { data } = await supabase.from('quiz_ai_prompts').select('ai_prompt, system_prompt, max_tokens').eq('quiz_id', parsed.quiz_id).eq('lang', parsed.lang).maybeSingle(); aiPrompt = data } catch {}

  if (!aiPrompt?.ai_prompt) {
    const simple = `<h3>Eredmény összegzés</h3><p>Pontszám: ${totalScore} (${percentage}%) – Kategória: ${category}</p>`
    await persistCommon({ supabase, parsed, session, snapshot, aiResult:simple })
    await logAI({ parsed, success:true, fallback:'no_prompt' })
    await maybeEmail({ parsed, session, aiResult:simple, percentage, category })
    return NextResponse.json({ ai_result:simple, fallback:'no_prompt', cached:false })
  }

  const answersList = Object.entries(answers).map(([k,v])=>`${k}: ${v}`).join('\n')
  let userPrompt = String(aiPrompt.ai_prompt)
    .replace(/\{\{score\}\}/g, totalScore.toString())
    .replace(/\{\{percentage\}\}/g, percentage.toString())
    .replace(/\{\{category\}\}/g, category)
    .replace(/\{\{answers\}\}/g, answersList)
    .replace(/\{\{lang\}\}/g, parsed.lang)

  const useMock = !parsed.force_real && (parsed.mock || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true')
  let aiResult=''; let usage:any=null; let requestId:string|null=null; let errorMessage:string|null=null
  if (useMock) {
    aiResult = `<h3>Mock Quiz AI (${parsed.lang})</h3><p>${category} – ${percentage}%</p>`
  } else {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion:any = await Promise.race([
        client.chat.completions.create({
          model: OPENAI_MODEL,
          messages:[...(aiPrompt.system_prompt?[{role:'system' as const, content:aiPrompt.system_prompt as string}]:[]), { role:'user' as const, content:userPrompt }],
          max_tokens: aiPrompt.max_tokens || 800,
          temperature:0.7
        }),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error('AI timeout')), QUIZ_AI_TIMEOUT_MS))
      ])
      aiResult = completion?.choices?.[0]?.message?.content?.trim?.() || ''
      usage = completion?.usage || null
      requestId = completion?.id || null
      if(!aiResult) throw new Error('empty_ai_result')
    } catch(e:any){
      errorMessage = e?.message || 'ai_error'
      aiResult = `<h3>Összefoglaló (Fallback)</h3><p>Pontszám: ${totalScore} (${percentage}%) – Kategória: ${category}</p>`
    }
  }
  aiResult = sanitizeAI(aiResult)
  await persistCommon({ supabase, parsed, session, snapshot, aiResult })
  await logAI({ parsed, success:!errorMessage, error:errorMessage, requestId, usage, model:OPENAI_MODEL })
  await maybeEmail({ parsed, session, aiResult, percentage, category })
  return NextResponse.json({ ai_result:aiResult, cached:false, mock:useMock||undefined, model:OPENAI_MODEL, usage, request_id:requestId, error:errorMessage||undefined, duration_ms: Date.now()-started })
}

async function handleProductResult(ctx: { supabase:any, parsed:any, session:any, started:number }) {
  const { supabase, parsed, session, started } = ctx
  const productId = parsed.product_id

  // First check dedicated table cache
  try {
    const { data: existingRow } = await supabase
      .from('product_ai_results')
      .select('ai_result')
      .eq('session_id', parsed.session_id)
      .eq('product_id', productId)
      .eq('lang', parsed.lang)
      .maybeSingle()
    if (existingRow?.ai_result && !parsed.force) {
      return NextResponse.json({ ai_result: existingRow.ai_result, cached:true, type:'product', source:'table' })
    }
  } catch (e) {
    console.warn('product_cache_table_check_failed', (e as any)?.message)
  }

  const productResults = session.product_ai_results || {}
  const existing = productResults[productId]?.ai_result
  if (existing && !parsed.force) {
    return NextResponse.json({ ai_result: existing, cached:true, type:'product', source:'session' })
  }

  // Product prompt precedence: product_configs.ai_prompts > product_ai_prompts > quiz_ai_prompts
  let productPrompt: any = null
  let systemPrompt = ''
  let maxTokens = 800
  try {
    const { data: configs } = await supabase.from('product_configs').select('key,value').eq('product_id', productId)
    const aiPromptsConfig = configs?.find((c:any)=>c.key==='ai_prompts')?.value
    if (aiPromptsConfig) {
      productPrompt = aiPromptsConfig.result_prompt || aiPromptsConfig.user_prompt
      systemPrompt = aiPromptsConfig.system_prompt || ''
      maxTokens = aiPromptsConfig.max_tokens || maxTokens
    }
    if (!productPrompt) {
      const { data: prodRow } = await supabase.from('product_ai_prompts').select('ai_prompt, system_prompt, max_tokens').eq('product_id', productId).eq('lang', parsed.lang).maybeSingle()
      if (prodRow) {
        productPrompt = prodRow.ai_prompt
        systemPrompt = prodRow.system_prompt || systemPrompt
        maxTokens = prodRow.max_tokens || maxTokens
      }
    }
    if (!productPrompt) {
      const { data: quizRow } = await supabase.from('quiz_ai_prompts').select('ai_prompt, system_prompt, max_tokens').eq('quiz_id', parsed.quiz_id).eq('lang', parsed.lang).maybeSingle()
      if (quizRow) {
        productPrompt = quizRow.ai_prompt
        systemPrompt = quizRow.system_prompt || systemPrompt
        maxTokens = quizRow.max_tokens || maxTokens
      }
    }
  } catch {}

  if (!productPrompt) {
    const simple = `<h3>Termék eredmény nem elérhető</h3><p>Hiányzó AI prompt (${parsed.lang}).</p>`
    await logAI({ parsed, success:true, fallback:'no_product_prompt', product:true })
    return NextResponse.json({ ai_result:simple, fallback:'no_prompt', cached:false, type:'product' })
  }

  const answers = session.answers || {}
  const answersList = Object.entries(answers).map(([k,v])=>`${k}: ${v}`).join('\n')
  let userPrompt = String(productPrompt).replace(/\{\{answers\}\}/g, answersList).replace(/\{\{lang\}\}/g, parsed.lang)

  const useMock = !parsed.force_real && (parsed.mock || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true')
  let aiResult=''; let usage:any=null; let requestId:string|null=null; let errorMessage:string|null=null
  if (useMock) {
    aiResult = `<h3>Mock Product AI (${parsed.lang})</h3><pre>${answersList}</pre>`
  } else {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const completion:any = await Promise.race([
        client.chat.completions.create({
          model: OPENAI_MODEL,
          messages:[...(systemPrompt?[{role:'system' as const, content:systemPrompt as string}]:[]), { role:'user' as const, content:userPrompt }],
          max_tokens: maxTokens,
          temperature:0.7
        }),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error('AI timeout')), PRODUCT_AI_TIMEOUT_MS))
      ])
      aiResult = completion?.choices?.[0]?.message?.content?.trim?.() || ''
      usage = completion?.usage || null
      requestId = completion?.id || null
      if(!aiResult) throw new Error('empty_ai_result')
    } catch(e:any){
      errorMessage = e?.message || 'ai_error'
      aiResult = `<h3>Termék eredmény (Fallback)</h3><p>AI hiba: ${errorMessage}</p>`
    }
  }
  aiResult = sanitizeAI(aiResult)

  // Persist product result (preferred table)
  try {
    await supabase.from('product_ai_results').upsert({
      session_id: parsed.session_id,
      quiz_id: parsed.quiz_id,
      product_id: productId,
      lang: parsed.lang,
      ai_result: aiResult,
      generated_at: new Date().toISOString(),
      provider: 'openai',
      model: OPENAI_MODEL,
      prompt_tokens: usage?.prompt_tokens || null,
      completion_tokens: usage?.completion_tokens || null,
      total_tokens: usage?.total_tokens || null,
      mocked: useMock || false,
      request_id: requestId,
      metadata: usage ? { system_prompt: !!systemPrompt } : null
    }, { onConflict: 'session_id,product_id,lang' as any })
  } catch (e) {
    console.warn('product_result_upsert_failed', (e as any)?.message)
  }

  // Update session.product_ai_results for faster subsequent calls
  try {
    const updatedResults = { ...session.product_ai_results, [productId]: { ai_result: aiResult, generated_at: new Date().toISOString() } }
    await supabase.from('quiz_sessions').update({ product_ai_results: updatedResults }).eq('id', parsed.session_id)
  } catch (e) {
    console.warn('session_product_ai_results_update_failed', (e as any)?.message)
  }

  await logAI({ parsed, success: !errorMessage, error: errorMessage, requestId, usage, model: OPENAI_MODEL, product:true })

  // Product purchase email trigger (purchase type) – not quiz_complete
  if (!parsed.skip_email) {
    try {
      await emailTrigger.triggerEmails({
        type: 'purchase',
        quiz_id: parsed.quiz_id,
        user_email: session.user_email || 'placeholder@example.com',
        user_name: session.user_name || 'Felhasználó',
        product_id: productId,
        metadata: { session_id: parsed.session_id }
      })
    } catch (e) {
      console.warn('product_email_trigger_failed', (e as any)?.message)
    }
  }

  return NextResponse.json({ ai_result: aiResult, cached:false, mock:useMock||undefined, model:OPENAI_MODEL, usage, request_id:requestId, error:errorMessage||undefined, type:'product', duration_ms: Date.now()-started })
}

async function persistCommon({ supabase, parsed, session, snapshot, aiResult }:{ supabase:any, parsed:any, session:any, snapshot:any, aiResult:string }) {
  try { await supabase.from('quiz_sessions').update({ result_snapshot: { ...snapshot, ai_result: aiResult, generated_at: new Date().toISOString() } }).eq('id', parsed.session_id) } catch(e:any){ console.warn('snapshot_update_failed', e?.message) }
}

async function logAI(opts:{ parsed:any, success:boolean, error?:string|null, requestId?:string|null, usage?:any, model?:string, fallback?:string, product?:boolean }) {
  try {
    await createAuditLog({
      user_id:'system', user_email:'system@ai', action: opts.success ? 'AI_RESULT_SUCCESS':'AI_RESULT_FALLBACK', resource_type: opts.product?'product_result':'quiz_session', resource_id: opts.parsed.session_id, details:{ quiz_id: opts.parsed.quiz_id, product_id: opts.parsed.product_id||null, lang: opts.parsed.lang, model: opts.model, usage: opts.usage, requestId: opts.requestId, error: opts.error||null, fallback: opts.fallback||null, result_type: opts.parsed.result_type }
    })
  } catch(e:any){ console.warn('audit_log_failed', e?.message) }
}

async function maybeEmail({ parsed, session, aiResult, percentage, category }:{ parsed:any, session:any, aiResult:string, percentage:number, category:string }) {
  if (parsed.skip_email) return
  try {
    await emailTrigger.triggerQuizCompletion(parsed.quiz_id, session.user_email || 'placeholder@example.com', { percentage, text: category, ai_result: aiResult }, session.user_name || 'Felhasználó', parsed.session_id)
  } catch(e:any){ console.warn('email_trigger_failed', e?.message) }
}

export async function GET() { return NextResponse.json({ error:'method_not_allowed', allowed:['POST'] }, { status:405 }) }
