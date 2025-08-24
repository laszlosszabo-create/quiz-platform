#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmailData() {
  console.log('📧 Checking all email templates and automation rules...\n');
  
  try {
    // Check templates
    const { data: templates, error: templatesError } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (templatesError) {
      console.log('❌ Templates error:', templatesError.message);
    } else {
      console.log(`📧 Total templates: ${templates.length}`);
      templates.forEach(t => {
        console.log(`   - ${t.template_name} (${t.template_type}) - Quiz: ${t.quiz_id || 'All'} - Active: ${t.is_active}`);
      });
    }
    
    console.log('');
    
    // Check automation rules
    const { data: rules, error: rulesError } = await supabase
      .from('email_automation_rules')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (rulesError) {
      console.log('❌ Rules error:', rulesError.message);
    } else {
      console.log(`🎯 Total automation rules: ${rules.length}`);
      rules.forEach(r => {
        console.log(`   - ${r.rule_name} (${r.rule_type || r.trigger_event}) - Quiz: ${r.quiz_id || 'All'} - Active: ${r.is_active}`);
      });
    }
    
    // Check if tables exist
    console.log('\n🔍 Checking table structure...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['email_templates', 'email_automation_rules']);
    
    if (tablesError) {
      console.log('❌ Table check error:', tablesError.message);
    } else {
      console.log(`📋 Found tables: ${tables.map(t => t.table_name).join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkEmailData();
