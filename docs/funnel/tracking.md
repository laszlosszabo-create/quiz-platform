# Event Tracking System

## Overview

A quiz platform minden felhasználói interakciót követ az analitikai elemzéshez és a funnel optimalizáláshoz. Az események a `tracking_events` táblába kerülnek strukturált JSON formátumban.

## Event Types (9 db implementálva)

### 1. `page_view`
**Trigger**: Minden oldal betöltéskor  
**Payload**:
```typescript
{
  event_name: "page_view",
  data: {
    quiz_slug: string,
    page_type: "landing" | "quiz" | "result",
    lang: string,
    session_id?: string,
    url: string,
    user_agent: string
  }
}
```

### 2. `cta_click`
**Trigger**: CTA gomb kattintáskor (landing page)
**Payload**:
```typescript
{
  event_name: "cta_click", 
  data: {
    quiz_slug: string,
    lang: string,
    cta_text: string,
    session_id?: string
  }
}
```

### 3. `quiz_start` 
**Trigger**: Első kérdés megjelenítésekor  
**Payload**:
```typescript
{
  event_name: "quiz_start",
  data: {
    quiz_slug: string,
    session_id: string,
    lang: string,
    question_count: number
  }
}
```

### 4. `answer_select`
**Trigger**: Minden válasz kiválasztásakor  
**Payload**:
```typescript
{
  event_name: "answer_select",
  data: {
    quiz_slug: string,
    session_id: string,
    question_key: string,
    answer_value: number,
    question_number: number,
    lang: string
  }
}
```

### 5. `email_submitted`
**Trigger**: Email cím megadásakor az email gate-nél
**Payload**:
```typescript
{
  event_name: "email_submitted",
  data: {
    quiz_slug: string,
    session_id: string,
    email: string,
    lead_id: string,
    lang: string
  }
}
```

### 6. `quiz_complete`
**Trigger**: Utolsó kérdés beküldésekor
**Payload**:
```typescript
{
  event_name: "quiz_complete",
  data: {
    quiz_slug: string,
    session_id: string,
    total_questions: number,
    completion_time_seconds: number,
    lang: string
  }
}
```

### 7. `product_view`
**Trigger**: Eredmény oldal betöltésekor (termék megjelenítés)
**Payload**:
```typescript
{
  event_name: "product_view",
  data: {
    quiz_slug: string,
    session_id: string,
    product_id: string,
    product_name: string,
    price: number,
    lang: string
  }
}
```

### 8. `booking_view`
**Trigger**: Booking link megtekintésekor
**Payload**:
```typescript
{
  event_name: "booking_view",
  data: {
    quiz_slug: string,
    session_id: string,
    booking_url: string,
    lang: string
  }
}
```

### 9. `checkout_start`
**Trigger**: Checkout gomb kattintáskor (Stripe redirect előtt)
**Payload**:
```typescript
{
  event_name: "checkout_start",
  data: {
    quiz_slug: string,
    session_id: string,
    product_id: string,
    price: number,
    lang: string
  }
}
```
    timestamp: string
  }
}
```

### 4. `quiz_complete`
**Trigger**: Utolsó kérdés megválaszolásakor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  metadata: {
    total_score: number
    url: string
    user_agent: string
    timestamp: string
  }
}
```

### 5. `email_submitted`
**Trigger**: Email cím megadásakor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  lead_id: string
  metadata: {
    url: string
    user_agent: string
    timestamp: string
  }
}
```

### 6. `product_view`
**Trigger**: Product blokk megjelenítésekor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  product_id: string
  metadata: {
    url: string
    user_agent: string
    timestamp: string
  }
}
```

### 7. `checkout_start`
**Trigger**: "Vásárlás" gomb kattintáskor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  product_id: string
  metadata: {
    url: string
    user_agent: string
    timestamp: string
  }
}
```

### 8. `purchase_succeeded`
**Trigger**: Stripe webhook sikeres fizetéskor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  order_id: string
  metadata: {
    amount: number
    url: string
    user_agent: string
    timestamp: string
  }
}
```

### 9. `booking_view`
**Trigger**: Calendly booking widget megjelenítésekor  
**Payload**:
```typescript
{
  quiz_id: string
  session_id: string
  metadata: {
    url: string
    user_agent: string
    timestamp: string
  }
}
```

## Usage

### Client-side tracking
```typescript
import { tracker } from '@/lib/tracking'

// Page view
await tracker.trackPageView(quizId, sessionId)

// Answer selection
await tracker.trackAnswerSelect(quizId, sessionId, 'attention_span', 'scale_4')

// Quiz completion
await tracker.trackQuizComplete(quizId, sessionId, 23)
```

### Error Handling
- **Silent fail**: Tracking hibák nem szakítják meg a user experience-t
- **Development logging**: Console logolás fejlesztés közben
- **Network resilience**: Retry logika nélkül, egyszerű fire-and-forget

## Analytics Query Examples

### Funnel analysis
```sql
SELECT 
  action,
  COUNT(*) as event_count,
  COUNT(DISTINCT metadata->>'session_id') as unique_sessions
FROM audit_logs 
WHERE action LIKE 'USER_%'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY action
ORDER BY 
  CASE action
    WHEN 'USER_PAGE_VIEW' THEN 1
    WHEN 'USER_QUIZ_START' THEN 2
    WHEN 'USER_QUIZ_COMPLETE' THEN 3
    WHEN 'USER_EMAIL_SUBMITTED' THEN 4
    WHEN 'USER_PRODUCT_VIEW' THEN 5
    WHEN 'USER_CHECKOUT_START' THEN 6
    WHEN 'USER_PURCHASE_SUCCEEDED' THEN 7
  END;
```

### Conversion rates
```sql
WITH funnel_steps AS (
  SELECT 
    metadata->>'quiz_id' as quiz_id,
    metadata->>'session_id' as session_id,
    MAX(CASE WHEN action = 'USER_PAGE_VIEW' THEN 1 ELSE 0 END) as page_view,
    MAX(CASE WHEN action = 'USER_QUIZ_START' THEN 1 ELSE 0 END) as quiz_start,
    MAX(CASE WHEN action = 'USER_QUIZ_COMPLETE' THEN 1 ELSE 0 END) as quiz_complete,
    MAX(CASE WHEN action = 'USER_EMAIL_SUBMITTED' THEN 1 ELSE 0 END) as email_submitted,
    MAX(CASE WHEN action = 'USER_PURCHASE_SUCCEEDED' THEN 1 ELSE 0 END) as purchase
  FROM audit_logs 
  WHERE action LIKE 'USER_%'
    AND created_at >= NOW() - INTERVAL '30 days'
  GROUP BY metadata->>'quiz_id', metadata->>'session_id'
)
SELECT 
  quiz_id,
  COUNT(*) as total_sessions,
  SUM(quiz_start) as quiz_starts,
  SUM(quiz_complete) as quiz_completes,
  SUM(email_submitted) as email_submits,
  SUM(purchase) as purchases,
  ROUND(SUM(quiz_start)::numeric / COUNT(*) * 100, 2) as quiz_start_rate,
  ROUND(SUM(email_submitted)::numeric / SUM(quiz_complete) * 100, 2) as email_conversion_rate,
  ROUND(SUM(purchase)::numeric / SUM(email_submitted) * 100, 2) as purchase_conversion_rate
FROM funnel_steps
WHERE page_view = 1
GROUP BY quiz_id;
```

## Database Storage

**Tábla**: `audit_logs`  
**Action pattern**: `USER_{EVENT_TYPE}`  
**Resource type**: `session`  
**Resource ID**: `session_id` vagy `quiz_id`  
**Metadata**: JSON minden event-specifikus adattal
