import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schemas
const createSessionSchema = z.object({
  quizSlug: z.string().min(1),
  lang: z.string().min(2).max(5)
})

const updateSessionSchema = z.object({
  session_id: z.string().uuid(),
  answers: z.record(z.any()).optional(),
  current_question: z.number().optional(),
  email: z.string().email().optional(),
  state: z.enum(['started', 'completed']).optional()
})

export async function POST(request: Request) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase-config')
    const adminClient = getSupabaseAdmin()
    
    const data = await request.json()
    console.log('Session creation request:', data)

    const validatedData = createSessionSchema.parse(data)
    console.log('Validated data:', validatedData)

    // Use Supabase client to find quiz
    const { data: quizData, error: quizError } = await adminClient
      .from('quizzes')
      .select('id')
      .eq('slug', validatedData.quizSlug)
      .single()

    console.log('Quiz query result:', { data: quizData, error: quizError })

    if (quizError || !quizData) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    const quiz = quizData
    
    // Generate client token
    const client_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Create new session using Supabase client
    const { data: sessionData, error: sessionError } = await adminClient
      .from('quiz_sessions')
      .insert({
        quiz_id: quiz.id,
        lang: validatedData.lang,
        client_token: client_token,
        state: 'started'
      })
      .select()
      .single()

    console.log('Session creation result:', { data: sessionData, error: sessionError })

    if (sessionError || !sessionData) {
      console.error('Session creation failed:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session_id: sessionData.id,
      client_token: sessionData.client_token,
      message: 'Session created successfully'
    })
  } catch (error) {
    console.error('Session API error:', error)
    
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

export async function PATCH(request: NextRequest) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase-config')
    const adminClient = getSupabaseAdmin()
    
    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    const updateData: any = {}
    
    if (validatedData.answers !== undefined) {
      updateData.answers = validatedData.answers
    }
    
    if (validatedData.state !== undefined) {
      updateData.state = validatedData.state
    }

    // Update session
    const { data: session, error } = await adminClient
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', validatedData.session_id)
      .select()
      .single()

    if (error) {
      console.error('Session update error:', error)
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session_id: session.id,
      message: 'Session updated successfully'
    })
  } catch (error) {
    console.error('Session API error:', error)
    
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
