// This component is a client component
'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

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
    }, [onDataChange, onDirtyChange])

    // Sync translations when quiz data changes
    useEffect(() => {
      setLocalTranslations(quizData.translations || {})
    }, [quizData.translations])

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-blue-600">ℹ️</div>
            <div className="text-sm text-blue-800">
              <strong>Fordítások szerkesztő:</strong> Minden szöveg módosítása és nyelvek közötti váltás.
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={`/admin/translations-native.html?id=${quizData.id}`}
            className="w-full h-[800px] border-0"
            title="Translation Editor"
          />
        </div>
      </div>
    )
  }
)

TranslationEditor.displayName = 'TranslationEditor'

export default TranslationEditor
