-- Allow public users to insert tracking events into audit_logs
CREATE POLICY "Allow public tracking events" ON public.audit_logs
    FOR INSERT WITH CHECK (
        user_id = 'public_user' AND
        user_email = 'public@system.local' AND
        action LIKE 'USER_%'
    );
