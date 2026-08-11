import { supabase, getSupabaseClient, isSupabaseConfigured, linkMediaToArticle } from '../lib/supabase';
import { Article, NewsCategory } from '../types';
import { FEATURED_ARTICLES } from '../data/newsData';

export type ArticleStatus = 
  | 'draft'
  | 'assigned'
  | 'submitted'
  | 'editing'
  | 'fact_check'
  | 'legal_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface DbArticleRecord {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  body: string;
  status: ArticleStatus;
  author_id?: string;
  editor_id?: string;
  primary_category_id?: string;
  county?: string;
  language?: string;
  priority?: string;
  featured_image_url?: string;
  featured_image_path?: string;
  image_caption?: string;
  image_credit?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  is_editor_choice?: boolean;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  scheduled_at?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  // Dynamic relation fields
  primary_category?: { id: string; name: string; slug: string };
  author?: { id: string; name: string; role?: string; profile_image?: string };
}

/**
 * Utility to check if string is valid UUID
 */
function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Category Slug <-> ID cache
 */
let categorySlugMap: Record<string, string> = {};

async function resolveCategoryId(slug: string): Promise<string | null> {
  const client = getSupabaseClient() || supabase;
  if (!isSupabaseConfigured() || !client) return null;
  const normalizedSlug = slug.toLowerCase().trim();
  if (categorySlugMap[normalizedSlug]) {
    return categorySlugMap[normalizedSlug];
  }
  try {
    const { data } = await client
      .from('categories')
      .select('id, slug')
      .ilike('slug', normalizedSlug)
      .maybeSingle();

    if (data?.id && isValidUuid(data.id)) {
      categorySlugMap[normalizedSlug] = data.id;
      return data.id;
    }
    // Fallback: pick any category
    const fallback = await client.from('categories').select('id, slug').limit(1).maybeSingle();
    if (fallback.data?.id && isValidUuid(fallback.data.id)) {
      categorySlugMap[fallback.data.slug] = fallback.data.id;
      return fallback.data.id;
    }
  } catch (e) {
    console.warn('Category resolution error:', e);
  }
  return null;
}

/**
 * Helper to convert Supabase DbArticleRecord to UI Article interface
 */
export function mapDbRecordToArticle(record: any): Article {
  const publishedAtStr = record.published_at 
    ? new Date(record.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' EAT'
    : record.created_at 
    ? new Date(record.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  const catSlug = record.primary_category?.slug || record.category_slug || 'politics';
  
  const authorName = record.author?.name || record.author_name || 'Kelly Muthomi Kinoti';
  const authorRole = record.author?.role || record.author_role || 'Executive Editor';
  const authorAvatar = record.author?.profile_image || record.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return {
    id: record.id,
    title: record.title || 'Untitled Article',
    slug: record.slug || record.id,
    summary: record.summary || '',
    content: record.body || record.summary || '',
    category: catSlug as NewsCategory,
    author: {
      id: record.author_id,
      name: authorName,
      role: authorRole,
      avatar: authorAvatar,
    },
    publishedAt: publishedAtStr,
    readTime: `${Math.max(2, Math.ceil((record.body?.length || 500) / 800))} min read`,
    imageUrl: record.featured_image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: record.image_caption || '',
    county: record.county || 'Nairobi',
    isBreaking: Boolean(record.is_breaking),
    isFeatured: Boolean(record.is_featured),
    isEditorPick: Boolean(record.is_editor_choice),
    viewCount: record.view_count || 150,
    tags: record.county ? ['Kenya', 'Knews254', record.county] : ['Kenya', 'Knews254']
  };
}

const SELECT_QUERY = '*, primary_category:categories(id, name, slug), author:profiles(id, name, role, profile_image)';

export interface ListArticlesOptions {
  bypassCache?: boolean;
  forceFresh?: boolean;
  limit?: number;
  category?: string;
}

/**
 * ARTICLE SERVICE API (SUPABASE PUBLIC CLIENT EXCLUSIVE)
 */
export const articleService = {
  /**
   * List all public published articles (status = 'published', deleted_at IS NULL)
   */
  async listPublishedArticles(options?: ListArticlesOptions): Promise<{ 
    data: Article[]; 
    error?: string; 
    isFallback?: boolean;
    timestamp?: number;
  }> {
    const timestamp = Date.now();
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { 
        data: FEATURED_ARTICLES, 
        isFallback: true,
        error: 'Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        timestamp
      };
    }

    try {
      // 1. Primary Query: Join categories and author profiles
      let query = client
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      let { data, error } = await query;

      // 2. Secondary Query Fallback: Simple select if relational join fails
      if (error) {
        console.warn('[KNews 254 Article Service] Relational select failed, executing simple select fallback:', error.message);
        let fallbackQuery = client
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (options?.limit) {
          fallbackQuery = fallbackQuery.limit(options.limit);
        }

        const fallbackRes = await fallbackQuery;
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      // 3. Error Handling Fallback
      if (error) {
        const isFetchErr = typeof error.message === 'string' && (error.message.includes('Failed to fetch') || error.message.includes('TypeError'));
        if (isFetchErr) {
          console.warn('[KNews 254 Article Service] Supabase database connection offline or unreachable. Serving static featured news.');
        } else {
          console.warn('[KNews 254 Article Service] Database query warning:', error.message);
        }
        return { 
          data: FEATURED_ARTICLES, 
          isFallback: true, 
          error: isFetchErr ? undefined : `Database issue: ${error.message}`,
          timestamp 
        };
      }

      // 4. Re-validate published status and soft deletion filter
      const validRecords = (data || []).filter((rec: any) => {
        if (!rec || typeof rec !== 'object') return false;
        // Filter out soft-deleted records
        if (rec.deleted_at !== null && rec.deleted_at !== undefined) return false;
        // Re-validate published status
        if (rec.status && rec.status !== 'published') return false;
        return true;
      });

      const dbArticles = validRecords.map(mapDbRecordToArticle);

      // Combine dbArticles first, followed by static FEATURED_ARTICLES not already in DB
      const dbSlugsAndTitles = new Set(dbArticles.map(a => (a.slug || a.title).toLowerCase()));
      const featuredToInclude = FEATURED_ARTICLES.filter(fa => !dbSlugsAndTitles.has((fa.slug || fa.title).toLowerCase()));

      const combinedArticles = [...dbArticles, ...featuredToInclude];

      return { 
        data: combinedArticles, 
        isFallback: dbArticles.length === 0,
        timestamp 
      };
    } catch (err: any) {
      const isFetchErr = err?.message?.includes('Failed to fetch') || err?.name === 'TypeError';
      if (isFetchErr) {
        console.warn('[KNews 254 Article Service] Supabase network endpoint unreachable. Serving featured news fallback.');
      } else {
        console.warn('[KNews 254 Article Service] Exception listing articles:', err?.message || err);
      }
      return { 
        data: FEATURED_ARTICLES, 
        isFallback: true, 
        timestamp 
      };
    }
  },

  /**
   * Seed Initial News Stories into Supabase Database
   */
  async seedInitialArticles(): Promise<{ success: boolean; count: number; error?: string }> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { success: false, count: 0, error: 'Supabase credentials are not configured.' };
    }

    try {
      let seeded = 0;
      for (const art of FEATURED_ARTICLES) {
        const categoryId = await resolveCategoryId(art.category || 'politics');
        const slug = (art.slug || art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + '-' + Math.floor(Math.random() * 1000);
        const dbPayload: any = {
          title: art.title,
          slug,
          summary: art.summary || art.content.substring(0, 180) + '...',
          body: art.content,
          status: 'published',
          county: art.county || 'Nairobi',
          featured_image_url: art.imageUrl,
          is_featured: art.isFeatured ?? true,
          is_breaking: art.isBreaking ?? false,
          is_editor_choice: art.isEditorPick ?? false,
          primary_category_id: isValidUuid(categoryId) ? categoryId : null,
          published_at: new Date().toISOString()
        };

        const { error } = await client.from('articles').insert([dbPayload]);
        if (!error) seeded++;
      }

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true, count: seeded };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Failed to seed articles into Supabase.' };
    }
  },

  /**
   * List ALL articles for CMS Editorial Management (drafts, submitted, approved, published, archived)
   */
  async listAllArticlesForCms(): Promise<{ data: (Article & { dbStatus: ArticleStatus; rawRecord?: any })[]; error?: string }> {
    const featuredMapped = FEATURED_ARTICLES.map(a => ({
      ...a,
      dbStatus: 'published' as ArticleStatus,
      rawRecord: null
    }));

    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { data: featuredMapped };
    }

    try {
      let { data, error } = await client
        .from('articles')
        .select(SELECT_QUERY)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        const fallback = await client
          .from('articles')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });
        data = fallback.data;
        error = fallback.error;
      }

      if (error) {
        return { data: featuredMapped, error: error.message };
      }

      const dbArticles = (data || []).map(record => ({
        ...mapDbRecordToArticle(record),
        dbStatus: record.status as ArticleStatus,
        rawRecord: record
      }));

      const dbSlugsAndTitles = new Set(dbArticles.map(a => (a.slug || a.title).toLowerCase()));
      const featuredToInclude = featuredMapped.filter(fa => !dbSlugsAndTitles.has((fa.slug || fa.title).toLowerCase()));

      return { data: [...dbArticles, ...featuredToInclude] };
    } catch (err: any) {
      return { data: featuredMapped, error: err?.message || 'Failed to fetch CMS articles.' };
    }
  },

  /**
   * Get single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    const client = getSupabaseClient() || supabase;
    if (isSupabaseConfigured() && client) {
      try {
        let { data, error } = await client
          .from('articles')
          .select(SELECT_QUERY)
          .eq('id', id)
          .maybeSingle();

        if (error) {
          const fallback = await client
            .from('articles')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          data = fallback.data;
        }

        if (data) {
          return mapDbRecordToArticle(data);
        }
      } catch (err) {
        console.error('Error fetching article by id:', err);
      }
    }
    return FEATURED_ARTICLES.find(a => a.id === id) || null;
  },

  /**
   * Get single article by Slug or ID
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const client = getSupabaseClient() || supabase;
    if (isSupabaseConfigured() && client) {
      try {
        let { data, error } = await client
          .from('articles')
          .select(SELECT_QUERY)
          .eq('slug', slug)
          .maybeSingle();

        if (!data) {
          const { data: idData } = await client
            .from('articles')
            .select(SELECT_QUERY)
            .eq('id', slug)
            .maybeSingle();
          data = idData;
        }

        if (!data) {
          const fallback = await client
            .from('articles')
            .select('*')
            .or(`slug.eq.${slug},id.eq.${slug}`)
            .maybeSingle();
          data = fallback.data;
        }

        if (data) {
          return mapDbRecordToArticle(data);
        }
      } catch (err) {
        console.error('Error fetching article by slug:', err);
      }
    }
    return FEATURED_ARTICLES.find(a => a.slug === slug || a.id === slug) || null;
  },

  /**
   * List articles by Category
   */
  async listArticlesByCategory(category: NewsCategory | string): Promise<{ data: Article[]; error?: string }> {
    if (!category || category === 'home' || category === 'latest') {
      return this.listPublishedArticles();
    }

    const { data: allPublished, error } = await this.listPublishedArticles();
    if (error) return { data: [], error };

    const targetCat = category.toLowerCase().trim();
    const filtered = allPublished.filter(a => {
      const c = (a.category || '').toLowerCase();
      return c === targetCat || c.includes(targetCat) || targetCat.includes(c);
    });

    return { data: filtered };
  },

  /**
   * List articles by Author
   */
  async listArticlesByAuthor(authorIdOrName: string): Promise<{ data: Article[]; error?: string }> {
    const res = await this.listPublishedArticles();
    if (res.error) return res;
    const q = authorIdOrName.toLowerCase();
    const filtered = res.data.filter(a => 
      a.author.name.toLowerCase().includes(q) || 
      (a.author.id && a.author.id === authorIdOrName)
    );
    return { data: filtered };
  },

  /**
   * List articles by County
   */
  async listArticlesByCounty(countyName: string): Promise<{ data: Article[]; error?: string }> {
    const res = await this.listPublishedArticles();
    if (res.error) return res;
    const q = countyName.toLowerCase().trim();
    const filtered = res.data.filter(a => (a.county || '').toLowerCase().includes(q));
    return { data: filtered };
  },

  /**
   * List Breaking News articles
   */
  async listBreakingNews(): Promise<{ data: Article[]; error?: string }> {
    const res = await this.listPublishedArticles();
    if (res.error) return res;
    const filtered = res.data.filter(a => a.isBreaking);
    return { data: filtered };
  },

  /**
   * List Featured Articles
   */
  async listFeaturedArticles(): Promise<{ data: Article[]; error?: string }> {
    const res = await this.listPublishedArticles();
    if (res.error) return res;
    const filtered = res.data.filter(a => a.isFeatured);
    return { data: filtered };
  },

  /**
   * Search Articles in title, summary, body, county
   */
  async searchArticles(term: string): Promise<{ data: Article[]; error?: string }> {
    if (!term || !term.trim()) return this.listPublishedArticles();
    const res = await this.listPublishedArticles();
    if (res.error) return res;
    const q = term.toLowerCase().trim();
    const filtered = res.data.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      (a.county && a.county.toLowerCase().includes(q))
    );
    return { data: filtered };
  },

  /**
   * Create new article in Supabase. Default status is 'published'.
   */
  async createArticle(payload: {
    title: string;
    summary?: string;
    body: string;
    category?: string;
    county?: string;
    imageUrl?: string;
    imagePath?: string;
    imageCaption?: string;
    imageCredit?: string;
    mediaId?: string;
    isBreaking?: boolean;
    isFeatured?: boolean;
    isEditorPick?: boolean;
    status?: ArticleStatus;
    authorId?: string;
    scheduledAt?: string;
  }): Promise<{ success: boolean; article?: Article; error?: string }> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    const slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const targetStatus: ArticleStatus = payload.status || 'published';
    const isPublished = targetStatus === 'published';

    try {
      const categoryId = await resolveCategoryId(payload.category || 'politics');
      const validAuthorId = isValidUuid(payload.authorId) ? payload.authorId : null;
      const validCategoryId = isValidUuid(categoryId) ? categoryId : null;

      const dbPayload: any = {
        title: payload.title.trim(),
        slug,
        summary: payload.summary || payload.body.substring(0, 180) + '...',
        body: payload.body,
        status: targetStatus,
        county: payload.county || 'Nairobi',
        featured_image_url: payload.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
        featured_image_path: payload.imagePath || null,
        image_caption: payload.imageCaption || '',
        image_credit: payload.imageCredit || '',
        is_featured: payload.isFeatured ?? true,
        is_breaking: payload.isBreaking ?? false,
        is_editor_choice: payload.isEditorPick ?? false,
        primary_category_id: validCategoryId,
        published_at: isPublished ? (payload.scheduledAt || new Date().toISOString()) : (payload.scheduledAt || null),
        scheduled_at: payload.scheduledAt || null,
        author_id: validAuthorId
      };

      let { data, error } = await client
        .from('articles')
        .insert([dbPayload])
        .select(SELECT_QUERY)
        .maybeSingle();

      if (error) {
        // Retry insert with simple select('*') if join select fails
        const fallbackRes = await client
          .from('articles')
          .insert([dbPayload])
          .select('*')
          .maybeSingle();

        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        if (payload.mediaId) {
          await linkMediaToArticle(data.id, payload.mediaId, true, 0);
        }
        const supabaseArticle = mapDbRecordToArticle(data);
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('knews254_articles_updated'));
        return { success: true, article: supabaseArticle };
      }

      return { success: false, error: 'Article created but no record returned.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create article.' };
    }
  },

  /**
   * Update existing article in Supabase
   */
  async updateArticle(
    id: string,
    updates: {
      title?: string;
      summary?: string;
      body?: string;
      category?: string;
      county?: string;
      imageUrl?: string;
      imagePath?: string;
      imageCaption?: string;
      imageCredit?: string;
      mediaId?: string;
      isBreaking?: boolean;
      isFeatured?: boolean;
      isEditorPick?: boolean;
      status?: ArticleStatus;
      scheduledAt?: string;
    }
  ): Promise<{ success: boolean; article?: Article; error?: string }> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const patch: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.title) patch.title = updates.title.trim();
      if (updates.summary) patch.summary = updates.summary;
      if (updates.body) patch.body = updates.body;
      if (updates.county) patch.county = updates.county;
      if (updates.imageUrl) patch.featured_image_url = updates.imageUrl;
      if (updates.imagePath !== undefined) patch.featured_image_path = updates.imagePath;
      if (updates.imageCaption !== undefined) patch.image_caption = updates.imageCaption;
      if (updates.imageCredit !== undefined) patch.image_credit = updates.imageCredit;
      if (updates.isBreaking !== undefined) patch.is_breaking = updates.isBreaking;
      if (updates.isFeatured !== undefined) patch.is_featured = updates.isFeatured;
      if (updates.isEditorPick !== undefined) patch.is_editor_choice = updates.isEditorPick;

      if (updates.category) {
        const catId = await resolveCategoryId(updates.category);
        if (catId && isValidUuid(catId)) patch.primary_category_id = catId;
      }

      if (updates.status) {
        patch.status = updates.status;
        if (updates.status === 'published') {
          patch.published_at = new Date().toISOString();
        }
      }

      if (updates.scheduledAt) {
        patch.scheduled_at = updates.scheduledAt;
      }

      let { data, error } = await client
        .from('articles')
        .update(patch)
        .eq('id', id)
        .select(SELECT_QUERY)
        .maybeSingle();

      if (error) {
        const fallbackRes = await client
          .from('articles')
          .update(patch)
          .eq('id', id)
          .select('*')
          .maybeSingle();

        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) {
        return { success: false, error: error.message };
      }

      if (id && updates.mediaId) {
        await linkMediaToArticle(id, updates.mediaId, true, 0);
      }

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true, article: data ? mapDbRecordToArticle(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update article.' };
    }
  },

  /** Workflow status actions */
  async submitArticle(id: string) { return this.updateArticle(id, { status: 'submitted' }); },
  async approveArticle(id: string) { return this.updateArticle(id, { status: 'approved' }); },
  async scheduleArticle(id: string, time: string) { return this.updateArticle(id, { status: 'scheduled', scheduledAt: time }); },
  async publishArticle(id: string) { return this.updateArticle(id, { status: 'published' }); },
  async unpublishArticle(id: string) { return this.updateArticle(id, { status: 'draft' }); },
  async archiveArticle(id: string) { return this.updateArticle(id, { status: 'archived' }); },

  /**
   * Soft Delete Article (set deleted_at = NOW())
   */
  async softDeleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await client
        .from('articles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to soft delete article.' };
    }
  },

  /**
   * Restore Article (deleted_at = NULL, status = 'published')
   */
  async restoreArticle(id: string): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await client
        .from('articles')
        .update({ deleted_at: null, status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return { success: false, error: error.message };

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to restore article.' };
    }
  },

  /**
   * Record Article View in Analytics
   */
  async recordView(id: string): Promise<void> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) return;
    try {
      await client.from('article_views').insert({
        article_id: id,
        viewed_at: new Date().toISOString()
      });
    } catch (e) {
      // Non-blocking view tracking
    }
  },

  /**
   * Get Comments for an Article from Supabase
   */
  async getComments(articleId: string): Promise<{ id: string; name: string; text: string; date: string; likes: number }[]> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) return [];
    try {
      const { data, error } = await client
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(c => ({
          id: c.id,
          name: c.name || c.author_name || 'Anonymous Reader',
          text: c.content,
          date: new Date(c.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          likes: c.likes_count || 1
        }));
      }
    } catch (e) {
      console.warn('Get comments error:', e);
    }
    return [];
  },

  /**
   * Submit Comment for an Article in Supabase
   */
  async submitComment(articleId: string, name: string, content: string): Promise<boolean> {
    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured() || !client) return false;
    try {
      const { error } = await client.from('comments').insert({
        article_id: articleId,
        name: name.trim() || 'Anonymous Reader',
        content: content.trim(),
        status: 'pending'
      });
      return !error;
    } catch (e) {
      return false;
    }
  }
};
