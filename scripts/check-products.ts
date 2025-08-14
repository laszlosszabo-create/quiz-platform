import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gkmeqvuahoyuxexoohmy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbWVxdnVhaG95dXhleG9vaG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ3MzM1NiwiZXhwIjoyMDcwMDQ5MzU2fQ._O7I2G5Ge7y6Q4uKT5-T7SyP1O_TJtsCcuGBiqT4Res"

const supabase = createClient(supabaseUrl, supabaseKey)

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
