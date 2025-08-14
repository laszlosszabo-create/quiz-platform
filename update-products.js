require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateProducts() {
  try {
    console.log('Updating product with Stripe price ID...');
    
    // First product - update with the NEW correct Stripe price ID (HUF, 990000 cents = 9900 Ft)
    const { data, error } = await supabase
      .from('products')
      .update({ 
        stripe_price_id: 'price_1RvzBE4g26nclPGfkWkspFtk' 
      })
      .eq('id', 'e6aeb984-bfa7-43f3-99b1-4451a83f9ef3')  // This is the one we've been using in tests
      .select();
    
    if (error) {
      console.error('Error updating product:', error);
    } else {
      console.log('Product updated:', data);
    }

    // Check the updated products
    const { data: products, error: selectError } = await supabase
      .from('products')
      .select('id, name, stripe_price_id')
      .order('created_at', { ascending: false });
    
    if (selectError) {
      console.error('Error fetching products:', selectError);
    } else {
      console.log('All products after update:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.id}) - Stripe Price: ${product.stripe_price_id || 'NULL'}`);
      });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

updateProducts();
