import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Validation schema - matching leads table structure  
const createLeadSchema = z.object({
  quizSlug: z.string(),
  email: z.string().email(),
  name: z.string().min(1).optional(),
  lang: z.string().min(2).max(5),
  session_id: z.string().uuid().optional()
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

    // Check if lead already exists for this quiz and email (try leads, then legacy quiz_leads)
    let existingLead: { id: string } | null = null
    let existingFrom: 'leads' | 'quiz_leads' | null = null
    {
      const { data } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('quiz_id', quiz.id)
        .eq('email', validatedData.email)
        .maybeSingle()
      if (data) {
        existingLead = data as any
        existingFrom = 'leads'
      } else {
        const { data: legacy } = await supabaseAdmin
          .from('quiz_leads')
          .select('id')
          .eq('quiz_id', quiz.id)
          .eq('email', validatedData.email)
          .maybeSingle()
        if (legacy) {
          existingLead = legacy as any
          existingFrom = 'quiz_leads'
        }
      }
    }

    if (existingLead) {
      // Even if the lead exists, link it to the session and persist best-effort details
      if (validatedData.session_id) {
        try {
          if (existingFrom === 'leads') {
            // Link lead to session only if it's from canonical leads table
            await supabaseAdmin
              .from('quiz_sessions')
              .update({
                lead_id: existingLead.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', validatedData.session_id)
          }

          // Best-effort: also persist email/name on session if columns exist in this env
          // Best-effort session email/name persistence; ignore failures silently
          try {
            await supabaseAdmin.from('quiz_sessions').update({
              user_email: validatedData.email,
              user_name: validatedData.name || null,
              updated_at: new Date().toISOString()
            }).eq('id', validatedData.session_id)
          } catch {}
          try {
            await supabaseAdmin.from('quiz_sessions').update({
              email: validatedData.email,
              name: validatedData.name || null,
              updated_at: new Date().toISOString()
            }).eq('id', validatedData.session_id)
          } catch {}
        } catch (e) {
          console.warn('Lead exists: session linkage/update warning:', e)
        }
      }

      // Return existing lead ID
      return NextResponse.json({
        lead_id: existingLead.id,
        message: 'Lead already exists'
      })
    }

    // Create new lead - matching leads table structure
    let lead: any = null
    let error: any = null
    // Try canonical 'leads' first
    {
      const { data, error: err } = await supabaseAdmin
        .from('leads')
        .insert({
          quiz_id: quiz.id,
          email: validatedData.email,
          name: validatedData.name || null,
          lang: validatedData.lang
        })
        .select()
        .single()
      lead = data
      error = err
    }
    // Fallback to legacy 'quiz_leads' if insert failed (e.g., table missing)
    if (!lead) {
      // Note: legacy quiz_leads schema doesn't have a name column
      const { data: legacyLead, error: legacyError } = await supabaseAdmin
        .from('quiz_leads')
        .insert({
          quiz_id: quiz.id,
          session_id: validatedData.session_id || null,
          email: validatedData.email,
          lang: validatedData.lang
        })
        .select()
        .single()
      if (legacyLead) {
        lead = legacyLead
        error = null
      } else if (legacyError) {
        // Prefer the legacy error details (more relevant for this env)
        error = legacyError
      }
    }

    if (error) {
      console.error('Lead creation error:', error)
      // In dev, include error details to speed up debugging
      const payload: any = { error: 'Failed to create lead' }
      if (process.env.NODE_ENV !== 'production') {
        payload.details = error?.message || error
      }
      return NextResponse.json(payload, { status: 500 })
    }

    // If we have a session_id, link lead and persist user details on quiz_sessions (best-effort)
    if (validatedData.session_id) {
      // Link lead to session only if it's from canonical 'leads' insert
      try {
        await supabaseAdmin
          .from('quiz_sessions')
          .update({
            lead_id: lead.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', validatedData.session_id)
      } catch {}

      // Best-effort: persist email/name to whichever columns exist
      try {
        await supabaseAdmin.from('quiz_sessions').update({
          user_email: validatedData.email,
          user_name: validatedData.name || null,
          updated_at: new Date().toISOString()
        }).eq('id', validatedData.session_id)
      } catch {}
      try {
        await supabaseAdmin.from('quiz_sessions').update({
          email: validatedData.email,
          name: validatedData.name || null,
          updated_at: new Date().toISOString()
        }).eq('id', validatedData.session_id)
      } catch {}
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
