# KNEWS254 Newsroom Agents

The newsroom agent layer is a verification-first editorial assistant. It coordinates specialist roles rather than treating one model response as publication-ready truth.

## Coordinated roles

The pipeline runs an editorial planner, source and claim reviewer, fact-check reviewer, context and risk editor, SEO editor, translation editor, and social copy editor. The system returns concise rationales and evidence requirements, not hidden chain-of-thought.

## Endpoints

`POST /api/ai/newsroom-pipeline` accepts an article title, content, source, author, county, category, language, target translation languages, and mode. It returns an executive summary, key facts, claims requiring verification, a verification assessment, editorial risks and missing context, SEO metadata, translations, and platform-specific social drafts.

`POST /api/ai/social-drafts` returns social drafts for LinkedIn, Instagram, X, and WhatsApp. These are drafts only. Every draft includes `approvalRequired: true` and `publishStatus: "draft"`.

## Safety and approval behavior

The pipeline always returns `needs_human_review` until a human editor approves the output. It never claims that a social post was published, never treats missing evidence as verified, and falls back to a conservative review-needed result when the AI provider is unavailable. External publishing is disabled by design until a platform connector, account, approval workflow, and audit log are configured.

## Production configuration

When `GEMINI_API_KEY` is configured, the server uses the configured AI provider to generate structured JSON outputs. Without it, the deterministic fallback remains available for development and clearly marks verification confidence as zero. The production website still requires the live Supabase project and editor authentication to be verified separately.
