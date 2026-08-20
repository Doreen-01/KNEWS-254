# KNEWS254 MEDIA NETWORK — EXISTING SUPABASE PROJECT SETUP GUIDE

This guide provides step-by-step instructions for project owners and administrators to apply the **idempotent repair migration** to an existing Supabase instance, configure Authentication & Storage, and deploy the application to the production container platform without data loss or downtime.

---

## Production Configuration Details

- **Production Application URL**: `https://knews254.co.ke`
- **Site URL**: `https://knews254.co.ke`
- **Allowed Redirect URLs**:
  - `https://knews254.co.ke`
  - `https://knews254.co.ke/**`
  - `http://localhost:5173`
  - `http://localhost:5173/**`

---

## 1. Database Backup Instructions
Before running any migration on an existing production database:
1. Go to your **Supabase Dashboard** -> **Database** -> **Backups**.
2. Click **Create Manual Backup** or **Download Backup** (for Pro/Enterprise projects).
3. Save the `.sql` backup file locally to guarantee roll-back ability.

---

## 2. Executing the Repair Migration

### ⚠️ CRITICAL WARNING: DO NOT RUN THE INITIAL MIGRATION!
Do **NOT** run `20260803000000_knews254_initial_schema.sql` on an existing database! The initial schema file contains hard `CREATE TABLE` statements without `IF NOT EXISTS` guards, which will cause transaction aborts or fail if tables/types already exist.

### How to Run the Repair Migration
1. In your Supabase Dashboard, navigate to **SQL Editor**.
2. Click **New query**.
3. Open `supabase/migrations/20260804000000_knews254_existing_project_repair.sql` in your local text editor.
4. Copy the entire contents of the file.
5. Paste the SQL code into the Supabase SQL Editor.
6. Click **Run** (or press `Ctrl + Enter`).

*(Note: The migration is wrapped in a transaction block `BEGIN; ... COMMIT;` and uses `IF NOT EXISTS` logic, making it 100% safe to re-run multiple times).*

---

## 3. Post-Migration Verification

Run the verification queries included at the end of the repair migration file:

### A. Verify Table Existence
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
*Expected Result:* Tables `articles`, `profiles`, `categories`, `tags`, `media`, `article_media`, `comments`, `contact_messages`, `newsletter_subscribers`, `vetting_requests`, `tipoffs`, `article_views`, `breaking_news`, `homepage_sections` should all exist.

### B. Verify Articles Table Columns
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'articles'
ORDER BY ordinal_position;
```
*Expected Result:* Columns `deleted_at`, `status`, `county`, `is_featured`, `is_breaking`, `is_editor_choice`, `primary_category_id`, `author_id` must all be present.

### C. Verify Profile & Auth User Linking Status
```sql
SELECT 
    p.name AS profile_name,
    p.email AS profile_email,
    p.role AS profile_role,
    p.auth_user_id,
    CASE 
        WHEN p.auth_user_id IS NOT NULL THEN 'LINKED TO AUTH.USERS'
        ELSE 'NOT LINKED (Create account in Auth first)'
    END AS linking_status
FROM public.profiles p;
```
*Expected Result:* Existing staff emails matching active users in `auth.users` will show `LINKED TO AUTH.USERS`. Unlinked profiles will show `NOT LINKED`.

To link an unlinked profile after a new user registers in Supabase Auth:
```sql
UPDATE public.profiles p
SET auth_user_id = u.id
FROM auth.users u
WHERE LOWER(TRIM(p.email)) = LOWER(TRIM(u.email));
```

### D. Verify Storage Buckets
```sql
SELECT id, name, public, file_size_limit FROM storage.buckets;
```
*Expected Result:* Public buckets `article-media` and `avatars` exist alongside private buckets `private-newsroom`, `career-files`, and `tipoff-files`.

### E. Verify RLS Policies
```sql
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```
*Expected Result:* Row Level Security is enabled across all tables with granular role-based policies.

---

## 4. Supabase Authentication Setup

1. In Supabase Dashboard, navigate to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to:
   `https://knews254.co.ke`
3. Under **Redirect URLs**, click **Add URL** and add the following entries:
   - `https://knews254.co.ke`
   - `https://knews254.co.ke/**`
   - `http://localhost:5173`
   - `http://localhost:5173/**`
4. Under **Authentication** -> **Email Templates**, ensure confirmation email links are active if email verification is enabled.

---

## 5. Production Deployment & Environment Variables

1. Build the repository with the included `Dockerfile` and deploy the resulting container to the chosen production platform.
2. Configure the following variables in the platform’s server-side environment settings:

| Key | Value | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase Project API URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Your Supabase Public Anon Key |

4. Set the container health check to `GET /api/health` and the readiness check to `GET /api/ready`.
5. Deploy the container with `PORT` supplied by the platform. The included server honors that value.

---

## 6. End-to-End Functional Verification Workflow

Follow this manual test scenario to confirm system integrity:

1. **Journalist Login & Story Draft**:
   - Access `https://knews254.co.ke/admin` (or local `/admin`).
   - Log in using a Journalist credential.
   - Click **+ New Article**.
   - Enter title, body, select county and category.
   - Click **Save Story Draft / Submit for Review**.
   - *Expected Outcome:* Article is saved to Supabase with status `submitted`.

2. **Image Upload Test**:
   - In the Article Editor, upload a featured image file.
   - *Expected Outcome:* File uploads directly to Supabase Storage bucket `article-media`. The public image URL is populated in the editor preview.

3. **Editor Approval & Publishing**:
   - Log in as an Editor or Super Admin.
   - Open **Newsroom Workflow** tab.
   - Locate the submitted article.
   - Click **Publish Article**.
   - *Expected Outcome:* Article status updates to `published` with `published_at = NOW()`.

4. **Public Site Reader Verification**:
   - Open the homepage `https://knews254.co.ke`.
   - Verify the newly published article appears in the top story feed and under its selected county/category.
   - Click on the article title to view full details.

5. **Unpublish Test**:
   - As Editor, change the article status back to `editing` or `archived`.
   - Refresh the public homepage.
   - *Expected Outcome:* Article immediately disappears from public feeds.

---

## 7. Operational Notes & Limitations

- **Spam Protection**: While Row Level Security guarantees database data isolation, public submission forms (`contact_messages`, `newsletter_subscribers`, `comments`, `vetting_requests`, `tipoffs`) should be paired with Cloudflare Turnstile or CAPTCHA on the frontend/API layer to prevent automated bot submissions before launch.
- **Service Role Key Security**: Never add `SUPABASE_SERVICE_ROLE_KEY` to client-side Vite environment variables. All client operations interact strictly via `VITE_SUPABASE_ANON_KEY` enforced by Row Level Security.
