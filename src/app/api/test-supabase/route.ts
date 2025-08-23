import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    const supabase = getSupabaseAdmin()
    
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('id, slug, status')
      .eq('slug', 'adhd-quick-check')
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    if (!quizzes) {
      console.log('❌ Quiz not found')
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz not found' 
      }, { status: 404 })
    }

    console.log('✅ Quiz found:', quizzes)
    return NextResponse.json({ 
      success: true, 
      quiz: quizzes,
      env_check: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET'
      }
    })

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}
