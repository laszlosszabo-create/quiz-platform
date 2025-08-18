import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    // Fetch all quizzes with translations
    const { data: quizzes, error } = await supabaseAdmin
      .from('quizzes')
      .select(`
        id,
        slug,
        status,
        default_lang,
        created_at,
        updated_at,
        translations:quiz_translations(lang, field_key, value)
      `)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
    }

    // Transform translations data
    const transformedQuizzes = quizzes.map(quiz => {
      const translations: Record<string, Record<string, string>> = {}
      
      // Group translations by language
      quiz.translations.forEach((t: any) => {
        if (!translations[t.lang]) {
          translations[t.lang] = {}
        }
        translations[t.lang][t.field_key] = t.value
      })

      return {
        id: quiz.id,
        slug: quiz.slug,
        status: quiz.status,
        default_lang: quiz.default_lang,
        created_at: quiz.created_at,
        updated_at: quiz.updated_at,
        translations
      }
    })

    return NextResponse.json({ 
      quizzes: transformedQuizzes,
      count: transformedQuizzes.length
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, default_lang = 'hu' } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    // Create new quiz
    const { data: quiz, error } = await supabaseAdmin
      .from('quizzes')
      .insert([
        {
          title,
          slug,
          status: 'draft',
          default_lang,
          feature_flags: {},
          theme: {}
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
    }

    return NextResponse.json({ quiz }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
