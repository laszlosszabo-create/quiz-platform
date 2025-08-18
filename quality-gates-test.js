// Quality Gates Testing Script for Products Editor
// Run with: node quality-gates-test.js

const http = require('http');
const { URL } = require('url');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });
let TEST_QUIZ_ID = process.env.TEST_QUIZ_ID || null;
const BASE_URL = 'http://localhost:3000/api/admin/products';
let createdProductId = null;

// Supabase client for resolving quiz id dynamically
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resolveQuizIdBySlug(slug = 'adhd-quick-check') {
  if (TEST_QUIZ_ID) return TEST_QUIZ_ID;
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error) {
      console.error('Failed to resolve quiz id by slug:', error.message);
      return null;
    }
    TEST_QUIZ_ID = data?.id || null;
    return TEST_QUIZ_ID;
  } catch (e) {
    console.error('Error resolving quiz id:', e.message);
    return null;
  }
}

// Helper function to make HTTP requests
function makeRequest(method, urlString, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runQualityGates() {
  console.log('🧪 Starting Quality Gates Testing...');
  console.log('Time:', new Date().toISOString());
  console.log('');

  const results = [];

  try {
  // Resolve quiz id dynamically to avoid stale cache after reseed
  TEST_QUIZ_ID = await resolveQuizIdBySlug('adhd-quick-check');
  if (!TEST_QUIZ_ID) throw new Error('Could not resolve TEST_QUIZ_ID by slug');

    // Test 1: POST - Create Product
    console.log('📝 Test 1: POST - Create Product');
    const createData = {
      quiz_id: TEST_QUIZ_ID,
      name: 'QA Test Product',
      description: 'Quality gates testing product',
      price: 2990,
      currency: 'HUF',
      active: true,
      booking_url: 'https://example.com/book-qa-test',
      metadata: { test: true, created_by: 'quality-gates' }
    };

    const createResponse = await makeRequest('POST', BASE_URL, createData);
    console.log('Status:', createResponse.status);
    console.log('Response:', JSON.stringify(createResponse.data, null, 2));
    
    if (createResponse.status === 200 || createResponse.status === 201) {
      createdProductId = createResponse.data?.id;
      results.push({ test: 'POST Create', status: 'PASS', notes: `Created product ID: ${createdProductId}` });
    } else {
      results.push({ test: 'POST Create', status: 'FAIL', notes: `Status: ${createResponse.status}` });
    }
    console.log('');

    // Test 2: GET - List with filter
    if (createdProductId) {
      console.log('📋 Test 2: GET - List with filter');
      const listResponse = await makeRequest('GET', `${BASE_URL}?quiz_id=${TEST_QUIZ_ID}`);
      console.log('Status:', listResponse.status);
      
      const foundProduct = listResponse.data?.products?.find(p => p.id === createdProductId);
      if (foundProduct) {
        results.push({ test: 'GET List Filter', status: 'PASS', notes: 'Product found in filtered list' });
      } else {
        results.push({ test: 'GET List Filter', status: 'FAIL', notes: 'Product not found in list' });
      }
      console.log('');

      // Test 3: PUT - Update Product
      console.log('✏️ Test 3: PUT - Update Product');
      const updateData = {
        price: 3490,
        active: false
      };
      
      const updateResponse = await makeRequest('PUT', `${BASE_URL}/${createdProductId}`, updateData);
      console.log('Status:', updateResponse.status);
      
      if (updateResponse.status === 200) {
        results.push({ test: 'PUT Update', status: 'PASS', notes: 'Product updated successfully' });
      } else {
        results.push({ test: 'PUT Update', status: 'FAIL', notes: `Status: ${updateResponse.status}` });
      }
      console.log('');

      // Test 4: GET - Verify Update
      console.log('🔍 Test 4: GET - Verify Update');
      const getResponse = await makeRequest('GET', `${BASE_URL}/${createdProductId}`);
      
      if (getResponse.status === 200) {
        const product = getResponse.data;
        const priceUpdated = product.price === 3490;
        const activeUpdated = product.active === false;
        
        if (priceUpdated && activeUpdated) {
          results.push({ test: 'GET Verify Update', status: 'PASS', notes: 'Updates verified' });
        } else {
          results.push({ test: 'GET Verify Update', status: 'FAIL', notes: `Price: ${priceUpdated}, Active: ${activeUpdated}` });
        }
      }
      console.log('');

      // Test 5: DELETE - Remove Product
      console.log('🗑️ Test 5: DELETE - Remove Product');
      const deleteResponse = await makeRequest('DELETE', `${BASE_URL}/${createdProductId}`);
      console.log('Status:', deleteResponse.status);
      
      if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        results.push({ test: 'DELETE Remove', status: 'PASS', notes: 'Product deleted successfully' });
      } else {
        results.push({ test: 'DELETE Remove', status: 'FAIL', notes: `Status: ${deleteResponse.status}` });
      }
      console.log('');
    }

    // Test 6: Validation Tests
    console.log('⚠️ Test 6: Validation - HUF Decimal Price');
    const invalidHUFData = {
      quiz_id: TEST_QUIZ_ID,
      name: 'Invalid HUF Test',
      price: 2990.50,  // Decimal price with HUF
      currency: 'HUF',
      active: true
    };
    
    const validationResponse = await makeRequest('POST', BASE_URL, invalidHUFData);
    console.log('Status:', validationResponse.status);
    
    if (validationResponse.status >= 400) {
      results.push({ test: 'Validation HUF Decimal', status: 'PASS', notes: 'Correctly rejected decimal HUF price' });
    } else {
      results.push({ test: 'Validation HUF Decimal', status: 'FAIL', notes: 'Should reject decimal HUF price' });
    }
    console.log('');

    // Test 7: Invalid Quiz ID
    console.log('⚠️ Test 7: Validation - Invalid Quiz ID');
    const invalidQuizData = {
      quiz_id: '00000000-0000-0000-0000-000000000000',
      name: 'Invalid Quiz Test',
      price: 1000,
      currency: 'HUF',
      active: true
    };
    
    const invalidQuizResponse = await makeRequest('POST', BASE_URL, invalidQuizData);
    console.log('Status:', invalidQuizResponse.status);
    
    if (invalidQuizResponse.status >= 400) {
      results.push({ test: 'Validation Invalid Quiz', status: 'PASS', notes: 'Correctly rejected invalid quiz_id' });
    } else {
      results.push({ test: 'Validation Invalid Quiz', status: 'FAIL', notes: 'Should reject invalid quiz_id' });
    }

  } catch (error) {
    console.error('Test Error:', error.message);
    results.push({ test: 'General', status: 'FAIL', notes: `Error: ${error.message}` });
  }

  // Print Results Summary
  console.log('');
  console.log('📊 Quality Gates Results:');
  console.log('=========================');
  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.test}: ${result.status} - ${result.notes}`);
  });

  const passCount = results.filter(r => r.status === 'PASS').length;
  const totalCount = results.length;
  
  console.log('');
  console.log(`Overall: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All Quality Gates PASSED - Ready for Production!');
  } else {
    console.log('🚨 Some Quality Gates FAILED - Needs Investigation');
  }
}

// Run the tests
runQualityGates().catch(console.error);
