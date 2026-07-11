-- ==========================================
-- Supabase Database Schema & RLS Setup
-- ==========================================
-- Run this script in the Supabase SQL Editor:

-- ------------------------------------------
-- 1. Table: contact_submissions
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (public anon) to insert
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
CREATE POLICY "Allow public inserts"
ON contact_submissions FOR INSERT TO anon
WITH CHECK (true);

-- Policy: Allow full access to service_role
DROP POLICY IF EXISTS "Allow service_role full access" ON contact_submissions;
CREATE POLICY "Allow service_role full access"
ON contact_submissions FOR ALL TO service_role
USING (true) WITH CHECK (true);


-- ------------------------------------------
-- 2. Table: site_config
-- ------------------------------------------
-- Drop old table if it exists to avoid type conflicts with UUID
DROP TABLE IF EXISTS site_config CASCADE;

CREATE TABLE site_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    owner_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    about_text TEXT NOT NULL,
    availability_status TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email_address TEXT NOT NULL,
    resume_url TEXT,
    focus_working_on TEXT,
    focus_learning TEXT,
    focus_goal TEXT,
    jamming_to TEXT,
    tech_stack TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
DROP POLICY IF EXISTS "Allow public read site_config" ON site_config;
CREATE POLICY "Allow public read site_config"
ON site_config FOR SELECT TO anon
USING (true);

-- Policy: Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role full access site_config" ON site_config;
CREATE POLICY "Allow service_role full access site_config"
ON site_config FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Insert initial default row
INSERT INTO site_config (
    id, 
    owner_name, 
    tagline, 
    about_text, 
    availability_status, 
    phone_number, 
    email_address, 
    resume_url,
    focus_working_on,
    focus_learning,
    focus_goal,
    jamming_to,
    tech_stack,
    github_url,
    linkedin_url,
    telegram_bot_token,
    telegram_chat_id
)
VALUES (
    'main', 
    'Aswin', 
    'Software Engineer Specialized in Resilient Systems', 
    'A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.', 
    'available', 
    '+918075483385', 
    'aswin@example.com',
    '/resume.pdf',
    'Distributed key-value engines and custom GLSL shader configurations.',
    'WebGPU pipelines and systems programming with Rust.',
    'Engineering resilient, high-speed interfaces and network consensus layers.',
    'Synthwave Focus Beats',
    'Next.js, React, TypeScript, Tailwind CSS, GSAP, Framer Motion',
    'https://github.com/rd-aswin',
    'https://linkedin.com',
    NULL,
    NULL
);


-- ------------------------------------------
-- 3. Table: projects
-- ------------------------------------------
-- Drop old table if it exists to avoid type conflicts with UUID
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tags TEXT,
    image_public_id TEXT,
    description TEXT,
    detailed_description TEXT,
    role TEXT,
    metrics TEXT,
    github_url TEXT,
    demo_url TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
DROP POLICY IF EXISTS "Allow public read projects" ON projects;
CREATE POLICY "Allow public read projects"
ON projects FOR SELECT TO anon
USING (true);

-- Policy: Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role full access projects" ON projects;
CREATE POLICY "Allow service_role full access projects"
ON projects FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Insert initial project values
INSERT INTO projects (id, title, subtitle, tags, image_public_id)
VALUES 
    ('aetherdb', 'AetherDB', 'Distributed Raft Consensus Engine', 'Go, Raft, gRPC', 'cld-sample-5'),
    ('prism-webgl', 'Prism WebGL', 'Glass Refraction Simulator', 'WebGL, Three.js, GLSL', 'cld-sample-5');


-- ------------------------------------------
-- 4. Table: testimonials
-- ------------------------------------------
-- Drop old table if it exists to avoid type conflicts with UUID
DROP TABLE IF EXISTS testimonials CASCADE;

CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    quote TEXT NOT NULL,
    title TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
DROP POLICY IF EXISTS "Allow public read testimonials" ON testimonials;
CREATE POLICY "Allow public read testimonials"
ON testimonials FOR SELECT TO anon
USING (true);

-- Policy: Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role full access testimonials" ON testimonials;
CREATE POLICY "Allow service_role full access testimonials"
ON testimonials FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Insert initial feedback testimonial
INSERT INTO testimonials (id, author, quote, title, company)
VALUES 
    ('1', 'Sarah Jenkins', 'Aswin designed and implemented our core synchronization engine.', 'CTO', 'FinSphere Inc.');


-- ------------------------------------------
-- 5. Table: timeline_items
-- ------------------------------------------
DROP TABLE IF EXISTS timeline_items CASCADE;

CREATE TABLE timeline_items (
    id TEXT PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
DROP POLICY IF EXISTS "Allow public read timeline_items" ON timeline_items;
CREATE POLICY "Allow public read timeline_items"
ON timeline_items FOR SELECT TO anon
USING (true);

-- Policy: Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role full access timeline_items" ON timeline_items;
CREATE POLICY "Allow service_role full access timeline_items"
ON timeline_items FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Insert initial timeline values
INSERT INTO timeline_items (id, year, title, company, description, skills, type)
VALUES 
    ('exp-1', '2024 - Present', 'Senior Frontend Engineer', 'Apex Tech Solutions', 'Architecting accessible design systems and leading migration of enterprise dashboards to Next.js App Router, increasing page speeds by 35%.', 'Next.js, React, TypeScript, Tailwind CSS, Framer Motion', 'work'),
    ('exp-2', '2022 - 2024', 'Software Engineer II', 'Vector Systems', 'Developed and maintained full-stack internal tooling. Optimized REST/GraphQL API gateway responses, reducing network payload sizes by 20%.', 'Node.js, GraphQL, PostgreSQL, Docker, AWS', 'work'),
    ('exp-3', '2018 - 2022', 'B.Tech in Computer Science', 'State University of Technology', 'Graduated with Honors. Focused coursework in Distributed Systems, Object Oriented Programming, and Web Engineering.', 'Data Structures, Algorithms, C++, JavaScript, SQL', 'education');
