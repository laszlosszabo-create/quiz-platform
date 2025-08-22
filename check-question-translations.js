// Check if we have any translations for questions
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.error('Missing Supabase key!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTranslationData() {
  try {
    console.log('🔍 Checking translation data for questions...')
    
    // Get first few questions
    const { data: questions, error: qError } = await supabase
      .from('quiz_questions')
      .select('*')
      .limit(3)
    
    if (qError) throw qError
    console.log('📋 Sample questions:', questions?.map(q => ({ key: q.key, type: q.type })))
    
    // Check if we have translations for these question keys
    if (questions && questions.length > 0) {
      const questionKeys = questions.map(q => q.key)
      const { data: translations, error: tError } = await supabase
        .from('quiz_translations')
        .select('*')
        .in('key', questionKeys)
        .eq('lang', 'hu')
      
      if (tError) throw tError
      console.log(`🌐 Found ${translations?.length || 0} translations for question keys`)
      if (translations && translations.length > 0) {
        translations.forEach(t => console.log(`- ${t.key}: "${t.value}"`))
      }
    }
    
    // Also check for any scale option translations
    const { data: scaleTranslations } = await supabase
      .from('quiz_translations')
      .select('*')
      .like('key', 'scale_%')
      .eq('lang', 'hu')
      .limit(5)
    
    console.log(`🎚️ Found ${scaleTranslations?.length || 0} scale option translations`)
    scaleTranslations?.forEach(t => console.log(`- ${t.key}: "${t.value}"`))
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkTranslationData()
