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
}

export function QuestionComponent({
  question,
  questionTranslations,
  optionTranslations,
  onAnswer,
  currentAnswer
}: QuestionComponentProps) {
  const [selectedValue, setSelectedValue] = useState<string | string[]>(currentAnswer || [])

  const options = (question.options as any[]) || []

  const handleSingleSelect = (optionKey: string) => {
    setSelectedValue(optionKey)
    onAnswer(optionKey)
  }

  const handleMultiSelect = (optionKey: string) => {
    const currentSelection = Array.isArray(selectedValue) ? selectedValue : []
    const newSelection = currentSelection.includes(optionKey)
      ? currentSelection.filter(key => key !== optionKey)
      : [...currentSelection, optionKey]
    
    setSelectedValue(newSelection)
  }

  const handleScaleSelect = (value: string) => {
    setSelectedValue(value)
    onAnswer(value)
  }

  const submitMultiAnswer = () => {
    if (Array.isArray(selectedValue) && selectedValue.length > 0) {
      onAnswer(selectedValue)
    }
  }

  const renderSingleChoice = () => (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => handleSingleSelect(option.key)}
          className={`w-full p-4 text-left border rounded-lg transition-colors ${
            selectedValue === option.key
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
              selectedValue === option.key
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedValue === option.key && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
              )}
            </div>
            <span className="text-gray-900">
              {optionTranslations[option.key] || option.key}
            </span>
          </div>
        </button>
      ))}
    </div>
  )

  const renderMultiChoice = () => (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = Array.isArray(selectedValue) && selectedValue.includes(option.key)
        
        return (
          <button
            key={option.key}
            onClick={() => handleMultiSelect(option.key)}
            className={`w-full p-4 text-left border rounded-lg transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 border-2 mr-3 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-900">
                {optionTranslations[option.key] || option.key}
              </span>
            </div>
          </button>
        )
      })}
      
      {Array.isArray(selectedValue) && selectedValue.length > 0 && (
        <div className="mt-6">
          <button
            onClick={submitMultiAnswer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Continue ({selectedValue.length} selected)
          </button>
        </div>
      )}
    </div>
  )

  const renderScale = () => {
    const scaleMax = options.length > 0 ? options.length : 5
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Strongly Disagree</span>
          <span className="text-sm text-gray-600">Strongly Agree</span>
        </div>
        
        <div className="flex justify-between items-center">
          {Array.from({ length: scaleMax }, (_, index) => {
            const value = (index + 1).toString()
            const isSelected = selectedValue === value
            
            return (
              <button
                key={value}
                onClick={() => handleScaleSelect(value)}
                className={`w-12 h-12 rounded-full border-2 font-semibold transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {value}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Question text */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {questionTranslations.text || question.key}
        </h2>
        
        {question.help_text && (
          <p className="text-gray-600 mb-4">
            {question.help_text}
          </p>
        )}
        
        {questionTranslations.help && (
          <p className="text-gray-600 mb-4">
            {questionTranslations.help}
          </p>
        )}
      </div>

      {/* Answer options */}
      <div>
        {question.type === 'single' && renderSingleChoice()}
        {question.type === 'multi' && renderMultiChoice()}
        {question.type === 'scale' && renderScale()}
      </div>
    </div>
  )
}
