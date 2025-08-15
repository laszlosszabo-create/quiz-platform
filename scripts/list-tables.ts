import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listTables() {
  console.log('🔍 Checking available tables...')
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name')
    
    if (error) {
      console.error('❌ Error listing tables:', error)
      return
    }
    
    console.log('📋 Available tables in public schema:')
    data.forEach(table => console.log(`  - ${table.table_name}`))
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

listTables()
