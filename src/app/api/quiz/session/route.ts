import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Request body received:', body)
    const validatedData = createSessionSchema.parse(body)

    // Use direct fetch to bypass Supabase client issues
    const quizResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quizzes?select=id&slug=eq.${validatedData.quizSlug}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Content-Type': 'application/json'
        }
      }
    )

    const quizData = await quizResponse.json()
    console.log('Quiz query result:', { status: quizResponse.status, data: quizData })

    if (!quizResponse.ok || !quizData || quizData.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    const quiz = quizData[0]
    
    // Generate client token
    const client_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Create new session
    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quiz_sessions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          lang: validatedData.lang,
          state: 'started',
          answers: {},
          current_question: 1,
          client_token: client_token
        })
      }
    )

    const sessionData = await sessionResponse.json()
    console.log('Session creation result:', { status: sessionResponse.status, data: sessionData })

    if (!sessionResponse.ok) {
      console.error('Session creation error:', sessionData)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    const session = Array.isArray(sessionData) ? sessionData[0] : sessionData

    return NextResponse.json({
      session_id: session.id,
      client_token: client_token,
      quiz_id: quiz.id,
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
    const { data: session, error } = await supabaseAdmin
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
