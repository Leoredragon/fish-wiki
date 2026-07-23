-- ========================================================
-- OLTAPP (LIVAR) - FEATURE TABLES SETUP
-- Notifications & Favorite Spots Tables & RLS Policies
-- ========================================================

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like', 'comment')),
    catch_id UUID REFERENCES public.catch_logs(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create notifications for others" ON public.notifications;
CREATE POLICY "Users can create notifications for others"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = actor_id);

DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Index for fast notification lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read, created_at DESC);


-- 2. FAVORITE SPOTS TABLE
CREATE TABLE IF NOT EXISTS public.favorite_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spot_id UUID NOT NULL REFERENCES public.fishing_spots(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, spot_id)
);

-- RLS for Favorite Spots
ALTER TABLE public.favorite_spots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their favorite spots" ON public.favorite_spots;
CREATE POLICY "Users can view their favorite spots"
ON public.favorite_spots FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add favorite spots" ON public.favorite_spots;
CREATE POLICY "Users can add favorite spots"
ON public.favorite_spots FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete favorite spots" ON public.favorite_spots;
CREATE POLICY "Users can delete favorite spots"
ON public.favorite_spots FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast user favorites query
CREATE INDEX IF NOT EXISTS idx_favorite_spots_user ON public.favorite_spots(user_id);
