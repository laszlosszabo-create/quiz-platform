#!/usr/bin/env npx tsx
/**
 * Database Migration: Add compared_price column to products table
 * This adds the compared_price field for discount display functionality
 */

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

async function addComparedPriceColumn() {
  console.log('🔧 Adding compared_price column to products table...')
  
  try {
    // Check if column already exists
    const { data: columns } = await supabase
      .rpc('get_table_columns', { table_name: 'products' })
    
    const hasComparedPrice = columns?.some((col: any) => col.column_name === 'compared_price')
    
    if (hasComparedPrice) {
      console.log('✅ Column compared_price already exists')
      return
    }

    // Add the column using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN compared_price DECIMAL(10,2) NULL;
        
        COMMENT ON COLUMN products.compared_price IS 'Original price for discount display (optional)';
      `
    })

    if (error) {
      console.error('❌ Error adding column:', error)
      
      // Try alternative approach
      console.log('🔄 Trying alternative method...')
      const { error: altError } = await supabase
        .from('products')
        .select('compared_price')
        .limit(1)
      
      if (altError && altError.message.includes('column "compared_price" does not exist')) {
        console.log('⚠️  Column does not exist. Manual database migration required.')
        console.log('📋 Please run this SQL command in your Supabase SQL editor:')
        console.log('')
        console.log('ALTER TABLE products ADD COLUMN compared_price DECIMAL(10,2) NULL;')
        console.log("COMMENT ON COLUMN products.compared_price IS 'Original price for discount display (optional)';")
        console.log('')
      } else {
        console.log('✅ Column appears to exist already')
      }
    } else {
      console.log('✅ Successfully added compared_price column')
    }

    // Test the column by updating existing products
    console.log('🧪 Testing column functionality...')
    
    const { data: testProducts, error: selectError } = await supabase
      .from('products')
      .select('id, price, compared_price')
      .limit(1)
    
    if (selectError) {
      console.log('⚠️  Column test failed:', selectError.message)
    } else {
      console.log('✅ Column is accessible')
      if (testProducts && testProducts.length > 0) {
        console.log(`📊 Sample product: price=${testProducts[0].price}, compared_price=${testProducts[0].compared_price}`)
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('')
    console.log('📋 Manual migration steps:')
    console.log('1. Go to your Supabase SQL Editor')
    console.log('2. Run: ALTER TABLE products ADD COLUMN compared_price DECIMAL(10,2) NULL;')
    console.log('3. Optional: COMMENT ON COLUMN products.compared_price IS \'Original price for discount display\';')
  }
}

addComparedPriceColumn().then(() => {
  console.log('🏁 Migration completed')
  process.exit(0)
}).catch(error => {
  console.error('💥 Migration failed:', error)
  process.exit(1)
})
