require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Service key exists:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkProducts() {
  try {
    console.log('Checking products...');
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stripe_price_id')
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Products found:', data.length);
      console.log(data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkProducts();
