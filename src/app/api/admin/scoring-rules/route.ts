import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')
    
    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('quiz_scoring_rules')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch scoring rules:', error)
      return NextResponse.json({ error: 'Failed to fetch scoring rules' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Scoring rules API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quiz_id, rule_type, weights } = body

    if (!quiz_id || !rule_type || !weights) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('quiz_scoring_rules')
      .insert([{
        quiz_id,
        rule_type,
        weights
      }])
      .select()
      .single()

    if (error) {
      console.error('Failed to create scoring rule:', error)
      return NextResponse.json({ error: 'Failed to create scoring rule' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Scoring rules API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, quiz_id, rule_type, weights } = body

    if (!id || !quiz_id || !rule_type || !weights) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('quiz_scoring_rules')
      .update({
        quiz_id,
        rule_type,
        weights
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update scoring rule:', error)
      return NextResponse.json({ error: 'Failed to update scoring rule' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Scoring rules API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('quiz_scoring_rules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete scoring rule:', error)
      return NextResponse.json({ error: 'Failed to delete scoring rule' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Scoring rules API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
