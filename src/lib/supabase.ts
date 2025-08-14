import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton client instance
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Get or create the singleton client instance
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })
    throw new Error('Supabase configuration is missing')
  }

  // Return existing client if available
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new client and store as singleton
  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}
