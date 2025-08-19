#!/usr/bin/env node
/**
 * Direct API Test - Products with compared_price
 */

const fetch = require('node-fetch');

async function testProductsAPI() {
  console.log('🔧 Testing Products API with compared_price...');
  
  const productData = {
    quiz_id: 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291',
    name: 'ADHD Kezelési Csomag - Akció Teszt',
    description: 'Teljes ADHD program kedvezményes áron',
    price: 15000,
    compared_price: 25000,
    currency: 'HUF',
    active: true,
    stripe_product_id: '',
    stripe_price_id: '',
    booking_url: ''
  };

  try {
    console.log('📡 Sending POST request...');
    
    const response = await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData),
      timeout: 10000
    });

    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Product created:');
      console.log('📦 Product Data:');
      console.log(`   Name: ${data.name}`);
      console.log(`   Price: ${data.price} ${data.currency}`);
      console.log(`   Compared Price: ${data.compared_price} ${data.currency}`);
      console.log(`   Discount: ${Math.round((1 - data.price / data.compared_price) * 100)}%`);
      console.log('🎉 COMPARED_PRICE FUNCTIONALITY WORKING!');
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status}`);
      console.log(`📄 Error Details: ${errorText}`);
    }

  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
    console.log('ℹ️  This might mean the API route hasn\'t been compiled yet');
    console.log('🔄 Try accessing the admin interface first to trigger compilation');
  }
}

testProductsAPI();
