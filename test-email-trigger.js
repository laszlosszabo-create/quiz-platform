const { triggerQuizCompletion } = require('./src/lib/email-automation.ts');

async function testEmailTrigger() {
  try {
    console.log('Testing email trigger with quiz result...');
    
    // Simulate quiz completion data with all required fields
    const quizResult = {
      id: 'test-result-id',
      session_id: 'test-session-' + Date.now(),
      quiz_id: '01932f60-a30f-7e74-ad76-5adf073c21c9',
      email: 'test@example.com',
      responses: ["A", "A", "A", "A", "A"],
      score: 15,
      percentage: 75,
      category: "Magasabb Szintű",
      recommendations: "Test recommendations",
      language: 'hu',
      created_at: new Date().toISOString()
    };
    
    console.log('Quiz result data:', JSON.stringify(quizResult, null, 2));
    
    // Trigger email automation
    const result = await triggerQuizCompletion(quizResult);
    
    console.log('Email trigger result:', result);
    
  } catch (error) {
    console.error('Error testing email trigger:', error);
  }
}

testEmailTrigger();
