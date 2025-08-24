#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCompleteFlow() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  const testEmail = 'test@example.com';
  
  console.log('🧪 Testing COMPLETE quiz completion flow...\n');
  
  try {
    // 1. Create a proper quiz session
    const { randomUUID } = require('crypto');
    const sessionId = randomUUID();
    
    console.log('1. Creating complete quiz session...');
    
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert([{
        id: sessionId,
        quiz_id: quizId,
        client_token: randomUUID(),
        lang: 'hu',
        user_email: testEmail,
        user_name: 'Test User',
        email: testEmail, // backup email field
        answers: {
          'attention_1': 'Often',
          'attention_2': 'Sometimes',
          'hyperactivity_1': 'Often',
          'hyperactivity_2': 'Rarely',
          'impulsivity_1': 'Sometimes',
          'impulsivity_2': 'Often'
        },
        scores: {
          attention: 4,
          hyperactivity: 3,
          impulsivity: 5
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
    
    console.log(`✅ Session created: ${sessionId}`);
    
    // 2. Call AI generate-result (this should trigger email automation)
    console.log('\n2. Calling AI generate-result (which triggers emails)...');
    
    const aiResponse = await fetch('http://localhost:3000/api/ai/generate-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        quiz_id: quizId,
        lang: 'hu',
        skip_ai_generation: false // Let it generate real AI result
      })
    });
    
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.log(`❌ AI generate-result failed: ${aiResponse.status} - ${errorText}`);
      return;
    }
    
    const aiResult = await aiResponse.json();
    console.log(`✅ AI result generated: ${aiResult.mocked ? 'mocked' : 'real'}`);
    console.log(`   Triggers: ${aiResult.triggers?.length || 0} email automation triggers`);
    
    // 3. Wait a moment for automation to process
    console.log('\n3. Waiting for email automation to process...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 4. Check email queue for this session
    console.log('\n4. Checking email queue...');
    
    const { data: queueItems } = await supabase
      .from('email_queue')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    
    if (!queueItems || queueItems.length === 0) {
      console.log('❌ No emails found in queue for this session');
      console.log('   This means email automation was NOT triggered');
      
      // Check if automation rules exist and are active
      const { data: rules } = await supabase
        .from('email_automation_rules')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('is_active', true);
      
      console.log(`   Active rules: ${rules?.length || 0}`);
      return;
    }
    
    console.log(`✅ Found ${queueItems.length} email(s) in queue:`);
    queueItems.forEach((item, index) => {
      console.log(`   ${index + 1}. Status: ${item.status}, To: ${item.recipient_email}`);
    });
    
    // 5. Process the queue
    console.log('\n5. Processing email queue...');
    
    const processResponse = await fetch('http://localhost:3000/api/cron/process-email-queue?safe=true&rate=10&debug=true');
    
    if (processResponse.ok) {
      const processResult = await processResponse.json();
      console.log(`✅ Queue processing completed:`);
      console.log(`   Processed: ${processResult.processed || 0}`);
      console.log(`   Succeeded: ${processResult.succeeded || 0}`);
      console.log(`   Failed: ${processResult.failed || 0}`);
      
      if (processResult.logs?.length > 0) {
        console.log('\n📋 Processing logs:');
        processResult.logs.forEach((log, index) => {
          console.log(`   ${index + 1}. ${log.status}: ${log.recipient_email || 'no-email'} - ${log.reason || 'OK'}`);
        });
      }
    }
    
    // 6. Check final status
    console.log('\n6. Final email status...');
    
    const { data: finalQueue } = await supabase
      .from('email_queue')
      .select('*')
      .eq('session_id', sessionId);
    
    finalQueue?.forEach((item, index) => {
      console.log(`   Email ${index + 1}:`);
      console.log(`     Status: ${item.status}`);
      console.log(`     Sent: ${item.sent_at || 'Not sent'}`);
      console.log(`     Error: ${item.error_message || 'None'}`);
    });
    
    // 7. Summary
    const sentEmails = finalQueue?.filter(item => item.status === 'sent').length || 0;
    
    if (sentEmails > 0) {
      console.log('\n🎉 EMAIL AUTOMATION IS WORKING!');
      console.log(`   Successfully sent ${sentEmails} email(s)`);
      console.log('\n✅ The quiz completion -> email flow is operational');
    } else {
      console.log('\n⚠️ Email automation triggered but sending failed');
      console.log('   Check Resend API key and configuration');
    }
    
    console.log(`\n📊 Admin panel: http://localhost:3000/admin/email-queue`);
    console.log(`🔗 Test session: ${sessionId}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteFlow();
