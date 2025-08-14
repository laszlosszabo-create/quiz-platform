# Payment Processing & Email Fulfillment

## Overview

The quiz platform integrates Stripe payments with multi-day email delivery system. When a user completes a payment, the system:

1. **Validates** the Stripe webhook
2. **Creates** an order record via RPC bypass
3. **Triggers** Day-0 email fulfillment (immediate)
4. **Schedules** Day-2 and Day-5 follow-up emails
5. **Updates** session state to completed

## Module 5: Email Delivery System

### Email Template System

**Template Keys:**
- `day_0`: Immediate fulfillment email after payment (order confirmation + 25% discount offer)
- `day_2`: Follow-up tips email with soft upsell (ADHD practical tips)
- `day_5`: Final urgency email with hard upsell (last chance discount)

**Language Support:**
- Hungarian (`hu`): Primary language with complete templates
- English (`en`): Fallback language with translated templates
- Fallback: If requested language unavailable, defaults to Hungarian

**Template Variables:**
- `{{name}}`: User's full name or "Kedves Résztvevő" as fallback
- `{{first_name}}`: User's first name
- `{{result_url}}`: Personalized quiz results page URL
- `{{download_url}}`: PDF download + consultation booking URL
- `{{quiz_title}}`: Quiz title (e.g., "ADHD Gyorsteszt")
- `{{quiz_slug}}`: Quiz identifier for tracking

### Email Scheduling Flow

```
Payment Success (Stripe Webhook)
    ↓
Day 0: Immediate fulfillment email (status: queued)
    ↓
Day 2: Tips email scheduled (status: scheduled)
    ↓
Day 5: Urgency email scheduled (status: scheduled)
```

**Status Transitions:**
1. `scheduled` → `queued` (when due date reached)
2. `queued` → `sent` (successful delivery)
3. `queued` → `failed` (delivery error, max 3 retries)

### Resend API Integration

**Configuration:**
```env
RESEND_API_KEY=re_3ej2WWnU_E9KZsyFUrvnygfsLCBLaFUaD
FROM_EMAIL="ADHD Quiz <onboarding@resend.dev>"
```

**Delivery Process:**
1. Fetch `queued` email events from database
2. Render template with user variables
3. Send via Resend API with proper headers
4. Update status to `sent` or `failed`
5. Retry failed emails up to 3 times

## Payment Flow

### 1. Checkout Session Creation

```typescript
// src/app/api/stripe/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'huf',
      product_data: {
        name: product.name,
      },
      unit_amount: product.price_cents, // 990000 = 9900 Ft
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${origin}/${lang}/${quizSlug}/result?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/${lang}/${quizSlug}`,
  metadata: {
    quiz_id,
    session_id,
    lang,
    product_id: product.internal_id
  }
})
```

### 2. Webhook Processing

```typescript
// src/app/api/webhooks/stripe/route.ts
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // 1. Extract metadata
  const { quiz_id, session_id, lang, product_id } = session.metadata
  
  // 2. Lookup product by internal_id
  const product = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('internal_id', product_id)
    .single()
  
  // 3. Create order via RPC (bypasses schema cache issues)
  const order = await supabaseAdmin.rpc('insert_order_bypass_cache', {
    p_quiz_id: quiz_id,
    p_lead_id: session_id,
    p_product_id: product.id,
    p_amount_cents: session.amount_total,
    p_currency: session.currency.toLowerCase(),
    p_stripe_payment_intent: session.payment_intent,
    p_status: 'paid'
  })
  
  // 4. Trigger Day-0 email
  await triggerEmailFulfillment(order.id, quiz_id, session_id, lang)
}
```

### 3. Email Fulfillment

```typescript
async function triggerEmailFulfillment(orderId, quizId, sessionId, lang) {
  // Create Day-0 email event via RPC
  await supabaseAdmin.rpc('insert_email_event', {
    p_lead_id: sessionId,
    p_template_key: 'day_0',
    p_lang: lang,
    p_status: 'queued',
    p_metadata: {
      order_id: orderId,
      quiz_id: quizId,
      trigger: 'payment_success'
    }
  })
  
  // Mark session as completed
  await supabaseAdmin
    .from('quiz_sessions')
    .update({ state: 'completed' })
    .eq('id', sessionId)
}
```

## Currency & Pricing

### Hungarian Forint (HUF) Configuration

- **Currency Code**: `huf`
- **Pricing**: Stored in cents (smallest currency unit)
- **Example**: 9900 Ft = 990000 cents

```javascript
// Product pricing example
{
  "name": "Quiz Results + Email Course",
  "price_cents": 990000,  // 9900 Ft
  "currency": "huf",
  "stripe_price_id": "price_1QY8hwD6ZGlfZKBWq8f2QcSj"
}
```

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  lead_id UUID REFERENCES quiz_sessions(id),
  product_id UUID REFERENCES products(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'huf',
  stripe_payment_intent TEXT UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Email Events Table

```sql
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES quiz_sessions(id),
  template_key TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## RPC Functions (Schema Cache Bypass)

### Order Creation Function

```sql
CREATE OR REPLACE FUNCTION insert_order_bypass_cache(
  p_quiz_id UUID,
  p_lead_id UUID,
  p_product_id UUID,
  p_amount_cents INTEGER,
  p_currency TEXT,
  p_stripe_payment_intent TEXT,
  p_status order_status DEFAULT 'paid'
) RETURNS orders AS $$
DECLARE
  new_order orders;
BEGIN
  INSERT INTO orders (
    id, quiz_id, lead_id, product_id, amount_cents, currency, 
    stripe_payment_intent, status, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), 
    p_quiz_id, p_lead_id, p_product_id, p_amount_cents, p_currency,
    p_stripe_payment_intent, p_status, NOW(), NOW()
  ) RETURNING * INTO new_order;
  
  RETURN new_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Email Event Creation Function

```sql
CREATE OR REPLACE FUNCTION insert_email_event(
  p_lead_id UUID,
  p_template_key TEXT,
  p_lang TEXT,
  p_status TEXT DEFAULT 'queued',
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS email_events AS $$
DECLARE
  new_event email_events;
BEGIN
  INSERT INTO email_events (
    id, lead_id, template_key, lang, status, metadata, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), p_lead_id, p_template_key, p_lang, p_status, p_metadata, NOW(), NOW()
  ) RETURNING * INTO new_event;
  
  RETURN new_event;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Troubleshooting

### Common Issues

#### 1. PGRST204 Schema Cache Error

**Problem**: `Could not find the 'amount_cents' column of 'orders' in the schema cache`

**Solution**: Use RPC functions instead of direct table inserts:

```typescript
// ❌ Don't use direct insert (schema cache issues)
await supabase.from('orders').insert(orderData)

// ✅ Use RPC function instead
await supabase.rpc('insert_order_bypass_cache', { 
  p_amount_cents: 990000,
  // ... other params
})
```

#### 2. Webhook Signature Verification Failed

**Problem**: `Webhook signature verification failed`

**Solution**: Ensure correct webhook secret:

```bash
# Check webhook endpoint secret
STRIPE_WEBHOOK_SECRET=whsec_f739ab58baf779082d9f38029d17b87feb57a88b0669d602b35c5009f68bc47e
```

#### 3. Product Not Found

**Problem**: Product lookup fails in webhook

**Solution**: Verify metadata contains `product_id` as `internal_id`:

```typescript
// Checkout session metadata
metadata: {
  quiz_id: '123...',
  session_id: '987...',
  lang: 'hu',
  product_id: product.internal_id  // ← Important: use internal_id
}
```

#### 4. Currency Conversion

**Problem**: Amount mismatch between Stripe and database

**Solution**: Stripe amounts are always in cents:

```typescript
// Stripe checkout: 990000 cents = 9900 Ft
unit_amount: 990000

// Database storage: same value
amount_cents: 990000

// Display: divide by 100
const displayPrice = amount_cents / 100 // 9900 Ft
```

### Development Tools

#### Test Payment Flow

```bash
# Test order creation via RPC
node test-rpc.js

# Test webhook processing
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"type":"checkout.session.completed","data":{"object":{"id":"cs_test","amount_total":990000}}}'
```

#### Check Database State

```sql
-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check email events
SELECT * FROM email_events ORDER BY created_at DESC LIMIT 5;

-- Check session states
SELECT id, state, updated_at FROM quiz_sessions WHERE state = 'completed';
```

## Security

### Environment Variables

```bash
# Required for payment processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Public keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### RLS Policies

```sql
-- Orders: Service role can insert/update, users can only read their own
CREATE POLICY "Users can read own orders" ON orders 
  FOR SELECT USING (lead_id = auth.uid());

CREATE POLICY "Service role can manage orders" ON orders 
  FOR ALL USING (auth.role() = 'service_role');

-- Email events: Similar pattern
CREATE POLICY "Service role can manage email events" ON email_events 
  FOR ALL USING (auth.role() = 'service_role');
```

## Next Steps

1. **Module 5**: Email delivery system implementation
2. **Testing**: Comprehensive payment flow testing
3. **Monitoring**: Add payment analytics and error tracking
4. **Optimization**: Improve webhook processing performance
