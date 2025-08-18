// This component is a client component
'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
 

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
  onDirtyChange?: (dirty: boolean) => void
}

export type TranslationEditorHandle = {
  getLocalTranslations: () => Record<string, Record<string, string>>
}

const TranslationEditor = forwardRef<TranslationEditorHandle, TranslationEditorProps>(
  ({ quizData, onDataChange, onDirtyChange }, ref) => {
  const [localTranslations, setLocalTranslations] = useState(quizData.translations || {})
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Expose translations to parent
  useImperativeHandle(ref, () => ({
    getLocalTranslations: () => localTranslations
  }))

  // Listen for updates from the native editor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'translationsSaved') {
        const updatedTranslations = event.data.translations
        setLocalTranslations(updatedTranslations)
        onDataChange({ translations: updatedTranslations })
        onDirtyChange?.(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
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

  // Sync local state when parent updates quizData.translations (e.g., after save/reload)
  useEffect(() => {
    // Avoid clobbering user typing on first mount we just set once
    if (!initialized.current) {
      initialized.current = true
      setLocalTranslations(quizData.translations || {})
      return
    }
    if (quizData.translations && localTranslations !== quizData.translations) {
      setLocalTranslations(quizData.translations)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizData.translations])

  // Expose imperative getter so parent can read the latest before saving
  useImperativeHandle(ref, () => ({
    getLocalTranslations: () => localTranslations
  }), [localTranslations])

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
      {/* Embed native translation editor in iframe */}
      <iframe
        src={`/admin/quiz-editor/translations-native.html?id=${quizData.id}`}
        className="w-full border-0 rounded-lg"
        style={{ height: '800px', minHeight: '600px' }}
        title="Translation Editor"
        ref={(iframe) => {
          if (iframe) {
            // Listen for save events from iframe
            const handleMessage = (event: MessageEvent) => {
              if (event.source === iframe.contentWindow && event.data.type === 'translationsSaved') {
                // Update parent with new translations
                onDataChange({ translations: event.data.translations });
                onDirtyChange?.(false);
              }
            };
            window.addEventListener('message', handleMessage);
            // Store cleanup function
            (iframe as any).__cleanup = () => window.removeEventListener('message', handleMessage);
          }
        }}
        onLoad={(e) => {
          const iframe = e.target as HTMLIFrameElement;
          if (iframe.contentWindow) {
            // Pass quiz ID to iframe
            iframe.contentWindow.postMessage({ type: 'setQuizId', quizId: quizData.id }, '*');
          }
        }}
      />
    </div>
  )
})

export default TranslationEditor
