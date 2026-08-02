import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://jplxdzfyaxpbrnpnbcug.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_XGBm-0k-2bC-6bVUIEdJ7Q_k-lx4hjY';

const getEnvVar = (key: string): string => {
  const localVal = typeof localStorage !== 'undefined' ? localStorage.getItem(`knews254_${key.toLowerCase()}`) : null;
  if (localVal) return localVal;
  const metaEnv = (import.meta as any).env || {};
  if (metaEnv[key]) return metaEnv[key];
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
    !url.includes('your-project') && 
    !key.includes('your-supabase')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');
  if (url && key && !url.includes('your-project') && !key.includes('your-supabase')) {
    return createClient(url, key);
  }
  return null;
}

export const supabase: SupabaseClient | null = getSupabaseClient();

/**
 * Uploads a file to Supabase storage bucket or falls back to data URL
 */
export async function uploadMediaToSupabase(
  file: File, 
  bucket = 'media'
): Promise<{ url: string; error: string | null }> {
  try {
    const client = getSupabaseClient() || supabase;
    if (client && isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error.message);
        // Fall back to data URL read
        const dataUrl = await readFileAsDataUrl(file);
        return { url: dataUrl, error: `Supabase Bucket Error (${error.message}). Saved locally as preview.` };
      }

      const { data: publicUrlData } = client.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicUrlData.publicUrl, error: null };
    } else {
      // Offline / Local state fallback
      const dataUrl = await readFileAsDataUrl(file);
      return { 
        url: dataUrl, 
        error: 'Supabase credentials not set in environment. Saved locally as Data URL.' 
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
