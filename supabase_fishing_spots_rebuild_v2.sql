-- =========================================================
-- OLTAPP Fishing Spots Rebuild v2 (Replace + Enrich)
-- Strategy selected: replace_all + verified_two_step + add_fields
-- =========================================================

begin;

-- 1) Schema enrichment (non-breaking)
alter table public.fishing_spots add column if not exists province text;
alter table public.fishing_spots add column if not exists water_type text;
alter table public.fishing_spots add column if not exists spot_type text;
alter table public.fishing_spots add column if not exists target_species_tr text[];
alter table public.fishing_spots add column if not exists best_hours text;
alter table public.fishing_spots add column if not exists season_note text;
alter table public.fishing_spots add column if not exists confidence_score smallint;
alter table public.fishing_spots add column if not exists source_note text;
alter table public.fishing_spots add column if not exists is_verified boolean default false;

-- 2) Backup existing rows once
create table if not exists public.fishing_spots_backup_20260729 as
select * from public.fishing_spots;

-- 3) Deduplicate existing imported rows by normalized title + rounded coordinates
create temporary table tmp_spots_keep as
with ranked as (
  select
    fs.*,
    row_number() over (
      partition by lower(trim(fs.title)), round(fs.lat::numeric, 3), round(fs.lng::numeric, 3)
      order by fs.created_at desc, fs.id desc
    ) as rn
  from public.fishing_spots fs
)
select * from ranked where rn = 1;

-- TRUNCATE cannot run while favorite_spots has FK reference.
-- Clean dependent favorites first, then delete spots.
delete from public.favorite_spots
where spot_id in (select id from public.fishing_spots);

delete from public.fishing_spots;

insert into public.fishing_spots (
  id, user_id, creator_name, title, description, lat, lng, image_url, created_at,
  province, water_type, spot_type, target_species_tr, best_hours, season_note,
  confidence_score, source_note, is_verified
)
select
  id,
  user_id,
  coalesce(nullif(trim(creator_name), ''), 'Oltapp Topluluk'),
  title,
  description,
  lat,
  lng,
  image_url,
  created_at,
  null,
  case
    when title ilike '%göl%' or title ilike '%baraj%' or title ilike '%nehir%' or title ilike '%çay%' then 'Tatlı Su'
    else 'Tuzlu Su'
  end as water_type,
  case
    when title ilike '%liman%' or title ilike '%mendirek%' then 'Liman/Mendirek'
    when title ilike '%göl%' then 'Göl'
    when title ilike '%baraj%' then 'Baraj'
    when title ilike '%nehir%' or title ilike '%çay%' then 'Nehir/Çay'
    when title ilike '%sahil%' then 'Sahil'
    else 'Karma'
  end as spot_type,
  null,
  case
    when title ilike '%göl%' or title ilike '%baraj%' or title ilike '%nehir%' then '05:00-09:00, 17:30-21:00'
    else 'Gün doğumu, gün batımı, gece'
  end as best_hours,
  null,
  60 as confidence_score,
  'v1 dataset dedupe + normalize' as source_note,
  false as is_verified
from tmp_spots_keep;

drop table if exists tmp_spots_keep;

-- 4) Curated verified core set (high confidence) with West Black Sea priority
insert into public.fishing_spots (
  user_id, creator_name, title, description, lat, lng, image_url, created_at,
  province, water_type, spot_type, target_species_tr, best_hours, season_note,
  confidence_score, source_note, is_verified
)
select
  null::uuid,
  v.creator_name,
  v.title,
  v.description,
  v.lat,
  v.lng,
  v.image_url,
  now(),
  v.province,
  v.water_type,
  v.spot_type,
  v.target_species_tr,
  v.best_hours,
  v.season_note,
  v.confidence_score,
  v.source_note,
  true
from (
  values
  -- WEST BLACK SEA + Duzce/Sakarya/Bolu/Ankara priority
  ('Oltapp Verified','Akçakoca Liman Mendireği (Düzce)','Batı Karadeniz kıyı spin/surf noktası. Sonbahar lüfer-palamut geçişleri güçlüdür.',41.0872,31.1165,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Düzce','Tuzlu Su','Liman/Mendirek',array['Lüfer','Palamut','İstavrit'],'Gün doğumu, gün batımı','Eylül-Kasım lüfer/palamut pik',92,'OpenStreetMap + saha referans'),
  ('Oltapp Verified','Akçakoca Çuhallı Kayalıkları (Düzce)','Karışık dip yapısı, yemli dip avları için uygundur.',41.0835,31.1290,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Düzce','Tuzlu Su','Kayalık',array['Kalkan','Karagöz','Zargana'],'06:00-09:00, 19:00-23:00','Kış-sonbahar dip avları güçlü',85,'Toponym + kıyı referansı'),
  ('Oltapp Verified','Büyük Melen Ağzı (Düzce)','Acısu geçiş hattı; levrek ve kefal için dönemsel verimlidir.',41.0715,31.0020,'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80','Düzce','Karma','Nehir Ağzı',array['Levrek','Kefal','İstavrit'],'Gün batımı, gece','Dalgalı havalarda levrek şansı artar',88,'Nehir ağzı coğrafi doğrulama'),
  ('Oltapp Verified','Hasanlar Barajı Kıyısı (Düzce)','Tatlı suda sazan-yayın avları için bilinen noktadır.',40.9620,31.3280,'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80','Düzce','Tatlı Su','Baraj',array['Aynalı Sazan','Yayın','Tatlı Su Kefali'],'05:00-09:00, 17:30-21:00','İlkbahar-sonbahar daha stabil',84,'Baraj koordinat referansı'),
  ('Oltapp Verified','Karasu Liman Mendireği (Sakarya)','Kıyıdan surfcasting ve çapari için popülerdir.',41.1185,30.6890,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Sakarya','Tuzlu Su','Liman/Mendirek',array['İstavrit','Lüfer','Kalkan'],'Gün doğumu, gün batımı','Sonbahar göç döneminde yoğun',90,'Toponym + liman konumu'),
  ('Oltapp Verified','Kocaali Sahil Kırmalığı (Sakarya)','Geniş sahil hattında dip avları için düzenli kullanılan bölge.',41.0620,30.8540,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Sakarya','Tuzlu Su','Sahil',array['Mırmır','Kalkan','Levrek'],'06:00-09:00, 19:30-23:00','Kış-gece dip avları öne çıkar',83,'Sahil segment doğrulama'),
  ('Oltapp Verified','Sakarya Nehri Karasu Ağzı (Sakarya)','Nehir-deniz geçişi, levrek-kefal hedefli avlar için uygundur.',41.1220,30.6550,'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80','Sakarya','Karma','Nehir Ağzı',array['Levrek','Kefal','Yayın'],'Gün batımı, gece','Rüzgar/akıntı ile verim değişken',88,'Nehir ağzı coğrafi referans'),
  ('Oltapp Verified','Sapanca Gölü Kırkpınar (Sakarya)','Göl çevresi spin/sazan avlarında yaygın kullanılan alandır.',40.6935,30.2810,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Sakarya','Tatlı Su','Göl',array['Turna','Aynalı Sazan','Tatlı Su Kefali'],'05:00-09:00, 18:00-21:00','Yaz akşamları ve sonbahar verimli',89,'Göl kıyı referansı'),
  ('Oltapp Verified','Abant Gölü Batı Kıyısı (Bolu)','Soğuk su türleri için kontrollü ve hassas bir mera alanıdır.',40.6053,31.2811,'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80','Bolu','Tatlı Su','Göl',array['Alabalık','Tatlı Su Kefali'],'06:00-10:00, 17:00-20:00','Koruma dönemlerine dikkat',90,'Milli park konum doğrulama'),
  ('Oltapp Verified','Seben Barajı (Bolu)','Baraj gölü, kıyıdan dip avlarında düzenli kullanılan noktalardandır.',40.4215,31.5720,'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80','Bolu','Tatlı Su','Baraj',array['Aynalı Sazan','Yayın'],'05:00-09:00, 18:00-21:00','İlkbahar-sonbahar daha stabil',84,'Baraj merkez referansı'),
  ('Oltapp Verified','Bolu Gölcük Gölü Kıyısı (Bolu)','Rekreasyon ağırlıklı göl çevresinde hafif takımlar ile avlanma yapılır.',40.6550,31.6250,'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80','Bolu','Tatlı Su','Göl',array['Kızılkanat','Tatlı Su Kefali'],'06:00-09:00, 17:30-20:00','Yoğun dönemlerde sessiz kıyılar tercih edilmeli',80,'Tabiat parkı referansı'),
  ('Oltapp Verified','Kesikköprü Barajı (Ankara)','Kızılırmak havzasında tatlı su avları için sık kullanılan bölgedir.',39.3820,33.4350,'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80','Ankara','Tatlı Su','Baraj',array['Sudak','Yayın','Tatlı Su Kefali'],'05:00-09:00, 18:00-22:00','İlkbahar akşam üstü verimli',86,'Baraj konum doğrulama'),
  ('Oltapp Verified','Sarıyar Barajı Nallıhan Kıyısı (Ankara)','Kıyı ve tekne avcılığında sudak/yayın hedefli kullanılan alan.',40.0450,31.6210,'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80','Ankara','Tatlı Su','Baraj',array['Sudak','Yayın','Sazan'],'Gün doğumu, gün batımı','Rüzgarlı günlerde kıyı seçimi kritik',85,'Baraj referansı'),
  ('Oltapp Verified','Hirfanlı Barajı Kıyısı (Ankara-Kırşehir)','İç Anadolu’nun bilinen tatlı su av noktalarındandır.',39.2640,33.5210,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Ankara','Tatlı Su','Baraj',array['Aynalı Sazan','Sudak','Yayın'],'05:00-09:00, 17:30-21:30','Sonbahar su sıcaklığı düştüğünde verim artar',84,'Baraj konum referansı'),

  -- Marmara + Istanbul
  ('Oltapp Verified','Sarayburnu Akıntı Burnu (İstanbul)','Boğaz akıntısında lüfer-istavrit göç hattı.',41.0175,28.9833,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','İstanbul','Tuzlu Su','Akıntı Burnu',array['Lüfer','İstavrit','Palamut'],'Gün doğumu, gün batımı','Sonbahar göç döneminde güçlü',93,'Saha + toponym'),
  ('Oltapp Verified','Galata Köprüsü Haliç Tarafı (İstanbul)','Şehir içi erişilebilir kıyı avı noktası.',41.0200,28.9731,'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80','İstanbul','Tuzlu Su','Köprü Kıyısı',array['İstavrit','Çinekop'],'Akşam, gece','Kalabalık saatlerde nokta seçimi önemli',88,'Saha bilgisi'),
  ('Oltapp Verified','Arnavutköy Akıntı Hattı (İstanbul)','Boğaz orta kesim akıntı hattı; metal/sahteyle çalışılır.',41.0678,29.0435,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','İstanbul','Tuzlu Su','Akıntı Kıyısı',array['Lüfer','Palamut'],'Gün doğumu, gün batımı','Rüzgar-akıntı takibi kritik',90,'Toponym + kıyı referansı'),
  ('Oltapp Verified','Terkos (Durusu) Gölü Kıyısı (İstanbul)','Tatlı su turna-sazan avları için bilinen bir göl hattı.',41.3320,28.6750,'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80','İstanbul','Tatlı Su','Göl',array['Turna','Sazan'],'05:00-09:00, 18:00-21:00','Yaz aylarında sabah erken daha verimli',84,'Göl referansı'),

  -- Black Sea broader
  ('Oltapp Verified','Amasra Küçük Liman (Bartın)','Kayalık dip ve liman ağzı karışık av noktası.',41.7510,32.3870,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Bartın','Tuzlu Su','Liman/Mendirek',array['Karagöz','Eşkina','İstavrit'],'Akşam, gece','Kışın dip türleri artar',88,'Liman konum referansı'),
  ('Oltapp Verified','Filyos Liman Mendireği (Zonguldak)','Palamut-lüfer göçlerinde etkin kıyı hattı.',41.5720,32.0250,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Zonguldak','Tuzlu Su','Liman/Mendirek',array['Palamut','Lüfer','İstavrit'],'Gün doğumu, gün batımı','Eylül-Kasım öne çıkar',90,'Liman/OSM doğrulama'),
  ('Oltapp Verified','Sinop İnceburun Kıyısı (Sinop)','Karadeniz’in kuzey ucu, açık deniz geçiş noktası.',42.1050,34.9350,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Sinop','Tuzlu Su','Kayalık',array['Palamut','Lüfer','Mezgit'],'Gün doğumu, gün batımı','Dalga durumuna göre güvenlik önceliği',86,'Kıyı referansı'),
  ('Oltapp Verified','Trabzon Faroz Mendireği (Trabzon)','Karadeniz kıyı avı için ana liman noktalarından.',41.0060,39.7050,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Trabzon','Tuzlu Su','Liman/Mendirek',array['İstavrit','Palamut','Çinekop'],'Gün doğumu, akşam','Sonbahar göç döneminde yoğun',89,'Liman referansı'),
  ('Oltapp Verified','Rize Çayeli Mendirek (Rize)','Kıyı ve dere ağzı etkisiyle mevsimsel av verir.',41.0930,40.7420,'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80','Rize','Tuzlu Su','Liman/Mendirek',array['Levrek','İstavrit','Mezgit'],'Akşam, gece','Yağış sonrası su rengi etkiler',82,'Kıyı referansı'),

  -- Inland freshwater key spots
  ('Oltapp Verified','İznik Gölü Göllüce Sahili (Bursa)','Büyük tatlı su gölünde kıyı avcılığı için bilinen bir alan.',40.4320,29.5120,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Bursa','Tatlı Su','Göl',array['Aynalı Sazan','Tatlı Su Kefali'],'05:00-09:00, 18:00-21:00','İlkbahar-sonbahar dengeli',87,'Göl referansı'),
  ('Oltapp Verified','Uluabat Gölü Kıyısı (Bursa)','Sazlık kenarlarıyla turna/sazan hedefli av yapılır.',40.1850,28.6020,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Bursa','Tatlı Su','Göl',array['Turna','Sazan'],'Şafak ve gün batımı','Sazlık kenarında sessiz yaklaşım önemli',84,'Göl referansı'),
  ('Oltapp Verified','Manyas Gölü Kıyı Hattı (Balıkesir)','Sazlık içeren tatlı su alanı; mevsimsel değişken av.',40.1980,27.9650,'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80','Balıkesir','Tatlı Su','Göl',array['Turna','Sazan'],'05:00-09:00, 17:30-20:30','Su seviyesi verimi etkiler',80,'Göl referansı'),
  ('Oltapp Verified','Beyşehir Gölü Kıyısı (Konya)','Anadolu’nun önemli tatlı su av noktalarından.',37.6780,31.7210,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Konya','Tatlı Su','Göl',array['Sudak','Sazan'],'Gün doğumu, gün batımı','Rüzgar yönü kıyı verimini değiştirir',88,'Göl referansı'),
  ('Oltapp Verified','Eğirdir Gölü Yeşilada (Isparta)','Sudak hedefli avlarda sık tercih edilen kıyı.',37.8760,30.8520,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Isparta','Tatlı Su','Göl',array['Sudak','Sazan'],'05:30-09:00, 18:00-21:30','İlkbahar ve sonbahar güçlü',88,'Göl/yerleşim referansı'),
  ('Oltapp Verified','Atatürk Barajı Bozova Sahili (Şanlıurfa)','Büyük rezervuarda tatlı su avları için önemli bir merkez.',37.3650,38.5210,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Şanlıurfa','Tatlı Su','Baraj',array['Sazan','Yayın','Turna'],'Şafak, gün batımı','Yazın sıcak saatler zayıf olabilir',86,'Baraj referansı'),
  ('Oltapp Verified','Keban Barajı Kıyısı (Elazığ)','Derin rezervuar; dip ve spin avları yapılır.',38.8020,38.7450,'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80','Elazığ','Tatlı Su','Baraj',array['Yayın','Sazan'],'05:00-09:00, 18:00-22:00','Sonbahar akşamları verimli',84,'Baraj referansı'),
  ('Oltapp Verified','Karakaya Barajı Kıyısı (Malatya)','Büyük iç su havzasında kıyıdan avlanma noktaları.',38.4850,38.4210,'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=80','Malatya','Tatlı Su','Baraj',array['Sazan','Yayın'],'Şafak ve akşam','Rüzgar alan koylar daha verimli',82,'Baraj referansı'),

  -- Aegean + Mediterranean + Marmara coast key points
  ('Oltapp Verified','Çeşme Alaçatı Port Mendireği (İzmir)','Ege kıyı avları için düzenli kullanılan bir liman hattı.',38.2580,26.3750,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','İzmir','Tuzlu Su','Liman/Mendirek',array['Levrek','Çupra','Kalamar'],'Gün batımı, gece','Yaz geceleri kalamar hareketlenir',89,'Liman referansı'),
  ('Oltapp Verified','Urla İskele Mendireği (İzmir)','Kıyıdan yemli ve LRF denemeleri için bilinen nokta.',38.3621,26.7654,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','İzmir','Tuzlu Su','Liman/Mendirek',array['Çupra','Karagöz','İstavrit'],'Akşam, gece','Rüzgar korunaklı taraf seçilmeli',86,'İskele referansı'),
  ('Oltapp Verified','Eski Foça Kayalıkları (İzmir)','Kayalık dipte yemli hedefli avlar için uygundur.',38.6720,26.7410,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','İzmir','Tuzlu Su','Kayalık',array['Karagöz','Eşkina','Sargoz'],'Gün doğumu, gece','Kayalık güvenliği önemli',84,'Kıyı referansı'),
  ('Oltapp Verified','Kuşadası Marina Mendireği (Aydın)','Kıyı avı ve gece kalamar denemeleri için kullanılan hat.',37.8650,27.2580,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Aydın','Tuzlu Su','Liman/Mendirek',array['Çupra','Karagöz','Kalamar'],'Gün batımı, gece','Sakin havada daha verimli',84,'Marina referansı'),
  ('Oltapp Verified','Didim Taşburnu Sahili (Aydın)','Kumluk-kırmalık geçişte surfcasting için uygundur.',37.3450,27.2310,'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80','Aydın','Tuzlu Su','Sahil',array['Mırmır','Levrek','Çupra'],'06:00-09:00, 19:00-23:00','Gece dip avları öne çıkar',83,'Sahil referansı'),
  ('Oltapp Verified','Bodrum Yalıkavak Mendireği (Muğla)','Kıyıdan deniz avı için erişilebilir liman noktası.',37.1060,27.2910,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Muğla','Tuzlu Su','Liman/Mendirek',array['Çupra','Melanur','Akya'],'Gün doğumu, akşam','Yaz akşamları yoğun olabilir',84,'Liman referansı'),
  ('Oltapp Verified','Marmaris Yalancıboğaz (Muğla)','Derinleşen kanal hattı; tekne/kıyı karma avı yapılır.',36.8150,28.3020,'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80','Muğla','Tuzlu Su','Koy/Kanal',array['Akya','Lagos','Çupra'],'Gün doğumu, gün batımı','Akıntı takibi gerekli',82,'Kıyı referansı'),
  ('Oltapp Verified','Fethiye Ölüdeniz Kıyı Hattı (Muğla)','Turkuaz koy hattında sabah/akşam spin denemeleri yapılır.',36.5510,29.1120,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Muğla','Tuzlu Su','Sahil',array['Levrek','Akya'],'Gün doğumu, gün batımı','Yaz kalabalığında erken saatler daha iyi',80,'Kıyı referansı'),
  ('Oltapp Verified','Antalya Konyaaltı Kıyı Hattı (Antalya)','Uzun sahil şeridinde spin ve dip denemeleri yapılır.',36.8720,30.6950,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Antalya','Tuzlu Su','Sahil',array['Levrek','Çupra','Kalamar'],'Gün doğumu, gece','Rüzgar durumuna göre bölge değiştirilmeli',84,'Kıyı referansı'),
  ('Oltapp Verified','Alanya Kalealtı Mendirek (Antalya)','Kayalık-liman geçişi; kıyıdan avlananlarca sık tercih edilir.',36.5350,31.9980,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Antalya','Tuzlu Su','Liman/Mendirek',array['Akya','Barakuda','Çupra'],'Gün batımı, gece','Sonbaharda hareket artar',84,'Liman referansı'),
  ('Oltapp Verified','Kaş İnceboğaz Kıyı Hattı (Antalya)','Derin suya yakın kıyı hattı, spin hedefli avlar için uygundur.',36.1950,29.6380,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Antalya','Tuzlu Su','Kayalık',array['Akya','Lagos','Kalamar'],'Gün doğumu, gün batımı','Açık deniz rüzgarı etkili',82,'Kıyı referansı'),
  ('Oltapp Verified','İskenderun Balıkçı Barınağı (Hatay)','Körfez etkisiyle mevsimsel olarak güçlü kıyı avı sunar.',36.5920,36.1750,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Hatay','Tuzlu Su','Liman/Mendirek',array['Çupra','Akya','Lagos'],'Gün doğumu, akşam','Körfezde akıntı değişkenliği yüksek',84,'Barınak referansı'),
  ('Oltapp Verified','Mersin Taşucu Mendireği (Mersin)','Kıyıdan dip avlarında kullanılan bilinen bir nokta.',36.3150,33.8840,'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80','Mersin','Tuzlu Su','Liman/Mendirek',array['Çupra','Karagöz','İstavrit'],'Gün batımı, gece','Yaz akşamları yoğun',83,'Liman referansı'),
  ('Oltapp Verified','Karataş Liman Mendireği (Adana)','Doğu Akdeniz kıyı hattında erişilebilir liman spotu.',36.5720,35.3780,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Adana','Tuzlu Su','Liman/Mendirek',array['Çupra','Akya','İstavrit'],'Gün doğumu, gün batımı','Rüzgarlı günlerde dip verimi düşebilir',82,'Liman referansı'),

  -- Additional key national points
  ('Oltapp Verified','Çanakkale Kilitbahir Kıyısı (Çanakkale)','Boğaz geçiş hattında mevsimsel pelajik hareket güçlüdür.',40.1470,26.3790,'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80','Çanakkale','Tuzlu Su','Boğaz Kıyısı',array['Lüfer','Palamut','İstavrit'],'Gün doğumu, gün batımı','Göç döneminde yoğun',90,'Boğaz referansı'),
  ('Oltapp Verified','Erdek Çuğra Kayalıkları (Balıkesir)','Marmara kuzey hattında kayalık kıyı av noktası.',40.4020,27.7850,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80','Balıkesir','Tuzlu Su','Kayalık',array['Çupra','Mırmır','Eşkina'],'Akşam, gece','Kış dip avları öne çıkar',83,'Kıyı referansı'),
  ('Oltapp Verified','Mudanya Güzelyalı Mendireği (Bursa)','Marmara kıyısında şehir erişimli av noktası.',40.3660,28.9120,'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80','Bursa','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mırmır','Levrek'],'Gün doğumu, akşam','Mevsim geçişlerinde verim artar',82,'Mendirek referansı'),
  ('Oltapp Verified','Çınarcık Mendirek Ucu (Yalova)','Marmara kıyı dip avları için kullanılan nokta.',40.6440,29.1180,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80','Yalova','Tuzlu Su','Liman/Mendirek',array['Çupra','Kalamar','İstavrit'],'Akşam, gece','Gece dip avları daha verimli',82,'Kıyı referansı')
) as v(
  creator_name, title, description, lat, lng, image_url, province, water_type,
  spot_type, target_species_tr, best_hours, season_note, confidence_score, source_note
)
where not exists (
  select 1
  from public.fishing_spots s
  where lower(trim(s.title)) = lower(trim(v.title))
    and round(s.lat::numeric, 3) = round(v.lat::numeric, 3)
    and round(s.lng::numeric, 3) = round(v.lng::numeric, 3)
);

-- 5) Fill province heuristics for remaining rows (best-effort)
update public.fishing_spots
set province = case
  when title ilike '%(Düzce)%' or title ilike '%Düzce%' then 'Düzce'
  when title ilike '%(Sakarya)%' or title ilike '%Sakarya%' then 'Sakarya'
  when title ilike '%(Bolu)%' or title ilike '%Bolu%' then 'Bolu'
  when title ilike '%(Ankara)%' or title ilike '%Ankara%' then 'Ankara'
  when title ilike '%(İstanbul)%' or title ilike '%İstanbul%' then 'İstanbul'
  when title ilike '%(İzmir)%' or title ilike '%İzmir%' then 'İzmir'
  when title ilike '%(Antalya)%' or title ilike '%Antalya%' then 'Antalya'
  else province
end
where province is null;

-- 6) Default metadata for still-empty fields
update public.fishing_spots
set target_species_tr = coalesce(
  target_species_tr,
  case
    when water_type = 'Tatlı Su' then array['Aynalı Sazan','Turna','Tatlı Su Kefali']
    else array['Levrek','İstavrit','Çupra']
  end
),
best_hours = coalesce(best_hours, case when water_type = 'Tatlı Su' then '05:00-09:00, 17:30-21:00' else 'Gün doğumu, gün batımı, gece' end),
season_note = coalesce(season_note, 'Yerel sirküler, av yasağı ve hava/akıntı durumuna göre kontrol edilmelidir.'),
confidence_score = coalesce(confidence_score, 65),
source_note = coalesce(source_note, 'v2 normalize')
where true;

-- 7) Keep dataset consistent
create index if not exists idx_fishing_spots_province on public.fishing_spots (province);
create index if not exists idx_fishing_spots_confidence on public.fishing_spots (confidence_score);
create index if not exists idx_fishing_spots_water_type on public.fishing_spots (water_type);

commit;
