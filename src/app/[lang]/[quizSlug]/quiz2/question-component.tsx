'use client'

import { useState } from 'react'
import { QuizQuestion } from '@/types/database'

interface QuestionComponentProps {
  question: QuizQuestion
  questionTranslations: { text?: string; help?: string }
  optionTranslations: Record<string, string>
  onAnswerSelect: (optionKey: string | string[]) => void
  questionNumber: number
  totalQuestions: number
  selectedValue?: string | string[]
}

export function QuestionComponent({
  question,
  questionTranslations,
  optionTranslations,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
  selectedValue
}: QuestionComponentProps) {

  // Safety check for required props
  if (!question) {
    return <div className="text-center p-4">Kérdés betöltése...</div>
  }

  const options = (question.options as any[]) || []

  const handleSingleSelect = (optionKey: string) => {
    onAnswerSelect(optionKey)
  }

  const handleMultiSelect = (optionKey: string) => {
    const currentSelection = Array.isArray(selectedValue) ? selectedValue : []
    if (currentSelection.includes(optionKey)) {
      const updated = currentSelection.filter(key => key !== optionKey)
      onAnswerSelect(updated)
    } else {
      const updated = [...currentSelection, optionKey]
      onAnswerSelect(updated)
    }
  }

  const handleScaleSelect = (value: string) => {
    onAnswerSelect(value)
  }

  const submitMultiAnswer = () => {
    if (Array.isArray(selectedValue) && selectedValue.length > 0) {
      // This might need additional handling based on the parent component
      onAnswerSelect(selectedValue)
    }
  }

  const renderSingleChoice = () => (
    <div className="space-y-2">
      {options?.map((option, index) => {
        const isSelected = selectedValue === option.key
        
        return (
          <button
            key={option.key}
            onClick={() => handleSingleSelect(option.key)}
            className={`group w-full p-3 text-left border-2 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
              isSelected
                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm'
                : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`relative w-4 h-4 rounded-full border-2 mr-3 transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-purple-500 scale-110'
                  : 'border-gray-300 group-hover:border-purple-400'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full absolute inset-0 m-auto"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-purple-900' : 'text-gray-900 group-hover:text-gray-800'
                }`}>
                  {optionTranslations[option.key] || option.key}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs transition-colors ${
                    isSelected ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    Opció {String.fromCharCode(65 + index)}
                  </span>
                  
                  {isSelected && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">Kiválasztva</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )

  const renderMultiChoice = () => (
    <div className="space-y-2">
      {options?.map((option, index) => {
        const isSelected = Array.isArray(selectedValue) && selectedValue.includes(option.key)
        
        return (
          <button
            key={option.key}
            onClick={() => handleMultiSelect(option.key)}
            className={`group w-full p-3 text-left border-2 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
              isSelected
                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm'
                : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`relative w-4 h-4 rounded-md border-2 mr-3 transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-purple-500 scale-110'
                  : 'border-gray-300 group-hover:border-purple-400'
              }`}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-purple-900' : 'text-gray-900 group-hover:text-gray-800'
                }`}>
                  {optionTranslations[option.key] || option.key}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs transition-colors ${
                    isSelected ? 'text-purple-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    Opció {String.fromCharCode(65 + index)}
                  </span>
                  
                  {isSelected && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <span className="text-xs font-medium">Kiválasztva</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
      
      {Array.isArray(selectedValue) && selectedValue.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-900 font-medium text-sm">
                {selectedValue.length} opció kiválasztva
              </p>
              <p className="text-purple-700 text-xs mt-1">
                Folytasd a következő kérdéssel
              </p>
            </div>
            <button
              onClick={submitMultiAnswer}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center space-x-1"
            >
              <span className="text-sm">Tovább</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderScale = () => {
    const scaleMax = options?.length > 0 ? options.length : 5
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium text-gray-700">Egyáltalán nem értek egyet</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-700">Teljesen egyetértek</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="relative">
          {/* Background track */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full transform -translate-y-1/2"></div>
          
          <div className="flex justify-between items-center relative z-10">
            {Array.from({ length: scaleMax }, (_, index) => {
              const value = (index + 1).toString()
              const isSelected = selectedValue === value
              const position = index / (scaleMax - 1) // 0 to 1
              const colors = [
                'from-red-500 to-red-600',
                'from-orange-500 to-orange-600', 
                'from-yellow-500 to-yellow-600',
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600'
              ]
              const colorClass = colors[Math.min(index, colors.length - 1)]
              
              return (
                <button
                  key={value}
                  onClick={() => handleScaleSelect(value)}
                  className={`relative w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                    isSelected
                      ? `bg-gradient-to-r ${colorClass} text-white shadow-lg scale-125 z-20`
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    transform: isSelected ? 'scale(1.25) translateY(-2px)' : undefined
                  }}
                >
                  <span className="relative z-10">{value}</span>
                  
                  {isSelected && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        Kiválasztva
                      </div>
                      <div className="w-1.5 h-1.5 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Scale labels (use option translations when available) */}
        <div
          className="gap-1 text-center text-xs text-gray-600 mt-2"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${scaleMax}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: scaleMax }, (_, i) => {
            const opt = options?.[i]
            const key = opt?.key
            const label = key ? (optionTranslations[key] || (`${i + 1}`)) : (`${i + 1}`)
            return (
              <span key={i} className="truncate px-1">
                {label}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 py-1">
          <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {questionNumber}
          </div>
          <span className="text-xs font-medium text-gray-700">
            {totalQuestions} kérdésből
          </span>
        </div>
        
        <h2 className="text-lg font-bold text-gray-900 leading-snug max-w-4xl mx-auto">
          {questionTranslations.text || question.key}
        </h2>
        
        {(question.help_text || questionTranslations.help) && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-lg max-w-3xl mx-auto text-xs">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-blue-900 font-medium mb-1">Hasznos tudnivaló</h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  {questionTranslations.help || question.help_text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Answer options */}
      <div className="max-w-xl mx-auto">
        {question.type === 'single' && renderSingleChoice()}
        {question.type === 'multi' && renderMultiChoice()}
        {question.type === 'scale' && renderScale()}
      </div>
      
      {/* Question type indicator */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
          {question.type === 'single' && (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              <span>Válassz egyet a lehetőségek közül</span>
            </>
          )}
          {question.type === 'multi' && (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Több opció is kiválasztható</span>
            </>
          )}
          {question.type === 'scale' && (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
              <span>Értékeld 1-5 skálán</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
