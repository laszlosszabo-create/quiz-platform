// Quick test script to trigger email with proper variables
const { emailTrigger } = require('./src/lib/email-automation.ts');

async function testEmailVariables() {
  try {
    await emailTrigger.triggerQuizCompletion(
      'c54e0ded-edc8-4c43-8e16-ecb6e33f5291', // quiz_id
      'laszlo.s.szabo@ecomxpert.hu', // email
      {
        percentage: 75,
        text: 'Középszintű ADHD kockázat',
        ai_result: 'Test AI result content'
      },
      'László Szabó', // userName
      'test-session-' + Date.now() // sessionId
    );
    
    console.log('✅ Email trigger completed successfully');
  } catch (error) {
    console.error('❌ Email trigger failed:', error);
  }
}

testEmailVariables();
