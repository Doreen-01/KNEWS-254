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

const PROFILE_STORAGE_KEY = 'knews254_staff_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-001',
  name: 'Kelly Muthomi Kinoti',
  email: 'kellymuthomi22@gmail.com',
  role: 'super_admin',
  status: 'ACTIVE',
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  department: 'Executive Bureau & Chief Tech Office',
  biography: 'Executive Chairman & Chief Architect of Knews254 Digital Media Network.'
};

export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('knews254_profile_updated'));
  } catch (e) {
    console.error('Failed to save profile locally:', e);
  }
}

export const authService = {
  /**
   * Get current active user profile
   */
  async getCurrentProfile(): Promise<UserProfile> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // 1. Try querying by auth_user_id
          let { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();

          // 2. If not found, try querying by email
          if (!data && session.user.email) {
            const emailQuery = await supabase
              .from('profiles')
              .select('*')
              .ilike('email', session.user.email)
              .maybeSingle();
            
            if (emailQuery.data) {
              data = emailQuery.data;
              // Link auth_user_id
              await supabase
                .from('profiles')
                .update({ auth_user_id: session.user.id })
                .eq('id', data.id);
            }
          }

          if (data) {
            const mapped: UserProfile = {
              id: data.id,
              auth_user_id: session.user.id,
              name: data.name || session.user.email?.split('@')[0] || 'Knews254 Staff',
              email: data.email || session.user.email || '',
              role: (data.role || 'journalist') as UserRole,
              status: data.status || 'ACTIVE',
              profile_image: data.profile_image || getStoredProfile().profile_image,
              department: data.department || 'Editorial Desk',
              biography: data.biography || ''
            };
            saveStoredProfile(mapped);
            return mapped;
          }
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err);
      }
    }

    return getStoredProfile();
  },

  /**
   * Update Profile (including Profile Picture!)
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    const current = getStoredProfile();
    const updated: UserProfile = {
      ...current,
      ...updates
    };

    saveStoredProfile(updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            profile_image: updated.profile_image,
            department: updated.department,
            biography: updated.biography
          });
      } catch (err: any) {
        console.warn('Supabase profile update warning:', err);
      }
    }

    return { success: true, profile: updated };
  },

  /**
   * Login using Supabase Auth or Local Demo Mode
   */
  async login(email: string, pass: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile = await this.getCurrentProfile();
          return { success: true, profile };
        }
      } catch (err: any) {
        console.warn('Supabase auth error:', err);
      }
    }

    // Default staff login
    const localProfile = getStoredProfile();
    localProfile.email = email;
    saveStoredProfile(localProfile);
    return { success: true, profile: localProfile };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Signout error:', e);
      }
    }
    localStorage.removeItem('knews254_auth_token');
  }
};
