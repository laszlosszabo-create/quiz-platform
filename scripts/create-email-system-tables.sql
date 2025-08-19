-- Email System Database Schema
-- Created: 2025-08-19

-- 1. Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT, -- NULL = quiz level, filled = product level
    template_type TEXT NOT NULL, -- 'result', 'purchase', 'reminder', 'custom'
    lang TEXT NOT NULL DEFAULT 'hu',
    template_name TEXT NOT NULL,
    subject_template TEXT NOT NULL,
    body_markdown TEXT NOT NULL, -- Markdown format for AI content
    body_html TEXT, -- Generated HTML from markdown
    variables JSONB DEFAULT '{}', -- Available template variables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, product_id, template_type, lang)
);

-- 2. Email Automation Rules Table
CREATE TABLE IF NOT EXISTS email_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT, -- NULL = quiz level, specific product = product level
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL, -- 'quiz_complete', 'purchase', 'no_purchase_reminder'
    trigger_conditions JSONB NOT NULL, -- Conditions for trigger
    email_template_id UUID NOT NULL REFERENCES email_templates(id),
    delay_minutes INTEGER DEFAULT 0, -- Send delay in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Email Queue Table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    template_id UUID NOT NULL REFERENCES email_templates(id),
    automation_rule_id UUID REFERENCES email_automation_rules(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_markdown TEXT,
    variables_used JSONB DEFAULT '{}', -- Variables that were substituted
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    error_message TEXT,
    provider_message_id TEXT, -- Resend message ID
    provider_response JSONB,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Email Analytics Table
CREATE TABLE IF NOT EXISTS email_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_queue_id UUID NOT NULL REFERENCES email_queue(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_templates_quiz_product ON email_templates(quiz_id, product_id, template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_email_automation_rules_quiz ON email_automation_rules(quiz_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_rules_active ON email_automation_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled ON email_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_session ON email_queue(session_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_sent_at ON email_queue(sent_at);

CREATE INDEX IF NOT EXISTS idx_email_analytics_queue_event ON email_analytics(email_queue_id, event_type);
CREATE INDEX IF NOT EXISTS idx_email_analytics_created_at ON email_analytics(created_at);

-- Insert default email templates for testing
DO $$
BEGIN
    -- Default Result Email Template (Hungarian)
    INSERT INTO email_templates (
        quiz_id, 
        template_type, 
        lang,
        template_name,
        subject_template,
        body_markdown,
        variables
    ) 
    SELECT 
        id as quiz_id,
        'result' as template_type,
        'hu' as lang,
        'Quiz Eredmény Email' as template_name,
        '{{quiz_title}} - Az Ön Eredménye ({{score}} pont)' as subject_template,
        '# Kedves {{user_name}}!

Köszönjük, hogy kitöltötte a **{{quiz_title}}** kvízünket!

## Az Ön Eredménye

**Pontszám:** {{score}} pont ({{percentage}}%)  
**Kategória:** {{category}}

## AI Elemzés

{{ai_result}}

## Következő Lépések

- 📊 [Részletes elemzés megtekintése]({{result_url}})
- 📞 [Konzultáció foglalása]({{booking_url}})
- 📥 [Anyagok letöltése]({{download_url}})

Üdvözlettel,  
A Quiz Platform Csapata

---
*Ha nem szeretne több emailt kapni, [kattintson ide]({{unsubscribe_url}}) a leiratkozáshoz.*' as body_markdown,
        '{
            "user_name": "Felhasználó neve",
            "user_email": "Email címe", 
            "quiz_title": "Quiz címe",
            "score": "Pontszám",
            "percentage": "Százalékos eredmény",
            "category": "Eredmény kategória",
            "ai_result": "AI generált elemzés",
            "result_url": "Eredmény oldal URL",
            "booking_url": "Foglalási URL",
            "download_url": "Letöltési URL",
            "unsubscribe_url": "Leiratkozási URL"
        }'::jsonb as variables
    FROM quizzes 
    WHERE slug = 'adhd-quick-check'
    ON CONFLICT (quiz_id, product_id, template_type, lang) 
    DO NOTHING;

    -- Default Purchase Confirmation Template (Hungarian)
    INSERT INTO email_templates (
        quiz_id,
        template_type,
        lang,
        template_name, 
        subject_template,
        body_markdown,
        variables
    )
    SELECT 
        id as quiz_id,
        'purchase' as template_type,
        'hu' as lang,
        'Vásárlási Visszaigazolás' as template_name,
        '✅ Sikeres vásárlás - {{product_name}}' as subject_template,
        '# Kedves {{user_name}}!

Köszönjük a vásárlást! 🎉

## Rendelés Részletei

**Termék:** {{product_name}}  
**Vásárlás dátuma:** {{purchase_date}}  
**Összeg:** {{amount}} {{currency}}

## Az Ön Quiz Eredménye

**Pontszám:** {{score}} pont  
**AI Elemzés:**

{{ai_result}}

## Hozzáférés a Termékhez

{{saved_analysis_code}}

- 🔗 [Termék elérése]({{product_url}})
- 📥 [Anyagok letöltése]({{download_url}}) 
- 📞 [Konzultáció foglalása]({{booking_url}})

Sikeres felhasználást kívánunk!

A Quiz Platform Csapata

---
*Kérdés esetén válaszoljon erre az emailre vagy írjon nekünk.*' as body_markdown,
        '{
            "user_name": "Vásárló neve",
            "product_name": "Termék neve",
            "purchase_date": "Vásárlás dátuma",
            "amount": "Vásárolt összeg", 
            "currency": "Pénznem",
            "score": "Quiz pontszám",
            "ai_result": "AI elemzés",
            "saved_analysis_code": "Mentett elemzés kódja",
            "product_url": "Termék URL",
            "download_url": "Letöltés URL",
            "booking_url": "Foglalás URL"
        }'::jsonb as variables
    FROM quizzes 
    WHERE slug = 'adhd-quick-check'
    ON CONFLICT (quiz_id, product_id, template_type, lang) 
    DO NOTHING;

    -- Default Reminder Email Template (Hungarian) 
    INSERT INTO email_templates (
        quiz_id,
        template_type,
        lang,
        template_name,
        subject_template,
        body_markdown, 
        variables
    )
    SELECT 
        id as quiz_id,
        'reminder' as template_type,
        'hu' as lang,
        'Emlékeztető Email' as template_name,
        '⏰ Ne feledkezzen meg - {{quiz_title}} eredményéről' as subject_template,
        '# Kedves {{user_name}}!

Néhány órája kitöltötte a **{{quiz_title}}** kvízünket, de még nem nézte meg a részletes eredményét.

## Az Ön Eredménye

**Pontszám:** {{score}} pont ({{percentage}}%)

## Miért érdemes megnézni?

- 🧠 **AI alapú személyre szabott elemzés** 
- 📊 **Részletes kategória bontás**
- 💡 **Személyre szabott ajánlások**
- 🎯 **Következő lépések útmutatója**

## Exkluzív Ajánlat

Mai napon **20% kedvezmény** a személyre szabott konzultációból!

[**🔍 Eredmény megtekintése most**]({{result_url}})

---

Ha már nem szeretne emlékeztetőket kapni, [kattintson ide]({{unsubscribe_url}}).

Üdvözlettel,  
A Quiz Platform Csapata' as body_markdown,
        '{
            "user_name": "Felhasználó neve",
            "quiz_title": "Quiz címe",
            "score": "Pontszám",
            "percentage": "Százalékos eredmény", 
            "result_url": "Eredmény URL",
            "unsubscribe_url": "Leiratkozás URL"
        }'::jsonb as variables
    FROM quizzes 
    WHERE slug = 'adhd-quick-check'
    ON CONFLICT (quiz_id, product_id, template_type, lang) 
    DO NOTHING;

    RAISE NOTICE 'Email system tables created and seeded successfully!';
END $$;
