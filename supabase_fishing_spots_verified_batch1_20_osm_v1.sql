-- =========================================================
-- OLTAPP Verified Batch v1 (20 spots)
-- Coordinates source: OpenStreetMap Nominatim (map-based)
-- No images: image_url = NULL always
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values
      -- DÜZCE
      ('Oltapp Verified','Akçakoca Limanı',
        'Akçakoca liman hattında akıntı kenarı boyunca dip ve hafif spin denemeleri için uygun bir segment.',
        41.0906610,31.1218845,'Düzce','Tuzlu Su','Liman/Mendirek',
        array['Lüfer','Palamut','İstavrit'],
        'Gün doğumu, gün batımı','Sonbahar göç döneminde yüksek aktivite',
        95,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Karasu Limanı',
        'Karasu liman bölgesinde kıyıdan/korunaklı alanda LRF ve hafif spin ile ara katman taraması yapılır.',
        41.1215213,30.6715030,'Sakarya','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Lüfer','Palamut'],
        'Gün doğumu, akşam','Göç dönemlerinde sürü hareketi belirgin',
        95,'OSM Nominatim verified batch1 v1'),

      -- SAKARYA
      ('Oltapp Verified','Kocaali (Sahil Hattı)',
        'Kocaali kıyı hattında geçiş bölgeleri ve dalga kırığı boyunca kıyı spin/surf çalışmaları için lokasyon.',
        41.0542812,30.8507446,'Sakarya','Tuzlu Su','Sahil',
        array['Levrek','Mırmır','Kalkan'],
        '06:00-09:00, 19:00-23:00','Gece/düşük ışıkta dip potansiyeli artar',
        93,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Kırkpınar (Sapanca)',
        'Sapanca gölü çevresinde sazlık kenarları ve sakin su hatları boyunca küçük takımla hedef av.',
        40.6931562,30.2231856,'Sakarya','Tatlı Su','Göl',
        array['Turna','Aynalı Sazan'],
        '05:00-09:00, 18:00-21:00','Şafak ve akşamüstü kısa retrieve setleri etkili',
        93,'OSM Nominatim verified batch1 v1'),

      -- BOLU (GÖL ve ÇEVRE)
      ('Oltapp Verified','Abant Gölü',
        'Abant çevresinde kontrollü su ve güvenli hatlar üzerinden sabah-akşam spin/kaşık denemeleri.',
        40.6052225,31.2799396,'Bolu','Tatlı Su','Göl',
        array['Alabalık','Aynalı Sazan'],
        '06:00-10:00, 17:00-20:00','Suyun durulduğu saatlerde verim artar',
        95,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Seben (Bolu) Av Noktası',
        'Seben çevresi tatlı su avına elverişli dere/kol hatlarının bulunduğu bir bölgede konum noktası.',
        40.4085088,31.5713451,'Bolu','Tatlı Su','Nehir/Çay',
        array['Yayın','Sazan'],
        'Gün doğumu, gün batımı','Mevsimsel su seviyesi hareketi etkiler',
        80,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Gölcük Tabiat Parkı',
        'Gölcük çevresinde göl hattı ve kıyı çukuru boyunca yemli/dip ve hafif spin denemeleri.',
        40.6562804,31.6297543,'Bolu','Tatlı Su','Göl',
        array['Kızılkanat','Sazan'],
        '06:00-09:00, 17:30-20:30','Sakin havalarda kıyı yaklaşımı avantajlı',
        90,'OSM Nominatim verified batch1 v1'),

      -- ANKARA (Barajlar)
      ('Oltapp Verified','Kesikköprü Barajı',
        'Kızılırmak havzasında baraj kıyısında dip ve orta derinlik taraması için lokasyon.',
        39.3959928,33.4209485,'Ankara','Tatlı Su','Baraj',
        array['Sudak','Yayın'],
        '05:00-09:00, 18:00-22:00','Rüzgar yönü ve dip oksijeni verimi etkiler',
        95,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Sarıyar Barajı (Nallıhan)',
        'Sarıyar barajında akıntı kenarı boyunca spin veya yemli dip ile kısa periyot av.',
        40.0399775,31.4146641,'Ankara','Tatlı Su','Baraj',
        array['Sudak','Yayın','Sazan'],
        'Gün doğumu, gün batımı','Akşamüstü geçişlerinde aktivite artabilir',
        93,'OSM Nominatim verified batch1 v1'),

      -- İSTANBUL (Boğaz)
      ('Oltapp Verified','Sarayburnu',
        'Boğazın sarayburnu hattında lüfer/istavrit göç koridorunu hedefleyen kıyı çalışması.',
        41.0156040,28.9864300,'İstanbul','Tuzlu Su','Akıntı Burnu',
        array['Lüfer','İstavrit','Palamut'],
        'Gün doğumu, gün batımı','Göç döneminde akıntı izleme kritik',
        95,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Galata Köprüsü',
        'Haliç/Boğaz içi geçişinde akıntı ve yapı etkisiyle kıyıdan tür çeşitliliği için lokasyon.',
        41.0200060,28.9731170,'İstanbul','Tuzlu Su','Köprü Kıyısı',
        array['İstavrit','Çinekop','Çupra'],
        'Akşam, gece','Gece ışık hattı aktif olabilir',
        90,'OSM Nominatim verified batch1 v1'),

      -- BARTIN / ZONGULDAK / SİNop (Karadeniz)
      ('Oltapp Verified','Amasra Tarlaağzı Limanı',
        'Amasra liman çevresinde dip ve yemli av için korunaklı hat ve geçiş noktası.',
        41.7232638,32.3363539,'Bartın','Tuzlu Su','Liman/Mendirek',
        array['Karagöz','Eşkina','İstavrit'],
        'Akşam, gece','Kışın dip türleri artar',
        95,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Filyos Limanı',
        'Filyos liman sanayi etkisiyle oluşan akıntı/derinlik farkı boyunca sürü takibi için lokasyon.',
        41.5875602,32.0858854,'Zonguldak','Tuzlu Su','Liman/Mendirek',
        array['Palamut','Lüfer','İstavrit'],
        'Gün doğumu, gün batımı','Göç dönemlerinde aktivite yüksek',
        93,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Akliman (Sinop)',
        'Sinop Akliman koyunda dalga kırığı ve derinleşen hat boyunca kıyı spin/kaşık çalışması.',
        42.0511326,35.0457821,'Sinop','Tuzlu Su','Koy/Kanal',
        array['Levrek','İstavrit','Mezgit'],
        'Gün doğumu, akşam','Rüzgar yönü kıyı verimini etkiler',
        92,'OSM Nominatim verified batch1 v1'),

      -- İZMİR (Ege)
      ('Oltapp Verified','Marin Alaçatı Yat Limanı',
        'Alaçatı liman hattında akşamüstü ve gece saatlerinde hareketli kıyı avı için lokasyon.',
        38.2532261,26.3846910,'İzmir','Tuzlu Su','Liman/Mendirek',
        array['Levrek','Çupra','Kalamar'],
        'Gün batımı, gece','Sakin havada kalamar potansiyeli artar',
        92,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Urla İskele',
        'Urla iskele çevresinde yemli/dip ve hafif spin ile ara katman taraması yapılabilir.',
        38.3639792,26.7720169,'İzmir','Tuzlu Su','Liman/Mendirek',
        array['Çupra','Karagöz','İstavrit'],
        'Akşam, gece','Kalabalık dışı saatlerde nokta avantajlı',
        90,'OSM Nominatim verified batch1 v1'),

      -- SAMSUN (Karadeniz)
      ('Oltapp Verified','Atakum (Sahil Hattı)',
        'Atakum sahil hattında surfcasting veya kıyı spin ile uzun hat taraması için lokasyon noktası.',
        41.3322588,36.2704652,'Samsun','Tuzlu Su','Sahil',
        array['Mezgit','İstavrit','Levrek'],
        '06:00-09:00, 19:00-23:00','Gece/düşük ışıkta dip verimi artabilir',
        88,'OSM Nominatim verified batch1 v1'),

      -- TRABZON / RİZE-AR TVİN (Karadeniz)
      ('Oltapp Verified','Faroz Limanı (Trabzon)',
        'Trabzon Faroz limanı çevresinde yapı etkisi ve akıntı kenarı boyunca dip/spin denemeleri.',
        41.0099705,39.7039901,'Trabzon','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Kışın dip türleri artar',
        90,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Çayeli (Rize) Av Noktası',
        'Çayeli çevresinde sahil-deniz geçişinde dönemsel olarak kıyıdan hedef av için lokasyon noktası.',
        41.0878328,40.7236973,'Rize','Tuzlu Su','Karma',
        array['Levrek','İstavrit','Mezgit'],
        'Gün batımı, gece','Dere etkisi su berraklığını değiştirir',
        80,'OSM Nominatim verified batch1 v1'),

      ('Oltapp Verified','Hopa (Artvin) Liman Bölgesi',
        'Hopa körfez/liman bölgesinde kıyıdan tür çeşitliliği ve akıntı takibi için konum noktası.',
        41.3853867,41.4631932,'Artvin','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Rüzgar ve akıntı yönü belirleyici',
        85,'OSM Nominatim verified batch1 v1')
  ) as v(
    creator_name, title, description, lat, lng,
    province, water_type, spot_type,
    target_species_tr, best_hours, season_note,
    confidence_score, source_note
  )
),
to_insert as (
  select *
  from candidates c
  where not exists (
    select 1
    from public.fishing_spots s
    where lower(trim(s.title)) = lower(trim(c.title))
      and round(s.lat::numeric, 3) = round(c.lat::numeric, 3)
      and round(s.lng::numeric, 3) = round(c.lng::numeric, 3)
  )
)
insert into public.fishing_spots (
  user_id, creator_name, title, description, lat, lng, image_url, created_at,
  province, water_type, spot_type, target_species_tr, best_hours, season_note,
  confidence_score, source_note, is_verified
)
select
  null::uuid,
  c.creator_name,
  c.title,
  c.description,
  c.lat,
  c.lng,
  null::text,
  now(),
  c.province,
  c.water_type,
  c.spot_type,
  c.target_species_tr,
  c.best_hours,
  c.season_note,
  c.confidence_score,
  c.source_note,
  true
from to_insert c;

commit;

-- Optional checks:
-- select count(*) from public.fishing_spots where source_note = 'OSM Nominatim verified batch1 v1';
