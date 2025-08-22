import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CTAButton } from '@/components/landing/CTAButton'
import StickyCTA from '@/components/landing/StickyCTA'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { getTranslation } from '@/lib/translations'

const QUIZ_SLUG = 'adhd-quick-check'

// SEO metadata from translations
export async function generateMetadata({ params }) {
  const { lang } = typeof params?.then === 'function' ? await params : params || { lang: 'hu' }
  const supabase = getSupabaseAdmin()
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, default_lang')
    .eq('slug', QUIZ_SLUG)
    .eq('status', 'active')
    .single()

  if (!quiz) {
    return { title: 'Quiz Not Found' }
  }

  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  const title = getTranslation(allTranslations || [], lang, 'meta_title', quiz.default_lang)
    || getTranslation(allTranslations || [], lang, 'landing_headline', quiz.default_lang)
    || 'ADHD gyorsteszt'
  const description = getTranslation(allTranslations || [], lang, 'meta_description', quiz.default_lang)
    || getTranslation(allTranslations || [], lang, 'landing_description', quiz.default_lang)
    || 'Gyors, tájékoztató jellegű ADHD gyorsteszt.'

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  }
}

export default async function Page({ params }) {
  // Next.js 15: params lehet Promise
  const { lang } = typeof params?.then === 'function' ? await params : params || { lang: 'hu' }

  // Betöltjük a kvízt és a fordításokat Supabase-ből
  const supabase = getSupabaseAdmin()
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', QUIZ_SLUG)
    .eq('status', 'active')
    .single()

  if (quizError || !quiz) {
    notFound()
  }

  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  const t = (key, fallback = '') =>
    getTranslation(allTranslations || [], lang, key, quiz.default_lang) || fallback

  const quizId = quiz.id
  const startHref = `/${lang}/${quiz.slug}/quiz`

  // Fordítási kulcsok és tartalmi fallbackek
  const badge1 = t('landing_badge_1', 'Gyors')
  const badge2 = t('landing_badge_2', 'Ingyenes')
  const badge3 = t('landing_badge_3', 'Nem diagnózis')

  const heroTitle = t('landing_hero_title') || t('landing_headline', 'ADHD gyorsteszt – 2 perc alatt első benyomás')
  const heroSub = t('landing_hero_sub') || t('landing_sub', 'Válaszolj néhány kérdésre és kapsz egy rövid, személyre szabott visszajelzést. Nem helyettesíti a diagnózist.')
  const ctaPrimary = t('landing_cta_primary') || t('landing_cta_text') || t('cta_text', 'Kezdjük a gyorstesztet')
  const ctaSecondary = t('landing_cta_secondary', 'Tudj meg többet')

  // Statisztikák szekció
  const statsTitle = t('landing_stats_title', 'Már több ezren használták')
  const statsDesc = t('landing_stats_desc', 'Gyors, megbízható és tájékoztató eredmények')
  const stat1Number = t('landing_stat_1_number', '15.000+')
  const stat1Label = t('landing_stat_1_label', 'Kitöltő')
  const stat2Number = t('landing_stat_2_number', '2 perc')
  const stat2Label = t('landing_stat_2_label', 'Átlagos idő')
  const stat3Number = t('landing_stat_3_number', '94%')
  const stat3Label = t('landing_stat_3_label', 'Elégedettség')
  const stat4Number = t('landing_stat_4_number', '100%')
  const stat4Label = t('landing_stat_4_label', 'Ingyenes')

  // Trust elemek (bővített)
  const trust = [
    {
      title: t('landing_trust_item_1_title', 'Gyors és egyszerű'),
      desc: t('landing_trust_item_1_desc', '2 perc, 8–10 kérdés, nincs regisztráció')
    },
    {
      title: t('landing_trust_item_2_title', 'Személyre szabott'),
      desc: t('landing_trust_item_2_desc', 'Rövid és érthető visszajelzés a válaszaid alapján')
    },
    {
      title: t('landing_trust_item_3_title', 'Tájékoztató jellegű'),
      desc: t('landing_trust_item_3_desc', 'Nem helyettesíti az orvosi diagnózist, csak tájékoztat')
    }
  ]

  // Hogyan működik (bővített)
  const how = [
    {
      step: '1',
      title: t('landing_how_1_title', 'Válaszolj'),
      desc: t('landing_how_1_desc', 'Egyszerű kérdések a mindennapi figyelemről és impulzivitásról')
    },
    {
      step: '2', 
      title: t('landing_how_2_title', 'Értékelünk'),
      desc: t('landing_how_2_desc', 'Automatikus kiértékelés átlátható, tudományos skálán')
    },
    {
      step: '3',
      title: t('landing_how_3_title', 'Visszajelzés'),
      desc: t('landing_how_3_desc', 'Személyre szabott eredmény, tippek és következő lépések')
    }
  ]

  // Mire számíthatsz szekció
  const expectTitle = t('landing_expect_title', 'Mire számíthatsz?')
  const expectItems = [
    {
      icon: '📊',
      title: t('landing_expect_1_title', 'Pontos értékelés'),
      desc: t('landing_expect_1_desc', 'Tudományosan megalapozott kérdések és kiértékelési módszer')
    },
    {
      icon: '⚡',
      title: t('landing_expect_2_title', 'Azonnali eredmény'),
      desc: t('landing_expect_2_desc', 'Rögtön a kitöltés után megkapod az eredményedet')
    },
    {
      icon: '🎯',
      title: t('landing_expect_3_title', 'Praktikus tanács'),
      desc: t('landing_expect_3_desc', 'Konkrét javaslatok és következő lépések')
    },
    {
      icon: '🔒',
      title: t('landing_expect_4_title', 'Biztonságos'),
      desc: t('landing_expect_4_desc', 'Adataid biztonságban vannak, nincs tárolás')
    }
  ]

  // Garanciák
  const guaranteeTitle = t('landing_guarantee_title', 'Garanciáink')
  const guaranteeItems = [
    t('landing_guarantee_1', '✓ 100% ingyenes, rejtett költségek nélkül'),
    t('landing_guarantee_2', '✓ Nincs regisztráció vagy email cím szükséges'),
    t('landing_guarantee_3', '✓ Válaszaid nem kerülnek tárolásra'),
    t('landing_guarantee_4', '✓ Azonnali eredmény, várakozás nélkül')
  ]

  // Urgencia szekció
  const urgencyTitle = t('landing_urgency_title', 'Miért fontos most elkezdeni?')
  const urgencyDesc = t('landing_urgency_desc', 'Az ADHD tünetek felismerése az első lépés a jobb mindennapokhoz. Minél hamarabb tudsz róla, annál hamarabb kezdheted el a megfelelő stratégiák alkalmazását.')
  const urgencyPoints = [
    t('landing_urgency_point_1', 'A korai felismerés segíthet a mindennapi kihívások kezelésében'),
    t('landing_urgency_point_2', 'Hatékonyabb tanulási és munka stratégiákat fejleszthetsz ki'),
    t('landing_urgency_point_3', 'Jobb kapcsolatokat alakíthatsz ki családoddal és barátaiddal')
  ]

  const testimonials = [
    { q: t('landing_testimonial_1_quote'), a: t('landing_testimonial_1_author') },
    { q: t('landing_testimonial_2_quote'), a: t('landing_testimonial_2_author') },
    { q: t('landing_testimonial_3_quote'), a: t('landing_testimonial_3_author') },
  ].filter(item => item.q)

  const faqs = [1, 2, 3, 4, 5, 6]
    .map(i => ({ q: t(`landing_faq_${i}_q`), a: t(`landing_faq_${i}_a`) }))
    .filter(f => f.q && f.a)

  // Orvosi disclaimer (részletes)
  const disclaimer = t('landing_disclaimer', 'Ez az eszköz nem minősül orvosi eszköznek és nem ad diagnózist. Tájékoztató jellegű. Ha felmerül benned az ADHD gyanúja, fordulj szakemberhez.')
  const medicalTitle = t('landing_medical_title', 'Fontos orvosi tudnivalók')
  const medicalPoints = [
    t('landing_medical_point_1', 'Ez a teszt csak tájékoztató jellegű, nem helyettesíti az orvosi vizsgálatot'),
    t('landing_medical_point_2', 'ADHD diagnózis csak szakorvos által végezhető alapos vizsgálat után'),
    t('landing_medical_point_3', 'Ha a teszt alapján felmerül gyanú, fordulj pszichiáterhez vagy neurológushoz'),
    t('landing_medical_point_4', 'A teszt eredménye nem jelenti automatikusan ADHD meglétét vagy hiányát')
  ]

  // Adatvédelem
  const privacyTitle = t('landing_privacy_title', 'Adatvédelem és biztonság')
  const privacyDesc = t('landing_privacy_desc', 'Adataid biztonsága a legfontosabb számunkra')
  const privacyPoints = [
    t('landing_privacy_point_1', 'Válaszaid nem kerülnek mentésre vagy tárolásra'),
    t('landing_privacy_point_2', 'Nincs szükség regisztrációra vagy személyes adatok megadására'),
    t('landing_privacy_point_3', 'A teszt teljesen névtelen és bizalmas'),
    t('landing_privacy_point_4', 'Eredményedet csak te látod, senki mással nem osztjuk meg')
  ]

  // Időzítés
  const timeEstimate = t('landing_time_estimate', 'Becsült idő: 2-3 perc')
  const questionCount = t('landing_question_count', '8-10 kérdés')

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_60rem_at_50%_-10%,rgba(16,185,129,0.15),transparent)]" />
        <div className="container mx-auto px-4 pt-20 pb-10 md:pt-28 md:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1 text-emerald-700/80 bg-emerald-100 rounded-full px-4 py-2 text-sm font-semibold">
              <span>{badge1}</span>
              <span>•</span>
              <span>{badge2}</span>
              <span>•</span>
              <span>{badge3}</span>
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-6 text-zinc-600 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              {heroSub}
            </p>
            
            {/* Időbecslés */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>{timeEstimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📝</span>
                <span>{questionCount}</span>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton
                href={startHref}
                label={ctaPrimary}
                variant="primary"
                size="lg"
                trackingId="hero_primary"
                quizId={quizId}
                lang={lang}
                position="hero"
              />
              <CTAButton
                href="#reszletek"
                label={ctaSecondary}
                variant="secondary"
                size="lg"
                trackingId="hero_secondary"
                quizId={quizId}
                lang={lang}
                position="hero"
              />
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              {t('landing_hero_note', 'Nincs e-mail szükséges • Nincs mentés • Átlátható eredmény')}
            </p>
          </div>
        </div>
      </section>

      {/* Statisztikák */}
      <section className="bg-emerald-50/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">{statsTitle}</h2>
            <p className="text-lg text-zinc-600 mb-12">{statsDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: stat1Number, label: stat1Label },
                { number: stat2Number, label: stat2Label },
                { number: stat3Number, label: stat3Label },
                { number: stat4Number, label: stat4Label }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Előnyök / Trust */}
      <section id="reszletek" className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {t('landing_trust_section_title', 'Miért választják sokan?')}
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              {t('landing_trust_section_desc', 'Gyors, megbízható és felhasználóbarát megoldás az ADHD tünetek felmérésére')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {trust.map((item, i) => (
              <div key={i} className="relative group">
                <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 group-hover:border-emerald-300 group-hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                    <span className="text-emerald-700 font-bold text-xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hogyan működik */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {t('landing_how_section_title', 'Hogyan működik?')}
              </h2>
              <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                {t('landing_how_section_desc', 'Egyszerű 3 lépéses folyamat a gyors és pontos eredményért')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {how.map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-6 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4 text-center">{item.title}</h3>
                    <p className="text-zinc-600 leading-relaxed text-center">{item.desc}</p>
                  </div>
                  {/* Connecting arrow (except last item) */}
                  {i < how.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-400 text-2xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <CTAButton
                href={startHref}
                label={t('landing_cta_mid', ctaPrimary)}
                variant="primary"
                size="lg"
                trackingId="mid_primary"
                quizId={quizId}
                lang={lang}
                position="how"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mire számíthatsz */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">{expectTitle}</h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              {t('landing_expect_desc', 'Minden amit tudnod kell az ADHD gyorstesztről')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expectItems.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgencia szekció */}
      <section className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{urgencyTitle}</h2>
            <p className="text-xl mb-12 text-emerald-50 leading-relaxed">{urgencyDesc}</p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {urgencyPoints.map((point, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <p className="text-emerald-50">{point}</p>
                </div>
              ))}
            </div>
            <CTAButton
              href={startHref}
              label={t('landing_cta_urgency', ctaPrimary)}
              variant="primary"
              size="lg"
              trackingId="urgency_cta"
              quizId={quizId}
              lang={lang}
              position="urgency"
            />
          </div>
        </div>
      </section>

      {/* Garanciák */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-12">{guaranteeTitle}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guaranteeItems.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-emerald-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-zinc-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ajánlások / Social proof (ha van) */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {testimonials.map((tst, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <p className="text-zinc-700 italic">“{tst.q}”</p>
                {tst.a && <p className="mt-3 text-sm text-zinc-500">— {tst.a}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GYIK (ha van) */}
      {faqs.length > 0 && (
        <section className="bg-zinc-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-12">
                {t('landing_faq_section_title', 'Gyakori kérdések')}
              </h2>
              <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
                {faqs.map((item, i) => (
                  <details key={i} className="p-6 group">
                    <summary className="cursor-pointer list-none font-semibold text-zinc-900 flex items-center justify-between hover:text-emerald-600 transition-colors">
                      {item.q}
                      <span className="text-zinc-400 group-open:rotate-180 transition-transform text-xl">⌄</span>
                    </summary>
                    <p className="mt-4 text-zinc-700 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Adatvédelem */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-blue-600 text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">{privacyTitle}</h2>
            <p className="text-lg text-zinc-600 mb-8">{privacyDesc}</p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {privacyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <p className="text-zinc-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orvosi disclaimer (részletes) */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-amber-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-amber-600 text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 text-center mb-6">{medicalTitle}</h2>
              <div className="grid gap-4 text-left mb-8">
                {medicalPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">⚠</span>
                    <p className="text-zinc-700">{point}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-xl p-6 text-center">
                <p className="text-zinc-700 font-medium">{disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Utolsó CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('landing_final_cta_title', 'Kezdd el most az ADHD gyorstesztet!')}
          </h2>
          <p className="text-xl mb-8 text-emerald-50">
            {t('landing_final_cta_desc', 'Csak 2 perc és máris tudsz többet magadról')}
          </p>
          <CTAButton
            href={startHref}
            label={t('landing_final_cta_button', ctaPrimary)}
            variant="primary"
            size="lg"
            trackingId="final_cta"
            quizId={quizId}
            lang={lang}
            position="final"
          />
        </div>
      </section>

      {/* Mobil sticky CTA */}
      <StickyCTA quizId={quizId} lang={lang} href={startHref} label={ctaPrimary} />
    </main>
  )
}
