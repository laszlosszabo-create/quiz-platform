'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminUser } from '../../components/admin-auth-wrapper'

interface Quiz {
  id: string
  title: string
  slug: string
  description: string | null
  language: string
  created_at: string
  is_active: boolean
  is_premium: boolean
  quiz_questions: Array<{
    id: string
    question_text: string
    question_type: string
  }>
}

interface QuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function QuizDetailPage({ params }: QuizDetailPageProps) {
  const adminUser = useAdminUser()
  const [quizId, setQuizId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getParams = async () => {
      try {
        const { id } = await params
        setQuizId(id)
      } catch (error) {
        console.error('Error loading params:', error)
        router.push('/admin/quizzes')
      }
    }
    
    getParams()
  }, [params, router])

  useEffect(() => {
    if (!quizId) return

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/admin/quizzes/${quizId}`)
        if (!response.ok) {
          throw new Error('Quiz not found')
        }
        const data = await response.json()
        setQuiz(data)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        setError('Quiz nem található')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (loading) {
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

  if (error || !quiz) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">
            {error || 'Quiz nem található'}
          </h3>
          <Link
            href="/admin/quizzes"
            className="mt-2 inline-block text-red-600 hover:text-red-500"
          >
            ← Vissza a quiz listához
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/quizzes"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Vissza
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Quiz részletek és kezelés
          </p>
        </div>

        <div className="flex space-x-2">
          <Link
            href={`/admin/quiz-editor?id=${quiz.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            📝 Szerkesztés
          </Link>
          <Link
            href={`/admin/quizzes/${quiz.id}/translations`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            🌐 Fordítások
          </Link>
        </div>
      </div>

      {/* Quiz Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Alapadatok
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Slug:</span>
              <p className="text-gray-900">{quiz.slug}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Nyelv:</span>
              <p className="text-gray-900">{quiz.language?.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Létrehozva:</span>
              <p className="text-gray-900">
                {new Date(quiz.created_at).toLocaleDateString('hu-HU')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚙️ Státusz
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Aktív:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                quiz.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {quiz.is_active ? 'Igen' : 'Nem'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Premium:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                quiz.is_premium 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {quiz.is_premium ? 'Igen' : 'Nem'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Statisztikák
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Kérdések:</span>
              <p className="text-2xl font-bold text-blue-600">
                {quiz.quiz_questions?.length || 0}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Típus:</span>
              <p className="text-gray-900">Standard Quiz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {quiz.description && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Leírás
          </h3>
          <p className="text-gray-700">{quiz.description}</p>
        </div>
      )}

      {/* Questions Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ❓ Kérdések ({quiz.quiz_questions?.length || 0})
          </h3>
          <Link
            href={`/admin/quiz-editor?id=${quiz.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Kérdések szerkesztése →
          </Link>
        </div>

        {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
          <div className="space-y-3">
            {quiz.quiz_questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {index + 1}. {question.question_text}
                </p>
                <p className="text-xs text-gray-500">
                  Típus: {question.question_type}
                </p>
              </div>
            ))}
            {quiz.quiz_questions.length > 3 && (
              <p className="text-sm text-gray-500 italic">
                ...és még {quiz.quiz_questions.length - 3} kérdés
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">Még nincsenek kérdések hozzáadva.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 Gyors műveletek
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`/admin/quiz-editor?id=${quiz.id}`}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-900">
              Quiz szerkesztése
            </div>
          </Link>
          
          <Link
            href={`/admin/quizzes/${quiz.id}/translations`}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-sm font-medium text-gray-900">
              Fordítások
            </div>
          </Link>

          <Link
            href={`/${quiz.language || 'hu'}/${quiz.slug}`}
            target="_blank"
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">👁️</div>
            <div className="text-sm font-medium text-gray-900">
              Előnézet
            </div>
          </Link>

          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">
              Statisztikák
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
