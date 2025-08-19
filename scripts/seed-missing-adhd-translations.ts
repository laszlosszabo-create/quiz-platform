import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedMissingTranslations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Get ADHD quiz ID
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, slug')
    .eq('slug', 'adhd-quick-check')
    .single();

  if (quizError) {
    console.error('Quiz not found:', quizError);
    return;
  }

  console.log('Found quiz:', quiz);

  // Comprehensive translation data - Hungarian and English
  const translations = [
    // Statistics Section
    { key: 'landing_stats_title', hu: 'A számok magukért beszélnek', en: 'The numbers speak for themselves' },
    { key: 'landing_stats_desc', hu: 'Ezrek már kipróbálták platformunkat és találtak választ kérdéseikre', en: 'Thousands have already tried our platform and found answers to their questions' },
    { key: 'landing_stat_1_number', hu: '15,000+', en: '15,000+' },
    { key: 'landing_stat_1_label', hu: 'kitöltött teszt', en: 'completed tests' },
    { key: 'landing_stat_2_number', hu: '94%', en: '94%' },
    { key: 'landing_stat_2_label', hu: 'elégedettség', en: 'satisfaction rate' },
    { key: 'landing_stat_3_number', hu: '2 perc', en: '2 minutes' },
    { key: 'landing_stat_3_label', hu: 'átlagos kitöltés', en: 'average completion' },
    { key: 'landing_stat_4_number', hu: '98%', en: '98%' },
    { key: 'landing_stat_4_label', hu: 'pontosság', en: 'accuracy rate' },

    // Trust Section
    { key: 'landing_trust_section_title', hu: 'Miért válaszd ezt a tesztet?', en: 'Why choose this assessment?' },
    { key: 'landing_trust_section_desc', hu: 'Tudományosan megalapozott módszertan professzionális megközelítéssel', en: 'Scientifically-based methodology with professional approach' },
    { key: 'landing_trust_item_1_title', hu: 'Tudományos alapok', en: 'Scientific Foundation' },
    { key: 'landing_trust_item_1_desc', hu: 'Validált kérdőívek és kutatási eredmények alapján készült', en: 'Based on validated questionnaires and research findings' },
    { key: 'landing_trust_item_2_title', hu: 'Személyre szabott', en: 'Personalized Results' },
    { key: 'landing_trust_item_2_desc', hu: 'Minden eredmény egyedi, a te válaszaid alapján készül', en: 'Every result is unique, created based on your responses' },
    { key: 'landing_trust_item_3_title', hu: 'Azonnali eredmény', en: 'Instant Results' },
    { key: 'landing_trust_item_3_desc', hu: 'Rögtön a teszt befejezése után megkapod a részletes elemzést', en: 'Get detailed analysis immediately after completing the test' },

    // How it Works Section
    { key: 'landing_how_section_title', hu: 'Hogyan működik?', en: 'How does it work?' },
    { key: 'landing_how_section_desc', hu: 'Egyszerű 3-lépéses folyamat a pontos eredményért', en: 'Simple 3-step process for accurate results' },
    { key: 'landing_how_1_title', hu: 'Válaszolj a kérdésekre', en: 'Answer the questions' },
    { key: 'landing_how_1_desc', hu: 'Rövid kérdések az ADHD tünetekről és mindenapi tapasztalatokról', en: 'Short questions about ADHD symptoms and daily experiences' },
    { key: 'landing_how_2_title', hu: 'AI elemzés', en: 'AI Analysis' },
    { key: 'landing_how_2_desc', hu: 'Fejlett algoritmus értékeli ki a válaszaidat tudományos módszerekkel', en: 'Advanced algorithm evaluates your answers using scientific methods' },
    { key: 'landing_how_3_title', hu: 'Személyre szabott eredmény', en: 'Personalized Results' },
    { key: 'landing_how_3_desc', hu: 'Részletes jelentés javaslatokkal és következő lépésekkel', en: 'Detailed report with recommendations and next steps' },

    // Expectations Section
    { key: 'landing_expect_title', hu: 'Mire számíthatsz?', en: 'What to expect?' },
    { key: 'landing_expect_desc', hu: 'A teszt befejezése után részletes betekintést kapsz', en: 'After completing the test, you will get detailed insights' },
    { key: 'landing_expect_1_title', hu: 'ADHD valószínűség', en: 'ADHD Probability' },
    { key: 'landing_expect_1_desc', hu: 'Százalékos eredmény az ADHD tünetek jelenlétéről', en: 'Percentage result about the presence of ADHD symptoms' },
    { key: 'landing_expect_2_title', hu: 'Területenkénti bontás', en: 'Area-specific breakdown' },
    { key: 'landing_expect_2_desc', hu: 'Figyelemzavar, hiperaktivitás és impulzivitás külön értékelése', en: 'Separate evaluation of inattention, hyperactivity and impulsivity' },
    { key: 'landing_expect_3_title', hu: 'Személyre szabott javaslatok', en: 'Personalized recommendations' },
    { key: 'landing_expect_3_desc', hu: 'Konkrét tippek és következő lépések az eredmények alapján', en: 'Specific tips and next steps based on your results' },
    { key: 'landing_expect_4_title', hu: 'Szakmai támogatás', en: 'Professional support' },
    { key: 'landing_expect_4_desc', hu: 'Opcionális konzultációs lehetőség szakemberekkel', en: 'Optional consultation opportunities with professionals' },

    // Urgency Section
    { key: 'landing_urgency_title', hu: 'Miért most?', en: 'Why now?' },
    { key: 'landing_urgency_desc', hu: 'Az ADHD felismerése életminőség-javulást hozhat minden területen', en: 'Recognizing ADHD can bring quality of life improvements in all areas' },
    { key: 'landing_urgency_point_1', hu: 'Korai felismerés segíthet a mindenapi kihívások kezelésében', en: 'Early recognition can help manage daily challenges' },
    { key: 'landing_urgency_point_2', hu: 'Tudatos megközelítéssel javítható a koncentráció és produktivitás', en: 'Conscious approach can improve concentration and productivity' },
    { key: 'landing_urgency_point_3', hu: 'Megfelelő stratégiákkal csökkenthető a stressz és szorongás', en: 'With proper strategies, stress and anxiety can be reduced' },

    // Guarantees Section
    { key: 'landing_guarantee_title', hu: 'Garanciáink', en: 'Our guarantees' },
    { key: 'landing_guarantee_1', hu: '100% bizalmas és anonim adatkezelés', en: '100% confidential and anonymous data handling' },
    { key: 'landing_guarantee_2', hu: 'Tudományosan validált kérdések és módszertan', en: 'Scientifically validated questions and methodology' },
    { key: 'landing_guarantee_3', hu: 'Azonnali eredmény, nincs várakozás', en: 'Instant results, no waiting time' },
    { key: 'landing_guarantee_4', hu: 'Ingyenes teszt, rejtett költségek nélkül', en: 'Free assessment, no hidden costs' },

    // FAQ Section 
    { key: 'landing_faq_section_title', hu: 'Gyakori kérdések', en: 'Frequently Asked Questions' },
    { key: 'landing_faq_4_q', hu: 'Mennyire pontos a teszt?', en: 'How accurate is the test?' },
    { key: 'landing_faq_4_a', hu: 'A teszt validált kérdőíveken alapul, de nem helyettesít szakorvosi diagnózist. Iránymutatásként szolgál.', en: 'The test is based on validated questionnaires but does not replace medical diagnosis. It serves as guidance.' },
    { key: 'landing_faq_5_q', hu: 'Mit csinálunk az adataimmal?', en: 'What do we do with your data?' },
    { key: 'landing_faq_5_a', hu: 'Az adatokat biztonságosan kezeljük, nem adjuk át harmadik félnek. Csak a teszt eredmény generálásához használjuk.', en: 'We handle data securely, do not share with third parties. We only use it to generate test results.' },
    { key: 'landing_faq_6_q', hu: 'Kaphatok szakmai segítséget?', en: 'Can I get professional help?' },
    { key: 'landing_faq_6_a', hu: 'Az eredmények után opcionálisan ajánlunk szakembereket, akik további segítséget tudnak nyújtani.', en: 'After the results, we optionally recommend professionals who can provide further assistance.' },

    // Medical Disclaimer
    { key: 'landing_medical_title', hu: 'Fontos tudnivalók', en: 'Important information' },
    { key: 'landing_medical_point_1', hu: 'Ez a teszt nem orvosi diagnózis, csak tájékoztató jellegű', en: 'This test is not a medical diagnosis, it is informational only' },
    { key: 'landing_medical_point_2', hu: 'Szakorvosi konzultáció szükséges a pontos diagnózishoz', en: 'Medical consultation is required for accurate diagnosis' },
    { key: 'landing_medical_point_3', hu: 'Az eredmények személyes tapasztalatok alapján értelmezendők', en: 'Results should be interpreted based on personal experiences' },
    { key: 'landing_medical_point_4', hu: 'Sürgős esetben kérjük forduljon orvoshoz azonnal', en: 'In urgent cases, please consult a doctor immediately' },

    // Privacy Section
    { key: 'landing_privacy_title', hu: 'Adatvédelem és biztonság', en: 'Privacy and security' },
    { key: 'landing_privacy_desc', hu: 'Az adataidat a legmagasabb biztonsági standardok szerint védlünk', en: 'We protect your data according to the highest security standards' },
    { key: 'landing_privacy_point_1', hu: 'Titkosított adattárolás és átvitel', en: 'Encrypted data storage and transmission' },
    { key: 'landing_privacy_point_2', hu: 'Névtelen teszt kitöltés lehetősége', en: 'Anonymous test completion option' },
    { key: 'landing_privacy_point_3', hu: 'GDPR kompatibilis adatkezelés', en: 'GDPR compliant data processing' },
    { key: 'landing_privacy_point_4', hu: 'Adatok törlésének lehetősége bármikor', en: 'Data deletion option at any time' },

    // Additional CTA and Hero elements
    { key: 'landing_time_estimate', hu: '⏱ Csak 2 perc', en: '⏱ Just 2 minutes' },
    { key: 'landing_question_count', hu: '📝 15 egyszerű kérdés', en: '📝 15 simple questions' },
    { key: 'landing_hero_note', hu: 'Teljesen ingyenes, regisztráció nélkül', en: 'Completely free, no registration required' },
    { key: 'landing_cta_mid', hu: 'Kezdjük el most', en: 'Let\'s start now' },
    { key: 'landing_cta_urgency', hu: 'Indítsd el a tesztet', en: 'Start the assessment' },
    { key: 'landing_final_cta_title', hu: 'Készen állsz a felfedezésre?', en: 'Ready to discover?' },
    { key: 'landing_final_cta_desc', hu: 'Kezdd el a 2 perces ADHD tesztet és ismerd meg jobban magad', en: 'Start the 2-minute ADHD test and get to know yourself better' },
    { key: 'landing_final_cta_button', hu: 'Teszt indítása most', en: 'Start test now' }
  ];

  console.log(`Preparing to insert ${translations.length} translation pairs...`);

  // Insert translations in batches to avoid rate limits
  const batchSize = 10;
  let successCount = 0;
  
  for (let i = 0; i < translations.length; i += batchSize) {
    const batch = translations.slice(i, i + batchSize);
    
    for (const t of batch) {
      try {
        // Hungarian
        const { error: huError } = await supabase
          .from('quiz_translations')
          .upsert({
            quiz_id: quiz.id,
            lang: 'hu',
            field_key: t.key,
            value: t.hu,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'quiz_id,lang,field_key'
          });

        if (huError) {
          console.error(`❌ Error inserting HU translation for ${t.key}:`, huError.message);
        } else {
          console.log(`✅ HU: ${t.key}`);
          successCount++;
        }

        // English
        const { error: enError } = await supabase
          .from('quiz_translations')
          .upsert({
            quiz_id: quiz.id,
            lang: 'en',
            field_key: t.key,
            value: t.en,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'quiz_id,lang,field_key'
          });

        if (enError) {
          console.error(`❌ Error inserting EN translation for ${t.key}:`, enError.message);
        } else {
          console.log(`✅ EN: ${t.key}`);
          successCount++;
        }
      } catch (error) {
        console.error(`💥 Unexpected error for ${t.key}:`, error);
      }
    }
    
    // Small delay between batches
    if (i + batchSize < translations.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('🎉 Translation upload complete!');
  console.log(`📊 Successfully inserted: ${successCount} translations`);
  
  // Verify count
  const { data: finalCount } = await supabase
    .from('quiz_translations')
    .select('field_key', { count: 'exact' })
    .eq('quiz_id', quiz.id);
    
  console.log(`📈 Total translations in database: ${finalCount?.length || 0}`);
}

seedMissingTranslations().catch(console.error);
