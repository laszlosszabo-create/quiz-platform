# Troubleshooting Guide

## Dev Server / Port Conflicts

### Dev Server Won't Start or Respond

**Hiba:**
```
Server running but curl returns "HTTP Status: 000" or connection refused
Dev server appears to start but endpoints not accessible
```

**Gyors Megoldások:**
1. **Clean Restart:**
   ```bash
   pkill -f "next dev"
   rm -rf .next
   npm run dev
   ```

2. **Port Check:**
   ```bash
   lsof -i :3000  # Check what's using port 3000
   ```

3. **Browser vs curl:**
   - If curl fails but browser works, use browser for testing
   - macOS sometimes has curl/localhost resolution issues
   - Use VS Code Simple Browser: http://localhost:3000

4. **Cache Issues:**
   ```bash
   rm -rf .next
   rm tsconfig.tsbuildinfo
   npm run dev
   ```

**Megelőzés:**
- Always use clean restart before important testing
- Check port availability before starting
- Use browser testing as fallback when curl fails

## AI Prompts Editor

### "Not a module" TypeScript Error

**Hiba:**
```
File '/Users/.../src/app/api/admin/ai-prompts/route.ts' is not a module.
No HTTP methods exported in route.ts
```

**Oka:**
- TypeScript compilation error preventing Next.js from recognizing exported HTTP methods
- Szintaktikai hiba vagy hiányzó import/export statements
- Next.js cache corruption

**Megoldás:**
1. **TypeScript ellenőrzés:**
   ```bash
   npx tsc --noEmit
   ```

2. **Next.js cache törlése:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Route fájl ellenőrzése:**
   ```typescript
   // Győződj meg róla, hogy minden HTTP method properly exportálva van
   export async function GET(request: NextRequest) { /* ... */ }
   export async function POST(request: NextRequest) { /* ... */ }
   export async function PUT(request: NextRequest) { /* ... */ }
   export async function DELETE(request: NextRequest) { /* ... */ }
   ```

### Zod Validation Errors in UI

**Hiba:**
Validation hibák nem jelennek meg user-friendly módon az admin UI-ban.

**Megoldás:**
```typescript
// src/app/admin/components/ai-prompts-editor.tsx
const errorData = await response.json()

// Handle Zod validation errors
if (errorData.details && Array.isArray(errorData.details)) {
  const validationMessages = errorData.details.map((detail: any) => 
    `${detail.path?.join('.')}: ${detail.message}`
  ).join(', ')
  setError(`Validation Error: ${validationMessages}`)
} else {
  setError(errorData.error || 'Failed to save AI prompt')
}
```

### Schema Cache Issues

**Hiba:**
Database schema changes nem frissülnek a TypeScript types-ban.

**Megoldás:**
```bash
# Regenerate database types
npm run db:types

# Clear Next.js and TypeScript cache
rm -rf .next
rm tsconfig.tsbuildinfo
npm run dev
```

**Releváns fájlok:**
- `/src/app/api/admin/ai-prompts/route.ts` - API endpoint implementations
- `/src/lib/zod-schemas.ts` - Validation schemas
- `/src/app/admin/components/ai-prompts-editor.tsx` - UI error handling

---

## OpenAI teszt végpont (admin AI Prompt fül)

**Probléma:** Szükség volt egy szerver oldali végpontra, amely lehetővé teszi az admin felületen az AI promptok valós OpenAI API-val történő tesztelését.

**Megoldás:**

1. Létrehoztuk a `/api/admin/ai-prompts/openai-test` Next.js API route-ot.
2. Ez a végpont POST kérést vár, amely tartalmazza a system promptot, user promptot, AI modellt, providert és teszt adatokat.
3. A végpont a user promptban lecseréli a változókat a teszt adatokra, majd meghívja az OpenAI API-t (chat/completions endpoint).
4. Az eredményt visszaadja a frontendnek, amely az admin UI-ban megjelenik.

**Használat:**
- Az admin felületen az AI Prompt fülön a "Teszt" gomb elküldi a promptot a végpontra, és az OpenAI válaszát egy alertben jeleníti meg.

**Hibalehetőségek:**
- Hiányzó OpenAI API kulcs → 500-as hiba
- Hibás vagy hiányzó prompt → 400-as hiba
- OpenAI API hiba → 500-as hiba, részletes üzenettel

**Kód:**
- `src/app/api/admin/ai-prompts/openai-test/route.ts`
# Troubleshooting Guide - Module 6 Questions Editor

## 🐛 Hibák és Megoldások

### 1. Multiple GoTrueClient Instances Warning

**Hiba:**
```
Multiple GoTrueClient instances detected in the same browser context
```

**Oka:**
- React komponensek minden renderkor új Supabase client instancet hoztak létre
- Hot Reload során többszörös inicializálás történt

**Megoldás:**
```typescript
// ❌ Rossz megközelítés - minden renderkor új client
const supabase = createClient()

// ✅ Helyes megközelítés - singleton pattern + useMemo
// src/lib/supabase.ts
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const createClient = () => {
  if (supabaseClient) {
    return supabaseClient
  }
  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Komponensekben:
const supabase = useMemo(() => createClient(), [])
```

### 2. Client-Side Import Server-Side Module Error

**Hiba:**
```
Error: Missing Supabase admin environment variables
```

**Oka:**
- Client-side komponens (`questions-editor.tsx`) próbált server-side modult (`supabase-admin.ts`) importálni
- Browser környezetben nem érhetők el a server-side environment változók

**Megoldás:**
```typescript
// ❌ Rossz: client komponensben server module import
import { createAuditLog } from '../../../lib/audit-log'  // használja supabase-admin-t

// ✅ Helyes: API route létrehozása + fetch hívás
// 1. API route: src/app/api/admin/audit-log/route.ts
export async function POST(request: NextRequest) {
  const result = await createAuditLog(body)
  return NextResponse.json({ success: true })
}

// 2. Client komponensben fetch hívás:
const createAuditLogEntry = async (action: string, resourceId: string, details?: any) => {
  await fetch('/api/admin/audit-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, resource_type: 'quiz_question', resource_id: resourceId, details })
  })
}
```

### 3. Import/Export Mismatch

**Hiba:**
```
Attempted import error: 'supabase' is not exported from '@/lib/supabase'
```

**Oka:**
- Régi kód még `supabase` néven importálta a clientet
- Átnevezés után `createClient` lett az export név

**Megoldás:**
```typescript
// ❌ Régi import
import { supabase } from '@/lib/supabase'

// ✅ Új import
import { createClient } from '@/lib/supabase'
const supabase = createClient()
```

### 4. Missing Default Export

**Hiba:**
```
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object
```

**Oka:**
- Komponens function nem volt `export default`-tal exportálva
- Vagy dupla export default volt jelen

**Megoldás:**
```typescript
// ❌ Rossz: nincs export default
function TranslationEditor() { }
export default TranslationEditor  // dupla export

// ✅ Helyes: egyetlen export default
export default function TranslationEditor() { }
```

### 5. Package Installation Issues

**Hiba:**
```
Cannot find module '@hello-pangea/dnd'
Cannot find module 'tailwindcss-animate'
Cannot find module 'lucide-react'
```

**Megoldás:**
```bash
npm install @hello-pangea/dnd --save
npm install lucide-react
npm install tailwindcss-animate

# Shadcn/ui komponensek telepítése
npx shadcn@latest init
npx shadcn@latest add button input label card select textarea alert
```

### 7. Database RLS Policy UUID/Text Type Mismatch

**Hiba:**
```sql
ERROR: 42883: operator does not exist: uuid = text
HINT: No operator matches the given name and argument types. You might need to add explicit type casts.
```

**Oka:**
- UUID és TEXT típusok összehasonlítása explicit type cast nélkül
- PostgreSQL nem engedi automatikus UUID-TEXT konverziót

**Megoldás:**
```sql
-- ❌ Rossz: UUID = TEXT
WHERE admin_users.id = auth.uid()::text

-- ✅ Helyes: UUID::TEXT = TEXT
WHERE admin_users.id::text = auth.uid()::text
```

### 9. Audit Log API 400 Bad Request Error

**Hiba:**
```
POST http://localhost:3000/api/admin/audit-log 400 (Bad Request)
Missing required fields: user_id, user_email
```

**Oka:**
- Audit log API user_id és user_email mezőket vár
- Komponensek nem küldik el az admin user információkat
- API hívás hiányos adatokkal történik

**Megoldás:**
```typescript
// ❌ Rossz: hiányzó user adatok
body: JSON.stringify({
  action,
  resource_type: 'quiz_question',
  resource_id: resourceId
})

// ✅ Helyes: admin user adatok átadása
interface ComponentProps {
  quizId: string
  adminUser: AdminUser  // Add admin user prop
}

body: JSON.stringify({
  user_id: adminUser.id,
  user_email: adminUser.email,
  action,
  resource_type: 'quiz_question',
  resource_id: resourceId,
  details
})
```

## 🔧 Módosított Fájlok

### Core Architecture Changes

1. **src/lib/supabase.ts** - Singleton pattern implementálás
2. **src/lib/supabase-admin.ts** - Server-only Supabase client
3. **src/lib/audit-log.ts** - Audit logging szolgáltatás
4. **src/app/api/admin/audit-log/route.ts** - API endpoint audit log-hoz

### Component Updates

1. **src/app/admin/components/questions-editor.tsx** - Fő Questions Editor komponens
2. **src/app/admin/components/scoring-rules-editor.tsx** - Scoring Rules Editor komponens
3. **src/app/admin/components/simple-translation-editor.tsx** - useMemo hozzáadása
4. **src/app/admin/components/translation-editor.tsx** - useMemo + export fix
5. **src/app/admin/quizzes/[id]/edit/components/quiz-edit-form.tsx** - Tab rendszer + új tabok

### Database Schema

1. **src/types/database.ts** - AuditLog interface + ExtendedScoringRule frissítés
2. **supabase/migrations/20250814160000_create_audit_logs.sql** - Audit logs tábla
3. **supabase/migrations/20250814170000_scoring_rules_enhancements.sql** - Scoring rules RLS

### UI Components

1. **src/components/ui/*.tsx** - Shadcn/ui komponensek (button, input, card, stb.)
2. **src/lib/utils.ts** - Shadcn/ui utility funkciók

### Legacy Code Fixes

1. **src/app/[lang]/[quizSlug]/page.tsx** - supabase import javítás

## 🎯 Best Practices Learned

### 1. Client/Server Separation
```typescript
// Client-side: src/lib/supabase.ts
export const createClient = () => { /* browser safe */ }

// Server-side: src/lib/supabase-admin.ts  
export const supabaseAdmin = createClient(/* with service role */)
```

### 2. React Optimization
```typescript
// useMemo használata client létrehozásához
const supabase = useMemo(() => createClient(), [])
```

### 3. Error Boundaries
```typescript
// Audit log hibák ne törjék el a fő funkciót
try {
  await createAuditLogEntry(...)
} catch (auditError) {
  console.error('Failed to create audit log:', auditError)
  // Continue with main operation
}
```

### 4. API Design
```typescript
// Clear API endpoints
POST /api/admin/audit-log
POST /api/admin/questions  
GET /api/admin/questions/:id
POST /api/admin/scoring-rules
GET /api/admin/scoring-rules/:id
```

### 5. Component State Management
```typescript
// Complex state objects kezelése
interface ExtendedScoringRule extends BaseRule {
  category?: string
  // ... more optional fields
}

// Safe field access
const value = rule.category || ''
const score = rule.min_score || 0
```

### 6. JSONB Data Structure
```typescript
// Database JSONB field használata
const ruleData = {
  weights: {
    category: rule.category,
    weight: rule.weight,
    min_score: rule.min_score,
    // ... structured data
  }
}
```

## 🚀 Következő Fejlesztésekhez

### Environment Variables Checklist
```bash
# .env.local szükséges változók:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Csak server-side!
```

### Testing Checklist
- [ ] Hot Reload működik hibamentesen
- [ ] Client/Server components külön működnek
- [ ] API endpoints válaszolnak
- [ ] Database RLS policies működnek
- [ ] Audit logs létrejönnek

### Common Patterns
```typescript
// 1. Client komponens structure
'use client'
import { useMemo } from 'react'
const supabase = useMemo(() => createClient(), [])

// 2. Server API structure  
import { supabaseAdmin } from '@/lib/supabase-admin'
export async function POST() { /* server logic */ }

// 3. Audit logging pattern
await fetch('/api/admin/audit-log', { /* audit data */ })
```

## 8. Database Schema Mismatches ⚠️

### AI Prompts Table Name Issue
**Problem**: API returns 500 error with "Could not find the table 'quiz_prompts'"
**Root Cause**: Database has `quiz_ai_prompts` table, but code references `quiz_prompts`
**Solution**: 
```typescript
// Use correct table name in API routes
await supabase.from('quiz_ai_prompts').select('*')
```

### Field Name Mismatches
**Problem**: Components use different field names than database schema
**Root Cause**: Frontend uses `user_prompt`, DB uses `user_prompt_template`
**Solution**:
```typescript
// Map frontend fields to DB fields
user_prompt_template: user_prompt // when inserting/updating
user_prompt: prompt.user_prompt_template // when reading
```

### Quick Fix Reference
```bash
# Check table name in Supabase
# Look for hint in error: "Perhaps you meant the table 'public.quiz_ai_prompts'"
# Update API route to use suggested table name
```

Ez a dokumentáció segít a jövőbeli hasonló hibák gyors azonosításában és megoldásában! 📚
