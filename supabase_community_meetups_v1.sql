-- community meetups (also applied via migration community_meetups_v1)
CREATE TABLE IF NOT EXISTS public.community_meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT,
  spot_note TEXT NOT NULL,
  meetup_at TIMESTAMPTZ NOT NULL,
  max_participants INT NOT NULL DEFAULT 4 CHECK (max_participants >= 2 AND max_participants <= 20),
  fish_focus TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_meetup_joins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meetup_id UUID NOT NULL REFERENCES public.community_meetups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (meetup_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_community_meetups_at ON public.community_meetups(meetup_at ASC);
CREATE INDEX IF NOT EXISTS idx_community_meetups_status ON public.community_meetups(status, meetup_at);
CREATE INDEX IF NOT EXISTS idx_meetup_joins_meetup ON public.community_meetup_joins(meetup_id);

ALTER TABLE public.community_meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_meetup_joins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public meetups select" ON public.community_meetups;
CREATE POLICY "Public meetups select" ON public.community_meetups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own meetups" ON public.community_meetups;
CREATE POLICY "Users insert own meetups" ON public.community_meetups FOR INSERT WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Host or admin update meetups" ON public.community_meetups;
CREATE POLICY "Host or admin update meetups" ON public.community_meetups FOR UPDATE USING (auth.uid() = host_id OR public.is_admin());

DROP POLICY IF EXISTS "Host or admin delete meetups" ON public.community_meetups;
CREATE POLICY "Host or admin delete meetups" ON public.community_meetups FOR DELETE USING (auth.uid() = host_id OR public.is_admin());

DROP POLICY IF EXISTS "Public meetup joins select" ON public.community_meetup_joins;
CREATE POLICY "Public meetup joins select" ON public.community_meetup_joins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own meetup join" ON public.community_meetup_joins;
CREATE POLICY "Users insert own meetup join" ON public.community_meetup_joins FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own meetup join" ON public.community_meetup_joins;
CREATE POLICY "Users delete own meetup join" ON public.community_meetup_joins FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
