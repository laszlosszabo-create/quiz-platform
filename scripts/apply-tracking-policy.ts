import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyTrackingPolicy() {
  console.log('🔧 Applying public tracking policy...')
  
  try {
    // First, try to drop the policy if it exists
    await supabase.rpc('exec_sql', {
      query: 'DROP POLICY IF EXISTS "Allow public tracking events" ON public.audit_logs;'
    })
    
    // Then create the new policy
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE POLICY "Allow public tracking events" ON public.audit_logs
            FOR INSERT WITH CHECK (
                user_id = 'public_user' AND
                user_email = 'public@system.local' AND
                action LIKE 'USER_%'
            );
      `
    })
    
    if (error) {
      console.error('❌ Policy creation failed:', error)
      process.exit(1)
    }
    
    console.log('✅ Public tracking policy applied successfully!')
    
  } catch (error) {
    console.error('❌ Error applying policy:', error)
    process.exit(1)
  }
}

applyTrackingPolicy()
