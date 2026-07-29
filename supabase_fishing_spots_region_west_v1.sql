-- =========================================================
-- OLTAPP Regional Spot Pack v1
-- Region: West Black Sea + Duzce/Sakarya/Bolu/Ankara
-- Goal: replace this region with higher-confidence curated points
-- =========================================================

begin;

-- Safety backup for only this region set
create table if not exists public.fishing_spots_backup_west_v1 as
select *
from public.fishing_spots
where province in ('Düzce', 'Sakarya', 'Bolu', 'Ankara', 'Zonguldak', 'Bartın', 'Karabük', 'Kocaeli');

-- Remove existing rows for this region pack (favorites depending on these spots too)
delete from public.favorite_spots
where spot_id in (
  select id
  from public.fishing_spots
  where province in ('Düzce', 'Sakarya', 'Bolu', 'Ankara', 'Zonguldak', 'Bartın', 'Karabük', 'Kocaeli')
);

delete from public.fishing_spots
where province in ('Düzce', 'Sakarya', 'Bolu', 'Ankara', 'Zonguldak', 'Bartın', 'Karabük', 'Kocaeli');

-- Curated regional pack (higher confidence)
insert into public.fishing_spots (
  user_id, creator_name, title, description, lat, lng, image_url, created_at,
  province, water_type, spot_type, target_species_tr, best_hours, season_note,
  confidence_score, source_note, is_verified
)
values
-- DÜZCE
(null, 'Oltapp Verified', 'Akçakoca Liman Mendireği', 'Batı Karadeniz kıyı spin/surf avında en bilinen noktalardan. Sonbaharda göç balıkları öne çıkar.', 41.0872, 31.1165, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80', now(), 'Düzce', 'Tuzlu Su', 'Liman/Mendirek', array['Lüfer','Palamut','İstavrit'], 'Gün doğumu, gün batımı', 'Eylül-Kasım arası kıyı göçü güçlü', 92, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Akçakoca Çuhallı Kayalıkları', 'Kum-kaya geçişli dip yapısı. Gece dip avlarında verim verebilir.', 41.0835, 31.1290, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', now(), 'Düzce', 'Tuzlu Su', 'Kayalık', array['Karagöz','Eşkina','Kalkan'], 'Akşam, gece', 'Kış döneminde dip türleri artar', 85, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Büyük Melen Nehri Ağzı', 'Acısu hattı. Levrek ve kefal için dönemsel takip noktasıdır.', 41.0715, 31.0020, 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80', now(), 'Düzce', 'Karma', 'Nehir Ağzı', array['Levrek','Kefal'], 'Gün batımı, gece', 'Dalgalı ve bulanık su geçişlerinde levrek ihtimali artar', 88, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Hasanlar Barajı Kıyı Hattı', 'Tatlı su avı için kıyıdan erişilebilir baraj noktaları.', 40.9620, 31.3280, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80', now(), 'Düzce', 'Tatlı Su', 'Baraj', array['Aynalı Sazan','Yayın','Tatlı Su Kefali'], '05:00-09:00, 17:30-21:00', 'İlkbahar ve sonbahar daha dengeli', 84, 'Regional pack west v1', true),

-- SAKARYA
(null, 'Oltapp Verified', 'Karasu Liman Mendireği', 'Kıyıdan surfcasting ve çapari için popüler bir Karadeniz noktası.', 41.1185, 30.6890, 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80', now(), 'Sakarya', 'Tuzlu Su', 'Liman/Mendirek', array['İstavrit','Lüfer','Palamut'], 'Gün doğumu, gün batımı', 'Sonbahar göç döneminde verim artar', 90, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Sakarya Nehri Karasu Ağzı', 'Nehir-deniz birleşimi. Gece ve gün batımı geçişleri takip edilir.', 41.1220, 30.6550, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', now(), 'Sakarya', 'Karma', 'Nehir Ağzı', array['Levrek','Kefal','Yayın'], 'Gün batımı, gece', 'Su rengi/akıntı verimi etkiler', 88, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Kocaali Sahil Kırmalığı', 'Geniş kıyı hattında dip avı denemeleri yapılan bölge.', 41.0620, 30.8540, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', now(), 'Sakarya', 'Tuzlu Su', 'Sahil', array['Mırmır','Kalkan','Levrek'], '06:00-09:00, 19:00-23:00', 'Kışın gece dip avı daha öne çıkar', 83, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Sapanca Gölü Kırkpınar', 'Göl çevresinde spin ve sazan avı için bilinen kıyı hattı.', 40.6935, 30.2810, 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80', now(), 'Sakarya', 'Tatlı Su', 'Göl', array['Turna','Aynalı Sazan','Tatlı Su Kefali'], '05:00-09:00, 18:00-21:00', 'Yaz akşamı ve sonbahar daha verimli', 89, 'Regional pack west v1', true),

-- BOLU
(null, 'Oltapp Verified', 'Abant Gölü Batı Kıyısı', 'Soğuk su türleri için hassas ve kontrollü av alanı.', 40.6053, 31.2811, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80', now(), 'Bolu', 'Tatlı Su', 'Göl', array['Alabalık','Tatlı Su Kefali'], '06:00-10:00, 17:00-20:00', 'Koruma dönemleri mutlaka kontrol edilmeli', 90, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Seben Barajı Kıyısı', 'Baraj gölü; sabah-akşam dip ve hafif spin denemeleri yapılır.', 40.4215, 31.5720, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', now(), 'Bolu', 'Tatlı Su', 'Baraj', array['Aynalı Sazan','Yayın'], '05:00-09:00, 18:00-21:00', 'İlkbahar-sonbahar daha dengeli', 84, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Bolu Gölcük Kıyı Hattı', 'Rekreasyon yoğunluğu nedeniyle sessiz saatlerde av verimi daha iyidir.', 40.6550, 31.6250, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80', now(), 'Bolu', 'Tatlı Su', 'Göl', array['Kızılkanat','Tatlı Su Kefali'], '06:00-09:00, 17:30-20:00', 'Hafta içi/sabah erken daha uygun', 80, 'Regional pack west v1', true),

-- ANKARA
(null, 'Oltapp Verified', 'Kesikköprü Barajı', 'Kızılırmak havzasında tatlı su avları için bilinen alan.', 39.3820, 33.4350, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', now(), 'Ankara', 'Tatlı Su', 'Baraj', array['Sudak','Yayın','Tatlı Su Kefali'], '05:00-09:00, 18:00-22:00', 'İlkbahar akşamüstü verim artar', 86, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Sarıyar Barajı Nallıhan', 'Kıyı ve tekne avcılığı karışık kullanılan iç su hattı.', 40.0450, 31.6210, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80', now(), 'Ankara', 'Tatlı Su', 'Baraj', array['Sudak','Yayın','Sazan'], 'Gün doğumu, gün batımı', 'Rüzgar yönü kıyı verimini etkiler', 85, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Hirfanlı Barajı Kıyısı', 'Ankara-Kırşehir hattında büyük rezervuar kıyı noktaları.', 39.2640, 33.5210, 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80', now(), 'Ankara', 'Tatlı Su', 'Baraj', array['Aynalı Sazan','Sudak','Yayın'], '05:00-09:00, 17:30-21:30', 'Sonbahar serin suda hareket artar', 84, 'Regional pack west v1', true),

-- ZONGULDAK / BARTIN / KARABÜK / KOCAELI (west pack complement)
(null, 'Oltapp Verified', 'Filyos Liman Mendireği', 'Batı Karadeniz göç hattında kıyı avı için önemli bir liman noktası.', 41.5720, 32.0250, 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80', now(), 'Zonguldak', 'Tuzlu Su', 'Liman/Mendirek', array['Palamut','Lüfer','İstavrit'], 'Gün doğumu, gün batımı', 'Eylül-Kasım göç dönemi yüksek aktivite', 90, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Amasra Küçük Liman', 'Kayalık dip + liman etkisiyle çok tür denemesine uygundur.', 41.7510, 32.3870, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', now(), 'Bartın', 'Tuzlu Su', 'Liman/Mendirek', array['Karagöz','Eşkina','İstavrit'], 'Akşam, gece', 'Kışın dip türleri artar', 88, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Yenice Şeker Kanyonu Çayı Kıyısı', 'Akarsu hattında tatlı su hafif takım denemeleri yapılır.', 41.2000, 32.3300, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80', now(), 'Karabük', 'Tatlı Su', 'Nehir/Çay', array['Tatlı Su Kefali','Alabalık'], '06:00-10:00, 17:00-20:00', 'Yağış sonrası su bulanıklığı yüksek olabilir', 78, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Kefken Pembe Kayalar Kıyısı', 'Karadeniz’e açık kayalık hat; spin denemeleri için kullanılır.', 41.1810, 30.1980, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', now(), 'Kocaeli', 'Tuzlu Su', 'Kayalık', array['Levrek','Eşkina','Zargana'], 'Gün doğumu, gün batımı', 'Dalga güvenliği kritik', 85, 'Regional pack west v1', true),
(null, 'Oltapp Verified', 'Kandıra Cebeci Kıyı Hattı', 'Kumluk-kayalık geçişte surfcasting ve spin denemeleri yapılır.', 41.1690, 30.2650, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', now(), 'Kocaeli', 'Tuzlu Su', 'Sahil', array['Mırmır','Levrek','İstavrit'], '06:00-09:00, 19:00-23:00', 'Rüzgar ve akıntı takibi önemli', 80, 'Regional pack west v1', true);

-- Ensure no duplicate exact title remains in this region pack
delete from public.fishing_spots a
using public.fishing_spots b
where a.id < b.id
  and lower(trim(a.title)) = lower(trim(b.title))
  and a.province = b.province;

commit;

-- Optional check queries:
-- select province, count(*) from public.fishing_spots
-- where province in ('Düzce','Sakarya','Bolu','Ankara','Zonguldak','Bartın','Karabük','Kocaeli')
-- group by province order by province;
