-- ====================================================================
-- OLTAPP TOPLULUK MODÜLÜ (FORUM, PAZAR, FAYDALI BİLGİLER) KURULUM SCRIPT'İ
-- Supabase SQL Editor alanına yapıştırıp "RUN" butonuna basınız.
-- ====================================================================

-- 1. FORUM KONULARI (community_forum_posts)
CREATE TABLE IF NOT EXISTS public.community_forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Genel' NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_forum_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public forum posts select" ON public.community_forum_posts;
CREATE POLICY "Public forum posts select" ON public.community_forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own forum post" ON public.community_forum_posts;
CREATE POLICY "Users insert own forum post" ON public.community_forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own forum post" ON public.community_forum_posts;
CREATE POLICY "Users delete own forum post" ON public.community_forum_posts FOR DELETE USING (auth.uid() = user_id);

-- 2. FORUM CEVAPLARI (community_forum_replies)
CREATE TABLE IF NOT EXISTS public.community_forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_forum_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public forum replies select" ON public.community_forum_replies;
CREATE POLICY "Public forum replies select" ON public.community_forum_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own forum reply" ON public.community_forum_replies;
CREATE POLICY "Users insert own forum reply" ON public.community_forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. 2. EL EKİPMAN PAZARI (community_marketplace_items)
CREATE TABLE IF NOT EXISTS public.community_marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'TL' NOT NULL,
  item_type TEXT DEFAULT 'Aksesuar' NOT NULL,
  condition TEXT DEFAULT 'Az Kullanılmış' NOT NULL,
  city TEXT,
  contact_info TEXT,
  image_url TEXT,
  is_sold BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_marketplace_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public marketplace select" ON public.community_marketplace_items;
CREATE POLICY "Public marketplace select" ON public.community_marketplace_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own marketplace item" ON public.community_marketplace_items;
CREATE POLICY "Users insert own marketplace item" ON public.community_marketplace_items FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own marketplace item" ON public.community_marketplace_items;
CREATE POLICY "Users update own marketplace item" ON public.community_marketplace_items FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own marketplace item" ON public.community_marketplace_items;
CREATE POLICY "Users delete own marketplace item" ON public.community_marketplace_items FOR DELETE USING (auth.uid() = user_id);

-- 4. FAYDALI BİLGİLER VE TÜYOLAR (community_tips)
CREATE TABLE IF NOT EXISTS public.community_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Genel Tüyolar' NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  helpful_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_tips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public tips select" ON public.community_tips;
CREATE POLICY "Public tips select" ON public.community_tips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own tip" ON public.community_tips;
CREATE POLICY "Users insert own tip" ON public.community_tips FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own tip" ON public.community_tips;
CREATE POLICY "Users delete own tip" ON public.community_tips FOR DELETE USING (auth.uid() = user_id);
