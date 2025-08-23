'use client'

import { useState } from 'react'
import { Quiz, QuizTranslation } from '@/types/database'
import { getTranslations } from '@/lib/translations'
import { apiFetch } from '@/lib/api-utils'

interface EmailGateProps {
  quiz: Quiz
  allTranslations: QuizTranslation[]
  lang: string
  sessionId: string
  onEmailSubmitted: (leadId: string) => void
}

export function EmailGate({
  quiz,
  allTranslations,
  lang,
  sessionId,
  onEmailSubmitted
}: EmailGateProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Get email gate translations
  const translations = getTranslations(
    allTranslations,
    lang,
    [
      'email_gate_headline',
      'email_gate_description',
      'email_field_placeholder',
      'name_field_placeholder',
      'email_gate_submit_button',
      'email_gate_privacy_text'
    ],
    quiz.default_lang
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
    const response = await apiFetch('/api/quiz/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizSlug: quiz.slug,
          email: email.trim(),
      name: name.trim(),
          lang,
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit email')
      }

      const { lead_id } = await response.json()
      onEmailSubmitted(lead_id)
    } catch (err) {
      setError('Failed to submit. Please try again.')
      console.error('Email submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-2">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-white/60 backdrop-blur-sm overflow-hidden">
          {/* Mobile-optimized Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              {translations.email_gate_headline || 'Kapd meg az eredményeidet!'}
            </h2>
            <p className="text-blue-100 text-sm">
              {translations.email_gate_description || 'Add meg az adataidat hogy elküldhessük a személyre szabott elemzést.'}
            </p>
          </div>

          {/* Mobile-optimized Form */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Név
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={translations.name_field_placeholder || 'A neved'}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email cím
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.email_field_placeholder || 'pelda@email.com'}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-xl">
                  <div className="flex">
                    <svg className="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Küldés...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">{translations.email_gate_submit_button || 'Eredmények megjelenítése'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Mobile-optimized Privacy and trust indicators */}
              <div className="space-y-3">
                {translations.email_gate_privacy_text && (
                  <p className="text-xs text-gray-600 text-center bg-gray-50 p-3 rounded-xl">
                    <svg className="w-3 h-3 text-green-500 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {translations.email_gate_privacy_text}
                  </p>
                )}
                
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Spam-mentes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Biztonságos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Azonnali</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
