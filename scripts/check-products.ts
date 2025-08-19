import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
