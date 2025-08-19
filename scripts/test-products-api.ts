#!/usr/bin/env tsx

import { config } from 'dotenv'
config({ path: '.env.local' })

async function testProductsAPI() {
  console.log('🧪 Testing Products API endpoint...')
  
  const testData = {
    quiz_id: 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291',
    name: 'API Test Product',
    description: 'Test Description',
    price: 5990,
    currency: 'HUF',
    active: true,
    stripe_product_id: '',
    stripe_price_id: '',
    booking_url: ''
  }
  
  console.log('📤 Sending data:')
  console.log(JSON.stringify(testData, null, 2))
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📥 Response status:', response.status)
    
    const result = await response.json()
    console.log('📋 Response body:')
    console.log(JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error('❌ API test error:', error)
  }
}

testProductsAPI()
