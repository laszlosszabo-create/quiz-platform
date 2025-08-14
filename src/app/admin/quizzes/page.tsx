import { requireAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import QuizTable from './components/quiz-table'
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

async function getQuizzes() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_translations!inner (
          lang,
          field_key,
          value
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching quizzes:', error)
      return []
    }

    // Group translations by quiz
    const quizzesWithTranslations = quizzes?.reduce((acc: Quiz[], item: any) => {
      const existingQuiz = acc.find((q: Quiz) => q.id === item.id)
      
      if (existingQuiz) {
        if (!existingQuiz.translations) existingQuiz.translations = {}
        if (!existingQuiz.translations[item.quiz_translations.lang]) {
          existingQuiz.translations[item.quiz_translations.lang] = {}
        }
        existingQuiz.translations[item.quiz_translations.lang][item.quiz_translations.field_key] = item.quiz_translations.value
      } else {
        const quiz = {
          id: item.id,
          slug: item.slug,
          status: item.status,
          default_lang: item.default_lang,
          feature_flags: item.feature_flags,
          theme: item.theme,
          created_at: item.created_at,
          updated_at: item.updated_at,
          translations: {
            [item.quiz_translations.lang]: {
              [item.quiz_translations.field_key]: item.quiz_translations.value
            }
          }
        }
        acc.push(quiz)
      }
      
      return acc
    }, [] as Quiz[]) || []

    return quizzesWithTranslations
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return []
  }
}

export default async function QuizzesPage() {
  const adminUser = await requireAdmin('viewer')
  const quizzes = await getQuizzes()

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
            {quizzes.filter((q: Quiz) => q.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Tervezet</div>
          <div className="text-2xl font-bold text-yellow-600">
            {quizzes.filter((q: Quiz) => q.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Archivált</div>
          <div className="text-2xl font-bold text-gray-600">
            {quizzes.filter((q: Quiz) => q.status === 'archived').length}
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
