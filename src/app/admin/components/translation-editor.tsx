'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../lib/supabase'

interface TranslationEditorProps {
  quizId: string
}

interface Translation {
  id: string
  quiz_id: string
  lang: string
  field_key: string
  value: string | null
}

interface TranslationGroup {
  [fieldKey: string]: {
    [lang: string]: string | null
  }
}

export default function TranslationEditor({ quizId }: TranslationEditorProps) {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [groupedTranslations, setGroupedTranslations] = useState<TranslationGroup>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentLang, setCurrentLang] = useState<'hu' | 'en'>('hu')
  const [error, setError] = useState<string | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Use useMemo to prevent client recreation on every render
  const supabase = useMemo(() => createClient(), [])

  // Fordítható mezők csoportosítása
  const fieldGroups = {
    'Landing Page': [
      'landing_headline',
      'landing_sub', 
      'cta_text',
      'meta_title',
      'meta_description'
    ],
    'Quiz Kérdések': [
      'question:attention_span:text',
      'question:attention_span:help',
      'question:hyperactivity:text',
      'question:hyperactivity:help',
      'question:impulsivity:text',
      'question:impulsivity:help',
      'question:organization:text',
      'question:organization:help',
      'question:time_management:text',
      'question:time_management:help',
      'question:emotional_regulation:text',
      'question:emotional_regulation:help',
      'question:social_situations:text',
      'question:social_situations:help',
      'question:daily_functioning:text',
      'question:daily_functioning:help'
    ],
    'Válaszok': [
      'option:scale_1:label',
      'option:scale_2:label',
      'option:scale_3:label',
      'option:scale_4:label',
      'option:scale_5:label',
      'option:hyper_low:label',
      'option:hyper_mild:label',
      'option:hyper_moderate:label',
      'option:hyper_high:label',
      'option:impulse_planned:label',
      'option:impulse_balanced:label',
      'option:impulse_quick:label',
      'option:impulse_hasty:label',
      'option:time_excellent:label',
      'option:time_good:label',
      'option:time_struggling:label',
      'option:time_chaotic:label'
    ],
    'Eredmény oldal': [
      'result_headline',
      'result_share_text',
      'result_cta_product',
      'result_cta_booking',
      'result_disclaimer',
      'result_static_low_title',
      'result_static_low_description',
      'result_static_moderate_title',
      'result_static_moderate_description',
      'result_static_high_title',
      'result_static_high_description'
    ],
    'E-mail sablonok': [
      'email:welcome_subject',
      'email:welcome_body',
      'email:tips_2d_subject',
      'email:tips_2d_body',
      'email:upsell_5d_subject',
      'email:upsell_5d_body'
    ]
  }

  // Fordítások betöltése
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: translationsError } = await supabase
          .from('quiz_translations')
          .select('*')
          .eq('quiz_id', quizId)
          .order('field_key')

        if (translationsError) throw translationsError

        setTranslations(data || [])
        
        // Csoportosítás field_key és lang szerint
        const grouped: TranslationGroup = {}
        data?.forEach(translation => {
          if (!grouped[translation.field_key]) {
            grouped[translation.field_key] = {}
          }
          grouped[translation.field_key][translation.lang] = translation.value
        })
        setGroupedTranslations(grouped)

      } catch (err) {
        console.error('Fordítások betöltési hibája:', err)
        setError('Fordítások betöltése sikertelen')
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [quizId, supabase])

  const updateTranslation = (fieldKey: string, lang: string, value: string) => {
    setUnsavedChanges(true)
    
    setGroupedTranslations(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [lang]: value
      }
    }))
  }

  const getTranslationValue = (fieldKey: string, lang: string): string => {
    return groupedTranslations[fieldKey]?.[lang] || ''
  }

  const hasTranslation = (fieldKey: string, lang: string): boolean => {
    const value = groupedTranslations[fieldKey]?.[lang]
    return !!(value?.trim())
  }

  const copyFromDefaultLang = (fieldKey: string, targetLang: string) => {
    const defaultLang = targetLang === 'hu' ? 'en' : 'hu'
    const defaultValue = getTranslationValue(fieldKey, defaultLang)
    
    if (defaultValue) {
      updateTranslation(fieldKey, targetLang, defaultValue)
    }
  }

  const saveChanges = async () => {
    if (!unsavedChanges) return

    try {
      setSaving(true)

      // Minden módosított fordítás mentése
      for (const [fieldKey, langs] of Object.entries(groupedTranslations)) {
        for (const [lang, value] of Object.entries(langs)) {
          if (value !== null) {
            // Ellenőrizzük, hogy létezik-e már
            const existing = translations.find(t => 
              t.field_key === fieldKey && t.lang === lang
            )

            if (existing) {
              // Frissítés
              if (existing.value !== value) {
                const { error } = await supabase
                  .from('quiz_translations')
                  .update({ 
                    value,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existing.id)

                if (error) throw error
              }
            } else {
              // Új bejegyzés
              const { error } = await supabase
                .from('quiz_translations')
                .insert({
                  quiz_id: quizId,
                  lang,
                  field_key: fieldKey,
                  value
                })

              if (error) throw error
            }
          }
        }
      }

      setUnsavedChanges(false)
      setError(null)

      // Fordítások újratöltése
      const { data } = await supabase
        .from('quiz_translations')
        .select('*')
        .eq('quiz_id', quizId)
        .order('field_key')

      if (data) {
        setTranslations(data)
      }

      // Audit log mentés a sikeres változtatások után (best-effort)
      try {
        const { data: authUser } = await supabase.auth.getUser()
        const user = authUser?.user
        if (user?.id && user?.email) {
          await fetch('/api/admin/audit-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              user_email: user.email,
              action: 'TRANSLATIONS_BULK_SAVE',
              resource_type: 'quiz',
              resource_id: quizId,
              details: { fields: Object.keys(groupedTranslations).length, lang: currentLang }
            })
          })
        }
      } catch (e) {
        console.warn('Audit log skip (no user/session or network issue):', (e as any)?.message || e)
      }

    } catch (err) {
      console.error('Mentési hiba:', err)
      setError('Mentés sikertelen')
    } finally {
      setSaving(false)
    }
  }

  // Automatikus mentés
  useEffect(() => {
    if (unsavedChanges) {
      const timer = setTimeout(() => {
        saveChanges()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [unsavedChanges, groupedTranslations])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hiba</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const TranslationField = ({
    fieldKey,
    label,
    multiline = false,
    placeholder = ''
  }: {
    fieldKey: string
    label: string
    multiline?: boolean
    placeholder?: string
  }) => {
    const value = getTranslationValue(fieldKey, currentLang)
    const hasHu = hasTranslation(fieldKey, 'hu')
    const hasEn = hasTranslation(fieldKey, 'en')
    const isMissing = !hasTranslation(fieldKey, currentLang)
    const otherLang = currentLang === 'hu' ? 'en' : 'hu'
    const hasOtherLang = hasTranslation(fieldKey, otherLang)

    const InputComponent = multiline ? 'textarea' : 'input'

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isMissing && (
              <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                ⚠️ Hiányzó fordítás
              </span>
            )}
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs">
                <span className={`w-2 h-2 rounded-full ${hasHu ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>HU</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={`w-2 h-2 rounded-full ${hasEn ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>EN</span>
              </div>
            </div>
            {isMissing && hasOtherLang && (
              <button
                onClick={() => copyFromDefaultLang(fieldKey, currentLang)}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                title={`Másolás ${otherLang.toUpperCase()} nyelvből`}
              >
                📋 Másolás {otherLang.toUpperCase()}-ból
              </button>
            )}
          </div>
        </div>
        <InputComponent
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isMissing ? 'border-red-300 bg-red-50' : ''
          } ${multiline ? 'min-h-[100px] resize-vertical' : ''}`}
          value={value}
          onChange={(e) => updateTranslation(fieldKey, currentLang, e.target.value)}
          placeholder={placeholder}
          {...(multiline ? { rows: 4 } : { type: 'text' })}
        />
        {hasOtherLang && (
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            <strong>{otherLang.toUpperCase()}:</strong> {getTranslationValue(fieldKey, otherLang)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Fejléc nyelv választóval és mentési státusszal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentLang('hu')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentLang === 'hu'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🇭🇺 Magyar
            </button>
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentLang === 'en'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🇬🇧 Angol
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {saving && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Mentés...
            </div>
          )}
          {unsavedChanges && !saving && (
            <div className="flex items-center text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Nem mentett változások
            </div>
          )}
          {!unsavedChanges && !saving && (
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mentve
            </div>
          )}
          <button
            onClick={saveChanges}
            disabled={!unsavedChanges || saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Változások mentése
          </button>
        </div>
      </div>

      {/* Fordítási csoportok */}
      {Object.entries(fieldGroups).map(([groupName, fieldKeys]) => (
        <div key={groupName} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{groupName}</h3>
            <div className="mt-1 text-sm text-gray-500">
              {fieldKeys.filter(key => hasTranslation(key, currentLang)).length}/{fieldKeys.length} mező fordítva
            </div>
          </div>
          <div className="p-6 space-y-4">
            {fieldKeys.map(fieldKey => {
              // Field címke generálása
              let label = fieldKey
              if (fieldKey.includes(':')) {
                const parts = fieldKey.split(':')
                if (parts[0] === 'question') {
                  label = `${parts[1]} - ${parts[2] === 'text' ? 'Kérdés' : 'Segítség'}`
                } else if (parts[0] === 'option') {
                  label = `${parts[1]} - Opció`
                } else if (parts[0] === 'email') {
                  label = `${parts[1]} - ${parts[2] === 'subject' ? 'Tárgy' : 'Tartalom'}`
                }
              } else {
                // Egyszerű field-ek
                const labelMap: Record<string, string> = {
                  'landing_headline': 'Főcím',
                  'landing_sub': 'Alcím',
                  'cta_text': 'CTA gomb szöveg',
                  'meta_title': 'Meta cím',
                  'meta_description': 'Meta leírás',
                  'result_headline': 'Eredmény főcím',
                  'result_share_text': 'Megosztás szöveg',
                  'result_cta_product': 'Termék CTA',
                  'result_cta_booking': 'Foglalás CTA',
                  'result_disclaimer': 'Jogi figyelmeztetés'
                }
                label = labelMap[fieldKey] || fieldKey
              }

              return (
                <TranslationField
                  key={fieldKey}
                  fieldKey={fieldKey}
                  label={label}
                  multiline={fieldKey.includes('description') || fieldKey.includes('body') || fieldKey.includes('help')}
                  placeholder={`${label} megadása...`}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
