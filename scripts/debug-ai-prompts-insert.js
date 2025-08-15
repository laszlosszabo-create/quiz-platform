require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  console.log('Introspecting AI prompts tables...')
  const tables = ['quiz_ai_prompts','quiz_prompts']
  for (const t of tables) {
    const { data, error } = await admin
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema','public')
      .eq('table_name', t)
      .order('column_name')
    if (error) {
      console.log(`- ${t}: error:`, error.message)
    } else {
      console.log(`- ${t}:`, data?.map((r)=>r.column_name).join(', ') || '(none)')
    }
  }

  const { data: existsAi } = await admin
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema','public')
    .eq('table_name','quiz_ai_prompts')
    .maybeSingle()

  const quiz_id = process.env.TEST_QUIZ_ID || '474c52bb-c907-40c4-8cb1-993cfcdf2f38'

  if (existsAi) {
    console.log('Trying insert into quiz_ai_prompts...')
    const tryOne = async (payload) => {
      const { data, error } = await admin.from('quiz_ai_prompts').insert(payload).select('*').maybeSingle()
      console.log(' -> result:', { ok: !!data, err: error?.message })
      if (error) console.log('   details:', error)
    }
    await tryOne({ quiz_id, lang:'xx', system_prompt:'s'.repeat(12), user_prompt_template:'u'.repeat(12) })
    await tryOne({ quiz_id, lang:'xy', system_prompt:'s'.repeat(12), user_prompt:'u'.repeat(12) })
  } else {
    console.log('quiz_ai_prompts not found')
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })
