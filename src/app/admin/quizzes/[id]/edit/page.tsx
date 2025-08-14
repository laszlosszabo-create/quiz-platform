import { requireAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import QuizEditForm from './components/quiz-edit-form'
import type { Database } from '@/types/database'

async function getQuiz(id: string) {
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
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_translations!inner (
          lang,
          field_key,
          value
        )
      `)
      .eq('id', id)

    if (error || !quiz) {
      return null
    }

    // Group translations by language
    const groupedTranslations: Record<string, Record<string, string>> = {}
    
    quiz.forEach((item: any) => {
      if (!groupedTranslations[item.quiz_translations.lang]) {
        groupedTranslations[item.quiz_translations.lang] = {}
      }
      groupedTranslations[item.quiz_translations.lang][item.quiz_translations.field_key] = item.quiz_translations.value
    })

    // Get the first quiz record (they should all be the same)
    const quizData = quiz[0]
    
    return {
      id: quizData.id,
      slug: quizData.slug,
      status: quizData.status,
      default_lang: quizData.default_lang,
      feature_flags: quizData.feature_flags,
      theme: quizData.theme,
      created_at: quizData.created_at,
      updated_at: quizData.updated_at,
      translations: groupedTranslations
    }
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return null
  }
}

export default async function QuizEditPage({
  params,
}: {
  params: { id: string }
}) {
  const adminUser = await requireAdmin('viewer')
  const quiz = await getQuiz(params.id)

  if (!quiz) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quiz Szerkesztése
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Módosítsa a quiz meta adatait, témáit és beállításait
        </p>
      </div>

      {/* Quiz Edit Form */}
      <div className="bg-white shadow rounded-lg">
        <QuizEditForm quiz={quiz} adminUser={adminUser} />
      </div>
    </div>
  )
}
