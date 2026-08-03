# KNEWS254 DIGITAL MEDIA NETWORK - SUPABASE SETUP GUIDE

## Overview
This document describes the database setup, schema migration, storage buckets, and security configuration for **Knews254** using Supabase.

---

## 1. Executing Schema Migrations

The initial SQL migration script is located at:
`/supabase/migrations/20260803000000_knews254_initial_schema.sql`

To apply this migration:
1. Open your **Supabase Dashboard** (`https://app.supabase.com`).
2. Navigate to **SQL Editor** -> **New Query**.
3. Paste the contents of `20260803000000_knews254_initial_schema.sql`.
4. Click **Run**.

---

## 2. Storage Buckets Setup

Ensure the following buckets are created in **Supabase Storage**:

1. **`media`** (Public Bucket)
   - Used for article feature images, gallery photos, and attachments.
   - Max file size: `10 MB`.
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`.

2. **`avatars`** (Public Bucket)
   - Used for newsroom staff profile pictures, columnist headshots, and user profile pictures.
   - Max file size: `5 MB`.

To set public permissions in Supabase Storage UI:
- Go to **Storage** -> **Buckets** -> Select Bucket -> Enable **Public Bucket**.

---

## 3. Environment Variables

Define the following in `.env` (or via AI Studio Secrets):

```env
VITE_SUPABASE_URL="https://jplxdzfyaxpbrnpnbcug.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_XGBm-0k-2bC-6bVUIEdJ7Q_k-lx4hjY"
```

---

## 4. Verification Workflow

To test full database-backed publishing:
1. Open the **Editorial CMS Portal** in the application (`/admin` or via the header button).
2. Create a new article with a title, summary, content, and feature photo upload.
3. Click **Submit & Publish Article**.
4. Navigate to the **Homepage** or **Category Page** — the article will display live instantly from Supabase/persistent state.
