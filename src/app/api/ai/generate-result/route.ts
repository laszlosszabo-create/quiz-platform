import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { emailTrigger } from '@/lib/email-automation'
import { markdownToHtml } from '@/lib/markdown'
import { createAuditLog } from '@/lib/audit-log'
import OpenAI from 'openai'

// Validation schema
const generateResultSchema = z
  .object({
    session_id: z.string().uuid(),
    quiz_id: z.string().uuid(),
    lang: z.string().min(2).max(5),
    skip_ai_generation: z.boolean().optional(),
    product_id: z.string().uuid().optional(),
    result_type: z.enum(['quiz', 'product']).optional().default('quiz'),
  })
  .superRefine((data, ctx) => {
    if (data.result_type === 'product' && !data.product_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'product_id is required when result_type is product',
        path: ['product_id'],
      })
    }
  })

// Note: Do not instantiate OpenAI client at module scope to avoid build-time key checks in CI.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = generateResultSchema.parse(body)
  const chatModel = process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini'

    // Get Supabase admin client
  const supabase = getSupabaseAdmin()

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', validatedData.session_id)
      .eq('quiz_id', validatedData.quiz_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Branch by result type early to avoid mixing flows
    const isProduct = validatedData.result_type === 'product'

    // PRODUCT FLOW: use per-product cache and prompts, do NOT trigger quiz-completion emails
    if (isProduct) {
      const productId = validatedData.product_id as string

      // Check per-product cached AI result
      // Prefer SQL table cache if available
      let existingProductResult: string | undefined
      try {
        const { data: row } = await supabase
          .from('product_ai_results')
          .select('ai_result')
          .eq('session_id', validatedData.session_id)
          .eq('product_id', productId)
          .eq('quiz_id', validatedData.quiz_id)
          .eq('lang', validatedData.lang)
          .maybeSingle()
        existingProductResult = (row as any)?.ai_result
      } catch {}
      // Fallback to legacy JSON cache on session
      const productAiResults = (session.product_ai_results as any) || {}
      if (!existingProductResult) existingProductResult = productAiResults?.[productId]?.ai_result
  const urlProduct = request.nextUrl
  const forceEmail = urlProduct.searchParams.get('force_email') === '1'
      if (existingProductResult && !validatedData.skip_ai_generation) {
        // If force_email is requested, trigger purchase email using cached AI and return
        if (forceEmail) {
          try {
            const userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
            const userEmail = session.user_email || (session as any).email || ''
            await emailTrigger.triggerEmails({
              type: 'purchase',
              quiz_id: validatedData.quiz_id,
              user_email: userEmail,
              user_name: userName,
              product_id: productId,
              metadata: { session_id: validatedData.session_id, source: 'product_ai_cached_force' },
            })
          } catch (e) {
            console.warn('Force email (product cached) failed:', e)
          }
        }
        return NextResponse.json({ ai_result: existingProductResult, cached: true })
      }

      // Fetch product details for variables
      const { data: product } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', productId)
        .maybeSingle()

      // Resolve prompts priority: product_configs.ai_prompts > product_ai_prompts > quiz_ai_prompts
      const { data: productConfigs } = await supabase
        .from('product_configs')
        .select('key, value')
        .eq('product_id', productId)

      const aiPromptsConfig = productConfigs?.find((c: any) => c.key === 'ai_prompts')?.value as Record<string, any> | undefined

      const { data: productAiPromptRow } = await supabase
        .from('product_ai_prompts')
        .select('*')
        .eq('product_id', productId)
        .eq('lang', validatedData.lang)
        .maybeSingle()

      const { data: quizAiPromptRow } = await supabase
        .from('quiz_ai_prompts')
        .select('*')
        .eq('quiz_id', validatedData.quiz_id)
        .eq('lang', validatedData.lang)
        .maybeSingle()

      // Compose effective prompts
      const effectiveSystemPrompt = (aiPromptsConfig?.system_prompt ?? productAiPromptRow?.system_prompt ?? quizAiPromptRow?.system_prompt) || ''
      const effectiveUserPrompt = (aiPromptsConfig?.result_prompt ?? aiPromptsConfig?.user_prompt ?? productAiPromptRow?.ai_prompt ?? quizAiPromptRow?.ai_prompt) || ''
      const maxTokens = (aiPromptsConfig?.max_tokens ?? (productAiPromptRow as any)?.max_tokens ?? (quizAiPromptRow as any)?.max_tokens) || 1000

      if (!effectiveUserPrompt.trim()) {
        return NextResponse.json({ error: 'AI prompt not configured for this language' }, { status: 400 })
      }

      // Prepare variables common with quiz flow
      const answers = (session.answers as Record<string, any>) || {}
      const scores = (session.scores as Record<string, any>) || {}

      const { data: questions } = await supabase
        .from('quiz_questions')
        .select('question_text, order_index')
        .eq('quiz_id', validatedData.quiz_id)
        .order('order_index')

      const { data: quizData } = await supabase
        .from('quizzes')
        .select('title, slug')
        .eq('id', validatedData.quiz_id)
        .single()

      let userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
      let userEmail = session.user_email || (session as any).email || ''
      if (!userEmail) {
        try {
          const { data: leadBySession } = await supabase
            .from('quiz_leads')
            .select('email')
            .eq('session_id', validatedData.session_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (leadBySession?.email) {
            userEmail = leadBySession.email
          }
        } catch {}
      }
      if (!userEmail) {
        try {
          const { data: genericLead } = await supabase
            .from('quiz_leads')
            .select('email')
            .eq('quiz_id', validatedData.quiz_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (genericLead?.email) {
            userEmail = genericLead.email
          }
        } catch {}
      }

      const totalScore = Object.values(scores).reduce((sum: number, score) => sum + (Number(score) || 0), 0)
      const maxPossibleScore = Object.keys(answers).length * 5
      const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
      let category = 'Alacsony'
      if (percentage > 60) category = 'Magas'
      else if (percentage > 30) category = 'Közepes'
      const questionsList = questions?.map((q, idx) => `${idx + 1}. ${q.question_text}`).join('\n') || ''
      const answersList = Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n')
      const questionsAndAnswers =
        questions
          ?.map((q, idx) => {
            const questionKey = `question_${q.order_index + 1}`
            const answer = (answers as any)[questionKey] || 'Nincs válasz'
            return `Kérdés ${idx + 1}: ${q.question_text}\nVálasz: ${answer}`
          })
          .join('\n\n') || ''

      let userPrompt = effectiveUserPrompt
        .replace(/\{\{score\}\}/g, totalScore.toString())
        .replace(/\{\{percentage\}\}/g, percentage.toString())
        .replace(/\{\{category\}\}/g, category)
        .replace(/\{\{answers\}\}/g, answersList)
        .replace(/\{\{questions\}\}/g, questionsList)
        .replace(/\{\{questions_and_answers\}\}/g, questionsAndAnswers)
        .replace(/\{\{name\}\}/g, userName)
        .replace(/\{\{email\}\}/g, userEmail)
        .replace(/\{\{product_name\}\}/g, product?.name || 'Termék')
        .replace(/\{\{quiz_title\}\}/g, quizData?.title || 'Quiz')
        .replace(/\{\{lang\}\}/g, validatedData.lang)

      // Mock path (product) — do not trigger quiz emails
    const url = request.nextUrl
    const mockFlag = url.searchParams.get('mock') === '1'
      const useMock = mockFlag || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true'
      if (useMock) {
        const aiResult = `<h3>Mock Product Result (${validatedData.lang})</h3><p>Answers: ${JSON.stringify(answers)}</p><p>Scores: ${JSON.stringify(scores)}</p>`
        // In mock mode, still trigger purchase automation so end-to-end can be validated
        try {
          await emailTrigger.triggerEmails({
            type: 'purchase',
            quiz_id: validatedData.quiz_id,
            user_email: userEmail,
            user_name: userName,
            product_id: productId,
            metadata: { session_id: validatedData.session_id, source: 'product_ai_mock' },
          })
        } catch (emailError) {
          console.error('Purchase email trigger (mock) failed:', emailError)
        }
        return NextResponse.json({ ai_result: aiResult, cached: false, mocked: true })
      }

      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const productAiTimeoutMs = parseInt(process.env.PRODUCT_AI_TIMEOUT_MS || '20000', 10)
    const chatModel = process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini'
    const completion: any = await Promise.race([
          openai.chat.completions.create({
      model: chatModel,
            messages: [
              ...(effectiveSystemPrompt ? [{ role: 'system' as const, content: effectiveSystemPrompt as string }] : []),
              { role: 'user' as const, content: userPrompt },
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
          }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('AI timeout')), productAiTimeoutMs)),
        ])
        const aiResult = (completion as any)?.choices?.[0]?.message?.content?.trim?.()
        if (!aiResult) throw new Error('Empty AI response')

        // Save AI result under product_ai_results
        // Write to SQL table (preferred)
        try {
          // Extract metadata if available
          const usage = (completion as any)?.usage || {}
          const reqId = (completion as any)?.id || undefined
          await supabase.from('product_ai_results').upsert({
            session_id: validatedData.session_id,
            quiz_id: validatedData.quiz_id,
            product_id: productId,
            lang: validatedData.lang,
            ai_result: aiResult,
            generated_at: new Date().toISOString(),
            provider: 'openai',
            model: chatModel,
            prompt_tokens: usage.prompt_tokens ?? null,
            completion_tokens: usage.completion_tokens ?? null,
            total_tokens: usage.total_tokens ?? null,
            mocked: false,
            request_id: reqId,
            metadata: (completion as any) ? { system_prompt: Boolean(effectiveSystemPrompt) } : null,
          }, { onConflict: 'session_id,product_id,lang' as any })
        } catch (e) {
          console.warn('Upsert to product_ai_results failed, falling back to session JSON:', e)
          const updatedProductResults = {
            ...productAiResults,
            [productId]: { ai_result: aiResult, generated_at: new Date().toISOString() },
          }
          await supabase.from('quiz_sessions').update({ product_ai_results: updatedProductResults }).eq('id', validatedData.session_id)
        }

        // Optionally, trigger purchase-specific email automation (not quiz-completion)
        try {
          await emailTrigger.triggerEmails({
            type: 'purchase',
            quiz_id: validatedData.quiz_id,
            user_email: userEmail,
            user_name: userName,
            product_id: productId,
            metadata: { session_id: validatedData.session_id },
          })
        } catch (emailError) {
          console.error('Purchase email trigger failed:', emailError)
        }

        return NextResponse.json({ ai_result: aiResult, cached: false })
      } catch (aiError) {
        console.error('AI generation error (product):', aiError)
        await createAuditLog({
          user_id: 'system',
          user_email: 'system@ai',
          action: 'AI_ERROR',
          resource_type: 'product_ai_result_generation',
          resource_id: validatedData.session_id,
          details: {
            error: aiError instanceof Error ? aiError.message : 'Unknown AI error',
            session_id: validatedData.session_id,
            quiz_id: validatedData.quiz_id,
            product_id: productId,
            lang: validatedData.lang,
          },
        })
        return NextResponse.json({ error: 'AI result generation failed' }, { status: 500 })
      }
    }

    // QUIZ FLOW (default)
    // Check if AI result already exists and not skipping AI
    const existingSnapshot = session.result_snapshot as any
    if (existingSnapshot?.ai_result && !validatedData.skip_ai_generation) {
      // Only trigger email if not already triggered
      if (!existingSnapshot.email_triggered) {
        await triggerEmailAutomationForResult(session, validatedData)
        try {
          await supabase
            .from('quiz_sessions')
            .update({ result_snapshot: { ...existingSnapshot, email_triggered: true, triggered_at: new Date().toISOString() } })
            .eq('id', validatedData.session_id)
        } catch {}
      }
      return NextResponse.json({ ai_result: existingSnapshot.ai_result, cached: true })
    }

    // If skipping AI generation, generate a simple score-based result for email automation
    if (validatedData.skip_ai_generation) {
      // If AI is already cached, reuse it for email to keep parity with the UI
      const cached = (session.result_snapshot as any)?.ai_result
      const scoreResult = await generateScoreOnlyResult(session, validatedData.quiz_id, validatedData.lang)
      if (cached) {
        scoreResult.ai_result = cached
      }
      await triggerEmailAutomationForResult(session, validatedData, scoreResult)
      return NextResponse.json({ message: 'Email automation triggered', score_result: scoreResult, used_cached_ai: Boolean(cached) })
    }

    // Get AI prompt for this language
  const { data: aiPrompt } = await supabase
      .from('quiz_ai_prompts')
      .select('*')
      .eq('quiz_id', validatedData.quiz_id)
      .eq('lang', validatedData.lang)
      .single()

  if (!aiPrompt || !aiPrompt.ai_prompt || !String(aiPrompt.ai_prompt).trim()) {
      return NextResponse.json(
    { error: 'AI prompt not configured for this language' },
        { status: 400 }
      )
    }

  // Prepare variables for prompt template
    const answers = session.answers as Record<string, any> || {}
    const scores = session.scores as Record<string, any> || {}
    
    // Get quiz data for title and questions
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('title, slug')
      .eq('id', validatedData.quiz_id)
      .single()

    // Get questions for this quiz
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('question_text, order_index')
      .eq('quiz_id', validatedData.quiz_id)
      .order('order_index')

    // Prepare user data with STRICT fallback (no cross-quiz last lead leak)
    let userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
    let userEmail = session.user_email || (session as any).email || ''
    let emailSource = userEmail ? 'session' : 'none'
    if (!userEmail) {
      try {
        const { data: leadBySession } = await supabase
          .from('quiz_leads')
          .select('email')
          .eq('session_id', validatedData.session_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (leadBySession?.email) {
          userEmail = leadBySession.email
          emailSource = 'lead_session'
        }
      } catch {}
    }
    if (!userEmail) {
      return NextResponse.json({ error: 'missing_email', message: 'Nincs rögzített email ehhez a sessionhöz' }, { status: 409 })
    }
    
    // Calculate percentage and category
    const totalScore = Object.values(scores).reduce((sum: number, score) => sum + (Number(score) || 0), 0)
    const maxPossibleScore = Object.keys(answers).length * 5 // Assuming max 5 points per question
    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
    
    // Determine category based on score
    let category = 'Alacsony'
    if (percentage > 60) category = 'Magas'
    else if (percentage > 30) category = 'Közepes'
    
    // Format questions list
    const questionsList = questions?.map((q, idx) => `${idx + 1}. ${q.question_text}`).join('\n') || ''
    
    // Format answers list
    const answersList = Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n')
    
    // Format questions and answers pairs
    const questionsAndAnswers = questions?.map((q, idx) => {
      const questionKey = `question_${q.order_index + 1}`
      const answer = answers[questionKey] || 'Nincs válasz'
      return `Kérdés ${idx + 1}: ${q.question_text}\nVálasz: ${answer}`
    }).join('\n\n') || ''

  // Replace variables in user prompt template (canonical ai_prompt only)
  let userPrompt = aiPrompt.ai_prompt as string
    userPrompt = userPrompt
      .replace(/\{\{score\}\}/g, totalScore.toString())
      .replace(/\{\{percentage\}\}/g, percentage.toString())
      .replace(/\{\{category\}\}/g, category)
      .replace(/\{\{answers\}\}/g, answersList)
      .replace(/\{\{questions\}\}/g, questionsList)
      .replace(/\{\{questions_and_answers\}\}/g, questionsAndAnswers)
      .replace(/\{\{name\}\}/g, userName)
      .replace(/\{\{email\}\}/g, userEmail)
      .replace(/\{\{product_name\}\}/g, 'Quiz Termék') // This should be dynamic if product context available
      .replace(/\{\{quiz_title\}\}/g, quizData?.title || 'Quiz')
      .replace(/\{\{lang\}\}/g, validatedData.lang)

    // Optional mock path for tests (no OpenAI call, no DB writes)
    const url = request.nextUrl
    const mockFlag = url.searchParams.get('mock') === '1'
    const useMock = mockFlag || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true'
    if (useMock) {
      const aiResult = `<h3>Mock Result (${validatedData.lang})</h3><p>Answers: ${JSON.stringify(answers)}</p><p>Scores: ${JSON.stringify(scores)}</p>`
      // Fire email trigger even in mock mode so automations are testable
      try {
        await emailTrigger.triggerQuizCompletion(
          validatedData.quiz_id,
          userEmail,
          {
            percentage: percentage,
            text: category,
            ai_result: aiResult,
          },
          userName,
          validatedData.session_id
        )
      } catch (emailError) {
        console.error('Email trigger (mock) failed:', emailError)
      }
      return NextResponse.json({ ai_result: aiResult, cached: false, mocked: true })
    }

    try {
      // Lazily create OpenAI client only when needed (avoids build-time key requirement)
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      
      // Get max_tokens from AI prompt config, default to 1000
      const maxTokens = aiPrompt.max_tokens || 1000
      const quizAiTimeoutMs = parseInt(process.env.QUIZ_AI_TIMEOUT_MS || '20000', 10)
      
      // Generate AI result with timeout
      const completion: any = await Promise.race([
        openai.chat.completions.create({
          model: chatModel,
          messages: (
            [
              ...(aiPrompt.system_prompt ? [{ role: 'system' as const, content: aiPrompt.system_prompt as string }] : []),
              { role: 'user' as const, content: userPrompt },
            ]
          ),
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('AI timeout')), quizAiTimeoutMs)
        )
      ])
  const aiResultRaw = (completion as any)?.choices?.[0]?.message?.content?.trim?.()
      const aiResult = aiResultRaw
      if (!aiResult) {
        throw new Error('Empty AI response')
      }

      if (!aiResult) {
        throw new Error('Empty AI response')
      }

      // Save AI result to session
      const updatedSnapshot = {
        ...existingSnapshot,
        ai_result: aiResult,
        generated_at: new Date().toISOString()
      }

      await supabase
        .from('quiz_sessions')
        .update({ result_snapshot: updatedSnapshot, ai_result_generated_at: new Date().toISOString() })
        .eq('id', validatedData.session_id)

      // Trigger quiz completion email after AI result is generated (convert markdown to HTML for email)
      try {
        const aiHtml = markdownToHtml(aiResult)
  await emailTrigger.triggerQuizCompletion(
          validatedData.quiz_id,
          userEmail,
          {
            percentage: percentage,
            text: category,
            ai_result: aiHtml
          },
          userName,
          validatedData.session_id
        )
  // (emailSource jelenleg lokális; jövőbeni bővítéshez injection szükséges az automation rétegbe)
      } catch (emailError) {
        console.error('Email trigger failed:', emailError)
        // Don't fail the API call if email fails
      }

      return NextResponse.json({
        ai_result: aiResult,
        cached: false,
        metadata: {
          provider: 'openai',
          model: chatModel,
          usage: (completion as any)?.usage || null,
          request_id: (completion as any)?.id || null
        }
      })

    } catch (aiError) {
      console.error('AI generation error:', aiError)

      // Log AI error for monitoring
      await createAuditLog({
        user_id: 'system',
        user_email: 'system@ai',
        action: 'AI_ERROR',
        resource_type: 'ai_result_generation',
        resource_id: validatedData.session_id,
        details: {
          error: aiError instanceof Error ? aiError.message : 'Unknown AI error',
          session_id: validatedData.session_id,
          quiz_id: validatedData.quiz_id,
          lang: validatedData.lang
        }
      })

      // Graceful fallback: try score-only helper, but never fail the request
      let scoreResult: { percentage: number; text: string; ai_result: string }
      try {
        scoreResult = await generateScoreOnlyResult(session, validatedData.quiz_id, validatedData.lang)
      } catch (scErr) {
        // Last-ditch basic fallback using already computed values
        const basicHtml = `<h3>Összefoglalás</h3><p>Egy gyors összefoglalót küldünk e-mailben. Ha az AI elemzés elkészül, automatikusan megkapja.</p>`
        scoreResult = { percentage, text: category, ai_result: basicHtml }
      }
      try {
        await triggerEmailAutomationForResult(session, validatedData, scoreResult)
      } catch {}
      return NextResponse.json(
        {
          ai_result: scoreResult.ai_result,
          cached: false,
          fallback: 'score_only',
          error: aiError instanceof Error ? aiError.message : 'AI_error',
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error('AI API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to generate score-only result for email automation
async function generateScoreOnlyResult(session: any, quizId: string, lang: string) {
  const supabase = getSupabaseAdmin()
  
  // Get quiz questions and scoring rules
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('order_index')

  const { data: scoringRules } = await supabase
    .from('quiz_scoring_rules')
    .select('*')
    .eq('quiz_id', quizId)

  // Calculate score
  const answers = session.answers as Record<string, any> || {}
  let totalScore = 0

  questions?.forEach(question => {
    const answer = answers[question.key]
    if (!answer) return

    const options = question.options as any[] || []
    
    if (question.type === 'single') {
      const option = options.find(opt => opt.key === answer)
      if (option?.score) {
        totalScore += option.score
      }
    } else if (question.type === 'multi' && Array.isArray(answer)) {
      answer.forEach(answerKey => {
        const option = options.find(opt => opt.key === answerKey)
        if (option?.score) {
          totalScore += option.score
        }
      })
    }
  })

  // Determine category based on scoring rules
  let category = 'Alacsony'
  let scorePercentage = 0
  
  if (scoringRules && scoringRules.length > 0) {
    // FIXED: Find the appropriate scoring rule based on totalScore range
    const applicableRule = scoringRules
      .sort((a, b) => (b.weights as any)?.min_score - (a.weights as any)?.min_score) // Sort by min_score descending
      .find(rule => {
        const weights = rule.weights as any || {}
        const minScore = weights.min_score || 0
        const maxScore = weights.max_score || 100
        return totalScore >= minScore && totalScore <= maxScore
      })
    
    if (applicableRule) {
      const weights = applicableRule.weights as any || {}
      category = weights.category || 'Alacsony'
      
      // Calculate percentage within the specific rule range
      const minScore = weights.min_score || 0
      const maxScore = weights.max_score || 100
      scorePercentage = maxScore > minScore ? 
        Math.round(((totalScore - minScore) / (maxScore - minScore)) * 100) : 0
    }
  }

  return {
    percentage: Math.round(scorePercentage),
    text: category,
    ai_result: `<h3>Összefoglalás:</h3><p>Az Ön eredménye: ${totalScore} pont (${Math.round(scorePercentage)}%). Kategória: ${category}</p>`
  }
}

// Helper function to trigger email automation
async function triggerEmailAutomationForResult(session: any, validatedData: any, scoreResult?: any) {
  const supabase = getSupabaseAdmin()
  
  // Get user data
  let userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
  let userEmail = session.user_email || (session as any).email || ''
  
  if (!userEmail) {
    try {
      const { data: leadBySession } = await supabase
        .from('quiz_leads')
  .select('email')
        .eq('session_id', validatedData.session_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (leadBySession?.email) {
        userEmail = leadBySession.email
  // name not present in legacy schema
      }
    } catch {}
  }

  // If no email yet, still proceed; the queue item will be scheduled with grace and backfilled

  // Use existing result or provided score result
  const existingSnapshot = session.result_snapshot as any
  const quizResult = scoreResult || {
    percentage: 0,
    text: 'Eredmény',
    ai_result: existingSnapshot?.ai_result || '<p>Az eredményét sikeresen kiszámítottuk.</p>'
  }

  // Trigger email automation (quiz flow only)
  if (validatedData.result_type !== 'product') {
    // Ensure AI content is HTML for email
    const quizResultForEmail = {
      ...quizResult,
      ai_result: markdownToHtml(quizResult.ai_result || ''),
    }
    await emailTrigger.triggerQuizCompletion(
      validatedData.quiz_id,
      userEmail,
      quizResultForEmail,
      userName,
      validatedData.session_id
    )
  }
}
