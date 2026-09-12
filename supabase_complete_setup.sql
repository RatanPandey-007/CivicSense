-- ==============================================================================
-- FIX IT NOW / CIVIC SENSE PLATFORM - COMPLETE SUPABASE SETUP SCRIPT
-- ==============================================================================
-- Run this entire script in your new Supabase Project's SQL Editor (SQL Editor -> New query -> Run)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- A. Municipalities Table
CREATE TABLE IF NOT EXISTS public.municipalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ward_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Users Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'municipal_admin', 'master_admin', 'master', 'municipal')) DEFAULT 'citizen',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    district_code TEXT,
    aadhar_status TEXT DEFAULT 'pending' CHECK (aadhar_status IN ('pending', 'verified', 'rejected')),
    municipality_id UUID REFERENCES public.municipalities(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    address TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reporter_name TEXT,
    reporter_phone TEXT,
    reporter_aadhar TEXT,
    assigned_municipality_id UUID REFERENCES public.municipalities(id) ON DELETE SET NULL,
    district_code TEXT,
    ai_category TEXT,
    ai_confidence DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT DEFAULT 'Click to read more...',
    content TEXT NOT NULL,
    image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    category TEXT DEFAULT 'Announcements',
    author_name TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Municipalities RLS
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on municipalities" ON public.municipalities;
CREATE POLICY "Allow public read access on municipalities" ON public.municipalities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access on municipalities" ON public.municipalities;
CREATE POLICY "Allow service role full access on municipalities" ON public.municipalities FOR ALL USING (auth.role() = 'service_role');

-- Users RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
CREATE POLICY "Admins can read all profiles" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('master_admin', 'master', 'municipal_admin', 'municipal'))
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow service role full access on users" ON public.users;
CREATE POLICY "Allow service role full access on users" ON public.users FOR ALL USING (auth.role() = 'service_role');

-- Issues RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on issues" ON public.issues;
CREATE POLICY "Allow public read access on issues" ON public.issues FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert issues" ON public.issues;
CREATE POLICY "Authenticated users can insert issues" ON public.issues FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Allow service role full access on issues" ON public.issues;
CREATE POLICY "Allow service role full access on issues" ON public.issues FOR ALL USING (auth.role() = 'service_role');

-- Blogs RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on blogs" ON public.blogs;
CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access on blogs" ON public.blogs;
CREATE POLICY "Allow service role full access on blogs" ON public.blogs FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- 4. AUTOMATIC USER SYNC TRIGGER (auth.users -> public.users)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role, district_code, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Anonymous User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    COALESCE(NEW.raw_user_meta_data->>'district_code', NEW.raw_user_meta_data->>'pincode', NULL),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    district_code = EXCLUDED.district_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. CRUCIAL ANONYMOUS CITIZEN RECORD (Backend Fallback ID)
-- ==============================================================================
-- The backend uses UUID '14015746-53d5-4719-9c3e-bbc18a88fba8' for anonymous issue reporting.
-- We ensure this user exists in both auth.users and public.users:

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '14015746-53d5-4719-9c3e-bbc18a88fba8') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '14015746-53d5-4719-9c3e-bbc18a88fba8',
      'authenticated',
      'authenticated',
      'anonymous@fixitnow.com',
      crypt('AnonymousSecurePassword123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Anonymous Citizen","role":"citizen"}',
      NOW(),
      NOW()
    );
  END IF;

  INSERT INTO public.users (id, role, full_name, phone_number, aadhar_status, created_at)
  VALUES (
    '14015746-53d5-4719-9c3e-bbc18a88fba8',
    'citizen',
    'Anonymous Citizen',
    '0000000000',
    'verified',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ==============================================================================
-- 6. INITIAL SAMPLE DATA (Municipalities & Sample Blogs)
-- ==============================================================================

-- Sample Municipalities
INSERT INTO public.municipalities (id, name, ward_code)
VALUES 
  ('77a33ec8-301b-4e34-a6c9-c7cb2dfc6d39', 'Pune Municipal Corporation', 'PUNE-411'),
  ('0acbfb5c-6583-4c87-b232-b4e1cab21530', 'Gorakhpur Nagar Nigam', 'GKP-273')
ON CONFLICT (ward_code) DO NOTHING;

-- Sample Blogs
INSERT INTO public.blogs (title, excerpt, content, image_url, category, author_name, read_time)
VALUES 
  (
    'How Citizen Reporting is Transforming Urban Infrastructure',
    'Discover how real-time civic feedback and AI-assisted prioritization are speeding up pothole repairs and sanitation work.',
    'Urban development has entered a new era with digital platforms enabling citizens to report issues instantaneously with geolocation and AI image validation. Municipal teams can now prioritize critical repairs within hours rather than weeks...',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&h=500&fit=crop',
    'Case Study',
    'Civic Sense Team',
    '4 min read'
  ),
  (
    'Monsoon Preparedness & Drainage Maintenance Campaign',
    'Stay updated with the latest city-wide drain cleaning schedules and emergency waterlogging helplines.',
    'As monsoon approaches, municipal teams across Pune and Gorakhpur have launched automated inspections of stormwater drains and low-lying water channels. Citizens can report clogs directly through the portal...',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=500&fit=crop',
    'Announcements',
    'Master Admin',
    '3 min read'
  )
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- SETUP COMPLETE
-- ==============================================================================
