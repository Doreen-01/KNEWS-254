import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  let value = '';

  if (typeof process !== 'undefined' && process.env?.[key]) {
    value = process.env[key] as string;
  }

  if (!value && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    value = (import.meta as any).env[key] || '';
  }

  return String(value).trim();
};

export function isSupabaseConfigured(): boolean {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');

  return Boolean(
    url &&
    key &&
    (url.startsWith('http://') || url.startsWith('https://')) &&
    !url.includes('YOUR_PROJECT_REF') &&
    !key.includes('YOUR_SUPABASE')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  try {
    return createClient(url, key);
  } catch (error) {
    console.warn('Supabase initialization failed:', error);
    return null;
  }
}

export const supabase: SupabaseClient | null = getSupabaseClient();

export interface ImageMetaData {
  caption?: string;
  credit?: string;
  altText?: string;
  width?: number;
  height?: number;
}

export async function uploadMediaToSupabase(
  file: File,
  bucket = 'article-media',
  meta: ImageMetaData = {}
): Promise<{
  url: string;
  path?: string;
  mediaId?: string;
  error: string | null;
}> {
  const MAX_SIZE = 10 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    return {
      url: '',
      error: `File size exceeds the 10MB limit (${(
        file.size / (1024 * 1024)
      ).toFixed(1)}MB).`
    };
  }

  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      url: '',
      error: `Unsupported file type: ${file.type || 'unknown'}.`
    };
  }

  const client = getSupabaseClient() || supabase;

  if (!client || !isSupabaseConfigured()) {
    return {
      url: '',
      error: 'Supabase is not configured.'
    };
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `articles/${Date.now()}_${safeName}`;

    let activeBucket = bucket;
    let uploadResult = await client.storage
      .from(activeBucket)
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.type
      });

    if (uploadResult.error && activeBucket !== 'media') {
      activeBucket = 'media';
      uploadResult = await client.storage
        .from(activeBucket)
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type
        });
    }

    if (uploadResult.error) {
      return {
        url: '',
        error: uploadResult.error.message
      };
    }

    const { data: publicUrlData } = client.storage
      .from(activeBucket)
      .getPublicUrl(uploadResult.data.path);

    const publicUrl = publicUrlData.publicUrl;
    let mediaId: string | undefined;

    const { data: mediaRecord, error: mediaError } = await client
      .from('media')
      .insert({
        original_filename: file.name,
        storage_key: uploadResult.data.path,
        public_url: publicUrl,
        mime_type: file.type,
        file_size: file.size,
        width: meta.width || 1200,
        height: meta.height || 800,
        caption: meta.caption || '',
        credit: meta.credit || '',
        alt_text: meta.altText || file.name.replace(/\.[^/.]+$/, '')
      })
      .select('id')
      .maybeSingle();

    if (mediaError) {
      console.warn('Media record was not created:', mediaError.message);
    } else {
      mediaId = mediaRecord?.id;
    }

    return {
      url: publicUrl,
      path: uploadResult.data.path,
      mediaId,
      error: null
    };
  } catch (error: any) {
    return {
      url: '',
      error: error?.message || 'Supabase upload failed.'
    };
  }
}

export async function linkMediaToArticle(
  articleId: string,
  mediaId: string,
  isFeatured = true,
  displayOrder = 0
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient() || supabase;

  if (!client || !isSupabaseConfigured()) {
    return { success: false, error: 'Supabase client unavailable.' };
  }

  try {
    const { error } = await client.from('article_media').upsert({
      article_id: articleId,
      media_id: mediaId,
      is_featured: isFeatured,
      display_order: displayOrder
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
