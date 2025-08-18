#!/usr/bin/env node
/*
 Runs a single SQL migration file against Supabase using a Postgres RPC helper.
 It tries rpc('exec', { sql }) first, then falls back to rpc('exec_sql', { sql })
 and rpc('exec_sql', { query }). It preserves DO $$ ... $$ blocks when splitting.
 Usage: node scripts/run-migration.js supabase/migrations/<file.sql>
*/

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env.local.remote' })

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase env vars: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Debug diagnostics for CI: show which Supabase host and key prefix are used
try {
  const urlHost = new URL(supabaseUrl).host
  const keyPreview = String(serviceKey).slice(0, 6)
  console.log(`🔐 Migration using Supabase: host=${urlHost}, service_key_prefix=${keyPreview}******`)
} catch {}

function stripLeadingComments(block) {
  const lines = block.split(/\n/)
  while (lines.length && (lines[0].trim().startsWith('--') || lines[0].trim() === '')) {
    lines.shift()
  }
  return lines.join('\n').trim()
}

function splitSql(sql) {
  const statements = []
  let current = ''
  let i = 0
  let inDollar = false
  while (i < sql.length) {
    const ch = sql[i]
    const next2 = sql.slice(i, i + 2)
    // toggle on $$ markers
    if (next2 === '$$') {
      inDollar = !inDollar
      current += next2
      i += 2
      continue
    }
    if (!inDollar && ch === ';') {
      const cleaned = stripLeadingComments(current)
      if (cleaned) statements.push(cleaned + ';')
      current = ''
      i += 1
      continue
    }
    current += ch
    i += 1
  }
  const tail = stripLeadingComments(current)
  if (tail) statements.push(tail)
  return statements
}

async function execStatement(sql) {
  // Try rpc('exec', { sql })
  let { error } = await admin.rpc('exec', { sql })
  if (error) {
    // Try rpc('exec_sql', { sql })
    ;({ error } = await admin.rpc('exec_sql', { sql }))
    if (error) {
      // Try rpc('exec_sql', { query })
      ;({ error } = await admin.rpc('exec_sql', { query: sql }))
      if (error) throw error
    }
  }
}

async function main() {
  const fileArg = process.argv[2]
  if (!fileArg) {
    console.error('Usage: node scripts/run-migration.js <path-to-sql>')
    process.exit(1)
  }
  const filePath = path.resolve(process.cwd(), fileArg)
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath)
    process.exit(1)
  }

  console.log('🏗️  Applying migration:', path.basename(filePath))
  const content = fs.readFileSync(filePath, 'utf8')
  const statements = splitSql(content)
  console.log(`📝 Executing ${statements.length} statements...`)
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    try {
      await execStatement(stmt)
      console.log(`✅ ${i + 1}/${statements.length}`)
    } catch (e) {
      console.error(`❌ Statement ${i + 1} failed:`, e?.message || e)
      process.exit(1)
    }
  }
  console.log('🎉 Migration applied successfully')
}

main()
