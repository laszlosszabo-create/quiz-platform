import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin
    
    const { data: prompts, error } = await supabase
      .from('quiz_prompts')
      .select('*')
      .eq('quiz_id', quizId)
      .order('lang')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch AI prompts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: prompts || []
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_id, lang, system_prompt, user_prompt, ai_provider, ai_model } = body

    // Validation
    if (!quiz_id || !lang || !system_prompt || !user_prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: quiz_id, lang, system_prompt, user_prompt' },
        { status: 400 }
      )
    }

    // Validate required variables in user_prompt
    const requiredVars = ['{{scores}}', '{{top_category}}', '{{name}}']
    const missingVars = requiredVars.filter(variable => !user_prompt.includes(variable))
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { error: `Missing required variables: ${missingVars.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Check if prompt already exists for this quiz/lang
    const { data: existingPrompt } = await supabase
      .from('quiz_prompts')
      .select('id')
      .eq('quiz_id', quiz_id)
      .eq('lang', lang)
      .single()

    if (existingPrompt) {
      return NextResponse.json(
        { error: 'AI prompt already exists for this language. Use PUT to update.' },
        { status: 409 }
      )
    }

    const { data: prompt, error } = await supabase
      .from('quiz_prompts')
      .insert({
        quiz_id,
        lang,
        system_prompt,
        user_prompt,
        ai_provider: ai_provider || 'openai',
        ai_model: ai_model || 'gpt-4o'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create AI prompt' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: prompt
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, quiz_id, lang, system_prompt, user_prompt, ai_provider, ai_model } = body

    // Validation
    if (!id || !quiz_id || !lang || !system_prompt || !user_prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: id, quiz_id, lang, system_prompt, user_prompt' },
        { status: 400 }
      )
    }

    // Validate required variables in user_prompt
    const requiredVars = ['{{scores}}', '{{top_category}}', '{{name}}']
    const missingVars = requiredVars.filter(variable => !user_prompt.includes(variable))
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { error: `Missing required variables: ${missingVars.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    const { data: prompt, error } = await supabase
      .from('quiz_prompts')
      .update({
        system_prompt,
        user_prompt,
        ai_provider: ai_provider || 'openai',
        ai_model: ai_model || 'gpt-4o',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('quiz_id', quiz_id) // Security: ensure we only update prompts for the specified quiz
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update AI prompt' },
        { status: 500 }
      )
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'AI prompt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: prompt
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const quizId = searchParams.get('quiz_id')

    if (!id || !quizId) {
      return NextResponse.json(
        { error: 'ID and quiz_id are required' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    const { error } = await supabase
      .from('quiz_prompts')
      .delete()
      .eq('id', id)
      .eq('quiz_id', quizId) // Security: ensure we only delete prompts for the specified quiz

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete AI prompt' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'AI prompt deleted successfully'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
