#!/usr/bin/env node
// Simple product AI generation acceptance test
require('dotenv').config()
const fetch = global.fetch || require('node-fetch')

async function main() {
  const sessionId = process.env.TEST_SESSION_ID
  const quizId = process.env.TEST_QUIZ_ID
  const productId = process.env.TEST_PRODUCT_ID
  const lang = process.env.TEST_LANG || 'hu'
  if (!sessionId || !quizId || !productId) {
    console.error('Missing TEST_SESSION_ID / TEST_QUIZ_ID / TEST_PRODUCT_ID env vars')
    process.exit(1)
  }
  const body = { session_id: sessionId, quiz_id: quizId, product_id: productId, result_type:'product', lang }
  const r = await fetch('http://localhost:3000/api/ai/generate-result', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
  const json = await r.json()
  if (!r.ok) {
    console.error('Request failed', r.status, json)
    process.exit(1)
  }
  if (!json.ai_result) {
    console.error('No ai_result returned')
    process.exit(1)
  }
  console.log('[OK] product ai_result length:', json.ai_result.length, 'cached=', json.cached, 'source=', json.source)
  process.exit(0)
}
main().catch(e=>{ console.error(e); process.exit(1) })
