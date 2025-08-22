const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.log('URL:', supabaseUrl ? 'present' : 'missing');
  console.log('Key:', supabaseKey ? 'present' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuizData() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  
  console.log('🔍 Checking quiz data...');
  
  // Check quiz exists
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
    
  console.log('\n📝 Quiz info:');
  if (quizError) {
    console.error('Quiz error:', quizError);
  } else {
    console.log('Quiz found:', quiz);
  }
  
  // Check questions - first get schema
  const { data: questionsSchema, error: schemaError } = await supabase
    .from('quiz_questions')
    .select('*')
    .limit(1);
    
  console.log('\n🗄️ Questions table schema (first row):');
  if (schemaError) {
    console.error('Schema error:', schemaError);
  } else if (questionsSchema && questionsSchema.length > 0) {
    console.log('Available columns:', Object.keys(questionsSchema[0]));
    console.log('First question data:', questionsSchema[0]);
  } else {
    console.log('No questions in table to determine schema');
  }
  
  // Check questions
  const { data: questions, error: questionsError, count } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact' })
    .eq('quiz_id', quizId);
    
  console.log('\n❓ Questions info:');
  console.log('Questions count:', count || 0);
  
  if (questionsError) {
    console.error('Questions error:', questionsError);
  } else if (questions && questions.length > 0) {
    console.log('First question:', questions[0]);
    console.log('Last question:', questions[questions.length - 1]);
  } else {
    console.log('No questions found for this quiz!');
    
    // Check if there are questions in other quizzes
    const { count: totalQuestions } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true });
      
    console.log('Total questions in all quizzes:', totalQuestions);
    
    // List all quizzes with question counts
    const { data: allQuizzes } = await supabase
      .from('quizzes')
      .select('*');
      
    console.log('\n📋 All quizzes:');
    if (allQuizzes) {
      allQuizzes.forEach(q => {
        console.log(`- ${q.slug} (ID: ${q.id})`);
      });
    }
  }
  
  // Check sessions for this quiz
  const { data: sessions, count: sessionCount } = await supabase
    .from('quiz_sessions')
    .select('id, state, answers', { count: 'exact' })
    .eq('quiz_id', quizId)
    .limit(3);
    
  console.log('\n🔗 Recent sessions:', sessionCount || 0);
  if (sessions) {
    sessions.forEach(s => {
      const answerCount = Object.keys(s.answers || {}).length;
      console.log(`- ${s.id}: ${s.state} (${answerCount} answers)`);
    });
  }
}

checkQuizData().catch(console.error);
