-- ====================================================================
-- KNEWS254 DIGITAL MEDIA NETWORK - FIX AUTH USER CREATION & INVITE TRIGGER
-- File Path: supabase/migrations/20260809000000_fix_auth_user_trigger.sql
-- Description: Bulletproof auth.users insert trigger with ON CONFLICT resolution
-- ====================================================================

-- 1. Ensure user_role enum exists safely
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'managing_editor',
        'editor',
        'editor_in_chief',
        'journalist',
        'correspondent',
        'fact_checker',
        'multimedia_producer',
        'social_media_manager',
        'hr_manager',
        'support_officer',
        'legal_reviewer',
        'community_moderator',
        'advertising_manager',
        'customer_support',
        'analyst'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Create or update trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_name TEXT;
    assigned_role public.user_role;
BEGIN
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        SPLIT_PART(NEW.email, '@', 1)
    );

    IF LOWER(NEW.email) = 'kellymuthomi22@gmail.com' THEN
        assigned_role := 'super_admin'::public.user_role;
    ELSIF LOWER(NEW.email) = 'doreenngugi38@gmail.com' THEN
        assigned_role := 'managing_editor'::public.user_role;
    ELSE
        assigned_role := 'journalist'::public.user_role;
    END IF;

    INSERT INTO public.profiles (
        id,
        auth_user_id,
        email,
        name,
        role,
        status,
        department,
        created_at,
        updated_at
    )
    VALUES (
        gen_random_uuid(),
        NEW.id,
        LOWER(NEW.email),
        user_name,
        assigned_role,
        'ACTIVE',
        'Newsroom Operations',
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        auth_user_id = EXCLUDED.auth_user_id,
        name = COALESCE(public.profiles.name, EXCLUDED.name),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user trigger warning: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Re-bind trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
