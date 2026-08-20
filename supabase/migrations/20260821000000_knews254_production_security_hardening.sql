-- KNEWS254 PRODUCTION SECURITY HARDENING
-- Removes permissive policies from the initial migration and applies least-privilege RLS.

CREATE OR REPLACE FUNCTION public.is_authenticated_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND status = 'ACTIVE'
      AND role IN ('super_admin', 'managing_editor', 'editor', 'editor_in_chief')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Remove permissive policies created by either previous migration.
DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
DROP POLICY IF EXISTS "Allow All Operations on Articles" ON public.articles;
DROP POLICY IF EXISTS "Public read published non-deleted articles" ON public.articles;
DROP POLICY IF EXISTS "Staff read all non-deleted articles" ON public.articles;
DROP POLICY IF EXISTS "Staff insert articles" ON public.articles;
DROP POLICY IF EXISTS "Staff update articles" ON public.articles;
DROP POLICY IF EXISTS "Editors delete soft articles" ON public.articles;

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow All Operations on Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
DROP POLICY IF EXISTS "Staff categories management" ON public.categories;

DROP POLICY IF EXISTS "Public Read Media" ON public.media;
DROP POLICY IF EXISTS "Allow Insert Media" ON public.media;
DROP POLICY IF EXISTS "Public media read access" ON public.media;
DROP POLICY IF EXISTS "Staff media insert" ON public.media;
DROP POLICY IF EXISTS "Staff media management" ON public.media;

DROP POLICY IF EXISTS "Public article_media read" ON public.article_media;
DROP POLICY IF EXISTS "Staff article_media manage" ON public.article_media;

DROP POLICY IF EXISTS "Public Read Comments" ON public.comments;
DROP POLICY IF EXISTS "Public Insert Comments" ON public.comments;
DROP POLICY IF EXISTS "Public comments insert" ON public.comments;
DROP POLICY IF EXISTS "Public comments read approved" ON public.comments;
DROP POLICY IF EXISTS "Staff comments management" ON public.comments;
DROP POLICY IF EXISTS "Staff comments manage" ON public.comments;

DROP POLICY IF EXISTS "Public Insert Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Public contact messages insert" ON public.contact_messages;
DROP POLICY IF EXISTS "Staff contact messages view" ON public.contact_messages;

DROP POLICY IF EXISTS "Public Insert Subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public newsletter subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Staff newsletter view" ON public.newsletter_subscribers;

DROP POLICY IF EXISTS "Public Insert Tipoffs" ON public.tipoffs;
DROP POLICY IF EXISTS "Public tipoffs insert" ON public.tipoffs;
DROP POLICY IF EXISTS "Staff tipoffs view" ON public.tipoffs;

DROP POLICY IF EXISTS "Public Insert Vetting" ON public.vetting_requests;
DROP POLICY IF EXISTS "Public vetting insert" ON public.vetting_requests;
DROP POLICY IF EXISTS "Staff vetting view" ON public.vetting_requests;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Public read article-media objects" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars objects" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload article-media" ON storage.objects;
DROP POLICY IF EXISTS "Staff manage article-media" ON storage.objects;

-- Public publishing reads.
CREATE POLICY "production_public_read_articles" ON public.articles
  FOR SELECT USING (
    status = 'published'
    AND deleted_at IS NULL
    AND (published_at IS NULL OR published_at <= NOW())
  );

CREATE POLICY "production_staff_read_articles" ON public.articles
  FOR SELECT USING (deleted_at IS NULL AND public.is_authenticated_staff());

CREATE POLICY "production_staff_insert_articles" ON public.articles
  FOR INSERT WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_staff_update_articles" ON public.articles
  FOR UPDATE USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_editor_delete_articles" ON public.articles
  FOR DELETE USING (public.is_admin_or_editor());

CREATE POLICY "production_public_read_profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "production_own_profile_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "production_admin_profile_management" ON public.profiles
  FOR ALL USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "production_public_read_categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "production_staff_category_management" ON public.categories
  FOR ALL USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_public_read_media" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "production_staff_media_management" ON public.media
  FOR ALL USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_public_read_article_media" ON public.article_media
  FOR SELECT USING (true);

CREATE POLICY "production_staff_article_media_management" ON public.article_media
  FOR ALL USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_public_insert_comments" ON public.comments
  FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "production_public_read_comments" ON public.comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "production_staff_comment_management" ON public.comments
  FOR ALL USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

-- Public forms may submit, but only active staff may read or manage submissions.
CREATE POLICY "production_public_insert_contact" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "production_staff_read_contact" ON public.contact_messages
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "production_staff_manage_contact" ON public.contact_messages
  FOR UPDATE USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_public_insert_subscribers" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "production_staff_read_subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "production_staff_manage_subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.is_authenticated_staff())
  WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "production_public_insert_tipoffs" ON public.tipoffs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "production_staff_read_tipoffs" ON public.tipoffs
  FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "production_public_insert_vetting" ON public.vetting_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "production_staff_read_vetting" ON public.vetting_requests
  FOR SELECT USING (public.is_authenticated_staff());

CREATE POLICY "production_public_insert_article_views" ON public.article_views
  FOR INSERT WITH CHECK (true);

-- Public storage is read-only; uploads and mutations require authenticated staff.
CREATE POLICY "production_public_read_article_media_storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('article-media', 'media', 'avatars'));

CREATE POLICY "production_staff_insert_article_media_storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('article-media', 'media', 'avatars')
    AND public.is_authenticated_staff()
  );

CREATE POLICY "production_staff_manage_article_media_storage" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('article-media', 'media', 'avatars')
    AND public.is_authenticated_staff()
  )
  WITH CHECK (
    bucket_id IN ('article-media', 'media', 'avatars')
    AND public.is_authenticated_staff()
  );

CREATE POLICY "production_staff_delete_article_media_storage" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('article-media', 'media', 'avatars')
    AND public.is_authenticated_staff()
  );
