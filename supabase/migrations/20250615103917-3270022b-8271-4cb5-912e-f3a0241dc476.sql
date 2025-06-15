
-- Update Victor Isingizwe's auth record to include phone number for phone-based login
UPDATE auth.users 
SET 
  phone = '+250788123456',
  phone_confirmed_at = now(),
  raw_user_meta_data = raw_user_meta_data || '{"phone": "+250788123456"}'::jsonb
WHERE email = 'victor.isingizwe@example.com';
