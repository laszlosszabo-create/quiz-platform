#!/usr/bin/env node
/**
 * Simplified Products Audit Logging Test
 * Sprint 1 - Első tétel: Audit log funkció közvetlen tesztelése
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuditLogDirect() {
  console.log('🧪 Direct Audit Log Test - Sprint 1')
  console.log('=' .repeat(40))
  
  try {
    // 1. Check audit_logs table schema
    console.log('\n1️⃣ Checking audit_logs table...')
    
    const { data: sampleLogs, error: schemaError } = await supabase
      .from('audit_logs')
      .select('*')
      .limit(1)

    if (schemaError) {
      console.error('❌ Schema error:', schemaError.message)
      return false
    }

    console.log('✅ audit_logs table accessible')
    
    // 2. Insert a test audit log entry
    console.log('\n2️⃣ Testing direct audit log insert...')
    
    const testEntry = {
      user_id: 'test-user',
      user_email: 'test@quiz.com', 
      action: 'CREATE',
      resource_type: 'products',
      resource_id: '123e4567-e89b-12d3-a456-426614174000',
      details: { test: 'direct-insert' },
      created_at: new Date().toISOString()
    }

    const { data: insertedLog, error: insertError } = await supabase
      .from('audit_logs')
      .insert(testEntry)
      .select()
      .single()

    if (insertError) {
      // Try legacy schema fallback
      console.log('⚠️  Modern schema failed, trying legacy...')
      const legacyEntry = {
        event_name: testEntry.action,
        data: {
          user_id: testEntry.user_id,
          user_email: testEntry.user_email,
          resource_type: testEntry.resource_type,
          resource_id: testEntry.resource_id,
          details: testEntry.details
        },
        created_at: testEntry.created_at
      }

      const { data: legacyLog, error: legacyError } = await supabase
        .from('audit_logs')
        .insert(legacyEntry)
        .select()
        .single()

      if (legacyError) {
        console.error('❌ Both schemas failed:', legacyError.message)
        return false
      }

      console.log('✅ Legacy audit log inserted:', legacyLog.id)
    } else {
      console.log('✅ Modern audit log inserted:', insertedLog.id)
    }

    // 3. Check audit log helper function
    console.log('\n3️⃣ Testing audit log helper function...')
    
    // Import and test the helper
    try {
      const auditLogPath = './src/lib/audit-log.ts'
      delete require.cache[require.resolve(auditLogPath)]
      const { createAuditLog } = require(auditLogPath)
      
      const helperResult = await createAuditLog({
        user_id: 'helper-test-user',
        user_email: 'helper@quiz.com',
        action: 'UPDATE',
        resource_type: 'products',
        resource_id: '123e4567-e89b-12d3-a456-426614174001',
        details: { test: 'helper-function' }
      })

      if (helperResult.error) {
        console.error('❌ Helper function failed:', helperResult.error.message)
      } else {
        console.log('✅ Audit log helper working:', helperResult.data?.id || 'legacy-format')
      }

    } catch (helperError) {
      console.error('❌ Helper import/test failed:', helperError.message)
    }

    // 4. Verify recent audit logs
    console.log('\n4️⃣ Verifying recent audit logs...')
    
    const { data: recentLogs, error: queryError } = await supabase
      .from('audit_logs')
      .select('*')
      .or('resource_type.eq.products,event_name.eq.CREATE,event_name.eq.UPDATE')
      .order('created_at', { ascending: false })
      .limit(5)

    if (queryError) {
      console.error('❌ Query failed:', queryError.message)
      return false
    }

    console.log(`✅ Found ${recentLogs.length} recent audit logs`)
    
    recentLogs.forEach((log, index) => {
      const action = log.action || log.event_name
      const resourceType = log.resource_type || log.data?.resource_type
      const userEmail = log.user_email || log.data?.user_email
      console.log(`   ${index + 1}. ${action} - ${resourceType} - ${userEmail} - ${log.created_at}`)
    })

    return true

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

// Run test
if (require.main === module) {
  testAuditLogDirect()
    .then(success => {
      if (success) {
        console.log('\n🎉 Direct audit log test PASSED')
        console.log('✅ Sprint 1: Audit log infrastructure ready for Products CRUD')
      } else {
        console.log('\n❌ Direct audit log test FAILED') 
      }
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Fatal error:', error)
      process.exit(1)
    })
}
