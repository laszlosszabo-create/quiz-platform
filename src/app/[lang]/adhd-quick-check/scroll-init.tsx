'use client'

import { useEffect } from 'react'
import { initScrollDepthTracking } from '@/lib/scroll-tracker'

export default function ScrollInit({ quizId, lang }: { quizId: string; lang: string }) {
  useEffect(() => {
    if (quizId) {
      initScrollDepthTracking({ quizId, lang })
    }
  }, [quizId, lang])
  return null
}
