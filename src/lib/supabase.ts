import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  let val = '';
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    val = process.env[key]!;
  }
  if (!val && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    val = (import.meta as any).env[key] || '';
  }
  if (val && val.includes('=')) {
    val = val.split('=').pop() || val;
  }
  if (val && String(val).trim() && !String(val).includes('your-project') && !String(val).includes('abcdefghijklmno')) {
    return String(val).trim();
  }
  if (key === 'VITE_SUPABASE_URL' || key === 'SUPABASE_URL') {
    return 'https://jplxdzfyaxpbrnpnbcug.supabase.co';
  }
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    return 'sb_publishable_XGBm-0k-2bC-6bVUIEdJ7Q_k-lx4hjY';
  }
  return '';
};

export function isSupabaseConfigured(): boolean {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');
  return Boolean(
    url && 
    key && 
    (url.startsWith('http://') || url.startsWith('https://')) &&
    !url.includes('your-project') && 
    !key.includes('your-supabase')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');
  if (url && key && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      return createClient(url, key);
    } catch (err) {
      console.warn('Supabase initialization failed:', err);
      return null;
    }
  }
  return null;
}

export const supabase: SupabaseClient | null = getSupabaseClient();

export interface ImageMetaData {
  caption?: string;
  credit?: string;
  altText?: string;
  width?: number;
  height?: number;
}

/**
 * Uploads an article image strictly to Supabase Storage bucket ('article-media') with metadata tracking in the media table.
 * NO FileReader/Base64/Data URL fallbacks as per Phase 3 requirements.
 */
export async function uploadMediaToSupabase(
  file: File, 
  bucket = 'article-media',
  meta: ImageMetaData = {}
): Promise<{ url: string; path?: string; mediaId?: string; error: string | null }> {
  // 1. File size validation (10MB Max)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      url: '',
      error: `File size exceeds maximum allowed limit of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Upload rejected.`
    };
  }

  // 2. MIME type check
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      url: '',
      error: `Unsupported file type (${file.type || 'unknown'}). Allowed formats: JPG, PNG, WebP, GIF, SVG.`
    };
  }

  try {
    const client = getSupabaseClient() || supabase;
    if (!client || !isSupabaseConfigured()) {
      return {
        url: '',
        error: 'Supabase storage engine is not configured. Cannot upload image.'
      };
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase();
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${sanitizedOriginal}`;
    const filePath = `articles/${fileName}`;

    // Upload directly to Supabase Storage bucket 'article-media'
    let activeBucket = bucket;
    let uploadRes = await client.storage
      .from(activeBucket)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.type
      });

    // Fallback to 'media' bucket if primary bucket is named 'media' in Supabase project
    if (uploadRes.error && activeBucket !== 'media') {
      activeBucket = 'media';
      uploadRes = await client.storage
        .from(activeBucket)
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type
        });
    }

    if (uploadRes.error) {
      console.error('Supabase Storage Upload Failure:', uploadRes.error.message);
      return { 
        url: '', 
        error: `Supabase Storage upload failed: ${uploadRes.error.message}` 
      };
    }

    const { data: publicUrlData } = client.storage
      .from(activeBucket)
      .getPublicUrl(uploadRes.data.path);

    const publicUrl = publicUrlData.publicUrl;
    let mediaId: string | undefined = undefined;

    // Record image metadata in the 'media' database table
    try {
      const { data: mediaRecord, error: mediaDbErr } = await client
        .from('media')
        .insert([{
          original_filename: file.name,
          storage_key: uploadRes.data.path,
          public_url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          width: meta.width || 1200,
          height: meta.height || 800,
          caption: meta.caption || '',
          credit: meta.credit || '',
          alt_text: meta.altText || file.name.replace(/\.[^/.]+$/, '')
        }])
        .select('id')
        .maybeSingle();

      if (mediaDbErr) {
        console.warn('Media DB record creation notice:', mediaDbErr.message);
      } else if (mediaRecord?.id) {
        mediaId = mediaRecord.id;
      }
    } catch (e: any) {
      console.warn('Media DB table log exception:', e?.message || e);
    }

    return { 
      url: publicUrl, 
      path: uploadRes.data.path, 
      mediaId, 
      error: null 
    };
  } catch (err: any) {
    console.error('Supabase upload exception:', err);
    return { url: '', error: err?.message || 'Storage upload error encountered.' };
  }
}

/**
 * Link an uploaded media record to an article in the 'article_media' join table
 */
export async function linkMediaToArticle(
  articleId: string, 
  mediaId: string, 
  isFeatured = true, 
  displayOrder = 0
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient() || supabase;
  if (!client || !isSupabaseConfigured()) {
    return { success: false, error: 'Supabase client unavailable' };
  }
  try {
    const { error } = await client.from('article_media').upsert([
      {
        article_id: articleId,
        media_id: mediaId,
        is_featured: isFeatured,
        display_order: displayOrder
      }
    ]);
    if (error) {
      console.warn('article_media relation notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
