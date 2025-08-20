const { emailTrigger } = require('./src/lib/email-automation.ts');

async function testEmailAutomation() {
  try {
    console.log('Testing email automation with fixed prepareVariables...');
    
    const quizId = '01932f60-a30f-7e74-ad76-5adf073c21c9';
    const userEmail = 'test@example.com';
    const userName = 'Test User';
    const sessionId = 'test-session-' + Date.now();
    
    const quizResult = {
      percentage: 75,
      text: 'Magasabb Szintű',
      ai_result: 'Based on your responses, you show signs of higher level ADHD symptoms.'
    };
    
    console.log('Triggering quiz completion with data:', {
      quizId,
      userEmail,
      userName,
      quizResult,
      sessionId
    });
    
    await emailTrigger.triggerQuizCompletion(quizId, userEmail, quizResult, userName, sessionId);
    
    console.log('Email automation triggered successfully!');
    
    // Wait a bit then check the queue
    console.log('Waiting 2 seconds then checking queue...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check queue status
    const response = await fetch(`http://localhost:3000/api/admin/email-queue?quiz_id=${quizId}&limit=5&offset=0`);
    const result = await response.json();
    console.log('Queue status:', JSON.stringify(result, null, 2));
    
    // Process the queue
    console.log('Processing email queue...');
    const processResponse = await fetch('http://localhost:3000/api/cron/process-email-queue');
    const processResult = await processResponse.json();
    console.log('Process result:', JSON.stringify(processResult, null, 2));
    
  } catch (error) {
    console.error('Error in email automation test:', error);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

testEmailAutomation();
