#!/usr/bin/env node

// Authenticated AI Prompts CRUD smoke test (HU/EN)
// - Logs in as admin@test.com
// - Uses Supabase cookies to call Next API endpoints
// - Performs GET/POST/PUT/DELETE and prints status+response excerpts
// - Attempts to fetch audit log summaries if available

require('dotenv').config({ path: '.env.local' })

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !anonKey) {
  console.error('Missing Supabase env. Require NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const client = createClient(supabaseUrl, anonKey)
const admin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

async function getAnyQuizId() {
  try {
    if (!admin) return null
    const { data, error } = await admin.from('quizzes').select('id, slug').limit(1).maybeSingle()
    if (error) throw error
    return data?.id || null
  } catch (e) {
    return null
  }
}

function cookieHeaderFromSession(session) {
  // Default cookie names used by @supabase/ssr
  const at = session?.access_token
  const rt = session?.refresh_token
  if (!at || !rt) return ''
  return `sb-access-token=${at}; sb-refresh-token=${rt}`
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options)
  let json
  try { json = await res.json() } catch { json = null }
  return { res, json }
}

async function main() {
  console.log('🔐 Logging in as admin@test.com ...')
  const { data: login, error: authErr } = await client.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'admin123456'
  })
  if (authErr || !login.session) {
    console.error('❌ Login failed:', authErr?.message || 'no session')
    process.exit(1)
  }
  console.log('✅ Login ok')
  const cookie = cookieHeaderFromSession(login.session)
  const bearer = login.session.access_token

  // Ensure admin_users row exists for this email (required by getAdminUser)
  if (admin) {
    try {
      const { error: upErr } = await admin
        .from('admin_users')
        .upsert({ email: 'admin@test.com', role: 'owner' })
      if (upErr) {
        console.warn('⚠️ admin_users upsert warning:', upErr.message)
      } else {
        console.log('✅ admin_users ensured')
      }
    } catch (e) {
      console.warn('⚠️ admin_users upsert error:', e.message)
    }
  } else {
    console.warn('⚠️ No service role key; cannot ensure admin_users row')
  }

  const quizId = (await getAnyQuizId()) || '00000000-0000-0000-0000-000000000000'
  console.log('🧪 Using quiz_id =', quizId)

  // Prepare test payloads
  const makePrompt = (lang) => ({
    quiz_id: quizId,
    lang,
    system_prompt: 'You are a helpful AI assistant for quiz results.',
    user_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}',
  ai_prompt: 'Create result for {{name}} with {{scores}} and top {{top_category}}',
    ai_provider: 'openai',
    ai_model: 'gpt-4o'
  })

  const langs = ['hu', 'en']

  // GET (empty or existing)
  console.log('\n➡️ GET prompts')
  const getRes = await fetchJson(`${BASE_URL}/api/admin/ai-prompts?quiz_id=${quizId}`, {
    headers: { Cookie: cookie, Authorization: `Bearer ${bearer}` }
  })
  console.log('GET status:', getRes.res.status, 'count:', Array.isArray(getRes.json?.data) ? getRes.json.data.length : 'n/a')

  // POST create for both langs (ignore 409)
  for (const lang of langs) {
    console.log(`\n➡️ POST create (${lang})`)
    const postRes = await fetchJson(`${BASE_URL}/api/admin/ai-prompts`, {
      method: 'POST',
  headers: { 'Content-Type': 'application/json', Cookie: cookie, Authorization: `Bearer ${bearer}`, 'x-debug': 'true' },
      body: JSON.stringify(makePrompt(lang))
    })
    console.log('POST status:', postRes.res.status, 'id:', postRes.json?.data?.id || '-')
    if (postRes.res.status >= 400) {
      console.log('POST body:', JSON.stringify(postRes.json))
    }
  }

  // GET after create
  const getAfter = await fetchJson(`${BASE_URL}/api/admin/ai-prompts?quiz_id=${quizId}`, {
    headers: { Cookie: cookie, Authorization: `Bearer ${bearer}` }
  })
  console.log('\nGET after create status:', getAfter.res.status, 'count:', Array.isArray(getAfter.json?.data) ? getAfter.json.data.length : 'n/a')

  // Update first prompt
  const first = Array.isArray(getAfter.json?.data) && getAfter.json.data[0]
  if (first) {
    console.log(`\n➡️ PUT update (${first.lang})`)
    const putBody = {
      id: first.id,
      quiz_id: quizId,
      lang: first.lang,
      system_prompt: (first.system_prompt || 'You are AI') + ' [updated]',
      user_prompt: (first.user_prompt_template || 'Create for {{name}} with {{scores}} and {{top_category}}') + ' [updated]',
      ai_prompt: (first.user_prompt_template || first.ai_prompt || 'Create for {{name}} with {{scores}} and {{top_category}}') + ' [updated]',
      ai_provider: first.ai_provider || 'openai',
      ai_model: first.ai_model || 'gpt-4o'
    }
    const putRes = await fetchJson(`${BASE_URL}/api/admin/ai-prompts`, {
      method: 'PUT',
  headers: { 'Content-Type': 'application/json', Cookie: cookie, Authorization: `Bearer ${bearer}`, 'x-debug': 'true' },
      body: JSON.stringify(putBody)
    })
    console.log('PUT status:', putRes.res.status, 'updated id:', putRes.json?.data?.id || '-')
    if (putRes.res.status >= 400) {
      console.log('PUT body:', JSON.stringify(putRes.json))
    }
  }

  // Delete last prompt
  const last = Array.isArray(getAfter.json?.data) && getAfter.json.data[getAfter.json.data.length - 1]
  if (last) {
    console.log(`\n➡️ DELETE (${last.lang})`)
    const delRes = await fetchJson(`${BASE_URL}/api/admin/ai-prompts?id=${last.id}&quiz_id=${quizId}`, {
      method: 'DELETE',
  headers: { Cookie: cookie, Authorization: `Bearer ${bearer}`, 'x-debug': 'true' }
    })
    console.log('DELETE status:', delRes.res.status, delRes.json?.message || delRes.json?.error)
  }

  // Audit summary (best-effort)
  if (admin) {
    try {
      const { data: logs, error } = await admin
        .from('audit_logs')
        .select('*')
        .like('resource_type', 'quiz_prompt')
        .order('created_at', { ascending: false })
        .limit(5)
      if (error) throw error
      console.log('\n📝 Audit log tail (last 5):')
      for (const row of logs || []) {
        console.log('-', row.action, row.resource_id, row.details ? JSON.stringify(row.details).slice(0, 120) + '…' : '')
      }
    } catch (e) {
      console.log('\n📝 Audit log not available:', e.message)
    }
  }

  console.log('\n✅ Auth CRUD smoke completed')
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
