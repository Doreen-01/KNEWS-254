import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  category_slug?: string;
  tags?: string[];
}

const LOCAL_ARTICLES_STORAGE_KEY = 'knews254_cms_articles_v2';

/**
 * Local cache/store for CMS & fallback articles
 */
function getStoredLocalArticles(): Article[] {
  if (typeof window === 'undefined') return FEATURED_ARTICLES;
  try {
    const raw = localStorage.getItem(LOCAL_ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ARTICLES_STORAGE_KEY, JSON.stringify(FEATURED_ARTICLES));
      return FEATURED_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FEATURED_ARTICLES;
  } catch {
    return FEATURED_ARTICLES;
  }
}

function saveStoredLocalArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new Event('knews254_articles_updated'));
  } catch (e) {
    console.error('Error saving local articles:', e);
  }
}

/**
 * Helper to convert Supabase DbArticleRecord to UI Article interface
 */
export function mapDbRecordToArticle(record: any): Article {
  const publishedAtStr = record.published_at || record.created_at || new Date().toISOString();
  
  return {
    id: record.id,
    title: record.title,
    slug: record.slug || record.id,
    summary: record.summary || '',
    content: record.body || record.summary || '',
    category: (record.category_slug || record.category || 'home') as NewsCategory,
    author: {
      id: record.author_id,
      name: record.author_name || record.author?.name || 'Kelly Muthomi Kinoti',
      role: record.author_role || record.author?.role || 'Executive Editor',
      avatar: record.author_avatar || record.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: publishedAtStr,
    readTime: `${Math.max(2, Math.ceil((record.body?.length || 500) / 800))} min read`,
    imageUrl: record.featured_image_url || record.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    imageCaption: record.image_caption,
    county: record.county || 'Nairobi',
    isBreaking: Boolean(record.is_breaking || record.isBreaking),
    isFeatured: Boolean(record.is_featured || record.isFeatured),
    isEditorPick: Boolean(record.is_editor_choice || record.isEditorPick),
    viewCount: record.view_count || record.viewCount || 1250,
    tags: Array.isArray(record.tags) ? record.tags : ['Kenya', 'Knews254', record.county || 'Devolution']
  };
}

/**
 * ARTICLE REPOSITORY & SERVICE API
 */
export const articleService = {
  /**
   * List all published articles
   */
  async listPublishedArticles(): Promise<Article[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbRecordToArticle);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local/cached data:', err);
      }
    }
    
    // Fallback or offline store
    const local = getStoredLocalArticles();
    return local;
  },

  /**
   * Get single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapDbRecordToArticle(data);
        }
      } catch (err) {
        console.warn('Error fetching article by id:', err);
      }
    }

    const local = getStoredLocalArticles();
    return local.find(a => a.id === id || a.slug === id) || null;
  },

  /**
   * Get single article by Slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return mapDbRecordToArticle(data);
        }
      } catch (err) {
        console.warn('Error fetching article by slug:', err);
      }
    }

    const local = getStoredLocalArticles();
    return local.find(a => a.slug === slug || a.id === slug) || null;
  },

  /**
   * List articles by Category
   */
  async listArticlesByCategory(category: NewsCategory | string): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    if (!category || category === 'home' || category === 'latest') return all;
    return all.filter(a => a.category === category || a.tags.includes(String(category)));
  },

  /**
   * List articles by Author
   */
  async listArticlesByAuthor(authorNameOrId: string): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    const query = authorNameOrId.toLowerCase();
    return all.filter(a => 
      a.author.name.toLowerCase().includes(query) || 
      (a.author.id && a.author.id === authorNameOrId)
    );
  },

  /**
   * List articles by County
   */
  async listArticlesByCounty(countyName: string): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    const q = countyName.toLowerCase();
    return all.filter(a => (a.county && a.county.toLowerCase() === q) || a.tags.some(t => t.toLowerCase() === q));
  },

  /**
   * List Breaking News articles
   */
  async listBreakingNews(): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    return all.filter(a => a.isBreaking);
  },

  /**
   * List Featured Articles
   */
  async listFeaturedArticles(): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    return all.filter(a => a.isFeatured);
  },

  /**
   * List Editor Choices
   */
  async listEditorChoices(): Promise<Article[]> {
    const all = await this.listPublishedArticles();
    return all.filter(a => a.isEditorPick);
  },

  /**
   * Search Articles in title, summary, body, tags, county
   */
  async searchArticles(term: string): Promise<Article[]> {
    if (!term || !term.trim()) return this.listPublishedArticles();
    const q = term.toLowerCase().trim();
    const all = await this.listPublishedArticles();

    return all.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      (a.county && a.county.toLowerCase().includes(q)) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  /**
   * Create new article
   */
  async createArticle(payload: Partial<Article> & { status?: ArticleStatus }): Promise<{ success: boolean; article: Article; error?: string }> {
    const id = payload.id || `art-${Date.now()}`;
    const slug = payload.slug || payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || id;
    
    const newArticle: Article = {
      id,
      title: payload.title || 'Untitled Article',
      slug,
      summary: payload.summary || '',
      content: payload.content || '',
      category: (payload.category || 'home') as NewsCategory,
      author: payload.author || {
        name: 'Kelly Muthomi Kinoti',
        role: 'Chief Editor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      publishedAt: payload.publishedAt || new Date().toISOString().replace('T', ' ').substring(0, 16) + ' EAT',
      readTime: payload.readTime || '3 min read',
      imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
      imageCaption: payload.imageCaption,
      county: payload.county || 'Nairobi',
      isBreaking: payload.isBreaking ?? false,
      isFeatured: payload.isFeatured ?? true,
      isEditorPick: payload.isEditorPick ?? false,
      viewCount: payload.viewCount || 1,
      tags: payload.tags || ['Kenya', 'Knews254']
    };

    // 1. Always update local store for instant UI response & offline capability
    const local = getStoredLocalArticles();
    const updatedLocal = [newArticle, ...local.filter(a => a.id !== newArticle.id)];
    saveStoredLocalArticles(updatedLocal);

    // 2. Persist to Supabase if connected
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbPayload = {
          id: newArticle.id.includes('-') && newArticle.id.length > 20 ? newArticle.id : undefined,
          title: newArticle.title,
          slug: newArticle.slug,
          summary: newArticle.summary,
          body: newArticle.content,
          status: payload.status || 'published',
          county: newArticle.county,
          featured_image_url: newArticle.imageUrl,
          image_caption: newArticle.imageCaption,
          is_featured: newArticle.isFeatured,
          is_breaking: newArticle.isBreaking,
          is_editor_choice: newArticle.isEditorPick,
          published_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('articles')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.warn('Supabase insert warning:', error.message);
        } else if (data) {
          return { success: true, article: mapDbRecordToArticle(data) };
        }
      } catch (err: any) {
        console.warn('Supabase insert exception:', err);
      }
    }

    return { success: true, article: newArticle };
  },

  /**
   * Update existing article
   */
  async updateArticle(id: string, updates: Partial<Article> & { status?: ArticleStatus }): Promise<{ success: boolean; article: Article; error?: string }> {
    const local = getStoredLocalArticles();
    const existing = local.find(a => a.id === id || a.slug === id);
    if (!existing) {
      return { success: false, article: null as any, error: 'Article not found' };
    }

    const updatedArticle: Article = {
      ...existing,
      ...updates,
      author: updates.author ? { ...existing.author, ...updates.author } : existing.author,
    };

    const updatedList = local.map(a => (a.id === existing.id ? updatedArticle : a));
    saveStoredLocalArticles(updatedList);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('articles')
          .update({
            title: updatedArticle.title,
            summary: updatedArticle.summary,
            body: updatedArticle.content,
            county: updatedArticle.county,
            featured_image_url: updatedArticle.imageUrl,
            is_featured: updatedArticle.isFeatured,
            is_breaking: updatedArticle.isBreaking,
            is_editor_choice: updatedArticle.isEditorPick,
            status: updates.status || 'published'
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update exception:', err);
      }
    }

    return { success: true, article: updatedArticle };
  },

  /** Workflow status actions */
  async submitArticle(id: string) { return this.updateArticle(id, { status: 'submitted' }); },
  async approveArticle(id: string) { return this.updateArticle(id, { status: 'approved' }); },
  async scheduleArticle(id: string, time: string) { return this.updateArticle(id, { status: 'scheduled', scheduledFor: time }); },
  async publishArticle(id: string) { return this.updateArticle(id, { status: 'published' }); },
  async unpublishArticle(id: string) { return this.updateArticle(id, { status: 'draft' }); },
  async archiveArticle(id: string) { return this.updateArticle(id, { status: 'archived' }); },

  /**
   * Soft Delete Article
   */
  async softDeleteArticle(id: string): Promise<boolean> {
    const local = getStoredLocalArticles();
    const filtered = local.filter(a => a.id !== id);
    saveStoredLocalArticles(filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('articles')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);
      } catch (e) {
        console.error('Soft delete error:', e);
      }
    }
    return true;
  },

  /**
   * Restore Article
   */
  async restoreArticle(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('articles')
          .update({ deleted_at: null, status: 'published' })
          .eq('id', id);
      } catch (e) {
        console.error('Restore error:', e);
      }
    }
    return true;
  }
};
