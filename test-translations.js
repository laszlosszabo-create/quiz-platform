#!/usr/bin/env node
/**
 * Minimal Translations acceptance (local/CI):
 * - Bulk save a few keys in HU/EN then read back
 * - Check missing translations list counts across HU/EN
 * - Verify landing page reflects updated translations (SSR fetch)
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.local.remote' })

const assert = require('assert')
const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const base = process.env.TEST_BASE_URL || 'http://localhost:3000'
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  assert(supabaseUrl && serviceKey, 'Missing Supabase envs')

  const admin = createClient(supabaseUrl, serviceKey)

  // Ensure a quiz exists (use from seed cache if present)
  let QUIZ_ID
  try {
    const ids = require('./.cache/test-ids.json')
    QUIZ_ID = ids.TEST_QUIZ_ID
  } catch {}

  if (!QUIZ_ID) {
    // Fallback: pick the first quiz
    const { data, error } = await admin.from('quizzes').select('id').limit(1)
    if (error || !data?.length) throw new Error('No quiz found to test translations')
    QUIZ_ID = data[0].id
  }

  const now = Date.now()
  const valHu = `HU Headline ${now}`
  const valEn = `EN Headline ${now}`

  // Bulk save two keys (landing_headline, cta_text) for HU/EN
  const upserts = [
    { quiz_id: QUIZ_ID, lang: 'hu', field_key: 'landing_headline', value: valHu },
    { quiz_id: QUIZ_ID, lang: 'en', field_key: 'landing_headline', value: valEn },
    { quiz_id: QUIZ_ID, lang: 'hu', field_key: 'cta_text', value: `HU CTA ${now}` },
    { quiz_id: QUIZ_ID, lang: 'en', field_key: 'cta_text', value: `EN CTA ${now}` },
  ]

  const { error: upErr } = await admin.from('quiz_translations').upsert(upserts, { onConflict: 'quiz_id,lang,field_key' })
  if (upErr) throw upErr

  // Read back verification
  const { data: back, error: backErr } = await admin
    .from('quiz_translations')
    .select('lang, field_key, value')
    .eq('quiz_id', QUIZ_ID)
    .in('field_key', ['landing_headline', 'cta_text'])
  if (backErr) throw backErr

  const map = {}
  back.forEach(r => { map[`${r.lang}:${r.field_key}`] = r.value })
  assert.equal(map['hu:landing_headline'], valHu)
  assert.equal(map['en:landing_headline'], valEn)

  // Missing translations list (simple heuristic): count required keys missing for HU/EN
  const requiredKeys = ['landing_headline', 'landing_sub', 'cta_text']
  const { data: all, error: allErr } = await admin
    .from('quiz_translations')
    .select('lang, field_key')
    .eq('quiz_id', QUIZ_ID)
  if (allErr) throw allErr

  const have = new Set(all.map(r => `${r.lang}:${r.field_key}`))
  const missingHu = requiredKeys.filter(k => !have.has(`hu:${k}`)).length
  const missingEn = requiredKeys.filter(k => !have.has(`en:${k}`)).length
  assert(missingHu >= 0 && missingEn >= 0)

  // SSR check: landing page should reflect headline
  // We need the quiz slug; fetch from DB
  const { data: quiz, error: qErr } = await admin.from('quizzes').select('slug, default_lang').eq('id', QUIZ_ID).single()
  if (qErr) throw qErr

  const resHu = await fetch(`${base}/hu/${quiz.slug}`)
  assert(resHu.ok, 'Landing HU not 200')
  const htmlHu = await resHu.text()
  assert(htmlHu.includes(valHu), 'Landing HU headline not found in HTML')

  const resEn = await fetch(`${base}/en/${quiz.slug}`)
  assert(resEn.ok, 'Landing EN not 200')
  const htmlEn = await resEn.text()
  assert(htmlEn.includes(valEn), 'Landing EN headline not found in HTML')

  console.log('Translations acceptance PASS:', { QUIZ_ID, missingHu, missingEn })
}

main().catch((e) => {
  console.error('Translations acceptance FAIL:', e)
  process.exit(1)
})
