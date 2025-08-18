#!/usr/bin/env node
/**
 * Products Audit Logging Test
 * Sprint 1 - Első tétel: Products audit logging implementálása
 * 
 * Teszt: 3 művelet (CREATE/UPDATE/DELETE) → 3 audit sor
 * Acceptance: quality-gates.md-be kivonat (action, resource_type=product, resource_id, user_email, timestamp)
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProductsAuditLogging() {
  console.log('🧪 Products Audit Logging Test - Sprint 1')
  console.log('=' .repeat(50))
  
  const testProduct = {
    quiz_id: '550e8400-e29b-41d4-a716-446655440000', // Test quiz UUID
    name: 'Audit Test Product',
    description: 'Test product for audit logging validation',
    price: 5000,
    currency: 'HUF',
    active: true,
    metadata: { test: 'audit-logging' }
  }

  let productId = null
  const testResults = []

  try {
    // 1. Test CREATE audit logging
    console.log('\n1️⃣ Testing CREATE audit logging...')
    
    const createResponse = await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct)
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      throw new Error(`CREATE failed: ${createResponse.status} ${error}`)
    }

    const createdProduct = await createResponse.json()
    productId = createdProduct.id
    console.log(`✅ Product created with ID: ${productId}`)
    
    // Check audit log for CREATE
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for audit log
    
    const { data: createAuditLogs, error: createAuditError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', 'products')
      .eq('resource_id', productId)
      .eq('action', 'CREATE')
      .order('created_at', { ascending: false })
      .limit(1)

    if (createAuditError) {
      throw new Error(`Create audit query failed: ${createAuditError.message}`)
    }

    if (!createAuditLogs || createAuditLogs.length === 0) {
      testResults.push({
        action: 'CREATE',
        status: 'FAIL',
        reason: 'No audit log entry found for CREATE operation'
      })
    } else {
      const auditLog = createAuditLogs[0]
      testResults.push({
        action: 'CREATE',
        status: 'PASS',
        resource_type: auditLog.resource_type,
        resource_id: auditLog.resource_id,
        user_email: auditLog.user_email || auditLog.data?.user_email,
        timestamp: auditLog.created_at,
        details: auditLog.details || auditLog.data?.details
      })
      console.log(`✅ CREATE audit log found: ${auditLog.id}`)
    }

    // 2. Test UPDATE audit logging
    console.log('\n2️⃣ Testing UPDATE audit logging...')
    
    const updateData = {
      name: 'Updated Audit Test Product',
      price: 6000,
      description: 'Updated description for audit test'
    }

    const updateResponse = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      throw new Error(`UPDATE failed: ${updateResponse.status} ${error}`)
    }

    const updatedProduct = await updateResponse.json()
    console.log(`✅ Product updated: ${updatedProduct.name}`)
    
    // Check audit log for UPDATE
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for audit log
    
    const { data: updateAuditLogs, error: updateAuditError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', 'products')
      .eq('resource_id', productId)
      .eq('action', 'UPDATE')
      .order('created_at', { ascending: false })
      .limit(1)

    if (updateAuditError) {
      throw new Error(`Update audit query failed: ${updateAuditError.message}`)
    }

    if (!updateAuditLogs || updateAuditLogs.length === 0) {
      testResults.push({
        action: 'UPDATE',
        status: 'FAIL',
        reason: 'No audit log entry found for UPDATE operation'
      })
    } else {
      const auditLog = updateAuditLogs[0]
      testResults.push({
        action: 'UPDATE',
        status: 'PASS',
        resource_type: auditLog.resource_type,
        resource_id: auditLog.resource_id,
        user_email: auditLog.user_email || auditLog.data?.user_email,
        timestamp: auditLog.created_at,
        details: auditLog.details || auditLog.data?.details
      })
      console.log(`✅ UPDATE audit log found: ${auditLog.id}`)
    }

    // 3. Test DELETE audit logging
    console.log('\n3️⃣ Testing DELETE audit logging...')
    
    const deleteResponse = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
      method: 'DELETE'
    })

    if (!deleteResponse.ok) {
      const error = await deleteResponse.text()
      throw new Error(`DELETE failed: ${deleteResponse.status} ${error}`)
    }

    console.log(`✅ Product deleted: ${productId}`)
    
    // Check audit log for DELETE
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for audit log
    
    const { data: deleteAuditLogs, error: deleteAuditError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', 'products')
      .eq('resource_id', productId)
      .eq('action', 'DELETE')
      .order('created_at', { ascending: false })
      .limit(1)

    if (deleteAuditError) {
      throw new Error(`Delete audit query failed: ${deleteAuditError.message}`)
    }

    if (!deleteAuditLogs || deleteAuditLogs.length === 0) {
      testResults.push({
        action: 'DELETE',
        status: 'FAIL',
        reason: 'No audit log entry found for DELETE operation'
      })
    } else {
      const auditLog = deleteAuditLogs[0]
      testResults.push({
        action: 'DELETE',
        status: 'PASS',
        resource_type: auditLog.resource_type,
        resource_id: auditLog.resource_id,
        user_email: auditLog.user_email || auditLog.data?.user_email,
        timestamp: auditLog.created_at,
        details: auditLog.details || auditLog.data?.details
      })
      console.log(`✅ DELETE audit log found: ${auditLog.id}`)
    }

  } catch (error) {
    console.error(`❌ Test error: ${error.message}`)
    
    // Cleanup on error
    if (productId) {
      try {
        await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
          method: 'DELETE'
        })
        console.log('🧹 Cleanup: Test product deleted')
      } catch (cleanupError) {
        console.warn('⚠️  Cleanup failed:', cleanupError.message)
      }
    }
    
    return {
      success: false,
      error: error.message,
      results: testResults
    }
  }

  // Results summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 PRODUCTS AUDIT LOGGING TEST RESULTS')
  console.log('='.repeat(50))
  
  const passCount = testResults.filter(r => r.status === 'PASS').length
  const totalCount = testResults.length
  
  testResults.forEach(result => {
    if (result.status === 'PASS') {
      console.log(`✅ ${result.action}: resource_type=${result.resource_type}, resource_id=${result.resource_id}`)
      console.log(`   user_email=${result.user_email}, timestamp=${result.timestamp}`)
    } else {
      console.log(`❌ ${result.action}: ${result.reason}`)
    }
  })
  
  console.log(`\n🎯 Sprint 1 Acceptance: ${passCount}/${totalCount} operations logged`)
  
  if (passCount === 3) {
    console.log('🎉 SUCCESS: All 3 CRUD operations properly logged to audit_logs table')
    return {
      success: true,
      message: `Products audit logging PASS: 3 operations → 3 audit entries`,
      results: testResults,
      acceptance: true
    }
  } else {
    console.log('❌ FAILURE: Not all operations were properly logged')
    return {
      success: false,
      message: `Products audit logging PARTIAL: ${passCount}/3 operations logged`,
      results: testResults,
      acceptance: false
    }
  }
}

// Run test
if (require.main === module) {
  testProductsAuditLogging()
    .then(result => {
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Fatal error:', error)
      process.exit(1)
    })
}

module.exports = { testProductsAuditLogging }
