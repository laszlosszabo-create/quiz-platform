import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { createAuditLog } from '@/lib/audit-log'
import OpenAI from 'openai'

// Validation schema
const generateResultSchema = z.object({
  session_id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  lang: z.string().min(2).max(5)
})

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

  // Check if AI result already exists
    const existingSnapshot = session.result_snapshot as any
    if (existingSnapshot?.ai_result) {
      return NextResponse.json({
        ai_result: existingSnapshot.ai_result,
        cached: true
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
    
  // Replace variables in user prompt template (canonical ai_prompt only)
  let userPrompt = aiPrompt.ai_prompt as string
    userPrompt = userPrompt
      .replace('{{answers}}', JSON.stringify(answers))
      .replace('{{scores}}', JSON.stringify(scores))
      .replace('{{lang}}', validatedData.lang)

    // Optional mock path for tests (no OpenAI call, no DB writes)
    const url = request.nextUrl
    const mockFlag = url.searchParams.get('mock') === '1'
    const useMock = mockFlag || process.env.MOCK_AI === '1' || process.env.MOCK_AI === 'true' || !process.env.OPENAI_API_KEY
    if (useMock) {
      const aiResult = `<h3>Mock Result (${validatedData.lang})</h3><p>Answers: ${JSON.stringify(answers)}</p><p>Scores: ${JSON.stringify(scores)}</p>`
      return NextResponse.json({ ai_result: aiResult, cached: false, mocked: true })
    }

    try {
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
