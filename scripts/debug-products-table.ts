#!/usr/bin/env tsx

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

async function checkProductsTable() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  console.log('🔍 Checking products table structure and data...')
  
  try {
    // Get existing products to understand the structure
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Products table error:', error)
    } else {
      console.log('📊 Sample products found:', products?.length || 0)
      if (products && products.length > 0) {
        console.log('📋 Sample product structure:')
        console.log(JSON.stringify(products[0], null, 2))
      } else {
        console.log('📝 No products found in table')
      }
    }
    
    // Test create with the current frontend data structure
    const testProductData = {
      quiz_id: 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291',
      name: 'Test Product',
      description: 'Test Description',
      price: 5990,
      currency: 'HUF',
      active: true,
      stripe_product_id: null,
      stripe_price_id: null,
      booking_url: null
    }
    
    console.log('\n🧪 Testing product creation with data:')
    console.log(JSON.stringify(testProductData, null, 2))
    
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert(testProductData)
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Product creation failed:', createError)
    } else {
      console.log('✅ Product created successfully:')
      console.log(JSON.stringify(newProduct, null, 2))
      
      // Clean up test product
      await supabase
        .from('products')
        .delete()
        .eq('id', newProduct.id)
      console.log('🧹 Test product cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkProductsTable()
