'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-config'
import { useAdminUser } from './admin-auth-wrapper'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '🏠' },
  { name: 'Quiz-ek', href: '/admin/quizzes', icon: '📝' },
  { name: 'Fordítások', href: '/admin/translations', icon: '🌍' },
  { name: 'Kérdések', href: '/admin/questions', icon: '❓' },
  { name: 'Pontozás', href: '/admin/scoring', icon: '🎯' },
  { name: 'AI Promptok', href: '/admin/prompts', icon: '🤖' },
  { name: 'Termékek', href: '/admin/products', icon: '💰' },
  { name: 'Email Sablonok', href: '/admin/emails', icon: '📧' },
  { name: 'Riportok', href: '/admin/reports', icon: '📊' },
  { name: 'Audit Log', href: '/admin/audit', icon: '📋' },
]

export default function AdminNavigation() {
  const adminUser = useAdminUser()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Don't render if no admin user
  if (!adminUser) {
    return null
  }
  
  const supabase = getSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login/admin')
    router.refresh()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Quiz Admin
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {adminUser.email}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(adminUser.role)}`}>
                    {adminUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Kijelentkezés</span>
                🚪
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Menü megnyitása</span>
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {adminUser.email}
                </div>
                <div className="text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(adminUser.role)}`}>
                    {adminUser.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleSignOut}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                🚪 Kijelentkezés
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
