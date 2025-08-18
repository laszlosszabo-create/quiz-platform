'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createClient } from '../../../lib/supabase'

interface TranslationEditorProps {
  quizId: string
}

export default function SimpleTranslationEditor({ quizId }: TranslationEditorProps) {
  const [loading, setLoading] = useState(true)
  const [currentLang, setCurrentLang] = useState<'hu' | 'en'>('hu')
  const [translations, setTranslations] = useState<{ [key: string]: string }>({})
  const [dirty, setDirty] = useState(false)
  const [changed, setChanged] = useState<Set<string>>(new Set())
  const [version, setVersion] = useState(0)
  // Uncontrolled input refs per field
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({})
  const FIELD_KEYS = ['landing_headline', 'cta_text', 'meta_title', 'meta_description'] as const
  
  // Use useMemo to prevent client recreation on every render
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    loadTranslations()
  }, [quizId, currentLang])

  const loadTranslations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quiz_translations')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('lang', currentLang)

      if (error) throw error

      const translationMap: { [key: string]: string } = {}
      data?.forEach(item => {
        if (item.value) {
          translationMap[item.field_key] = item.value
        }
      })
      
      setTranslations(translationMap)
      setDirty(false)
      setChanged(new Set())
      // bump version so uncontrolled inputs reset to latest values
      setVersion(v => v + 1)
    } catch (error) {
      console.error('Error loading translations:', error)
    } finally {
      setLoading(false)
    }
  }

  const onBlurField = (fieldKey: string) => {
    // mark dirty only on blur to avoid rerenders on each keystroke
    setDirty(true)
    setChanged(prev => new Set(prev).add(fieldKey))
  }

  const saveChanges = useCallback(async () => {
    if (!dirty || changed.size === 0) return
    try {
      // Save all fields to be robust even if current field hasn't blurred yet
      const rows = (FIELD_KEYS as readonly string[]).map((field_key) => ({
        quiz_id: quizId,
        lang: currentLang,
        field_key,
        value: (inputRefs.current[field_key]?.value ?? translations[field_key] ?? '')
      }))
      const { error } = await supabase
        .from('quiz_translations')
        .upsert(rows, { onConflict: 'quiz_id,lang,field_key' })
      if (error) throw error
      setDirty(false)
      setChanged(new Set())
      // Reload latest values and refresh uncontrolled inputs
      await loadTranslations()
      setVersion(v => v + 1)
    } catch (error) {
      console.error('Error saving translations:', error)
    }
  }, [changed, currentLang, dirty, quizId, supabase, translations])

  const discardChanges = () => {
    // Reload from server to discard local edits
    loadTranslations()
  }

  const switchLang = async (lang: 'hu' | 'en') => {
    if (dirty && !confirm('Nem mentett módosítások vannak. Elmentsem most?')) {
      // Discard and switch
      setDirty(false)
      setChanged(new Set())
      setCurrentLang(lang)
      return
    }
    if (dirty) {
      await saveChanges()
    }
    setCurrentLang(lang)
  }

  // Shadow DOM isolated field to prevent React interference
  function Field({
    fieldKey,
    label,
    placeholder,
    type = 'text',
    rows,
    initial,
    version,
    idAttr,
    nameAttr,
  }: {
    fieldKey: string
    label: string
    placeholder?: string
    type?: 'text'
    rows?: number
    initial: string
    version: number
    idAttr: string
    nameAttr: string
  }) {
    const hostRef = useRef<HTMLDivElement | null>(null)
    const shadowRef = useRef<ShadowRoot | null>(null)
    const elementRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

    // Create Shadow DOM once to isolate from React
    useEffect(() => {
      if (!hostRef.current || shadowRef.current) return

      const shadow = hostRef.current.attachShadow({ mode: 'open' })
      shadowRef.current = shadow

      // Apply Tailwind styles within shadow DOM
      const style = document.createElement('style')
      style.textContent = `
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          outline: none;
          font-family: inherit;
        }
        .field-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
      `
      shadow.appendChild(style)

      const el = rows ? document.createElement('textarea') : document.createElement('input')
      if (!rows) (el as HTMLInputElement).type = type
      el.id = idAttr
      el.setAttribute('name', nameAttr)
      el.className = 'field-input'
      if (placeholder) el.setAttribute('placeholder', placeholder)
      if (rows) (el as HTMLTextAreaElement).rows = rows!
      el.value = initial || ''

      el.addEventListener('blur', () => onBlurField(fieldKey))
      shadow.appendChild(el)
      elementRef.current = el as any
      inputRefs.current[fieldKey] = el as any

      return () => {
        try {
          if (shadowRef.current) {
            shadowRef.current.innerHTML = ''
          }
        } catch {}
        if (inputRefs.current[fieldKey] === el) inputRefs.current[fieldKey] = null
        shadowRef.current = null
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update value on version change only
    useEffect(() => {
      const el = elementRef.current
      if (!el) return
      el.value = initial || ''
    }, [version, initial])

    return (
      <div>
        <label htmlFor={idAttr} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div ref={hostRef} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Language Switcher */}
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => switchLang('hu')}
          className={`px-4 py-2 rounded-md ${
            currentLang === 'hu'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Magyar (HU)
        </button>
        <button
          onClick={() => switchLang('en')}
          className={`px-4 py-2 rounded-md ${
            currentLang === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          English (EN)
        </button>
        <div className="flex-1" />
        {dirty ? (
          <span className="text-sm text-amber-700 bg-amber-100 px-2 py-1 rounded">Nem mentett módosítások</span>
        ) : (
          <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Mentve</span>
        )}
        <button
          onClick={saveChanges}
          disabled={!dirty}
          className="ml-2 px-3 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50"
        >
          Mentés
        </button>
        <button
          onClick={discardChanges}
          disabled={!dirty}
          className="ml-2 px-3 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Elvetés
        </button>
      </div>

      {/* Sample Translation Fields */}
      <div className="space-y-4">
        <Field
          fieldKey="landing_headline"
          label="Landing Page Headline"
          placeholder="Enter headline..."
          initial={translations['landing_headline'] ?? ''}
          version={version}
          idAttr={`landing_headline-${currentLang}`}
          nameAttr={`translations[landing_headline]`}
        />

        <Field
          fieldKey="cta_text"
          label="CTA Button Text"
          placeholder="Enter button text..."
          initial={translations['cta_text'] ?? ''}
          version={version}
          idAttr={`cta_text-${currentLang}`}
          nameAttr={`translations[cta_text]`}
        />

        <Field
          fieldKey="meta_title"
          label="Meta Title"
          placeholder="Enter meta title..."
          initial={translations['meta_title'] ?? ''}
          version={version}
          idAttr={`meta_title-${currentLang}`}
          nameAttr={`translations[meta_title]`}
        />

        <Field
          fieldKey="meta_description"
          label="Meta Description"
          placeholder="Enter meta description..."
          rows={3}
          initial={translations['meta_description'] ?? ''}
          version={version}
          idAttr={`meta_description-${currentLang}`}
          nameAttr={`translations[meta_description]`}
        />
      </div>

      <div className="text-sm text-gray-500 flex items-center gap-3">
        <span>Current Language: {currentLang.toUpperCase()}</span>
        <span>Quiz ID: {quizId}</span>
        <span>Változtatott mezők: {changed.size}</span>
      </div>
    </div>
  )
}
