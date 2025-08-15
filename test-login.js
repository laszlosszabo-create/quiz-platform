require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  console.log('=== Testing Login ===');
  
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123456'
      })
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', data.user?.email);
    } else {
      const error = await response.text();
      console.log('❌ Login failed:', error);
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testLogin();
