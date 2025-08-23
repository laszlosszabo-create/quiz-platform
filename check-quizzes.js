const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gkmeqvuahoyuxexoohmy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbWVxdnVhaG95dXhleG9vaG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ3MzM1NiwiZXhwIjoyMDcwMDQ5MzU2fQ._O7I2G5Ge7y6Q4uKT5-T7SyP1O_TJtsCcuGBiqT4Res'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkQuizzes() {
  try {
    console.log('🔍 Ellenőrizzük a quizzes táblát...')
    
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Hiba:', error)
      return
    }

    console.log(`✅ Talált kvízek (${quizzes.length} db):`)
    if (quizzes.length > 0) {
      console.log('📋 Első kvíz oszlopai:', Object.keys(quizzes[0]))
    }
    quizzes.forEach(quiz => {
      console.log(`  - ID: ${quiz.id}, Slug: "${quiz.slug}", Státusz: ${quiz.status}`)
    })

    // Konkrétan keressük az adhd-quick-check-et
    const adhdQuiz = quizzes.find(q => q.slug === 'adhd-quick-check')
    if (adhdQuiz) {
      console.log('\n🎯 ADHD kvíz megtalálva!')
      console.log('   ', adhdQuiz)
    } else {
      console.log('\n❌ ADHD kvíz (adhd-quick-check slug) nem található!')
    }

  } catch (err) {
    console.error('❌ Váratlan hiba:', err)
  }
}

checkQuizzes()
