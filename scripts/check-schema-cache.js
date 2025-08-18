#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.local.remote' })

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase env vars')
    process.exit(1)
  }
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const idsPath = path.join(process.cwd(), '.cache', 'test-ids.json')
  if (!fs.existsSync(idsPath)) {
    console.error('❌ .cache/test-ids.json not found; run npm run seed:happy first')
    process.exit(1)
  }
  const ids = JSON.parse(fs.readFileSync(idsPath, 'utf8'))
  const sessionId = ids.TEST_SESSION_ID

  console.log('🔎 Probing schema cache by updating JSONB columns on quiz_sessions...')
  const update = await admin
    .from('quiz_sessions')
    .update({ scores: { total: 1 }, result_snapshot: { ai_result: 'probe' } })
    .eq('id', sessionId)
    .select('id')
    .single()

  if (update.error) {
    console.error('❌ Update failed:', update.error)
    process.exit(1)
  }
  console.log('✅ Update ok; schema cache recognizes columns scores/result_snapshot')
}

main().catch((e) => { console.error(e); process.exit(1) })
