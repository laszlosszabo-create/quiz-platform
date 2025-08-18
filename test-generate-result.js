require('dotenv').config({ path: '.env.local' })

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001'

async function post(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  let body
  try { body = await res.json() } catch { body = await res.text() }
  return { status: res.status, body }
}

async function main() {
  console.log('🔍 generate-result acceptance test')

  // 1) No session present -> expect 404 (or 400 if a session exists but no prompt)
  const noPrompt = await post('/api/ai/generate-result', {
    session_id: '00000000-0000-0000-0000-000000000000',
    quiz_id: '00000000-0000-0000-0000-000000000000',
    lang: 'en'
  })
  console.log('No session / no prompt status:', noPrompt.status)
  if (noPrompt.status === 404) {
    console.log('✅ 404 received as expected when session not found')
  } else if (noPrompt.status === 400) {
    console.log('✅ 400 received (session exists but no ai_prompt)')
  } else {
    console.error('❌ Unexpected status:', noPrompt.status, noPrompt.body)
  }

  // 2) Happy path requires existing quiz/session and ai_prompt. This is environment-dependent,
  // so we only log a hint here. Optionally wire a seed beforehand and then enable the block.
  console.log('\nℹ️ To run the happy path, ensure there is a session with computed scores and a prompt:')
  console.log(' - quiz_ai_prompts row exists for {quiz_id, lang} with ai_prompt')
  console.log(' - quiz_sessions row exists with matching session_id and quiz_id')
  console.log('Then call this script with TEST_SESSION_ID/TEST_QUIZ_ID envs to run the positive case.')

  const sid = process.env.TEST_SESSION_ID
  const qid = process.env.TEST_QUIZ_ID
  const lng = process.env.TEST_LANG || 'en'
  if (sid && qid) {
    const ok = await post('/api/ai/generate-result', {
      session_id: sid,
      quiz_id: qid,
      lang: lng
    })
    console.log('Happy path status:', ok.status)
    if (ok.status === 200) console.log('✅ AI result:', ok.body)
    else console.error('❌ Unexpected status:', ok.status, ok.body)
  }
}

main().catch((e) => {
  console.error('Test runner error:', e)
  process.exit(1)
})
