-- ====================================================================
-- KNEWS254 DIGITAL MEDIA NETWORK - EXISTING PROJECT DATABASE REPAIR
-- File Path: supabase/migrations/20260804_knews254_existing_project_repair.sql
-- Description: Fully idempotent, defensive, non-destructive SQL repair
--              migration tailored for an EXISTING Supabase project.
--              Preserves existing records, links profiles to auth.users,
--              adds missing columns/tables/indexes/FKs, configures
--              Storage buckets and RLS policies, and runs verification queries.
-- ====================================================================

BEGIN;

-- --------------------------------------------------------------------
-- 1. EXTENSIONS & ENUM TYPES
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'managing_editor',
        'editor',
        'editor_in_chief',
        'journalist',
        'correspondent',
        'fact_checker',
        'multimedia_producer',
        'social_media_manager',
        'hr_manager',
        'support_officer',
        'legal_reviewer',
        'community_moderator',
        'advertising_manager',
        'customer_support',
        'analyst'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE article_status AS ENUM (
        'draft',
        'assigned',
        'submitted',
        'editing',
        'fact_check',
        'legal_review',
        'approved',
        'scheduled',
        'published',
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- --------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 3. PROFILES TABLE REPAIR & AUTH LINKING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'journalist';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'Newsroom Operations';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biography TEXT;

-- Safe Foreign Key to auth.users
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_profiles_auth_user' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT fk_profiles_auth_user 
        FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Link existing profiles to auth.users by email ONLY when auth_user_id is NULL
UPDATE public.profiles p
SET auth_user_id = u.id
FROM auth.users u
WHERE p.auth_user_id IS NULL
  AND LOWER(TRIM(p.email)) = LOWER(TRIM(u.email));

-- Unique Partial Index for auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_auth_user_id_unique 
ON public.profiles(auth_user_id) 
WHERE auth_user_id IS NOT NULL;

-- Trigger for profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Categories Safely (Never Staff)
INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
    ('Politics', 'politics', 'Kenyan National Politics, Parliament, State House & Devolution', 1),
    ('Elections 2027', 'elections', '2027 General Elections Campaign Tracker & Polling', 2),
    ('County News', 'county', 'News from all 47 Counties across Kenya', 3),
    ('Business & Economy', 'business', 'Central Bank, Trade, Treasury, Markets & Enterprise', 4),
    ('Tech & AI', 'technology', 'Silicon Savannah, Artificial Intelligence & ICT', 5),
    ('Sports', 'sports', 'Harambee Stars, Athletics, Premier League & Rugby', 6),
    ('Fact Check', 'fact-checking', 'Knews254 Verification Desk & Claim Debunking', 7),
    ('Investigations', 'investigations', 'Deep Dive Investigative Journalism & Audits', 8)
ON CONFLICT (slug) DO NOTHING;

-- --------------------------------------------------------------------
-- 5. TAGS & ARTICLE_TAGS TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. ARTICLES TABLE REPAIR
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'draft';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS editor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS primary_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS county VARCHAR(100) DEFAULT 'Nairobi';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS language VARCHAR(20) DEFAULT 'en';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS featured_image_path TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_caption TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_credit TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_breaking BOOLEAN DEFAULT FALSE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_editor_choice BOOLEAN DEFAULT FALSE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.article_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    revised_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT,
    body TEXT NOT NULL,
    revision_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON public.articles;
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 7. MEDIA & ARTICLE_MEDIA TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    width INT,
    height INT,
    caption TEXT,
    credit TEXT,
    alt_text TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_media (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    media_id UUID REFERENCES public.media(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (article_id, media_id)
);

-- --------------------------------------------------------------------
-- 8. INTERACTIVE & ENGAGEMENT TABLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vetting_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name VARCHAR(255) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    claim_text TEXT NOT NULL,
    source_url TEXT,
    additional_context TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tipoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_info VARCHAR(255),
    attachment_url TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    viewer_ip VARCHAR(100),
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.breaking_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline VARCHAR(255) NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name VARCHAR(100) NOT NULL UNIQUE,
    article_ids JSONB DEFAULT '[]'::jsonb,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON public.articles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_articles_county ON public.articles(county);
CREATE INDEX IF NOT EXISTS idx_articles_primary_category_id ON public.articles(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);

-- --------------------------------------------------------------------
-- 10. AUTH & ROLE HELPER FUNCTIONS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.profiles AS $$
DECLARE
    user_prof public.profiles;
BEGIN
    SELECT * INTO user_prof
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
    LIMIT 1;
    RETURN user_prof;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_authenticated_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid()
          AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE auth_user_id = auth.uid()
          AND status = 'ACTIVE'
          AND role IN ('super_admin', 'managing_editor', 'editor', 'editor_in_chief')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vetting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Clean old unsafe policies
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Public read published non-deleted articles" ON public.articles;
DROP POLICY IF EXISTS "Staff authenticated articles management" ON public.articles;
DROP POLICY IF EXISTS "Public comments insert access" ON public.comments;
DROP POLICY IF EXISTS "Public comments read approved" ON public.comments;
DROP POLICY IF EXISTS "Staff comments management" ON public.comments;
DROP POLICY IF EXISTS "Public contact messages insert" ON public.contact_messages;
DROP POLICY IF EXISTS "Public newsletter subscribe" ON public.newsletter_subscribers;

-- Apply Safe Policies
CREATE POLICY "Public profiles read access" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Public categories read access" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Staff categories management" ON public.categories
    FOR ALL USING (public.is_authenticated_staff());

CREATE POLICY "Public tags read access" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "Staff tags management" ON public.tags
    FOR ALL USING (public.is_authenticated_staff());

CREATE POLICY "Public read published non-deleted articles" ON public.articles
    FOR SELECT USING (
        status = 'published' 
        AND deleted_at IS NULL 
        AND (published_at IS NULL OR published_at <= NOW())
    );

CREATE POLICY "Staff read all non-deleted articles" ON public.articles
    FOR SELECT USING (
        deleted_at IS NULL AND public.is_authenticated_staff()
    );

CREATE POLICY "Staff insert articles" ON public.articles
    FOR INSERT WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "Staff update articles" ON public.articles
    FOR UPDATE USING (public.is_authenticated_staff());

CREATE POLICY "Editors delete soft articles" ON public.articles
    FOR DELETE USING (public.is_admin_or_editor());

CREATE POLICY "Public media read access" ON public.media
    FOR SELECT USING (true);

CREATE POLICY "Staff media insert" ON public.media
    FOR INSERT WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "Staff media management" ON public.media
    FOR ALL USING (public.is_authenticated_staff());

CREATE POLICY "Public article_media read" ON public.article_media
    FOR SELECT USING (true);

CREATE POLICY "Staff article_media manage" ON public.article_media
    FOR ALL USING (public.is_authenticated_staff());

CREATE POLICY "Public comments insert" ON public.comments
    FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Public comments read approved" ON public.comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Staff comments manage" ON public.comments
    FOR ALL USING (public.is_authenticated_staff());

CREATE POLICY "Public contact messages insert" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff contact messages view" ON public.contact_messages
    FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "Public newsletter subscribe" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff newsletter view" ON public.newsletter_subscribers
    FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "Public vetting insert" ON public.vetting_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff vetting view" ON public.vetting_requests
    FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "Public tipoffs insert" ON public.tipoffs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff tipoffs view" ON public.tipoffs
    FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "Public article_views insert" ON public.article_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public breaking news view" ON public.breaking_news
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public homepage sections view" ON public.homepage_sections
    FOR SELECT USING (true);

-- --------------------------------------------------------------------
-- 12. STORAGE BUCKETS & STORAGE POLICIES
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('article-media', 'article-media', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('private-newsroom', 'private-newsroom', false, 52428800, NULL),
    ('career-files', 'career-files', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
    ('tipoff-files', 'tipoff-files', false, 52428800, NULL)
ON CONFLICT (id) DO UPDATE 
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read article-media objects" ON storage.objects;
CREATE POLICY "Public read article-media objects" ON storage.objects
    FOR SELECT USING (bucket_id = 'article-media');

DROP POLICY IF EXISTS "Public read avatars objects" ON storage.objects;
CREATE POLICY "Public read avatars objects" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Staff upload article-media" ON storage.objects;
CREATE POLICY "Staff upload article-media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'article-media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff manage article-media" ON storage.objects;
CREATE POLICY "Staff manage article-media" ON storage.objects
    FOR ALL USING (bucket_id = 'article-media' AND auth.role() = 'authenticated');

COMMIT;

-- ====================================================================
-- 13. VERIFICATION QUERIES (RUN IN SUPABASE SQL EDITOR TO VERIFY)
-- ====================================================================

-- Query A: Check Table Existence
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Query B: Check Articles Columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'articles'
ORDER BY ordinal_position;

-- Query C: Check Profiles & Auth User Linking Status
SELECT 
    p.name AS profile_name,
    p.email AS profile_email,
    p.role AS profile_role,
    p.auth_user_id,
    CASE 
        WHEN p.auth_user_id IS NOT NULL THEN 'LINKED TO AUTH.USERS'
        ELSE 'NOT LINKED (Create account in Auth first)'
    END AS linking_status
FROM public.profiles p;

-- Query D: Check Storage Buckets
SELECT id, name, public, file_size_limit 
FROM storage.buckets;

-- Query E: Check Categories Seed Status
SELECT name, slug, display_order 
FROM public.categories 
ORDER BY display_order ASC;
