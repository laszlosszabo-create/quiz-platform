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
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Fetch all quizzes with translations
    const { data: quizzes, error } = await supabaseAdmin
      .from('quizzes')
      .select(`
        id,
        title,
        slug,
        status,
        default_lang,
        translations:quiz_translations(lang, field_key, value)
      `)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
    }

    // Transform translations data
    const transformedData = quizzes.map(quiz => {
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
        title: quiz.title,
        slug: quiz.slug,
        status: quiz.status,
        default_lang: quiz.default_lang,
        translations
      }
    })

    if (format === 'csv') {
      // Generate CSV export
      const csvData = generateCSV(transformedData)
      
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="translations_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // JSON export
      const jsonData = JSON.stringify(transformedData, null, 2)
      
      return new NextResponse(jsonData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="translations_${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return ''

  // Get all unique field keys across all quizzes
  const allFields = new Set<string>()
  data.forEach(quiz => {
    Object.values(quiz.translations).forEach((lang: any) => {
      Object.keys(lang).forEach(field => allFields.add(field))
    })
  })

  const fieldArray = Array.from(allFields).sort()
  
  // CSV header
  const header = [
    'Quiz ID',
    'Quiz Title', 
    'Quiz Slug',
    'Status',
    'Default Language',
    ...fieldArray.flatMap(field => [`${field}_hu`, `${field}_en`])
  ]

  // CSV rows
  const rows = data.map(quiz => {
    const row = [
      quiz.id,
      quiz.title,
      quiz.slug,
      quiz.status,
      quiz.default_lang
    ]

    // Add translation values
    fieldArray.forEach(field => {
      row.push(quiz.translations.hu?.[field] || '')
      row.push(quiz.translations.en?.[field] || '')
    })

    return row
  })

  // Combine header and rows
  const allRows = [header, ...rows]
  
  // Convert to CSV string
  return allRows
    .map(row => 
      row.map(cell => {
        const str = String(cell || '')
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }).join(',')
    )
    .join('\n')
}
