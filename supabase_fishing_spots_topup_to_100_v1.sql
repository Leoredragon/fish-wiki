-- =========================================================
-- OLTAPP Top-up Pack v1
-- Goal: bring total fishing_spots close to 100
-- Notes:
-- - Keeps existing spots
-- - Adds only missing titles/coordinates
-- - image_url always NULL
-- =========================================================

begin;

with candidates as (
  select *
  from (
    values
    ('Oltapp Verified','Rumeli Feneri Kayalık Hattı (İstanbul)','Boğaz kuzey çıkışında akıntı ve kayalık geçiş hattı.',41.2356,29.1130,'İstanbul','Tuzlu Su','Kayalık',array['Lüfer','Palamut','İstavrit'],'Gün doğumu, gün batımı','Sonbahar göç döneminde güçlü',90,'Topup 100 v1'),
    ('Oltapp Verified','Anadolu Feneri Kıyı Geçişi (İstanbul)','Boğaz çıkışında spin ve yemli denemeler için kullanılan hat.',41.2151,29.1255,'İstanbul','Tuzlu Su','Kayalık',array['Lüfer','Levrek','İstavrit'],'Gün doğumu, akşam','Dalga-akıntı takibi önemli',88,'Topup 100 v1'),
    ('Oltapp Verified','Büyükçekmece Mendirek Ucu (İstanbul)','Marmara kıyısında erişilebilir mendirek noktası.',41.0213,28.5858,'İstanbul','Tuzlu Su','Liman/Mendirek',array['İstavrit','Çinekop','Levrek'],'Akşam, gece','Geçiş dönemlerinde verim artar',82,'Topup 100 v1'),
    ('Oltapp Verified','Kilyos Sahil Kırılması (İstanbul)','Karadeniz kıyısında surfcasting için bilinen segment.',41.2555,29.0362,'İstanbul','Tuzlu Su','Sahil',array['Kalkan','Mezgit','Levrek'],'06:00-09:00, 19:00-23:00','Rüzgarlı havada ekipman ağırlaştırılmalı',82,'Topup 100 v1'),
    ('Oltapp Verified','Şile Ağva Sahil Geçişi (İstanbul)','Nehir ağzı etkisine yakın kıyı hattı.',41.1383,29.8560,'İstanbul','Karma','Sahil',array['Levrek','Kefal','İstavrit'],'Gün batımı, gece','Bulanık su geçişlerinde levrek şansı artar',84,'Topup 100 v1'),

    ('Oltapp Verified','Kefken Liman Mendireği (Kocaeli)','Karadeniz kıyısında göç dönemlerinde aktif nokta.',41.2047,30.2471,'Kocaeli','Tuzlu Su','Liman/Mendirek',array['Palamut','Lüfer','İstavrit'],'Gün doğumu, gün batımı','Eylül-Kasım öne çıkar',88,'Topup 100 v1'),
    ('Oltapp Verified','Kerpe Kayalıkları (Kocaeli)','Kayalık dip yapıda spin ve yemli dip avı.',41.1754,30.2155,'Kocaeli','Tuzlu Su','Kayalık',array['Levrek','Eşkina','Karagöz'],'Gün doğumu, akşam','Dalga güvenliği kritik',84,'Topup 100 v1'),
    ('Oltapp Verified','Kandıra Bağırganlı Kıyısı (Kocaeli)','Kıyıdan surfcasting denemeleri için kullanılan alan.',41.2087,30.1289,'Kocaeli','Tuzlu Su','Sahil',array['Mırmır','Levrek','İstavrit'],'06:00-09:00, 19:00-23:00','Gece dip avı daha verimli',80,'Topup 100 v1'),

    ('Oltapp Verified','Melen Çayı İç Hat (Düzce)','Akarsu hattında tatlı su hedefli hafif takım avı.',41.0200,31.0200,'Düzce','Tatlı Su','Nehir/Çay',array['Tatlı Su Kefali','Yayın'],'06:00-10:00, 17:00-20:00','Yağış sonrası su bulanıklığı artar',78,'Topup 100 v1'),
    ('Oltapp Verified','Efteni Gölü Kıyısı (Düzce)','Sazlık kenarlarıyla dönemsel tatlı su avı sunar.',40.8475,31.1218,'Düzce','Tatlı Su','Göl',array['Sazan','Turna'],'05:30-09:00, 18:00-21:00','Sessiz yaklaşım avantaj sağlar',76,'Topup 100 v1'),

    ('Oltapp Verified','Acarlar Longozu Drenaj Hattı (Sakarya)','Sazlık-geçişte kefal ve tatlı su türleri gözlenir.',41.1240,30.5630,'Sakarya','Karma','Nehir/Çay',array['Kefal','Tatlı Su Kefali'],'Sabah erken, akşam','Su seviyesi verimi etkiler',74,'Topup 100 v1'),
    ('Oltapp Verified','Poyrazlar Gölü Kıyısı (Sakarya)','Göl çevresinde hafif takım tatlı su avı yapılır.',40.7574,30.3633,'Sakarya','Tatlı Su','Göl',array['Sazan','Turna'],'05:30-09:00, 18:00-21:00','İlkbahar-sonbahar daha dengeli',78,'Topup 100 v1'),

    ('Oltapp Verified','Filyos Çayı Ağız Geçişi (Zonguldak)','Nehir-deniz birleşimi mevsimsel olarak hareketlidir.',41.5782,32.0263,'Zonguldak','Karma','Nehir Ağzı',array['Levrek','Kefal','İstavrit'],'Gün batımı, gece','Akıntı ve su rengi belirleyici',84,'Topup 100 v1'),
    ('Oltapp Verified','Kozlu Kıyı Hattı (Zonguldak)','Kıyı spin ve yemli dip denemeleri için bilinen nokta.',41.4367,31.7540,'Zonguldak','Tuzlu Su','Sahil',array['İstavrit','Mezgit','Levrek'],'Akşam, gece','Dalga boyuna göre kurşun artırılmalı',80,'Topup 100 v1'),
    ('Oltapp Verified','İnkumu Sahil Geçişi (Bartın)','Kumluk hat üzerinde surfcasting için uygun alan.',41.6705,32.3470,'Bartın','Tuzlu Su','Sahil',array['Mırmır','Kalkan','Mezgit'],'06:00-09:00, 19:00-23:00','Gece dip avı öne çıkar',80,'Topup 100 v1'),
    ('Oltapp Verified','Kurucaşile Liman İçi (Bartın)','Korunaklı liman içinde hafif takım avları yapılır.',41.8410,32.7177,'Bartın','Tuzlu Su','Liman/Mendirek',array['İstavrit','Karagöz'],'Akşam','Sakin havalarda daha verimli',77,'Topup 100 v1'),

    ('Oltapp Verified','Sinop Hamsilos Koyu Kıyısı (Sinop)','Koy yapısı ve derinleşen hat ile kıyı avına uygundur.',42.0400,35.0410,'Sinop','Tuzlu Su','Koy/Kanal',array['Levrek','İstavrit','Mezgit'],'Gün doğumu, akşam','Rüzgar yönü önemli',83,'Topup 100 v1'),
    ('Oltapp Verified','Sinop Akliman Mendireği (Sinop)','Liman ağzında mevsimsel göç balıkları yakalanır.',42.0318,35.0911,'Sinop','Tuzlu Su','Liman/Mendirek',array['Palamut','Lüfer','İstavrit'],'Gün doğumu, gün batımı','Göç döneminde yoğun',85,'Topup 100 v1'),
    ('Oltapp Verified','Gerze Liman Ucu (Sinop)','Kıyıdan çapari ve yemli dip avı yapılır.',41.8035,35.1984,'Sinop','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mezgit'],'Akşam, gece','Dip türleri kışta artar',78,'Topup 100 v1'),

    ('Oltapp Verified','Samsun Atakum Sahil Hattı (Samsun)','Uzun kıyı şeridi ile surfcasting için uygundur.',41.3098,36.3026,'Samsun','Tuzlu Su','Sahil',array['Mezgit','İstavrit','Levrek'],'06:00-09:00, 19:00-23:00','Geceleri dip avı verimli',80,'Topup 100 v1'),
    ('Oltapp Verified','Samsun Doğupark Mendirek (Samsun)','Şehir merkezi erişimli kıyı avı noktası.',41.2898,36.3527,'Samsun','Tuzlu Su','Liman/Mendirek',array['İstavrit','Çinekop'],'Akşam','Kalabalık saatlerde nokta seçimi önemli',77,'Topup 100 v1'),
    ('Oltapp Verified','Bafra Kızılırmak Deltası Geçişi (Samsun)','Acısu geçiş bölgesinde dönemsel av verimi oluşur.',41.6055,35.8900,'Samsun','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Su seviyesi ve renk önemli',82,'Topup 100 v1'),

    ('Oltapp Verified','Ünye Liman Mendireği (Ordu)','Doğu Karadeniz geçişinde kıyı avı noktası.',41.1284,37.2886,'Ordu','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mezgit'],'Akşam, gece','Sonbaharda hareket artar',79,'Topup 100 v1'),
    ('Oltapp Verified','Fatsa Kıyı Hattı (Ordu)','Kıyıdan spin ve yemli denemeleri için uygundur.',41.0302,37.5008,'Ordu','Tuzlu Su','Sahil',array['Levrek','İstavrit'],'Gün doğumu, akşam','Dalga kırıkları hedeflenmeli',79,'Topup 100 v1'),
    ('Oltapp Verified','Perşembe Yason Burnu (Ordu)','Kayalık burun hattı mevsimsel göçte aktifleşir.',41.0828,37.7542,'Ordu','Tuzlu Su','Kayalık',array['Palamut','Lüfer'],'Gün doğumu, gün batımı','Rüzgar kuvveti kritik',82,'Topup 100 v1'),

    ('Oltapp Verified','Giresun Liman Ağzı (Giresun)','Liman ağzında kıyıdan çok tür denemesi yapılır.',40.9156,38.3895,'Giresun','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mezgit','Levrek'],'Akşam, gece','Kışın dip verimi artar',79,'Topup 100 v1'),
    ('Oltapp Verified','Tirebolu Mendirek Ucu (Giresun)','Akıntı hattında çapari ve spin avı yapılır.',41.0070,38.8412,'Giresun','Tuzlu Su','Liman/Mendirek',array['İstavrit','Palamut'],'Gün doğumu, akşam','Göç döneminde daha güçlü',81,'Topup 100 v1'),

    ('Oltapp Verified','Akçaabat Söğütlü Kıyısı (Trabzon)','Şehir erişimli kıyı avında bilinen bir hat.',41.0229,39.5648,'Trabzon','Tuzlu Su','Sahil',array['İstavrit','Levrek'],'Akşam, gece','Gece avı daha stabil',78,'Topup 100 v1'),
    ('Oltapp Verified','Sürmene Balıkçı Barınağı (Trabzon)','Liman içi korunaklı av noktası.',40.9051,40.1208,'Trabzon','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mezgit'],'Akşam','Sakin havalarda verim artar',76,'Topup 100 v1'),
    ('Oltapp Verified','Of Solaklı Deresi Ağız Hattı (Trabzon)','Dere-deniz geçişi levrek için takip edilir.',40.9447,40.2670,'Trabzon','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Yağış sonrası su rengi etkili',80,'Topup 100 v1'),

    ('Oltapp Verified','Rize Pazar Sahil Geçişi (Rize)','Açık kıyıda spin denemeleri yapılan alan.',41.1793,40.8862,'Rize','Tuzlu Su','Sahil',array['Levrek','İstavrit'],'Gün doğumu, akşam','Dalga günlerinde dikkatli avlanma',77,'Topup 100 v1'),
    ('Oltapp Verified','Ardeşen Fırtına Deresi Ağız Hattı (Rize)','Dere ağzı geçişi mevsimsel olarak hareketlidir.',41.1894,40.9855,'Rize','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Bulanık su koşullarında levrek ihtimali artar',80,'Topup 100 v1'),

    ('Oltapp Verified','Hopa Liman Kıyısı (Artvin)','Doğu Karadeniz son hattında liman avcılığı noktası.',41.3881,41.4272,'Artvin','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mezgit'],'Akşam, gece','Rüzgar korunumu olan taraf seçilmeli',76,'Topup 100 v1'),

    ('Oltapp Verified','Çanakkale Eceabat Kıyı Hattı (Çanakkale)','Boğaz akıntı hattında pelajik geçiş görülür.',40.1847,26.3577,'Çanakkale','Tuzlu Su','Boğaz Kıyısı',array['Lüfer','Palamut','İstavrit'],'Gün doğumu, gün batımı','Göç dönemlerinde hareket çok yüksek',90,'Topup 100 v1'),
    ('Oltapp Verified','Gelibolu Hamzakoy Kıyısı (Çanakkale)','Kıyıdan spin ve yemli dip avı için uygundur.',40.4108,26.6809,'Çanakkale','Tuzlu Su','Sahil',array['Levrek','İstavrit'],'Akşam, gece','Gece dip avı öne çıkar',80,'Topup 100 v1'),
    ('Oltapp Verified','Bozcaada Feribot İskelesi Çevresi (Çanakkale)','Ada çevresinde kıyı avı için erişilebilir hat.',39.8353,26.0727,'Çanakkale','Tuzlu Su','Liman/Mendirek',array['Kalamar','Çupra','İstavrit'],'Gün batımı, gece','Yaz akşamlarında kalamar aktif olabilir',82,'Topup 100 v1'),

    ('Oltapp Verified','Erdek Liman Ucu (Balıkesir)','Marmara kıyısında şehir içi av noktası.',40.3995,27.7938,'Balıkesir','Tuzlu Su','Liman/Mendirek',array['İstavrit','Çupra'],'Akşam','Mevsim geçişlerinde verim artar',79,'Topup 100 v1'),
    ('Oltapp Verified','Ayvalık Cunda Kıyı Geçişi (Balıkesir)','Ada geçiş hattında kıyı spin ve yemli av yapılır.',39.3279,26.6517,'Balıkesir','Tuzlu Su','Kayalık',array['Levrek','Karagöz','Kalamar'],'Gün doğumu, gün batımı','Akıntı yönü çok belirleyici',84,'Topup 100 v1'),
    ('Oltapp Verified','Altınoluk Sahil Hattı (Balıkesir)','Kuzey Ege kıyısında surf ve spin denemeleri için uygun.',39.5796,26.7370,'Balıkesir','Tuzlu Su','Sahil',array['Levrek','Mırmır'],'06:00-09:00, 19:00-23:00','Gece dip avı daha başarılı olabilir',79,'Topup 100 v1'),

    ('Oltapp Verified','Mudanya BUDO İskele Çevresi (Bursa)','Marmara iç hat kıyı avı noktası.',40.3756,28.8828,'Bursa','Tuzlu Su','Liman/Mendirek',array['İstavrit','Mırmır'],'Akşam','Kalabalık saatlerde nokta seçimi önemli',77,'Topup 100 v1'),
    ('Oltapp Verified','Gemlik Kurşunlu Kıyısı (Bursa)','Koy içinde yemli dip avı için bilinen hat.',40.4472,29.2138,'Bursa','Tuzlu Su','Koy/Kanal',array['Çupra','Karagöz'],'Akşam, gece','Sakin koy günlerinde daha verimli',80,'Topup 100 v1'),

    ('Oltapp Verified','Çınarcık Esenköy Mendireği (Yalova)','Marmara güney hattında mendirek avı.',40.6155,29.2330,'Yalova','Tuzlu Su','Liman/Mendirek',array['İstavrit','Kalamar'],'Akşam, gece','Gece ışık hattı verim sağlayabilir',78,'Topup 100 v1'),
    ('Oltapp Verified','Armutlu Sahil Geçişi (Yalova)','Kıyıdan yemli ve spin denemeleri yapılır.',40.5317,28.8337,'Yalova','Tuzlu Su','Sahil',array['Levrek','Mırmır'],'Gün doğumu, akşam','Rüzgar yönü kıyı seçimini etkiler',78,'Topup 100 v1'),

    ('Oltapp Verified','Tekirdağ Süleymanpaşa Kıyısı (Tekirdağ)','Marmara batı kıyısında şehir erişimli av hattı.',40.9780,27.5144,'Tekirdağ','Tuzlu Su','Sahil',array['İstavrit','Çinekop'],'Akşam','Sonbaharda göç balıkları artar',79,'Topup 100 v1'),
    ('Oltapp Verified','Şarköy İğdebağları Sahil Geçişi (Tekirdağ)','Kıyıdan surfcasting için kullanılan segment.',40.6196,27.1112,'Tekirdağ','Tuzlu Su','Sahil',array['Mırmır','Levrek'],'06:00-09:00, 19:00-23:00','Gece dip avı güçlü olabilir',79,'Topup 100 v1'),

    ('Oltapp Verified','Marmara Ereğlisi Mendirek (Tekirdağ)','Kıyı hattında erişilebilir liman avı noktası.',40.9723,27.9560,'Tekirdağ','Tuzlu Su','Liman/Mendirek',array['İstavrit','Levrek'],'Akşam','Akıntı zayıf saatler tercih edilmeli',77,'Topup 100 v1'),

    ('Oltapp Verified','İzmir Karaburun İskele Kıyısı (İzmir)','Rüzgarlı yarımadada kayalık-kıyı geçişi avı.',38.6388,26.5112,'İzmir','Tuzlu Su','Kayalık',array['Karagöz','Sargoz','Levrek'],'Gün doğumu, akşam','Rüzgar korunaklı cephe seçilmeli',83,'Topup 100 v1'),
    ('Oltapp Verified','Seferihisar Sığacık Mendireği (İzmir)','Liman içinde gece kalamar ve yemli av denemeleri yapılır.',38.1949,26.7851,'İzmir','Tuzlu Su','Liman/Mendirek',array['Kalamar','Çupra','Karagöz'],'Gün batımı, gece','Yaz akşamları daha hareketli',84,'Topup 100 v1'),
    ('Oltapp Verified','Dikili Bademli Kıyı Hattı (İzmir)','Kuzey Ege kıyısında spin/surf geçiş noktası.',39.0733,26.8349,'İzmir','Tuzlu Su','Sahil',array['Levrek','Mırmır'],'Gün doğumu, gün batımı','Dalga kırığı hattı verim sağlar',81,'Topup 100 v1'),
    ('Oltapp Verified','Mordoğan Ardıç Koyu Geçişi (İzmir)','Koy kenarı kayalıkta spin denemeleri öne çıkar.',38.4979,26.5505,'İzmir','Tuzlu Su','Koy/Kanal',array['Levrek','Akya'],'Gün doğumu, akşam','Sakin hava avantaj sağlar',80,'Topup 100 v1'),

    ('Oltapp Verified','Kuşadası Kadınlar Denizi Kıyısı (Aydın)','Kıyıdan hafif spin ve yemli denemeler yapılan alan.',37.8462,27.2488,'Aydın','Tuzlu Su','Sahil',array['Levrek','Çupra'],'Gün doğumu, gün batımı','Kalabalık saatler dışında daha iyi',78,'Topup 100 v1'),
    ('Oltapp Verified','Söke Bafa Gölü Kıyısı (Aydın)','İç su hattında sazan-turna hedefli avlar yapılır.',37.5196,27.4309,'Aydın','Tatlı Su','Göl',array['Sazan','Turna'],'05:30-09:00, 18:00-21:00','Su seviyesi ve sazlık etkili',79,'Topup 100 v1'),
    ('Oltapp Verified','Didim Mavişehir Kıyı Hattı (Aydın)','Akşam kıyı avı için erişilebilir bir segment.',37.4008,27.2576,'Aydın','Tuzlu Su','Sahil',array['Mırmır','Çupra'],'Akşam, gece','Gece dip avı daha stabil',78,'Topup 100 v1'),

    ('Oltapp Verified','Datça Palamutbükü Kıyısı (Muğla)','Derinleşen kıyı hattında spin avı öne çıkar.',36.7067,27.6853,'Muğla','Tuzlu Su','Sahil',array['Levrek','Akya'],'Gün doğumu, gün batımı','Açık deniz rüzgarı etkili',82,'Topup 100 v1'),
    ('Oltapp Verified','Bodrum Gündoğan Koyu Kıyısı (Muğla)','Koy girişinde yemli ve spin denemeleri yapılır.',37.1674,27.3474,'Muğla','Tuzlu Su','Koy/Kanal',array['Çupra','Karagöz'],'Akşam, gece','Sakin koy saatleri verimli',80,'Topup 100 v1'),
    ('Oltapp Verified','Akyaka Azmak Ağız Geçişi (Muğla)','Acısu geçişinde levrek ve kefal takibi yapılır.',37.0511,28.3217,'Muğla','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Su berraklığı önemli',82,'Topup 100 v1'),
    ('Oltapp Verified','Göcek İnlice Kıyı Hattı (Muğla)','Sahil hattında sabah spin denemeleri için uygundur.',36.7148,28.9093,'Muğla','Tuzlu Su','Sahil',array['Levrek','Çupra'],'Gün doğumu, akşam','Yaz yoğunluğunda erken saatler iyi',79,'Topup 100 v1'),

    ('Oltapp Verified','Kaş Limanağzı Kıyısı (Antalya)','Derin suya yakın kıyıdan spin hedefli av alanı.',36.1891,29.6350,'Antalya','Tuzlu Su','Kayalık',array['Akya','Lagos'],'Gün doğumu, gün batımı','Açık deniz rüzgarı etkili',82,'Topup 100 v1'),
    ('Oltapp Verified','Side Titreyengöl Çayı Ağız Hattı (Antalya)','Acısu geçişinde levrek-kefal ihtimali oluşur.',36.7740,31.4306,'Antalya','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Su rengi ve akıntı belirleyici',80,'Topup 100 v1'),
    ('Oltapp Verified','Finike Liman Mendireği (Antalya)','Batı Antalya kıyısında erişilebilir liman noktası.',36.3041,30.1450,'Antalya','Tuzlu Su','Liman/Mendirek',array['Çupra','İstavrit'],'Akşam, gece','Yaz akşamları daha hareketli',79,'Topup 100 v1'),
    ('Oltapp Verified','Gazipaşa Selinus Kıyı Geçişi (Antalya)','Kayalık-kumluk geçişte kıyı avı yapılır.',36.2670,32.3178,'Antalya','Tuzlu Su','Sahil',array['Levrek','Barakuda'],'Gün doğumu, gün batımı','Rüzgar ve dalga önemli',80,'Topup 100 v1'),

    ('Oltapp Verified','Anamur İskele Kıyısı (Mersin)','Doğu Akdeniz hattında kıyı avı için kullanılır.',36.0785,32.8360,'Mersin','Tuzlu Su','Liman/Mendirek',array['Çupra','Akya'],'Gün doğumu, akşam','Sonbaharda hareket artar',80,'Topup 100 v1'),
    ('Oltapp Verified','Silifke Göksu Deltası Geçişi (Mersin)','Nehir-deniz geçişinde dönemsel levrek avı.',36.3384,33.9945,'Mersin','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Su seviyesi etkili',81,'Topup 100 v1'),
    ('Oltapp Verified','Erdemli Kızkalesi Kıyı Hattı (Mersin)','Kıyıdan spin ve yemli denemeleri için uygun alan.',36.4560,34.1449,'Mersin','Tuzlu Su','Sahil',array['Levrek','İstavrit'],'Gün doğumu, akşam','Turizm yoğunluğu dışında daha iyi',78,'Topup 100 v1'),

    ('Oltapp Verified','Yumurtalık Lagün Geçişi (Adana)','Lagün-deniz geçişinde karma av denemeleri yapılır.',36.7693,35.7912,'Adana','Karma','Nehir Ağzı',array['Levrek','Kefal','Çupra'],'Gün batımı, gece','Su rengi değişimleri kritik',81,'Topup 100 v1'),
    ('Oltapp Verified','Karataş Akyatan Kıyısı (Adana)','Geniş sahil hattında surfcasting için uygundur.',36.5552,35.4002,'Adana','Tuzlu Su','Sahil',array['Mırmır','Levrek'],'06:00-09:00, 19:00-23:00','Gece dip avı öne çıkar',79,'Topup 100 v1'),

    ('Oltapp Verified','Arsuz Sahil Geçişi (Hatay)','Doğu Akdeniz’de kıyı spin ve yemli av için bilinen hat.',36.4178,35.8883,'Hatay','Tuzlu Su','Sahil',array['Çupra','Levrek'],'Gün doğumu, akşam','Dalgaya göre kurşun seçimi önemli',79,'Topup 100 v1'),
    ('Oltapp Verified','Samandağ Asi Ağız Hattı (Hatay)','Nehir-deniz geçişinde dönemsel levrek hareketi olur.',36.0841,35.9778,'Hatay','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Yağış sonrası bulanıklık artabilir',80,'Topup 100 v1'),

    ('Oltapp Verified','Van Gölü Edremit Kıyısı (Van)','İçsu karakterli göl hattında inci kefali takibi yapılır.',38.4247,43.2470,'Van','Tatlı Su','Göl',array['İnci Kefali'],'Gün doğumu, akşam','Göç döneminde sirküler kontrolü şart',83,'Topup 100 v1'),
    ('Oltapp Verified','Van Gölü Erciş Kıyı Hattı (Van)','Gölün kuzey kesiminde kıyı avı noktası.',39.0271,43.3599,'Van','Tatlı Su','Göl',array['İnci Kefali'],'Sabah erken','Mevsimsel yasaklara dikkat',82,'Topup 100 v1'),

    ('Oltapp Verified','Nemrut Krater Gölü Kıyısı (Bitlis)','Yüksek rakımda soğuk su avı için hassas alan.',38.6502,42.2325,'Bitlis','Tatlı Su','Göl',array['Alabalık'],'06:00-10:00, 17:00-20:00','Koruma dönemlerine dikkat',76,'Topup 100 v1'),

    ('Oltapp Verified','Keban Barajı Pertek Kıyısı (Tunceli)','Derin rezervuarda sudak ve yayın hedefli av yapılır.',38.8794,38.8359,'Tunceli','Tatlı Su','Baraj',array['Sudak','Yayın'],'Gün doğumu, gün batımı','Rüzgar alan koylar takip edilmeli',82,'Topup 100 v1'),
    ('Oltapp Verified','Uzunçayır Barajı Kıyısı (Tunceli)','Tatlı su kıyı avında kullanılan baraj hattı.',39.1363,39.6128,'Tunceli','Tatlı Su','Baraj',array['Sazan','Yayın'],'05:30-09:00, 18:00-21:00','İlkbahar-sonbahar daha stabil',78,'Topup 100 v1'),

    ('Oltapp Verified','Hazar Gölü Sivrice Kıyısı (Elazığ)','Göl çevresinde kıyıdan tatlı su avı yapılır.',38.4447,39.3072,'Elazığ','Tatlı Su','Göl',array['Sazan','Tatlı Su Kefali'],'Gün doğumu, akşam','Sakin kıyı hatları tercih edilmeli',79,'Topup 100 v1'),
    ('Oltapp Verified','Cip Barajı Kıyı Hattı (Elazığ)','Yerel tatlı su avında kullanılan baraj noktası.',38.6859,39.2006,'Elazığ','Tatlı Su','Baraj',array['Sazan','Yayın'],'05:30-09:00, 18:00-21:00','Su seviyesi değişken olabilir',76,'Topup 100 v1'),

    ('Oltapp Verified','Sivas Tödürge Gölü Kıyısı (Sivas)','İç Anadolu’da tatlı su avı için bilinen göl hattı.',39.8886,37.7380,'Sivas','Tatlı Su','Göl',array['Sazan','Tatlı Su Kefali'],'Sabah erken, akşam','Yaz sıcağında erken saatler daha iyi',77,'Topup 100 v1'),
    ('Oltapp Verified','Kızılırmak Hafik Geçişi (Sivas)','Akarsu hattında hafif takım denemeleri yapılır.',39.8541,37.3849,'Sivas','Tatlı Su','Nehir/Çay',array['Tatlı Su Kefali'],'06:00-10:00, 17:00-20:00','Akıntı hattı iyi okunmalı',75,'Topup 100 v1'),

    ('Oltapp Verified','Eber Gölü Kıyısı (Afyonkarahisar)','Sazlık yapıda sazan-turna denemeleri yapılır.',38.6389,31.2581,'Afyonkarahisar','Tatlı Su','Göl',array['Sazan','Turna'],'05:30-09:00, 18:00-21:00','Su seviyesine göre yer değiştirilmeli',76,'Topup 100 v1'),
    ('Oltapp Verified','Akşehir Gölü Kıyı Hattı (Konya)','Mevsimsel su seviyesine bağlı tatlı su avı alanı.',38.3308,31.4351,'Konya','Tatlı Su','Göl',array['Sazan','Tatlı Su Kefali'],'Sabah erken','Kurak dönemde verim düşebilir',74,'Topup 100 v1'),

    ('Oltapp Verified','Seyhan Baraj Gölü Kıyısı (Adana)','Şehir yakınında tatlı su spin/dip avına uygun.',37.0674,35.3435,'Adana','Tatlı Su','Baraj',array['Sudak','Sazan'],'Gün doğumu, akşam','Akşam üstü verimi artabilir',80,'Topup 100 v1'),
    ('Oltapp Verified','Aslantaş Barajı Kıyısı (Osmaniye)','Baraj hattında sazan-yayın hedefli av yapılır.',37.3211,36.2745,'Osmaniye','Tatlı Su','Baraj',array['Sazan','Yayın'],'05:30-09:00, 18:00-21:00','Rüzgar yönü kıyı seçimini etkiler',78,'Topup 100 v1'),

    ('Oltapp Verified','Bafa Gölü Kapıkırı Kıyısı (Muğla)','Gölün güneydoğusunda tatlı su kıyı avı noktası.',37.4920,27.5284,'Muğla','Tatlı Su','Göl',array['Sazan','Tatlı Su Kefali'],'Sabah erken, akşam','Sazlık kenarı dikkatli kullanılmalı',77,'Topup 100 v1'),
    ('Oltapp Verified','Akgöl Dalyan Geçişi (Muğla)','Lagün geçişinde dönemsel karma av noktası.',36.8436,28.8027,'Muğla','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Geçiş suyu verimi dönemsel değişir',79,'Topup 100 v1'),

    ('Oltapp Verified','Uzungöl Dere Hattı (Trabzon)','Dağ deresi hattında soğuk su türleri takip edilir.',40.6176,40.2940,'Trabzon','Tatlı Su','Nehir/Çay',array['Alabalık'],'06:00-10:00, 17:00-20:00','Koruma dönemleri kontrol edilmeli',75,'Topup 100 v1'),
    ('Oltapp Verified','Çoruh Nehri Artvin Geçişi (Artvin)','Akıntılı hatta tatlı su avında hafif takım kullanılır.',41.1828,41.8203,'Artvin','Tatlı Su','Nehir/Çay',array['Tatlı Su Kefali','Alabalık'],'Sabah erken, akşam','Akıntı güçlü günlerde dikkat',77,'Topup 100 v1'),

    ('Oltapp Verified','Beyşehir Gölü Sadıkhacı Kıyısı (Konya)','Gölün farklı kıyı segmentinde sudak-sazan hedeflenir.',37.6992,31.7588,'Konya','Tatlı Su','Göl',array['Sudak','Sazan'],'Gün doğumu, gün batımı','Rüzgar yönüne göre kıyı değiştirilmeli',83,'Topup 100 v1'),
    ('Oltapp Verified','Eğirdir Gölü Gelendost Kıyısı (Isparta)','Kıyıdan sudak odaklı avlarda kullanılan segment.',38.1162,30.9946,'Isparta','Tatlı Su','Göl',array['Sudak','Sazan'],'05:30-09:00, 18:00-21:30','İlkbahar-sonbahar daha verimli',82,'Topup 100 v1'),

    ('Oltapp Verified','Atikhisar Barajı Kıyısı (Çanakkale)','Çanakkale iç su avı için bilinen baraj alanı.',40.1135,26.4695,'Çanakkale','Tatlı Su','Baraj',array['Sazan','Yayın'],'05:30-09:00, 18:00-21:00','Su seviyesi dönemsel değişir',77,'Topup 100 v1'),
    ('Oltapp Verified','Sarımsaklı Dere Ağzı (Balıkesir)','Kıyı geçişinde levrek ve kefal hareketi olabilir.',39.2488,26.6917,'Balıkesir','Karma','Nehir Ağzı',array['Levrek','Kefal'],'Gün batımı, gece','Bulanık su sonrası hareket artabilir',79,'Topup 100 v1')
  ) as v(
    creator_name, title, description, lat, lng, province, water_type, spot_type,
    target_species_tr, best_hours, season_note, confidence_score, source_note
  )
),
needed as (
  select greatest(0, 100 - count(*)) as n
  from public.fishing_spots
),
to_insert as (
  select c.*
  from candidates c
  where not exists (
    select 1
    from public.fishing_spots s
    where lower(trim(s.title)) = lower(trim(c.title))
      and round(s.lat::numeric, 3) = round(c.lat::numeric, 3)
      and round(s.lng::numeric, 3) = round(c.lng::numeric, 3)
  )
  order by c.confidence_score desc, c.title
  limit (select n from needed)
)
insert into public.fishing_spots (
  user_id, creator_name, title, description, lat, lng, image_url, created_at,
  province, water_type, spot_type, target_species_tr, best_hours, season_note,
  confidence_score, source_note, is_verified
)
select
  null::uuid,
  creator_name,
  title,
  description,
  lat,
  lng,
  null::text,
  now(),
  province,
  water_type,
  spot_type,
  target_species_tr,
  best_hours,
  season_note,
  confidence_score,
  source_note,
  true
from to_insert;

commit;

-- Quick checks:
-- select count(*) from public.fishing_spots;
-- select province, count(*) from public.fishing_spots group by province order by 2 desc, 1;
