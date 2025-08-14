import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Validation schema
const createLeadSchema = z.object({
  quiz_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  lang: z.string().min(2).max(5),
  demographics: z.record(z.any()).optional(),
  utm: z.record(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLeadSchema.parse(body)

    // Check if lead already exists for this quiz and email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('quiz_id', validatedData.quiz_id)
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
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        quiz_id: validatedData.quiz_id,
        email: validatedData.email,
        name: validatedData.name,
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
