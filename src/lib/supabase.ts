import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://jplxdzfyaxpbrnpnbcug.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_XGBm-0k-2bC-6bVUIEdJ7Q_k-lx4hjY';

const getEnvVar = (key: string): string => {
  if (typeof localStorage !== 'undefined') {
    const shortKey = key.replace('VITE_', '').toLowerCase();
    const directKey = key.toLowerCase();
    const val = localStorage.getItem(`knews254_${shortKey}`) || localStorage.getItem(`knews254_${directKey}`);
    if (val && val.trim() && !val.includes('your-project') && !val.includes('your-supabase')) {
      return val.trim();
    }
  }

  const metaEnv = (import.meta as any).env || {};
  const metaVal = metaEnv[key];
  if (metaVal && String(metaVal).trim() && !String(metaVal).includes('your-project')) {
    return String(metaVal).trim();
  }

  if (key === 'VITE_SUPABASE_URL') return DEFAULT_SUPABASE_URL;
  if (key === 'VITE_SUPABASE_ANON_KEY') return DEFAULT_SUPABASE_KEY;
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

/**
 * Uploads a file to Supabase storage bucket with validation & database tracking
 */
export async function uploadMediaToSupabase(
  file: File, 
  bucket = 'media'
): Promise<{ url: string; path?: string; error: string | null }> {
  // 1. File size validation (10MB Max)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      url: '',
      error: `File size exceeds maximum allowed limit of 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
    };
  }

  // 2. MIME type check
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      url: '',
      error: `Unsupported file type (${file.type}). Allowed formats: JPG, PNG, WebP, GIF, SVG.`
    };
  }

  try {
    const client = getSupabaseClient() || supabase;
    if (client && isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanExt = fileExt.toLowerCase();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = `articles/${fileName}`;

      const { data, error } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.warn('Supabase Storage Bucket Error:', error.message);
        const dataUrl = await readFileAsDataUrl(file);
        return { 
          url: dataUrl, 
          error: `Storage Bucket Notice: ${error.message}. Saved image as persistent Data URL preview.` 
        };
      }

      const { data: publicUrlData } = client.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Record in media database table
      try {
        await client.from('media').insert([{
          original_filename: file.name,
          storage_key: data.path,
          public_url: publicUrlData.publicUrl,
          mime_type: file.type,
          file_size: file.size
        }]);
      } catch (e) {
        console.warn('Media DB table log optional notice:', e);
      }

      return { url: publicUrlData.publicUrl, path: data.path, error: null };
    } else {
      const dataUrl = await readFileAsDataUrl(file);
      return { 
        url: dataUrl, 
        error: null 
      };
    }
  } catch (err: any) {
    const dataUrl = await readFileAsDataUrl(file);
    return { url: dataUrl, error: err?.message || 'Upload error' };
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
}
