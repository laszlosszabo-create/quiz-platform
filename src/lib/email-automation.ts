import { getSupabaseAdmin } from '@/lib/supabase-config'
import { markdownToHtml } from '@/lib/markdown'

export interface EmailTriggerEvent {
  type: 'quiz_complete' | 'purchase' | 'no_purchase_reminder'
  quiz_id: string
  user_email: string
  user_name?: string
  quiz_result?: {
    percentage: number
    text: string
    ai_result?: string
  }
  product_id?: string
  order_id?: string
  metadata?: Record<string, any>
}

// Central helper: build canonical variables for result emails by merging AI result and score data.
export async function prepareEmailAnalysisVariables(
  event: EmailTriggerEvent,
  supabase: any,
  rule?: any
): Promise<Record<string, any>> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quizapp.hu'

  const variables: Record<string, any> = {
    user_name: event.user_name || 'Értékes Ügyfél',
    user_email: event.user_email,
    quiz_id: event.quiz_id,
    quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
    support_email: process.env.SUPPORT_EMAIL || 'support@quizapp.hu',
    company_name: 'Quiz Platform',
    quiz_title: 'Quiz',
    percentage: '0',
    score: '0',
    category: 'Alapszintű',
    // URL variables
    result_url: `${baseUrl}/results?session=${event.metadata?.session_id || ''}`,
    booking_url: `${baseUrl}/booking?quiz=${event.quiz_id}`,
    download_url: `${baseUrl}/downloads?quiz=${event.quiz_id}&result=${event.metadata?.session_id || ''}`,
    unsubscribe_url: `${baseUrl}/unsubscribe`,
  }

  // Helper to safely stringify
  const safeString = (v: any) => (v == null ? '' : String(v))

  // If quiz_result came from the trigger, seed variables (best-effort)
  if (event.quiz_result) {
    variables.quiz_result_percentage = safeString(event.quiz_result.percentage)
    variables.percentage = safeString(event.quiz_result.percentage ?? variables.percentage)
    // Do not try to invent an absolute score here if DB scores exist later
    variables.score = safeString(event.quiz_result.text ? '' : variables.score)
    variables.quiz_result_text = safeString(event.quiz_result.text)
    if (event.quiz_result.ai_result) variables.ai_result = String(event.quiz_result.ai_result)
    variables.category = safeString(event.quiz_result.text || variables.category)
  }

  // Late enrichment from DB: prefer authoritative session.scores and answers
  try {
    const sessionId = event.metadata?.session_id
    if (sessionId) {
      const { data: sessionRow } = await supabase.from('quiz_sessions').select('answers, scores, result_snapshot, quiz_id').eq('id', sessionId).maybeSingle()
      if (sessionRow) {
        const answers = (sessionRow as any).answers || {}
        const scoresObj = (sessionRow as any).scores || {}
        const snapshot = (sessionRow as any).result_snapshot || {}

        // Prefer DB scores if present
        if (scoresObj && (scoresObj.total != null || scoresObj.totalScore != null)) {
          const actualScore = scoresObj.total ?? scoresObj.totalScore
          variables.score = safeString(actualScore)

          // Category mapping (internal -> localized)
          if (scoresObj.category) {
            variables.category = scoresObj.category === 'high' ? 'Magas' : scoresObj.category === 'medium' ? 'Közepes' : 'Alacsony'
          }

          // If description contains (NN%) extract it
          if (scoresObj.description && typeof scoresObj.description === 'string') {
            const m = String(scoresObj.description).match(/\((\d{1,3})%\)/)
            if (m) {
              variables.percentage = m[1]
              variables.quiz_result_percentage = m[1]
            }
          }
        }

        // Populate QA pairs
        variables.qa_pairs = Object.keys(answers || {}).map(k => ({ question: k, answer: answers[k] }))
        variables.scores = scoresObj

        // If AI exists in snapshot and not passed in event, prefer snapshot.ai_result
        if (!variables.ai_result && snapshot?.ai_result) {
          variables.ai_result = String(snapshot.ai_result)
        }

        // Compute a top_category fallback if not present
        if (!variables.category || variables.category === 'Alapszintű') {
          const totalScore = Object.values(scoresObj || {}).reduce((s: number, v: any) => s + (Number(v) || 0), 0)
          const possible = Math.max(1, Object.keys(answers || {}).length * 5)
          const pct = Math.round((totalScore / possible) * 100)
          let top = 'Alacsony'
          if (pct > 60) top = 'Magas'
          else if (pct > 30) top = 'Közepes'
          variables.top_category = top
        }
      }
    }
  } catch (e) {
    console.warn('prepareEmailAnalysisVariables: late enrichment failed', e)
  }

  // Generate comprehensive textual evaluation
  const textualEvaluation = generateTextualEvaluation(variables)

  // Build final analysis_html: prefer comprehensive evaluation, fallback to AI HTML, append score summary
  const escapeHtml = (input?: string) => (input ? String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '')
  
  // Check if AI result contains obviously wrong data (like "0 pont" when score is > 0)
  const aiHtml = variables.ai_result ? (String(variables.ai_result).startsWith('<') ? String(variables.ai_result) : markdownToHtml(String(variables.ai_result))) : ''
  const hasWrongAiData = aiHtml && variables.score && Number(variables.score) > 0 && aiHtml.includes('0 pont')
  
  const scoreDescParts: string[] = []
  if (variables.category) scoreDescParts.push(variables.category)
  if (variables.score) scoreDescParts.push(`Pontszám: ${variables.score}`)
  if (variables.percentage) scoreDescParts.push(`(${variables.percentage}%)`)
  const scoreSummary = scoreDescParts.join(' | ')

  variables.ai_html = aiHtml
  
  // Use textual evaluation if AI is wrong/missing, otherwise combine AI with score summary
  if (hasWrongAiData || !aiHtml) {
    variables.analysis_html = textualEvaluation
  } else {
    variables.analysis_html = `${aiHtml}${scoreSummary ? `<hr/><div class="score-summary">${escapeHtml(scoreSummary)}</div>` : ''}`
  }

  // Also provide the textual evaluation as a separate variable
  variables.textual_evaluation = textualEvaluation

  // Merge metadata into variables (preserve existing keys)
  if (event.metadata) {
    Object.entries(event.metadata).forEach(([k, v]) => {
      if (!(k in variables)) variables[k] = v
    })
  }

  return variables
}

// Generate comprehensive textual evaluation based on score and category
function generateTextualEvaluation(variables: Record<string, any>): string {
  const score = Number(variables.score) || 0
  const percentage = Number(variables.percentage) || 0
  const category = variables.category || 'Alapszintű'
  const scoresObj = variables.scores || {}
  
  // Use the description from scoring rules if available
  if (scoresObj.description && typeof scoresObj.description === 'string' && !scoresObj.description.includes('0 pont')) {
    return `<div class="evaluation-content">
      <h3>Az Ön eredménye</h3>
      <div class="score-header">
        <strong>${category}</strong> | Pontszám: ${score} (${percentage}%)
      </div>
      <div class="detailed-analysis">
        ${escapeHtmlForEvaluation(String(scoresObj.description).replace(/^[^|]*\|/, '').trim())}
      </div>
    </div>`
  }
  
  // Generate evaluation based on category and score
  let evaluationText = ''
  let recommendations = ''
  
  if (category.includes('Magas') || score > 30) {
    evaluationText = 'Az eredmények alapján érdemes szakemberrel konzultálni a további lépésekről. A magasabb pontszám azt jelzi, hogy több területen is megjelenhetnek olyan tünetek, amelyek befolyásolhatják a mindennapokat.'
    recommendations = 'Javasoljuk, hogy keressen fel egy szakembert (háziorvos, pszichiáter, pszichológus), aki részletes felmérést végezhet és segíthet a megfelelő támogatás megtalálásában.'
  } else if (category.includes('Közepes') || score > 15) {
    evaluationText = 'Az eredmények vegyes képet mutatnak. Néhány területen megjelenhetnek olyan jellemzők, amelyek időnként kihívást jelenthetnek, de ezek még nem feltétlenül utalnak komoly problémákra.'
    recommendations = 'Érdemes odafigyelni ezekre a területekre és megfigyelni, hogy mennyire befolyásolják a mindennapokat. Ha úgy érzi, hogy ezek a jellemzők rendszeresen nehézséget okoznak, érdemes szakemberrel konzultálni.'
  } else {
    evaluationText = 'Az eredmények alapján a legtöbb területen nem mutatkoznak jelentős nehézségek. Ez pozitív jel, de fontos tudni, hogy minden ember más, és az eredmény csak egy pillanatképet ad.'
    recommendations = 'Amennyiben a jövőben változást észlel a figyelem, koncentráció vagy szervezés terén, ne habozzon szakemberhez fordulni tanácsért.'
  }
  
  return `<div class="evaluation-content">
    <h3>Az Ön eredménye</h3>
    <div class="score-header">
      <strong>${category}</strong> | Pontszám: ${score} (${percentage}%)
    </div>
    <div class="detailed-analysis">
      <p><strong>Értékelés:</strong> ${evaluationText}</p>
      <p><strong>Ajánlások:</strong> ${recommendations}</p>
      <p><em>Fontos:</em> Ez az értékelés csak tájékoztató jellegű, nem helyettesíti a szakorvosi diagnózist.</p>
    </div>
  </div>`
}

function escapeHtmlForEvaluation(input?: string): string {
  if (!input) return ''
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export class EmailAutomationTrigger {
  private _supabase: any | null = null
  private get supabase() {
    if (!this._supabase) {
      this._supabase = getSupabaseAdmin()
    }
    return this._supabase
  }

  async triggerEmails(event: EmailTriggerEvent): Promise<void> {
    try {
      console.log(`Processing email trigger: ${event.type} for quiz ${event.quiz_id}`)

      // Get matching automation rules
      let rules: any[] | null = null
      // Attempt new schema first
      {
        const { data, error } = await this.supabase
          .from('email_automation_rules')
          .select(`
            *,
            email_templates (*)
          `)
          .eq('quiz_id', event.quiz_id)
          .eq('trigger_event', event.type)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.warn('Rules query (trigger_event) failed, will try legacy rule_type:', error?.message || error)
        } else {
          rules = data
        }
      }
      // Fallback to legacy schema
      if (!rules || rules.length === 0) {
        const { data, error } = await this.supabase
          .from('email_automation_rules')
          .select(`
            *,
            email_templates (*)
          `)
          .eq('quiz_id', event.quiz_id)
          .eq('rule_type', event.type)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.error('Error fetching automation rules (legacy rule_type):', error)
          return
        }
        rules = data
      }

      if (!rules || rules.length === 0) {
        console.log(`No active automation rules found for ${event.type} on quiz ${event.quiz_id}`)
        return
      }

      // Process each rule (double-check type in case of broader query)
  for (const rule of rules) {
        try {
          await this.processRule(rule, event)
        } catch (error) {
          console.error(`Error processing rule ${rule.id}:`, error)
          // Continue with other rules even if one fails
        }
      }

    } catch (error) {
      console.error('Email trigger error:', error)
    }
  }

  private async processRule(rule: any, event: EmailTriggerEvent): Promise<void> {
    // Best-effort enrichment: if user_email is missing but we have session_id, fetch from quiz_sessions
    let enrichedEmail = event.user_email
    let enrichedName = event.user_name
    const sessionId = event.metadata?.session_id
  if ((!enrichedEmail || enrichedEmail.trim() === '') && sessionId) {
      try {
        const { data: sessionRow } = await this.supabase
          .from('quiz_sessions')
          .select('*')
          .eq('id', sessionId)
          .maybeSingle()
        if (sessionRow) {
          enrichedEmail = (sessionRow as any).user_email || (sessionRow as any).email || enrichedEmail
          enrichedName = (sessionRow as any).user_name || (sessionRow as any).name || enrichedName
          console.log('Enrichment from session', sessionId, {
            user_email: (sessionRow as any).user_email,
            email: (sessionRow as any).email,
            user_name: (sessionRow as any).user_name,
            name: (sessionRow as any).name
          })

          // Fallback via linked lead
          if ((!enrichedEmail || enrichedEmail.trim() === '') && (sessionRow as any).lead_id) {
            try {
              const { data: leadRow } = await this.supabase
                .from('leads')
                .select('email, name')
                .eq('id', (sessionRow as any).lead_id)
                .maybeSingle()
              if (leadRow) {
                enrichedEmail = (leadRow as any).email || enrichedEmail
                enrichedName = (leadRow as any).name || enrichedName
                console.log('Enrichment from leads via session.lead_id', (sessionRow as any).lead_id, leadRow)
              }
            } catch (e) {
              console.warn('Failed to enrich from leads via session.lead_id:', e)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to enrich user email/name from session:', e)
      }

      // Secondary fallback chain: quiz_leads by session_id -> recent leads -> recent quiz_leads
      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: ql } = await this.supabase
            .from('quiz_leads')
            .select('email') // legacy schema may not have name column
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (ql) {
            enrichedEmail = (ql as any).email || enrichedEmail
            // name may not exist on legacy schema; keep existing enrichedName
            console.log('Enrichment from quiz_leads by session', sessionId, ql)
          }
        } catch (e) {
          console.warn('Failed to enrich from quiz_leads by session:', e)
        }
      }

      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: lead } = await this.supabase
            .from('leads')
            .select('email, name')
            .eq('quiz_id', event.quiz_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (lead) {
            enrichedEmail = (lead as any).email || enrichedEmail
            enrichedName = (lead as any).name || enrichedName
            console.log('Enrichment from leads recent', lead)
          }
        } catch (e) {
          console.warn('Failed to enrich from leads recent:', e)
        }
      }

      if ((!enrichedEmail || enrichedEmail.trim() === '')) {
        try {
          const { data: qlRecent } = await this.supabase
            .from('quiz_leads')
            .select('email') // legacy schema may not have name column
            .eq('quiz_id', event.quiz_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (qlRecent) {
            enrichedEmail = (qlRecent as any).email || enrichedEmail
            console.log('Enrichment from quiz_leads recent', qlRecent)
          }
        } catch (e) {
          console.warn('Failed to enrich from quiz_leads recent:', e)
        }
      }
    }

    // Check if conditions are met
  if (!this.evaluateConditions(rule.conditions || rule.trigger_conditions, event)) {
      console.log(`Conditions not met for rule ${rule.id}`)
      return
    }

    // Check send limits
  if (await this.hasReachedSendLimit(rule, { ...event, user_email: enrichedEmail || event.user_email })) {
      console.log(`Send limit reached for rule ${rule.id}`)
      return
    }

    // Calculate schedule time. If recipient not yet known, add a small buffer to allow lead capture/backfill.
    const scheduledAt = new Date()
    if (rule.delay_minutes > 0) {
      scheduledAt.setMinutes(scheduledAt.getMinutes() + rule.delay_minutes)
    }
    const willNeedBackfill = !enrichedEmail && !event.user_email
    if (willNeedBackfill) {
      scheduledAt.setMinutes(scheduledAt.getMinutes() + 5) // +5 minutes buffer
    }

    // Enrich variables for product purchase: product name and AI result from session cache
    let productName: string | undefined
    let productAiHtml: string | undefined
    try {
      if (event.type === 'purchase' && event.product_id) {
        // Fetch product name
        const { data: product } = await this.supabase
          .from('products')
          .select('name')
          .eq('id', event.product_id)
          .maybeSingle()
        productName = (product as any)?.name

        // If session present, try to extract product AI from session cache; else from SQL table
        const sid = event.metadata?.session_id
        if (sid) {
          const { data: sessionRow } = await this.supabase
            .from('quiz_sessions')
            .select('product_ai_results')
            .eq('id', sid)
            .maybeSingle()
          const ai = (sessionRow?.product_ai_results as any)?.[event.product_id]?.ai_result
          if (ai) {
            productAiHtml = markdownToHtml(String(ai))
          } else {
            const { data: row } = await this.supabase
              .from('product_ai_results')
              .select('ai_result')
              .eq('session_id', sid)
              .eq('product_id', event.product_id)
              .eq('lang', (event as any).lang || 'hu')
              .maybeSingle()
            const tableAi = (row as any)?.ai_result
            if (tableAi) productAiHtml = markdownToHtml(String(tableAi))
          }
        }
      }
    } catch (e) {
      console.warn('Purchase enrichment failed:', e)
    }

    // Prepare email variables
  console.log('Before prepareVariables - event:', JSON.stringify({ ...event, user_email: enrichedEmail || event.user_email, user_name: enrichedName || event.user_name }, null, 2))
  // prepareVariables may do lightweight work but also supports late enrichment from DB
  const baseVars = await this.prepareVariables({ ...event, user_email: enrichedEmail || event.user_email, user_name: enrichedName || event.user_name }, rule)
    const variables = {
      ...baseVars,
      ...(productName ? { product_name: productName } : {}),
      ...(productAiHtml ? { ai_result: productAiHtml } : {}),
    }
    console.log('After prepareVariables - variables:', variables)

    // Validate template tokens before queuing to avoid silent validation failures later
    const subjectTemplate = rule.email_templates.subject_template || ''
    const rawBodyTemplate = rule.email_templates.body_html || rule.email_templates.body_markdown || ''

    const missingInSubject = this.validateTemplateVariables(subjectTemplate, variables)
    const missingInBody = this.validateTemplateVariables(rawBodyTemplate, variables)
    const missingAll = Array.from(new Set([...missingInSubject, ...missingInBody]))

    if (missingAll.length > 0) {
      // Insert a failed queue item with clear validation message for visibility and manual remediation
      const errMsg = `VALIDATION_ERROR missing: ${missingAll.join(',')}`
      console.warn(`Template validation failed for rule ${rule.id}:`, errMsg)
      const { error: failErr } = await this.supabase.from('email_queue').insert({
        session_id: event.metadata?.session_id || null,
        template_id: rule.email_template_id,
        automation_rule_id: rule.id,
        recipient_email: enrichedEmail || event.user_email,
        recipient_name: enrichedName || event.user_name,
        subject: this.processTemplate(subjectTemplate, variables),
        body_html: '',
        body_markdown: rule.email_templates.body_markdown,
        variables_used: variables,
        scheduled_at: scheduledAt.toISOString(),
        status: 'failed',
        error_message: errMsg
      })
      if (failErr) {
        console.error('Error inserting validation-failed queue item:', failErr)
      }
      return
    }

    // Render template body: prefer HTML template; fallback to markdown converted to HTML
    const renderedBody = this.processTemplate(rawBodyTemplate, variables)
    const bodyHtmlFinal = rule.email_templates.body_html
      ? renderedBody
      : markdownToHtml(renderedBody)

    const { error: queueError } = await this.supabase
      .from('email_queue')
      .insert({
        session_id: event.metadata?.session_id || null,
        template_id: rule.email_template_id,
        automation_rule_id: rule.id,
        recipient_email: enrichedEmail || event.user_email,
        recipient_name: enrichedName || event.user_name,
        subject: this.processTemplate(subjectTemplate, variables),
        body_html: bodyHtmlFinal,
        body_markdown: rule.email_templates.body_markdown,
        variables_used: variables,
        scheduled_at: scheduledAt.toISOString(),
        status: 'pending'
      })

    if (queueError) {
      console.error('Error queuing email:', queueError)
      throw queueError
    }

    console.log(`Email queued for rule ${rule.id}, scheduled for ${scheduledAt.toISOString()}`)

    // Optional: in development mode, trigger immediate processing to avoid relying on external cron
    try {
      const isDev = process.env.NODE_ENV !== 'production'
      const autoProcess = process.env.EMAIL_AUTOPROCESS === '1' || process.env.EMAIL_AUTOPROCESS === 'true'
      const criticalEvents = (process.env.CRITICAL_EMAIL_EVENTS || 'quiz_complete,purchase').split(',').map(s=>s.trim()).filter(Boolean)
      const isCritical = criticalEvents.includes(event.type)
      if (isDev || autoProcess || isCritical) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        fetch(`${baseUrl}/api/cron/process-email-queue?safe=true&backfill=true&retry=true&rate=5`).catch(() => {})
      }
    } catch (e) {
      console.warn('Email auto-process trigger failed:', e)
    }
  }

  private evaluateConditions(conditions: Record<string, any>, event: EmailTriggerEvent): boolean {
    if (!conditions || Object.keys(conditions).length === 0) {
      return true // No conditions = always match
    }

    // Evaluate quiz result conditions
    if (conditions.min_percentage && event.quiz_result) {
      if (event.quiz_result.percentage < conditions.min_percentage) {
        return false
      }
    }

    if (conditions.max_percentage && event.quiz_result) {
      if (event.quiz_result.percentage > conditions.max_percentage) {
        return false
      }
    }

    // Evaluate product conditions
    if (conditions.requires_product_id && !event.product_id) {
      return false
    }

    if (conditions.specific_product_ids) {
      const allowedProducts = conditions.specific_product_ids
      if (Array.isArray(allowedProducts) && event.product_id && !allowedProducts.includes(event.product_id)) {
        return false
      }
    }

    // Evaluate time-based conditions
    if (conditions.days_since_completion && event.metadata?.completion_date) {
      const daysSince = Math.floor((Date.now() - new Date(event.metadata.completion_date).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince < conditions.days_since_completion) {
        return false
      }
    }

    return true
  }

  private async hasReachedSendLimit(rule: any, event: EmailTriggerEvent): Promise<boolean> {
    if (!rule.max_sends || rule.max_sends <= 0) {
      return false // No limit
    }

    // Count previous sends for this rule and recipient
    const { count, error } = await this.supabase
      .from('email_queue')
      .select('*', { count: 'exact', head: true })
      .eq('automation_rule_id', rule.id)
      .eq('recipient_email', event.user_email)
      .in('status', ['pending', 'processing', 'sent'])

    if (error) {
      console.error('Error checking send limit:', error)
      return true // Assume limit reached on error to be safe
    }

    return (count || 0) >= rule.max_sends
  }

  private async prepareVariables(event: EmailTriggerEvent, rule: any): Promise<Record<string, any>> {





  return await prepareEmailAnalysisVariables(event, this.supabase, rule)
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template
    
    // Replace all variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      const stringValue = String(value || '')
      processed = processed.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), stringValue)
    })
    
    return processed
  }

  // Extract tokens like {{var}} or {{nested.path}} from a template string
  private extractTemplateTokens(template: string): string[] {
    const re = /{{\s*([^{}\s]+)\s*}}/g
    const set = new Set<string>()
    let m: RegExpExecArray | null
    while ((m = re.exec(template))) {
      if (m[1]) set.add(m[1])
    }
    return Array.from(set)
  }

  // Resolve a token path against the variables object. Supports dot-paths and array indexes.
  // Special-case: tokens starting with `this.` are considered satisfied if `qa_pairs` exists (templating loop context).
  private resolveVariableValue(variables: Record<string, any>, token: string): any {
    if (!token) return undefined

    // handle 'this.xxx' tokens used inside template loops
    if (token.startsWith('this.')) {
      const rest = token.slice(5)
      if (Array.isArray(variables.qa_pairs) && variables.qa_pairs.length > 0) {
        // return first item's property as an existence check
        return (variables.qa_pairs[0] as any)[rest]
      }
      return undefined
    }

    const parts = token.split('.')
    let cur: any = variables
    for (const p of parts) {
      if (cur == null) return undefined
      // numeric index for arrays
      if (Array.isArray(cur)) {
        const idx = Number(p)
        if (!Number.isFinite(idx)) return undefined
        cur = cur[idx]
      } else {
        cur = cur[p]
      }
    }
    return cur
  }

  // Validate that all tokens found in a template are resolvable from variables.
  // Returns array of missing tokens (empty = ok).
  private validateTemplateVariables(template: string, variables: Record<string, any>): string[] {
    const tokens = this.extractTemplateTokens(template || '')
    const missing: string[] = []
    for (const t of tokens) {
      const val = this.resolveVariableValue(variables, t)
      if (val === undefined || val === null) {
        missing.push(t)
      }
    }
    return missing
  }

  // Helper method to trigger quiz completion emails
  async triggerQuizCompletion(quizId: string, userEmail: string, quizResult: any, userName?: string, sessionId?: string): Promise<void> {
    await this.triggerEmails({
      type: 'quiz_complete',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      quiz_result: quizResult,
      metadata: sessionId ? { session_id: sessionId } : undefined
    })
  }

  // Helper method to trigger purchase confirmation emails
  async triggerPurchaseConfirmation(quizId: string, userEmail: string, productId: string, orderId: string, userName?: string): Promise<void> {
    await this.triggerEmails({
      type: 'purchase',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      product_id: productId,
      order_id: orderId
    })
  }

  // Helper method to trigger reminder emails
  async triggerReminder(quizId: string, userEmail: string, metadata?: Record<string, any>, userName?: string): Promise<void> {
    await this.triggerEmails({
      type: 'no_purchase_reminder',
      quiz_id: quizId,
      user_email: userEmail,
      user_name: userName,
      metadata: metadata
    })
  }
}

// Lazy singleton accessor to avoid hard crash during environment diagnostics
let _emailTrigger: EmailAutomationTrigger | null = null
export const emailTrigger = (() => {
  return new Proxy({}, {
    get(_t, prop) {
      if (!_emailTrigger) _emailTrigger = new EmailAutomationTrigger()
      // @ts-ignore
      return _emailTrigger[prop]
    }
  }) as unknown as EmailAutomationTrigger
})()
