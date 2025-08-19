# Email Automation System - Tervezési Dokumentum
*Tervezés dátuma: 2025. augusztus 19.*

## 📋 Követelmények Elemzés

### Felhasználói Igények
1. **Automatikus eredmény küldés** - Quiz kitöltése után
2. **Vásárlási visszaigazolás** - Termék vásárlás után
3. **Emlékeztető emailek** - Elemzést kérte, de nem vásárolt
4. **Ütemezett küldés** - Időzített email kampányok
5. **Template szerkesztés** - Drag & drop email builder
6. **Markdown támogatás** - AI által generált tartalom formázása

## 🏗️ Rendszer Architektúra

### Meglévő Adatbázis Elemek ✅
```sql
-- Rendelések nyomon követése
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id),
    quiz_id UUID NOT NULL REFERENCES quizzes(id), 
    product_id TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status order_status NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email események nyomon követése  
CREATE TABLE email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id),
    email_type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status email_status NOT NULL DEFAULT 'queued',
    provider_id TEXT,
    provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Új Táblák Szükségesek 🆕

#### 1. Email Templates
```sql
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT, -- NULL = quiz level, filled = product level
    template_type TEXT NOT NULL, -- 'result', 'purchase', 'reminder'
    lang TEXT NOT NULL DEFAULT 'hu',
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL, -- Markdown format
    html_template TEXT, -- Generated from markdown
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, product_id, template_type, lang)
);
```

#### 2. Email Automation Rules  
```sql
CREATE TABLE email_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT, -- NULL = quiz level
    rule_name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- 'quiz_complete', 'purchase', 'no_purchase'
    conditions JSONB NOT NULL, -- Trigger conditions
    delay_minutes INTEGER DEFAULT 0, -- Send delay in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. Email Queue
```sql  
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id),
    template_id UUID NOT NULL REFERENCES email_templates(id),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_markdown TEXT,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    error_message TEXT,
    provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎨 Admin UI - Email Sablonok Tab

### Tab Struktúra
```typescript
interface EmailTab {
  sections: [
    'automation_rules',    // Automatizálási szabályok
    'template_editor',     // Email sablon szerkesztő  
    'schedule_manager',    // Ütemezett küldések
    'analytics_dashboard'  // Email statisztikák
  ]
}
```

### 1. Automatizálási Szabályok Szerkesztő
```typescript
interface AutomationRule {
  id: string
  name: string
  trigger: {
    type: 'quiz_complete' | 'purchase' | 'no_purchase_after_hours'
    conditions: {
      quiz_completed: boolean
      product_purchased?: string
      hours_after_quiz?: number
      min_score?: number
      score_category?: 'low' | 'medium' | 'high'
    }
  }
  actions: {
    send_email: {
      template_id: string
      delay_minutes: number
    }
  }
  is_active: boolean
}
```

**UI Elemek:**
- ✅ **Eredményt küldje automatikusan?** - Toggle + delay beállítás
- ✅ **Megvásárolt terméket küldje?** - Product-specific togglek  
- ✅ **Emlékeztető küldés?** - Hours after quiz, no purchase
- ✅ **Mikor küldje?** - Delay in minutes/hours/days

### 2. Email Template Editor

**Template Types:**
- `result` - Quiz eredmény email
- `purchase` - Vásárlási visszaigazolás
- `reminder` - Emlékeztető email
- `custom` - Egyedi kampány

**Editor Funkciók:**
- **Rich Text Editor** - WYSIWYG szerkesztő
- **Markdown támogatás** - AI generált tartalom
- **Variable Insertion** - Template változók
- **Preview Mode** - Élő előnézet
- **Mobile Responsive** - Mobil optimalizáció

### 3. Template Variables (Bővített)

**Alapvető változók:**
- `{{user_name}}` - Felhasználó neve
- `{{user_email}}` - Email cím
- `{{quiz_title}}` - Quiz címe
- `{{product_name}}` - Termék neve
- `{{score}}` - Quiz pontszám
- `{{category}}` - Eredmény kategória

**🆕 Speciális változók:**
- `{{ai_result}}` - AI generált elemzés (Markdown → HTML)
- `{{purchase_date}}` - Vásárlás dátuma
- `{{download_link}}` - Letöltési linkek
- `{{booking_url}}` - Időpont foglaló link
- `{{unsubscribe_link}}` - Leiratkozás link

**🧠 SQL Based Variables:**
- `{{saved_analysis_code}}` - Kóddal behívott mentett elemzés
- `{{quiz_answers_summary}}` - Válaszok összefoglalása
- `{{personalized_recommendations}}` - Személyre szabott ajánlások

## 🔧 Markdown to HTML Konverter

### Technikai Implementáció
```typescript
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface MarkdownProcessor {
  convertToHtml(markdown: string): string
  sanitizeHtml(html: string): string
  addCustomStyles(html: string): string
}

class EmailMarkdownProcessor implements MarkdownProcessor {
  convertToHtml(markdown: string): string {
    // Custom renderer for email-friendly HTML
    const renderer = new marked.Renderer()
    
    // Custom styles for email clients
    renderer.heading = (text, level) => {
      const styles = {
        1: 'font-size: 24px; font-weight: bold; color: #333; margin: 20px 0 10px 0;',
        2: 'font-size: 20px; font-weight: bold; color: #444; margin: 15px 0 8px 0;',
        3: 'font-size: 18px; font-weight: bold; color: #555; margin: 12px 0 6px 0;'
      }
      
      return `<h${level} style="${styles[level] || styles[3]}">${text}</h${level}>`
    }
    
    renderer.paragraph = (text) => {
      return `<p style="margin: 10px 0; line-height: 1.6; color: #333;">${text}</p>`
    }
    
    return marked(markdown, { renderer })
  }
  
  sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
      ALLOWED_ATTR: ['style']
    })
  }
}
```

## 📤 Email Küldési Logika

### 1. Email Service Provider Integration
```typescript
interface EmailProvider {
  sendEmail(params: EmailParams): Promise<EmailResult>
  getDeliveryStatus(messageId: string): Promise<DeliveryStatus>
}

// Resend.com integráció (meglévő)
class ResendEmailProvider implements EmailProvider {
  async sendEmail(params: EmailParams): Promise<EmailResult> {
    const { data, error } = await resend.emails.send({
      from: 'Quiz Platform <noreply@yoursite.com>',
      to: [params.to],
      subject: params.subject,
      html: params.htmlContent,
      attachments: params.attachments
    })
    
    return { success: !error, messageId: data?.id, error }
  }
}
```

### 2. Queue Processing System
```typescript
interface EmailQueueProcessor {
  processQueue(): Promise<void>
  scheduleEmail(email: QueuedEmail): Promise<void>
  retryFailedEmails(): Promise<void>
}

class EmailQueueProcessor implements EmailQueueProcessor {
  async processQueue(): Promise<void> {
    // Get pending emails
    const pendingEmails = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10)
    
    for (const email of pendingEmails.data || []) {
      await this.sendQueuedEmail(email)
    }
  }
}
```

### 3. Automation Trigger System
```typescript
interface AutomationTrigger {
  onQuizComplete(sessionId: string): Promise<void>
  onPurchase(orderId: string): Promise<void>
  onScheduledReminder(): Promise<void>
}

class EmailAutomationTrigger implements AutomationTrigger {
  async onQuizComplete(sessionId: string): Promise<void> {
    // Get session data
    const session = await getSession(sessionId)
    
    // Find applicable automation rules
    const rules = await getAutomationRules(session.quiz_id, 'quiz_complete')
    
    for (const rule of rules) {
      if (this.evaluateConditions(rule.conditions, session)) {
        await this.scheduleEmail(rule, session)
      }
    }
  }
}
```

## 📊 Email Analytics & Tracking

### Tracking Events
- **Sent** - Email successfully sent
- **Delivered** - Email reached recipient inbox  
- **Opened** - Email was opened (pixel tracking)
- **Clicked** - Links in email were clicked
- **Bounced** - Email bounced back
- **Unsubscribed** - User unsubscribed

### Analytics Dashboard
```typescript
interface EmailAnalytics {
  totalSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  topPerformingTemplates: Template[]
  campaignPerformance: CampaignStats[]
}
```

## 🔄 Implementation Phases

### Phase 1: Database & Basic Templates
1. Create new database tables
2. Basic email template editor
3. Simple automation rules
4. Manual email sending

### Phase 2: Automation & Queue  
1. Automation trigger system
2. Email queue processing
3. Scheduled email sending
4. Retry mechanism for failed emails

### Phase 3: Advanced Features
1. A/B testing for templates
2. Advanced analytics dashboard  
3. Drag & drop email builder
4. Email list segmentation

### Phase 4: AI Integration
1. AI-powered email content generation
2. Send time optimization
3. Subject line optimization
4. Personalized recommendations

## 💾 Data Flow Diagram

```
Quiz Completion → Session Created → Automation Check → Template Selection → Variable Substitution → Markdown Processing → Queue Email → Send Email → Track Events → Update Analytics
                                                                                                      ↓
Purchase Made → Order Created → Purchase Automation → Template Selection → Variable Substitution → Markdown Processing → Queue Email → Send Email → Track Events
                                                              ↓
Time-based → Scheduled Job → Check Conditions → Template Selection → Variable Substitution → Queue Email → Send Email
```

## 🚀 Recommended Tech Stack

### Backend
- **Queue System**: Supabase + PostgreSQL triggers
- **Email Provider**: Resend.com (already integrated)
- **Markdown Parser**: marked.js
- **HTML Sanitizer**: DOMPurify  
- **Template Engine**: Custom React components

### Frontend  
- **Rich Editor**: TipTap or Quill.js
- **Drag & Drop**: React DnD or similar
- **Preview**: Real-time HTML rendering
- **Analytics**: Chart.js or Recharts

### Cron Jobs
- **Email Queue Processing**: Every 1 minute
- **Scheduled Reminders**: Every 15 minutes  
- **Analytics Updates**: Every hour
- **Cleanup Old Emails**: Daily

---

**Következő lépés**: Email Templates tábla létrehozása és alapvető admin UI implementálás.

*Tervezés elkészítve: GitHub Copilot*
*Dátum: 2025. augusztus 19.*
