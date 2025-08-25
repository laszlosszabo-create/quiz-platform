-- Insert placeholder translations for missing product result keys
-- Adjust default_lang if different
WITH base AS (
  SELECT 'hu'::text AS lang, t.key AS field_key, t.val AS value FROM (VALUES
    ('result_title','Eredmény'),
    ('purchase_success_title','Sikeres vásárlás'),
    ('purchase_success_message','Köszönjük a vásárlást!'),
    ('your_analysis','Elemzés'),
    ('book_consultation','Konzultáció foglalás'),
    ('download_materials','Anyagok letöltése'),
    ('access_granted','Hozzáférés aktiválva')
  ) AS t(key,val)
)
INSERT INTO quiz_translations (quiz_id, lang, field_key, value)
SELECT q.id, b.lang, b.field_key, b.value
FROM quizzes q
CROSS JOIN base b
ON CONFLICT (quiz_id, lang, field_key) DO NOTHING;
