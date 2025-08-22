import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id') || undefined
    const productId = url.searchParams.get('product_id') || undefined
    const quizId = url.searchParams.get('quiz_id') || undefined
    const lang = url.searchParams.get('lang') || 'hu'
  const compose = url.searchParams.get('compose') || undefined // 'product'
  const latest = url.searchParams.get('latest') === '1'

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

    // 5) Optional composition for product prompt
    let composed: any = null
    if (compose === 'product') {
      composed = await composeProductPrompt({
        supabase,
        sessionId: sessionId,
        productId: productId,
        quizId: quizId,
        lang,
        latest,
      })
    } else if (compose === 'quiz') {
      composed = await composeQuizPrompt({
        supabase,
        sessionId: sessionId,
        quizId: quizId,
        lang,
      })
    }

    return NextResponse.json({ env: envInfo, prompts, product_ai: productAiMeta, quiz: quizSnapshot, composed })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, session_id, product_id, quiz_id, lang = 'hu' } = body

    if (action === 'compose_product_prompt') {
      const supabase = getSupabaseAdmin()
      const composed = await composeProductPrompt({
        supabase,
        sessionId: session_id === 'latest' ? undefined : session_id,
        productId: product_id,
        quizId: quiz_id,
        lang,
        latest: session_id === 'latest',
      })

      return NextResponse.json({
        success: true,
        action,
        ...composed,
        prompt_variables: {
          questions_and_answers: composed.composed?.variables?.questions_and_answers || '',
          score: composed.composed?.variables?.score || 0,
          percentage: composed.composed?.variables?.percentage || 0,
          category: composed.composed?.variables?.category || '',
        }
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

// Helper to compose the product user prompt similarly to the generation route
async function composeProductPrompt(opts: {
  supabase: ReturnType<typeof getSupabaseAdmin>
  sessionId?: string
  productId?: string
  quizId?: string
  lang: string
  latest: boolean
}) {
  const { supabase, sessionId, productId, quizId, lang, latest } = opts

  // 1) Resolve session and quiz
  let session: any = null
  let resolvedQuizId = quizId
  if (sessionId) {
    const { data } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle()
    session = data
    resolvedQuizId = resolvedQuizId || session?.quiz_id || undefined
  } else if (latest) {
    let query = supabase
      .from('quiz_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    if (resolvedQuizId) query = query.eq('quiz_id', resolvedQuizId)
    const { data } = await query.maybeSingle()
    session = data
    resolvedQuizId = resolvedQuizId || session?.quiz_id || undefined
  }

  if (!session || !resolvedQuizId) {
    throw new Error('No session/quiz found for composing prompt')
  }

  // 2) Resolve product
  let resolvedProductId = productId
  if (!resolvedProductId) {
    const { data: firstProduct } = await supabase
      .from('products')
      .select('id, name')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!firstProduct) throw new Error('No product found to compose prompt')
    resolvedProductId = firstProduct.id
  }

  // 3) Load configs and prompts by priority
  const { data: productConfigs } = await supabase
    .from('product_configs')
    .select('key, value')
    .eq('product_id', resolvedProductId)
  const aiPromptsConfig = (productConfigs || []).find((c: any) => c.key === 'ai_prompts')?.value as any

  const { data: productAiPromptRow } = await supabase
    .from('product_ai_prompts')
    .select('*')
    .eq('product_id', resolvedProductId)
    .eq('lang', lang)
    .maybeSingle()

  const { data: quizAiPromptRow } = await supabase
    .from('quiz_ai_prompts')
    .select('*')
    .eq('quiz_id', resolvedQuizId)
    .eq('lang', lang)
    .maybeSingle()

  const effectiveSystemPrompt = (aiPromptsConfig?.system_prompt ?? productAiPromptRow?.system_prompt ?? quizAiPromptRow?.system_prompt) || ''
  const effectiveUserPrompt = (aiPromptsConfig?.result_prompt ?? aiPromptsConfig?.user_prompt ?? productAiPromptRow?.ai_prompt ?? quizAiPromptRow?.ai_prompt) || ''
  const maxTokens = (aiPromptsConfig?.max_tokens ?? (productAiPromptRow as any)?.max_tokens ?? (quizAiPromptRow as any)?.max_tokens) || 1000

  if (!String(effectiveUserPrompt).trim()) {
    throw new Error('No user prompt configured for this language')
  }

  // 4) Compose variables
  const answers = (session.answers as Record<string, any>) || {}
  const scores = (session.scores as Record<string, any>) || {}

  // Get questions with type information for better formatting
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('key, order, type, options')
    .eq('quiz_id', resolvedQuizId)
    .order('order')

  console.log('DEBUG - Questions query result:', {
    quiz_id: resolvedQuizId,
    questions_found: questions?.length || 0,
    questions_sample: questions?.slice(0, 2),
    full_questions: questions
  })

  const { data: quizData } = await supabase
    .from('quizzes')
    .select('slug')
    .eq('id', resolvedQuizId)
    .single()

  const { data: product } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', resolvedProductId)
    .maybeSingle()

  let userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
  let userEmail = session.user_email || (session as any).email || ''
  if (!userEmail) {
    try {
      const { data: leadBySession } = await supabase
        .from('quiz_leads')
        .select('email')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (leadBySession?.email) userEmail = leadBySession.email
    } catch {}
  }
  if (!userEmail) {
    try {
      const { data: genericLead } = await supabase
        .from('quiz_leads')
        .select('email')
        .eq('quiz_id', resolvedQuizId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (genericLead?.email) userEmail = genericLead.email
    } catch {}
  }

  const totalScore = Object.values(scores).reduce((sum: number, s) => sum + (Number(s) || 0), 0)
  const maxPossibleScore = Object.keys(answers).length * 5
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
  let category = 'Alacsony'
  if (percentage > 60) category = 'Magas'
  else if (percentage > 30) category = 'Közepes'

  console.log('DEBUG - Session answers:', JSON.stringify(answers, null, 2))
  console.log('DEBUG - Questions count:', questions?.length || 0)
  console.log('DEBUG - Questions sample:', questions?.slice(0, 2))

  const questionsList = questions?.map((q, idx) => `${idx + 1}. ${q.key}`).join('\n') || ''
  const answersList = Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n')
  
  // Get quiz translations for readable question text
  const { data: quizTranslations } = await supabase
    .from('quiz_translations')
    .select('field_key, value')
    .eq('quiz_id', quizId || '')
    .eq('lang', lang)
  
  const translationsMap = new Map()
  quizTranslations?.forEach((t: any) => {
    translationsMap.set(t.field_key, t.value)
  })
  
  const questionsAndAnswers = (
    questions?.map((q, idx) => {
      const questionKey = q.key
      const rawAnswer = (answers as any)[questionKey]
      
      // Get readable question text from translations
      const questionTextKey = `question:${questionKey}:text`
      const questionText = translationsMap.get(questionTextKey) || q.key
      
      let formattedAnswer = 'Nincs válasz'
      
      if (rawAnswer !== undefined && rawAnswer !== null) {
        // Format based on question type and answer value
        if (q.type === 'scale' && !isNaN(Number(rawAnswer))) {
          // Scale type: format as X/5 with readable text
          formattedAnswer = `${rawAnswer}/5`
        } else if (q.type === 'single' && q.options && Array.isArray(q.options)) {
          // Single choice: find the selected option and get its readable text
          const selectedOption = q.options.find((opt: any) => opt.key === rawAnswer)
          if (selectedOption) {
            // Try to get translation for option, fallback to option key
            const optionTextKey = `option:${selectedOption.key}:label`
            const optionText = translationsMap.get(optionTextKey) || selectedOption.key
            formattedAnswer = optionText
          } else {
            // Handle numeric answers for single choice questions
            if (typeof rawAnswer === 'number' && q.options.length > 0) {
              const optionByIndex = q.options[rawAnswer - 1]
              if (optionByIndex) {
                const optionTextKey = `option:${optionByIndex.key}:label`
                const optionText = translationsMap.get(optionTextKey) || optionByIndex.key
                formattedAnswer = optionText
              } else {
                formattedAnswer = String(rawAnswer)
              }
            } else {
              formattedAnswer = String(rawAnswer)
            }
          }
        } else if (typeof rawAnswer === 'number') {
          // Numeric but not scale: format as X/5 by default
          formattedAnswer = `${rawAnswer}/5`
        } else if (Array.isArray(rawAnswer)) {
          // Multi choice: join values
          formattedAnswer = rawAnswer.join(', ')
        } else {
          // Single choice or text: use as string
          formattedAnswer = String(rawAnswer)
        }
      }
      
      return `Kérdés ${idx + 1}: ${questionText}\nVálasz: ${formattedAnswer}`
    }).join('\n\n') || ''
  )

  let userPrompt = String(effectiveUserPrompt)
    .replace(/\{\{score\}\}/g, totalScore.toString())
    .replace(/\{\{percentage\}\}/g, percentage.toString())
    .replace(/\{\{category\}\}/g, category)
    .replace(/\{\{answers\}\}/g, answersList)
    .replace(/\{\{questions\}\}/g, questionsList)
    .replace(/\{\{questions_and_answers\}\}/g, questionsAndAnswers)
    .replace(/\{\{name\}\}/g, userName)
    .replace(/\{\{email\}\}/g, userEmail)
    .replace(/\{\{product_name\}\}/g, product?.name || 'Termék')
    .replace(/\{\{quiz_title\}\}/g, quizData?.slug || 'Quiz')
    .replace(/\{\{lang\}\}/g, lang)

  return {
    selection: {
      session_id: session.id,
      quiz_id: resolvedQuizId,
      product_id: resolvedProductId,
      lang,
    },
    sources: {
      system_prompt_present: Boolean(effectiveSystemPrompt),
      user_prompt_present: Boolean(effectiveUserPrompt),
      resolved_max_tokens: maxTokens,
    },
    composed: {
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini',
      temperature: 0.7,
      system_prompt: effectiveSystemPrompt,
      user_prompt_template: effectiveUserPrompt,
      resolved_user_prompt: userPrompt,
      variables: {
        score: totalScore,
        percentage,
        category,
        name: userName,
        email: userEmail,
        product_name: product?.name || null,
        quiz_title: quizData?.slug || null,
        questions_and_answers: questionsAndAnswers,
      },
    },
  }
}

// Helper to compose quiz prompts with readable question texts
async function composeQuizPrompt(opts: {
  supabase: ReturnType<typeof getSupabaseAdmin>
  sessionId?: string
  quizId?: string
  lang: string
}) {
  const { supabase, sessionId, quizId, lang } = opts

  // 1) Resolve session and quiz
  let session: any = null
  let resolvedQuizId = quizId

  if (sessionId) {
    let query = supabase.from('quiz_sessions').select('*')
    if (resolvedQuizId) query = query.eq('quiz_id', resolvedQuizId)
    const { data } = await query.eq('id', sessionId).maybeSingle()
    session = data
    resolvedQuizId = resolvedQuizId || session?.quiz_id || undefined
  }

  if (!session || !resolvedQuizId) {
    throw new Error('No session/quiz found for quiz prompt composition')
  }

  // 2) Get quiz data
  const { data: quizData } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', resolvedQuizId)
    .maybeSingle()

  // 3) Get questions with options
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('key, order, type, options')
    .eq('quiz_id', resolvedQuizId)
    .order('order')

  // 4) Get quiz translations for readable question text
  const { data: quizTranslations } = await supabase
    .from('quiz_translations')
    .select('field_key, value')
    .eq('quiz_id', resolvedQuizId)
    .eq('lang', lang)
  
  const translationsMap = new Map()
  quizTranslations?.forEach((t: any) => {
    translationsMap.set(t.field_key, t.value)
  })

  // 5) Format questions and answers with readable text
  const answers = session.answers || {}
  const questionsAndAnswers = (
    questions?.map((q: any, idx: number) => {
      const questionKey = q.key
      const rawAnswer = answers[questionKey]
      
      // Get readable question text from translations
      const questionTextKey = `question:${questionKey}:text`
      const questionText = translationsMap.get(questionTextKey) || q.key
      
      let formattedAnswer = 'Nincs válasz'
      
      if (rawAnswer !== undefined && rawAnswer !== null) {
        if (q.type === 'scale' && !isNaN(Number(rawAnswer))) {
          formattedAnswer = `${rawAnswer}/5`
        } else if (q.type === 'single' && q.options && Array.isArray(q.options)) {
          const selectedOption = q.options.find((opt: any) => opt.key === rawAnswer)
          if (selectedOption) {
            const optionTextKey = `option:${selectedOption.key}:label`
            const optionText = translationsMap.get(optionTextKey) || selectedOption.key
            formattedAnswer = optionText
          } else {
            // Handle numeric answers for single choice questions
            if (typeof rawAnswer === 'number' && q.options.length > 0) {
              const optionByIndex = q.options[rawAnswer - 1]
              if (optionByIndex) {
                const optionTextKey = `option:${optionByIndex.key}:label`
                const optionText = translationsMap.get(optionTextKey) || optionByIndex.key
                formattedAnswer = optionText
              } else {
                formattedAnswer = String(rawAnswer)
              }
            } else {
              formattedAnswer = String(rawAnswer)
            }
          }
        } else if (Array.isArray(rawAnswer)) {
          formattedAnswer = rawAnswer.join(', ')
        } else {
          formattedAnswer = String(rawAnswer)
        }
      }
      
      return `Kérdés ${idx + 1}: ${questionText}\nVálasz: ${formattedAnswer}`
    }).join('\n\n') || ''
  )

  return {
    session_id: sessionId,
    quiz_id: resolvedQuizId,
    quiz_data: quizData,
    questions: questions,
    answers: answers,
    translations_count: quizTranslations?.length || 0,
    formatted_questions_and_answers: questionsAndAnswers,
  }
}
