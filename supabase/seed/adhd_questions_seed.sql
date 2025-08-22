-- Seed script: insert ADHD questions and Hungarian translations
-- Usage: run this in Supabase SQL editor or psql connected to the project DB.
-- It finds the quiz by slug 'adhd-quick-check', deletes existing questions/translations for these keys, then inserts fresh rows.

WITH q AS (
  SELECT id FROM quizzes WHERE slug = 'adhd-quick-check' LIMIT 1
),
del AS (
  DELETE FROM quiz_questions
  WHERE quiz_id IN (SELECT id FROM q)
    AND key IN (
      'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15'
    )
  RETURNING *
),
del_tr AS (
  DELETE FROM quiz_translations
  WHERE quiz_id IN (SELECT id FROM q)
    AND (
      field_key LIKE 'question:q1:%' OR field_key LIKE 'question:q2:%' OR field_key LIKE 'question:q3:%' OR
      field_key LIKE 'question:q4:%' OR field_key LIKE 'question:q5:%' OR field_key LIKE 'question:q6:%' OR
      field_key LIKE 'question:q7:%' OR field_key LIKE 'question:q8:%' OR field_key LIKE 'question:q9:%' OR
      field_key LIKE 'question:q10:%' OR field_key LIKE 'question:q11:%' OR field_key LIKE 'question:q12:%' OR
      field_key LIKE 'question:q13:%' OR field_key LIKE 'question:q14:%' OR field_key LIKE 'question:q15:%' OR
      field_key IN (
        'option:q1_o1:label','option:q1_o2:label','option:q1_o3:label',
        'option:q2_o1:label','option:q2_o2:label','option:q2_o3:label','option:q2_o4:label','option:q2_o5:label',
        'option:q3_o1:label','option:q3_o2:label','option:q3_o3:label','option:q3_o4:label','option:q3_o5:label',
        'option:q4_o1:label','option:q4_o2:label','option:q4_o3:label',
        'option:q5_o1:label','option:q5_o2:label','option:q5_o3:label','option:q5_o4:label','option:q5_o5:label',
        'option:q6_o1:label','option:q6_o2:label','option:q6_o3:label','option:q6_o4:label','option:q6_o5:label',
        'option:q7_o1:label','option:q7_o2:label','option:q7_o3:label',
        'option:q8_o1:label','option:q8_o2:label','option:q8_o3:label','option:q8_o4:label','option:q8_o5:label',
        'option:q9_o1:label','option:q9_o2:label','option:q9_o3:label','option:q9_o4:label','option:q9_o5:label',
        'option:q10_o1:label','option:q10_o2:label','option:q10_o3:label',
        'option:q11_o1:label','option:q11_o2:label','option:q11_o3:label','option:q11_o4:label','option:q11_o5:label',
        'option:q12_o1:label','option:q12_o2:label','option:q12_o3:label','option:q12_o4:label','option:q12_o5:label',
        'option:q13_o1:label','option:q13_o2:label','option:q13_o3:label',
        'option:q14_o1:label','option:q14_o2:label','option:q14_o3:label','option:q14_o4:label','option:q14_o5:label',
        'option:q15_o1:label','option:q15_o2:label','option:q15_o3:label','option:q15_o4:label','option:q15_o5:label'
      )
    )
  RETURNING *
)

-- Insert questions
-- Insert questions
INSERT INTO quiz_questions (quiz_id, key, type, "order", options)
SELECT id, 'q1', 'single'::question_type, 1, '[{"key":"q1_o1","score":0},{"key":"q1_o2","score":1},{"key":"q1_o3","score":2}]'::jsonb FROM q
UNION ALL
SELECT id, 'q2', 'scale'::question_type, 2, '[{"key":"q2_o1","score":0},{"key":"q2_o2","score":1},{"key":"q2_o3","score":2},{"key":"q2_o4","score":3},{"key":"q2_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q3', 'scale'::question_type, 3, '[{"key":"q3_o1","score":0},{"key":"q3_o2","score":1},{"key":"q3_o3","score":2},{"key":"q3_o4","score":3},{"key":"q3_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q4', 'single'::question_type, 4, '[{"key":"q4_o1","score":0},{"key":"q4_o2","score":1},{"key":"q4_o3","score":2}]'::jsonb FROM q
UNION ALL
SELECT id, 'q5', 'scale'::question_type, 5, '[{"key":"q5_o1","score":0},{"key":"q5_o2","score":1},{"key":"q5_o3","score":2},{"key":"q5_o4","score":3},{"key":"q5_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q6', 'scale'::question_type, 6, '[{"key":"q6_o1","score":0},{"key":"q6_o2","score":1},{"key":"q6_o3","score":2},{"key":"q6_o4","score":3},{"key":"q6_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q7', 'single'::question_type, 7, '[{"key":"q7_o1","score":0},{"key":"q7_o2","score":1},{"key":"q7_o3","score":2}]'::jsonb FROM q
UNION ALL
SELECT id, 'q8', 'scale'::question_type, 8, '[{"key":"q8_o1","score":0},{"key":"q8_o2","score":1},{"key":"q8_o3","score":2},{"key":"q8_o4","score":3},{"key":"q8_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q9', 'scale'::question_type, 9, '[{"key":"q9_o1","score":0},{"key":"q9_o2","score":1},{"key":"q9_o3","score":2},{"key":"q9_o4","score":3},{"key":"q9_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q10', 'single'::question_type, 10, '[{"key":"q10_o1","score":0},{"key":"q10_o2","score":1},{"key":"q10_o3","score":2}]'::jsonb FROM q
UNION ALL
SELECT id, 'q11', 'scale'::question_type, 11, '[{"key":"q11_o1","score":0},{"key":"q11_o2","score":1},{"key":"q11_o3","score":2},{"key":"q11_o4","score":3},{"key":"q11_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q12', 'scale'::question_type, 12, '[{"key":"q12_o1","score":0},{"key":"q12_o2","score":1},{"key":"q12_o3","score":2},{"key":"q12_o4","score":3},{"key":"q12_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q13', 'single'::question_type, 13, '[{"key":"q13_o1","score":0},{"key":"q13_o2","score":1},{"key":"q13_o3","score":2}]'::jsonb FROM q
UNION ALL
SELECT id, 'q14', 'scale'::question_type, 14, '[{"key":"q14_o1","score":0},{"key":"q14_o2","score":1},{"key":"q14_o3","score":2},{"key":"q14_o4","score":3},{"key":"q14_o5","score":4}]'::jsonb FROM q
UNION ALL
SELECT id, 'q15', 'scale'::question_type, 15, '[{"key":"q15_o1","score":0},{"key":"q15_o2","score":1},{"key":"q15_o3","score":2},{"key":"q15_o4","score":3},{"key":"q15_o5","score":4}]'::jsonb FROM q;

-- Insert Hungarian translations
INSERT INTO quiz_translations (quiz_id, lang, field_key, value)
SELECT quizzes.id, v.lang, v.field_key, v.value
FROM (
  VALUES
    ('hu','question:q1:text','Ha egy 10 perces videót nézel, mi szokott történni?'),
    ('hu','question:q1:help','Röviden: arra figyelj, mennyire maradsz a tartalomnál megszakítás nélkül; ha gyakran váltasz át más ingerre, jelöld magasabbnak.'),
    ('hu','option:q1_o1:label','Végignézem, simán fókuszban maradok'),
    ('hu','option:q1_o2:label','1-2-szer elkalandozom, de visszajövök'),
    ('hu','option:q1_o3:label','Közben már rá is kattintok másik 2-3 dologra'),

    ('hu','question:q2:text','Találkozók, számlák, „csak beugrom a boltba tejért” – és mi lesz?'),
    ('hu','question:q2:help','Gondold végig az elmúlt 1–2 hónapot: hányszor maradt ki időpont, számla vagy bolt-lista tétel, és ez okozott‑e plusz köröket?'),
    ('hu','option:q2_o1:label','Minden megvan, ritkán hibázok'),
    ('hu','option:q2_o2:label','Néha elfelejtek 1-1 dolgot'),
    ('hu','option:q2_o3:label','Rendszeresen kimarad valami'),
    ('hu','option:q2_o4:label','Gyakran káosz, vissza kell mennem/újraszervezni'),
    ('hu','option:q2_o5:label','Krónikusan elúszom, mások is észreveszik'),

    ('hu','question:q3:text','Milyen gyakran kezdesz bele lelkesen, majd alábbhagy a lendület?'),
    ('hu','question:q3:help','Arra válaszolj, hogy a lelkesedésed milyen gyakran csökken le annyira, hogy félbehagyod; ne az érdektelen kivételekre gondolj, hanem az átlagra.'),
    ('hu','option:q3_o1:label','Szinte soha, amit elkezdek, befejezem'),
    ('hu','option:q3_o2:label','Néha előfordul'),
    ('hu','option:q3_o3:label','Elég gyakran'),
    ('hu','option:q3_o4:label','Rendszeresen több dolog marad félbe'),
    ('hu','option:q3_o5:label','A „félbehagyott projektek” a middle name-em'),

    ('hu','question:q4:text','Kulcs, pénztárca, fülhallgató – hol tartunk?'),
    ('hu','question:q4:help','Számít, hogy a keresgélés rendszeresen késést/idegeskedést okoz‑e; ha csak ritka malőr, alacsonyabb opciót válassz.'),
    ('hu','option:q4_o1:label','Ritkán veszítem el, van rendszerem'),
    ('hu','option:q4_o2:label','Előfordul, keresgélni kell'),
    ('hu','option:q4_o3:label','Gyakran nincs meg, rendszeresen késést okoz'),

    ('hu','question:q5:text','Előfordul, hogy végigolvastál valamit, és nem emlékszel, mi volt benne?'),
    ('hu','question:q5:help','Akkor jelölj magasabbat, ha gyakran kell újraolvasnod/‑hallgatnod, mert „nem maradt meg”, nem csak azért, mert bonyolult volt az anyag.'),
    ('hu','option:q5_o1:label','Nem jellemző'),
    ('hu','option:q5_o2:label','Ritkán'),
    ('hu','option:q5_o3:label','Néha'),
    ('hu','option:q5_o4:label','Gyakran'),
    ('hu','option:q5_o5:label','Szinte mindig újra kell menni'),

    ('hu','question:q6:text','Hogyan menedzseled a feladatlistáidat?'),
    ('hu','question:q6:help','Vedd számba, mennyire átlátható a teendőid rendszere és hányszor csúszol határidőt emiatt, nem külső okból.'),
    ('hu','option:q6_o1:label','Prioritás, határidők, megy a flow'),
    ('hu','option:q6_o2:label','Van rendszer, néha kilóg a lóláb'),
    ('hu','option:q6_o3:label','Próbálkozom, de szétesik időnként'),
    ('hu','option:q6_o4:label','Sokszor túlcsúszok/átlátatlan'),
    ('hu','option:q6_o5:label','Állandó tűzoltás, gyakran kések'),

    ('hu','question:q7:text','Mennyire jellemző, hogy előbb cselekszel/beszélsz, aztán gondolkodsz?'),
    ('hu','question:q7:help','Gondolj vissza friss helyzetekre: hányszor szólt közbe az impulzus, és lett belőle kellemetlen következmény?'),
    ('hu','option:q7_o1:label','Nem jellemző'),
    ('hu','option:q7_o2:label','Néha befigyel, de kezelem'),
    ('hu','option:q7_o3:label','Gyakran, és hoz is kellemetlen helyzeteket'),

    ('hu','question:q8:text','Beszélgetésben mennyire ütsz közbe vagy fejezed be más mondatait?'),
    ('hu','question:q8:help','Válaszd azt, ami a környezeted visszajelzéseivel is egybevág: ha gyakran szólnak, hogy közbevágod, jelöld magasabbnak.'),
    ('hu','option:q8_o1:label','Ritkán, figyelek'),
    ('hu','option:q8_o2:label','Néha belecsúszok'),
    ('hu','option:q8_o3:label','Elég gyakran'),
    ('hu','option:q8_o4:label','Gyakran visszajelzés is érkezik miatta'),
    ('hu','option:q8_o5:label','Szinte mindig, nehéz visszafogni'),

    ('hu','question:q9:text','Hosszabb ülés/meeting alatt…'),
    ('hu','question:q9:help','A belső nyugtalanság is számít: ha nem csak mocorogsz, de erős a „felállnék” késztetés, válassz magasabb kategóriát.'),
    ('hu','option:q9_o1:label','Kényelmesen ülök, jelen vagyok'),
    ('hu','option:q9_o2:label','Néha mocorgok'),
    ('hu','option:q9_o3:label','Elég gyakran fészkelődöm'),
    ('hu','option:q9_o4:label','Rendszeresen felállnék/mozognék'),
    ('hu','option:q9_o5:label','Képtelen vagyok végigülni, muszáj mozdulni'),

    ('hu','question:q10:text','Kaptál már ilyen feedbacket, miközben próbáltál figyelni?'),
    ('hu','question:q10:help','Itt azt jelöld, mennyire visszatérő, hogy más szerint nem figyelsz, miközben tényleg próbáltál odafigyelni.'),
    ('hu','option:q10_o1:label','Nem'),
    ('hu','option:q10_o2:label','Ritkán'),
    ('hu','option:q10_o3:label','Igen, visszatérően'),

    ('hu','question:q11:text','Feladatok az utolsó pillanatban?'),
    ('hu','question:q11:help','Ne az egyszeri csúszásokra gondolj, hanem arra, mennyire rendszeres az utolsó pillanatos megoldás.'),
    ('hu','option:q11_o1:label','Általában időben megcsinálom'),
    ('hu','option:q11_o2:label','Néha csúszik a vége'),
    ('hu','option:q11_o3:label','Elég gyakran a határidő hajrájában végzem'),
    ('hu','option:q11_o4:label','Gyakran túl későn kezdek neki'),
    ('hu','option:q11_o5:label','Krónikus határidő-szlalom'),

    ('hu','question:q12:text','Fontos helyzetben (meeting, tanulás) hová vándorol a figyelem?'),
    ('hu','question:q12:help','Ha gyakran „kikapcsol” a figyelmed fontos helyzetben, és nehéz visszahozni, jelöld magasabb opciót.'),
    ('hu','option:q12_o1:label','Marad a témán'),
    ('hu','option:q12_o2:label','Néha elkalandozik, de visszahozom'),
    ('hu','option:q12_o3:label','Gyakran elúszom'),
    ('hu','option:q12_o4:label','Sokszor kell visszarántani'),
    ('hu','option:q12_o5:label','Folyton más csatornán megyem fejben'),

    ('hu','question:q13:text','Volt ebből kézzelfogható gond (munka/iskola/kapcsolatok)?'),
    ('hu','question:q13:help','Azt mérd fel, volt‑e ebből tényleges következmény (pl. hiba, konfliktus, értékelésromlás), nem csak apró kényelmetlenség.'),
    ('hu','option:q13_o1:label','Nem igazán'),
    ('hu','option:q13_o2:label','Kisebb zökkenők voltak'),
    ('hu','option:q13_o3:label','Igen, érdemi problémákat okozott'),

    ('hu','question:q14:text','Mennyire érzed, hogy az agyad állandóan pörög, nehéz leállítani?'),
    ('hu','question:q14:help','Ha az állandó gondolati pörgés zavarja az elalvást vagy a fókuszt, válassz magasabb opciót.'),
    ('hu','option:q14_o1:label','Ritkán'),
    ('hu','option:q14_o2:label','Néha'),
    ('hu','option:q14_o3:label','Elég gyakran'),
    ('hu','option:q14_o4:label','Gyakran, zavaróan'),
    ('hu','option:q14_o5:label','Szinte mindig, kikapcsolni nehéz'),

    ('hu','question:q15:text','Belekapsz több dologba, de a lezárás nehéz?'),
    ('hu','question:q15:help','Arra válaszolj, milyen gyakran maradnak befejezetlenül a párhuzamosan indított dolgaid, nem csak néha-néha.'),
    ('hu','option:q15_o1:label','Nem jellemző, sorban haladok'),
    ('hu','option:q15_o2:label','Néha előfordul'),
    ('hu','option:q15_o3:label','Elég gyakran'),
    ('hu','option:q15_o4:label','Gyakran, rendezetlen marad'),
    ('hu','option:q15_o5:label','Szinte mindig szétszóródik')
  ) AS v(lang, field_key, value)
  JOIN quizzes ON quizzes.slug = 'adhd-quick-check'
;

-- End of seed
