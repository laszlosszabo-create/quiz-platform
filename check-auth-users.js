require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAuthUsers() {
  try {
    // Check auth users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching auth users:', error);
      return;
    }
    
    console.log('📧 Auth users found:');
    users.forEach(user => {
      console.log(`  - Email: ${user.email}`);
      console.log(`    ID: ${user.id}`);
      console.log(`    Created: ${user.created_at}`);
      console.log(`    Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`    ---`);
    });
    
    // Check admin table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*');
    
    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      return;
    }
    
    console.log('🔑 Admin table users:');
    adminUsers.forEach(user => {
      console.log(`  - Email: ${user.email}`);
      console.log(`    Role: ${user.role}`);
      console.log(`    Created: ${user.created_at}`);
      console.log(`    ---`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAuthUsers();
