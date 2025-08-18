#!/usr/bin/env node
// Seed essential landing translations for the ADHD quiz
const { createClient } = require('@supabase/supabase-js')

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    console.error('Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)')
    process.exit(1)
  }
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  // Resolve ADHD quiz
  const { data: quiz, error: qErr } = await admin
    .from('quizzes')
    .select('id, default_lang, slug')
    .eq('slug', 'adhd-quick-check')
    .single()
  if (qErr || !quiz) throw new Error('ADHD quiz not found')

  const lang = quiz.default_lang || 'hu'
  const rows = [
    // Hero
    ['landing_hero_title', 'Gyanakszol ADHD-ra? 2 perc alatt kapsz visszajelzést.'],
    ['landing_hero_sub', 'Ingyenes és anonim gyorsteszt, hétköznapi nyelven, azonnali eredménnyel.'],
    ['landing_badge_1', '2 perc'],
    ['landing_badge_2', 'Anonim'],
    ['landing_badge_3', 'Szakmai háttér'],
    ['landing_cta_primary', 'Indítsd el a 2 perces ADHD gyorstesztet'],
    ['landing_cta_secondary', 'Kezdjük'],
    ['hero_image_alt', 'ADHD gyorsteszt előnézet'],
    // Trust
    ['trust_count_label', '12 000+ kitöltés'],
    ['trust_rating_label', '★★★★★ 4.8/5'],
    ['trust_bullet_1', 'Ingyenes'],
    ['trust_bullet_2', 'Anonim'],
    ['trust_bullet_3', '2 perc'],
    // Checklist
    ['checklist_title', 'Ismerősen hangzik?'],
    ['checklist_item_1', 'Nehezen fókuszálsz hosszabb feladatokra'],
    ['checklist_item_2', 'Gyakran csúsznak a határidők'],
    ['checklist_item_3', 'Impulzívan hozol döntéseket'],
    ['checklist_item_4', 'Rendszeresen elfelejtesz teendőket'],
    ['checklist_item_5', 'Belső nyugtalanság, túl sok gondolat'],
    ['checklist_cta', 'Indítsd el a gyorstesztet'],
    // How
    ['how_title', 'Hogyan működik?'],
    ['how_step_1_title', 'Válaszolj pár kérdésre'],
    ['how_step_1_text', '2 perc, hétköznapi példákkal.'],
    ['how_step_2_title', 'Azonnali eredmény'],
    ['how_step_2_text', 'Összefoglaló és kategória.'],
    ['how_step_3_title', 'Következő lépések'],
    ['how_step_3_text', 'Személyre szabott útmutató.'],
    ['how_cta', 'Teszt elkezdése'],
    // Testimonials
    ['testimonials_title', 'Visszajelzések'],
    ['testimonial_1_quote', 'Régóta halogattam, ez végre adott egy tiszta képet.'],
    ['testimonial_1_author', 'Kata, 29'],
    ['testimonial_2_quote', '2 perc volt tényleg, és meglepően pontos.'],
    ['testimonial_2_author', 'Gergő, 34'],
    ['testimonial_3_quote', 'Végre érthető magyarázatot kaptam a mindennapi nehézségekre.'],
    ['testimonial_3_author', 'Bogi, 26'],
    ['testimonials_cta', 'Kezdjük el most'],
    // FAQ + final
    ['faq_title', 'Gyakori kérdések'],
    ['faq_1_q', 'Anonim a teszt?'],
    ['faq_1_a', 'Igen. Nem kérünk személyes adatokat a kitöltéshez.'],
    ['faq_2_q', 'Ez diagnózis?'],
    ['faq_2_a', 'Nem. Tájékoztató jellegű eredményt adunk, szakmai forrásokra támaszkodva.'],
    ['faq_3_q', 'Mennyi időt vesz igénybe?'],
    ['faq_3_a', 'Kb. 2 perc.'],
    ['final_cta', 'Indítás'],
    ['disclaimer_text', 'Az eredmény tájékoztató jellegű, nem helyettesíti az orvosi diagnózist.']
  ].map(([field_key, value]) => ({ quiz_id: quiz.id, lang, field_key, value }))

  // New Landing (LP) flat keys to eliminate fallbacks on the HU fold
  const lpHu = [
    ['landing_hero_title', 'ADHD Gyorsteszt – 5 perc, valós visszajelzés'],
    ['landing_hero_sub', 'Ismerd meg a figyelem, impulzivitás és szervezettség mintázatait. Tudományos szemlélet, érthető összefoglaló.'],
    ['landing_badge_1', '5,000+ kitöltés'],
    ['landing_badge_2', '98% elégedettség'],
    ['landing_badge_3', 'Személyre szabott áttekintés'],
    ['landing_cta_primary', 'Kezdjük a tesztet'],
    ['landing_cta_secondary', 'További információ'],
    ['landing_trust_item_1', 'Gyors és ingyenes'],
    ['landing_trust_item_2', 'Szakmai alapok'],
    ['landing_trust_item_3', 'Anonim kitöltés'],
    ['landing_how_1', 'Válaszolj 8 egyszerű kérdésre'],
    ['landing_how_2', 'Kapsz egy azonnali, közérthető összegzést'],
    ['landing_how_3', 'Ha szeretnéd, e-mailben is elküldjük'],
    ['landing_testimonial_1_quote', 'Végre értem, miért nehéz bizonyos helyzetekben.'],
    ['landing_testimonial_1_author', 'Eszter, 29'],
    ['landing_testimonial_2_quote', 'Rövid volt, mégis sokat adott.'],
    ['landing_testimonial_2_author', 'Ádám, 34'],
    ['landing_testimonial_3_quote', 'Hasznos kiindulópont a következő lépésekhez.'],
    ['landing_testimonial_3_author', 'Dóri, 25'],
    ['landing_faq_1_q', 'Ez orvosi diagnózis helyettesítésére szolgál?'],
    ['landing_faq_1_a', 'Nem. A teszt tájékoztató jellegű, nem helyettesít szakorvosi vizsgálatot.'],
    ['landing_faq_2_q', 'Mennyi időt vesz igénybe?'],
    ['landing_faq_2_a', 'Kb. 5 perc.'],
    ['landing_faq_3_q', 'Kell e-mailt adnom?'],
    ['landing_faq_3_a', 'Nem kötelező. Az eredményed e-mail nélkül is megtekintheted.'],
    ['landing_disclaimer', 'A teszt nem helyettesíti a szakmai diagnózist. Kérdés esetén fordulj szakemberhez.'],
  ].map(([field_key, value]) => ({ quiz_id: quiz.id, lang: 'hu', field_key, value }))

  const { error: upErr1 } = await admin.from('quiz_translations').upsert(rows, { onConflict: 'quiz_id,lang,field_key' })
  if (upErr1) throw upErr1
  const { error: upErr2 } = await admin.from('quiz_translations').upsert(lpHu, { onConflict: 'quiz_id,lang,field_key' })
  if (upErr2) throw upErr2

  console.log(`Seeded ${rows.length} + ${lpHu.length} LP translations for quiz ${quiz.slug} (${quiz.id})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
