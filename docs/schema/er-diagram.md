# Entity Relationship Diagram

## Quiz Platform Database Schema

### Core Quiz Entities

```
┌─────────────────┐      ┌─────────────────────┐
│    quizzes      │◄────┤ quiz_translations   │
├─────────────────┤      ├─────────────────────┤
│ id (PK)         │      │ id (PK)             │
│ slug (UNIQUE)   │      │ quiz_id (FK)        │
│ status          │      │ lang                │
│ default_lang    │      │ field_key           │
│ feature_flags   │      │ value               │
│ theme           │      └─────────────────────┘
│ created_at      │              │
│ updated_at      │              │ UNIQUE(quiz_id, lang, field_key)
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐      ┌─────────────────────┐
│ quiz_questions  │      │ quiz_scoring_rules  │
├─────────────────┤      ├─────────────────────┤
│ id (PK)         │      │ id (PK)             │
│ quiz_id (FK)    │      │ quiz_id (FK)        │
│ order           │      │ rule_type           │
│ type            │      │ weights (JSONB)     │
│ key             │      │ thresholds (JSONB)  │
│ help_text       │      └─────────────────────┘
│ options (JSONB) │
│ scoring (JSONB) │      ┌─────────────────────┐
└─────────────────┘      │ quiz_prompts        │
         │               ├─────────────────────┤
         │ UNIQUE(quiz_id, key)   │ id (PK)             │
         │               │ quiz_id (FK)        │
         │               │ lang                │
         │               │ system_prompt       │
         │               │ user_prompt_template│
         │               │ variables (JSONB)   │
         │               └─────────────────────┘
```

### User Journey Entities

```
┌─────────────────┐      ┌─────────────────────┐
│     leads       │      │    sessions         │
├─────────────────┤      ├─────────────────────┤
│ id (PK)         │◄────┤ id (PK)             │
│ quiz_id (FK)    │      │ quiz_id (FK)        │
│ email           │      │ lead_id (FK)        │
│ name            │      │ lang                │
│ lang            │      │ state               │
│ demographics    │      │ answers (JSONB)     │
│ utm (JSONB)     │      │ scores (JSONB)      │
└─────────────────┘      │ result_snapshot     │
         │               │ client_token        │
         │               └─────────────────────┘
         │ 1:N                     │
         ▼                        │
┌─────────────────┐               │
│    orders       │               │
├─────────────────┤               │
│ id (PK)         │               │
│ quiz_id (FK)    │               │
│ lead_id (FK)    │               │
│ product_id (FK) │               │
│ amount_cents    │               │
│ currency        │               │
│ stripe_payment_intent (UNIQUE)  │
│ status          │               │
└─────────────────┘               │
         │                        │
         │ N:1                    │ 1:N
         ▼                        ▼
┌─────────────────┐      ┌─────────────────────┐
│   products      │      │   email_events      │
├─────────────────┤      ├─────────────────────┤
│ id (PK)         │      │ id (PK)             │
│ quiz_id (FK)    │      │ lead_id (FK)        │
│ active          │      │ template_key        │
│ price_cents     │      │ lang                │
│ currency        │      │ status              │
│ stripe_price_id │      │ metadata (JSONB)    │
│ delivery_type   │      └─────────────────────┘
│ asset_url       │
│ translations    │
└─────────────────┘
```

### Admin & Audit Entities

```
┌─────────────────┐      ┌─────────────────────┐
│  admin_users    │      │   audit_logs        │
├─────────────────┤      ├─────────────────────┤
│ id (PK)         │◄────┤ id (PK)             │
│ email (UNIQUE)  │      │ actor_id (FK)       │
│ role            │      │ action              │
└─────────────────┘      │ entity              │
                         │ entity_id           │
                         │ diff (JSONB)        │
                         │ created_at          │
                         └─────────────────────┘
```

## Key Relationships

### Foreign Key Constraints
- **CASCADE DELETE**: quiz_translations, quiz_questions, quiz_prompts, quiz_scoring_rules
- **SET NULL**: sessions.lead_id, audit_logs.actor_id  
- **RESTRICT**: orders.product_id, orders.lead_id

### Unique Constraints
- `quizzes.slug` - URL-friendly quiz identifier
- `quiz_translations(quiz_id, lang, field_key)` - One translation per field per language
- `quiz_questions(quiz_id, key)` - Unique question keys within quiz
- `orders.stripe_payment_intent` - Prevents duplicate payments
- `admin_users.email` - One admin per email

### Indexes for Performance
- `quiz_translations(quiz_id, lang)` - Fast language-specific lookups
- `quiz_questions(quiz_id, order)` - Sequential question loading
- `sessions(quiz_id, state)` - Analytics and completion tracking
- `leads(quiz_id)` - Quiz-specific lead lists
- `leads(email)` - Duplicate email detection

## Enums

### quiz_status
- `draft` - Under development
- `active` - Live and accepting responses
- `archived` - Completed but preserved

### question_type
- `single` - Single choice selection
- `multi` - Multiple choice selection  
- `scale` - Numeric scale (1-5, 1-10, etc.)

### session_state
- `started` - Quiz begun but not completed
- `completed` - All questions answered

### order_status  
- `paid` - Successfully processed payment
- `refunded` - Payment returned to customer
- `failed` - Payment processing failed

### admin_role
- `owner` - Full system access including user management
- `editor` - Content creation and modification access
- `viewer` - Read-only access to data and reports
