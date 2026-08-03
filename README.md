# KNEWS254 - Complete Digital News Publishing Platform

**Knews254** is a high-performance digital news publishing platform built for Kenya, East Africa, and the Global Diaspora.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Express Server (`server.ts`)
- **Database & Storage**: Supabase (PostgreSQL, Storage Buckets, RLS, Auth)
- **AI Integration**: Google GenAI SDK (`@google/genai`)

## Key Features
- **Database-Backed Publishing**: Articles created in the Editorial CMS persist in Supabase and sync live to the public site.
- **Profile Picture Uploads**: Permanent staff profile image upload to Supabase Storage.
- **SEO & Search Indexability**: Automatic JSON-LD news schemas, open graph tags, dynamic `sitemap.xml`, and `rss.xml`.
- **47 Counties & Devolution Desk**: Hyper-local Kenya county news filtering and candidate tracking.
- **Fact-Checking Workbench**: Forensic claim debunking unit with verification badges.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Server**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

4. **Database Setup**:
   Refer to `docs/SUPABASE_SETUP.md` for SQL migration instructions.
