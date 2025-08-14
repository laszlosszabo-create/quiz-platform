require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestProduct() {
  console.log('Creating test product...');
  
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: 'ADHD Assessment Report',
        price: 15000,
        currency: 'huf',
        quiz_id: 'b1128c0b-f06a-4d17-9c2f-59969c134f93',
        stripe_price_id: null,
        active: true
      }
    ]);

  if (error) {
    console.error('Error creating product:', error);
  } else {
    console.log('Product created successfully:', data);
  }

  // Check if product exists
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*');

  if (fetchError) {
    console.error('Error fetching products:', fetchError);
  } else {
    console.log('All products:', products);
  }
}

createTestProduct();
