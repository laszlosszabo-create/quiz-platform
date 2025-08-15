# AI Prompts CRUD - Technical Notes

## Zod Schemas Architecture

A `/src/lib/zod-schemas.ts` fájl központosítja az AI prompts validációs logikáját:

**Fő Komponensek:**
- **aiPromptCreateSchema**: Új prompt létrehozásához, kötelező template változók validációval
- **aiPromptUpdateSchema**: Módosításokhoz, ID követelménnyel 
- **aiPromptDeleteSchema**: Törléshez, minimális validációval

**Kötelező Template Változók:**
Minden user prompt tartalmaznia kell: `{{scores}}`, `{{top_category}}`, `{{name}}`

```typescript
const requiredVariables = ['{{scores}}', '{{top_category}}', '{{name}}']
const hasAllVariables = requiredVariables.every(variable => 
  userPrompt.includes(variable)
)
```

## Admin UI Components

A `/src/app/admin/components/ai-prompts-editor.tsx` felelősségei:

**Core Responsibilities:**
1. **State Management**: Form data, loading states, error handling
2. **API Integration**: CRUD operations az `/api/admin/ai-prompts` endpoint-tal
3. **Validation**: Client-side validation + server-side Zod error parsing
4. **User Experience**: Language switching, success/error feedback, audit logging

**Key Features:**
- Multi-language prompt editing (HU/EN)
- Real-time OpenAI API testing
- Comprehensive error handling with field-specific messages
- Client-side audit log creation for user activity tracking

## Route.ts Security Architecture

A `/src/app/api/admin/ai-prompts/route.ts` védelmi rétegei:

```
Request → Authentication → Authorization → Validation → Database → Audit → Response
```

**1. Authentication**: `getAdminUser()` - admin session ellenőrzés
**2. Authorization**: Role-based access (`owner`/`editor` for mutations)
**3. Validation**: Zod schema validation az összes inputra
**4. Database**: Supabase operations with proper error handling
**5. Audit**: Comprehensive logging before/after states
**6. Response**: Structured JSON with success/error indicators

**Security Features:**
- SQL injection protection (Supabase ORM)
- Input sanitization (Zod schemas)
- Role-based authorization
- Audit trail minden művelethez
- Proper error handling information disclosure nélkül
