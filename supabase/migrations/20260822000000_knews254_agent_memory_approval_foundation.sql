-- KNEWS254 AGENT MEMORY AND EDITORIAL APPROVAL FOUNDATION
-- Additive migration: creates durable agent-workflow tables without changing existing article data.

CREATE TABLE IF NOT EXISTS public.newsroom_agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'needs_review', 'failed', 'cancelled')),
  provider VARCHAR(80),
  model VARCHAR(120),
  input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_payload JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsroom_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_run_id UUID NOT NULL REFERENCES public.newsroom_agent_runs(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'needs_review' CHECK (status IN ('supported', 'unsupported', 'needs_review')),
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsroom_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN ('entity', 'source', 'style', 'correction', 'claim', 'policy')),
  subject VARCHAR(255) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence NUMERIC(5, 4) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.editorial_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  agent_run_id UUID REFERENCES public.newsroom_agent_runs(id) ON DELETE SET NULL,
  content_type VARCHAR(30) NOT NULL CHECK (content_type IN ('article', 'translation', 'social_draft', 'fact_check', 'seo')),
  platform VARCHAR(40),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested', 'scheduled', 'published', 'failed')),
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_run_id UUID REFERENCES public.newsroom_agent_runs(id) ON DELETE CASCADE,
  approval_id UUID REFERENCES public.editorial_approvals(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  score SMALLINT CHECK (score IS NULL OR (score >= 1 AND score <= 5)),
  correction_type VARCHAR(50),
  corrections JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsroom_agent_runs_article_idx ON public.newsroom_agent_runs(article_id, created_at DESC);
CREATE INDEX IF NOT EXISTS newsroom_agent_runs_status_idx ON public.newsroom_agent_runs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS newsroom_evidence_run_idx ON public.newsroom_evidence(agent_run_id, created_at DESC);
CREATE INDEX IF NOT EXISTS newsroom_memory_subject_idx ON public.newsroom_memory(memory_type, subject);
CREATE INDEX IF NOT EXISTS editorial_approvals_queue_idx ON public.editorial_approvals(status, content_type, created_at DESC);
CREATE INDEX IF NOT EXISTS editorial_approvals_article_idx ON public.editorial_approvals(article_id, created_at DESC);
CREATE INDEX IF NOT EXISTS agent_feedback_run_idx ON public.agent_feedback(agent_run_id, created_at DESC);

ALTER TABLE public.newsroom_agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsroom_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsroom_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff_read_agent_runs" ON public.newsroom_agent_runs;
DROP POLICY IF EXISTS "staff_manage_agent_runs" ON public.newsroom_agent_runs;
DROP POLICY IF EXISTS "staff_read_evidence" ON public.newsroom_evidence;
DROP POLICY IF EXISTS "staff_manage_evidence" ON public.newsroom_evidence;
DROP POLICY IF EXISTS "staff_read_memory" ON public.newsroom_memory;
DROP POLICY IF EXISTS "staff_manage_memory" ON public.newsroom_memory;
DROP POLICY IF EXISTS "staff_read_approvals" ON public.editorial_approvals;
DROP POLICY IF EXISTS "editor_manage_approvals" ON public.editorial_approvals;
DROP POLICY IF EXISTS "staff_read_feedback" ON public.agent_feedback;
DROP POLICY IF EXISTS "staff_manage_feedback" ON public.agent_feedback;

CREATE POLICY "staff_read_agent_runs" ON public.newsroom_agent_runs
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "staff_manage_agent_runs" ON public.newsroom_agent_runs
  FOR ALL USING (public.is_authenticated_staff()) WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "staff_read_evidence" ON public.newsroom_evidence
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "staff_manage_evidence" ON public.newsroom_evidence
  FOR ALL USING (public.is_authenticated_staff()) WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "staff_read_memory" ON public.newsroom_memory
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "staff_manage_memory" ON public.newsroom_memory
  FOR ALL USING (public.is_authenticated_staff()) WITH CHECK (public.is_authenticated_staff());

CREATE POLICY "staff_read_approvals" ON public.editorial_approvals
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "editor_manage_approvals" ON public.editorial_approvals
  FOR ALL USING (public.is_admin_or_editor()) WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "staff_read_feedback" ON public.agent_feedback
  FOR SELECT USING (public.is_authenticated_staff());
CREATE POLICY "staff_manage_feedback" ON public.agent_feedback
  FOR ALL USING (public.is_authenticated_staff()) WITH CHECK (public.is_authenticated_staff());

COMMENT ON TABLE public.newsroom_agent_runs IS 'Durable execution history and outputs for KNEWS254 newsroom agents.';
COMMENT ON TABLE public.newsroom_evidence IS 'Claim-level evidence ledger for agent-assisted editorial verification.';
COMMENT ON TABLE public.newsroom_memory IS 'Human-reviewable newsroom memory for entities, sources, corrections, claims, style, and policy.';
COMMENT ON TABLE public.editorial_approvals IS 'Approval queue for articles, translations, fact checks, SEO, and social drafts.';
COMMENT ON TABLE public.agent_feedback IS 'Editor feedback used to evaluate and improve newsroom agent outputs.';
