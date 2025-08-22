'use client'

import React, { useState, useEffect } from 'react'
import { Quiz, QuizQuestion, QuizTranslation } from '@/types/database'
import { getTranslations, getQuestionTranslations, getOptionTranslations } from '@/lib/translations'
import { tracker } from '@/lib/tracking'
import { generateClientToken } from '@/lib/session'
import { QuestionComponent } from './question-component'
import { EmailGate } from './email-gate'

interface QuizClientProps {
  lang: string
}

interface Answer {
  questionKey: string
  value: string | string[]
}

export default function QuizPage({ lang }: QuizClientProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [allTranslations, setAllTranslations] = useState<QuizTranslation[]>([])
  const [featureFlags, setFeatureFlags] = useState<Record<string, any>>({})
  const [theme, setTheme] = useState<Record<string, any>>({})

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/public/quizzes/adhd-quick-check?lang=${lang}`)
      if (!res.ok) return
      const json = await res.json()
      setQuiz(json.quiz)
      setQuestions(json.questions)
      setAllTranslations(json.allTranslations)
      setFeatureFlags(json.featureFlags || {})
      setTheme(json.theme || {})
    }
    load()
  }, [lang])

  if (!quiz) return <div>Betöltés...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden" style={{height: '100vh'}}>
          <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
            <QuestionComponent
              question={questions[0]}
              questionTranslations={getQuestionTranslations(allTranslations, lang, questions[0].key, quiz.default_lang)}
              optionTranslations={getOptionTranslations(allTranslations, lang, (questions[0].options||[]).map((o:any)=>o.key), quiz.default_lang)}
              onAnswer={() => {}}
              currentAnswer={undefined}
              questionNumber={1}
              totalQuestions={questions.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
