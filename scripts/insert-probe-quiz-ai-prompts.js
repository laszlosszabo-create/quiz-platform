#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !service) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const quiz_id = process.env.TEST_QUIZ_ID || '474c52bb-c907-40c4-8cb1-993cfcdf2f38'
  const payload = {
    quiz_id,
    lang: 'hu',
    ai_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}',
  }
  console.log('🧪 Direct insert probe into quiz_ai_prompts with payload:', payload)
  const { data, error } = await admin.from('quiz_ai_prompts').insert(payload).select('*').maybeSingle()
  if (error) {
    console.log('❌ Insert error:', { code: error.code, message: error.message, details: error.details, hint: error.hint })
  } else {
    console.log('✅ Insert ok:', data)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
