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
  console.log('🔎 Inspecting table: public.quiz_ai_prompts')

  // Count and sample row to infer columns
  const sel = await admin.from('quiz_ai_prompts').select('*').limit(1)
  if (sel.error) {
    console.log('Select error:', sel.error.message || sel.error)
  } else {
    const sample = (sel.data && sel.data[0]) || null
    console.log('Row count (approx via range):', sel.data ? sel.data.length : 0)
    if (sample) {
      console.log('Sample row keys:', Object.keys(sample))
    } else {
      console.log('No sample row available; keys unknown from data path')
    }
  }

  // Duplicate constraint probe: try inserting same (quiz_id,lang) twice
  const quiz_id = process.env.TEST_QUIZ_ID || '474c52bb-c907-40c4-8cb1-993cfcdf2f38'
  const payload = { quiz_id, lang: 'zz', ai_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}' }
  console.log('Probing duplicate constraint with payload:', payload)
  const first = await admin.from('quiz_ai_prompts').insert(payload).select('*').maybeSingle()
  if (first.error) {
    console.log('First insert error:', { code: first.error.code, message: first.error.message })
  } else {
    console.log('First insert ok:', first.data && first.data.id)
    const dup = await admin.from('quiz_ai_prompts').insert(payload).select('*').maybeSingle()
    if (dup.error) {
      console.log('Duplicate insert error (expected):', { code: dup.error.code, message: dup.error.message, details: dup.error.details })
    } else {
      console.log('Duplicate insert unexpectedly succeeded:', dup.data && dup.data.id)
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
