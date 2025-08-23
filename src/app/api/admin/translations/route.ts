import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - List all translations for a quiz
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const quizId = searchParams.get('quiz_id')

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    const { data: translations, error } = await supabase
      .from('quiz_translations')
      .select('*')
      .eq('quiz_id', quizId)
      .order('field_key', { ascending: true })
      .order('lang', { ascending: true })

    if (error) {
      console.error('Error fetching translations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      translations: translations || []
    })

  } catch (error: any) {
    console.error('Translations API GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create new translations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { translations } = body

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json({ error: 'Translations array is required' }, { status: 400 })
    }

    // Validate each translation
    for (const translation of translations) {
      if (!translation.quiz_id || !translation.field_key || !translation.lang || !translation.value) {
        return NextResponse.json({ 
          error: 'Each translation must have quiz_id, field_key, lang, and value' 
        }, { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from('quiz_translations')
      .insert(translations)
      .select()

    if (error) {
      console.error('Error creating translations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      translations: data
    })

  } catch (error: any) {
    console.error('Translations API POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update existing translations
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { translations } = body

    if (!Array.isArray(translations) || translations.length === 0) {
      return NextResponse.json({ error: 'Translations array is required' }, { status: 400 })
    }

    // Group incoming translations by quiz_id and lang to perform delete-then-insert
    const byQuizAndLang: Record<
      string,
      Record<string, Array<{ quiz_id: string; field_key: string; lang: string; value: string }>>
    > = {}

    for (const t of translations) {
      if (!t || !t.quiz_id || !t.field_key || !t.lang || typeof t.value !== 'string') {
        continue
      }
      byQuizAndLang[t.quiz_id] = byQuizAndLang[t.quiz_id] || {}
      byQuizAndLang[t.quiz_id][t.lang] = byQuizAndLang[t.quiz_id][t.lang] || []
      byQuizAndLang[t.quiz_id][t.lang].push({ quiz_id: t.quiz_id, field_key: t.field_key, lang: t.lang, value: t.value })
    }

    const results: any[] = []

    for (const quizId of Object.keys(byQuizAndLang)) {
      const langs = byQuizAndLang[quizId]
      for (const lang of Object.keys(langs)) {
        const rows = langs[lang]
        const fieldKeys = rows.map(r => r.field_key)

        try {
          // Delete any existing rows for this quiz/lang + these keys
          const { error: delError } = await supabase
            .from('quiz_translations')
            .delete()
            .eq('quiz_id', quizId)
            .eq('lang', lang)
            .in('field_key', fieldKeys)

          if (delError) {
            console.error('Error deleting existing translations for quiz', quizId, 'lang', lang, delError)
          }

          // Insert the new/updated rows
          const toInsert = rows.map(r => ({ ...r, updated_at: new Date().toISOString() }))
          const { data: inserted, error: insertError } = await supabase
            .from('quiz_translations')
            .insert(toInsert)
            .select()

          if (insertError) {
            console.error('Error inserting translations for quiz', quizId, 'lang', lang, insertError)
            continue
          }

          if (inserted) results.push(...inserted)
        } catch (err: any) {
          console.error('Unexpected error updating translations for', quizId, lang, err)
          continue
        }
      }
    }

    return NextResponse.json({ success: true, translations: results })

  } catch (error: any) {
    console.error('Translations API PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove translations by key
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const quizId = searchParams.get('quiz_id')
    const fieldKey = searchParams.get('field_key')

    if (!quizId || !fieldKey) {
      return NextResponse.json({ error: 'Quiz ID and field key are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('quiz_translations')
      .delete()
      .eq('quiz_id', quizId)
      .eq('field_key', fieldKey)

    if (error) {
      console.error('Error deleting translations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Translations for key "${fieldKey}" deleted successfully`
    })

  } catch (error: any) {
    console.error('Translations API DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
