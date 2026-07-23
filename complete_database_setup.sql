-- ====================================================================
-- OLTAPP (LIVAR) TÜM VERİTABANI & STORAGE KURULUM SCRIPT'İ
-- Supabase SQL Editor alanına kopyalayıp "RUN" butonuna basınız.
-- ====================================================================

-- 1. KULLANICI PROFİLLERİ (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles select" ON public.profiles;
CREATE POLICY "Public profiles select" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Otomatik profil oluşturma tetikleyicisi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. EKİPMAN SETLERİ (tackle_sets)
CREATE TABLE IF NOT EXISTS public.tackle_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  image_url TEXT,
  rod JSONB,
  reel JSONB,
  line JSONB,
  lure JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tackle_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own tackle_sets" ON public.tackle_sets;
CREATE POLICY "Users view own tackle_sets" ON public.tackle_sets FOR SELECT USING (auth.uid() = user_id OR true);

DROP POLICY IF EXISTS "Users insert own tackle_sets" ON public.tackle_sets;
CREATE POLICY "Users insert own tackle_sets" ON public.tackle_sets FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own tackle_sets" ON public.tackle_sets;
CREATE POLICY "Users update own tackle_sets" ON public.tackle_sets FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own tackle_sets" ON public.tackle_sets;
CREATE POLICY "Users delete own tackle_sets" ON public.tackle_sets FOR DELETE USING (auth.uid() = user_id);


-- 3. AV GÜNLÜĞÜ (catch_logs)
CREATE TABLE IF NOT EXISTS public.catch_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fish_id UUID,
  tackle_box_id UUID,
  image_url TEXT NOT NULL,
  weight NUMERIC,
  length NUMERIC,
  lure_used TEXT,
  location_note TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.catch_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select catch_logs" ON public.catch_logs;
CREATE POLICY "Public select catch_logs" ON public.catch_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own catch_logs" ON public.catch_logs;
CREATE POLICY "Users insert own catch_logs" ON public.catch_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own catch_logs" ON public.catch_logs;
CREATE POLICY "Users update own catch_logs" ON public.catch_logs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own catch_logs" ON public.catch_logs;
CREATE POLICY "Users delete own catch_logs" ON public.catch_logs FOR DELETE USING (auth.uid() = user_id);

-- Foreign key bağlantısını tackle_sets tablosuna güncellemeli olarak düzeltme
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'catch_logs_tackle_box_id_fkey' AND table_name = 'catch_logs'
  ) THEN
    ALTER TABLE public.catch_logs DROP CONSTRAINT catch_logs_tackle_box_id_fkey;
  END IF;
END $$;

ALTER TABLE public.catch_logs 
  ADD CONSTRAINT catch_logs_tackle_box_id_fkey 
  FOREIGN KEY (tackle_box_id) 
  REFERENCES public.tackle_sets(id) 
  ON DELETE SET NULL;


-- 4. AV MERALARI (fishing_spots)
CREATE TABLE IF NOT EXISTS public.fishing_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fishing_spots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read fishing_spots" ON public.fishing_spots;
CREATE POLICY "Public read fishing_spots" ON public.fishing_spots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert fishing_spots" ON public.fishing_spots;
CREATE POLICY "Users insert fishing_spots" ON public.fishing_spots FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users delete fishing_spots" ON public.fishing_spots;
CREATE POLICY "Users delete fishing_spots" ON public.fishing_spots FOR DELETE USING (auth.uid() = user_id);

-- Örnek Meralar (Seed Data)
INSERT INTO public.fishing_spots (creator_name, title, description, lat, lng, image_url) VALUES
('Ahmet Yılmaz', 'Sarayburnu Akıntı Burnu', 'İstavrit ve lüfer için Boğazın en verimli meralarından biridir. Ağır kurşun arkası rapala tavsiye edilir.', 41.0175, 28.9833, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'),
('Caner Balıkçı', 'Galata Köprüsü Haliç Tarafı', 'Çinekop ve istavrit avı için klasiktir. Akşam saatlerinde çapari oldukça verimlidir.', 41.0200, 28.9731, 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80'),
('Kıyı Oltacısı', 'Şile Liman Arkası Kayalıklar', 'Levrek ve eşkina için harika bir gece merasıdır. Yemli karides ve boru kurdu çalışır.', 41.1764, 29.6105, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;


-- 5. SOSYAL BEĞENİ VE YORUMLAR (catch_likes & catch_comments)
CREATE TABLE IF NOT EXISTS public.catch_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catch_log_id UUID REFERENCES public.catch_logs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(catch_log_id, user_id)
);

ALTER TABLE public.catch_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select catch_likes" ON public.catch_likes;
CREATE POLICY "Public select catch_likes" ON public.catch_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert catch_likes" ON public.catch_likes;
CREATE POLICY "Users insert catch_likes" ON public.catch_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete catch_likes" ON public.catch_likes;
CREATE POLICY "Users delete catch_likes" ON public.catch_likes FOR DELETE USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.catch_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catch_log_id UUID REFERENCES public.catch_logs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.catch_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select catch_comments" ON public.catch_comments;
CREATE POLICY "Public select catch_comments" ON public.catch_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert catch_comments" ON public.catch_comments;
CREATE POLICY "Users insert catch_comments" ON public.catch_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete catch_comments" ON public.catch_comments;
CREATE POLICY "Users delete catch_comments" ON public.catch_comments FOR DELETE USING (auth.uid() = user_id);


-- 6. GÖRSEL DEPOLAMA (Storage Bucket user_uploads)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user_uploads', 'user_uploads', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id = 'user_uploads');

DROP POLICY IF EXISTS "Auth users upload storage" ON storage.objects;
CREATE POLICY "Auth users upload storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user_uploads');

DROP POLICY IF EXISTS "Users update own storage" ON storage.objects;
CREATE POLICY "Users update own storage" ON storage.objects FOR UPDATE USING (bucket_id = 'user_uploads');

DROP POLICY IF EXISTS "Users delete own storage" ON storage.objects;
CREATE POLICY "Users delete own storage" ON storage.objects FOR DELETE USING (bucket_id = 'user_uploads');


-- 7. BİLDİRİMLER VE FAVORİ MERALAR (notifications & favorite_spots)
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

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert notifications" ON public.notifications;
CREATE POLICY "Users insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = actor_id);
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.favorite_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spot_id UUID NOT NULL REFERENCES public.fishing_spots(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, spot_id)
);

ALTER TABLE public.favorite_spots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view favorite spots" ON public.favorite_spots;
CREATE POLICY "Users view favorite spots" ON public.favorite_spots FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert favorite spots" ON public.favorite_spots;
CREATE POLICY "Users insert favorite spots" ON public.favorite_spots FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete favorite spots" ON public.favorite_spots;
CREATE POLICY "Users delete favorite spots" ON public.favorite_spots FOR DELETE USING (auth.uid() = user_id);


-- 10. BALIKÇILIK WİKİ REHBERİ (wiki_articles)
CREATE TABLE IF NOT EXISTS public.wiki_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  short_desc_tr TEXT,
  short_desc_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  image_url TEXT,
  water_type TEXT DEFAULT 'Tüm Sular',
  difficulty_level TEXT DEFAULT 'Başlangıç',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.wiki_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select wiki_articles" ON public.wiki_articles;
CREATE POLICY "Public select wiki_articles" ON public.wiki_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin insert wiki_articles" ON public.wiki_articles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin update wiki_articles" ON public.wiki_articles FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Admin delete wiki_articles" ON public.wiki_articles;
CREATE POLICY "Admin delete wiki_articles" ON public.wiki_articles FOR DELETE USING (true);


