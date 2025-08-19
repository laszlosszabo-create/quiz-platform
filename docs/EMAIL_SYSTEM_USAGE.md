# Email Rendszer Használati Útmutató

## Áttekintés

A quiz platform email rendszere lehetővé teszi automatikus emailek küldését quiz kitöltése, vásárlás és emlékeztető események alapján. A rendszer markdown alapú sablonokat használ, változókkal és AI eredmény integrációval.

## Főbb Komponensek

### 1. Email Sablonok (Templates)
- **Típusok**: Quiz eredmény, vásárlás megerősítés, emlékeztető, egyéni
- **Formátum**: Markdown szöveg HTML-lé konvertálással
- **Változók**: 16+ előre definiált változó (pl. `{{user_name}}`, `{{ai_result}}`)
- **AI integráció**: Automatikus markdown to HTML konvertálás email-kompatibilis stílusokkal

### 2. Automatizálási Szabályok (Automation Rules)
- **Triggerek**: `quiz_complete`, `purchase`, `no_purchase_reminder`
- **Feltételek**: Quiz eredmény százalék, termék ID, időalapú feltételek
- **Késleltetés**: Percben megadható késleltetés az email küldés előtt
- **Prioritás**: 1-10 skála a feldolgozási sorrend meghatározásához

### 3. Email Várakozási Sor (Queue)
- **Státuszok**: pending, processing, sent, failed, cancelled
- **Ütemezés**: Pontos időpont megadása a küldéshez
- **Újrapróbálkozás**: Automatikus hibakezelés és újrapróbálkozás

### 4. Email Analytics
- **Események**: sent, delivered, opened, clicked, bounced, failed
- **Statisztikák**: Kézbesítési arány, megnyitási arány, kattintási arány
- **Webhook integráció**: Resend.com webhook események feldolgozása

## API Endpointok

### Email Sablonok
```
GET    /api/admin/email-templates?quiz_id={uuid}&product_id={uuid}
POST   /api/admin/email-templates
PUT    /api/admin/email-templates
DELETE /api/admin/email-templates?id={uuid}
```

### Automatizálási Szabályok
```
GET    /api/admin/email-automation-rules?quiz_id={uuid}&product_id={uuid}
POST   /api/admin/email-automation-rules
PUT    /api/admin/email-automation-rules
DELETE /api/admin/email-automation-rules?id={uuid}
```

### Email Küldés
```
POST   /api/admin/email-send?action=test
POST   /api/admin/email-send
```

### Email Várakozási Sor
```
GET    /api/admin/email-queue?quiz_id={uuid}&status={status}&limit={number}&offset={number}
PUT    /api/admin/email-queue
DELETE /api/admin/email-queue?id={uuid}
```

### Email Analytics
```
GET    /api/admin/email-analytics?quiz_id={uuid}&template_id={uuid}&date_from={iso}&date_to={iso}&group_by={day|week|month|template|event}
```

### Cron Job - Email Queue Processzálás
```
GET    /api/cron/process-email-queue
```

### Webhook - Resend Events
```
POST   /api/webhooks/resend
```

## Sablonváltozók

### Felhasználói Adatok
- `{{user_name}}` - Felhasználó neve
- `{{user_email}}` - Felhasználó email címe

### Quiz Adatok
- `{{quiz_title}}` - Quiz címe
- `{{quiz_result_percentage}}` - Eredmény százalékban
- `{{quiz_result_text}}` - Eredmény szöveges leírása
- `{{quiz_completion_date}}` - Quiz kitöltésének dátuma
- `{{ai_result}}` - AI által generált eredmény (markdown formátum)

### Termék és Vásárlási Adatok
- `{{product_name}}` - Termék neve
- `{{product_price}}` - Termék ára
- `{{purchase_date}}` - Vásárlás dátuma
- `{{order_id}}` - Rendelés azonosítója

### Speciális Funkciók
- `{{saved_analysis_code}}` - Elmentett elemzés kódja (SQL lekérdezéshez)
- `{{discount_code}}` - Kedvezménykód
- `{{expiry_date}}` - Lejárati dátum

### Rendszer Adatok
- `{{support_email}}` - Ügyfélszolgálat email címe
- `{{company_name}}` - Cég neve
- `{{unsubscribe_url}}` - Leiratkozási link

## Markdown Formázás

A sablonok markdown formátumot használnak, amely automatikusan HTML-lé konvertálódik email-kompatibilis inline stílusokkal:

```markdown
# Főcím (H1)
## Alcím (H2)
### Kis cím (H3)

**Félkövér szöveg**
*Dőlt szöveg*

- Lista elem 1
- Lista elem 2

1. Számozott lista
2. Második elem

[Link szövege](https://example.com)

> Idézet blokk

`Inline kód`

```python
# Kód blokk
print("Hello World")
```

## Automatizálási Példák

### Quiz Eredmény Email
```javascript
{
  "rule_name": "Quiz eredmény küldése",
  "trigger_event": "quiz_complete",
  "conditions": {},
  "delay_minutes": 0,
  "template_id": "uuid-of-result-template",
  "is_active": true,
  "max_sends": 1,
  "priority": 8
}
```

### Vásárlás Emlékeztető (24 óra késleltetéssel)
```javascript
{
  "rule_name": "Vásárlási emlékeztető",
  "trigger_event": "no_purchase_reminder",
  "conditions": {
    "min_percentage": 60
  },
  "delay_minutes": 1440,
  "template_id": "uuid-of-reminder-template",
  "is_active": true,
  "max_sends": 3,
  "priority": 5
}
```

### Feltételes Email (Csak magas eredmény esetén)
```javascript
{
  "rule_name": "Kiváló eredmény gratulációs email",
  "trigger_event": "quiz_complete",
  "conditions": {
    "min_percentage": 85
  },
  "delay_minutes": 5,
  "template_id": "uuid-of-congratulations-template",
  "is_active": true,
  "max_sends": 1,
  "priority": 9
}
```

## Programozott Használat

### Email Trigger Használata
```typescript
import { emailTrigger } from '@/lib/email-automation'

// Quiz befejezése után
await emailTrigger.triggerQuizCompletion(
  quizId, 
  userEmail, 
  {
    percentage: 85,
    text: "Kiváló eredmény!",
    ai_result: "**Gratulálunk!** Az Ön eredménye..."
  },
  userName
)

// Vásárlás után
await emailTrigger.triggerPurchaseConfirmation(
  quizId,
  userEmail,
  productId,
  orderId,
  userName
)

// Emlékeztető email
await emailTrigger.triggerReminder(
  quizId,
  userEmail,
  { completion_date: "2024-01-15" },
  userName
)
```

### Közvetlen Email Küldés
```typescript
const response = await fetch('/api/admin/email-send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template_id: 'uuid-of-template',
    recipient_email: 'user@example.com',
    variables: {
      user_name: 'John Doe',
      quiz_result_percentage: '85',
      ai_result: 'Az AI eredménye markdown formátumban'
    },
    schedule_at: '2024-01-20T10:00:00Z', // Opcionális
    priority: 7
  })
})
```

## Cron Job Beállítás

Az email queue processzálásához be kell állítani egy cron job-ot:

```bash
# Minden 5 percben
*/5 * * * * curl -X GET https://yourdomain.com/api/cron/process-email-queue

# Vagy Vercel Cron (vercel.json)
{
  "crons": [{
    "path": "/api/cron/process-email-queue",
    "schedule": "*/5 * * * *"
  }]
}
```

## Environment Változók

```bash
# .env.local
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Webhook Beállítás (Resend)

A Resend dashboard-ban állítsa be a webhook URL-t:
```
https://yourdomain.com/api/webhooks/resend
```

Események:
- email.sent
- email.delivered  
- email.opened
- email.clicked
- email.bounced
- email.complained

## Troubleshooting

### Gyakori Hibák

1. **Template not found**: Ellenőrizze, hogy a sablon létezik és aktív
2. **Variables not replaced**: Győződjön meg róla, hogy a változók `{{}}` formátumban vannak
3. **Email not sent**: Ellenőrizze a queue státuszát és a cron job működését
4. **Markdown not converted**: Győződjön meg róla, hogy a marked.js és DOMPurify telepítve van

### Debug Módok

```javascript
// API válasz ellenőrzése
console.log('Email API response:', await fetch('/api/admin/email-templates'))

// Queue státusz
console.log('Queue items:', await fetch('/api/admin/email-queue?quiz_id=...'))

// Analytics ellenőrzése  
console.log('Email analytics:', await fetch('/api/admin/email-analytics?quiz_id=...'))
```

## Biztonsági Megfontolások

1. **Input Validation**: Minden API endpoint validálja a bemeneti adatokat
2. **Rate Limiting**: Az email küldés limitálva van a spam megelőzése érdekében
3. **HTML Sanitization**: DOMPurify használata XSS támadások ellen
4. **Authentication**: Admin endpointok megfelelő jogosultságot igényelnek

## Teljesítmény Optimalizálás

1. **Queue Processing**: Maximum 50 email feldolgozása egyszerre
2. **Analytics Caching**: Statisztikák cache-elése hosszabb időre
3. **Template Compilation**: Sablonok előre feldolgozása és cache-elése
4. **Database Indexing**: Megfelelő indexek a gyors lekérdezésekhez

---

*Ez a dokumentáció a Quiz Platform Email Rendszer v1.0.0 verziójához készült.*
