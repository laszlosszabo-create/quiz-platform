import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

export type AdminRole = 'owner' | 'editor' | 'viewer'

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  created_at: string
  updated_at: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const hdrs = await headers()

  // Optional: support Authorization: Bearer <access_token> for server-to-server calls
  const authHeader = hdrs.get('authorization') || hdrs.get('Authorization')
  const bearer = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null

  let supabase: ReturnType<typeof createServerClient<Database>> | ReturnType<typeof createClient<Database>>

  if (bearer) {
    // Fallback: token-based client (no cookies required)
    supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${bearer}` } } }
    )
  } else {
    // Default: cookie-based SSR client
    supabase = createServerClient<Database>(
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
  }
  
  try {
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return null
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (adminError || !adminUser) {
      return null
    }

    return adminUser
  } catch (error) {
    console.error('Error getting admin user:', error)
    return null
  }
}

export async function requireAdmin(minimumRole: AdminRole = 'viewer'): Promise<AdminUser> {
  const adminUser = await getAdminUser()
  
  if (!adminUser) {
    redirect('/login/admin')
  }

  // Check role hierarchy: owner > editor > viewer
  const roleHierarchy = { owner: 3, editor: 2, viewer: 1 }
  const userLevel = roleHierarchy[adminUser.role]
  const requiredLevel = roleHierarchy[minimumRole]

  if (userLevel < requiredLevel) {
    throw new Error(`Insufficient permissions. Required: ${minimumRole}, Current: ${adminUser.role}`)
  }

  return adminUser
}

export function hasPermission(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy = { owner: 3, editor: 2, viewer: 1 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export async function logAdminAction(
  action: string,
  entity: string,
  entityId?: string,
  diff?: Record<string, any>
) {
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
  const adminUser = await getAdminUser()
  
  if (!adminUser) return

  try {
    await supabase
      .from('audit_logs')
      .insert({
        actor_id: adminUser.id,
        action,
        entity,
        entity_id: entityId,
        diff: diff || {}
      })
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}
