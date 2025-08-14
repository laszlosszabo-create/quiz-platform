-- Create a custom RPC function to handle order insertion
-- This bypasses the schema cache issues by using a stored procedure

-- First, create the function to insert orders
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
    p_quiz_id,
    p_lead_id,
    p_product_id,
    p_amount_cents,
    p_currency,
    p_stripe_payment_intent,
    p_status,
    NOW(),
    NOW()
  ) RETURNING * INTO new_order;
  
  RETURN new_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to service role
GRANT EXECUTE ON FUNCTION insert_order_bypass_cache TO service_role;

-- Also create function for email events
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
    gen_random_uuid(),
    p_lead_id,
    p_template_key,
    p_lang,
    p_status,
    p_metadata,
    NOW(),
    NOW()
  ) RETURNING * INTO new_event;
  
  RETURN new_event;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION insert_email_event TO service_role;
