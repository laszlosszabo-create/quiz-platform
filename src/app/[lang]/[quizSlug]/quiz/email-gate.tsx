'use client'

import { useState } from 'react'
import { Quiz, QuizTranslation } from '@/types/database'
import { getTranslations } from '@/lib/translations'

interface EmailGateProps {
  quiz: Quiz
  allTranslations: QuizTranslation[]
  lang: string
  onEmailSubmitted: (leadId: string) => void
}

export function EmailGate({
  quiz,
  allTranslations,
  lang,
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
      const response = await fetch('/api/quiz/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          email: email.trim(),
          name: name.trim(),
          lang,
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {translations.email_gate_headline || 'Get Your Results'}
          </h2>
          
          <p className="text-lg text-gray-600">
            {translations.email_gate_description || 'Enter your details to receive your personalized quiz results.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translations.name_field_placeholder || 'Your name'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations.email_field_placeholder || 'your@email.com'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting 
              ? 'Submitting...' 
              : translations.email_gate_submit_button || 'Get My Results'
            }
          </button>

          {/* Privacy text */}
          {translations.email_gate_privacy_text && (
            <p className="text-xs text-gray-500 text-center">
              {translations.email_gate_privacy_text}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
