'use client'

import { useParams } from 'next/navigation'

export default function QuizEditPage() {
  const params = useParams() as { id?: string }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Quiz szerkesztő</h1>
      <p className="text-gray-600">Quiz ID: {params?.id || 'ismeretlen'}</p>
    </div>
  )
}
