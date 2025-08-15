import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()

    // First, get the quiz basic data
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        id, 
        slug, 
        status, 
        default_lang, 
        feature_flags, 
        theme, 
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single()

    if (quizError) {
      console.error('Error fetching quiz:', quizError)
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Get quiz translations
    const { data: translations, error: translationsError } = await supabase
      .from('quiz_translations')
      .select('lang, field_key, value')
      .eq('quiz_id', id)

    // Get quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('id, key, type, order, help_text, options, scoring')
      .eq('quiz_id', id)
      .order('order')

    // Get scoring rules
    const { data: scoringRules, error: scoringError } = await supabase
      .from('quiz_scoring_rules')
      .select('rule_type, weights, thresholds')
      .eq('quiz_id', id)

    // Get AI prompts
    const { data: prompts, error: promptsError } = await supabase
      .from('quiz_ai_prompts')
      .select('lang, system_prompt, user_prompt_template, variables')
      .eq('quiz_id', id)

    // Transform data to expected format
    const transformedQuiz = {
      ...quiz,
      // Transform translations to a more usable format
      translations: translations?.reduce((acc, t) => {
        if (!acc[t.lang]) acc[t.lang] = {}
        acc[t.lang][t.field_key] = t.value
        return acc
      }, {} as Record<string, Record<string, string>>) || {},
      // Add convenience fields for default language
      title: translations?.find(t => t.lang === quiz.default_lang && t.field_key === 'title')?.value || '',
      description: translations?.find(t => t.lang === quiz.default_lang && t.field_key === 'description')?.value || '',
      quiz_questions: questions || [],
      scoring_rules: scoringRules || [],
      prompts: prompts || []
    }

    return NextResponse.json(transformedQuiz)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = getSupabaseClient()

    // Update basic quiz data
    const quizUpdates: any = {}
    if (body.slug) quizUpdates.slug = body.slug
    if (body.status) quizUpdates.status = body.status
    if (body.default_lang) quizUpdates.default_lang = body.default_lang
    if (body.feature_flags) quizUpdates.feature_flags = body.feature_flags
    if (body.theme) quizUpdates.theme = body.theme

    if (Object.keys(quizUpdates).length > 0) {
      quizUpdates.updated_at = new Date().toISOString()
      
      const { error: quizError } = await supabase
        .from('quizzes')
        .update(quizUpdates)
        .eq('id', id)

      if (quizError) {
        console.error('Error updating quiz:', quizError)
        return NextResponse.json(
          { error: 'Failed to update quiz' },
          { status: 500 }
        )
      }
    }

    // Update translations
    if (body.translations) {
      for (const [lang, fields] of Object.entries(body.translations)) {
        for (const [fieldKey, value] of Object.entries(fields as Record<string, string>)) {
          await supabase
            .from('quiz_translations')
            .upsert({
              quiz_id: id,
              lang,
              field_key: fieldKey,
              value,
              updated_at: new Date().toISOString()
            })
        }
      }
    }

    // Handle direct title/description updates for convenience
    if (body.title || body.description) {
      const defaultLang = body.default_lang || 'hu'
      
      if (body.title) {
        await supabase
          .from('quiz_translations')
          .upsert({
            quiz_id: id,
            lang: defaultLang,
            field_key: 'title',
            value: body.title,
            updated_at: new Date().toISOString()
          })
      }
      
      if (body.description) {
        await supabase
          .from('quiz_translations')
          .upsert({
            quiz_id: id,
            lang: defaultLang,
            field_key: 'description',
            value: body.description,
            updated_at: new Date().toISOString()
          })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
