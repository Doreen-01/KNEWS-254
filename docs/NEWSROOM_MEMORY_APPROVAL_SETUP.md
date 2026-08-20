# Newsroom Memory and Approval Foundation

The migration `supabase/migrations/20260822000000_knews254_agent_memory_approval_foundation.sql` adds the durable data foundation for the KNEWS254 agents without changing existing articles or publishing data.

## Tables

`newsroom_agent_runs` stores queued, running, completed, review-needed, failed, and cancelled agent executions with their input, output, provider, model, and timestamps.

`newsroom_evidence` stores a claim-level evidence ledger linked to an agent run. Each entry is marked `supported`, `unsupported`, or `needs_review`.

`newsroom_memory` stores human-reviewable entity, source, style, correction, claim, and policy memories with confidence and source references.

`editorial_approvals` provides the review queue for articles, translations, fact checks, SEO outputs, and social drafts. Social content remains a draft until an editor explicitly approves it.

`agent_feedback` stores reviewer scores, corrections, notes, and correction types for future evaluation and improvement.

## Safety model

All five tables have row-level security enabled. Staff can read the agent workflow data. Staff can manage execution, evidence, memory, and feedback records. Approval records are readable by staff, but approval management is restricted to administrator/editor roles. No policy enables public access, and the migration does not publish social content.

## Safe application order

Before applying the migration to the live Supabase project, create a database backup and confirm that the project is the one used by the live Vercel deployment: `jplxdzfyaxpbrnpnbcug`. Apply the migration in a staging or SQL-editor transaction first, inspect the created tables and policies, then test with a staff account and a non-staff account. Do not apply it to another Supabase project.

The application endpoints already accept optional evidence references and return the structured research plan, evidence ledger, self-review result, and approval-gated social drafts. Persisting those outputs requires connecting the application service to these tables after live Supabase access is available.
