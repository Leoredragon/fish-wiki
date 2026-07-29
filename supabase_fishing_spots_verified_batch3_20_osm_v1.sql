-- =========================================================
-- OLTAPP Verified Batch v3 (20 spots — İç Su Odaklı)
-- Coordinates source: OpenStreetMap Nominatim (map-based)
-- Focus: göller, barajlar, nehirler
-- No images: image_url = NULL always
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values

      -- MARMARA / BATI
      ('Oltapp Verified','Sapanca Gölü (Kıyı Hattı)',
        'Sapanca gölü kıyısında sakin su ve sazlık geçişlerinde turna/sazan hedefli kısa at-çek ve yemli dip denemeleri.',
        40.7172304,30.2420272,'Sakarya','Tatlı Su','Göl',
        array['Turna','Aynalı Sazan','Tatlı Su Kefali'],
        '05:00-09:00, 18:00-21:00','Şafak ve akşamüstü en verimli periyotlar',
        94,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Terkos (Durusu) Gölü',
        'İstanbul yakınında tatlı su gölü; turna ve sazan için kıyı hattı boyunca yemli/dip ve hafif spin.',
        41.3441346,28.5755909,'İstanbul','Tatlı Su','Göl',
        array['Turna','Sazan'],
        '05:00-09:00, 18:00-21:00','Erken sabah düşük ışıkta turna aktif olabilir',
        93,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','İznik Gölü (Kıyı Hattı)',
        'Büyük tatlı su gölünde kıyı boyunca sazan ve tatlı su kefali hedefli dip/yemli dip denemeleri.',
        40.4429575,29.5270323,'Bursa','Tatlı Su','Göl',
        array['Aynalı Sazan','Tatlı Su Kefali'],
        '05:30-09:00, 18:00-21:00','İlkbahar-sonbahar geçişi en dengeli dönem',
        92,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Uluabat Gölü (Kıyı Hattı)',
        'Sazlık ve sığ kıyılarıyla turna/sazan avı için bölge. Sessiz yaklaşım ve sabah şafağı tercih edilmeli.',
        40.1694465,28.6250128,'Bursa','Tatlı Su','Göl',
        array['Turna','Sazan'],
        'Şafak, gün batımı','Sazlık kenarı sessiz yaklaşımla avantajlı',
        91,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Manyas (Kuş) Gölü Kıyısı',
        'Sazlık yapılı kıyı hattında sazan ve turna hedefli yemli dip; su seviyesi mevsimsel değişir.',
        40.1919968,27.9652536,'Balıkesir','Tatlı Su','Göl',
        array['Sazan','Turna'],
        '05:30-09:00, 17:30-20:30','Kurak dönemde su seviyesi düşer, yer değiştir',
        90,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Hasanlar Barajı (Düzce)',
        'Düzce yakınındaki barajda kıyıdan dip taraması; sazan, yayın ve tatlı su kefali hedeflenir.',
        40.9100639,31.2754336,'Düzce','Tatlı Su','Baraj',
        array['Aynalı Sazan','Yayın','Tatlı Su Kefali'],
        '05:00-09:00, 17:30-21:00','Baraj koyları ile akıntı girişleri verimli olabilir',
        94,'OSM Nominatim verified batch3 v1'),

      -- İÇ ANADOLU
      ('Oltapp Verified','Hirfanlı Barajı (Ankara-Kırşehir)',
        'Kızılırmak havzasında büyük rezervuar; kıyıdan dip ve spin ile sudak, yayın, sazan hedeflenir.',
        39.2737023,33.5184244,'Ankara','Tatlı Su','Baraj',
        array['Sudak','Yayın','Sazan'],
        '05:00-09:00, 18:00-22:00','Rüzgar alan koy girişleri takip edilmeli',
        95,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Seyhan Barajı (Adana)',
        'Şehir yakınında büyük rezervuar; kıyıdan sudak ve sazan hedefli yemli dip ve hafif spin denemeleri.',
        37.0392763,35.3319783,'Adana','Tatlı Su','Baraj',
        array['Sudak','Sazan'],
        'Gün doğumu, akşam','Akşamüstü aktivite artabilir',
        93,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Porsuk Çayı (Eskişehir)',
        'Eskişehir yakınında sakin akarsu; tatlı su kefali ve küçük sazan için hafif takım/float denemeleri.',
        39.7475834,30.6345274,'Eskişehir','Tatlı Su','Nehir/Çay',
        array['Tatlı Su Kefali','Sazan'],
        '06:00-10:00, 17:00-20:00','Akıntı hızına göre hafif gramer olta tercih edilmeli',
        88,'OSM Nominatim verified batch3 v1'),

      -- GÖLLER BÖLGESİ
      ('Oltapp Verified','Beyşehir Gölü (Kıyı Hattı)',
        'Anadolu''nun büyük tatlı su göllerinden birinde sudak ve sazan için kıyıdan yemli dip ve spin.',
        37.7783940,31.5163297,'Konya','Tatlı Su','Göl',
        array['Sudak','Sazan'],
        'Gün doğumu, gün batımı','Rüzgar yönüne göre kıyı değiştirilmeli',
        93,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Eğirdir Gölü (Kıyı Hattı)',
        'Isparta bölgesinde sudak avında sık tercih edilen göl; kıyıdan sabah-akşam kısa retrieve setleri.',
        38.0592020,30.8944037,'Isparta','Tatlı Su','Göl',
        array['Sudak','Sazan'],
        '05:30-09:00, 18:00-21:30','İlkbahar ve sonbahar en verimli dönem',
        92,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Aksu Çayı (Isparta-Burdur)',
        'Aksu çayı boyunca tatlı su kefali ve küçük türler için hafif spin; akarsu hattı dikkatlice okunmalı.',
        37.3499732,30.8316198,'Isparta','Tatlı Su','Nehir/Çay',
        array['Tatlı Su Kefali','Turna'],
        'Sabah erken, akşam','Yağış sonrası su rengi ve akıntı değişir',
        88,'OSM Nominatim verified batch3 v1'),

      -- GÜNEYDOĞU ANADOLU
      ('Oltapp Verified','Atatürk Barajı (Şanlıurfa/Bozova)',
        'Türkiye''nin en büyük baraj gölleri arasında; kıyıdan sazan, yayın ve turna hedefli dip/spin.',
        37.4805193,38.3198488,'Şanlıurfa','Tatlı Su','Baraj',
        array['Sazan','Yayın','Turna'],
        'Şafak, gün batımı','Yazın sıcak saatlerden kaçın; sabah/akşam tercih et',
        93,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Karakaya Barajı (Diyarbakır)',
        'Fırat havzasında derin rezervuar; kıyıdan sazan ve yayın hedefli yemli dip denemeleri.',
        38.2258096,39.1348903,'Diyarbakır','Tatlı Su','Baraj',
        array['Sazan','Yayın'],
        'Gün doğumu, gün batımı','Rüzgar alan koylar daha verimli olabilir',
        92,'OSM Nominatim verified batch3 v1'),

      -- DOĞU ANADOLU
      ('Oltapp Verified','Keban Barajı (Elazığ)',
        'Büyük rezervuar; kıyıdan ve tekne ile sazan/yayın hedefli dip taraması yapılır.',
        38.8080318,38.7566096,'Elazığ','Tatlı Su','Baraj',
        array['Yayın','Sazan'],
        '05:00-09:00, 18:00-22:00','Sonbahar akşamları ve ilkbahar sabahları verimli',
        93,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Lake Hazar (Elazığ)',
        'Hazar gölü kıyısında sakin su ortamında tatlı su kefali ve sazan için yemli dip/float.',
        38.4850868,39.4034884,'Elazığ','Tatlı Su','Göl',
        array['Sazan','Tatlı Su Kefali'],
        'Gün doğumu, akşam','Sakin kıyı hatları sessiz yaklaşımla tercih edilmeli',
        91,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Lake Van (Kuzey Kıyısı)',
        'Van gölünde inci kefali başta olmak üzere tatlı su türleri için kıyıdan float/yemli spin.',
        38.6562775,42.8073689,'Van','Tatlı Su','Göl',
        array['İnci Kefali'],
        'Gün doğumu, akşam','Göç ve üreme dönemlerinde sirküler kontrol zorunlu',
        90,'OSM Nominatim verified batch3 v1'),

      -- TRAKYA / KUZEYBATı
      ('Oltapp Verified','Meriç Nehri (Edirne)',
        'Sınır nehri Meriç boyunca sazan ve yayın hedefli yemli dip; güçlü akıntı bölgeleri dikkatle seçilmeli.',
        41.6834213,26.5584462,'Edirne','Tatlı Su','Nehir/Çay',
        array['Sazan','Yayın'],
        'Gün doğumu, gün batımı','Akıntı ve dip yapısı iyi okunmalı',
        90,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Ergene Nehri (Tekirdağ-Edirne)',
        'Ergene nehri boyunca sazan ve tatlı su kefali hedefli float ve yemli dip denemeleri.',
        41.4161064,27.0048237,'Tekirdağ','Tatlı Su','Nehir/Çay',
        array['Sazan','Tatlı Su Kefali'],
        '06:00-10:00, 17:00-20:00','Bulanık su dönemlerinde lokasyon değiştirilmeli',
        88,'OSM Nominatim verified batch3 v1'),

      ('Oltapp Verified','Büyük Çekmece Gölü (İstanbul)',
        'İstanbul batısında lagün karakterli göl; kefal ve küçük türler için kıyıdan hafif spin/float.',
        41.0215540,28.5866120,'İstanbul','Karma','Göl',
        array['Kefal','Tatlı Su Kefali'],
        'Gün doğumu, akşam','Su seviyesi ve tuzluluk değişimine göre nokta seçimi önemli',
        89,'OSM Nominatim verified batch3 v1')

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

-- Kontrol sorguları:
-- select count(*) from public.fishing_spots where source_note = 'OSM Nominatim verified batch3 v1';
-- select title, province, lat, lng, confidence_score
-- from public.fishing_spots
-- where source_note = 'OSM Nominatim verified batch3 v1'
-- order by confidence_score desc limit 20;
