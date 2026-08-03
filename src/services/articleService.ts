import { supabase, isSupabaseConfigured, linkMediaToArticle } from '../lib/supabase';
import { Article, NewsCategory } from '../types';

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
 * Category Slug <-> ID cache
 */
let categorySlugMap: Record<string, string> = {};

async function resolveCategoryId(slug: string): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const normalizedSlug = slug.toLowerCase().trim();
  if (categorySlugMap[normalizedSlug]) {
    return categorySlugMap[normalizedSlug];
  }
  try {
    const { data } = await supabase
      .from('categories')
      .select('id, slug')
      .ilike('slug', normalizedSlug)
      .maybeSingle();

    if (data?.id) {
      categorySlugMap[normalizedSlug] = data.id;
      return data.id;
    }
    // Fallback: pick any category or 'home'
    const fallback = await supabase.from('categories').select('id, slug').limit(1).maybeSingle();
    if (fallback.data?.id) {
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

const SELECT_QUERY = '*, primary_category:categories!articles_primary_category_id_fkey(id, name, slug), author:profiles!articles_author_id_fkey(id, name, role, profile_image)';

/**
 * ARTICLE SERVICE API (SUPABASE EXCLUSIVE)
 */
export const articleService = {
  /**
   * List all public published articles (status = 'published', deleted_at IS NULL, published_at <= NOW())
   */
  async listPublishedArticles(): Promise<{ data: Article[]; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch published articles error:', error);
        return { data: [], error: error.message };
      }

      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      console.error('Supabase fetch exception:', err);
      return { data: [], error: err?.message || 'Failed to load articles from Supabase.' };
    }
  },

  /**
   * List ALL articles for CMS Editorial Management (drafts, submitted, approved, published, archived)
   */
  async listAllArticlesForCms(): Promise<{ data: (Article & { dbStatus: ArticleStatus; rawRecord: any })[]; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      const mapped = (data || []).map(record => ({
        ...mapDbRecordToArticle(record),
        dbStatus: record.status as ArticleStatus,
        rawRecord: record
      }));

      return { data: mapped };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to load CMS articles.' };
    }
  },

  /**
   * Get single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapDbRecordToArticle(data);
      }
    } catch (err) {
      console.error('Error fetching article by id:', err);
    }
    return null;
  },

  /**
   * Get single article by Slug or ID
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
      let { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('slug', slug)
        .maybeSingle();

      if (!data) {
        const { data: idData } = await supabase
          .from('articles')
          .select(SELECT_QUERY)
          .eq('id', slug)
          .maybeSingle();
        data = idData;
      }

      if (data) {
        return mapDbRecordToArticle(data);
      }
    } catch (err) {
      console.error('Error fetching article by slug:', err);
    }
    return null;
  },

  /**
   * List articles by Category
   */
  async listArticlesByCategory(category: NewsCategory | string): Promise<{ data: Article[]; error?: string }> {
    if (!category || category === 'home' || category === 'latest') {
      return this.listPublishedArticles();
    }

    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const categoryId = await resolveCategoryId(category);
      const nowIso = new Date().toISOString();

      let query = supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .order('published_at', { ascending: false });

      if (categoryId) {
        query = query.eq('primary_category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) return { data: [], error: error.message };

      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch articles by category.' };
    }
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
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .ilike('county', `%${countyName}%`)
        .order('published_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch county articles.' };
    }
  },

  /**
   * List Breaking News articles
   */
  async listBreakingNews(): Promise<{ data: Article[]; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .eq('is_breaking', true)
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .order('published_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch breaking news.' };
    }
  },

  /**
   * List Featured Articles
   */
  async listFeaturedArticles(): Promise<{ data: Article[]; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .eq('is_featured', true)
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .order('published_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Failed to fetch featured stories.' };
    }
  },

  /**
   * Search Articles in title, summary, body, county
   */
  async searchArticles(term: string): Promise<{ data: Article[]; error?: string }> {
    if (!term || !term.trim()) return this.listPublishedArticles();
    if (!isSupabaseConfigured() || !supabase) {
      return { data: [], error: 'Supabase database is not configured.' };
    }

    try {
      const q = term.trim();
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(SELECT_QUERY)
        .eq('status', 'published')
        .is('deleted_at', null)
        .lte('published_at', nowIso)
        .or(`title.ilike.%${q}%,summary.ilike.%${q}%,body.ilike.%${q}%,county.ilike.%${q}%`)
        .order('published_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []).map(mapDbRecordToArticle) };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Search query failed.' };
    }
  },

  /**
   * Create new article draft or publication in Supabase
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
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured. Cannot create article.' };
    }

    try {
      const slug = payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

      const categoryId = await resolveCategoryId(payload.category || 'politics');
      const targetStatus = payload.status || 'draft';
      const isPublished = targetStatus === 'published';

      const dbPayload: any = {
        title: payload.title.trim(),
        slug,
        summary: payload.summary || payload.body.substring(0, 200) + '...',
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
        primary_category_id: categoryId || undefined,
        published_at: isPublished ? new Date().toISOString() : null,
        scheduled_at: payload.scheduledAt || null,
        author_id: payload.authorId || undefined
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([dbPayload])
        .select(SELECT_QUERY)
        .single();

      if (error) {
        console.error('Supabase article insert error:', error);
        return { success: false, error: error.message };
      }

      if (data?.id && payload.mediaId) {
        await linkMediaToArticle(data.id, payload.mediaId, true, 0);
      }

      const createdArticle = mapDbRecordToArticle(data);
      window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true, article: createdArticle };
    } catch (err: any) {
      console.error('Create article exception:', err);
      return { success: false, error: err?.message || 'Failed to insert article into Supabase.' };
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
    if (!isSupabaseConfigured() || !supabase) {
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
        if (catId) patch.primary_category_id = catId;
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

      const { data, error } = await supabase
        .from('articles')
        .update(patch)
        .eq('id', id)
        .select(SELECT_QUERY)
        .maybeSingle();

      if (error) {
        return { success: false, error: error.message };
      }

      if (id && updates.mediaId) {
        await linkMediaToArticle(id, updates.mediaId, true, 0);
      }

      window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true, article: data ? mapDbRecordToArticle(data) : undefined };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update article in Supabase.' };
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
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase
        .from('articles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return { success: false, error: error.message };

      window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete article.' };
    }
  },

  /**
   * Restore Article (deleted_at = NULL, status = 'published')
   */
  async restoreArticle(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase
        .from('articles')
        .update({ deleted_at: null, status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);

      if (error) return { success: false, error: error.message };

      window.dispatchEvent(new Event('knews254_articles_updated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to restore article.' };
    }
  },

  /**
   * Record Article View in Analytics
   */
  async recordView(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      await supabase.from('article_views').insert({
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
    if (!isSupabaseConfigured() || !supabase) return [];
    try {
      const { data, error } = await supabase
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
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('comments').insert({
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
