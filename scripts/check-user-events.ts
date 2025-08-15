import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUserEventsDirectly() {
  console.log('🔧 Creating user_events table directly...')
  
  try {
    // Create the table directly using a simple Supabase call
    // We'll use a workaround by inserting a temporary record to trigger table creation
    
    // First, check if we can create via SQL
    console.log('🧪 Testing direct table creation...')
    
    // Let's try to select from user_events to see if it exists
    const { data: existingTable, error: selectError } = await supabase
      .from('user_events')
      .select('id')
      .limit(1)
    
    if (selectError) {
      console.log('📝 Table does not exist, needs manual creation.')
      console.log('🔍 Available tables:')
      
      // List available tables
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (!tablesError && tables) {
        console.log('Available tables:', tables.map(t => t.table_name).join(', '))
      }
      
      console.log('\n📋 Manual SQL needed:')
      console.log('Please run this SQL in Supabase dashboard SQL editor:')
      console.log('\n```sql')
      console.log(`CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    url TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`)
      console.log('```\n')
      
      return false
    } else {
      console.log('✅ user_events table already exists!')
      return true
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    return false
  }
}

createUserEventsDirectly()
