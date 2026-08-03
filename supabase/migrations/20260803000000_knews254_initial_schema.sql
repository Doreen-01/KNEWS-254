-- ====================================================================
-- KNEWS254 DIGITAL MEDIA NETWORK - SUPABASE DATABASE MIGRATION
-- Migration Version: 20260803000000_knews254_initial_schema.sql
-- Description: Creates core schema tables, relationships, indexes, RLS 
--              policies, triggers, and seed data for Knews254 news platform.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'managing_editor',
        'editor',
        'journalist',
        'correspondent',
        'fact_checker',
        'multimedia_producer',
        'social_media_manager',
        'hr_manager',
        'support_officer',
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

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'journalist',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    profile_image TEXT,
    department VARCHAR(100) DEFAULT 'Newsroom Desk',
    biography TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
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

-- 5. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle TEXT,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    status article_status NOT NULL DEFAULT 'draft',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    editor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    primary_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    county VARCHAR(100) DEFAULT 'Nairobi',
    language VARCHAR(20) DEFAULT 'en',
    priority VARCHAR(20) DEFAULT 'normal',
    featured_image_url TEXT,
    featured_image_path TEXT,
    image_caption TEXT,
    image_credit TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_editor_choice BOOLEAN DEFAULT FALSE,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ
);

-- 7. ARTICLE REVISIONS TABLE
CREATE TABLE IF NOT EXISTS public.article_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    summary TEXT,
    body TEXT NOT NULL,
    revision_number INT NOT NULL DEFAULT 1,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ARTICLE CATEGORIES (JOIN TABLE)
CREATE TABLE IF NOT EXISTS public.article_categories (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, category_id)
);

-- 9. ARTICLE TAGS (JOIN TABLE)
CREATE TABLE IF NOT EXISTS public.article_tags (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 10. MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_filename TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    width INT,
    height INT,
    caption TEXT,
    credit TEXT,
    alt_text TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ARTICLE MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.article_media (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    media_id UUID REFERENCES public.media(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    PRIMARY KEY (article_id, media_id)
);

-- 12. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name VARCHAR(100) NOT NULL UNIQUE,
    article_ids UUID[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BREAKING NEWS TABLE
CREATE TABLE IF NOT EXISTS public.breaking_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    custom_headline TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    author_name VARCHAR(150) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ARTICLE VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(100)
);

-- 16. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    record_type VARCHAR(100) NOT NULL,
    record_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PERSISTENT CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type VARCHAR(100) DEFAULT 'General Contact',
    status VARCHAR(50) DEFAULT 'UNREAD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    frequency VARCHAR(50) DEFAULT 'daily',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TIPOFFS TABLE
CREATE TABLE IF NOT EXISTS public.tipoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alias VARCHAR(255) DEFAULT 'Anonymous Whistleblower',
    category VARCHAR(100) DEFAULT 'Investigative Leak',
    details TEXT NOT NULL,
    contact_phone VARCHAR(100),
    clearance_required VARCHAR(100) DEFAULT 'LEVEL 3 CHIEF ADMIN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. VETTING REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.vetting_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    department VARCHAR(100),
    role VARCHAR(100),
    experience TEXT,
    credentials_bio TEXT,
    score VARCHAR(50) DEFAULT '95/100',
    status VARCHAR(50) DEFAULT 'PENDING_EXECUTIVE_VETTING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR FAST QUERYING & PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_primary_category_id ON public.articles(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_articles_county ON public.articles(county);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON public.articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_articles_is_editor_choice ON public.articles(is_editor_choice);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON public.articles(deleted_at);

-- ====================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ====================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON public.articles;
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipoffs ENABLE ROW LEVEL SECURITY;

-- Articles: Anyone can read published articles
CREATE POLICY "Public Read Published Articles" ON public.articles
    FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Articles: Staff can read all articles
CREATE POLICY "Staff Read All Articles" ON public.articles
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Profiles: Public read
CREATE POLICY "Public Read Profiles" ON public.profiles
    FOR SELECT USING (true);

-- Categories: Public read
CREATE POLICY "Public Read Categories" ON public.categories
    FOR SELECT USING (true);

-- Media: Public read
CREATE POLICY "Public Read Media" ON public.media
    FOR SELECT USING (true);

-- Contact / Subscriptions / Tips / Vetting: Insert allowed
CREATE POLICY "Public Insert Contact" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Insert Subscribers" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Insert Tipoffs" ON public.tipoffs
    FOR INSERT WITH CHECK (true);

-- ====================================================================
-- SEED DATA SETUP
-- ====================================================================
INSERT INTO public.categories (name, slug, description) VALUES
    ('Home', 'home', 'Main landing dashboard'),
    ('Breaking News', 'breaking', 'Instant breaking bulletins'),
    ('Politics & Governance', 'politics', 'Cabinet, State House, & Parliament dispatches'),
    ('2027 Election Center', 'elections', '2027 Kenya presidential polls'),
    ('Business & Economy', 'business', 'NSE stocks & macroeconomic news'),
    ('Silicon Savannah Tech', 'technology', 'M-Pesa, AI, & East Africa fintech'),
    ('Sports & Athletics', 'sports', 'FKF Premier League & World Athletics'),
    ('47 Counties', 'county', 'Hyper-local county devolution news'),
    ('Investigative Desk', 'investigations', 'Audit exposes & exclusive reports'),
    ('Global Diaspora', 'diaspora', 'Remittances & international dispatches'),
    ('Fact Check Verify', 'fact-checking', 'Forensic debunking unit')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.profiles (name, email, role, department, biography) VALUES
    ('Kelly Muthomi Kinoti', 'kellymuthomi22@gmail.com', 'super_admin', 'Executive Bureau', 'Executive Chairman & Chief Architect of Knews254 Digital Media Network.'),
    ('Doreen Ngugi', 'doreenngugi38@gmail.com', 'managing_editor', 'Editorial Board', 'Managing Editor specializing in Devolution & National Policy.'),
    ('Muchui Mwirigi', 'editor@knews254.co.ke', 'editor', 'Newsroom Desk', 'Editor-in-Chief supervising investigative coverage.')
ON CONFLICT (email) DO NOTHING;
