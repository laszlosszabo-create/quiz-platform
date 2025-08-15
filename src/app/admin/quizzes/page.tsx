'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import QuizTable from './components/quiz-table-simple'
import { getSupabaseClient } from '@/lib/supabase-config'
import { useAdminUser } from '../components/admin-auth-wrapper'
import type { Database } from '@/types/database'

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

async function getQuizzes() {
  try {
    const supabase = getSupabaseClient()
    
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        id,
        slug,
        status,
        default_lang,
        feature_flags,
        theme,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quizzes:', error)
      return []
    }

    // Map the database structure to our component structure
    return quizzes.map(quiz => ({
      id: quiz.id,
      slug: quiz.slug,
      title: quiz.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), // Generate title from slug
      description: `${quiz.slug} quiz`, // Generate basic description
      language: quiz.default_lang || 'hu',
      isActive: quiz.status === 'active',
      isPremium: false, // Default for now
      createdAt: quiz.created_at,
      funnelStep: 1, // Default step
      questionCount: 0 // TODO: Add questions count query later
    }))
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return []
  }
}

export default function QuizzesPage() {
  const adminUser = useAdminUser()
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const data = await getQuizzes()
        setQuizzes(data)
      } catch (error) {
        console.error('Error loading quizzes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  if (!adminUser) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz-ek</h1>
          <p className="mt-2 text-sm text-gray-700">
            Kezelje a quiz-eket, státuszokat és meta adatokat
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ➕ Új Quiz
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Összes</div>
          <div className="text-2xl font-bold text-gray-900">{quizzes.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Aktív</div>
          <div className="text-2xl font-bold text-green-600">
            {quizzes.filter(q => q.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Tervezet</div>
          <div className="text-2xl font-bold text-yellow-600">
            {quizzes.filter(q => !q.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Archivált</div>
          <div className="text-2xl font-bold text-gray-600">
            {quizzes.filter(q => q.isPremium).length}
          </div>
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white shadow rounded-lg">
        <QuizTable quizzes={quizzes} adminUser={adminUser} />
      </div>
    </div>
  )
}
