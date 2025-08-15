'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-config'
import type { AdminUser } from '@/lib/admin-auth'

interface AdminAuthWrapperProps {
  children: React.ReactNode
  minimumRole?: 'owner' | 'editor' | 'viewer'
}

const AdminUserContext = createContext<AdminUser | null>(null)

export function useAdminUser() {
  const context = useContext(AdminUserContext)
  return context
}

export default function AdminAuthWrapper({ 
  children, 
  minimumRole = 'viewer' 
}: AdminAuthWrapperProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const supabase = getSupabaseClient()
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login/admin')
          return
        }

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (adminError || !adminData) {
          console.error('Not an admin user:', adminError?.message)
          router.push('/login/admin')
          return
        }

        // Check role hierarchy
        const roleHierarchy = { owner: 3, editor: 2, viewer: 1 }
        const userLevel = roleHierarchy[adminData.role as keyof typeof roleHierarchy]
        const requiredLevel = roleHierarchy[minimumRole]

        if (userLevel < requiredLevel) {
          setError(`Access denied. Required role: ${minimumRole}, your role: ${adminData.role}`)
          return
        }

        setAdminUser({
          id: adminData.id,
          email: adminData.email,
          role: adminData.role as 'owner' | 'editor' | 'viewer',
          created_at: adminData.created_at,
          updated_at: adminData.updated_at
        })
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/login/admin')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [router, minimumRole])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
            <p className="mt-1 text-red-600">{error}</p>
            <button
              onClick={() => router.push('/login/admin')}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return null // Will redirect
  }

  return (
    <AdminUserContext.Provider value={adminUser}>
      {children}
    </AdminUserContext.Provider>
  )
}
