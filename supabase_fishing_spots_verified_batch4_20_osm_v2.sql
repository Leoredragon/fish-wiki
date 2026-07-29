-- =========================================================
-- OLTAPP Verified Batch v4 (20 spots — Tuzlu Su / Kıyı)
-- Coordinates source: OpenStreetMap Nominatim (map-based)
-- No images: image_url = NULL always
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values
      -- MARMARA / İSTANBUL
      ('Oltapp Verified','Şile Limanı',
        'Şile liman çevresinde korunaklı hatlardan LRF ve hafif spin ile sürü takibi.',
        41.1785623,29.6047114,'İstanbul','Tuzlu Su','Liman/Mendirek',
        array['Levrek','İstavrit','Palamut'],
        'Gün doğumu, gün batımı','Göç dönemlerinde aktivite artar',
        94,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Büyükçekmece Kıyı Hattı',
        'Büyükçekmece sahil hattında uzun hat taraması; geçiş bölgeleri ve dalga kırıkları hedeflenir.',
        41.0216540,28.5797570,'İstanbul','Tuzlu Su','Sahil',
        array['İstavrit','Mırmır','Levrek'],
        '06:00-09:00, 19:00-23:00','Akşamüstü hareketlenme sık görülür',
        90,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Tekirdağ Süleymanpaşa Kıyı Hattı',
        'Tekirdağ kıyı şeridinde kıyıdan dip ve hafif spin denemeleri.',
        40.9781214,27.5107799,'Tekirdağ','Tuzlu Su','Sahil',
        array['İstavrit','Çinekop','Levrek'],
        'Gün doğumu, akşam','Hava durumuna göre nokta seçimi önemli',
        89,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Bandırma Kıyı Hattı',
        'Bandırma çevresinde kıyıdan yemli dip ve LRF ile katman taraması.',
        40.3554705,27.9697603,'Balıkesir','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Mırmır','Levrek'],
        'Akşam, gece','Gece dip aktivitesi artabilir',
        90,'OSM Nominatim verified batch4 v2'),

      -- EGE (İZMİR)
      ('Oltapp Verified','Karaburun İzmir Kıyı Hattı',
        'Karaburun kıyısında kayalık ve geçiş bölgelerinde kısa at-çek setleri.',
        38.6354423,26.5098027,'İzmir','Tuzlu Su','Kayalık',
        array['Levrek','Karagöz','Sargoz'],
        'Gün doğumu, gün batımı','Dalga yönü ve rüzgar hattı belirler',
        92,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Foça Kıyı Hattı',
        'Foça çevresinde koy içi geçişleri boyunca hafif dip ve spin denemeleri.',
        38.6689160,26.7547749,'İzmir','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Kalamar'],
        'Akşam, gece','Kalamar potansiyeli yüksek periyotlar',
        91,'OSM Nominatim verified batch4 v2'),

      -- MUĞLA (BODRUM)
      ('Oltapp Verified','Yalıkavak Marina',
        'Yalıkavak marinada korunaklı yapı etkisi ile tür çeşitliliği için lokasyon.',
        37.1050869,27.2851871,'Muğla','Tuzlu Su','Liman/Mendirek',
        array['Çupra','Akya','Levrek'],
        'Akşam, gece','Gece ışık hattı avantaj sağlayabilir',
        93,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Gümüşlük Kıyı Hattı',
        'Gümüşlük çevresinde kıyıdan yemli dip veya hafif spin ile geçiş hattı taraması.',
        37.0535073,27.2366323,'Muğla','Tuzlu Su','Koy/Kanal',
        array['Levrek','Çupra','Kalamar'],
        '06:00-09:00, 19:00-23:00','Sakin havalarda verim artar',
        90,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Didim Marina Island (Didim)',
        'Didim marinaya yakın kıyı hattında hafif dip ve LRF ile uzun hat taraması.',
        37.3452212,27.2368250,'Aydın','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Levrek','Çupra'],
        'Gün doğumu, gün batımı','Mevsimsel sürü hareketleri takip edilir',
        90,'OSM Nominatim verified batch4 v2'),

      -- ANTALYA (AKDENİZ)
      ('Oltapp Verified','Kemer (Antalya) Kıyı Hattı',
        'Kemer sahilinde dalga kırığı ve geçiş hatları boyunca kıyı spin veya yemli dip.',
        36.6013823,30.5638561,'Antalya','Tuzlu Su','Sahil',
        array['Levrek','Çupra','İstavrit'],
        'Akşam, gece','Rüzgar yönüne göre nokta ayarı yapılmalı',
        91,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Lara Beach (Antalya)',
        'Lara sahil hattında gün içi açık su, akşam geçişleri hedeflenir.',
        36.8491054,30.8320760,'Antalya','Tuzlu Su','Sahil',
        array['Levrek','Çupra','Kalamar'],
        '06:00-09:00, 19:00-23:00','Gece dip ve kalamar denemeleri eklenebilir',
        92,'OSM Nominatim verified batch4 v2'),

      -- MERSİN / ADANA / HATAY
      ('Oltapp Verified','Silifke Kıyı Hattı',
        'Silifke çevresinde liman ve kıyı geçişlerinde dip + LRF kombinasyonu önerilir.',
        36.3778166,33.9260372,'Mersin','Tuzlu Su','Liman/Mendirek',
        array['Levrek','Mezgit','Çupra'],
        'Gün doğumu, gün batımı','Su rengi değişiminde takım güncelle',
        90,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Karataş (Adana) Kıyı Hattı',
        'Karataş kıyı hattında geçiş bölgeleri boyunca kısa at-çek ve hafif dip taraması.',
        36.5646007,35.3841416,'Adana','Tuzlu Su','Sahil',
        array['Levrek','Kefal','İstavrit'],
        'Akşam, gece','Rüzgar akıntı yönünü değiştirir',
        89,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Erdemli Kıyı Hattı',
        'Erdemli çevresinde kıyıdan yemli dip ve hafif spin ile tür çeşitliliği hedeflenir.',
        36.6057089,34.3102872,'Mersin','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Gün doğumu, akşam','Kıyı derinliği değişimlerine göre rota seç',
        88,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Samandağ Kıyı Hattı',
        'Samandağ sahilinde kıyı geçişleri boyunca LRF ve yemli dip denemeleri.',
        36.0851597,35.9799375,'Hatay','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Mezgit'],
        'Gün doğumu, gün batımı','Mevsimsel sürü hareketi etkili olur',
        90,'OSM Nominatim verified batch4 v2'),

      -- KARADENİZ (KUZEY/DOĞU)
      ('Oltapp Verified','Bafra Kıyı Hattı',
        'Bafra sahilinde su renk değişimine göre katman taraması ve hafif dip denemeleri.',
        41.5665954,35.9024777,'Samsun','Tuzlu Su','Sahil',
        array['Mezgit','İstavrit','Levrek'],
        '06:00-10:00, 17:00-20:00','Gece dip aktivitesi eklenebilir',
        88,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Gerze Kıyı Hattı',
        'Gerze çevresinde kıyıdan spin ve hafif dip ile geçiş hattı taraması.',
        41.8032697,35.1996164,'Sinop','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Mezgit'],
        'Akşam, gece','Dalga kırığı olan hatlar hedeflenmeli',
        89,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Beşikdüzü Kıyı Hattı',
        'Beşikdüzü kıyısında yapı etkisi olan segmentlerde dip ve LRF kombinasyonu.',
        41.0527305,39.2280377,'Trabzon','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Gün doğumu, akşam','Kışın dip verimi artabilir',
        90,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Ardeşen Kıyı Hattı',
        'Ardeşen sahilinde dere etkisinin olduğu dönemlerde su rengi takibi ve nokta seçimi.',
        41.1918750,40.9894178,'Rize','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Mezgit'],
        'Gün batımı, gece','Bulanıklık artışında rota değiştir',
        88,'OSM Nominatim verified batch4 v2'),

      ('Oltapp Verified','Arhavi Kıyı Hattı',
        'Arhavi çevresinde kıyı geçişleri ve akıntı hatları boyunca tür çeşitliliği için lokasyon.',
        41.3520702,41.3093534,'Artvin','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Rüzgar yönüne göre güvenli hat seç',
        89,'OSM Nominatim verified batch4 v2')

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
    where round(s.lat::numeric, 3) = round(c.lat::numeric, 3)
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

-- Optional check:
-- select count(*)
-- from public.fishing_spots
-- where source_note = 'OSM Nominatim verified batch4 v2';
