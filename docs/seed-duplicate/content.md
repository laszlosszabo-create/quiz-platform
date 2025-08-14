# ADHD Quiz Seed Content

## Quiz Metadata

- **Slug**: `adhd-quick-check`
- **Default Language**: `hu`
- **Status**: `active`
- **Question Count**: 8
- **Estimated Time**: 3-5 minutes

## Questions Structure

### Q1: Attention Span (Scale)
- **Key**: `attention_span`
- **Type**: `scale`
- **Scale**: 1-5 (Soha → Mindig)

### Q2: Hyperactivity (Single Choice)
- **Key**: `hyperactivity`
- **Type**: `single`
- **Options**: 4 choices

### Q3: Impulsivity (Single Choice)
- **Key**: `impulsivity`
- **Type**: `single`
- **Options**: 4 choices

### Q4: Organization (Scale)
- **Key**: `organization`
- **Type**: `scale`
- **Scale**: 1-5

### Q5: Time Management (Single Choice)
- **Key**: `time_management`
- **Type**: `single`
- **Options**: 4 choices

### Q6: Emotional Regulation (Scale)
- **Key**: `emotional_regulation`
- **Type**: `scale`
- **Scale**: 1-5

### Q7: Social Situations (Single Choice)
- **Key**: `social_situations`
- **Type**: `single`
- **Options**: 4 choices

### Q8: Daily Functioning (Scale)
- **Key**: `daily_functioning`
- **Type**: `scale`
- **Scale**: 1-5

## Scoring System

### Score Calculation
- **Method**: Simple sum
- **Scale questions**: 1-5 points each
- **Single choice**: 1-4 points each
- **Total possible**: 33 points

### Thresholds
- **Low (8-15 points)**: "Alacsony kockázat"
- **Medium (16-24 points)**: "Közepes kockázat"  
- **High (25-33 points)**: "Magas kockázat"

## Hungarian Translations

### Landing Page
```json
{
  "landing_headline": "ADHD Gyorsteszt - Ismerd meg magad!",
  "landing_sub": "Egy 5 perces teszt, amely segít feltérképezni az ADHD tüneteit. Tudományosan megalapozott kérdések, személyre szabott eredmény.",
  "cta_text": "Teszt indítása",
  "meta_title": "ADHD Gyorsteszt - Ingyenes Online Felmérés",
  "meta_description": "Tudományosan megalapozott ADHD teszt 5 perc alatt. Személyre szabott eredmény és javaslatok."
}
```

### Questions (HU)
```json
{
  "question:attention_span:text": "Mennyire nehéz koncentrálnod hosszabb feladatok során?",
  "question:attention_span:help": "Gondolj olyan helyzetekre, amikor 30+ percig kellett egy dologra figyelned",
  
  "question:hyperactivity:text": "Gyakran érzed magad nyugtalannak vagy 'pörögősnek'?",
  "question:hyperactivity:help": "Belső nyugtalanság, mozgásigény, nehéz egy helyben maradni",
  
  "question:impulsivity:text": "Mi jellemző rád döntéshozatal során?",
  "question:impulsivity:help": "Gondolj a mindennapi kis és nagy döntéseidre",
  
  "question:organization:text": "Mennyire szervezett vagy a mindennapi életben?",
  "question:organization:help": "Tárgyak rendben tartása, tervezés, határidők betartása",
  
  "question:time_management:text": "Hogyan állsz az időbeosztással?",
  "question:time_management:help": "Időérzék, pontosság, tervezés",
  
  "question:emotional_regulation:text": "Mennyire tudod kezelni az érzelmeidet?",
  "question:emotional_regulation:help": "Düh, frusztráció, stressz kezelése",
  
  "question:social_situations:text": "Mi jellemző rád társaságban?",
  "question:social_situations:help": "Beszélgetések, társas helyzetek kezelése",
  
  "question:daily_functioning:text": "Mennyire befolyásolják a tünetek a mindennapi életedet?",
  "question:daily_functioning:help": "Munka, tanulás, kapcsolatok, hobbik"
}
```

### Answer Options (HU)
```json
{
  "option:scale_1:label": "1 - Egyáltalán nem",
  "option:scale_2:label": "2 - Ritkán", 
  "option:scale_3:label": "3 - Néha",
  "option:scale_4:label": "4 - Gyakran",
  "option:scale_5:label": "5 - Majdnem mindig",
  
  "option:hyper_low:label": "Ritkán érzem magam nyugtalannak",
  "option:hyper_mild:label": "Néha pörgős vagyok",
  "option:hyper_moderate:label": "Gyakran nehéz megnyugodnom",
  "option:hyper_high:label": "Állandóan belső feszültséget érzek",
  
  "option:impulse_planned:label": "Mindig átgondolom a döntéseimet",
  "option:impulse_balanced:label": "Általában megfontolt vagyok",
  "option:impulse_quick:label": "Gyakran gyorsan döntök",
  "option:impulse_hasty:label": "Sokat csinálok meggondolatlanul",
  
  "option:time_excellent:label": "Mindig pontosan tervezek",
  "option:time_good:label": "Általában jól beosztom az időt",
  "option:time_struggling:label": "Gyakran késésben vagyok",
  "option:time_chaotic:label": "Az időbeosztás állandó küzdelem",
  
  "option:social_comfortable:label": "Könnyen beilleszkedem bárhol",
  "option:social_adaptive:label": "Általában jól kezelem a helyzeteket",
  "option:social_challenging:label": "Néha nehéz társaságban",
  "option:social_difficult:label": "Gyakran kínosan érzem magam"
}
```

### Results (HU)
```json
{
  "result_static_low_title": "Alacsony kockázat",
  "result_static_low_description": "Az eredményeid alapján kevés ADHD-specifikus tünet jellemez. Ez nem zárja ki teljesen a diagnózist, de jelenleg az életminőséged nem jelentősen érintett.",
  "result_static_low_recommendations": "Ha mégis úgy érzed, hogy vannak nehézségeid, érdemes szakemberrel beszélned a részletekről.",
  
  "result_static_medium_title": "Közepes kockázat", 
  "result_static_medium_description": "Több ADHD-specifikus tünet is felismerhető nálad. Érdemes lehet szakorvosi konzultáció és részletesebb felmérés.",
  "result_static_medium_recommendations": "Javasoljuk, hogy beszélj háziorvosoddal vagy keress fel egy ADHD-specialistát a további lépések megbeszéléséhez.",
  
  "result_static_high_title": "Magas kockázat",
  "result_static_high_description": "Az eredmények jelentős ADHD tünetegyüttest mutatnak, amely valószínűleg befolyásolja a mindennapi életedet.",
  "result_static_high_recommendations": "Határozottan javasoljuk szakorvosi vizsgálatot és lehetséges kezelési opciók megbeszélését."
}
```

## English Translations

### Landing Page (EN)
```json
{
  "landing_headline": "ADHD Quick Assessment - Know Yourself Better!",
  "landing_sub": "A 5-minute test that helps map ADHD symptoms. Scientifically based questions with personalized results.",
  "cta_text": "Start Assessment",
  "meta_title": "ADHD Quick Test - Free Online Assessment", 
  "meta_description": "Scientifically based ADHD test in 5 minutes. Personalized results and recommendations."
}
```

### Questions (EN)
```json
{
  "question:attention_span:text": "How difficult is it for you to concentrate during longer tasks?",
  "question:attention_span:help": "Think about situations requiring 30+ minutes of focused attention",
  
  "question:hyperactivity:text": "Do you often feel restless or 'wired'?",
  "question:hyperactivity:help": "Inner restlessness, need to move, difficulty staying still",
  
  "question:impulsivity:text": "What characterizes your decision-making?",
  "question:impulsivity:help": "Think about your daily small and big decisions",
  
  "question:organization:text": "How organized are you in daily life?",
  "question:organization:help": "Keeping things tidy, planning, meeting deadlines",
  
  "question:time_management:text": "How do you handle time management?",
  "question:time_management:help": "Time awareness, punctuality, planning",
  
  "question:emotional_regulation:text": "How well can you manage your emotions?",
  "question:emotional_regulation:help": "Handling anger, frustration, stress",
  
  "question:social_situations:text": "What characterizes you in social settings?",
  "question:social_situations:help": "Conversations, handling social situations",
  
  "question:daily_functioning:text": "How much do symptoms affect your daily life?",
  "question:daily_functioning:help": "Work, study, relationships, hobbies"
}
```

### Answer Options (EN)
```json
{
  "option:scale_1:label": "1 - Not at all",
  "option:scale_2:label": "2 - Rarely",
  "option:scale_3:label": "3 - Sometimes", 
  "option:scale_4:label": "4 - Often",
  "option:scale_5:label": "5 - Almost always",
  
  "option:hyper_low:label": "I rarely feel restless",
  "option:hyper_mild:label": "Sometimes I feel wired",
  "option:hyper_moderate:label": "Often hard to calm down",
  "option:hyper_high:label": "Constantly feel inner tension",
  
  "option:impulse_planned:label": "I always think through my decisions",
  "option:impulse_balanced:label": "Generally I'm thoughtful",
  "option:impulse_quick:label": "I often decide quickly", 
  "option:impulse_hasty:label": "I do many things impulsively",
  
  "option:time_excellent:label": "I always plan precisely",
  "option:time_good:label": "Generally good at time management",
  "option:time_struggling:label": "Often running late",
  "option:time_chaotic:label": "Time management is constant struggle",
  
  "option:social_comfortable:label": "I easily fit in anywhere",
  "option:social_adaptive:label": "Generally handle situations well",
  "option:social_challenging:label": "Sometimes difficult in company",
  "option:social_difficult:label": "Often feel awkward"
}
```

### Results (EN)
```json
{
  "result_static_low_title": "Low Risk",
  "result_static_low_description": "Based on your results, few ADHD-specific symptoms characterize you. This doesn't completely rule out a diagnosis, but currently your quality of life isn't significantly affected.",
  "result_static_low_recommendations": "If you still feel you have difficulties, it's worth discussing details with a professional.",
  
  "result_static_medium_title": "Moderate Risk",
  "result_static_medium_description": "Several ADHD-specific symptoms are recognizable in you. Medical consultation and detailed assessment might be worthwhile.",
  "result_static_medium_recommendations": "We recommend talking to your GP or consulting an ADHD specialist about next steps.",
  
  "result_static_high_title": "High Risk", 
  "result_static_high_description": "Results show significant ADHD symptom cluster that likely affects your daily life.",
  "result_static_high_recommendations": "We strongly recommend medical examination and discussion of possible treatment options."
}
```

## Product Information

### Product Details
```json
{
  "price_cents": 300000,
  "currency": "HUF",
  "delivery_type": "static_pdf",
  "asset_url": "https://demo.quiz-platform.com/reports/adhd-detailed-report.pdf",
  "translations": {
    "hu": {
      "name": "Részletes ADHD Jelentés",
      "short_description": "Személyre szabott elemzés és gyakorlati javaslatok",
      "long_description": "Komplex értékelés az eredményeid alapján, gyakorlati tippek a mindennapi élethez, és szakértői ajánlások a további lépésekhez.",
      "features": ["Részletes tünet elemzés", "Személyre szabott javaslatok", "Szakértői iránymutatás"],
      "cta_text": "Jelentés megvásárlása - 3000 Ft"
    },
    "en": {
      "name": "Detailed ADHD Report",
      "short_description": "Personalized analysis with practical recommendations", 
      "long_description": "Comprehensive evaluation based on your results, practical tips for daily life, and expert recommendations for next steps.",
      "features": ["Detailed symptom analysis", "Personalized recommendations", "Expert guidance"],
      "cta_text": "Purchase Report - €30"
    }
  }
}
```

## AI Prompts

### System Prompt (HU)
```
Te egy tapasztalt klinikai pszichológus vagy, aki ADHD diagnosztikával és kezeléssel foglalkozik. A felhasználó kitöltött egy ADHD tünetek felmérésére szolgáló kérdőívet.

Az eredmények alapján adj személyre szabott, empatikus és szakmailag megalapozott visszajelzést. Hangsúlyozd, hogy ez nem orvosi diagnózis, csak egy kezdeti felmérés.

Használj barátságos, de szakszerű hangnemet. Tartalmazza a válaszod:
1. Az eredmények rövid összefoglalását
2. A főbb területeket, ahol tünetek mutatkoznak  
3. Gyakorlati tanácsokat a mindennapi élethez
4. Ajánlást szakorvosi konzultációra, ha indokolt
```

### User Prompt Template (HU)
```
A felhasználó kitöltötte az ADHD felmérést az alábbi eredményekkel:

Összpontszám: {{scores.total}}/33
Kategória: {{scores.category}}

Területenkénti pontszámok:
- Figyelmi nehézségek: {{scores.attention}}/15
- Hiperaktivitás: {{scores.hyperactivity}}/8  
- Impulzivitás: {{scores.impulsivity}}/10

A legmagasabb pontszámot elért területek: {{scores.top_areas}}

Kérlek, adj személyre szabott visszajelzést ezeknek az eredményeknek az alapján.
```

### System Prompt (EN)
```
You are an experienced clinical psychologist specializing in ADHD diagnostics and treatment. The user has completed a questionnaire designed to assess ADHD symptoms.

Based on the results, provide personalized, empathetic, and professionally grounded feedback. Emphasize that this is not a medical diagnosis, just an initial assessment.

Use a friendly but professional tone. Include in your response:
1. Brief summary of results
2. Main areas where symptoms are present
3. Practical advice for daily life  
4. Recommendation for medical consultation if appropriate
```

### User Prompt Template (EN)
```
The user has completed the ADHD assessment with the following results:

Total score: {{scores.total}}/33
Category: {{scores.category}}

Area-specific scores:
- Attention difficulties: {{scores.attention}}/15
- Hyperactivity: {{scores.hyperactivity}}/8
- Impulsivity: {{scores.impulsivity}}/10

Highest scoring areas: {{scores.top_areas}}

Please provide personalized feedback based on these results.
```
