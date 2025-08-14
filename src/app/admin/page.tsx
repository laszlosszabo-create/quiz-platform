import { requireAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import type { Database } from '@/types/database'

async function getQuizStats() {
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
    const [
      { count: totalQuizzes },
      { count: activeQuizzes },
      { count: totalSessions },
      { count: totalOrders },
    ] = await Promise.all([
      supabase.from('quizzes').select('id', { count: 'exact', head: true }),
      supabase.from('quizzes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('quiz_sessions').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
    ])

    return {
      totalQuizzes: totalQuizzes || 0,
      activeQuizzes: activeQuizzes || 0,
      totalSessions: totalSessions || 0,
      totalOrders: totalOrders || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalQuizzes: 0,
      activeQuizzes: 0,
      totalSessions: 0,
      totalOrders: 0,
    }
  }
}

const quickActions = [
  { name: 'Új Quiz Létrehozása', href: '/admin/quizzes/new', icon: '➕', color: 'bg-blue-500' },
  { name: 'Fordítások Kezelése', href: '/admin/translations', icon: '🌍', color: 'bg-green-500' },
  { name: 'Email Sablonok', href: '/admin/emails', icon: '📧', color: 'bg-purple-500' },
  { name: 'Riportok Megtekintése', href: '/admin/reports', icon: '📊', color: 'bg-orange-500' },
]

export default async function AdminDashboard() {
  const adminUser = await requireAdmin('viewer')
  const stats = await getQuizStats()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Üdvözöljük, {adminUser.email}! ({adminUser.role})
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📝</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Összes Quiz
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalQuizzes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktív Quiz-ek
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeQuizzes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">👥</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Kitöltések
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalSessions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">💰</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rendelések
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Gyors Műveletek
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative rounded-lg p-6 bg-white shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <span className="text-xl">{action.icon}</span>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Legutóbbi Tevékenységek
        </h2>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p>Az audit log részletes tevékenységeket mutat.</p>
              <Link
                href="/admin/audit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                Audit Log Megtekintése
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Rendszer Állapot
        </h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl text-green-500 mb-2">✅</div>
              <h3 className="font-medium">Adatbázis</h3>
              <p className="text-sm text-gray-500">Működik</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-500 mb-2">✅</div>
              <h3 className="font-medium">Email Szolgáltatás</h3>
              <p className="text-sm text-gray-500">Resend API aktív</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-500 mb-2">✅</div>
              <h3 className="font-medium">Fizetési Rendszer</h3>
              <p className="text-sm text-gray-500">Stripe működik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
