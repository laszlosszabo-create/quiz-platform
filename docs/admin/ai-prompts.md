# AI Prompts Editor

## Overview

Az AI Prompts Editor lehetővé teszi az adminisztrátorok számára, hogy nyelvspecifikus AI promptokat kezelhessenek a kvíz eredmények személyre szabott értékeléséhez. Az editor teljes CRUD (Create, Read, Update, Delete) funkcionalitást biztosít Zod validációval, szerepkör-alapú hozzáféréssel és audit naplózással.

### Funkciók
- **Többnyelvű támogatás**: HU/EN nyelvű promptok kezelése
- **Template változók**: Automatikus validáció a kötelező változókhoz (`{{scores}}`, `{{top_category}}`, `{{name}}`)
- **AI Provider támogatás**: OpenAI és Anthropic modellek konfigurálása
- **Szerepkör-alapú hozzáférés**: Csak `owner` és `editor` szerepkörök módosíthatnak
- **Audit trail**: Minden változtatás naplózása before/after diff-fel
- **Real-time validáció**: Azonnali hibakezelés és felhasználóbarát hibaüzenetek

## API Specifikáció

### Base URL
```
/api/admin/ai-prompts
```

### Authentication
Minden endpoint admin authentikációt igényel. CRUD műveletek (POST/PUT/DELETE) `owner` vagy `editor` szerepkört igényelnek.

### Endpoints

#### GET - List Prompts
```http
GET /api/admin/ai-prompts?quiz_id={quiz_id}
```

**Query Parameters:**
- `quiz_id` (required): A kvíz UUID-ja

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "quiz_id": "uuid", 
      "lang": "hu",
      "system_prompt": "You are a helpful AI assistant...",
      "user_prompt_template": "Based on quiz results {{scores}}...",
      "ai_provider": "openai",
      "ai_model": "gpt-4o",
      "created_at": "2025-08-15T10:00:00Z",
      "updated_at": "2025-08-15T10:00:00Z"
    }
  ]
}
```

#### POST - Create Prompt
```http
POST /api/admin/ai-prompts
Content-Type: application/json
```

**Request Body:**
```json
{
  "quiz_id": "uuid",
  "lang": "hu",
  "system_prompt": "You are a helpful AI assistant for quiz results.",
  "user_prompt": "Based on the quiz results {{scores}} and top category {{top_category}}, create personalized feedback for {{name}}.",
  "ai_provider": "openai",
  "ai_model": "gpt-4o"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quiz_id": "uuid",
    "lang": "hu",
    "system_prompt": "You are a helpful AI assistant...",
    "user_prompt_template": "Based on quiz results...",
    "ai_provider": "openai", 
    "ai_model": "gpt-4o",
    "created_at": "2025-08-15T10:00:00Z",
    "updated_at": "2025-08-15T10:00:00Z"
  }
}
```

#### PUT - Update Prompt
```http
PUT /api/admin/ai-prompts
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "uuid",
  "quiz_id": "uuid", 
  "lang": "hu",
  "system_prompt": "Updated system prompt...",
  "user_prompt": "Updated user prompt with {{scores}}, {{top_category}}, {{name}}...",
  "ai_provider": "openai",
  "ai_model": "gpt-4o"
}
```

#### DELETE - Delete Prompt
```http
DELETE /api/admin/ai-prompts?id={id}&quiz_id={quiz_id}
```

**Query Parameters:**
- `id` (required): Prompt UUID
- `quiz_id` (required): Quiz UUID

**Response (200):**
```json
{
  "success": true,
  "message": "AI prompt deleted successfully"
}
```

## Validation Rules

### Zod Schemas

A következő Zod sémák biztosítják az input validációt:

#### Create Schema (`aiPromptCreateSchema`)
```typescript
{
  quiz_id: z.string().uuid(),
  lang: z.enum(["hu", "en"]),
  system_prompt: z.string().min(10),
  user_prompt: z.string().min(20).refine(/* required variables check */),
  ai_provider: z.enum(["openai", "anthropic"]),
  ai_model: z.string().min(3)
}
```

#### Update Schema (`aiPromptUpdateSchema`)
```typescript
{
  id: z.string().uuid(),
  quiz_id: z.string().uuid(),
  // ... same fields as create
}
```

#### Delete Schema (`aiPromptDeleteSchema`)
```typescript
{
  id: z.string().uuid(),
  quiz_id: z.string().uuid()
}
```

### Kötelező Template Változók

Minden `user_prompt` tartalmaznia kell a következő változókat:
- `{{scores}}` - Kvíz pontszámok
- `{{top_category}}` - Legmagasabb kategória
- `{{name}}` - Felhasználó neve

**Hibakezelés:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["user_prompt"],
      "message": "Missing required variables: {{scores}}, {{name}}"
    }
  ]
}
```

## Authentication & Roles

### Szerepkör Követelmények
- **GET**: Bármilyen admin szerepkör (`owner`, `editor`, `viewer`)
- **POST/PUT/DELETE**: Csak `owner` és `editor` szerepkörök

### Authorization Hibák
```json
{
  "error": "Unauthorized - requires owner or editor role"
}
```

## Audit Logging

Minden CRUD művelet audit logot generál a következő formátumban:

### Create Operation
```json
{
  "user_id": "uuid",
  "user_email": "admin@example.com", 
  "action": "CREATE_PROMPT",
  "resource_type": "quiz_prompt",
  "resource_id": "uuid",
  "details": {
    "created": {
      "quiz_id": "uuid",
      "lang": "hu",
      "system_prompt": "...",
      "user_prompt_template": "...",
      "ai_provider": "openai",
      "ai_model": "gpt-4o"
    }
  }
}
```

### Update Operation  
```json
{
  "user_id": "uuid",
  "user_email": "admin@example.com",
  "action": "UPDATE_PROMPT", 
  "resource_type": "quiz_prompt",
  "resource_id": "uuid",
  "details": {
    "before": { /* previous values */ },
    "after": { /* new values */ }
  }
}
```

### Delete Operation
```json
{
  "user_id": "uuid", 
  "user_email": "admin@example.com",
  "action": "DELETE_PROMPT",
  "resource_type": "quiz_prompt", 
  "resource_id": "uuid",
  "details": {
    "deleted": { /* all deleted fields */ }
  }
}
```

## How to Test

### UI Testing (Manual)

1. **Bejelentkezés Admin felületre**
   ```
   http://localhost:3000/admin/login
   Credentials: owner/editor email + password
   ```

2. **Kvíz szerkesztése**
   ```
   http://localhost:3000/admin/quizzes/{quiz_id}/edit
   -> AI Prompts tab
   ```

3. **CRUD Tesztelés**
   - **Create**: Új prompt létrehozása HU/EN nyelven
   - **Read**: Prompt lista betöltése
   - **Update**: Meglévő prompt szerkesztése  
   - **Delete**: Prompt törlése megerősítéssel

4. **Validáció Tesztelése**
   - Hiányos mezők (hibaüzenet megjelenése)
   - Kötelező változók hiánya (`{{scores}}`, `{{top_category}}`, `{{name}}`)
   - Szerepkör-alapú hozzáférés (viewer nem tud módosítani)

### API Testing (Automated)

1. **Test Script futtatása**
   ```bash
   npm run dev  # Dev server indítása
   node test-ai-prompts-crud.js  # Automatikus tesztek
   ```

2. **Manual API Testing**
   ```bash
   # Valid prompt test
   curl -X POST http://localhost:3000/api/admin/ai-prompts \\
     -H "Content-Type: application/json" \\
     -d '{
       "quiz_id": "test-uuid",
       "lang": "hu", 
       "system_prompt": "Test system prompt",
       "user_prompt": "Test with {{scores}}, {{top_category}}, {{name}}",
       "ai_provider": "openai",
       "ai_model": "gpt-4o"
     }'
   
   # Expected: 401 Unauthorized (no auth)
   ```

3. **Validation Testing**
   ```bash
   # Missing required variables
   curl -X POST http://localhost:3000/api/admin/ai-prompts \\
     -H "Content-Type: application/json" \\
     -d '{
       "quiz_id": "test-uuid",
       "lang": "hu",
       "system_prompt": "Test",
       "user_prompt": "Missing variables",
       "ai_provider": "openai", 
       "ai_model": "gpt-4o"
     }'
   
   # Expected: 401 or 400 with validation error
   ```

### Integration Testing

1. **OpenAI Test Endpoint**
   ```
   Admin UI -> AI Prompts tab -> "Test with OpenAI" button
   Expected: Real API call with variable substitution
   ```

2. **Funnel Integration**
   ```
   Public quiz completion -> Result page
   Expected: AI-generated personalized feedback using prompts
   ```

## Acceptance Results ✅

### Core CRUD Functionality
- ✅ **List Prompts**: GET endpoint loads prompts by quiz_id
- ✅ **Create Prompt**: POST endpoint with full validation  
- ✅ **Update Prompt**: PUT endpoint with conflict detection
- ✅ **Delete Prompt**: DELETE endpoint with confirmation

### Multi-language Support  
- ✅ **HU/EN Languages**: Both languages supported and validated
- ✅ **Language Isolation**: Prompts separated by language code
- ✅ **UI Language Switching**: Admin UI switches between HU/EN prompts

### Validation & Error Handling
- ✅ **Zod Validation**: All inputs validated with descriptive errors
- ✅ **Required Variables**: `{{scores}}`, `{{top_category}}`, `{{name}}` enforced
- ✅ **Error Display**: User-friendly error messages in admin UI
- ✅ **Loading States**: Proper loading indicators during CRUD operations

### Security & Authorization
- ✅ **Role Enforcement**: Only owner/editor can modify prompts
- ✅ **Admin Authentication**: All endpoints require valid admin session  
- ✅ **Input Sanitization**: Zod schemas prevent malicious input
- ✅ **Audit Logging**: Complete trail of all CRUD operations

### Integration Points
- ✅ **OpenAI Test Endpoint**: Real API testing from admin UI
- ✅ **Variable Substitution**: Template variables work in test calls
- ✅ **Database Integration**: Proper Supabase RLS and queries
- ✅ **UI Integration**: Seamless integration in quiz edit interface

### Technical Quality
- ✅ **TypeScript**: Full type safety with proper interfaces
- ✅ **Error Boundaries**: Graceful error handling throughout
- ✅ **Performance**: Efficient database queries and UI updates
- ✅ **Code Quality**: Clean, maintainable, well-documented code

## Troubleshooting

Common issues and solutions can be found in [/TROUBLESHOOTING.md](../../TROUBLESHOOTING.md#ai-prompts-editor).
