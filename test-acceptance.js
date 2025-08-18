// Complete CRUD Testing with Evidence Collection
// Run with: node test-acceptance.js

require('dotenv').config({ path: '.env.local' });
const http = require('http');
const { URL } = require('url');
const { createClient } = require('@supabase/supabase-js');

let TEST_QUIZ_ID = process.env.TEST_QUIZ_ID || null;
const BASE_URL = 'http://localhost:3000/api/admin/products';
let createdProductId = null;

// Supabase client for audit log checking
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

// Check audit logs for specific resource
async function checkAuditLogs(resourceId = null) {
  try {
    let query = supabase
      .from('audit_logs')
      .select('action, resource_type, resource_id, user_email, created_at')
      .eq('resource_type', 'product')
      .order('created_at', { ascending: false });
    
    if (resourceId) {
      query = query.eq('resource_id', resourceId);
    }
    
    const { data, error } = await query.limit(10);
    
    if (error) {
      console.error('Audit log error:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Audit log check failed:', error.message);
    return [];
  }
}

async function runCompleteTest() {
  console.log('🧪 Starting Complete CRUD + Audit + Validation Testing...');
  console.log('Time:', new Date().toISOString());
  console.log('');

  const results = [];

  try {
  // Resolve quiz id dynamically to avoid stale cache after reseed
  TEST_QUIZ_ID = await resolveQuizIdBySlug('adhd-quick-check');
  if (!TEST_QUIZ_ID) throw new Error('Could not resolve TEST_QUIZ_ID by slug');

    // Sleep to ensure server is ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 1. PROOF: POST → GET Match
    console.log('📝 PROOF 1: POST → GET Match Test');
    const createData = {
      quiz_id: TEST_QUIZ_ID,
      name: 'Audit Test Product',
      description: 'Complete testing with audit trail',
      price: 2990,
      currency: 'HUF',
      active: true,
      booking_url: 'https://test.example.com/book',
      metadata: { test: true, proof: 'post-get-match' }
    };

    console.log('Creating product...');
    const createResponse = await makeRequest('POST', BASE_URL, createData);
    console.log('POST Status:', createResponse.status);
    
    if (createResponse.status === 200 || createResponse.status === 201) {
      createdProductId = createResponse.data?.id;
      console.log('✅ Product created with ID:', createdProductId);
      
      // Immediate GET to verify
      console.log('Verifying with GET...');
      const getResponse = await makeRequest('GET', `${BASE_URL}/${createdProductId}`);
      
      if (getResponse.status === 200) {
        const product = getResponse.data;
        const matches = {
          name: product.name === createData.name,
          price: product.price === createData.price,
          currency: product.currency === createData.currency,
          booking_url: product.booking_url === createData.booking_url,
          active: product.active === createData.active
        };
        
        const allMatch = Object.values(matches).every(Boolean);
        console.log('Field matches:', matches);
        
        if (allMatch) {
          console.log('✅ POST→GET match: PASS');
          results.push({ test: 'POST→GET Match', status: 'PASS', notes: 'All fields match exactly' });
        } else {
          console.log('❌ POST→GET match: FAIL');
          results.push({ test: 'POST→GET Match', status: 'FAIL', notes: 'Field mismatch detected' });
        }
      }
    } else {
      console.log('❌ Product creation failed');
      results.push({ test: 'POST→GET Match', status: 'FAIL', notes: `POST failed with status ${createResponse.status}` });
    }
    console.log('');

    // 2. PROOF: PUT → GET Match
    if (createdProductId) {
      console.log('✏️ PROOF 2: PUT → GET Match Test');
      const updateData = {
        name: 'Updated Audit Test Product',
        price: 3990,
        active: false
      };

      console.log('Updating product...');
      const updateResponse = await makeRequest('PUT', `${BASE_URL}/${createdProductId}`, updateData);
      console.log('PUT Status:', updateResponse.status);
      
      if (updateResponse.status === 200) {
        // Immediate GET to verify
        console.log('Verifying with GET...');
        const getResponse = await makeRequest('GET', `${BASE_URL}/${createdProductId}`);
        
        if (getResponse.status === 200) {
          const product = getResponse.data;
          const matches = {
            name: product.name === updateData.name,
            price: product.price === updateData.price,
            active: product.active === updateData.active
          };
          
          const allMatch = Object.values(matches).every(Boolean);
          console.log('Update field matches:', matches);
          
          if (allMatch) {
            console.log('✅ PUT→GET match: PASS');
            results.push({ test: 'PUT→GET Match', status: 'PASS', notes: 'All updated fields match exactly' });
          } else {
            console.log('❌ PUT→GET match: FAIL');
            results.push({ test: 'PUT→GET Match', status: 'FAIL', notes: 'Updated field mismatch detected' });
          }
        }
      }
    }
    console.log('');

    // 3. PROOF: Validation Error Test
    console.log('⚠️ PROOF 3: Validation Error Test (HUF Decimal)');
    const invalidData = {
      quiz_id: TEST_QUIZ_ID,
      name: 'Invalid Price Test',
      price: 2990.50,  // Invalid decimal for HUF
      currency: 'HUF',
      active: true
    };

    console.log('Testing invalid HUF decimal price...');
    const validationResponse = await makeRequest('POST', BASE_URL, invalidData);
    console.log('Validation Status:', validationResponse.status);
    console.log('Response:', JSON.stringify(validationResponse.data, null, 2));
    
    if (validationResponse.status >= 400) {
      console.log('✅ Validation Error: PASS');
      results.push({ 
        test: 'Validation Error', 
        status: 'PASS', 
        notes: `Status: ${validationResponse.status}, correctly rejected decimal HUF price` 
      });
    } else {
      console.log('❌ Validation Error: FAIL');
      results.push({ 
        test: 'Validation Error', 
        status: 'FAIL', 
        notes: 'Should have rejected decimal HUF price' 
      });
    }
    console.log('');

    // 4. PROOF: Audit Log Evidence
    console.log('📊 PROOF 4: Audit Log Evidence');
    if (createdProductId) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for audit logs
      
      console.log('Checking audit logs...');
      const auditLogs = await checkAuditLogs(createdProductId);
      
      console.log('Audit log entries found:', auditLogs.length);
      if (auditLogs.length > 0) {
        console.log('Recent audit entries:');
        auditLogs.forEach(log => {
          console.log(`- Action: ${log.action}, Resource: ${log.resource_type}, ID: ${log.resource_id}, User: ${log.user_email}, Time: ${log.created_at}`);
        });
        
        const hasCreate = auditLogs.some(log => log.action === 'CREATE');
        const hasUpdate = auditLogs.some(log => log.action === 'UPDATE');
        
        if (hasCreate || hasUpdate) {
          console.log('✅ Audit Log: PASS');
          results.push({ 
            test: 'Audit Log Evidence', 
            status: 'PASS', 
            notes: `Found ${auditLogs.length} audit entries with CREATE/UPDATE actions` 
          });
        } else {
          console.log('⚠️ Audit Log: PARTIAL - entries found but no CREATE/UPDATE');
          results.push({ 
            test: 'Audit Log Evidence', 
            status: 'PARTIAL', 
            notes: `${auditLogs.length} entries found but no CREATE/UPDATE actions` 
          });
        }
      } else {
        console.log('⚠️ Audit Log: No entries found');
        results.push({ 
          test: 'Audit Log Evidence', 
          status: 'PARTIAL', 
          notes: 'No audit log entries found - may need manual verification' 
        });
      }

      // Clean up - delete the test product
      console.log('Cleaning up test product...');
      await makeRequest('DELETE', `${BASE_URL}/${createdProductId}`);
      
      // Check for DELETE audit log
      await new Promise(resolve => setTimeout(resolve, 1000));
      const finalAuditLogs = await checkAuditLogs(createdProductId);
      const hasDelete = finalAuditLogs.some(log => log.action === 'DELETE');
      if (hasDelete) {
        console.log('✅ DELETE audit log confirmed');
      }
    }

  } catch (error) {
    console.error('Test Error:', error.message);
    results.push({ test: 'General', status: 'FAIL', notes: `Error: ${error.message}` });
  }

  // Print Results Summary
  console.log('');
  console.log('📋 Complete Test Results:');
  console.log('==========================');
  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`${icon} ${result.test}: ${result.status} - ${result.notes}`);
  });

  const passCount = results.filter(r => r.status === 'PASS').length;
  const totalCount = results.length;
  
  console.log('');
  console.log(`Overall: ${passCount}/${totalCount} tests passed`);
  console.log('Time completed:', new Date().toISOString());
}

// Run the complete test
runCompleteTest().catch(console.error);
