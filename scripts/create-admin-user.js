require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key needed for auth admin
)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@test.com',
      password: 'admin123456',
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Auth user created:', authUser.user.email)

    // Create admin_users record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@test.com',
        role: 'owner'
      })
      .select()
      .single()

    if (adminError) {
      console.error('Error creating admin user record:', adminError)
      return
    }

    console.log('Admin user record created:', adminUser)
    console.log('✅ Admin user setup complete!')
    console.log('Login credentials:')
    console.log('Email: admin@test.com')
    console.log('Password: admin123456')

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
}

module.exports = { createAdminUser }
