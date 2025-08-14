-- Insert admin user for testing
-- This should be run after creating a Supabase Auth user with email: admin@test.com

INSERT INTO admin_users (email, role) 
VALUES ('admin@test.com', 'owner')
ON CONFLICT (email) 
DO UPDATE SET role = 'owner';
