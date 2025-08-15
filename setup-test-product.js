require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupProducts() {
  try {
    // First let's check if we can insert a product
    console.log('Testing product insertion...');
    
    // Get the ADHD quiz ID
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('slug', 'adhd-quick-check')
      .single();
      
    if (quizError || !quiz) {
      console.error('Quiz not found:', quizError);
      return;
    }
    
    console.log('Found quiz:', quiz);
    
    // Try to insert a test product directly
    const testProduct = {
      quiz_id: quiz.id,
      active: true,
      price_cents: 2999, // 29.99 EUR
      currency: 'EUR',
      stripe_price_id: 'price_test_123',
      delivery_type: 'ai_generated',
      translations: {
        hu: {
          name: 'ADHD Gyorsdiagnosztika Jelentés',
          description: 'Személyre szabott AI-alapú jelentés az ADHD tünetekről'
        },
        en: {
          name: 'ADHD Quick Assessment Report',
          description: 'Personalized AI-powered report on ADHD symptoms'
        }
      }
    };
    
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();
      
    if (insertError) {
      console.error('Product insertion error:', insertError);
    } else {
      console.log('Product created successfully:', product);
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

setupProducts();
