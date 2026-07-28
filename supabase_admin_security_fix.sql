-- ====================================================================
-- OLTAPP: Admin güvenlik & RLS düzeltmesi (Supabase SQL Editor'da RUN)
-- Bu script veri SİLMEZ. Sadece kolon/fonksiyon/policy günceller.
-- ====================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND COALESCE(p.is_admin, false) = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Wiki: sadece admin yazabilsin
DROP POLICY IF EXISTS "Admin insert wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin insert wiki_articles" ON public.wiki_articles FOR INSERT WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admin update wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin update wiki_articles" ON public.wiki_articles FOR UPDATE USING (public.is_admin());
DROP POLICY IF EXISTS "Admin delete wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin delete wiki_articles" ON public.wiki_articles FOR DELETE USING (public.is_admin());

-- Topluluk silme/güncelleme: sahip VEYA admin (eski OR true açığı kapatıldı)
DROP POLICY IF EXISTS "Users delete own or admin forum post" ON public.community_forum_posts;
CREATE POLICY "Users delete own or admin forum post" ON public.community_forum_posts FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete own or admin forum reply" ON public.community_forum_replies;
CREATE POLICY "Users delete own or admin forum reply" ON public.community_forum_replies FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users update own marketplace item" ON public.community_marketplace_items;
CREATE POLICY "Users update own marketplace item" ON public.community_marketplace_items FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete own or admin marketplace item" ON public.community_marketplace_items;
CREATE POLICY "Users delete own or admin marketplace item" ON public.community_marketplace_items FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete marketplace comment" ON public.community_marketplace_comments;
CREATE POLICY "Users delete marketplace comment" ON public.community_marketplace_comments FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete own or admin tip" ON public.community_tips;
CREATE POLICY "Users delete own or admin tip" ON public.community_tips FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users delete tip comment" ON public.community_tip_comments;
CREATE POLICY "Users delete tip comment" ON public.community_tip_comments FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Kendini admin yapmak için (bir kere, kendi email/id ile):
-- UPDATE public.profiles SET is_admin = true WHERE id = '<SENIN_USER_UUID>';

NOTIFY pgrst, 'reload schema';
