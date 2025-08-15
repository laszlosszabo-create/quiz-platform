'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase-config'
import { useAdminUser } from '../../components/admin-auth-wrapper'

type Quiz = {
  id: string
  slug: string
  title: string
  description?: string
  language: string
  isActive: boolean
  isPremium: boolean
  createdAt: string
  funnelStep?: number
  questionCount: number
}

interface QuizTableProps {
  quizzes: Quiz[]
  adminUser: { role: string; email: string }
}

export default function QuizTable({ quizzes, adminUser }: QuizTableProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const supabase = getSupabaseClient()

  const handleStatusToggle = async (quizId: string, currentStatus: boolean) => {
    if (adminUser.role === 'viewer') {
      alert('Nincs jogosultságod a módosításhoz')
      return
    }

    setLoadingStates(prev => ({ ...prev, [quizId]: true }))

    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_active: !currentStatus })
        .eq('id', quizId)

      if (error) {
        console.error('Error updating quiz status:', error)
        alert('Hiba történt a státusz frissítésekor')
      } else {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hiba történt')
    } finally {
      setLoadingStates(prev => ({ ...prev, [quizId]: false }))
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Aktív
        </span>
      )
    } else {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          Inaktív
        </span>
      )
    }
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nincsenek quiz-ek</h3>
        <p className="mt-1 text-sm text-gray-500">
          Kezdj el egy új quiz létrehozásával.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Új Quiz
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getStatusBadge(quiz.isActive)}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <Link 
                      href={`/admin/quizzes/${quiz.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {quiz.title || quiz.slug}
                    </Link>
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        {quiz.language?.toUpperCase() || 'HU'}
                      </span>
                    </div>
                    {quiz.isPremium && (
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {quiz.description || 'Nincs leírás'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Kérdések: {quiz.questionCount} | Létrehozva: {new Date(quiz.createdAt).toLocaleDateString('hu-HU')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {adminUser.role !== 'viewer' && (
                  <button
                    onClick={() => handleStatusToggle(quiz.id, quiz.isActive)}
                    disabled={loadingStates[quiz.id]}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      quiz.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    } disabled:opacity-50`}
                  >
                    {loadingStates[quiz.id] 
                      ? 'Frissítés...' 
                      : quiz.isActive 
                        ? 'Deaktiválás' 
                        : 'Aktiválás'
                    }
                  </button>
                )}
                <Link
                  href={`/admin/quiz-editor?id=${quiz.id}`}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Szerkesztés
                </Link>
                <Link
                  href={`/${quiz.language || 'hu'}/${quiz.slug}`}
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Megtekintés
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
