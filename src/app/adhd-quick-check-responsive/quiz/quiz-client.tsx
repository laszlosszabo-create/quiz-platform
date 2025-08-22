 'use client'

import React, { useEffect, useState } from 'react'
import { QuestionComponent } from './question-component'

export default function ResponsiveQuiz() {
  const [quiz, setQuiz] = useState<any | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [translations, setTranslations] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // Use the JSON API endpoint instead of a page route to avoid HTML responses
        const res = await fetch('/api/public/quizzes/adhd-quick-check?lang=hu')
        if (!res.ok) {
          console.error('Failed to load quiz data:', res.status, res.statusText)
          return
        }

        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('application/json')) {
          // Log the returned HTML (or other) to help debugging instead of throwing on json()
          const text = await res.text()
          console.error('Expected JSON but got:', text.slice(0, 200))
          return
        }

        const json = await res.json()
        if (!mounted) return
        setQuiz(json.quiz)
        setQuestions(json.questions || [])
        setTranslations(json.allTranslations || [])
      } catch (e) {
        console.error('Failed to load quiz data', e)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (!quiz) return <div className="min-h-screen flex items-center justify-center">Betöltés...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="px-3 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 12h6m-6 4h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">ADHD Gyorsteszt</h1>
              <p className="text-xs text-gray-600">Tudományosan megalapozott értékelés</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <div>1 / {questions.length}</div>
            <div className="text-xs text-gray-600">7% befejezve</div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-6 px-3">
        <div className="w-full max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden flex-1 flex flex-col">
            <div className="p-4 md:p-6 flex-1 overflow-auto">
              <QuestionComponent
                // pass a single question for demo; component will render responsively
                question={questions[0]}
                questionTranslations={{ text: '', help: '' }}
                optionTranslations={{}}
                onAnswer={() => {}}
                currentAnswer={undefined}
                questionNumber={1}
                totalQuestions={questions.length}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
