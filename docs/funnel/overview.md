# Funnel Module - Public Quiz Flow

## Overview
A publikus funnel három oldalból áll: Landing Page → Quiz → Result. Minden oldal többnyelvű támogatással (HU/EN), teljes tracking rendszerrel és fallback mechanizmusokkal.

## Implementált funkciók

### Oldalak
- **Landing Page** (`/[lang]/[quizSlug]`) - Quiz bemutató oldal, CTA gombbal
- **Quiz Page** (`/[lang]/[quizSlug]/quiz`) - Lépésenkénti kvíz kitöltő, email gate-tel
- **Result Page** (`/[lang]/[quizSlug]/result`) - AI eredmény megjelenítés + termék ajánlat

### Session Management
- Client token alapú session kezelés (`lib/session.ts`)
- 24 órás session életciklus
- Automatikus mentés válaszválasztásnál
- Email gate konfigurálható pozícióval (jelenleg 3. kérdés után)

### AI Integration
- OpenAI GPT-4 eredmény generálás
- Nyelvspecifikus promptok (HU/EN) a `quiz_ai_prompts` táblából
- Fallback statikus eredményre AI hiba esetén
- Personalizált eredmény a válaszok alapján

### Tracking System
9 esemény típus implementálva (`/api/tracking`):
- `page_view` - oldal megtekintés
- `cta_click` - CTA gomb kattintás  
- `quiz_start` - kvíz kezdése
- `answer_select` - válasz kiválasztása
- `quiz_complete` - kvíz befejezése
- `email_submitted` - email cím megadása
- `product_view` - termék megtekintése
- `booking_view` - foglalás link megtekintése
- `checkout_start` - fizetés kezdése (placeholder)

### Lead Generation
- Email gyűjtés quiz közben (email gate)
- Lead mentés `quiz_leads` táblába
- Duplikáció ellenőrzés (quiz + email kombináció)

## API Endpoints

### Session Management
- `POST /api/quiz/session` - Session létrehozása
- `PATCH /api/quiz/session` - Session frissítése (válaszok mentése)

### AI Integration  
- `POST /api/ai/generate-result` - AI eredmény generálás

### Lead Generation
- `POST /api/quiz/lead` - Lead létrehozása email címmel

### Tracking
- `POST /api/tracking` - Esemény tracking

## Technikai részletek

### Database Schema
A következő táblák kerülnek használatra:
- `quizzes` - Quiz alapadatok
- `quiz_translations` - Többnyelvű tartalmak
- `questions` - Kvíz kérdések
- `question_translations` - Kérdések fordításai  
- `answers` - Válaszlehetőségek
- `answer_translations` - Válaszok fordításai
- `quiz_sessions` - Aktív sessionök
- `quiz_leads` - Email címek
- `quiz_ai_prompts` - AI promptok nyelvek szerint
- `products` - Termékek (eredmény oldalon)
- `tracking_events` - Esemény tracking

### Frontend Components
- `LandingPageClient` - Landing oldal logika
- `QuizClient` - Quiz flow kezelés
- `QuestionComponent` - Kérdés megjelenítés
- `EmailGate` - Email cím bekérő
- `ResultClient` - Eredmény megjelenítés

### Translation System
- `lib/translations.ts` - Translation helper függvények
- Fallback alapnyelvre hiányzó fordítások esetén
- Field key alapú translation lookup

## Testing Status

### Manuális tesztek elvégezve:
✅ Landing page megjelenik (HU/EN)  
✅ Quiz indítható, kérdések megjelennek  
✅ Válaszok mentődnek session-be  
✅ Email gate működik  
✅ AI eredmény generálás működik  
✅ Tracking események rögzítődnek  
✅ Multi-language support működik  

### API tesztek elvégezve:
✅ Session creation: `POST /api/quiz/session`  
✅ Session update: `PATCH /api/quiz/session`  
✅ AI generation: `POST /api/ai/generate-result`  
✅ Lead creation: `POST /api/quiz/lead`  
✅ Event tracking: `POST /api/tracking`  

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

### Quiz Configuration
- Quiz slug: `adhd-quick-check`
- Supported languages: `hu`, `en`
- Email gate position: 3rd question
- Session lifetime: 24 hours
- AI model: `gpt-4`

## Integration Points

### Module 4 (Stripe) Integration
- `checkout_start` tracking event már implementálva
- Product data structure felkészítve Stripe product_id-kra
- Result oldal felkészítve checkout gomb megjelenítésére

### Module 5 (Email) Integration  
- Lead data már gyűjtve `quiz_leads` táblában
- Email események triggereléséhez szükséges adatok rendelkezésre állnak
- Language-specific email support előkészítve

## Known Issues & Limitations

1. **Translation Gaps**: Néhány translation key hiányzik, fallback alapnyelvre történik
2. **Email Gate Position**: Jelenleg hardcoded 3. kérdésnél, admin felületen szerkeszthetővé kell tenni
3. **AI Error Handling**: Alapvető fallback van, de nincs retry mechanizmus
4. **Rate Limiting**: Nincs implementálva a publikus endpoint-okon

## Acceptance Criteria - COMPLETED ✅

- [x] Landing page elérhető és CTA működik
- [x] Quiz végigjárható, válaszok mentődnek
- [x] Email gate bekéri és menti az email címet  
- [x] AI eredmény generálódik és megjelenik
- [x] Tracking események rögzítődnek
- [x] Többnyelvű támogatás működik (HU/EN)
- [x] API endpoint-ok működnek és tesztelve vannak
- [x] Session management 24 órás életciklussal
- [x] Error handling és fallback mechanizmusok
- [x] Database schema és seed adatok rendelkezésre állnak
