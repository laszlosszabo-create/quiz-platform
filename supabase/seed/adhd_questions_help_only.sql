-- Seed: only insert Hungarian help texts for the ADHD quick-check questions
-- Usage: paste into Supabase SQL editor or run with psql against the project DB.

-- Remove any existing help translations for these questions (safe id lookup)
DELETE FROM quiz_translations
WHERE quiz_id = (
  SELECT id FROM quizzes WHERE slug = 'adhd-quick-check' LIMIT 1
)
AND field_key IN (
  'question:q1:help','question:q2:help','question:q3:help','question:q4:help','question:q5:help',
  'question:q6:help','question:q7:help','question:q8:help','question:q9:help','question:q10:help',
  'question:q11:help','question:q12:help','question:q13:help','question:q14:help','question:q15:help'
);

-- Insert only the help texts (Hungarian)
INSERT INTO quiz_translations (quiz_id, lang, field_key, value)
SELECT q.id, v.lang, v.field_key, v.value
FROM (
  VALUES
    ('hu','question:q1:help','Röviden: arra figyelj, mennyire maradsz a tartalomnál megszakítás nélkül; ha gyakran váltasz át más ingerre, jelöld magasabbnak.'),
    ('hu','question:q2:help','Gondold végig az elmúlt 1–2 hónapot: hányszor maradt ki időpont, számla vagy bolt-lista tétel, és ez okozott‑e plusz köröket?'),
    ('hu','question:q3:help','Arra válaszolj, hogy a lelkesedésed milyen gyakran csökken le annyira, hogy félbehagyod; ne az érdektelen kivételekre gondolj, hanem az átlagra.'),
    ('hu','question:q4:help','Számít, hogy a keresgélés rendszeresen késést/idegeskedést okoz‑e; ha csak ritka malőr, alacsonyabb opciót válassz.'),
    ('hu','question:q5:help','Akkor jelölj magasabbat, ha gyakran kell újraolvasnod/‑hallgatnod, mert „nem maradt meg”, nem csak azért, mert bonyolult volt az anyag.'),
    ('hu','question:q6:help','Vedd számba, mennyire átlátható a teendőid rendszere és hányszor csúszol határidőt emiatt, nem külső okból.'),
    ('hu','question:q7:help','Gondolj vissza friss helyzetekre: hányszor szólt közbe az impulzus, és lett belőle kellemetlen következmény?'),
    ('hu','question:q8:help','Válaszd azt, ami a környezeted visszajelzéseivel is egybevág: ha gyakran szólnak, hogy közbevágod, jelöld magasabbnak.'),
    ('hu','question:q9:help','A belső nyugtalanság is számít: ha nem csak mocorogsz, de erős a „felállnék” késztetés, válassz magasabb kategóriát.'),
    ('hu','question:q10:help','Itt azt jelöld, mennyire visszatérő, hogy más szerint nem figyelsz, miközben tényleg próbáltál odafigyelni.'),
    ('hu','question:q11:help','Ne az egyszeri csúszásokra gondolj, hanem arra, mennyire rendszeres az utolsó pillanatos megoldás.'),
    ('hu','question:q12:help','Ha gyakran „kikapcsol” a figyelmed fontos helyzetben, és nehéz visszahozni, jelöld magasabb opciót.'),
    ('hu','question:q13:help','Azt mérd fel, volt‑e ebből tényleges következmény (pl. hiba, konfliktus, értékelésromlás), nem csak apró kényelmetlenség.'),
    ('hu','question:q14:help','Ha az állandó gondolati pörgés zavarja az elalvást vagy a fókuszt, válassz magasabb opciót.'),
    ('hu','question:q15:help','Arra válaszolj, milyen gyakran maradnak befejezetlenül a párhuzamosan indított dolgaid, nem csak néha-néha.')
) AS v(lang, field_key, value)
JOIN quizzes q ON q.slug = 'adhd-quick-check'
;

-- End
