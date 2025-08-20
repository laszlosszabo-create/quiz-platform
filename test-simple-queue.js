// Simple test to manually queue an email and process it
async function testEmailQueueing() {
  try {
    console.log('1. Creating a manual email queue entry...');
    
    // First, let's manually insert an email into the queue using raw SQL approach
    const queueData = {
      template_id: 'quiz-result-template-id', // We'll need to get this
      recipient_email: 'test@example.com',
      variables: {
        quiz_title: 'ADHD Gyorsteszt',
        percentage: '75',
        score: '15',
        category: 'Magasabb Szintű',
        recipient_name: 'Test User',
        quiz_date: new Date().toLocaleDateString('hu-HU')
      },
      status: 'pending',
      priority: 1,
      scheduled_for: new Date().toISOString()
    };
    
    console.log('Queue data:', JSON.stringify(queueData, null, 2));
    
    // Try to queue via curl to the queue endpoint
    console.log('2. Attempting to queue email...');
    
    const response = await fetch('http://localhost:3000/api/admin/email-queue?quiz_id=01932f60-a30f-7e74-ad76-5adf073c21c9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queueData)
    });
    
    const result = await response.text();
    console.log('Queue response:', result);
    
    // Now try to process the queue
    console.log('3. Processing email queue...');
    
    const processResponse = await fetch('http://localhost:3000/api/cron/process-email-queue');
    const processResult = await processResponse.text();
    console.log('Process result:', processResult);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmailQueueing();
