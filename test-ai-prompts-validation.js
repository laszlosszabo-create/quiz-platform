// Test script to validate the {{questions_and_answers}} variable in AI prompts editor
console.log('🧪 Testing AI prompts editor variable validation...');

// Simulate the validation logic from the AI prompts editor
const REQUIRED_VARIABLES = ['{{scores}}', '{{top_category}}', '{{name}}', '{{questions_and_answers}}'];

function validatePrompt(userPrompt) {
  const errors = [];
  
  // Check for required variables in user prompt
  const missingVars = REQUIRED_VARIABLES.filter(variable => 
    !userPrompt.includes(variable)
  );
  
  if (missingVars.length > 0) {
    errors.push(`Hiányzó kötelező változók: ${missingVars.join(', ')}`);
  }

  // Check for invalid variables (basic check)
  const varMatches = userPrompt.match(/\{\{([^}]+)\}\}/g);
  if (varMatches) {
    const invalidVars = varMatches.filter(variable => 
      !REQUIRED_VARIABLES.includes(variable) && 
      !['{{quiz_title}}', '{{completion_date}}'].includes(variable)
    );
    
    if (invalidVars.length > 0) {
      errors.push(`Ismeretlen változók: ${invalidVars.join(', ')}`);
    }
  }

  return errors;
}

// Test cases
console.log('\n📝 Test Case 1: Valid prompt with questions_and_answers');
const validPrompt = "Szia {{name}}! Az eredmények: {{scores}}, legmagasabb: {{top_category}}. Kérdés-válaszok: {{questions_and_answers}}";
const result1 = validatePrompt(validPrompt);
console.log('Errors:', result1.length > 0 ? result1 : 'None ✅');

console.log('\n📝 Test Case 2: Missing questions_and_answers variable');  
const invalidPrompt = "Szia {{name}}! Az eredmények: {{scores}}, legmagasabb: {{top_category}}.";
const result2 = validatePrompt(invalidPrompt);
console.log('Errors:', result2.length > 0 ? result2 : 'None');

console.log('\n📝 Test Case 3: Unknown variable');
const unknownVarPrompt = "Szia {{name}}! Az eredmények: {{scores}}, legmagasabb: {{top_category}}. Kérdés-válaszok: {{questions_and_answers}}. Ismeretlen: {{unknown_var}}";
const result3 = validatePrompt(unknownVarPrompt);
console.log('Errors:', result3.length > 0 ? result3 : 'None');

console.log('\n🎉 Test completed!');
