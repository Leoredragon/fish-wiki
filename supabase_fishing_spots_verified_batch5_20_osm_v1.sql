-- =========================================================
-- OLTAPP Verified Batch v5 (20 spots)
-- Coordinates source: OpenStreetMap Nominatim (map-based)
-- No images: image_url = NULL always
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values

      -- TRAKYA
      ('Oltapp Verified','Enez Kıyı Hattı (Edirne)',
        'Ege kıyısına çıkan Enez çevresinde akıntı ve geçiş hatlarında kıyı spin ve yemli dip denemeleri.',
        40.7250280,26.0845671,'Edirne','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Çupra'],
        'Gün doğumu, gün batımı','Akıntı yönü belirleyici',
        89,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Keşan Kıyı Hattı (Edirne)',
        'Keşan çevresinde Ege sahiline yakın noktalarda surf ve yemli dip çalışmaları.',
        40.8548793,26.6303057,'Edirne','Tuzlu Su','Sahil',
        array['Levrek','Mırmır','İstavrit'],
        '06:00-09:00, 19:00-23:00','Gece dip avı potansiyeli artar',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Malkara Ergene Geçişi (Tekirdağ)',
        'Ergene nehri kolu boyunca tatlı su kefali ve sazan için hafif takım çalışmaları.',
        40.8930819,26.9023798,'Tekirdağ','Tatlı Su','Nehir/Çay',
        array['Sazan','Tatlı Su Kefali'],
        '06:00-10:00, 17:00-20:00','Bulanık su dönemlerinde nokta değiştir',
        85,'OSM Nominatim verified batch5 v1'),

      -- EGE (İZMİR)
      ('Oltapp Verified','Seferihisar Kıyı Hattı',
        'Seferihisar çevresinde koy girişleri ve kıyı segmentlerinde hafif spin ve yemli dip denemeleri.',
        38.1950292,26.8342193,'İzmir','Tuzlu Su','Sahil',
        array['Levrek','Çupra','Kalamar'],
        'Gün batımı, gece','Gece kalamar potansiyeli yüksek',
        90,'OSM Nominatim verified batch5 v1'),

      -- MUĞLA
      ('Oltapp Verified','Güllük Kıyı Hattı (Milas)',
        'Güllük körfez girişinde akıntı hatlarına yakın kıyıdan LRF ve dip denemeleri.',
        37.2373105,27.5986210,'Muğla','Tuzlu Su','Koy/Kanal',
        array['Çupra','Levrek','Mezgit'],
        'Akşam, gece','Körfez akıntısı tür hareketini etkiler',
        90,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Akyaka Kıyı Hattı (Muğla)',
        'Akyaka sahilinde ve Azmak ağzı çevresinde levrek ve kefal hedefli geçiş av noktası.',
        37.0580313,28.3271055,'Muğla','Karma','Nehir Ağzı',
        array['Levrek','Kefal'],
        'Gün batımı, gece','Su berraklığı değişimine göre konum seç',
        90,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Marmaris Kıyı Hattı',
        'Marmaris körfez çevresinde liman ve kıyı segmentlerinde tür çeşitliliği için lokasyon.',
        36.8522547,28.2742661,'Muğla','Tuzlu Su','Koy/Kanal',
        array['Levrek','Çupra','Akya'],
        'Gün doğumu, akşam','Turistik yoğunluk dışında sakin saatler tercih et',
        90,'OSM Nominatim verified batch5 v1'),

      -- ANTALYA
      ('Oltapp Verified','Demre Kıyı Hattı (Antalya)',
        'Demre çevresinde kıyı ve nehir ağzı geçişlerinde dönemsel levrek ve kefal hareketi.',
        36.2445690,29.9876151,'Antalya','Karma','Nehir Ağzı',
        array['Levrek','Kefal','Çupra'],
        'Gün doğumu, akşam','Nehir akıntısı kıyı verimini değiştirir',
        88,'OSM Nominatim verified batch5 v1'),

      -- MERSİN
      ('Oltapp Verified','Anamur Kıyı Hattı (Mersin)',
        'Anamur çevresinde kayalık-kıyı geçişlerinde kısa spin ve yemli dip denemeleri.',
        36.0803230,32.8312106,'Mersin','Tuzlu Su','Kayalık',
        array['Levrek','Akya','Çupra'],
        'Gün doğumu, gün batımı','Dalga yönüne göre kayalık seç',
        89,'OSM Nominatim verified batch5 v1'),

      -- HATAY
      ('Oltapp Verified','Dörtyol Kıyı Hattı (Hatay)',
        'Dörtyol çevresinde körfez etkisinde kıyıdan LRF ve yemli dip çalışmaları.',
        36.8353120,36.2274080,'Hatay','Tuzlu Su','Sahil',
        array['Çupra','Levrek','İstavrit'],
        'Akşam, gece','Körfez akıntısı mevsimsel farklılık gösterir',
        88,'OSM Nominatim verified batch5 v1'),

      -- KARADENİZ (BATI)
      ('Oltapp Verified','Ereğli Kıyı Hattı (Zonguldak)',
        'Ereğli kıyı hattında sanayi limanına yakın segmentlerde kıyı spin ve dip denemeleri.',
        41.2795516,31.4229672,'Zonguldak','Tuzlu Su','Sahil',
        array['İstavrit','Levrek','Mezgit'],
        'Gün doğumu, gün batımı','Liman trafiği dışı saatler tercih et',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Akçakoca Kıyı Hattı (Düzce)',
        'Akçakoca sahil şeridi boyunca dalga kırığı ve kum-kaya geçişlerinde kıyı spin çalışmaları.',
        41.0882278,31.1239833,'Düzce','Tuzlu Su','Sahil',
        array['Levrek','İstavrit','Lüfer'],
        '06:00-09:00, 19:00-23:00','Sonbahar göç döneminde aktivite yükselir',
        90,'OSM Nominatim verified batch5 v1'),

      -- KARADENİZ (ORTA)
      ('Oltapp Verified','Terme Kıyı Hattı (Samsun)',
        'Terme sahilinde nehir ağzına yakın segmentlerde karma av denemeleri; levrek ve kefal hedefli.',
        41.2090393,36.9721685,'Samsun','Karma','Nehir Ağzı',
        array['Levrek','Kefal','İstavrit'],
        'Gün batımı, gece','Su rengi ve akıntı değişimini takip et',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Ordu Kıyı Hattı',
        'Ordu merkez kıyısında liman çevresi ve sahil segmentlerinde katman taraması.',
        40.8292569,37.4082764,'Ordu','Tuzlu Su','Sahil',
        array['İstavrit','Levrek','Mezgit'],
        'Akşam, gece','Kışın dip türleri öne çıkabilir',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Görele Kıyı Hattı (Giresun)',
        'Görele çevresinde kıyıdan yapı etkili segmentlerde LRF ve hafif dip denemeleri.',
        41.0335207,38.9986240,'Giresun','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit','Levrek'],
        'Akşam, gece','Serin dönemde dip verimi artabilir',
        88,'OSM Nominatim verified batch5 v1'),

      -- KARADENİZ (DOĞU)
      ('Oltapp Verified','Araklı Kıyı Hattı (Trabzon)',
        'Araklı çevresinde dere çıkışına yakın kıyı hattında dönemsel levrek ve kefal hareketi.',
        40.9358214,40.0580406,'Trabzon','Karma','Nehir Ağzı',
        array['Levrek','Kefal','İstavrit'],
        'Gün batımı, gece','Yağış sonrası su rengi takibi önemli',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Fındıklı Kıyı Hattı (Rize)',
        'Fındıklı sahilinde spin ve yemli dip kombinasyonuyla kıyıdan tür taraması.',
        41.2712350,41.1414159,'Rize','Tuzlu Su','Sahil',
        array['İstavrit','Levrek','Mezgit'],
        'Gün doğumu, akşam','Dere etkisi berraklığı değiştirebilir',
        88,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Kemalpaşa Kıyı Hattı (Artvin)',
        'Kemalpaşa çevresinde sınır hattına yakın kıyıdan kısa spin ve dip denemeleri.',
        41.4810826,41.5270530,'Artvin','Tuzlu Su','Sahil',
        array['İstavrit','Mezgit'],
        'Akşam, gece','Rüzgar korunaklı taraf seçilmeli',
        85,'OSM Nominatim verified batch5 v1'),

      -- İÇ ANADOLU — tatlı su tamamlayıcı
      ('Oltapp Verified','Alucra Çevresi (Giresun İç Hat)',
        'Alucra çevresinde akarsu ve kollarında tatlı su kefali ve alabalık için hafif takım çalışmaları.',
        40.3196660,38.7651849,'Giresun','Tatlı Su','Nehir/Çay',
        array['Tatlı Su Kefali','Alabalık'],
        '06:00-10:00, 17:00-20:00','Koruma dönemleri ve yasal sınırları kontrol et',
        82,'OSM Nominatim verified batch5 v1'),

      ('Oltapp Verified','Tonya Dere Hattı (Trabzon)',
        'Tonya dağ deresi hattında soğuk su türleri için yavaş retrieve ve hafif spin denemeleri.',
        40.8863478,39.2908085,'Trabzon','Tatlı Su','Nehir/Çay',
        array['Alabalık','Tatlı Su Kefali'],
        '06:00-10:00, 17:00-20:00','Su sıcaklığı ve akıntı hızı belirleyici',
        82,'OSM Nominatim verified batch5 v1')

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
-- select count(*) from public.fishing_spots;
-- select source_note, count(*) from public.fishing_spots group by source_note order by 2 desc;
