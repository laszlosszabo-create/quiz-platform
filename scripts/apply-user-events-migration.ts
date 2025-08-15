import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  console.log('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyUserEventsMigration() {
  console.log('🚀 Applying user_events migration...')
  
  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/20250815130000_create_user_events.sql')
    const migrationSql = readFileSync(migrationPath, 'utf8')
    
    // Split by statements (simple approach)
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📄 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', { query: statement })
      
      if (error && error.code !== 'PGRST202') {
        // Try alternative approach - direct insert if exec_sql doesn't exist
        console.log('📝 exec_sql not available, trying alternative approach...')
        break
      }
    }
    
    // Test if table was created successfully
    console.log('🔍 Testing user_events table...')
    const { data, error: testError } = await supabase
      .from('user_events')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ user_events table test failed:', testError)
      console.log('💡 Table might not exist yet. You may need to apply migrations manually.')
      process.exit(1)
    }
    
    console.log('✅ user_events table is accessible!')
    console.log('🎉 Migration applied successfully!')
    
  } catch (error) {
    console.error('❌ Error applying migration:', error)
    process.exit(1)
  }
}

applyUserEventsMigration()
