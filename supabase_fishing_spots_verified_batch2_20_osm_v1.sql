-- =========================================================
-- OLTAPP Verified Batch v2 (20 spots)
-- Coordinates source: OpenStreetMap Nominatim (map-based)
-- No images: image_url = NULL always
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values
      -- EGE / ÇEŞME-AIZMİR
      ('Oltapp Verified','Çeşme Balıkçı Limanı (Çiftlikköy)',
        'Çiftlikköy liman çevresinde kıyıdan tür çeşitliliği için lokasyon. Akıntı kenarlarında LRF ve hafif spin çalışması önerilir.',
        38.2938304,26.2770052,'İzmir','Tuzlu Su','Liman/Mendirek',
        array['Levrek','İstavrit','Çupra'],
        'Gün doğumu, gün batımı','Göç dönemlerinde sürü yoğunluğu artar',
        94,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Gündoğan (Bodrum) Kıyı Hattı',
        'Gündoğan sahilinde geçiş bölgeleri ve kıyı çukuru boyunca yemli/dip ile hafif spin denemeleri.',
        37.1294038,27.3467977,'Muğla','Tuzlu Su','Koy/Kanal',
        array['Çupra','Akya','Levrek'],
        'Akşam, gece','Durgun havada gece ışık hattı potansiyeli artar',
        93,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Palamutbükü (Datça) Kıyısı',
        'Palamutbükü çevresinde kıyı şeridi ve geçiş hattı boyunca surfcasting veya kısa at-çek serileri.',
        36.6744763,27.5035930,'Muğla','Tuzlu Su','Sahil',
        array['Akya','Levrek','Çupra'],
        '06:00-09:00, 19:00-23:00','Açık deniz rüzgarına göre takım ayarı yapılmalı',
        92,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Ölüdeniz (Fethiye) Kıyı Hattı',
        'Ölüdeniz koyunda dalga kırığı ve derinleşen hat boyunca kıyı spin/kaşık çalışması.',
        36.5708861,29.1402546,'Muğla','Tuzlu Su','Koy/Kanal',
        array['Levrek','İstavrit','Mezgit'],
        'Gün doğumu, akşam','Rüzgar yönü kıyı verimini etkiler',
        91,'OSM Nominatim verified batch2 v1'),

      -- AKDENİZ / ANTALYA
      ('Oltapp Verified','Konyaaltı Beach (Antalya)',
        'Konyaaltı sahil hattında uzun hat taraması; gündüz açık su + akşam geçişleri hedeflenebilir.',
        36.8818570,30.6735051,'Antalya','Tuzlu Su','Sahil',
        array['Levrek','Çupra','İstavrit'],
        '06:00-09:00, 19:00-23:00','Akşamüstü hareketlenme sık görülür',
        94,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Port of Alanya (Alanya Limanı)',
        'Liman çevresinde korunaklı hatlar; LRF/sabiki ile katman taraması ve hafif dip denemeleri.',
        36.5392159,32.0014919,'Antalya','Tuzlu Su','Liman/Mendirek',
        array['Çupra','Levrek','İstavrit'],
        'Akşam, gece','Gece dip ve kıyı ışık hattı verim artırabilir',
        93,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Kaş Limanı',
        'Kaş liman çevresinde yemli dip veya kısa spin serileri; yapı etkisiyle tür çeşitliliği.',
        36.1978482,29.6418123,'Antalya','Tuzlu Su','Liman/Mendirek',
        array['Levrek','Akya','Kalamar'],
        'Gün doğumu, gün batımı','Kalamar sıcak aylarda artar',
        92,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Titreyengöl (Lake & River Side)',
        'Titreyengöl çevresinde kıyıdan geçiş hattı boyunca hafif spin + yemli dip kombinasyonu.',
        36.7605712,31.4542605,'Antalya','Tuzlu Su','Koy/Kanal',
        array['Çupra','Levrek','Kalamar'],
        'Akşam, gece','Su sirkülasyonuna göre kısa periyot av önerilir',
        90,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Taşucu (Mersin)',
        'Taşucu çevresinde liman hattı boyunca akıntı/derinlik farkı hedeflenir; LRF ve dip seçenekleri.',
        36.3196455,33.8813034,'Mersin','Tuzlu Su','Liman/Mendirek',
        array['Levrek','Çupra','Mezgit'],
        'Gün doğumu, gün batımı','Göç dönemlerinde sürü takip avantajlı',
        93,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Yumurtalık (Lagün/Kıyı Geçişi)',
        'Yumurtalık çevresinde lagün-deniz geçiş hattında kıyıdan karma av denemeleri (katman taraması).',
        36.7675867,35.7915869,'Adana','Tuzlu Su','Nehir Ağzı',
        array['Levrek','Kefal','Çupra'],
        'Gün batımı, gece','Rüzgar ve su rengi değişimi verimi etkiler',
        92,'OSM Nominatim verified batch2 v1'),

      -- DOĞU AKDENİZ / HATAY
      ('Oltapp Verified','Limak Port İskenderun',
        'İskenderun liman çevresinde yapı etkisi ve akıntı kenarı boyunca tür çeşitliliği için lokasyon.',
        36.5911349,36.1837423,'Hatay','Tuzlu Su','Liman/Mendirek',
        array['Çupra','Levrek','İstavrit'],
        'Akşam, gece','Kış-sona doğru dip türleri artabilir',
        91,'OSM Nominatim verified batch2 v1'),

      -- MARMARA / EGE-KARMA
      ('Oltapp Verified','Mudanya Sahil Hattı',
        'Mudanya kıyı şeridinde geçiş bölgeleri boyunca uzun hat taraması ve hafif dip denemeleri.',
        40.3752582,28.8837929,'Bursa','Tuzlu Su','Sahil',
        array['İstavrit','Mırmır','Levrek'],
        '06:00-09:00, 19:00-23:00','Akşam üstü hareketlenme hedeflenir',
        90,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Cunda/Alibey Adası Çevresi',
        'Alibey Adası çevresinde kıyı üzerinden surf/spin denemeleri; dalga kırığı ve geçiş hatları.',
        39.3604106,26.6473415,'Balıkesir','Tuzlu Su','Sahil',
        array['Karagöz','Levrek','Çupra'],
        'Gün doğumu, gün batımı','Gel-git ve akıntı yönü dikkate alınmalı',
        90,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Kilitbahir Sahil Hattı',
        'Boğaz akıntısı etkisiyle kıyıdan pelajik hedef av için uygun lokasyon.',
        40.1467789,26.3779734,'Çanakkale','Tuzlu Su','Sahil',
        array['Lüfer','Palamut','İstavrit'],
        'Gün doğumu, gün batımı','Göç dönemlerinde hareket artar',
        94,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Hamzaköy Plajı (Gelibolu)',
        'Hamzaköy plajı çevresinde kıyıdan surfcasting veya kısa at-çek serileri.',
        40.4140017,26.6792489,'Çanakkale','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Mırmır'],
        '06:00-09:00, 19:00-23:00','Gece dip avı alternatif olabilir',
        90,'OSM Nominatim verified batch2 v1'),

      -- KARADENİZ
      ('Oltapp Verified','Kozlu (Zonguldak) Kıyı Hattı',
        'Kozlu çevresinde kıyıdan LRF ve hafif dip denemeleri; yapı etkisi olan segmentler hedeflenir.',
        41.4338739,31.7472847,'Zonguldak','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Kış döneminde dip verimi artabilir',
        91,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Perşembe (Ordu) Kıyı Hattı',
        'Perşembe çevresinde kıyıdan uzun hat taraması; akıntı kenarlarında kısa periyot av önerilir.',
        41.0669482,37.7736318,'Ordu','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Palamut'],
        'Gün batımı, gece','Sonbahar geçişlerinde aktivite artar',
        90,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Pazar (Rize) Kıyı Hattı',
        'Pazar Rize çevresinde sahil denemeleri; dere etkisi sonrası su rengi değişimine göre takımı ayarla.',
        41.1802584,40.8868482,'Rize','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Mezgit'],
        'Gün doğumu, akşam','Yağış sonrası su koşulları takip edilmeli',
        89,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Sürmene (Trabzon) Kıyı Hattı',
        'Sürmene çevresinde kıyıdan yapı etkisiyle tür çeşitliliği için lokasyon.',
        40.9127715,40.1134808,'Trabzon','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Gece dip türleri öne çıkabilir',
        90,'OSM Nominatim verified batch2 v1'),

      ('Oltapp Verified','Tirebolu Limanı (Giresun)',
        'Tirebolu limanı çevresinde liman/servis hattı etkisiyle katman taraması; hafif dip + LRF önerilir.',
        41.0098106,38.8161963,'Giresun','Tuzlu Su','Liman/Mendirek',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Kışın dip aktivitesi artabilir',
        91,'OSM Nominatim verified batch2 v1')
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

-- Optional checks:
-- select count(*)
-- from public.fishing_spots
-- where source_note = 'OSM Nominatim verified batch2 v1';
