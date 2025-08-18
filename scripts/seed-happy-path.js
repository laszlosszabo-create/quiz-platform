require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.local.remote' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase env vars: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  // Debug: print masked env info to help diagnose CI secret issues
  try {
    const urlHost = new URL(supabaseUrl).host
    const keyPreview = String(serviceKey).slice(0, 6)
    console.log(`🔐 Using Supabase: host=${urlHost}, service_key_prefix=${keyPreview}******`)
  } catch {
    console.log('🔐 Using Supabase (could not parse URL host)')
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const QUIZ_SLUG = process.env.TEST_QUIZ_SLUG || 'adhd-quick-check'
  const TEST_LANG = process.env.TEST_LANG || 'en'

  console.log('🌱 Seeding happy-path data...')

  // Ensure quiz exists
  let { data: quiz, error: quizSelErr } = await admin
    .from('quizzes')
    .select('id, slug')
    .eq('slug', QUIZ_SLUG)
    .maybeSingle()

  if (quizSelErr) {
    console.error('❌ quizzes select failed:', quizSelErr)
    process.exit(1)
  }

  if (!quiz) {
    console.log('🆕 Creating minimal quiz for slug:', QUIZ_SLUG)
    const insert = await admin
      .from('quizzes')
      .insert({ slug: QUIZ_SLUG, status: 'active', default_lang: TEST_LANG, feature_flags: { ai_result_enabled: true }, theme: {} })
      .select('id, slug')
      .single()
    if (insert.error) {
      console.error('❌ quizzes insert failed:', insert.error)
      process.exit(1)
    }
    quiz = insert.data
  } else {
    console.log('✅ Quiz exists:', quiz.slug, quiz.id)
  }

  const QUIZ_ID = quiz.id

  // Upsert canonical ai_prompt
  const promptText = 'Create a short HTML result for {{lang}} using user input {{answers}} and computed {{scores}}.'
  const { error: promptErr } = await admin
    .from('quiz_ai_prompts')
    .upsert({ quiz_id: QUIZ_ID, lang: TEST_LANG, ai_prompt: promptText }, { onConflict: 'quiz_id,lang' })

  if (promptErr) {
    console.error('❌ quiz_ai_prompts upsert failed:', promptErr)
    process.exit(1)
  }
  console.log('✅ ai_prompt ensured for', { QUIZ_ID, TEST_LANG })

  // Create session (no cached result to avoid schema cache issues)
  const clientToken = 'test-' + Math.random().toString(36).slice(2)
  const insertSession = await admin
    .from('quiz_sessions')
    .insert({
      quiz_id: QUIZ_ID,
      lang: TEST_LANG,
      client_token: clientToken,
  state: 'started',
  answers: { name: 'Test User' }
    })
    .select('id')
    .single()

  if (insertSession.error) {
    console.error('❌ quiz_sessions insert failed:', insertSession.error)
    process.exit(1)
  }

  const SESSION_ID = insertSession.data.id

  console.log('\n🎯 Seeded for happy-path:')
  console.log(' - TEST_QUIZ_ID=', QUIZ_ID)
  console.log(' - TEST_SESSION_ID=', SESSION_ID)
  console.log(' - TEST_LANG=', TEST_LANG)
  try {
    const cacheDir = path.join(process.cwd(), '.cache')
    fs.mkdirSync(cacheDir, { recursive: true })
    const outPath = path.join(cacheDir, 'test-ids.json')
    fs.writeFileSync(outPath, JSON.stringify({ TEST_QUIZ_ID: QUIZ_ID, TEST_SESSION_ID: SESSION_ID, TEST_LANG }, null, 2))
    console.log(`📝 Wrote IDs to ${outPath}`)
  } catch (e) {
    console.log('⚠️  Failed to write .cache/test-ids.json:', e?.message || e)
  }
  console.log('\n💡 You can export and run the acceptance test like:')
  console.log(`   TEST_SESSION_ID=${SESSION_ID} TEST_QUIZ_ID=${QUIZ_ID} TEST_LANG=${TEST_LANG} node test-generate-result.js`)
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})
