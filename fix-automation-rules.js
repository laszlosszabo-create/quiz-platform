#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAutomationRules() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  
  console.log('🔧 Fixing automation rules...\n');
  
  try {
    // Get templates
    const { data: templates } = await supabase
      .from('email_templates')
      .select('id, template_name, template_type')
      .eq('quiz_id', quizId)
      .eq('is_active', true);
    
    console.log('📧 Available templates:');
    templates.forEach(t => {
      console.log(`   - ${t.template_name} (${t.template_type}): ${t.id}`);
    });
    
    // Find result template
    const resultTemplate = templates.find(t => 
      t.template_type === 'result' || 
      t.template_name.toLowerCase().includes('eredmény')
    );
    
    // Find purchase template
    const purchaseTemplate = templates.find(t => 
      t.template_type === 'purchase' || 
      t.template_name.toLowerCase().includes('vásárlás')
    );
    
    if (!resultTemplate || !purchaseTemplate) {
      console.log('❌ Could not find required templates');
      return;
    }
    
    console.log(`\n🎯 Result template: ${resultTemplate.id}`);
    console.log(`💰 Purchase template: ${purchaseTemplate.id}`);
    
    // Update automation rules
    console.log('\n🔧 Updating automation rules...');
    
    // Fix "eredmény" rule
    const { data: resultRule, error: resultError } = await supabase
      .from('email_automation_rules')
      .update({
        email_template_id: resultTemplate.id,
        rule_type: 'quiz_complete'
      })
      .eq('quiz_id', quizId)
      .eq('rule_name', 'eredmény')
      .select()
      .single();
    
    if (resultError) {
      console.log(`❌ Result rule update failed: ${resultError.message}`);
    } else {
      console.log(`✅ Updated result rule: ${resultRule.rule_name}`);
    }
    
    // Fix "Vásárlás" rule
    const { data: purchaseRule, error: purchaseError } = await supabase
      .from('email_automation_rules')
      .update({
        email_template_id: purchaseTemplate.id,
        rule_type: 'purchase_complete'
      })
      .eq('quiz_id', quizId)
      .eq('rule_name', 'Vásárlás')
      .select()
      .single();
    
    if (purchaseError) {
      console.log(`❌ Purchase rule update failed: ${purchaseError.message}`);
    } else {
      console.log(`✅ Updated purchase rule: ${purchaseRule.rule_name}`);
    }
    
    // Verify updates
    console.log('\n✅ Verification...');
    const { data: updatedRules } = await supabase
      .from('email_automation_rules')
      .select('*')
      .eq('quiz_id', quizId);
    
    updatedRules.forEach(rule => {
      console.log(`   - ${rule.rule_name}: email_template_id=${rule.email_template_id}, rule_type=${rule.rule_type}`);
    });
    
    console.log('\n🎉 Automation rules fixed!');
    console.log('📧 Email automation should now work for quiz completion.');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixAutomationRules();
