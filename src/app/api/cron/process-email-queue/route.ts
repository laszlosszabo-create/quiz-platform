import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { markdownToHtml } from '@/lib/markdown'

const resend = new Resend(process.env.RESEND_API_KEY)

// Types
type BackfillResult = { checked: number; restored: number; cancelled: number }
type ProcessLog = { queue_id: string; recipient_email?: string | null; template_id?: string | null; status: 'sent' | 'failed' | 'skipped'; provider_message_id?: string | null; reason?: string }
interface ProcessResult { processed: number; succeeded: number; failed: number; skipped: number; errors: string[]; logs: ProcessLog[] }

// GET: process queue in safe/rate-limited mode with optional backfill and retry
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const url = new URL(request.url)

    const safeMode = (url.searchParams.get('safe') || 'true') === 'true'
    const rateLimit = parseInt(url.searchParams.get('rate') || process.env.EMAIL_SAFE_RATE || '5', 10)
    const doBackfill = (url.searchParams.get('backfill') || 'true') === 'true'
    const enableRetry = (url.searchParams.get('retry') || (safeMode ? 'false' : 'true')) === 'true'

    const startedAt = new Date().toISOString()
  let backfill: BackfillResult | undefined

    if (doBackfill) {
      backfill = await backfillMissingRecipients(supabase)
    }

  // Requeue stale processing items (crash safety)
  await requeueStaleProcessing(supabase)

    // Fetch pending items ready to send
    const { data: queueItems, error } = await supabase
      .from('email_queue')
      .select(`
        *,
        email_templates (
          id,
          template_name,
          subject_template,
          body_html,
          body_markdown
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(safeMode ? Math.max(1, rateLimit) : 50)

    if (error) {
      console.error('Email cron fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch queue items' }, { status: 500 })
    }

    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ message: 'No pending emails', processed: 0, backfill, started_at: startedAt, finished_at: new Date().toISOString() })
    }

  const results: ProcessResult = { processed: 0, succeeded: 0, failed: 0, skipped: 0, errors: [], logs: [] }

    for (const item of queueItems) {
      // Guard: missing recipient => cancel
      if (!item.recipient_email) {
        const now = Date.now()
        const createdAt = new Date(item.created_at as string).getTime()
        const ageMs = now - createdAt
        const graceMs = parseInt(process.env.EMAIL_RECIPIENT_GRACE_MS || '', 10) || 2 * 60 * 60 * 1000 // default 2h grace

        if (ageMs < graceMs) {
          // Give backfill another chance: push scheduled_at forward a bit
          const nextAt = new Date(now + 2 * 60 * 1000) // +2 minutes
          await supabase
            .from('email_queue')
            .update({ scheduled_at: nextAt.toISOString(), error_message: 'missing_recipient_retry' })
            .eq('id', item.id)

          results.skipped++
          results.logs.push({ queue_id: item.id, recipient_email: null, template_id: item.template_id, status: 'skipped', reason: 'missing_recipient_retry' })
        } else {
          // Exceeded grace period: cancel
          await supabase.from('email_queue').update({ status: 'cancelled', error_message: 'missing_recipient_timeout' }).eq('id', item.id)
          results.skipped++
          results.logs.push({ queue_id: item.id, recipient_email: null, template_id: item.template_id, status: 'skipped', reason: 'missing_recipient_timeout' })
        }
        continue
      }

      // Idempotency: skip if already sent/has provider id
      if (item.status === 'sent' || item.external_id) {
        results.skipped++
        results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'skipped', reason: 'already_sent' })
        continue
      }

      // Atomic lock: move pending -> processing
      const { data: locked, error: lockError } = await supabase
        .from('email_queue')
        .update({ status: 'processing' })
        .eq('id', item.id)
        .eq('status', 'pending')
        .select('*')
        .single()

      if (lockError || !locked) {
        results.skipped++
        results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'skipped', reason: 'lock_failed' })
        continue
      }

      // Prepare variables with late enrichment if needed (product emails)
      let variables = { ...(item.variables_used || {}) } as Record<string, any>
      try {
        // Fill product_name if missing
        if (!variables.product_name && variables.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('name')
            .eq('id', variables.product_id)
            .maybeSingle()
          if (product?.name) variables.product_name = product.name
        }

        // Fill ai_result from session cache or product_ai_results table if missing and we have context
        if (!variables.ai_result && variables.session_id && variables.product_id) {
          let ai: string | undefined
          try {
            const { data: sessionRow } = await supabase
              .from('quiz_sessions')
              .select('product_ai_results')
              .eq('id', variables.session_id)
              .maybeSingle()
            ai = (sessionRow?.product_ai_results as any)?.[variables.product_id]?.ai_result
          } catch {}

          if (!ai) {
            const { data: tableRow } = await supabase
              .from('product_ai_results')
              .select('ai_result')
              .eq('session_id', variables.session_id)
              .eq('product_id', variables.product_id)
              .eq('lang', variables.lang || 'hu')
              .maybeSingle()
            ai = (tableRow as any)?.ai_result
          }

          if (ai) {
            variables.ai_result = markdownToHtml(String(ai))
          } else {
            // AI not ready yet: reschedule a short delay and retry later
            const nextAt = new Date(Date.now() + 2 * 60 * 1000) // +2 minutes
            await supabase.from('email_queue').update({ status: 'pending', scheduled_at: nextAt.toISOString(), error_message: 'ai_not_ready' }).eq('id', item.id)
            results.skipped++
            results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'skipped', reason: 'ai_not_ready' })
            continue
          }
        }
      } catch (e) {
        // If enrichment fails, proceed; validation may still catch missing vars
        console.warn('Late enrichment failed:', e)
      }

      // Validate template variables before send
      const template = item.email_templates
      const { subject, htmlContent, missing } = processTemplateWithValidation(template, variables)
      if (missing.length > 0) {
        await supabase.from('email_queue').update({ status: 'failed', error_message: `VALIDATION_ERROR missing: ${missing.join(',')}` }).eq('id', item.id)
        results.failed++
        results.errors.push(`${item.id}: missing ${missing.join(',')}`)
        results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'failed', reason: 'validation_error' })
        continue
      }

      // Send
      try {
        const sendResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@quizapp.hu',
          to: item.recipient_email,
          subject,
          html: htmlContent,
          headers: {
            'X-Email-Type': 'automated',
            'X-Template-Id': item.template_id,
            'X-Queue-Id': item.id,
            'Reply-To': process.env.REPLY_TO_EMAIL || process.env.FROM_EMAIL || 'noreply@quizapp.hu',
            'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          }
        })

        const providerId = sendResult.data?.id || null

        await supabase
          .from('email_queue')
          .update({ status: 'sent', sent_at: new Date().toISOString(), external_id: providerId })
          .eq('id', item.id)

        // Best-effort analytics
        try { await supabase.from('email_analytics').insert({ email_queue_id: item.id, event_type: 'sent', event_data: { external_id: providerId } }) } catch {}

        results.succeeded++
        results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'sent', provider_message_id: providerId || undefined })
      } catch (err: any) {
        const { retryable, reason } = classifySendError(err)

        if (retryable && enableRetry) {
          const attempts = await getAttemptCount(supabase, item.id)
          const nextAt = computeBackoff(attempts)
          try { await supabase.from('email_analytics').insert({ email_queue_id: item.id, event_type: 'attempt_failed', event_data: { reason, attempts: attempts + 1 } }) } catch {}
          await supabase.from('email_queue').update({ status: 'pending', scheduled_at: nextAt.toISOString(), error_message: reason }).eq('id', item.id)
          results.skipped++
          results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'skipped', reason })
        } else {
          await supabase.from('email_queue').update({ status: 'failed', error_message: reason }).eq('id', item.id)
          try { await supabase.from('email_analytics').insert({ email_queue_id: item.id, event_type: 'failed', event_data: { reason } }) } catch {}
          results.failed++
          results.errors.push(`${item.id}: ${reason}`)
          results.logs.push({ queue_id: item.id, recipient_email: item.recipient_email, template_id: item.template_id, status: 'failed', reason })
        }
      }

      results.processed++
    }

    const summary = { message: 'Email processing completed', started_at: startedAt, finished_at: new Date().toISOString(), pass: results.succeeded, fail: results.failed, ...results, backfill }
    console.log(`[EMAIL CRON] ${startedAt} processed=${results.processed} sent=${results.succeeded} failed=${results.failed} skipped=${results.skipped}`)
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Email queue processing failed:', error)
    return NextResponse.json({ error: 'Email queue processing failed' }, { status: 500 })
  }
}

// Template processing + validation
function processTemplate(template: any, variables: Record<string, unknown>) {
  let subject = (template?.subject_template as string) || ''
  let htmlContent = (template?.body_html as string) || (template?.body_markdown as string) || ''
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quizapp.hu'
  
  // Merge with default variables
  const allVariables: Record<string, unknown> = {
    user_name: 'Értékes Ügyfél',
    quiz_title: 'ADHD Gyorsteszt',
    percentage: '75',
    score: '15', 
    category: 'Magasabb Szintű',
    quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
    support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
    company_name: 'Quiz Platform',
    result_url: `${baseUrl}/results`,
    booking_url: `${baseUrl}/booking`, 
    download_url: `${baseUrl}/downloads`,
    ...variables // User provided variables override defaults
  }
  
  if (allVariables && typeof allVariables === 'object') {
    for (const key in allVariables) {
      const value = allVariables[key]
      const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      subject = subject.replace(re, String(value))
      htmlContent = htmlContent.replace(re, String(value))
    }
  }
  return { subject, htmlContent }
}

// Expand simple Handlebars-like {{#each collection}}...{{/each}} and {{#if var}}...{{else}}...{{/if}}
function renderEachBlocks(content: string, variables: Record<string, unknown>) {
  return content.replace(/{{#each\s+([a-zA-Z0-9_\.]+)}}([\s\S]*?){{\/each}}/g, (_match, collName, inner) => {
    const coll = (variables as any)[collName]
    if (!Array.isArray(coll) || coll.length === 0) return ''
    // For each item, replace {{this.prop}} inside inner template
    return coll
      .map((item: any) => {
        return inner.replace(/{{\s*this\.([a-zA-Z0-9_\.]+)\s*}}/g, (_m2: string, propPath: string) => {
          const v = item && typeof item === 'object' ? (item[propPath] ?? '') : ''
          return String(v)
        })
      })
      .join('\n')
  })
}

function renderIfBlocks(content: string, variables: Record<string, unknown>) {
  // with else
  content = content.replace(/{{#if\s+([a-zA-Z0-9_\.]+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, (_m, varName, truthy, falsy) => {
    const v = (variables as any)[varName]
    return v ? truthy : falsy
  })
  // without else
  content = content.replace(/{{#if\s+([a-zA-Z0-9_\.]+)}}([\s\S]*?){{\/if}}/g, (_m, varName, truthy) => {
    const v = (variables as any)[varName]
    return v ? truthy : ''
  })
  return content
}

function extractRequiredVariablesFromTemplate(template: any): string[] {
  const subject = (template?.subject_template as string) || ''
  const body = ((template?.body_html as string) || (template?.body_markdown as string) || '') as string
  const regex = /{{\s*([a-zA-Z0-9_\.]+)\s*}}/g
  const keys = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = regex.exec(subject)) !== null) { if (m[1]) keys.add(m[1]) }
  regex.lastIndex = 0
  while ((m = regex.exec(body)) !== null) { if (m[1]) keys.add(m[1]) }
  return Array.from(keys)
}

function processTemplateWithValidation(template: any, variables: Record<string, unknown>): { subject: string; htmlContent: string; missing: string[] } {
  // Előbb rendereljük a sablont (default + user változók felhasználásával)
  // First expand simple blocks so `this.*` tokens and conditional sections are materialized
  let rawHtml = (template?.body_html as string) || (template?.body_markdown as string) || ''
  rawHtml = renderEachBlocks(rawHtml, variables)
  rawHtml = renderIfBlocks(rawHtml, variables)

  // subject can also include if/each but usually simple tokens; expand as well
  let rawSubject = (template?.subject_template as string) || ''
  rawSubject = renderIfBlocks(renderEachBlocks(rawSubject, variables), variables)

  const { subject, htmlContent } = processTemplate({ subject_template: rawSubject, body_html: rawHtml }, variables)
  // Ezután keressük meg a megmaradt placeholdereket; ezek a ténylegesen hiányzók
  const unresolved = extractRequiredVariablesFromTemplate({ subject_template: subject, body_html: htmlContent })
  return { subject, htmlContent, missing: unresolved }
}

// Error classification for retries
function classifySendError(err: any): { retryable: boolean; reason: string } {
  const msg = (err?.message || '').toLowerCase()
  const status = err?.status || err?.code
  if (typeof status === 'number') {
    if (status >= 500) return { retryable: true, reason: `provider_${status}` }
    if (status === 408 || status === 429) return { retryable: true, reason: `provider_${status}` }
    return { retryable: false, reason: `provider_${status}` }
  }
  if (msg.includes('timeout') || msg.includes('network')) return { retryable: true, reason: 'network_error' }
  if (msg.includes('invalid') || msg.includes('bounce')) return { retryable: false, reason: 'hard_bounce' }
  return { retryable: true, reason: 'transient_error' }
}

async function getAttemptCount(supabase: any, queueId: string): Promise<number> {
  try {
    const { data } = await supabase.from('email_analytics').select('id').eq('email_queue_id', queueId).in('event_type', ['attempt_failed'])
    return data?.length || 0
  } catch {
    return 0
  }
}

function computeBackoff(attempts: number): Date {
  const now = new Date()
  const schedule = [5 * 60 * 1000, 30 * 60 * 1000, 6 * 60 * 60 * 1000]
  const idx = Math.min(attempts, schedule.length - 1)
  return new Date(now.getTime() + schedule[idx])
}

async function backfillMissingRecipients(supabase: any): Promise<BackfillResult> {
  const result: BackfillResult = { checked: 0, restored: 0, cancelled: 0 }
  const { data: items } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .or('recipient_email.is.null,recipient_email.eq.')
    .limit(200)

  if (!items || items.length === 0) return result

  for (const q of items) {
    result.checked++
    let recipient: { email?: string | null; name?: string | null } = {}

    if (q.session_id) {
      const { data: sess } = await supabase.from('quiz_sessions').select('*').eq('id', q.session_id).maybeSingle()
      const email = (sess?.user_email || sess?.email || null) as string | null
      const name = (sess?.user_name || sess?.name || null) as string | null
      if (email) recipient = { email, name }

      if (!recipient.email) {
        const { data: lead } = await supabase.from('quiz_leads').select('*').eq('session_id', q.session_id).maybeSingle()
        if (lead?.email) recipient = { email: lead.email, name: lead.name || null }
      }
    }

    if (recipient.email) {
      await supabase.from('email_queue').update({ recipient_email: recipient.email, recipient_name: recipient.name || null }).eq('id', q.id)
      result.restored++
    } else {
      await supabase.from('email_queue').update({ status: 'cancelled', error_message: 'missing_recipient' }).eq('id', q.id)
      result.cancelled++
    }
  }

  return result
}

// Requeue items stuck in 'processing' state beyond a threshold
async function requeueStaleProcessing(supabase: any) {
  const thresholdMs = parseInt(process.env.EMAIL_PROCESSING_STALE_MS || '', 10) || 15 * 60 * 1000 // 15 minutes
  const cutoff = new Date(Date.now() - thresholdMs).toISOString()

  // Some schemas may not have updated_at; fall back to created_at
  const { data: staleByUpdated } = await supabase
    .from('email_queue')
    .select('id')
    .eq('status', 'processing')
    .lte('updated_at', cutoff)
    .limit(200)

  const { data: staleByCreated } = await supabase
    .from('email_queue')
    .select('id')
    .eq('status', 'processing')
    .is('updated_at', null)
    .lte('created_at', cutoff)
    .limit(200)

  const ids = [
    ...(staleByUpdated?.map((r: any) => r.id) || []),
    ...(staleByCreated?.map((r: any) => r.id) || [])
  ]
  const unique = Array.from(new Set(ids))
  if (unique.length === 0) return

  await supabase
    .from('email_queue')
    .update({ status: 'pending', scheduled_at: new Date().toISOString(), error_message: 'requeued_stale_processing' })
    .in('id', unique)
}
