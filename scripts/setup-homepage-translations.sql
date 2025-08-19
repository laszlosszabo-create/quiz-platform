-- Homepage Quiz and Translations Setup
-- Create homepage quiz entry
INSERT INTO quizzes (id, slug, status, default_lang, feature_flags, theme, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'homepage',
  'active', 
  'hu',
  '{"layout_version": 1}',
  '{"primary_color": "#3B82F6", "secondary_color": "#10B981"}',
  now(),
  now()
);

-- Get the homepage quiz ID for translations
WITH homepage_quiz AS (
  SELECT id FROM quizzes WHERE slug = 'homepage'
)
INSERT INTO quiz_translations (id, quiz_id, lang, field_key, value, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  homepage_quiz.id,
  lang,
  field_key,
  value,
  now(),
  now()
FROM homepage_quiz,
(VALUES
  -- Hungarian translations
  ('hu', 'homepage_title', 'Quiz Platform MVP'),
  ('hu', 'homepage_subtitle', 'Többnyelvű quiz platform AI-alapú eredményekkel'),
  ('hu', 'homepage_status_title', 'Fejlesztési Állapot'),
  ('hu', 'homepage_status_text', 'A projekt alapvető szerkezete elkészült. Készen áll a modulok fejlesztésére.'),
  ('hu', 'homepage_quiz_section_title', 'Elérhető Quiz-ek'),
  ('hu', 'homepage_quiz_description', 'Próbáld ki a platform funkcióit az alábbi quiz-ekkel:'),
  ('hu', 'homepage_adhd_title', 'ADHD Gyorsteszt'),
  ('hu', 'homepage_adhd_description', 'Tudományosan megalapozott ADHD felmérés 5 perc alatt'),
  ('hu', 'homepage_adhd_cta', 'Teszt indítása'),
  ('hu', 'homepage_footer_text', 'Modern quiz platform fejlett funkciókkal'),
  
  -- English translations  
  ('en', 'homepage_title', 'Quiz Platform MVP'),
  ('en', 'homepage_subtitle', 'Multi-language quiz platform with AI-powered results'),
  ('en', 'homepage_status_title', 'Development Status'),
  ('en', 'homepage_status_text', 'Project scaffolding complete. Ready for module development.'),
  ('en', 'homepage_quiz_section_title', 'Available Quizzes'),
  ('en', 'homepage_quiz_description', 'Try out the platform features with these quizzes:'),
  ('en', 'homepage_adhd_title', 'ADHD Quick Check'),
  ('en', 'homepage_adhd_description', 'Scientifically-based ADHD assessment in 5 minutes'),
  ('en', 'homepage_adhd_cta', 'Start Assessment'),
  ('en', 'homepage_footer_text', 'Modern quiz platform with advanced features')
) AS translations(lang, field_key, value);

-- Verify the insert
SELECT 
  q.slug,
  qt.lang,
  qt.field_key,
  qt.value
FROM quizzes q
JOIN quiz_translations qt ON q.id = qt.quiz_id
WHERE q.slug = 'homepage'
ORDER BY qt.lang, qt.field_key;
