#!/usr/bin/env node

// Quick test script for email automation
console.log('Testing email automation system...')

const testEmailSystem = async () => {
  try {
    // Test 1: Check if email templates API is working
    console.log('\n1. Testing email templates API...')
    const templatesResponse = await fetch('http://localhost:3000/api/admin/email-templates?quiz_id=test', {
      method: 'GET',
    })
    console.log(`Templates API status: ${templatesResponse.status}`)
    
    // Test 2: Check if automation rules API is working  
    console.log('\n2. Testing automation rules API...')
    const rulesResponse = await fetch('http://localhost:3000/api/admin/email-automation-rules?quiz_id=test', {
      method: 'GET',
    })
    console.log(`Rules API status: ${rulesResponse.status}`)
    
    // Test 3: Check reminder cron endpoint
    console.log('\n3. Testing reminder cron endpoint...')
    const reminderResponse = await fetch('http://localhost:3000/api/cron/reminder-emails', {
      method: 'GET',
    })
    console.log(`Reminder cron status: ${reminderResponse.status}`)
    
    console.log('\n✅ Email automation system basic tests completed!')
    console.log('\nNext steps:')
    console.log('1. Run database migrations: supabase migration up')
    console.log('2. Set up cron job for reminders (every hour): 0 * * * * curl http://localhost:3000/api/cron/reminder-emails')
    console.log('3. Test email sending with real quiz completion')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Only run if server is already running
if (process.argv.includes('--test')) {
  testEmailSystem()
} else {
  console.log('Add --test flag to run tests (make sure server is running first)')
}
