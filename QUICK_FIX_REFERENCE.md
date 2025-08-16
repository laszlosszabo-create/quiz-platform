# Quick Fix Reference Card

## 🚨 Most Common Issues & Solutions

### 1. Multiple GoTrueClient Warning
```typescript
// ❌ Wrong: new client every render
const supabase = createClient()

// ✅ Right: useMemo + singleton
const supabase = useMemo(() => createClient(), [])
```

### 2. Client Imports Server Module
```bash
# Error: Missing Supabase admin environment variables
```
**Solution**: Create API route, use fetch instead of direct import

### 3. Import Errors
```typescript
// ❌ Wrong: old import name  
import { supabase } from '@/lib/supabase'

// ✅ Right: current export
import { createClient } from '@/lib/supabase'
```

### 4. Missing Dependencies
```bash
npm install @hello-pangea/dnd --save
npm install lucide-react tailwindcss-animate
npx shadcn@latest init
npx shadcn@latest add button input label card select textarea alert
```

### 5. Database RLS UUID/Text Error
```sql
-- ❌ Wrong: UUID = TEXT
WHERE id = auth.uid()::text

-- ✅ Right: UUID::TEXT = TEXT  
WHERE id::text = auth.uid()::text
```

### 7. Audit Log 400 Error
```typescript
// ❌ Wrong: missing user data
body: JSON.stringify({ action, resource_type, resource_id })

// ✅ Right: include admin user
body: JSON.stringify({ 
  user_id: adminUser.id, 
  user_email: adminUser.email,
  action, resource_type, resource_id 
})
```

## 🔧 File Quick Reference

| File | Purpose | Key Pattern |
|------|---------|-------------|
| `supabase.ts` | Client-side DB | Singleton + useMemo |
| `supabase-admin.ts` | Server-side DB | Service role key |
| `api/*/route.ts` | API endpoints | Server-side logic |
| `components/*.tsx` | React components | 'use client' + useMemo |

## 🎯 Architecture Rules

1. **Client components** → Use `createClient()` with useMemo
2. **Server components** → Use `supabaseAdmin` directly  
3. **API routes** → Bridge client-server operations
4. **Audit logging** → Always via API, never direct from client

## 🚀 Quick Debug Steps

1. Check import paths and names
2. Verify environment variables
3. Ensure proper client/server separation
4. Add useMemo for Supabase clients
5. Check for missing dependencies
