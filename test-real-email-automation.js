#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testRealEmailAutomation() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  const testEmail = 'test@example.com';
  
  console.log('🧪 Testing REAL email automation flow...\n');
  
  try {
    // 1. Check if we have a result template
    const { data: resultTemplate } = await supabase
      .from('email_templates')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('template_type', 'result')
      .eq('is_active', true)
      .single();
    
    if (!resultTemplate) {
      console.log('❌ No active result template found');
      return;
    }
    
    console.log(`✅ Found result template: ${resultTemplate.template_name}`);
    
    // 2. Find the automation rule
    const { data: automationRule } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('rule_type', 'quiz_complete')
      .eq('is_active', true)
      .single();
    
    if (!automationRule) {
      console.log('❌ No active quiz_complete automation rule found');
      return;
    }
    
    console.log(`✅ Found automation rule: ${automationRule.rule_name}`);
    
    // 3. Create a pending email in the queue manually (simulate AI trigger)
    console.log('\n📧 Creating pending email in queue...');
    
    const { randomUUID } = require('crypto');
    const sessionId = randomUUID();
    
    const { data: queueItem, error: queueError } = await supabase
      .from('email_queue')
      .insert([{
        session_id: sessionId,
        template_id: resultTemplate.id,
        automation_rule_id: automationRule.id,
        recipient_email: testEmail,
        recipient_name: 'Test User',
        subject: 'ADHD Gyorsteszt - Test Email',
        status: 'pending',
        scheduled_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (queueError) {
      console.log(`❌ Queue creation failed: ${queueError.message}`);
      return;
    }
    
    console.log(`✅ Created queue item: ${queueItem.id}`);
    
    // 4. Process the queue
    console.log('\n⚡ Processing email queue...');
    
    const processResponse = await fetch('http://localhost:3000/api/cron/process-email-queue?safe=true&rate=5&debug=true');
    
    if (!processResponse.ok) {
      console.log(`❌ Queue processing failed: ${processResponse.status}`);
      return;
    }
    
    const processResult = await processResponse.json();
    console.log(`✅ Queue processing result:`);
    console.log(`   Processed: ${processResult.processed || 0}`);
    console.log(`   Succeeded: ${processResult.succeeded || 0}`);
    console.log(`   Failed: ${processResult.failed || 0}`);
    
    if (processResult.logs && processResult.logs.length > 0) {
      console.log('\n📋 Processing logs:');
      processResult.logs.forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.status}: ${log.recipient_email || 'no-email'} - ${log.reason || 'OK'}`);
      });
    }
    
    // 5. Check final status
    console.log('\n🔍 Checking final queue status...');
    
    const { data: finalQueue } = await supabase
      .from('email_queue')
      .select('*')
      .eq('id', queueItem.id)
      .single();
    
    if (finalQueue) {
      console.log(`   Status: ${finalQueue.status}`);
      console.log(`   Sent at: ${finalQueue.sent_at || 'Not sent'}`);
      console.log(`   Error: ${finalQueue.error_message || 'None'}`);
      console.log(`   Provider response: ${finalQueue.provider_response || 'None'}`);
    }
    
    // 6. If successfully sent, test the auto-cron as well
    if (finalQueue && finalQueue.status === 'sent') {
      console.log('\n🎉 Email automation WORKING! Testing auto-cron...');
      
      const autoCronResponse = await fetch('http://localhost:3000/api/cron/email-auto?debug=true');
      if (autoCronResponse.ok) {
        const autoCronResult = await autoCronResponse.json();
        console.log(`✅ Auto-cron working: processed ${autoCronResult.processed || 0} items`);
      }
    } else {
      console.log('\n⚠️ Email sending failed - check configuration');
    }
    
    console.log('\n📊 Admin panel: http://localhost:3000/admin/email-queue');
    console.log(`🔗 Session ID: ${sessionId}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRealEmailAutomation();
