# Termék Konfiguráció Rendszer - Dokumentáció
*Létrehozva: 2025. augusztus 19.*

## 📋 Áttekintés

A Termék Konfiguráció Rendszer lehetővé teszi termék-specifikus beállítások kezelését a quiz platform-on. Minden termékhez egyedi témát, funkciókat, tartalmat, eredmény megjelenítést és AI prompt-okat lehet beállítani.

## 🏗️ Architektúra

### Adatbázis Struktúra

#### `product_configs` tábla
```sql
CREATE TABLE product_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, key)
);
```

**Kulcsok és értékek:**
- `theme` - Termék téma beállítások
- `feature_flags` - Termék-specifikus funkció kapcsolók
- `content_settings` - Tartalom beállítások
- `result_content` - Eredmény oldal tartalma
- `ai_prompts` - AI prompt konfigurációk

### Komponens Felépítés

#### 1. ProductConfigsEditor (`/src/app/admin/quiz-editor/components/product-configs-editor.tsx`)

**Főbb funkciók:**
- 5 tabos felület termék konfigurációk kezeléséhez
- CRUD műveletek a `product_configs` táblával
- Valós idejű mentés és feedback
- Termék kiválasztás és konfiguráció listázás

**Tab-ok:**
1. **🎨 Téma** - Színek, dizájn elemek
2. **⚙️ Funkciók** - Feature flag-ek termék szinten
3. **📄 Tartalom** - Általános tartalom beállítások
4. **📊 Eredmény** - Eredmény oldal személyre szabása
5. **🤖 AI Promptok** - Termék-specifikus AI konfigurációk

## 🎯 Főbb Funkciók

### 1. Eredmény Tartalom Kezelés

**Beállítható elemek:**
- `result_title` - Eredmény oldal címe
- `result_description` - Eredmény leírása
- `result_text` - Fő eredmény szöveg (minden felhasználónak megjelenik)
- `custom_result_html` - Egyedi HTML tartalom (haladó)

**Használat:**
```typescript
const resultContent = productConfigs?.find(config => config.key === 'result_content')?.value
```

### 2. AI Prompt Konfiguráció

**Beállítható prompt-ok:**
- `system_prompt` - AI személyisége és stílusa
- `result_prompt` - Termék-specifikus eredmény generálás
- `user_prompt` - Felhasználói utasítás

**Prioritási sorrend:**
1. `product_configs.ai_prompts` (legmagasabb)
2. `product_ai_prompts` tábla
3. `quiz_ai_prompts` tábla (fallback)

### 3. Bővített AI Változók

**Alapvető változók:**
- `{{score}}` - Összpontszám
- `{{percentage}}` - Százalékos eredmény
- `{{category}}` - Eredmény kategória
- `{{name}}` - Felhasználó neve
- `{{email}}` - Email cím
- `{{product_name}}` - Termék neve
- `{{quiz_title}}` - Quiz címe

**🆕 Új kérdés változók:**
- `{{questions}}` - Kérdések listája
- `{{questions_and_answers}}` - Kérdés-válasz párok strukturáltan

**Példa használat:**
```
Szia {{name}}, a kvíz kérdéseire adott válaszaid alapján:

{{questions_and_answers}}

Az eredményed {{score}} pont ({{percentage}}%), ami {{category}} kategóriába tartozik.
```

## 🔄 Adatfolyam

### 1. Admin Konfiguráció
```
Admin UI → ProductConfigsEditor → API (/api/admin/product-configs) → Supabase
```

### 2. Termék Eredmény Megjelenítés
```
User Request → Product Result Page → Load Configs → Apply Settings → Display
```

### 3. AI Eredmény Generálás
```
AI Request → Load Product AI Prompts → Variable Substitution → OpenAI → Cache Result
```

## 📁 Fájl Struktúra

```
src/app/admin/quiz-editor/components/
├── product-configs-editor.tsx          # Fő konfiguráció editor
│
src/app/[lang]/product/[productId]/result/
├── page.tsx                            # Server-side result page
├── product-result-client.tsx           # Client-side result display
│
src/app/api/
├── admin/product-configs/route.ts      # CRUD API endpoints
├── ai/generate-result/route.ts         # AI generálás (updated)
│
scripts/
├── create-product-tables.sql           # Adatbázis séma
```

## 🔧 API Végpontok

### GET /api/admin/product-configs
**Paraméterek:**
- `product_id` (UUID, required)

**Válasz:**
```json
{
  "configs": [
    {
      "id": "uuid",
      "product_id": "uuid", 
      "key": "result_content",
      "value": {
        "result_title": "Az Ön Eredménye",
        "result_description": "Részletes elemzés...",
        "result_text": "Termék-specifikus szöveg...",
        "custom_result_html": "<div>...</div>"
      }
    }
  ]
}
```

### POST /api/admin/product-configs
**Body:**
```json
{
  "product_id": "uuid",
  "key": "ai_prompts", 
  "value": {
    "system_prompt": "Te egy szakértő vagy...",
    "result_prompt": "Elemezd a következő eredményeket: {{questions_and_answers}}",
    "user_prompt": "Kérlek elemezd..."
  }
}
```

## 🎨 UI/UX Elemek

### Tab Navigáció
```typescript
const tabs = [
  { id: 'theme', label: '🎨 Téma', component: <ThemeEditor /> },
  { id: 'features', label: '⚙️ Funkciók', component: <FeaturesEditor /> },
  { id: 'content', label: '📄 Tartalom', component: <ContentEditor /> },
  { id: 'result', label: '📊 Eredmény', component: <ResultContentEditor /> },
  { id: 'ai', label: '🤖 AI Promptok', component: <AIPromptsEditor /> }
]
```

### Prompt Helper
- Interaktív változó listázás
- Színes kódolás és csoportosítás
- Példa használati minták
- Részletes leírások minden változóhoz

## 📊 Használati Minták

### 1. Termék-specifikus Eredmény Szöveg
```javascript
// Admin beállítja
{
  "result_content": {
    "result_title": "ADHD Gyors Teszt - Eredmény",
    "result_description": "Személyre szabott elemzés az Ön válaszai alapján",
    "result_text": "Az ADHD teszt alapján az Ön eredménye részletes elemzést nyújt a figyelemhiányos és hiperaktivitási tünetekről..."
  }
}

// Frontend megjelenítés
<CardTitle>{resultContent?.result_title || 'Alapértelmezett cím'}</CardTitle>
```

### 2. AI Prompt Testreszabás
```javascript
// Admin konfigurálja
{
  "ai_prompts": {
    "system_prompt": "Te egy ADHD specialista vagy...",
    "result_prompt": "A következő kérdés-válasz párok alapján {{questions_and_answers}} adj szakértői elemzést..."
  }
}

// AI generálás során
const prompt = aiPrompts.result_prompt
  .replace(/\{\{questions_and_answers\}\}/g, questionsAndAnswers)
  .replace(/\{\{name\}\}/g, userName)
  // ... további változók
```

## 🧪 Tesztelési Útmutató

### 1. Funkcionális Tesztelés
- [ ] Termék kiválasztás működik
- [ ] Minden tab elérhető és működőképes
- [ ] Konfiguráció mentése sikeres
- [ ] Változók helyesen helyettesítődnek

### 2. Integráció Tesztelés  
- [ ] Termék eredmény oldalon megjelenik a custom tartalom
- [ ] AI generálás használja a termék-specifikus prompt-okat
- [ ] Fallback mechanizmusok működnek

### 3. UI/UX Tesztelés
- [ ] Prompt helper informatív és használható
- [ ] Mentés feedback világos
- [ ] Loading state-ek megfelelők

## 🔒 Biztonsági Megfontolások

### Validáció
- Zod schema validáció minden input-nál
- XSS védelem HTML tartalomnál
- UUID validáció minden ID-nál

### Hozzáférés Kontroll  
- Admin jogosultság szükséges
- Product ownership ellenőrzés
- RLS policies az adatbázisban

## 📈 Teljesítmény Optimalizáció

### Adatbázis
- Index a `(product_id, key)` párra
- JSONB használat flexibilis konfigurációkhoz
- Unique constraint a duplikáció megelőzésére

### Frontend
- Lazy loading a komponenseknél
- Optimistic updates mentésnél
- Cache-elés a konfiguráció betöltésnél

## 🔄 Jövőbeli Fejlesztési Lehetőségek

1. **Verziókezelés** - Konfiguráció változások nyomon követése
2. **Template Rendszer** - Előre definiált konfigurációs sablonok
3. **A/B Testing** - Különböző konfigurációk tesztelése
4. **Bulk Operations** - Tömeges konfiguráció módosítás
5. **Audit Log** - Részletes naplózás minden változásról

## 📞 Hibakeresés

### Gyakori Problémák

**Problem:** Konfiguráció nem jelenik meg
**Megoldás:** Ellenőrizd a `product_id` és `key` egyezést

**Problem:** AI változók nem helyettesítődnek  
**Megoldás:** Ellenőrizd a változó szintaxist: `{{variable_name}}`

**Problem:** Mentés sikertelen
**Megoldás:** Nézd meg a JSON struktúra helyességét

### Debug Módszerek
```javascript
// Konfiguráció debug
console.log('Product configs:', productConfigs)
console.log('Result content:', resultContent)

// AI változó debug  
console.log('Original prompt:', prompt)
console.log('Processed prompt:', processedPrompt)
```

---

## 📝 Változásnapló

**2025.08.19 - v1.0.0**
- ✅ Termék konfiguráció alaprendszer
- ✅ 5 tabos admin felület  
- ✅ AI prompt bővített változókkal
- ✅ Eredmény tartalom testreszabás
- ✅ Product result page integráció
- ✅ Teljes CRUD API
- ✅ Dokumentáció elkészítése

---

*Dokumentáció készítője: GitHub Copilot*
*Utolsó frissítés: 2025. augusztus 19.*
