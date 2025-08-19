#!/usr/bin/env node

/**
 * HIÁNYZÓ ANGOL FORDÍTÁSOK HOZZÁADÁSA TESZTELÉSHEZ
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Hiányzó Supabase környezeti változók!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'

// Néhány hiányzó fordítás teszteléshez
const testTranslations = {
  // Quiz oldal fordítások (hiányzó angol)
  'quiz_start_button': {
    'hu': 'Quiz Indítása'
  },
  'quiz_next_question': {
    'hu': 'Következő kérdés'
  },
  'quiz_previous_question': {
    'hu': 'Előző kérdés', 
    'en': 'Previous Question'
  },
  
  // Eredmény oldal fordítások
  'result_summary': {
    'hu': 'Eredmény összefoglalás',
    'en': 'Result Summary'
  },
  'score_breakdown': {
    'hu': 'Pontok lebontása'
  },
  
  // Email sablonok
  'email_welcome_subject': {
    'hu': 'Üdvözlünk!',
    'en': 'Welcome!'
  },
  'email_result_body': {
    'hu': 'Itt az eredményed!'
  },
  
  // Hibaüzenetek
  'error_network_failed': {
    'hu': 'Hálózati hiba történt',
    'en': 'Network error occurred'
  },
  'error_invalid_input': {
    'hu': 'Érvénytelen bemeneti adat'
  }
}

async function addTestTranslations() {
  console.log('🧪 TESZT FORDÍTÁSOK HOZZÁADÁSA')
  console.log('==============================')
  
  try {
    let addedCount = 0
    
    for (const [key, translations] of Object.entries(testTranslations)) {
      for (const [lang, value] of Object.entries(translations)) {
        // Check if translation already exists
        const { data: existing } = await supabase
          .from('quiz_translations')
          .select('id')
          .eq('quiz_id', QUIZ_ID)
          .eq('field_key', key)
          .eq('lang', lang)
          .single()
        
        if (!existing) {
          // Insert new translation
          const { error } = await supabase
            .from('quiz_translations')
            .insert({
              quiz_id: QUIZ_ID,
              field_key: key,
              lang,
              value
            })
          
          if (error) {
            console.error(`❌ Hiba: ${key} (${lang})`, error.message)
          } else {
            console.log(`✅ Hozzáadva: ${key} (${lang}) = "${value}"`)
            addedCount++
          }
        } else {
          console.log(`⚠️  Már létezik: ${key} (${lang})`)
        }
      }
    }
    
    console.log(`\n📊 ÖSSZESÍTŐ: ${addedCount} új teszt fordítás hozzáadva`)
    console.log(`🔍 Most tesztelheted a szűrőket!`)
    
  } catch (error) {
    console.error('❌ Teszt fordítások hozzáadása sikertelen:', error)
  }
}

if (require.main === module) {
  addTestTranslations()
}
