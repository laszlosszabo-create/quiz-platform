require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSessionData() {
  console.log('Checking session data for email queue sessions...')
  
  // Get the sessions that were mentioned in the email queue
  const sessionIds = [
    '88b7c85b-b292-43db-abb9-6ab6d1575088',
    '92a2a77a-c89e-48ff-905d-9a58417f8a79',
    '6af0aae7-635b-41cc-b9be-d7ff48230ef0',
    'aef89ddd-ba56-45b8-8638-e033e58ef3e6'
  ]
  
  for (const sessionId of sessionIds) {
    console.log(`\n--- Session: ${sessionId} ---`)
    
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (error) {
      console.error('Error:', error.message)
    } else if (data) {
      console.log('Data:', {
        id: data.id.substring(0, 8) + '...',
        user_email: data.user_email || 'NULL',
        user_name: data.user_name || 'NULL',
        email: data.email || 'NULL',
        name: data.name || 'NULL',
        created_at: data.created_at
      })
    } else {
      console.log('No data found')
    }
  }
}

checkSessionData().catch(console.error)
