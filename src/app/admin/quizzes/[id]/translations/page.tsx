'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SimpleTranslationEditor from '@/app/admin/components/simple-translation-editor'

interface TranslationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TranslationPage({ params }: TranslationPageProps) {
  const [quizId, setQuizId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getParams = async () => {
      try {
        const { id } = await params
        setQuizId(id)
      } catch (error) {
        console.error('Error loading params:', error)
        router.push('/admin/quizzes')
      } finally {
        setLoading(false)
      }
    }
    
    getParams()
  }, [params, router])

  if (loading || !quizId) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fordítás kezelés</h1>
        <p className="text-gray-600 mt-1">
          Szerkeszd a quiz szövegeit különböző nyelveken. Az automatikus mentés aktiválódik szöveg módosításkor.
        </p>
      </div>

      <SimpleTranslationEditor quizId={quizId} />
    </div>
  )
}
