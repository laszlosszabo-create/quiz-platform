// Check quiz_translations table structure
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTableStructure() {
  try {
    console.log('🔍 Checking quiz_translations table structure...')
    
    // Get a few rows to see the structure
    const { data, error } = await supabase
      .from('quiz_translations')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    console.log(`📋 Found ${data?.length || 0} rows`)
    if (data && data.length > 0) {
      console.log('🏗️  Table structure (first row):', Object.keys(data[0]))
      console.log('📄 Sample data:', data)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkTableStructure()
