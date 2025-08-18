'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TranslationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TranslationPage({ params }: TranslationPageProps) {
  const [quizId, setQuizId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [iframeHeight, setIframeHeight] = useState<number>(900)

  // Listen for height messages from the native editor to auto-resize the iframe
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Same-origin only and expected message shape
      if (typeof window === 'undefined') return
      if (event.origin !== window.location.origin) return
      const data = event.data as any
      if (data && data.type === 'native-editor:height' && typeof data.height === 'number') {
        // Clamp height to sensible bounds
        const clamped = Math.max(600, Math.min(3000, Math.round(data.height)))
        setIframeHeight(clamped)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

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
          Szerkeszd a quiz szövegeit különböző nyelveken. A módosítások csak a Mentés gombra kattintva kerülnek elmentésre.
        </p>
      </div>

      {/* Embed native editor in iframe to isolate from React */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <iframe
          src={`/admin/quizzes/${quizId}/translations/native`}
          className="w-full border-0"
          style={{ height: `${iframeHeight}px`, minHeight: '600px' }}
          title="Translation Editor"
        />
      </div>
    </div>
  )
}
