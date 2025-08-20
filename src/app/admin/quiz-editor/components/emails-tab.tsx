'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Mail, Plus, Pencil, Trash2, Send, Eye, RefreshCcw, Copy, X } from 'lucide-react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

interface EmailsTabProps {
  quizId: string
  products: any[]
}

type TemplateType = 'result' | 'purchase' | 'reminder' | 'custom'
type TriggerEvent = 'quiz_complete' | 'purchase' | 'no_purchase_reminder'

type EmailTemplate = {
  id: string
  quiz_id: string
  product_id: string | null
  template_type: TemplateType
  lang: string
  template_name: string
  subject_template: string
  body_markdown: string
  body_html?: string | null
  variables: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

type AutomationRule = {
  id: string
  quiz_id: string
  rule_name: string
  rule_type: TriggerEvent
  trigger_conditions: Record<string, any>
  delay_minutes: number
  email_template_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const defaultVariables: Record<string, string> = {
  user_name: 'Felhasználó neve',
  user_email: 'Email címe',
  quiz_title: 'Quiz címe',
  score: 'Pontszám',
  percentage: 'Százalékos eredmény',
  category: 'Eredmény kategória',
  ai_result: 'AI generált elemzés',
  result_url: 'Eredmény oldal URL',
  booking_url: 'Foglalási URL',
  download_url: 'Letöltési URL',
  unsubscribe_url: 'Leiratkozási URL'
}

export default function EmailsTab({ quizId, products }: EmailsTabProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [filterLang, setFilterLang] = useState<string>('all')
  const [filterType, setFilterType] = useState<'all' | TemplateType>('all')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Automation rules state
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [loadingRules, setLoadingRules] = useState(false)
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const [ruleForm, setRuleForm] = useState<Partial<AutomationRule>>({})

  const [showEditor, setShowEditor] = useState(false)
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
  const [form, setForm] = useState<Partial<EmailTemplate>>({})
  const [previewHtml, setPreviewHtml] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const [showTest, setShowTest] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  const languages = useMemo(() => {
    const set = new Set<string>()
    templates.forEach(t => set.add(t.lang))
    if (set.size === 0) set.add('hu')
    return Array.from(set)
  }, [templates])

  const productOptions = useMemo(() => {
    return products?.map((p: any) => ({ id: p.id ?? p.product_id ?? p.slug ?? String(p), name: p.name ?? p.title ?? p.slug ?? String(p) })) || []
  }, [products])

  const filtered = useMemo(() => {
    return templates.filter(t => {
      if (filterLang !== 'all' && t.lang !== filterLang) return false
      if (filterType !== 'all' && t.template_type !== filterType) return false
      if (filterProduct !== 'all' && (t.product_id || '') !== (filterProduct === 'quiz' ? '' : filterProduct)) return false
      if (search && !(`${t.template_name} ${t.subject_template}`.toLowerCase().includes(search.toLowerCase()))) return false
      return true
    })
  }, [templates, filterLang, filterType, filterProduct, search])

  useEffect(() => {
    void fetchTemplates()
    void fetchAutomationRules()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  async function fetchTemplates() {
    if (!quizId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/email-templates?quiz_id=${quizId}`)
      if (!res.ok) throw new Error('Sablonok betöltése sikertelen')
      const json = await res.json()
      setTemplates(json.templates || [])
    } catch (e: any) {
      setError(e?.message || 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  async function fetchAutomationRules() {
    if (!quizId) return
    setLoadingRules(true)
    try {
      const res = await fetch(`/api/admin/email-automation-rules?quiz_id=${quizId}`)
      if (!res.ok) throw new Error('Automatizálási szabályok betöltése sikertelen')
      const json = await res.json()
      setAutomationRules(json.rules || [])
    } catch (e: any) {
      console.error('Automation rules fetch error:', e)
    } finally {
      setLoadingRules(false)
    }
  }

  function openCreate() {
    const firstLang = languages[0] || 'hu'
    setEditing(null)
    setForm({
      quiz_id: quizId,
      product_id: null,
      template_type: 'result',
      lang: firstLang,
      template_name: '',
      subject_template: '',
      body_markdown: '',
      variables: { ...defaultVariables },
      is_active: true
    })
    setPreviewHtml('')
    setJsonError(null)
    setShowEditor(true)
    setShowTest(false)
  }

  function openEdit(t: EmailTemplate) {
    setEditing(t)
    setForm({ ...t })
    setPreviewHtml(renderPreview(t.body_markdown || ''))
    setJsonError(null)
    setShowEditor(true)
    setShowTest(false)
  }

  function onFormChange<K extends keyof EmailTemplate>(key: K, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'body_markdown') {
      setPreviewHtml(renderPreview(String(value || '')))
    }
  }

  function renderPreview(markdown: string) {
    try {
      const raw = marked.parse(markdown || '') as string
      return DOMPurify.sanitize(raw)
    } catch (e) {
      return ''
    }
  }

  async function saveTemplate() {
    if (!form.template_name || !form.subject_template || !form.body_markdown) {
      alert('Név, tárgy és tartalom kötelező')
      return
    }

    try {
      const payload: any = {
        quiz_id: quizId,
        product_id: form.product_id || null,
        template_type: form.template_type || 'custom',
        lang: form.lang || 'hu',
        template_name: form.template_name,
        subject_template: form.subject_template,
        body_markdown: form.body_markdown,
        variables: form.variables || {},
        is_active: form.is_active !== false
      }
      let res: Response
      if (editing) {
        res = await fetch('/api/admin/email-templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...payload })
        })
      } else {
        res = await fetch('/api/admin/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
      if (!res.ok) throw new Error('Mentés sikertelen')
      await fetchTemplates()
      setShowEditor(false)
    } catch (e: any) {
      alert(e?.message || 'Mentés sikertelen')
    }
  }

  async function removeTemplate(id: string) {
    if (!confirm('Biztosan törlöd ezt a sablont?')) return
    try {
      const res = await fetch(`/api/admin/email-templates?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Törlés sikertelen')
      await fetchTemplates()
    } catch (e: any) {
      alert(e?.message || 'Törlés sikertelen')
    }
  }

  async function toggleActive(t: EmailTemplate) {
    try {
      const payload = {
        id: t.id,
        quiz_id: t.quiz_id,
        product_id: t.product_id,
        template_type: t.template_type,
        lang: t.lang,
        template_name: t.template_name,
        subject_template: t.subject_template,
        body_markdown: t.body_markdown,
        variables: t.variables || {},
        is_active: !t.is_active
      }
      const res = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Frissítés sikertelen')
      await fetchTemplates()
    } catch (e: any) {
      alert(e?.message || 'Frissítés sikertelen')
    }
  }

  async function duplicateTemplate(t: EmailTemplate) {
    try {
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: t.quiz_id,
          product_id: t.product_id,
          template_type: t.template_type,
          lang: t.lang,
          template_name: `${t.template_name} (másolat)`,
          subject_template: t.subject_template,
          body_markdown: t.body_markdown,
          variables: t.variables || {},
          is_active: false
        })
      })
      if (!res.ok) throw new Error('Duplikálás sikertelen')
      await fetchTemplates()
    } catch (e: any) {
      alert(e?.message || 'Duplikálás sikertelen')
    }
  }

  async function sendTest() {
    if (!editing?.id || !testEmail) {
      alert('Válassz sablont és add meg a címet')
      return
    }
    setSendingTest(true)
    try {
      const res = await fetch('/api/admin/email-send?action=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: editing.id,
          recipient_email: testEmail,
          variables: editing.variables || {}
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Teszt küldés sikertelen')
      alert('Teszt email elküldve')
      setShowTest(false)
    } catch (e: any) {
      alert(e?.message || 'Teszt küldés sikertelen')
    } finally {
      setSendingTest(false)
    }
  }

  function updateVariablesJson(v: string) {
    try {
      const parsed = v ? JSON.parse(v) : {}
      setJsonError(null)
      setForm(prev => ({ ...prev, variables: parsed }))
    } catch (e: any) {
      setJsonError('Érvénytelen JSON')
    }
  }

  // Automation Rules Functions
  function openCreateRule() {
    setEditingRule(null)
    setRuleForm({
      quiz_id: quizId,
      rule_name: '',
      rule_type: 'quiz_complete',
      trigger_conditions: {},
      delay_minutes: 5,
  // default to first active template if available to avoid empty UUID
  email_template_id: (templates.find(t => t.is_active)?.id) || '',
      is_active: true
    })
    setShowRuleEditor(true)
  }

  function openEditRule(rule: AutomationRule) {
    setEditingRule(rule)
    setRuleForm({ ...rule })
    setShowRuleEditor(true)
  }

  function onRuleFormChange<K extends keyof AutomationRule>(key: K, value: any) {
    setRuleForm(prev => ({ ...prev, [key]: value }))
  }

  async function saveAutomationRule() {
    // basic client-side validation to avoid 400 from API
    const errors: string[] = []
    let name = (ruleForm.rule_name || '').trim()
    if (!name) {
      // generate a friendly default
      const delay = Number(ruleForm.delay_minutes || 0)
      const humanDelay = delay === 0 ? 'azonnal' : `${delay} perc`
      name = `Szabály – ${getTriggerEventName(ruleForm.rule_type as any)} – ${humanDelay}`
    }
    if (!ruleForm.rule_type) errors.push('Válassz esemény típust')
    if (!ruleForm.email_template_id) errors.push('Válassz email sablont')
    const delay = Number(ruleForm.delay_minutes)
    if (Number.isNaN(delay) || delay < 0) errors.push('A késleltetés percben legyen 0 vagy nagyobb')

    if (errors.length) {
      alert(errors.join('\n'))
      return
    }

    try {
      const url = '/api/admin/email-automation-rules'
      const method = editingRule ? 'PUT' : 'POST'
  const payload = {
        quiz_id: quizId,
        rule_name: name,
        rule_type: ruleForm.rule_type,
        trigger_conditions: ruleForm.trigger_conditions || {},
        delay_minutes: delay,
        email_template_id: ruleForm.email_template_id,
        is_active: ruleForm.is_active !== false,
        // include id on update
        ...(editingRule ? { id: editingRule.id } : {})
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = json?.error || json?.message || 'Automatizálási szabály mentése sikertelen'
        // if zod errors are present, show first message for clarity
        const zodMsg = json?.details?.[0]?.message
        throw new Error(zodMsg ? `${msg}: ${zodMsg}` : msg)
      }
      await fetchAutomationRules()
      setShowRuleEditor(false)
      setEditingRule(null)
    } catch (e: any) {
      alert(e?.message || 'Mentés sikertelen')
    }
  }

  async function removeAutomationRule(id: string) {
    if (!confirm('Biztosan törlöd ezt az automatizálási szabályt?')) return
    try {
      const res = await fetch(`/api/admin/email-automation-rules?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Törlés sikertelen')
      await fetchAutomationRules()
    } catch (e: any) {
      alert(e?.message || 'Törlés sikertelen')
    }
  }

  async function toggleRuleActive(rule: AutomationRule) {
    try {
      const res = await fetch('/api/admin/email-automation-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rule, is_active: !rule.is_active })
      })
      if (!res.ok) throw new Error('Aktiválás sikertelen')
      await fetchAutomationRules()
    } catch (e: any) {
      alert(e?.message || 'Aktiválás sikertelen')
    }
  }

  function getTriggerEventName(trigger: TriggerEvent) {
    switch (trigger) {
      case 'quiz_complete': return 'Quiz befejezése'
      case 'purchase': return 'Vásárlás megerősítése'
      case 'no_purchase_reminder': return 'Emlékeztető (nem vásárolt)'
      default: return trigger
    }
  }

  function formatDelayTime(minutes: number) {
    if (minutes < 60) return `${minutes} perc`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours} óra`
    return `${hours} óra ${remainingMinutes} perc`
  }

  return (
    <div className="space-y-6">
  <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email sablonok
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchTemplates} disabled={loading}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Frissítés
              </Button>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Új sablon
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="md:col-span-2">
              <Input placeholder="Keresés név vagy tárgy alapján..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterLang} onValueChange={setFilterLang}>
              <SelectTrigger>
                <SelectValue placeholder="Nyelv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes nyelv</SelectItem>
                {languages.map(l => (
                  <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Típus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes típus</SelectItem>
                <SelectItem value="result">Eredmény</SelectItem>
                <SelectItem value="purchase">Vásárlás</SelectItem>
                <SelectItem value="reminder">Emlékeztető</SelectItem>
                <SelectItem value="custom">Egyedi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Hatókör" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                <SelectItem value="quiz">Quiz szint</SelectItem>
                {productOptions.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 mb-2">{error}</div>
          )}

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Név</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Típus</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nyelv</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hatókör</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktív</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Betöltés...</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Nincs találat</td>
                  </tr>
                )}
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">{t.template_name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{t.subject_template}</div>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="secondary">{t.template_type}</Badge>
                    </td>
                    <td className="px-4 py-2">{t.lang.toUpperCase()}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {t.product_id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Termék szint
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                          Quiz szint
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Switch checked={t.is_active} onCheckedChange={() => toggleActive(t)} />
                        <span className={`text-xs ${t.is_active ? 'text-green-600' : 'text-gray-500'}`}>{t.is_active ? 'Aktív' : 'Inaktív'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(t)} title="Szerkesztés">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(t)} title="Duplikálás">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(t); setShowEditor(true); setShowTest(true); setTestEmail('') }} title="Teszt küldés">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeTemplate(t.id)} title="Törlés">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Automatizálási szabályok (időzítők)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={fetchAutomationRules} disabled={loadingRules}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Frissítés
              </Button>
              <Button onClick={openCreateRule} disabled={!templates.some(t => t.is_active)} title={templates.some(t => t.is_active) ? 'Új szabály' : 'Előbb aktiválj egy email sablont'}>
                <Plus className="h-4 w-4 mr-2" /> Új szabály
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRules && <div className="text-center py-4">Betöltés...</div>}
          {!loadingRules && automationRules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Még nincsenek automatizálási szabályok.
              {!templates.some(t => t.is_active) && (
                <div className="text-sm text-gray-600 mt-2">Előbb hozz létre és aktiválj egy email sablont a szabály létrehozásához.</div>
              )}
            </div>
          )}
          {!loadingRules && automationRules.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Esemény</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email sablon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Késleltetés</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Állapot</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Műveletek</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {automationRules.map(rule => {
                    const template = templates.find(t => t.id === rule.email_template_id)
                    return (
                      <tr key={rule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {getTriggerEventName(rule.rule_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {template?.template_name || 'Sablon nem található'}
                          </span>
                          {template && (
                            <div className="text-xs text-gray-500">
                              {template.subject_template}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatDelayTime(rule.delay_minutes)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                            {rule.is_active ? 'Aktív' : 'Inaktív'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => openEditRule(rule)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant={rule.is_active ? "secondary" : "default"} 
                              size="sm" 
                              onClick={() => toggleRuleActive(rule)}
                            >
                              {rule.is_active ? 'Kikapcsolás' : 'Bekapcsolás'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removeAutomationRule(rule.id)}>
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Rule Editor */}
      {showRuleEditor && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{editingRule ? 'Automatizálási szabály szerkesztése' : 'Új automatizálási szabály'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-1 block">Szabály neve</Label>
                  <Input 
                    value={ruleForm.rule_name || ''} 
                    onChange={e => onRuleFormChange('rule_name', e.target.value)} 
                    placeholder="pl. Quiz eredmény email - 5 perc késés"
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Esemény típusa</Label>
                  <Select value={ruleForm.rule_type || ''} onValueChange={(v: TriggerEvent) => onRuleFormChange('rule_type', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz_complete">Quiz befejezése</SelectItem>
                      <SelectItem value="purchase">Vásárlás megerősítése</SelectItem>
                      <SelectItem value="no_purchase_reminder">Emlékeztető (nem vásárolt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Email sablon</Label>
                  <Select value={ruleForm.email_template_id || ''} onValueChange={(v) => onRuleFormChange('email_template_id', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.filter(t => t.is_active).map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.template_name} ({t.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Késleltetés (percekben) - Itt állíthatod be az időzítőt!</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={ruleForm.delay_minutes || 0} 
                    onChange={e => onRuleFormChange('delay_minutes', parseInt(e.target.value) || 0)} 
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Jelenlegi beállítás: {formatDelayTime(ruleForm.delay_minutes || 0)}
                    <br />
                    Példák: 5 perc = 5, 1 óra = 60, 1 nap = 1440
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={ruleForm.is_active !== false} 
                    onCheckedChange={(v) => onRuleFormChange('is_active', v)} 
                  />
                  <span className="text-sm">Aktív szabály</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAutomationRule}>
                    {editingRule ? 'Mentés' : 'Létrehozás'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowRuleEditor(false); setEditingRule(null) }}>
                    Mégse
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">📋 Időzítő útmutató</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• <strong>Quiz befejezése:</strong> email küldése a quiz eredmény után</div>
                  <div>• <strong>Vásárlás megerősítése:</strong> email küldése sikeres vásárlás után</div>
                  <div>• <strong>Emlékeztető:</strong> emlékeztető email küldése</div>
                  <div className="mt-2 pt-2 border-t">
                    <strong>⏰ Időzítő beállítások:</strong>
                  </div>
                  <div>• 5 perc = azonnal</div>
                  <div>• 60 perc = 1 óra késés</div>
                  <div>• 1440 perc = 1 nap késés</div>
                  <div>• 10080 perc = 1 hét késés</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline Editor */}
      {showEditor && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" /> {editing ? 'Sablon szerkesztése' : 'Új sablon'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {editing?.id && (
                  <Button variant="outline" onClick={() => setShowTest(v => !v)} title="Teszt küldés">
                    <Send className="h-4 w-4 mr-2" /> Teszt
                  </Button>
                )}
                <Button variant="ghost" onClick={() => { setShowEditor(false); setEditing(null) }} title="Bezárás">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showTest && (
              <div className="mb-4 p-3 border rounded-md bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                  <div className="flex-1 w-full">
                    <Label className="mb-1 block">Címzett email</Label>
                    <Input type="email" placeholder="pelda@domain.hu" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
                  </div>
                  <Button onClick={sendTest} disabled={sendingTest || !testEmail}>
                    <Send className="h-4 w-4 mr-2" /> Küldés
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="mb-1 block">Típus</Label>
                    <Select value={(form.template_type as any) || 'custom'} onValueChange={(v) => onFormChange('template_type', v as TemplateType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="result">Eredmény</SelectItem>
                        <SelectItem value="purchase">Vásárlás</SelectItem>
                        <SelectItem value="reminder">Emlékeztető</SelectItem>
                        <SelectItem value="custom">Egyedi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Nyelv</Label>
                    <Select value={form.lang || 'hu'} onValueChange={(v) => onFormChange('lang', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {languages.map(l => (
                          <SelectItem key={l} value={l}>{l.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Hatókör</Label>
                    <Select value={form.product_id ? String(form.product_id) : 'quiz'} onValueChange={(v) => onFormChange('product_id', v === 'quiz' ? null : v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz szint</SelectItem>
                        {productOptions.map(p => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block">Sablon neve</Label>
                  <Input value={form.template_name || ''} onChange={e => onFormChange('template_name', e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">Tárgy</Label>
                  <Input value={form.subject_template || ''} onChange={e => onFormChange('subject_template', e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">Tartalom (Markdown)</Label>
                  <Textarea rows={14} value={form.body_markdown || ''} onChange={e => onFormChange('body_markdown', e.target.value)} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="mb-1 block">Változók (JSON)</Label>
                    {jsonError && <span className="text-xs text-red-600">{jsonError}</span>}
                  </div>
                  <Textarea rows={8} defaultValue={JSON.stringify(form.variables || {}, null, 2)} onChange={e => updateVariablesJson(e.target.value)} />
                  <div className="mt-2 text-xs text-gray-500">
                    Tipp: használható változók: {Object.keys({ ...defaultVariables, ...(form.variables || {}) }).sort().map(k => (
                      <code key={k} className="px-1">{`{{${k}}}`}</code>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_active !== false} onCheckedChange={(v) => onFormChange('is_active', v)} />
                  <span className="text-sm">Aktív</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveTemplate}>{editing ? 'Mentés' : 'Létrehozás'}</Button>
                  <Button variant="outline" onClick={() => { setShowEditor(false); setEditing(null) }}>Mégse</Button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2"><Eye className="h-4 w-4" /> Előnézet</h4>
                  <span className="text-xs text-gray-500">Sanitizált HTML</span>
                </div>
                <div className="border rounded-md p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
