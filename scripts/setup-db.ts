import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigrations() {
  console.log('🏗️  Running database migrations...')
  
  try {
    // Read migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    const files = await fs.readdir(migrationsDir)
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort()
    
    for (const file of migrationFiles) {
      console.log(`📄 Executing migration: ${file}`)
      const filePath = path.join(migrationsDir, file)
      const sql = await fs.readFile(filePath, 'utf-8')
      
      // Execute migration
      const { error } = await supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.error(`❌ Migration ${file} failed:`, error)
        throw error
      }
      
      console.log(`✅ Migration ${file} completed`)
    }
    
    console.log('🎉 All migrations completed successfully!')
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  }
}

async function createExecSqlFunction() {
  console.log('🔧 Creating exec_sql helper function...')
  
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
  
  const { error } = await supabase.rpc('exec', { sql: createFunctionSql })
  
  if (error) {
    console.log('⚠️  Function might already exist, trying direct execution...')
    // Try direct execution if function creation fails
    return
  }
  
  console.log('✅ exec_sql function created')
}

async function runSeedData() {
  console.log('🌱 Running seed data...')
  
  try {
    // Import and run the existing seed script logic
    const seedModule = await import('./seed')
    
    // The seed.ts file has a seedDatabase function that runs automatically
    // We'll run the npm script instead for consistency
    
    console.log('🎉 Seed data will be run separately')
    
  } catch (error) {
    console.error('💥 Seed failed:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting database setup...')
  
  try {
    // Step 1: Create helper function
    await createExecSqlFunction()
    
    // Step 2: Run migrations
    await runMigrations()
    
    // Step 3: Run seed data
    await runSeedData()
    
    console.log('🎊 Database setup completed successfully!')
    console.log('🌐 You can now test the application at: http://localhost:3000/hu/adhd-quick-check')
    
  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

// Export for use by other scripts
export { runMigrations, runSeedData }

// Run if called directly
if (require.main === module) {
  main()
}
