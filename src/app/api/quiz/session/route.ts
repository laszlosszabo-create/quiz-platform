import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Validation schemas
const createSessionSchema = z.object({
  quiz_id: z.string().uuid(),
  lang: z.string().min(2).max(5),
  client_token: z.string().min(1)
})

const updateSessionSchema = z.object({
  session_id: z.string().uuid(),
  answers: z.record(z.any()).optional(),
  state: z.enum(['started', 'completed']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Create new session
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        quiz_id: validatedData.quiz_id,
        lang: validatedData.lang,
        state: 'started',
        answers: {},
        scores: {},
        result_snapshot: {},
        client_token: validatedData.client_token
      })
      .select()
      .single()

    if (error) {
      console.error('Session creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session_id: session.id,
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
    const { data: session, error } = await supabase
      .from('sessions')
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
