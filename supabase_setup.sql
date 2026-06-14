-- ==========================================
-- Supabase Database Schema & RLS Setup
-- ==========================================
-- Run this script in the Supabase SQL Editor:

-- 1. Create the submissions table (if it doesn't exist yet)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 3. Create INSERT Policy (Public Anonymous)
-- Allows the contact form on your live site to insert messages
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
CREATE POLICY "Allow public inserts"
ON contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Create SELECT/DELETE Policy (Secure Admin Only)
-- Allows reads and deletes using the private Supabase service role key
DROP POLICY IF EXISTS "Allow service_role full access" ON contact_submissions;
CREATE POLICY "Allow service_role full access"
ON contact_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- OPTIONAL FALLBACK:
-- If you choose NOT to add your SUPABASE_SERVICE_ROLE_KEY to your .env.local file,
-- the Next.js API will fall back to using your public anon key.
-- To allow reads under that fallback configuration, uncomment the policy below:
--
-- CREATE POLICY "Allow anon select and delete"
-- ON contact_submissions
-- FOR ALL
-- TO anon
-- USING (true)
-- WITH CHECK (true);
