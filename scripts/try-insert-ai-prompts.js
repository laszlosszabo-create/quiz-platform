require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const quiz_id = process.env.TEST_QUIZ_ID || '474c52bb-c907-40c4-8cb1-993cfcdf2f38'
  console.log('Selecting from quiz_ai_prompts...')
  let sel = await admin.from('quiz_ai_prompts').select('*').eq('quiz_id', quiz_id).limit(1)
  console.log('Select result ->', { ok: !sel.error, count: (sel.data||[]).length, err: sel.error && (sel.error.message || sel.error) })
  if (sel.data && sel.data[0]) {
    console.log('Sample row keys:', Object.keys(sel.data[0]))
  }

  console.log('Inserting into quiz_ai_prompts for quiz:', quiz_id)
  let { data, error } = await admin.from('quiz_ai_prompts').insert({
    quiz_id,
    lang: 'zz',
    ai_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}'
  }).select('*').maybeSingle()
  console.log('Variant user_prompt_template ->', { ok: !!data, err: error && (error.message || error) })
  if (error) console.log('Details:', error)

  ;({ data, error } = await admin.from('quiz_ai_prompts').insert({
    quiz_id,
    lang: 'zy',
    ai_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}'
  }).select('*').maybeSingle())
  console.log('Variant user_prompt ->', { ok: !!data, err: error && (error.message || error) })
  if (error) console.log('Details:', error)
}

main().catch((e)=>{ console.error(e); process.exit(1) })
