-- Check orders table
SELECT id, stripe_payment_intent_id, session_id, product_id, amount_cents, currency, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check email_events table  
SELECT id, session_id, event_type, scheduled_for, sent_at, created_at
FROM email_events 
ORDER BY created_at DESC 
LIMIT 10;

-- Check quiz_sessions table for reference
SELECT id, quiz_id, email, completed_at, created_at
FROM quiz_sessions 
ORDER BY created_at DESC 
LIMIT 5;
