# KNEWS254 MEDIA NETWORK - OWNER SETUP CHECKLIST

This checklist guides the system administrator through setting up, migrating, and deploying the **Knews254** production application on Supabase and Vercel.

---

## 1. Supabase Project Setup
1. Log into [Supabase Dashboard](https://database.new) and create a new project named **KNEWS254**.
2. Note down your project credentials from **Project Settings -> API**:
   - `Project URL` (e.g., `https://xyz...supabase.co`)
   - `anon / public key` (Publishable key starting with `eyJ...` or `sb_publishable_...`)

---

## 2. Environment Variables Configuration
Create or update your `.env` (or environment settings in AI Studio / Vercel):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

> **Note:** Do NOT include hardcoded keys in `.env.example` or code.

---

## 3. Storage Bucket Setup
1. In the Supabase Dashboard, navigate to **Storage -> Buckets**.
2. Create a new bucket named exactly: `article-media`.
3. Toggle **Public Bucket** to `ON` (enabled).
4. Save bucket settings.

---

## 4. SQL Migration Execution Steps

### ⚠️ IMPORTANT: How to Run SQL Queries in Supabase (Avoiding Error 42601)
Do **NOT** paste the file path (e.g. `supabase/migrations/20260803000000_knews254_initial_schema.sql`) into the SQL Editor. Typing a file path into PostgreSQL causes `ERROR: 42601: syntax error at or near "supabase"`.

**Correct Procedure:**
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Click **New query**.
3. Open the migration file in your text editor.
4. Select all text (`Ctrl+A` or `Cmd+A`), copy it, and paste the raw SQL code into the Supabase SQL Editor.
5. Click **Run** (or `Ctrl+Enter`).

### Choosing the Correct Migration File:
- **For a New / Clean Supabase Project:**
  Copy and execute the entire contents of:
  `supabase/migrations/20260803000000_knews254_initial_schema.sql`

- **For an Existing Supabase Database Repair:**
  Copy and execute the entire contents of:
  `supabase/migrations/20260804000000_knews254_existing_project_repair.sql`

---

## 5. Initial Super Admin Account Setup
After running the database migration and creating an account in **Authentication -> Users** (e.g., `kellymuthomi22@gmail.com`), assign the `super_admin` role in `public.profiles`:

```sql
INSERT INTO public.profiles (auth_user_id, name, email, role, status, department, biography)
SELECT 
    id AS auth_user_id,
    'Kelly Muthomi Kinoti' AS name,
    email,
    'super_admin'::user_role AS role,
    'ACTIVE' AS status,
    'Executive Governance & Engineering' AS department,
    'Founder & Super Administrator of Knews254 Media Group.' AS biography
FROM auth.users
WHERE email = 'kellymuthomi22@gmail.com'
ON CONFLICT (email) DO UPDATE 
SET auth_user_id = EXCLUDED.auth_user_id,
    role = 'super_admin'::user_role,
    status = 'ACTIVE';
```

---

## 6. Vercel Deployment Instructions
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add Environment Variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Verify `vercel.json` exists at root level for SPA routing support:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
5. Trigger build and deployment.
