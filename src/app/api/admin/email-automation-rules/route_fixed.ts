import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Validation schemas
const getRulesSchema = z.object({
  quiz_id: z.string().uuid(),
  product_id: z.string().optional()
})

const createRuleSchema = z.object({
  quiz_id: z.string().uuid(),
  product_id: z.string().optional(),
  rule_name: z.string().min(1),
  rule_type: z.enum(['quiz_complete', 'purchase', 'no_purchase_reminder']),
  trigger_conditions: z.record(z.any()).default({}),
  delay_minutes: z.number().min(0).default(0),
  email_template_id: z.string().uuid(),
  is_active: z.boolean().default(true)
})

const updateRuleSchema = createRuleSchema.extend({
  id: z.string().uuid()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')
    const productId = searchParams.get('product_id')

    if (!quizId) {
      return NextResponse.json(
        { error: 'quiz_id parameter is required' },
        { status: 400 }
      )
    }

    const validatedData = getRulesSchema.parse({ 
      quiz_id: quizId,
      product_id: productId || undefined
    })

    const supabase = getSupabaseAdmin()

    // Get automation rules with associated templates
    let query = supabase
      .from('email_automation_rules')
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type,
          subject_template
        )
      `)
      .eq('quiz_id', validatedData.quiz_id)

    if (validatedData.product_id) {
      query = query.eq('product_id', validatedData.product_id)
    }

    const { data: rules, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch automation rules' },
        { status: 500 }
      )
    }

    return NextResponse.json({ rules })

  } catch (error) {
    console.error('Automation rules API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createRuleSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Verify that the template exists and belongs to the same quiz
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('id, quiz_id, product_id')
      .eq('id', validatedData.email_template_id)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Invalid template ID or template does not exist' },
        { status: 400 }
      )
    }

    if (template.quiz_id !== validatedData.quiz_id) {
      return NextResponse.json(
        { error: 'Template must belong to the same quiz' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('email_automation_rules')
      .insert({
        quiz_id: validatedData.quiz_id,
        product_id: validatedData.product_id,
        rule_name: validatedData.rule_name,
        rule_type: validatedData.rule_type,
        trigger_conditions: validatedData.trigger_conditions,
        delay_minutes: validatedData.delay_minutes,
        email_template_id: validatedData.email_template_id,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type,
          subject_template
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create automation rule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ rule: data })

  } catch (error) {
    console.error('Automation rule creation error:', error)
    
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateRuleSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Verify that the template exists and belongs to the same quiz
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('id, quiz_id, product_id')
      .eq('id', validatedData.email_template_id)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Invalid template ID or template does not exist' },
        { status: 400 }
      )
    }

    if (template.quiz_id !== validatedData.quiz_id) {
      return NextResponse.json(
        { error: 'Template must belong to the same quiz' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('email_automation_rules')
      .update({
        rule_name: validatedData.rule_name,
        rule_type: validatedData.rule_type,
        trigger_conditions: validatedData.trigger_conditions,
        delay_minutes: validatedData.delay_minutes,
        email_template_id: validatedData.email_template_id,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.id)
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type,
          subject_template
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update automation rule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ rule: data })

  } catch (error) {
    console.error('Automation rule update error:', error)
    
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ruleId = searchParams.get('id')

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('email_automation_rules')
      .delete()
      .eq('id', ruleId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete automation rule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Automation rule deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
