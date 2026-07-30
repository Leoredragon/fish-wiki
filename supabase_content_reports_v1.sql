-- content_reports table (also applied via Supabase migration content_reports_v1)
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('catch', 'forum', 'market', 'tip', 'story', 'comment')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'fake', 'wrong_species', 'offensive', 'other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status_created
  ON public.content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_target
  ON public.content_reports(target_type, target_id);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own reports" ON public.content_reports;
CREATE POLICY "Users insert own reports"
  ON public.content_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users view own reports" ON public.content_reports;
CREATE POLICY "Users view own reports"
  ON public.content_reports FOR SELECT
  USING (auth.uid() = reporter_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins update reports" ON public.content_reports;
CREATE POLICY "Admins update reports"
  ON public.content_reports FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete reports" ON public.content_reports;
CREATE POLICY "Admins delete reports"
  ON public.content_reports FOR DELETE
  USING (public.is_admin());
