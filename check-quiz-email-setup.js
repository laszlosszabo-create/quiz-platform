#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkQuizzesAndSetupEmail() {
  console.log('🧪 Checking quiz setup and email configuration...\n');
  
  try {
    // Check all quizzes
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, slug, status')
      .order('created_at', { ascending: false });
    
    if (quizzesError) {
      console.log('❌ Quizzes error:', quizzesError.message);
      return;
    }
    
    console.log(`📋 Total quizzes: ${quizzes.length}`);
    quizzes.forEach(q => {
      console.log(`   - ${q.slug} (${q.id}) - Status: ${q.status}`);
    });
    
    if (quizzes.length === 0) {
      console.log('❌ No quizzes found!');
      return;
    }
    
    // Get the first active quiz
    const activeQuiz = quizzes.find(q => q.status === 'published') || quizzes[0];
    console.log(`\n🎯 Using quiz: ${activeQuiz.slug} (${activeQuiz.id})`);
    
    // Check if this quiz has email setup
    const { data: templates } = await supabase
      .from('email_templates')
      .select('*')
      .eq('quiz_id', activeQuiz.id)
      .eq('is_active', true);
    
    const { data: rules } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('quiz_id', activeQuiz.id)
      .eq('is_active', true);
    
    console.log(`📧 Active templates for this quiz: ${templates?.length || 0}`);
    console.log(`🎯 Active rules for this quiz: ${rules?.length || 0}`);
    
    if ((templates?.length || 0) === 0 || (rules?.length || 0) === 0) {
      console.log('\n⚠️ This quiz needs email setup! Creating basic configuration...\n');
      
      // Get quiz with template ID
      const hasTemplateWithId = quizzes.find(q => 
        q.id === 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'
      );
      
      if (hasTemplateWithId) {
        console.log(`✅ Found quiz with existing email setup: ${hasTemplateWithId.slug}`);
        console.log('📝 To test email automation, use this quiz ID in your tests.');
        console.log(`   Quiz ID: ${hasTemplateWithId.id}`);
        
        // Check this quiz's templates and rules details
        const { data: existingTemplates } = await supabase
          .from('email_templates')
          .select('template_name, template_type, is_active')
          .eq('quiz_id', hasTemplateWithId.id);
          
        const { data: existingRules } = await supabase
          .from('email_automation_rules')
          .select('rule_name, trigger_event, is_active')
          .eq('quiz_id', hasTemplateWithId.id);
        
        console.log('\n📧 Available templates:');
        existingTemplates?.forEach(t => {
          console.log(`   - ${t.template_name} (${t.template_type}) - Active: ${t.is_active}`);
        });
        
        console.log('\n🎯 Available rules:');
        existingRules?.forEach(r => {
          console.log(`   - ${r.rule_name} (${r.trigger_event}) - Active: ${r.is_active}`);
        });
        
        // Test with this quiz
        console.log(`\n🧪 Testing email automation with correct quiz ID...`);
        await testEmailAutomation(hasTemplateWithId.id);
      } else {
        console.log('❌ No quiz found with existing email configuration');
        console.log('💡 You need to either:');
        console.log('   1. Create email templates and rules for an existing quiz');
        console.log('   2. Or use the admin panel to set up email automation');
      }
    } else {
      console.log('\n✅ This quiz has email configuration!');
      await testEmailAutomation(activeQuiz.id);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testEmailAutomation(quizId) {
  console.log(`\n🚀 Testing email automation for quiz: ${quizId}`);
  
  try {
    // Test the auto-cron endpoint that should trigger emails
    const response = await fetch(`http://localhost:3000/api/cron/email-auto?quiz_id=${quizId}&debug=true`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Email automation test successful');
      console.log(`   Processed: ${data.processed || 0} emails`);
      console.log(`   Success: ${data.success || 0}`);
      console.log(`   Failed: ${data.failed || 0}`);
      
      if (data.logs?.length > 0) {
        console.log('📋 Processing logs:');
        data.logs.slice(0, 3).forEach(log => {
          console.log(`   - ${log.status}: ${log.message || 'OK'}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Email automation test failed: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.log(`❌ Email automation test error: ${error.message}`);
  }
}

checkQuizzesAndSetupEmail();
