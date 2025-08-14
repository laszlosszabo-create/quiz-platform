'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../lib/supabase'

interface TranslationEditorProps {
  quizId: string
}

export default function SimpleTranslationEditor({ quizId }: TranslationEditorProps) {
  const [loading, setLoading] = useState(true)
  const [currentLang, setCurrentLang] = useState<'hu' | 'en'>('hu')
  const [translations, setTranslations] = useState<{ [key: string]: string }>({})
  
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
    } catch (error) {
      console.error('Error loading translations:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTranslation = async (fieldKey: string, value: string) => {
    try {
      const { error } = await supabase
        .from('quiz_translations')
        .upsert({
          quiz_id: quizId,
          lang: currentLang,
          field_key: fieldKey,
          value: value
        }, {
          onConflict: 'quiz_id,lang,field_key'
        })

      if (error) throw error

      setTranslations(prev => ({
        ...prev,
        [fieldKey]: value
      }))
    } catch (error) {
      console.error('Error updating translation:', error)
    }
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
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentLang('hu')}
          className={`px-4 py-2 rounded-md ${
            currentLang === 'hu'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Magyar (HU)
        </button>
        <button
          onClick={() => setCurrentLang('en')}
          className={`px-4 py-2 rounded-md ${
            currentLang === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          English (EN)
        </button>
      </div>

      {/* Sample Translation Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landing Page Headline
          </label>
          <input
            type="text"
            value={translations['landing_headline'] || ''}
            onChange={(e) => updateTranslation('landing_headline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter headline..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Button Text
          </label>
          <input
            type="text"
            value={translations['cta_text'] || ''}
            onChange={(e) => updateTranslation('cta_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter button text..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={translations['meta_title'] || ''}
            onChange={(e) => updateTranslation('meta_title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meta title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={translations['meta_description'] || ''}
            onChange={(e) => updateTranslation('meta_description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meta description..."
          />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Current Language: {currentLang.toUpperCase()} | Quiz ID: {quizId}
      </div>
    </div>
  )
}
