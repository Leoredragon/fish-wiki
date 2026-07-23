-- =========================================================================
-- WIKI ARTICLES TABLOSU VE GÜVENLİK POLİTİKALARI
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.wiki_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'disciplines' | 'tackles' | 'lines' | 'lures' | 'rigs' | 'accessories'
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
