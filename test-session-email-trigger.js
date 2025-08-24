#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestSessionAndTriggerEmail() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  
  console.log('🧪 Creating test session and triggering email automation...\n');
  
  try {
    // 1. Create a test session
    console.log('1. Creating test session...');
    const { randomUUID } = require('crypto');
    const sessionId = randomUUID();
    
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert([{
        id: sessionId,
        quiz_id: quizId,
        client_token: randomUUID(),
        lang: 'hu',
        user_email: testEmail,
        user_name: testName,
        current_question: null,
        answers: {
          'q1': 'Never',
          'q2': 'Sometimes', 
          'q3': 'Often'
        },
        scores: {
          attention: 2,
          hyperactivity: 3,
          impulsivity: 4
        },
        product_ai_results: {
          interpretation: 'Test eredmény',
          recommendations: ['Teszt ajánlás 1', 'Teszt ajánlás 2']
        },
        state: 'completed',
        completed_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (sessionError) {
      console.log(`❌ Session creation failed: ${sessionError.message}`);
      return;
    }
    
    console.log(`✅ Session created: ${session.id}`);
    
    // 2. Check what automation rules will be triggered
    console.log('\n2. Checking automation rules...');
    const { data: rules } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('is_active', true);
    
    console.log(`📋 Found ${rules.length} active rules:`);
    rules.forEach(rule => {
      console.log(`   - ${rule.rule_name} (trigger: ${rule.trigger_event})`);
    });
    
    // 3. Manually trigger email generation (simulate what AI result generation does)
    console.log('\n3. Triggering email generation...');
    
    // For each rule that should trigger on quiz_complete
    const completeRules = rules.filter(r => 
      r.rule_type === 'quiz_complete' || 
      r.rule_name.toLowerCase().includes('eredmény')
    );
    
    if (completeRules.length === 0) {
      console.log('⚠️ No quiz_complete rules found');
    } else {
      for (const rule of completeRules) {
        console.log(`   Triggering rule: ${rule.rule_name}`);
        
        // Add to email queue
        const { data: queueItem, error: queueError } = await supabase
          .from('email_queue')
          .insert([{
            session_id: sessionId,
            template_id: rule.email_template_id,
            automation_rule_id: rule.id,
            recipient_email: testEmail,
            recipient_name: testName,
            status: 'pending',
            scheduled_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (queueError) {
          console.log(`   ❌ Queue insertion failed: ${queueError.message}`);
        } else {
          console.log(`   ✅ Added to queue: ${queueItem.id}`);
        }
      }
    }
    
    // 4. Check email queue
    console.log('\n4. Checking email queue...');
    const { data: queueItems } = await supabase
      .from('email_queue')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    
    console.log(`📬 Queue items for this session: ${queueItems?.length || 0}`);
    queueItems?.forEach(item => {
      console.log(`   - ${item.status}: ${item.recipient_email} (template: ${item.template_id})`);
    });
    
    // 5. Process the queue
    if (queueItems && queueItems.length > 0) {
      console.log('\n5. Processing email queue...');
      
      const response = await fetch('http://localhost:3000/api/cron/process-email-queue?safe=true&rate=10&retry=true');
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Queue processed: ${data.succeeded || 0} sent, ${data.failed || 0} failed`);
        
        if (data.logs?.length > 0) {
          console.log('📋 Processing logs:');
          data.logs.forEach(log => {
            console.log(`   - ${log.status}: ${log.recipient_email || 'no-email'} (${log.reason || 'ok'})`);
          });
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Queue processing failed: ${response.status} - ${errorText}`);
      }
      
      // Check final queue status
      console.log('\n6. Final queue status...');
      const { data: finalQueue } = await supabase
        .from('email_queue')
        .select('status, sent_at, error_message')
        .eq('session_id', sessionId);
      
      finalQueue?.forEach((item, index) => {
        console.log(`   Email ${index + 1}: ${item.status}${item.sent_at ? ` (sent: ${item.sent_at})` : ''}${item.error_message ? ` (error: ${item.error_message})` : ''}`);
      });
    } else {
      console.log('⚠️ No queue items to process');
    }
    
    console.log('\n🎉 Test completed!');
    console.log(`📧 Test session: ${sessionId}`);
    console.log(`🔗 Check admin panel: http://localhost:3000/admin/email-queue`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

createTestSessionAndTriggerEmail();
