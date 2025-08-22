// Create test session data for testing
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestSession() {
  try {
    // First check table structure
    const { data: existingSessions } = await supabase
      .from('quiz_sessions')
      .select('*')
      .limit(1)
    
    console.log('📋 Table structure:', existingSessions && existingSessions[0] ? Object.keys(existingSessions[0]) : 'No existing sessions')
    
    // Get quiz_id
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id')
      .limit(1)
      .single()
    
    console.log('📋 Quiz ID:', quiz.id)
    
    // Create test session with answers
    const testSession = {
      quiz_id: quiz.id,
      client_token: 'test-token-' + Date.now(),
      state: 'completed', 
      email: 'test@example.com',
      answers: {
        attention_span: 4,
        hyperactivity: 'hyper_high',  
        impulsivity: 'impulse_balanced',
        time_management: 3,
        emotional_regulation: 2,
        organization: 4,
        social_situations: 'social_comfortable',
        daily_functioning: 5
      },
      scores: {},
      lang: 'hu',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
    
    const { data: newSession, error } = await supabase
      .from('quiz_sessions')
      .insert(testSession)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('✅ Created test session:', newSession.id)
    console.log('🎯 Test URL:')
    console.log(`curl "http://localhost:3000/api/debug-ai?session_id=${newSession.id}&compose=quiz"`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createTestSession()
