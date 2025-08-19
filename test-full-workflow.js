#!/usr/bin/env node

/**
 * TELJES QUIZ WORKFLOW TESZTELŐ
 * Tesztelj a javított AI caching és Stripe redirect funkcionalitást
 */

const BASE_URL = 'http://localhost:3000';
const QUIZ_SLUG = 'adhd-quick-check';
const LANG = 'hu';
const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';

// Session létrehozás
async function createSession() {
  console.log('🚀 1. Session létrehozása...');
  
  const response = await fetch(`${BASE_URL}/api/quiz/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quizSlug: QUIZ_SLUG,
      lang: LANG
    })
  });
  
  const data = await response.json();
  console.log('   ✅ Session ID:', data.id);
  return data.id;
}

// Quiz kitöltés szimulálás 
async function completeQuiz(sessionId) {
  console.log('📝 2. Quiz kitöltés szimulálása...');
  
  // Mock válaszok
  const answers = {
    'attention_difficulty': 'often',
    'hyperactivity': 'sometimes', 
    'impulse_control': 'often',
    'organization': 'always'
  };
  
  // Session frissítés completed állapotra
  const response = await fetch(`${BASE_URL}/api/quiz/session`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: sessionId,
      answers,
      state: 'completed',
      scores: { total: 15 } // Mock score
    })
  });
  
  if (response.ok) {
    console.log('   ✅ Quiz kitöltve');
  }
}

// AI eredmény tesztelés (első alkalommal)
async function testAIGeneration(sessionId, testName = 'első') {
  console.log(`🤖 3a. AI eredmény tesztelése (${testName} alkalommal)...`);
  
  const startTime = Date.now();
  const response = await fetch(`${BASE_URL}/api/ai/generate-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      quiz_id: QUIZ_ID,
      lang: LANG
    })
  });
  
  const data = await response.json();
  const duration = Date.now() - startTime;
  
  if (response.ok) {
    console.log(`   ✅ AI eredmény (${duration}ms) - Cached: ${data.cached || false}`);
    console.log(`   📝 Eredmény: ${data.ai_result?.substring(0, 100)}...`);
  } else {
    console.log('   ❌ AI hiba:', data.error);
  }
  
  return data.cached;
}

// Stripe checkout tesztelés
async function testStripeCheckout(sessionId) {
  console.log('💳 4. Stripe checkout tesztelése...');
  
  const response = await fetch(`${BASE_URL}/api/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: QUIZ_ID, // Assuming product ID matches quiz ID
      session_id: sessionId,
      lang: LANG
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('   ✅ Stripe checkout URL:', data.checkout_url);
    console.log('   🔍 Success URL ellenőrzés:', data.checkout_url?.includes('localhost:3000') ? 'HELYES PORT' : 'ROSSZ PORT');
  } else {
    const error = await response.json();
    console.log('   ❌ Stripe hiba:', error.error);
  }
}

// Result oldal betöltés tesztelés
async function testResultPage(sessionId) {
  console.log('📊 5. Result oldal tesztelése...');
  
  const response = await fetch(`${BASE_URL}/${LANG}/${QUIZ_SLUG}/result?session=${sessionId}`);
  
  if (response.ok) {
    console.log('   ✅ Result oldal betöltve (200)');
  } else {
    console.log('   ❌ Result oldal hiba:', response.status);
  }
}

// Payment success tesztelés
async function testPaymentSuccess(sessionId) {
  console.log('🎉 6. Payment success tesztelése...');
  
  const response = await fetch(`${BASE_URL}/${LANG}/${QUIZ_SLUG}/result?session=${sessionId}&payment=success&stripe_session=test_checkout_123`);
  
  if (response.ok) {
    console.log('   ✅ Payment success oldal betöltve (200)');
  } else {
    console.log('   ❌ Payment success hiba:', response.status);
  }
}

// Fő teszt függvény
async function runFullWorkflowTest() {
  console.log('🎯 TELJES QUIZ WORKFLOW TESZT - 2025.08.19\n');
  
  try {
    // 1. Session létrehozás
    const sessionId = await createSession();
    
    // 2. Quiz kitöltés
    await completeQuiz(sessionId);
    
    // 3a. AI eredmény első alkalommal (nem cached)
    const firstCached = await testAIGeneration(sessionId, 'első');
    
    // 3b. AI eredmény második alkalommal (cached)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Kis szünet
    const secondCached = await testAIGeneration(sessionId, 'második');
    
    // 4. Caching validáció
    console.log('🔄 AI Caching ellenőrzés:');
    console.log(`   Első hívás cached: ${firstCached} (false várt)`);
    console.log(`   Második hívás cached: ${secondCached} (true várt)`);
    
    if (!firstCached && secondCached) {
      console.log('   ✅ AI CACHING MŰKÖDIK!');
    } else {
      console.log('   ⚠️  AI caching probléma');
    }
    
    // 5. Stripe checkout
    await testStripeCheckout(sessionId);
    
    // 6. Result oldal
    await testResultPage(sessionId);
    
    // 7. Payment success
    await testPaymentSuccess(sessionId);
    
    console.log('\n🎉 TESZT KÉSZ! Minden funkció ellenőrizve.');
    
  } catch (error) {
    console.error('❌ Teszt hiba:', error.message);
  }
}

// Test indítás
if (require.main === module) {
  runFullWorkflowTest();
}
