import { createClient } from '@supabase/supabase-js'

import { getSupabaseAdmin } from '../src/lib/supabase-config'

const supabase = getSupabaseAdmin()

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
