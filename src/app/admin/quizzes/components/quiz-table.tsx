'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import type { AdminUser } from '@/lib/admin-auth'
import type { Database } from '@/types/database'

type Quiz = {
  id: string
  slug: string
  status: 'draft' | 'active' | 'archived'
  default_lang: string
  feature_flags: Record<string, any>
  theme: Record<string, any>
  created_at: string
  updated_at: string
  translations?: Record<string, Record<string, string>>
}

interface QuizTableProps {
  quizzes: Quiz[]
  adminUser: AdminUser
}

export default function QuizTable({ quizzes, adminUser }: QuizTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleStatusChange = async (quizId: string, newStatus: string) => {
    if (adminUser.role === 'viewer') {
      alert('Nincs jogosultsága a státusz módosításához')
      return
    }

    setLoading(quizId)
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ status: newStatus })
        .eq('id', quizId)

      if (error) {
        alert('Hiba történt a státusz frissítése során')
        console.error(error)
      } else {
        // Refresh page to show updated status
        window.location.reload()
      }
    } catch (error) {
      alert('Hiba történt a státusz frissítése során')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleDuplicate = async (quizId: string) => {
    if (adminUser.role === 'viewer') {
      alert('Nincs jogosultsága a duplikáláshoz')
      return
    }

    setLoading(quizId)
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}/duplicate`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        window.location.href = `/admin/quizzes/${result.id}/edit`
      } else {
        alert('Hiba történt a duplikálás során')
      }
    } catch (error) {
      alert('Hiba történt a duplikálás során')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    }
    
    const labels = {
      active: 'Aktív',
      draft: 'Tervezet',
      archived: 'Archivált',
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const getTitle = (quiz: Quiz) => {
    const translations = quiz.translations
    if (translations) {
      const defaultLang = translations[quiz.default_lang]
      if (defaultLang?.title) return defaultLang.title
      
      // Fallback to any available title
      for (const lang of Object.keys(translations)) {
        if (translations[lang]?.title) return translations[lang].title
      }
    }
    return quiz.slug
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quiz
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Státusz
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alapnyelv
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Létrehozva
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Műveletek
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {getTitle(quiz)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {quiz.id.substring(0, 8)}...
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-mono">
                  {quiz.slug}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {adminUser.role !== 'viewer' ? (
                  <select
                    value={quiz.status}
                    onChange={(e) => handleStatusChange(quiz.id, e.target.value)}
                    disabled={loading === quiz.id}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Tervezet</option>
                    <option value="active">Aktív</option>
                    <option value="archived">Archivált</option>
                  </select>
                ) : (
                  getStatusBadge(quiz.status)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {quiz.default_lang.toUpperCase()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(quiz.created_at).toLocaleDateString('hu-HU')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link
                  href={`/admin/quizzes/${quiz.id}/edit`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  ✏️ Szerkesztés
                </Link>
                <Link
                  href={`/admin/quizzes/${quiz.id}/translations`}
                  className="text-purple-600 hover:text-purple-900"
                >
                  🌐 Fordítások
                </Link>
                {adminUser.role !== 'viewer' && (
                  <button
                    onClick={() => handleDuplicate(quiz.id)}
                    disabled={loading === quiz.id}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                  >
                    📋 Duplikálás
                  </button>
                )}
                <Link
                  href={`/${quiz.default_lang}/${quiz.slug}`}
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900"
                >
                  👁️ Előnézet
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-lg">Még nincsenek quiz-ek létrehozva.</p>
            <Link
              href="/admin/quizzes/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
              Első Quiz Létrehozása
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
