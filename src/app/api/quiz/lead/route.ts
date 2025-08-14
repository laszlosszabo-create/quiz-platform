import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'

// Validation schema - simplified for Module 3 compatibility
const createLeadSchema = z.object({
  quizSlug: z.string(),
  email: z.string().email(),
  lang: z.string().min(2).max(5),
  name: z.string().optional(),
  demographics: z.record(z.any()).optional(),
  utm: z.record(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLeadSchema.parse(body)

    // Find quiz by slug first
    const { data: quiz } = await supabaseAdmin
      .from('quizzes')
      .select('id')
      .eq('slug', validatedData.quizSlug)
      .single()

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check if lead already exists for this quiz and email
    const { data: existingLead } = await supabaseAdmin
      .from('quiz_leads')
      .select('id')
      .eq('quiz_id', quiz.id)
      .eq('email', validatedData.email)
      .single()

    if (existingLead) {
      // Return existing lead ID
      return NextResponse.json({
        lead_id: existingLead.id,
        message: 'Lead already exists'
      })
    }

    // Create new lead
    const { data: lead, error } = await supabaseAdmin
      .from('quiz_leads')
      .insert({
        quiz_id: quiz.id,
        email: validatedData.email,
        name: validatedData.name || null,
        lang: validatedData.lang,
        demographics: validatedData.demographics || {},
        utm: validatedData.utm || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Lead creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      lead_id: lead.id,
      message: 'Lead created successfully'
    })
  } catch (error) {
    console.error('Lead API error:', error)
    
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
