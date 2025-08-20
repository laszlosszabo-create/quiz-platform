-- Update email automation rules schema
-- Created: 2025-08-19

-- Update the rule_type column to use the correct enum values and rename it
ALTER TABLE email_automation_rules 
RENAME COLUMN rule_type TO trigger_event;

-- Ensure the column has the correct values
UPDATE email_automation_rules 
SET trigger_event = CASE 
  WHEN trigger_event = 'quiz_complete' THEN 'quiz_complete'
  WHEN trigger_event = 'purchase' THEN 'purchase' 
  WHEN trigger_event = 'no_purchase_reminder' THEN 'no_purchase_reminder'
  ELSE 'quiz_complete'
END;

-- Add missing columns if they don't exist
ALTER TABLE email_automation_rules 
ADD COLUMN IF NOT EXISTS max_sends INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 5;

-- Rename trigger_conditions to conditions if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'email_automation_rules' 
        AND column_name = 'trigger_conditions'
    ) THEN
        ALTER TABLE email_automation_rules RENAME COLUMN trigger_conditions TO conditions;
    END IF;
END $$;

-- Add conditions column if it doesn't exist
ALTER TABLE email_automation_rules 
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '{}';

-- Update indexes
DROP INDEX IF EXISTS idx_email_automation_rules_active;
CREATE INDEX IF NOT EXISTS idx_email_automation_rules_active 
ON email_automation_rules(quiz_id, trigger_event, is_active);

COMMENT ON COLUMN email_automation_rules.trigger_event IS 'Event that triggers the email: quiz_complete, purchase, no_purchase_reminder';
COMMENT ON COLUMN email_automation_rules.conditions IS 'JSON conditions for rule evaluation';
COMMENT ON COLUMN email_automation_rules.delay_minutes IS 'Delay in minutes before sending email';
COMMENT ON COLUMN email_automation_rules.max_sends IS 'Maximum number of emails to send per recipient';
COMMENT ON COLUMN email_automation_rules.priority IS 'Priority for rule execution (1-10, higher first)';
