import React from 'react'

export function QuestionComponent({ question, questionTranslations, optionTranslations, onAnswer, currentAnswer, questionNumber, totalQuestions }: any) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center mt-2 mb-4">
        <div className="inline-block bg-gradient-to-r from-purple-200 to-blue-200 px-3 py-1 rounded-full text-sm">{questionNumber} / {totalQuestions}</div>
      </div>

      <h2 className="text-[clamp(18px,2.4vw,26px)] font-bold text-center leading-tight mb-4 px-2">
        {questionTranslations?.text || question?.text}
      </h2>

      {questionTranslations?.help && (
        <div className="bg-blue-50 border-l-4 border-blue-200 p-3 text-sm mb-4 mx-2">
          <strong className="block text-sm mb-1">Hasznos tudnivaló</strong>
          <div className="text-xs text-gray-700">{questionTranslations.help}</div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-1">
        <div className="space-y-3">
          {(question?.options || []).map((opt: any, idx: number) => (
            <label key={opt.key || idx} className="flex items-center p-3 border rounded-xl bg-white hover:shadow-sm cursor-pointer">
              <input type="radio" name={question.key} className="w-4 h-4 mr-4" />
              <div>
                <div className="text-sm font-medium">{opt.label || opt.key}</div>
                <div className="text-xs text-gray-500">Opció {String.fromCharCode(65 + idx)}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="py-3 px-2">
        <div className="flex justify-end">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm">Tovább</button>
        </div>
      </div>
    </div>
  )
}
