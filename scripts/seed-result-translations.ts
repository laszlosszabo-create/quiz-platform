import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Quiz ID for adhd-quick-check
const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'

const resultTranslations = [
  // Result page translations
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_headline',
    lang: 'hu',
    value: '🎉 Az Eredményed Kész!'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_headline',
    lang: 'en',
    value: '🎉 Your Results Are Ready!'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_sub',
    lang: 'hu',
    value: 'Személyre szabott elemzés és megoldások, amelyek valóban működnek'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_sub',
    lang: 'en',
    value: 'Personalized analysis and solutions that actually work'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_ai_loading',
    lang: 'hu',
    value: 'Személyre szabott elemzést készítünk az Ön válaszai alapján...'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_ai_loading',
    lang: 'en',
    value: 'Creating personalized analysis based on your answers...'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_product_headline',
    lang: 'hu',
    value: '📊 Teljes Részletes Jelentés'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_product_headline',
    lang: 'en',
    value: '📊 Complete Detailed Report'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_product_cta',
    lang: 'hu',
    value: '🚀 Jelentés Azonnali Letöltése'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_product_cta',
    lang: 'en',
    value: '🚀 Download Report Instantly'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_booking_headline',
    lang: 'hu',
    value: 'Ingyenes Szakértői Konzultáció'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_booking_headline',
    lang: 'en',
    value: 'Free Expert Consultation'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_booking_cta',
    lang: 'hu',
    value: '📅 Ingyenes Hívás Foglalása'
  },
  {
    quiz_id: QUIZ_ID,
    field_key: 'result_booking_cta',
    lang: 'en',
    value: '📅 Book Free Call'
  }
]

async function seedResultTranslations() {
  console.log('🌱 Starting result page translations seeding...')
  console.log(`📝 Processing ${resultTranslations.length} translations`)

  let insertedCount = 0
  let updatedCount = 0
  let errorCount = 0

  for (const translation of resultTranslations) {
    try {
      console.log(`\n➤ Processing: ${translation.field_key} (${translation.lang})`)
      
      const { data, error } = await supabase
        .from('quiz_translations')
        .upsert(translation, {
          onConflict: 'quiz_id,field_key,lang'
        })
        .select()

      if (error) {
        console.error(`❌ Error inserting ${translation.field_key} (${translation.lang}):`, error.message)
        errorCount++
      } else {
        if (data && data.length > 0) {
          console.log(`✅ Successfully processed: ${translation.field_key} (${translation.lang})`)
          // Note: upsert doesn't distinguish between insert and update in the response
          insertedCount++
        }
      }
    } catch (error) {
      console.error(`❌ Unexpected error for ${translation.field_key} (${translation.lang}):`, error)
      errorCount++
    }
  }

  console.log('\n🏁 Seeding completed!')
  console.log(`✅ Successfully processed: ${insertedCount} translations`)
  console.log(`❌ Errors: ${errorCount} translations`)
  
  if (errorCount === 0) {
    console.log('\n🎉 All result page translations have been successfully added!')
    console.log('The result page will now display proper Hungarian and English text instead of fallbacks.')
  } else {
    console.log('\n⚠️  Some translations failed to insert. Please check the errors above.')
  }
}

// Run the script
if (require.main === module) {
  seedResultTranslations()
    .then(() => {
      console.log('\n✨ Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script failed with error:', error)
      process.exit(1)
    })
}

export { seedResultTranslations }
