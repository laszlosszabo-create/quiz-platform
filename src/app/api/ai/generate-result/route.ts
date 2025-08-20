import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { emailTrigger } from '@/lib/email-automation'
import { createAuditLog } from '@/lib/audit-log'
import OpenAI from 'openai'

// Validation schema
const generateResultSchema = z.object({
  session_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  lang: z.string().min(2).max(5),
  skip_ai_generation: z.boolean().optional()
})

// Note: Do not instantiate OpenAI client at module scope to avoid build-time key checks in CI.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = generateResultSchema.parse(body)

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

  // Check if AI result already exists and not skipping AI
    const existingSnapshot = session.result_snapshot as any
    if (existingSnapshot?.ai_result && !validatedData.skip_ai_generation) {
      // Trigger email automation for cached results
      await triggerEmailAutomationForResult(session, validatedData)
      
      return NextResponse.json({
        ai_result: existingSnapshot.ai_result,
        cached: true
      })
    }

    // If skipping AI generation, generate a simple score-based result for email automation
    if (validatedData.skip_ai_generation) {
      const scoreResult = await generateScoreOnlyResult(session, validatedData.quiz_id, validatedData.lang)
      await triggerEmailAutomationForResult(session, validatedData, scoreResult)
      
      return NextResponse.json({
        message: 'Email automation triggered for score-only result',
        score_result: scoreResult
      })
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

    // Prepare user data with robust fallbacks
    let userName = session.user_name || (session as any).name || 'Kedves Felhasználó'
    let userEmail = session.user_email || (session as any).email || ''
    if (!userEmail) {
      try {
        // Try quiz_leads by session
        const { data: leadBySession } = await supabase
          .from('quiz_leads')
          .select('email')
          .eq('session_id', validatedData.session_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (leadBySession?.email) {
          userEmail = leadBySession.email
          // name not available in legacy schema
        }
      } catch {}
    }
    if (!userEmail) {
      try {
        // As a last resort, try generic leads linking by quiz and most recent
        const { data: genericLead } = await supabase
          .from('quiz_leads')
          .select('email')
          .eq('quiz_id', validatedData.quiz_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (genericLead?.email) {
          userEmail = genericLead.email
          // name not available in legacy schema
        }
      } catch {}
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
    const useMock = mockFlag || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true' || !process.env.OPENAI_API_KEY
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
            ai_result: aiResult
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
      // Generate AI result with timeout
      const completion: any = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: (
            [
              ...(aiPrompt.system_prompt ? [{ role: 'system' as const, content: aiPrompt.system_prompt as string }] : []),
              { role: 'user' as const, content: userPrompt },
            ]
          ),
          max_tokens: 500,
          temperature: 0.7,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('AI timeout')), 10000)
        )
      ])
      const aiResult = (completion as any)?.choices?.[0]?.message?.content?.trim?.()

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
        .update({ result_snapshot: updatedSnapshot })
        .eq('id', validatedData.session_id)

      // Trigger quiz completion email after AI result is generated
      try {
        await emailTrigger.triggerQuizCompletion(
          validatedData.quiz_id,
          userEmail,
          {
            percentage: percentage,
            text: category,
            ai_result: aiResult
          },
          userName,
          validatedData.session_id
        )
      } catch (emailError) {
        console.error('Email trigger failed:', emailError)
        // Don't fail the API call if email fails
      }

      return NextResponse.json({
        ai_result: aiResult,
        cached: false
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

      // Return error - client will fall back to static result
      return NextResponse.json(
        { error: 'AI result generation failed' },
        { status: 500 }
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
    const maxScore = scoringRules.reduce((max, rule) => Math.max(max, rule.min_score || 0), 0)
    scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    
    const applicableRule = scoringRules
      .sort((a, b) => (b.min_score || 0) - (a.min_score || 0))
      .find(rule => totalScore >= (rule.min_score || 0))
    
    if (applicableRule?.category) {
      category = applicableRule.category
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

  // Trigger email automation
  await emailTrigger.triggerQuizCompletion(
    validatedData.quiz_id,
    userEmail,
    quizResult,
    userName,
    validatedData.session_id
  )
}
