#!/usr/bin/env node
// Simple test for email queue management

const BASE_URL = 'http://localhost:3000';

async function testEmailQueue() {
  console.log('🧪 Testing email queue management...\n');

  try {
    // 1. Test email queue API
    console.log('1. Testing email queue API...');
    const testQuizId = '01932f60-a30f-7e74-ad76-5adf073c21c9'; // Use existing quiz
    
    const queueResponse = await fetch(`${BASE_URL}/api/admin/email-queue?quiz_id=${testQuizId}&limit=10`);
    if (queueResponse.ok) {
      const queueData = await queueResponse.json();
      console.log(`   ✅ Queue API working - ${queueData.queueItems?.length || 0} items found`);
      
      // Show some stats
      const stats = { pending: 0, sent: 0, failed: 0, cancelled: 0 };
      queueData.queueItems?.forEach(item => {
        stats[item.status] = (stats[item.status] || 0) + 1;
      });
      console.log(`   📊 Stats:`, stats);
    } else {
      console.log(`   ❌ Queue API failed: ${queueResponse.status}`);
    }

    // 2. Test quizzes API (needed for dashboard dropdown)
    console.log('\n2. Testing quizzes API...');
    const quizzesResponse = await fetch(`${BASE_URL}/api/admin/quizzes`);
    if (quizzesResponse.ok) {
      const quizzesData = await quizzesResponse.json();
      console.log(`   ✅ Quizzes API working - ${quizzesData.quizzes?.length || 0} quizzes found`);
      if (quizzesData.quizzes?.length > 0) {
        console.log(`   📝 First quiz: ${quizzesData.quizzes[0].name || quizzesData.quizzes[0].slug}`);
      }
    } else {
      console.log(`   ❌ Quizzes API failed: ${quizzesResponse.status}`);
    }

    // 3. Test email queue processor
    console.log('\n3. Testing email queue processor...');
    const processResponse = await fetch(`${BASE_URL}/api/cron/process-email-queue?safe=true&rate=5`);
    if (processResponse.ok) {
      const processData = await processResponse.json();
      console.log(`   ✅ Queue processor working`);
      console.log(`   📈 Result: ${processData.succeeded || 0} sent, ${processData.failed || 0} failed, ${processData.skipped || 0} skipped`);
    } else {
      console.log(`   ❌ Queue processor failed: ${processResponse.status}`);
    }

    // 4. Test auto cron endpoint
    console.log('\n4. Testing auto cron endpoint...');
    const cronResponse = await fetch(`${BASE_URL}/api/cron/email-auto`, {
      headers: {
        'Authorization': process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : undefined
      }
    });
    if (cronResponse.ok) {
      const cronData = await cronResponse.json();
      console.log(`   ✅ Auto cron working`);
      console.log(`   🤖 Message: ${cronData.message}`);
    } else {
      console.log(`   ❌ Auto cron failed: ${cronResponse.status}`);
    }

    console.log('\n🎉 Email queue management test completed!');
    console.log('\n📋 Next steps:');
    console.log('   • Visit http://localhost:3000/admin/email-queue to see the dashboard');
    console.log('   • Set up a cron job to call /api/cron/email-auto every 5-10 minutes');
    console.log('   • Test force sending emails from the dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmailQueue();
