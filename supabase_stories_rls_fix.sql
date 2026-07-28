-- ====================================================================
-- OLTAPP: Hikaye modülü (community_stories) tablo + RLS
-- Supabase SQL Editor'da RUN. Veri silmez; policy günceller.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.community_stories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  location_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public stories select" ON public.community_stories;
CREATE POLICY "Public stories select" ON public.community_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public stories insert" ON public.community_stories;
DROP POLICY IF EXISTS "Users insert own story" ON public.community_stories;
CREATE POLICY "Users insert own story" ON public.community_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public stories delete" ON public.community_stories;
DROP POLICY IF EXISTS "Users delete own or admin story" ON public.community_stories;
CREATE POLICY "Users delete own or admin story" ON public.community_stories
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

NOTIFY pgrst, 'reload schema';
