#!/usr/bin/env tsx

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

async function debugScoringRules() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'
  
  console.log('🔍 Debugging scoring rules for quiz:', quizId)
  
  try {
    // Get quiz info
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id, slug')
      .eq('id', quizId)
      .single()
    
    if (quizError) throw quizError
    console.log('📊 Quiz:', quiz)
    
    // Get scoring rules
    const { data: scoringRules, error: rulesError } = await supabase
      .from('quiz_scoring_rules')
      .select('*')
      .eq('quiz_id', quizId)
    
    if (rulesError) throw rulesError
    console.log('🎯 Scoring rules found:', scoringRules?.length || 0)
    
    if (scoringRules && scoringRules.length > 0) {
      scoringRules.forEach((rule, index) => {
        console.log(`\n📋 Rule ${index + 1}:`)
        console.log('  ID:', rule.id)
        console.log('  Rule Type:', rule.rule_type)
        console.log('  Weights:', JSON.stringify(rule.weights, null, 2))
        console.log('  Thresholds:', JSON.stringify(rule.thresholds, null, 2))
      })
    } else {
      console.log('❌ No scoring rules found for this quiz')
    }
    
    // Get a sample session to test scoring
    const { data: sessions, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('id, answers, scores, state')
      .eq('quiz_id', quizId)
      .limit(1)
    
    if (sessionError) {
      console.log('⚠️  Session query error:', sessionError)
    } else if (sessions && sessions.length > 0) {
      const session = sessions[0]
      console.log('\n🧪 Sample session:')
      console.log('  ID:', session.id)
      console.log('  State:', session.state)
      console.log('  Answers keys:', Object.keys(session.answers || {}))
      console.log('  Current scores:', session.scores)
    } else {
      console.log('❌ No sessions found for this quiz')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugScoringRules()
