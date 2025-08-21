import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id') || undefined
    const productId = url.searchParams.get('product_id') || undefined
    const quizId = url.searchParams.get('quiz_id') || undefined
    const lang = url.searchParams.get('lang') || 'hu'

    const supabase = getSupabaseAdmin()

    // 1) Env/config overview (safe masking)
    const rawKey = process.env.OPENAI_API_KEY || ''
    const maskedKey = rawKey ? `${rawKey.slice(0, 3)}***${rawKey.slice(-4)}` : null
  const productAiTimeoutMs = parseInt(process.env.PRODUCT_AI_TIMEOUT_MS || '20000', 10)
  const quizAiTimeoutMs = 10000 // hardcoded in quiz flow
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini'

    const envInfo = {
      provider: 'openai',
      has_openai_key: Boolean(rawKey),
      openai_key_masked: maskedKey,
      product_ai_timeout_ms: productAiTimeoutMs,
      quiz_ai_timeout_ms: quizAiTimeoutMs,
      mock_ai_env: process.env.MOCK_AI || null,
      model,
    }

    // 2) Prompt resolution (product-first, then quiz fallback)
    let prompts: any = { lang }
    if (quizId) {
      try {
        const { data: productConfigs } = await supabase
          .from('product_configs')
          .select('key, value')
          .eq('product_id', productId || '')
        const aiPromptsConfig = (productConfigs || []).find((c: any) => c.key === 'ai_prompts')?.value as any

        const { data: productAiPrompt } = await supabase
          .from('product_ai_prompts')
          .select('*')
          .eq('product_id', productId || '')
          .eq('lang', lang)
          .maybeSingle()

        const { data: quizAiPrompt } = await supabase
          .from('quiz_ai_prompts')
          .select('*')
          .eq('quiz_id', quizId)
          .eq('lang', lang)
          .maybeSingle()

        const system_prompt_source = aiPromptsConfig?.system_prompt ? 'product_configs.ai_prompts' : (productAiPrompt?.system_prompt ? 'product_ai_prompts' : (quizAiPrompt?.system_prompt ? 'quiz_ai_prompts' : null))
        const user_prompt_source = aiPromptsConfig?.result_prompt || aiPromptsConfig?.user_prompt ? 'product_configs.ai_prompts' : (productAiPrompt?.ai_prompt ? 'product_ai_prompts' : (quizAiPrompt?.ai_prompt ? 'quiz_ai_prompts' : null))
        const max_tokens = aiPromptsConfig?.max_tokens ?? (productAiPrompt as any)?.max_tokens ?? (quizAiPrompt as any)?.max_tokens ?? 1000

        prompts = {
          lang,
          system_prompt_present: Boolean(aiPromptsConfig?.system_prompt || productAiPrompt?.system_prompt || quizAiPrompt?.system_prompt),
          user_prompt_present: Boolean(aiPromptsConfig?.result_prompt || aiPromptsConfig?.user_prompt || productAiPrompt?.ai_prompt || quizAiPrompt?.ai_prompt),
          system_prompt_source,
          user_prompt_source,
          resolved_max_tokens: max_tokens,
        }
      } catch (e) {
        prompts = { lang, error: 'prompt_resolution_failed' }
      }
    }

    // 3) Stored product AI metadata if session/product present
    let productAiMeta: any = null
    if (sessionId && productId) {
      const { data } = await supabase
        .from('product_ai_results')
        .select('provider, model, prompt_tokens, completion_tokens, total_tokens, mocked, request_id, generated_at')
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .eq('lang', lang)
        .maybeSingle()
      productAiMeta = data || null
    }

    // 4) Quiz snapshot timing for reference
    let quizSnapshot: any = null
    if (sessionId && !productId) {
      const { data } = await supabase
        .from('quiz_sessions')
        .select('ai_result_generated_at, result_snapshot')
        .eq('id', sessionId)
        .maybeSingle()
      quizSnapshot = data || null
    }

    return NextResponse.json({ env: envInfo, prompts, product_ai: productAiMeta, quiz: quizSnapshot })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
