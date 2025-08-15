import { createClient } from '@supabase/supabase-js'

import { getSupabaseAdmin } from '../src/lib/supabase-config'

const supabase = getSupabaseAdmin()

async function checkProducts() {
  // Check existing products
  const { data: products, error: selectError } = await supabase
    .from('products')
    .select('*')

  if (selectError) {
    console.error('Error fetching products:', selectError)
  } else {
    console.log('All products:', JSON.stringify(products, null, 2))
  }
}

checkProducts()
