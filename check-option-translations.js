// Check option translations
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkOptionTranslations() {
  try {
    const quiz_id = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'
    
    console.log('🔍 Looking for option translations...')
    
    // Look for option translations
    const { data: optionTranslations } = await supabase
      .from('quiz_translations')
      .select('*')
      .eq('quiz_id', quiz_id)
      .like('field_key', 'option:%')
      .eq('lang', 'hu')
    
    console.log(`📋 Found ${optionTranslations?.length || 0} option translations`)
    optionTranslations?.forEach(t => console.log(`- ${t.field_key}: "${t.value}"`))
    
    // Check specific ones we know exist
    const optionKeys = ['hyper_high', 'impulse_balanced', 'social_comfortable']
    for (const key of optionKeys) {
      const { data: specificTranslation } = await supabase
        .from('quiz_translations')
        .select('*')
        .eq('quiz_id', quiz_id)
        .eq('field_key', `option:${key}:text`)
        .eq('lang', 'hu')
        .maybeSingle()
      
      if (specificTranslation) {
        console.log(`✅ Found translation for ${key}: "${specificTranslation.value}"`)
      } else {
        console.log(`❌ No translation found for option:${key}:text`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkOptionTranslations()
