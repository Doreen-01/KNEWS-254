import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type UserRole = 
  | 'super_admin'
  | 'managing_editor'
  | 'editor'
  | 'editor_in_chief'
  | 'journalist'
  | 'correspondent'
  | 'fact_checker'
  | 'multimedia_producer'
  | 'social_media_manager'
  | 'hr_manager'
  | 'support_officer'
  | 'legal_reviewer'
  | 'community_moderator'
  | 'advertising_manager'
  | 'customer_support'
  | 'analyst';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  profile_image?: string;
  department: string;
  biography?: string;
  created_at?: string;
}

export const authService = {
  /**
   * Get current authenticated user profile from Supabase Auth + public.profiles
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        return null;
      }

      const userId = session.user.id;
      const userEmail = session.user.email || '';

      // 1. Query public.profiles by auth_user_id
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      // 2. If not found by auth_user_id, match by email
      if (!profile && userEmail) {
        const emailQuery = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', userEmail)
          .maybeSingle();
        
        if (emailQuery.data) {
          profile = emailQuery.data;
          // Link auth_user_id to profile row
          await supabase
            .from('profiles')
            .update({ auth_user_id: userId })
            .eq('id', profile.id);
        }
      }

      if (profile) {
        return {
          id: profile.id,
          auth_user_id: userId,
          name: profile.name || userEmail.split('@')[0] || 'Knews254 Staff',
          email: profile.email || userEmail,
          role: (profile.role || 'journalist') as UserRole,
          status: profile.status || 'ACTIVE',
          profile_image: profile.profile_image || '',
          department: profile.department || 'Newsroom Operations',
          biography: profile.biography || ''
        };
      }

      // If user is authenticated in Supabase Auth but has no profiles row yet, return fallback derived from auth session
      return {
        id: userId,
        auth_user_id: userId,
        name: userEmail.split('@')[0] || 'Knews254 Staff',
        email: userEmail,
        role: 'journalist',
        status: 'ACTIVE',
        department: 'Newsroom Operations',
        biography: ''
      };
    } catch (err) {
      console.error('Supabase auth session check error:', err);
      return null;
    }
  },

  /**
   * Update Profile in public.profiles table
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase backend is not configured.' };
    }

    try {
      const current = await this.getCurrentProfile();
      if (!current) {
        return { success: false, error: 'Not authenticated.' };
      }

      const updated: UserProfile = { ...current, ...updates };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: updated.id,
          auth_user_id: updated.auth_user_id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          profile_image: updated.profile_image,
          department: updated.department,
          biography: updated.biography
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, profile: updated };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile.' };
    }
  },

  /**
   * Login strictly using Supabase Authentication (signInWithPassword)
   */
  async login(email: string, pass: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials are required for authentication.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await this.getCurrentProfile();
        return { success: true, profile: profile || undefined };
      }

      return { success: false, error: 'Login failed to establish a session.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication system error.' };
    }
  },

  /**
   * Logout from Supabase Auth session
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Signout error:', e);
      }
    }
    // Clear any lingering session keys
    localStorage.removeItem('knews254_staff_session');
    localStorage.removeItem('knews254_superadmin_auth');
    localStorage.removeItem('knews254_staff_list');
    localStorage.removeItem('knews254_staff_profile_v1');
    localStorage.removeItem('knews254_auth_token');
  }
};

