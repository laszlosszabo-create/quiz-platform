require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const quiz_id = process.env.TEST_QUIZ_ID || '474c52bb-c907-40c4-8cb1-993cfcdf2f38'
  console.log('Inserting into quiz_prompts for quiz:', quiz_id)
  // First variant
  let { data, error } = await admin.from('quiz_prompts').insert({
    quiz_id,
    lang: 'zz',
    system_prompt: 'You are a helpful AI assistant for quiz results.'.repeat(1),
    user_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}'.repeat(1)
  }).select('*').maybeSingle()
  console.log('Variant user_prompt ->', { ok: !!data, err: error && (error.message || error) })
  if (error) console.log('Details:', error)

  // Second variant
  ;({ data, error } = await admin.from('quiz_prompts').insert({
    quiz_id,
    lang: 'zy',
    system_prompt: 'You are a helpful AI assistant for quiz results.',
    user_prompt_template: 'Create result for {{name}} with {{scores}} and top {{top_category}}'
  }).select('*').maybeSingle())
  console.log('Variant user_prompt_template ->', { ok: !!data, err: error && (error.message || error) })
  if (error) console.log('Details:', error)
}

main().catch((e)=>{ console.error(e); process.exit(1) })
