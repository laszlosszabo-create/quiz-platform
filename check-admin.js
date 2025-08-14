require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdmin() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@test.com')
      .single();
    
    if (error) {
      console.log('Admin user record not found, creating...');
      const { data: newAdmin, error: insertError } = await supabase
        .from('admin_users')
        .insert({ email: 'admin@test.com', role: 'owner' })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating admin record:', insertError);
      } else {
        console.log('✅ Admin record created:', newAdmin);
      }
    } else {
      console.log('✅ Admin user record exists:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAdmin();
