'use client'

import { useState } from 'react'
import { QuizQuestion } from '@/types/database'

interface QuestionComponentProps {
  question: QuizQuestion
  questionTranslations: {
    text: string
    help?: string
  }
  optionTranslations: Record<string, string>
  onAnswer: (value: string | string[]) => void
  currentAnswer?: string | string[]
  questionNumber: number
  totalQuestions: number
}

export function QuestionComponent({
  question,
  questionTranslations,
  optionTranslations,
  onAnswer,
  currentAnswer,
  questionNumber,
  totalQuestions
}: QuestionComponentProps) {
  const [selectedValue, setSelectedValue] = useState<string | string[]>(currentAnswer || [])

  const options = (question.options as any[]) || []

  const handleScaleSelect = (value: string) => {
    setSelectedValue(value)
    onAnswer(value)
  }

  const scaleMax = options.length > 0 ? options.length : 5

  // Responsive compact layout: reduce paddings and ensure whole card fits viewport
  return (
    <div className="h-full flex flex-col">
      <header className="px-2 py-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">{questionNumber} / {totalQuestions}</div>
          <div className="text-xs text-gray-500">{question.type === 'scale' ? 'Értékeld 1-5 skálán' : ''}</div>
        </div>
        <h2 className="text-lg font-semibold mt-2">{questionTranslations.text || question.key}</h2>
      </header>

      { (questionTranslations.help || (question as any).help_text) && (
        <div className="px-2 mt-2">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded text-sm">{questionTranslations.help || (question as any).help_text}</div>
        </div>
      )}

      <div className="flex-1 overflow-auto px-2 py-3">
        {question.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Egyáltalán nem</span>
              <span className="text-gray-700">Teljesen egyetértek</span>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full transform -translate-y-1/2"></div>

              <div className="flex justify-between items-center relative z-10">
                {Array.from({ length: scaleMax }, (_, index) => {
                  const value = (index + 1).toString()
                  const isSelected = selectedValue === value
                  return (
                    <button
                      key={value}
                      onClick={() => handleScaleSelect(value)}
                      className={`relative w-9 h-9 rounded-lg font-semibold text-base transition-all duration-200 transform ${isSelected ? 'bg-blue-500 text-white scale-105' : 'bg-white text-gray-700 border'} `}
                    >
                      <span>{value}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-1 text-xs text-gray-600 mt-2" style={{display: 'grid', gridTemplateColumns: `repeat(${scaleMax}, minmax(0,1fr))`}}>
              {Array.from({ length: scaleMax }, (_, i) => {
                const opt = options[i]
                const key = opt?.key
                const label = key ? (optionTranslations[key] || (`${i + 1}`)) : (`${i + 1}`)
                return (
                  <span key={i} className="truncate px-1 text-center text-[12px]">{label}</span>
                )
              })}
            </div>
          </div>
        )}

        {question.type !== 'scale' && (
          <div className="space-y-3">
            {options.map((option, index) => (
              <button key={option.key} className="w-full text-left p-3 border rounded" onClick={() => onAnswer(option.key)}>
                <div className="font-medium">{optionTranslations[option.key] || option.key}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="p-2">
        <div className="text-center text-xs text-gray-500">Típus: {question.type} | Aktív: {(question as any).active ? 'Igen' : 'Nem'}</div>
      </footer>
    </div>
  )
}
