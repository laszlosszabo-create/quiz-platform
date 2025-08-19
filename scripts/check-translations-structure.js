#!/usr/bin/env node

/**
 * QUIZ TRANSLATIONS TÁBLA SZERKEZET ELLENŐRZÉSE
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Hiányzó Supabase környezeti változók!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTranslationsTable() {
  console.log('🔍 QUIZ TRANSLATIONS TÁBLA SZERKEZET')
  console.log('=======================================')
  
  try {
    // Get table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'quiz_translations' })
    
    if (columnsError) {
      console.log('⚠️  RPC hívás sikertelen, próbáljuk közvetlen lekérdezéssel...')
      
      // Try direct query
      const { data: sample, error: sampleError } = await supabase
        .from('quiz_translations')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.error('❌ Tábla lekérdezés sikertelen:', sampleError.message)
        return
      }
      
      if (sample && sample.length > 0) {
        console.log('📋 Oszlopok (minta alapján):')
        Object.keys(sample[0]).forEach(col => {
          console.log(`  - ${col}`)
        })
      } else {
        console.log('📋 Tábla üres, oszlopok nem meghatározhatók')
      }
    } else {
      console.log('📋 Oszlopok:')
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`)
      })
    }
    
    // Check for existing translations
    const { data: existingCount, error: countError } = await supabase
      .from('quiz_translations')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Számlálás sikertelen:', countError.message)
    } else {
      console.log(`📊 Meglévő fordítások száma: ${existingCount || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Ellenőrzés sikertelen:', error)
  }
}

if (require.main === module) {
  checkTranslationsTable()
}
