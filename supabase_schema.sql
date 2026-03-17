-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  contact_number text,
  service text,
  message text,
  status text DEFAULT 'New',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  company text,
  review text NOT NULL,
  rating smallint DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  industry text,
  image_url text,
  project_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  thumbnail text,
  tags text[],
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and create policies (For demo purposes we'll make them readable to anon, but only manageable by authenticated admin users)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- BOOKINGS: Anon can insert securely, only authenticated can select/update/delete
DROP POLICY IF EXISTS "Anon can insert bookings" ON public.bookings;
CREATE POLICY "Anon can insert bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Auth can manage bookings" ON public.bookings;
CREATE POLICY "Auth can manage bookings" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TESTIMONIALS: Anon can select, Auth can manage
DROP POLICY IF EXISTS "Anon can select testimonials" ON public.testimonials;
CREATE POLICY "Anon can select testimonials" ON public.testimonials FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Auth can manage testimonials" ON public.testimonials;
CREATE POLICY "Auth can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROJECTS: Anon can select, Auth can manage
DROP POLICY IF EXISTS "Anon can select projects" ON public.projects;
CREATE POLICY "Anon can select projects" ON public.projects FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Auth can manage projects" ON public.projects;
CREATE POLICY "Auth can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- BLOGS: Anon can select published blogs, Auth can manage all
DROP POLICY IF EXISTS "Anon can select published blogs" ON public.blogs;
CREATE POLICY "Anon can select published blogs" ON public.blogs FOR SELECT TO anon USING (published = true);

DROP POLICY IF EXISTS "Auth can manage blogs" ON public.blogs;
CREATE POLICY "Auth can manage blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to the bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

-- Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  is_active boolean DEFAULT false,
  text_color text DEFAULT '#1e3a8a',
  secondary_text_color text DEFAULT '#ec4899',
  accent_text_color text DEFAULT '#1e3a8a',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure only one active banner at a time (this usually requires a trigger, but we'll enforce it in frontend/API logic for simplicity here)

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- HERO BANNERS: Anon can select, Auth can manage
DROP POLICY IF EXISTS "Anon can select hero banners" ON public.hero_banners;
CREATE POLICY "Anon can select hero banners" ON public.hero_banners FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Auth can manage hero banners" ON public.hero_banners;
CREATE POLICY "Auth can manage hero banners" ON public.hero_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  deadline date,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cv_url text NOT NULL,
  status text DEFAULT 'New',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- JOBS: Anon can select active jobs, Auth can manage all
DROP POLICY IF EXISTS "Anon can select active jobs" ON public.jobs;
CREATE POLICY "Anon can select active jobs" ON public.jobs FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "Auth can manage jobs" ON public.jobs;
CREATE POLICY "Auth can manage jobs" ON public.jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- APPLICATIONS: Anon can insert, only Auth can select/manage
DROP POLICY IF EXISTS "Anon can insert applications" ON public.job_applications;
CREATE POLICY "Anon can insert applications" ON public.job_applications FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Auth can manage applications" ON public.job_applications;
CREATE POLICY "Auth can manage applications" ON public.job_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create a storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to CVs (needed for downloading)
DROP POLICY IF EXISTS "Public CV Access" ON storage.objects;
CREATE POLICY "Public CV Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cvs');

-- Allow anyone to upload a CV (for job applicants)
DROP POLICY IF EXISTS "Anon CV Upload" ON storage.objects;
CREATE POLICY "Anon CV Upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'cvs');

-- Allow authenticated to manage CVs
DROP POLICY IF EXISTS "Auth CV Management" ON storage.objects;
CREATE POLICY "Auth CV Management" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'cvs');
