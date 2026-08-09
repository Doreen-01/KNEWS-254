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

export interface RolePermissions {
  canAccessCms: boolean;
  canPublish: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
  clearanceLevel: string;
}

export function getRolePermissions(role: string): RolePermissions {
  const normalized = (role || '').toLowerCase();
  const isSuper = normalized.includes('super_admin') || normalized.includes('chairman') || normalized.includes('founder') || normalized.includes('chief_admin');
  const isEditor = normalized.includes('editor') || normalized.includes('chief');
  const isHR = normalized.includes('hr_manager') || normalized.includes('talent');
  
  return {
    canAccessCms: true,
    canPublish: isSuper || isEditor || normalized.includes('journalist') || normalized.includes('reporter') || normalized.includes('correspondent'),
    canDelete: isSuper || normalized.includes('editor_in_chief') || normalized.includes('managing_editor'),
    canManageUsers: isSuper || isHR,
    canEditSettings: isSuper,
    clearanceLevel: isSuper ? 'LEVEL 4 SUPREME' : isEditor ? 'LEVEL 3 EXECUTIVE' : 'LEVEL 2 STAFF'
  };
}

export const authService = {
  /**
   * Get current authenticated user profile strictly from Supabase Auth + public.profiles
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.user) {
        return null;
      }

      const userId = session.user.id;
      const userEmail = session.user.email || '';
      const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0] || 'Knews254 Staff';
      const userAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '';

      // 1. Query public.profiles by auth_user_id
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();

      // 2. If not matched by auth_user_id, match by email
      if (!profile && userEmail) {
        const emailQuery = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', userEmail)
          .maybeSingle();

        if (emailQuery.data) {
          profile = emailQuery.data;
          // Link auth_user_id to existing profile
          await supabase
            .from('profiles')
            .update({ auth_user_id: userId })
            .eq('id', profile.id);
        }
      }

      // 3. If still no profile in database, auto-provision for authenticated user
      if (!profile && userEmail) {
        try {
          const { data: createdProfile } = await supabase
            .from('profiles')
            .insert([{
              auth_user_id: userId,
              name: userName,
              email: userEmail,
              role: 'journalist',
              status: 'ACTIVE',
              profile_image: userAvatar,
              department: 'Newsroom Operations',
              biography: 'Authenticated via Google OAuth'
            }])
            .select('*')
            .maybeSingle();

          if (createdProfile) {
            profile = createdProfile;
          }
        } catch (e) {
          console.warn('Auto profile creation in Supabase failed, using fallback profile:', e);
        }
      }

      if (profile) {
        return {
          id: profile.id,
          auth_user_id: userId,
          name: profile.name || userName,
          email: profile.email || userEmail,
          role: profile.role as UserRole,
          status: profile.status || 'ACTIVE',
          profile_image: profile.profile_image || userAvatar,
          department: profile.department || 'Newsroom Operations',
          biography: profile.biography || ''
        };
      }

      // 4. Session profile for authenticated OAuth user
      return {
        id: userId,
        auth_user_id: userId,
        name: userName,
        email: userEmail,
        role: 'journalist',
        status: 'ACTIVE',
        profile_image: userAvatar,
        department: 'Newsroom Operations',
        biography: 'Authenticated via Google OAuth'
      };
    } catch (err) {
      console.error('Supabase auth session error:', err);
      return null;
    }
  },

  /**
   * Update Profile in public.profiles table
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    const current = await this.getCurrentProfile();
    if (!current) {
      return { success: false, error: 'Not authenticated or staff profile not found.' };
    }

    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name ?? current.name,
          email: updates.email ?? current.email,
          profile_image: updates.profile_image ?? current.profile_image,
          department: updates.department ?? current.department,
          biography: updates.biography ?? current.biography,
          updated_at: new Date().toISOString()
        })
        .eq('id', current.id)
        .select('*')
        .maybeSingle();

      if (error) {
        return { success: false, error: error.message };
      }

      const refreshed = await this.getCurrentProfile();
      return { success: true, profile: refreshed || undefined };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile.' };
    }
  },

  /**
   * Login strictly using Supabase Authentication (signInWithPassword)
   */
  async login(email: string, pass: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: false, 
        error: 'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing. Please configure them in your environment settings.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return {
            success: false,
            error: 'Invalid login credentials. If this email is not registered yet, use the "Create Staff Account / Sign Up" option below to create your account or verify your user in Supabase Authentication.'
          };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await this.getCurrentProfile();
        if (!profile) {
          return {
            success: false,
            error: 'Authentication successful, but no staff profile is registered for this user in public.profiles. Contact your Administrator.'
          };
        }
        return { success: true, profile };
      }

      return { success: false, error: 'Authentication failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication error encountered.' };
    }
  },

  /**
   * Register a new user using Supabase Authentication (signUp)
   */
  async signUp(email: string, pass: string, name?: string): Promise<{ success: boolean; profile?: UserProfile; error?: string; requiresEmailConfirmation?: boolean }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured() || !supabase) {
      return { 
        success: false, 
        error: 'Supabase credentials are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: name || cleanEmail.split('@')[0]
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        const profile = await this.getCurrentProfile();
        return { success: true, profile };
      } else if (data.user) {
        return { 
          success: true, 
          requiresEmailConfirmation: true,
          error: 'Account created in Supabase! If "Confirm email" is enabled in your Supabase project, please check your inbox to confirm before logging in. (Or turn off "Confirm email" in Supabase Authentication settings to allow instant sign-in).'
        };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error creating account.' };
    }
  },

  /**
   * Login using Supabase Google OAuth Provider
   */
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials are required for authentication.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google OAuth authentication failed.' };
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
  },

  /**
   * Listens for authentication state changes and automatically retrieves 
   * the user's role-based permissions from the 'profiles' table after a successful sign-in,
   * providing the profile and role permissions to the callback.
   */
  subscribeToAuthChanges(callback: (profile: UserProfile | null, permissions: RolePermissions | null) => void) {
    if (!isSupabaseConfigured() || !supabase) {
      callback(null, null);
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION')) {
        const profile = await authService.getCurrentProfile();
        if (profile) {
          const permissions = getRolePermissions(profile.role);
          callback(profile, permissions);
        } else {
          callback(null, null);
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null, null);
      }
    });

    return subscription;
  }
};

