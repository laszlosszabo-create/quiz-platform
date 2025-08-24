#!/usr/bin/env node
// Test quiz completion and email automation

const BASE_URL = 'http://localhost:3000';

async function testQuizCompletionEmail() {
  console.log('🧪 Testing quiz completion email automation...\n');

  try {
    const quizId = '01932f60-a30f-7e74-ad76-5adf073c21c9';
    const testEmail = 'test@example.com';
    const testName = 'Test User';
    
    // 1. Check email templates for this quiz
    console.log('1. Checking email templates...');
    const templatesResponse = await fetch(`${BASE_URL}/api/admin/email-templates?quiz_id=${quizId}`);
    if (templatesResponse.ok) {
      const templatesData = await templatesResponse.json();
      console.log(`   ✅ Found ${templatesData.templates?.length || 0} email templates`);
      if (templatesData.templates?.length > 0) {
        console.log(`   📧 First template: ${templatesData.templates[0].template_name} (${templatesData.templates[0].template_type})`);
      }
    } else {
      console.log(`   ❌ Templates API failed: ${templatesResponse.status}`);
    }

    // 2. Check automation rules
    console.log('\n2. Checking automation rules...');
    const rulesResponse = await fetch(`${BASE_URL}/api/admin/email-automation-rules?quiz_id=${quizId}`);
    if (rulesResponse.ok) {
      const rulesData = await rulesResponse.json();
      console.log(`   ✅ Found ${rulesData.rules?.length || 0} automation rules`);
      if (rulesData.rules?.length > 0) {
        const activeRules = rulesData.rules.filter(r => r.is_active);
        console.log(`   🎯 Active rules: ${activeRules.length}`);
        activeRules.forEach(rule => {
          console.log(`      - ${rule.rule_name} (${rule.rule_type || rule.trigger_event})`);
        });
      }
    } else {
      console.log(`   ❌ Rules API failed: ${rulesResponse.status}`);
    }

    // 3. Simulate AI result generation (which triggers emails)
    console.log('\n3. Simulating quiz completion...');
    const sessionId = `test-session-${Date.now()}`;
    
    // Create a mock session first (simplified)
    const mockSession = {
      id: sessionId,
      quiz_id: quizId,
      user_email: testEmail,
      user_name: testName,
      answers: {
        question_1: 'Sometimes',
        question_2: 'Often',
        question_3: 'Rarely'
      },
      scores: {
        attention: 3,
        hyperactivity: 4,
        impulsivity: 2
      },
      state: 'completed'
    };

    // Try triggering AI result with mock mode
    const aiResponse = await fetch(`${BASE_URL}/api/ai/generate-result?mock=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        quiz_id: quizId,
        lang: 'hu',
        skip_ai_generation: false
      })
    });

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      console.log(`   ✅ AI result generated (mock mode): ${aiData.mocked ? 'mocked' : 'real'}`);
    } else {
      const aiError = await aiResponse.text();
      console.log(`   ⚠️ AI result failed: ${aiResponse.status} - ${aiError}`);
      console.log('   (This might be expected if session doesn\'t exist in DB)');
    }

    // 4. Check email queue after simulation
    console.log('\n4. Checking email queue after simulation...');
    const queueResponse = await fetch(`${BASE_URL}/api/admin/email-queue?quiz_id=${quizId}&limit=5&order=updated_desc`);
    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      const recentItems = queueData.queueItems?.filter(item => 
        new Date(item.created_at) > new Date(Date.now() - 60000) // Last minute
      ) || [];
      
      console.log(`   📬 Recent queue items: ${recentItems.length}`);
      recentItems.forEach(item => {
        console.log(`      - ${item.status}: ${item.recipient_email} - ${item.subject || 'No subject'}`);
      });

      if (recentItems.length === 0) {
        console.log('   💡 No recent queue items. Email automation might need:');
        console.log('      - Active email templates');
        console.log('      - Active automation rules');
        console.log('      - Properly configured triggers');
      }
    }

    // 5. Force process queue to see if anything happens
    console.log('\n5. Force processing email queue...');
    const processResponse = await fetch(`${BASE_URL}/api/cron/process-email-queue?safe=true&rate=10&retry=true&backfill=true`);
    if (processResponse.ok) {
      const processData = await processResponse.json();
      console.log(`   ✅ Queue processed: ${processData.succeeded || 0} sent, ${processData.failed || 0} failed`);
      
      if (processData.logs?.length > 0) {
        console.log('   📋 Recent processing logs:');
        processData.logs.slice(0, 3).forEach(log => {
          console.log(`      - ${log.status}: ${log.recipient_email || 'no-email'} (${log.reason || 'ok'})`);
        });
      }
    }

    console.log('\n🎉 Quiz completion email test completed!');
    console.log('\n📋 To enable email automation:');
    console.log('   1. Ensure email templates exist for the quiz');
    console.log('   2. Create automation rules with "quiz_complete" trigger');
    console.log('   3. Make sure templates and rules are active');
    console.log('   4. Test with real quiz sessions');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testQuizCompletionEmail();
