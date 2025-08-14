import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gkmeqvuahoyuxexoohmy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcHhrYmpzdGJ4Y21seXl4ZXl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ3Mjg4NywiZXhwIjoyMDcwMDQ4ODg3fQ.a0pOoFNst2NDvBu5O21yf8mITx_1KbaFbYLJSV1GX_c"

const supabase = createClient(supabaseUrl, supabaseKey)

async function createProduct() {
  const { data, error } = await supabase
    .from('products')
    .insert({
      id: '188a3e3c-9cbd-4873-9c33-d20eff8959e6',
      name: 'ADHD Konzultáció',
      description: 'Egyéni ADHD konzultáció szakértővel',
      price: 15000,
      active: true,
      stripe_product_id: null,
      stripe_price_id: null
    })
    .select()

  if (error) {
    console.error('Error creating product:', error)
  } else {
    console.log('Product created:', data)
  }

  // Check if exists
  const { data: products, error: selectError } = await supabase
    .from('products')
    .select('*')

  if (selectError) {
    console.error('Error fetching products:', selectError)
  } else {
    console.log('All products:', products)
  }
}

createProduct()
