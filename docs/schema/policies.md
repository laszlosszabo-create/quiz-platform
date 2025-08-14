# Row Level Security Policies

## Overview

A Quiz Platform minden táblájára Row Level Security (RLS) szabályok vonatkoznak, amelyek biztosítják az adatok biztonságos elérését szerepkörök alapján.

## Szerepkörök

### Public (anon)
- **Célfunkció**: Végfelhasználói quiz kitöltés
- **Jogosultságok**: Limitált olvasás aktív quizekhez, sessions írás

### Service Role  
- **Célfunkció**: API automatizmus (webhooks, email)
- **Jogosultságok**: Teljes hozzáférés szükség szerint

### Admin Roles
- **owner**: Teljes hozzáférés + felhasználókezelés
- **editor**: Tartalom szerkesztés
- **viewer**: Csak olvasás

## Helper Functions

### is_admin()
```sql
-- Ellenőrzi, hogy az aktuális felhasználó admin-e (owner/editor)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'service_role' OR 
           EXISTS (
               SELECT 1 FROM admin_users 
               WHERE email = auth.email() 
               AND role IN ('owner', 'editor')
           );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### is_admin_viewer()
```sql
-- Ellenőrzi, hogy az aktuális felhasználó legalább viewer
CREATE OR REPLACE FUNCTION is_admin_viewer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'service_role' OR 
           EXISTS (
               SELECT 1 FROM admin_users 
               WHERE email = auth.email() 
               AND role IN ('owner', 'editor', 'viewer')
           );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Táblánkénti Policies

### 1. quizzes

#### Public Access
```sql
-- Csak aktív quizek olvasható publikusan
CREATE POLICY quizzes_public_select ON quizzes
    FOR SELECT
    USING (status = 'active');
```

#### Admin Access
```sql
-- Admin teljes hozzáférés
CREATE POLICY quizzes_admin_all ON quizzes
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 2. quiz_translations

#### Public Access
```sql
-- Aktív quizek fordításai olvashatók
CREATE POLICY quiz_translations_public_select ON quiz_translations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_translations.quiz_id 
            AND quizzes.status = 'active'
        )
    );
```

#### Admin Access
```sql
-- Admin teljes hozzáférés
CREATE POLICY quiz_translations_admin_all ON quiz_translations
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 3. quiz_questions

#### Public Access
```sql
-- Aktív quiz kérdések olvashatók
CREATE POLICY quiz_questions_public_select ON quiz_questions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_questions.quiz_id 
            AND quizzes.status = 'active'
        )
    );
```

### 4. quiz_scoring_rules

#### Public Access
```sql
-- Scoring szabályok aktív quizekhez olvashatók
CREATE POLICY quiz_scoring_rules_public_select ON quiz_scoring_rules
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_scoring_rules.quiz_id 
            AND quizzes.status = 'active'
        )
    );
```

### 5. quiz_prompts

#### Restricted Access
```sql
-- Csak admin/service role férhet hozzá (AI prompts érzékenyek)
CREATE POLICY quiz_prompts_admin_select ON quiz_prompts
    FOR SELECT
    USING (is_admin_viewer());
```

### 6. leads

#### Public Insert
```sql
-- Email gate - korlátozott publikus beszúrás
CREATE POLICY leads_public_insert ON leads
    FOR INSERT
    WITH CHECK (
        email IS NOT NULL 
        AND email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
        AND quiz_id IS NOT NULL
    );
```

#### Admin Access
```sql
-- Admin teljes hozzáférés
CREATE POLICY leads_admin_all ON leads
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 7. sessions

#### Public Session Management
```sql
-- Anonymus session létrehozás
CREATE POLICY sessions_public_insert ON sessions
    FOR INSERT
    WITH CHECK (quiz_id IS NOT NULL);

-- Anonymus session frissítés (átmeneti - funnel modulban finomítva)
CREATE POLICY sessions_public_update ON sessions
    FOR UPDATE
    USING (lead_id IS NULL)  -- Anonymous sessions only
    WITH CHECK (lead_id IS NULL);
```

**Megjegyzés**: Session token alapú hozzáférés a funnel modulban lesz implementálva.

### 8. products

#### Public Access
```sql
-- Csak aktív termékek aktív quizekhez
CREATE POLICY products_public_select ON products
    FOR SELECT
    USING (
        active = true AND
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = products.quiz_id 
            AND quizzes.status = 'active'
        )
    );
```

### 9. orders

#### Restricted Access
```sql
-- Csak admin és service role (webhook)
CREATE POLICY orders_admin_all ON orders
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 10. email_events

#### Restricted Access
```sql
-- Csak admin és service role
CREATE POLICY email_events_admin_all ON email_events
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 11. admin_users

#### Admin Only
```sql
-- Csak admin férhet hozzá
CREATE POLICY admin_users_admin_all ON admin_users
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
```

### 12. audit_logs

#### Read-Only Audit
```sql
-- Olvasás adminoknak
CREATE POLICY audit_logs_admin_select ON audit_logs
    FOR SELECT
    USING (is_admin_viewer());

-- Beszúrás admin műveleteknél
CREATE POLICY audit_logs_admin_insert ON audit_logs
    FOR INSERT
    WITH CHECK (is_admin());
```

## Biztonsági Elvek

### Quiz ID Szeparáció
- Minden quiz-specifikus adat `quiz_id` alapján szűrve
- Publikus hozzáférés csak `active` quiz státuszú adatokhoz

### Admin Hozzáférés Szintek
- **Service Role**: Automatikus rendszerfolyamatok
- **Owner/Editor**: Teljes tartalom menedzsment  
- **Viewer**: Csak olvasási jogosultság

### Session Biztonság
- Anonymous sessionökhöz korlátozott hozzáférés
- Lead-hez kötött sessionök csak admin számára
- Token-alapú hozzáférés későbbi implementáció

### Validációs Rétegeek
- Email formátum ellenőrzése lead beszúrásnál
- Kötelező mezők ellenőrzése policy szinten
- Foreign key integritás CASCADE és SET NULL szabályokkal

## Tesztelési Stratégia

### Public Role Tesztelés
```sql
-- Anon role-ra váltás
SET ROLE anon;

-- Aktív quiz olvasás tesztelése
SELECT * FROM quizzes WHERE status = 'active';

-- Draft quiz olvasás - üres eredmény várható
SELECT * FROM quizzes WHERE status = 'draft';
```

### Admin Role Tesztelés  
```sql
-- Service role-ra váltás
SET ROLE service_role;

-- Teljes hozzáférés tesztelése
SELECT COUNT(*) FROM quizzes;
INSERT INTO quizzes (slug, status) VALUES ('test', 'draft');
```
