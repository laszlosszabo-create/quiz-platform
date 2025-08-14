-- Fix Schema Cache Issue
-- Migration: 20250814130000_fix_schema_cache
-- Description: Force schema cache refresh for orders table

-- Refresh schema cache by commenting and recreating constraints
-- This forces PostgREST to reload table metadata

-- Add a comment to force schema reload
COMMENT ON TABLE orders IS 'Orders table with amount_cents field - cache refresh';

-- Drop and recreate a non-critical index to trigger cache refresh
DROP INDEX IF EXISTS idx_orders_stripe_payment_intent;
CREATE UNIQUE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent);

-- Refresh the schema by altering a constraint (safe operation)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_amount_cents_positive;
ALTER TABLE orders ADD CONSTRAINT orders_amount_cents_positive CHECK (amount_cents >= 0);

-- Force PostgREST to recognize the table structure
SELECT pg_notify('pgrst', 'reload schema');
