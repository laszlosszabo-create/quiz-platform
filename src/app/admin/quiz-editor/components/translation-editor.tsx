'use client'

import { useState } from 'react'

interface QuizData {
  id: string
  slug: string
  status: 'draft' | 'active' | 'archived'
  default_lang: string
  feature_flags: any
  theme: any
  translations: Record<string, Record<string, string>>
  title: string
  description: string
}

interface TranslationEditorProps {
  quizData: QuizData
  onDataChange: (data: Partial<QuizData>) => void
}

export default function TranslationEditor({ quizData, onDataChange }: TranslationEditorProps) {
  const [currentLang, setCurrentLang] = useState<'hu' | 'en'>('hu')
  const [localTranslations, setLocalTranslations] = useState(quizData.translations || {})

  const updateTranslation = (lang: string, key: string, value: string) => {
    const updated = {
      ...localTranslations,
      [lang]: {
        ...localTranslations[lang],
        [key]: value
      }
    }
    setLocalTranslations(updated)
    onDataChange({ translations: updated })
  }

  const copyFromDefaultLang = (key: string) => {
    const defaultValue = localTranslations[quizData.default_lang]?.[key] || ''
    if (defaultValue && currentLang !== quizData.default_lang) {
      updateTranslation(currentLang, key, defaultValue)
    }
  }

  const hasTranslation = (lang: string, key: string) => {
    return !!(localTranslations[lang]?.[key]?.trim())
  }

  const isMissingTranslation = (key: string) => {
    return !hasTranslation(currentLang, key)
  }

  const translationFields = [
    // Landing page fields
    { key: 'landing_headline', label: 'Landing headline', category: 'Landing Page' },
    { key: 'landing_sub', label: 'Landing alcím', category: 'Landing Page' },
    { key: 'landing_description', label: 'Landing leírás', category: 'Landing Page' },
    { key: 'landing_cta_text', label: 'Landing CTA szöveg', category: 'Landing Page' },
    { key: 'meta_title', label: 'Meta title (SEO)', category: 'Landing Page' },
    { key: 'meta_description', label: 'Meta description (SEO)', category: 'Landing Page' },
    
    // Social proof
    { key: 'social_proof_1', label: 'Social proof 1', category: 'Social Proof' },
    { key: 'social_proof_2', label: 'Social proof 2', category: 'Social Proof' },
    { key: 'social_proof_3', label: 'Social proof 3', category: 'Social Proof' },
    
    // Email gate
    { key: 'email_gate_headline', label: 'Email gate headline', category: 'Email Gate' },
    { key: 'email_gate_description', label: 'Email gate leírás', category: 'Email Gate' },
    { key: 'email_field_placeholder', label: 'Email mező placeholder', category: 'Email Gate' },
    { key: 'name_field_placeholder', label: 'Név mező placeholder', category: 'Email Gate' },
    { key: 'email_gate_submit_button', label: 'Submit gomb szöveg', category: 'Email Gate' },
    { key: 'email_gate_privacy_text', label: 'Adatvédelmi szöveg', category: 'Email Gate' },
    
    // Result page
    { key: 'result_headline', label: 'Eredmény headline', category: 'Result Page' },
    { key: 'result_sub', label: 'Eredmény alcím', category: 'Result Page' },
    { key: 'result_ai_loading', label: 'AI loading szöveg', category: 'Result Page' },
    { key: 'result_booking_headline', label: 'Foglalás headline', category: 'Result Page' },
    { key: 'result_booking_cta', label: 'Foglalás gomb', category: 'Result Page' },
    { key: 'result_product_headline', label: 'Termék headline', category: 'Result Page' },
    { key: 'result_product_cta', label: 'Termék gomb', category: 'Result Page' },
    
    // Static results
    { key: 'result_static_low_title', label: 'Alacsony kockázat cím', category: 'Static Results' },
    { key: 'result_static_low_description', label: 'Alacsony kockázat leírás', category: 'Static Results' },
    { key: 'result_static_low_recommendations', label: 'Alacsony kockázat javaslatok', category: 'Static Results' },
    { key: 'result_static_medium_title', label: 'Közepes kockázat cím', category: 'Static Results' },
    { key: 'result_static_medium_description', label: 'Közepes kockázat leírás', category: 'Static Results' },
    { key: 'result_static_medium_recommendations', label: 'Közepes kockázat javaslatok', category: 'Static Results' },
    { key: 'result_static_high_title', label: 'Magas kockázat cím', category: 'Static Results' },
    { key: 'result_static_high_description', label: 'Magas kockázat leírás', category: 'Static Results' },
    { key: 'result_static_high_recommendations', label: 'Magas kockázat javaslatok', category: 'Static Results' },
    
    // Email templates
    { key: 'email:welcome_subject', label: 'Üdvözlő email tárgy', category: 'Email Templates' },
    { key: 'email:welcome_body', label: 'Üdvözlő email tartalom', category: 'Email Templates' },
  ]

  const categorizedFields = translationFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, typeof translationFields>)

  const TranslationField = ({ fieldKey, label, multiline = false }: { fieldKey: string; label: string; multiline?: boolean }) => {
    const currentValue = localTranslations[currentLang]?.[fieldKey] || ''
    const hasDefault = hasTranslation(quizData.default_lang, fieldKey)
    const isMissing = isMissingTranslation(fieldKey)

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isMissing && <span className="ml-2 text-orange-500">⚠️</span>}
          </label>
          {hasDefault && currentLang !== quizData.default_lang && (
            <button
              onClick={() => copyFromDefaultLang(fieldKey)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              📋 Másolás alapnyelvből
            </button>
          )}
        </div>
        {multiline ? (
          <textarea
            value={currentValue}
            onChange={(e) => updateTranslation(currentLang, fieldKey, e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isMissing ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
            }`}
            placeholder={`${label} ${currentLang.toUpperCase()} nyelven...`}
          />
        ) : (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => updateTranslation(currentLang, fieldKey, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isMissing ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
            }`}
            placeholder={`${label} ${currentLang.toUpperCase()} nyelven...`}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🌐 Fordítások szerkesztő</h2>
        
        {/* Language switcher */}
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

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">
              {Object.keys(localTranslations.hu || {}).length}
            </div>
            <div className="text-sm text-blue-700">Magyar fordítások</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">
              {Object.keys(localTranslations.en || {}).length}
            </div>
            <div className="text-sm text-blue-700">Angol fordítások</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-900">
              {translationFields.filter(f => isMissingTranslation(f.key)).length}
            </div>
            <div className="text-sm text-orange-700">Hiányzó ({currentLang.toUpperCase()})</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-900">
              {Math.round((translationFields.filter(f => !isMissingTranslation(f.key)).length / translationFields.length) * 100)}%
            </div>
            <div className="text-sm text-green-700">Kész ({currentLang.toUpperCase()})</div>
          </div>
        </div>
      </div>

      {/* Translation sections */}
      {Object.entries(categorizedFields).map(([category, fields]) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          </div>
          <div className="p-6 space-y-4">
            {fields.map((field) => (
              <TranslationField
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                multiline={field.key.includes('description') || field.key.includes('body') || field.key.includes('recommendations')}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Help */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Tippek</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• A ⚠️ ikon hiányzó fordításokat jelöl</li>
          <li>• A &quot;📋 Másolás alapnyelvből&quot; gombbal gyorsan átveheted az alap szöveget</li>
          <li>• Email változók: használd a {`{{variable_name}}`} formátumot</li>
          <li>• A módosítások azonnal mentődnek és megjelennek a publikus oldalakon</li>
        </ul>
      </div>
    </div>
  )
}
