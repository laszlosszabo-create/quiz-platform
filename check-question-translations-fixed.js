// Check quiz_translations for question texts
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkQuestionTranslations() {
  try {
    console.log('🔍 Searching for question translations...')
    
    // Get quiz_id first
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('id, slug')
      .limit(1)
      .single()
    
    console.log('🧩 Quiz:', quiz)
    
    // Look for question-related translations
    const { data: questionTranslations } = await supabase
      .from('quiz_translations')
      .select('*')
      .eq('quiz_id', quiz.id)
      .or('field_key.ilike.question_%,field_key.ilike.%attention%,field_key.ilike.%hyperactivity%')
      .eq('lang', 'hu')
    
    console.log(`📋 Found ${questionTranslations?.length || 0} question-related translations`)
    questionTranslations?.forEach(t => console.log(`- ${t.field_key}: "${t.value}"`))
    
    // Also check for specific question keys we know exist
    const questionKeys = ['attention_span', 'hyperactivity', 'impulsivity']
    for (const key of questionKeys) {
      const { data: specificTranslation } = await supabase
        .from('quiz_translations')
        .select('*')
        .eq('quiz_id', quiz.id)
        .eq('field_key', key)
        .eq('lang', 'hu')
        .maybeSingle()
      
      if (specificTranslation) {
        console.log(`✅ Found translation for ${key}: "${specificTranslation.value}"`)
      } else {
        console.log(`❌ No translation found for ${key}`)
      }
    }
    
    // Check all translations to see what we have
    const { data: allTranslations } = await supabase
      .from('quiz_translations')
      .select('field_key')
      .eq('quiz_id', quiz.id)
      .eq('lang', 'hu')
    
    const allKeys = allTranslations?.map(t => t.field_key) || []
    console.log(`🗝️  All translation keys (${allKeys.length}):`, allKeys.slice(0, 10).join(', '))
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkQuestionTranslations()
