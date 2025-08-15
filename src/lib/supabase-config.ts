import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/database'

// Environment variables validation and centralized config
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
    isLocal: url.includes('127.0.0.1') || url.includes('localhost')
  }
}

// Client-side singleton
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

// Server-side admin singleton
let adminInstance: ReturnType<typeof createClient<Database>> | null = null

/**
 * Get Supabase client for browser/client-side operations
 * Uses anon key, handles auth, sessions, etc.
 */
export const getSupabaseClient = () => {
  if (clientInstance) {
    return clientInstance
  }

  const config = getSupabaseConfig()
  
  clientInstance = createClient<Database>(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  return clientInstance
}

/**
 * Get Supabase admin client for server-side operations
 * Uses service role key, bypasses RLS
 */
export const getSupabaseAdmin = () => {
  if (adminInstance) {
    return adminInstance
  }

  const config = getSupabaseConfig()
  
  if (!config.serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  adminInstance = createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return adminInstance
}

/**
 * Create SSR-compatible Supabase client (for server components/middleware)
 */
export const createSupabaseServerClient = (
  getCookie: () => string | undefined,
  setCookie: (name: string, value: string, options?: any) => void
) => {
  const config = getSupabaseConfig()
  
  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      get: getCookie,
      set: setCookie,
      remove: (name: string) => setCookie(name, '', { maxAge: 0 })
    }
  })
}

/**
 * Get current environment info
 */
export const getSupabaseInfo = () => {
  const config = getSupabaseConfig()
  return {
    url: config.url,
    environment: config.isLocal ? 'local' : 'remote',
    isLocal: config.isLocal
  }
}

// Export the singleton instances as well for backward compatibility
export const supabase = getSupabaseClient()
// Note: supabaseAdmin is not exported directly to prevent client-side initialization
// Use getSupabaseAdmin() function instead
