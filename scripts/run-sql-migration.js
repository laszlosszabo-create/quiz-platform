#!/usr/bin/env node
/**
 * Run SQL migration directly on Supabase
 */
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🔧 Adding compared_price column to products table...')
  
  try {
    // Check if column already exists
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'products')
      .eq('column_name', 'compared_price')
    
    if (colError) {
      console.log('Cannot check existing columns, trying to add anyway:', colError.message)
    }
    
    if (columns && columns.length > 0) {
      console.log('✅ compared_price column already exists')
      return
    }
    
    // Add the column using raw SQL via RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: 'ALTER TABLE products ADD COLUMN compared_price DECIMAL(10,2) NULL;'
    })
    
    if (error) {
      console.error('❌ Migration failed:', error.message)
      
      // Try alternative approach
      console.log('Trying alternative approach with direct query...')
      const { error: altError } = await supabase
        .from('products')
        .select('id')
        .limit(1) // This will trigger a schema check
        
      console.log('Direct query result:', altError ? altError.message : 'Success')
      return
    }
    
    console.log('✅ Successfully added compared_price column')
    
    // Verify the column was added
    const { data: verification } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'products')
      .eq('column_name', 'compared_price')
    
    if (verification && verification.length > 0) {
      console.log('✅ Column verification successful:', verification[0])
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error.message)
    console.log('\n💡 You may need to add the column manually in Supabase Dashboard:')
    console.log('   ALTER TABLE products ADD COLUMN compared_price DECIMAL(10,2) NULL;')
    process.exit(1)
  }
}

runMigration()
