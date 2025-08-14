#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('🔌 Connecting to Supabase...')
console.log(`URL: ${supabaseUrl}`)
console.log(`Service Key: ${supabaseServiceKey.substring(0, 20)}...`)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runQuickSetup() {
  try {
    console.log('🏗️  Running quick database setup...')
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'quick-setup.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')
    
    console.log('📄 Executing SQL schema creation...')
    
    // Split SQL into individual statements to avoid issues
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec', { sql: statement })
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} warning:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} error:`, err.message)
      }
    }
    
    console.log('🎉 Quick setup completed!')
    console.log('🌱 Now running seed data...')
    
    // Now run the seed script
    const { exec } = require('child_process')
    exec('npm run seed', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Seed failed:', error)
        return
      }
      console.log(stdout)
      if (stderr) console.error(stderr)
      
      console.log('🎊 Database is ready!')
      console.log('🌐 Test at: http://localhost:3000/hu/adhd-quick-check')
    })
    
  } catch (error) {
    console.error('💥 Quick setup failed:', error)
    process.exit(1)
  }
}

runQuickSetup()
