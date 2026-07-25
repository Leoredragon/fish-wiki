-- =============================================================
-- OLTAAPP – TÜM WIKI MAKALELERİ GÜNCELLEME VE AUDIT SCRIPT
-- Bu script, public.wiki_articles tablosundaki tüm 61 kaydı günceller.
-- ÖNEMLİ: Mevcut image_url sütunu SET kelimesine DAHİL EDİLMEMİŞTİR.
-- Böylece veritabanındaki hiçbir resim URL'si silinmez veya ezilmez!
-- =============================================================

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Light Trolling (Sırtı‑Hafif)',
  "title_en" = 'Light Trolling',
  "short_desc_tr" = 'Küçük tekne ya da kayakta hafif ekipmanla orta derinlikte balık avı.',
  "short_desc_en" = 'Small boat or kayak light‑trolling with mid‑weight gear for shallow offshore species.',
  "content_tr" = 'Light Trolling; 1.60‑2.00 m esnek kamış, 1500‑2500 kafa hafif makine, 100‑150 m 0.30‑0.45 mm misina, 30‑80 g hafif kurşun.

HEDEF: Alabalık, levrek, çinekop.',
  "content_en" = 'Light trolling employs a flexible rod (1.6‑2.0 m) with a 1500‑2500 size reel, a 100‑150 m 0.30‑0.45 mm line and 30‑80 g sinkers to target species such as perch, sea‑bass and herring.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '49f32469-0aa4-4ac8-bb67-d730b0b70dba';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Spinning (At-Çek) Balıkçılığı',
  "title_en" = 'Spin Fishing',
  "short_desc_tr" = 'Sahte maket balıklar, kaşıklar ve silikonlar ile dinamik, aktif kıyı avcılığı.',
  "short_desc_en" = 'Dynamic active shoreline angling using hard lures and spinners.',
  "content_tr" = 'Spinning balıkçılığı; sert plastik maket balıklar, su üstü popperlar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp kamış hareketleriyle ritmik şekilde geri sarılması esasına dayanır.

EKİPMAN SEÇİMİ:
• Kamış: 2.40m - 2.70m uzunluğunda, 10-40g veya 7-28g atarlı, orta-hızlı (Medium-Fast) aksiyonlu kamışlar.
• Makine: 3000 - 4000 kafa boyutunda, 5.2:1 veya 6.2:1 devirli spin makineleri.
• Misina: 8 kat örgü PE 0.8 - PE 1.2 ip misina + 0.30mm - 0.35mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.

AV TAKTİKLERİ:
Sabahın ilk ışıklarında ve gün batımında su üstü sahteleri (WTD aksiyonu) veya sığ dalar maketler maksimum verim sağlar. Bulanık ve dalgalı havalarda beyaz, limon veya pembe renkli sahteler tercih edilmelidir.',
  "content_en" = 'Spinning relies on casting hard lures or spinners and retrieving them with action.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000001';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Shore Jigging (Kıyı Ağır Metal Jig)',
  "title_en" = 'Shore Jigging',
  "short_desc_tr" = 'Kıyıdan ve mendirek kayalıklarından ağır metal jiglerle iri pelajik avcılığı.',
  "short_desc_en" = 'Heavy shore angling targeting large pelagics with metal jigs.',
  "content_tr" = 'Shore Jigging; sert akıntılı ve derin kayalık sahillere 30 ile 100 gram arasındaki ağır metal jiglerin atılıp dikine sert vuruşlarla (High Pitch Jerk) aksiyon verilerek çekilmesidir.

EKİPMAN SEÇİMİ:
• Kamış: 2.70m - 3.00m uzunluğunda, 30-80g veya 40-100g atarlı sert güçlü Jig kamışları.
• Makine: 4000 - 6000 kafa boyutunda, yüksek devirli (HG/XG) güçlü dişli yapısına sahip makineler.
• Misina: PE 1.5 - PE 3.0 örgü ip + 0.45mm - 0.65mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Akya, Torik, Palamut, Kuzu (Greater Amberjack), Baracuda, Lagos, Sinarit.',
  "content_en" = 'Shore jigging involves casting heavy metal lures from coastal rocks to target pelagic predators.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'İleri'
WHERE "id" = '87761873-e54b-45a0-ba48-547c4ca5ec71';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Sazan Balıkçılığı (Carp Angling)',
  "title_en" = 'Carp Angling',
  "short_desc_tr" = 'Rod podlar, ısırma alarmları, boilie yemler ve özel rig montajları ile trofe sazan avı.',
  "short_desc_en" = 'Specialized carp fishing using rod pods, bite alarms, boilies, and hair rigs.',
  "content_tr" = 'Sazan balıkçılığı; yüksek sabır, nokta yemlemesi ve özel takımlarla göllerde ve barajlarda yapılan dünyanın en popüler tatlı su trofe disiplinidir.

EKİPMAN SEÇİMİ:
• Kamış: 3.60m - 3.90m (12 - 13ft) uzunluğunda, 3.0 lb - 3.5 lb test eğrili (Test Curve) sazan kamışları.
• Makine: 8000 - 10000 kafa serbest makaralı (Baitrunner veya Quick Drag) sazan makineleri.
• Destek & Elektronik: Rod Pod sehpa, elektronik ısırma alarmı (Bite Alarm) ve ışıklı Swinger takımları.

YEM VE RİG SEÇİMİ:
Boilie (haşlanmış yem topu), Pop-up (yüzen boilie), Wafters, haşlanmış mısır ve kaplan fıstığı kullanılır. İğneye yem doğrudan takılmaz; Hair Rig (Kıl Rig), Ronnie Rig veya Chod Rig ile bağımsız dizilir.

AV TAKTİKLERİ:
Yemleme roketleri (Spomb) veya kumandalı yemleme botları ile mera önceden yemlenir. Sazan yemi vakumlayarak yuttuğunda iğne alt dudağa saplanır ve alarm çalar.',
  "content_en" = 'Carp angling requires specialized tackle like Hair Rigs, boilies, rod pods, and bite alarms to target massive mirror and common carp.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Orta'
WHERE "id" = 'e4fc350c-64a9-48e1-9ae3-50d0c9051985';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'LRF (Light Rock Fishing / Ultra Hafif At-Çek)',
  "title_en" = 'Light Rock Fishing (LRF)',
  "short_desc_tr" = 'Ultra hafif kamışlar ve mikro yemlerle kıyı kayalıklarında hassas av disiplini.',
  "short_desc_en" = 'Ultra-light tackle angling using micro lures around coastal rocks.',
  "content_tr" = 'LRF (Light Rock Fishing), Japonya kökenli ultra hafif takım balıkçılığıdır. 0.5 ile 10 gram arasındaki mikro yemlerle sığ kayalıklarda, liman içlerinde ve mendireklerde hassasiyeti en üst seviyeye çıkarır.

EKİPMAN SEÇİMİ:
• Kamış: 2.10m - 2.30m uzunluğunda, 0.5-7g veya 1-10g atarlı, hassas uçlu (Tubular veya Solid) LRF kamışları.
• Makine: 1000 - 2000 kafa sığ makaralı (Shallow Spool) LRF makineleri.
• Misina: PE 0.2 - PE 0.4 inceliğinde mikro ip misina + 0.16mm - 0.20mm Fluorocarbon lider.

HEDEF BALIKLAR:
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani, Kaya Balığı.

AV TAKTİKLERİ:
1g-3g jighead üzerine takılan kokulu silikonlar (Gulp, Isome vb.) dibe yakın mesafeden yavaşça zıplatılarak çekilir. Gece liman ışıkları etrafında batan mikro kaşıklar ve su üstü mikro sahteler istavrit avında mükemmel aksiyon sunar.',
  "content_en" = 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000002';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Kayak Fishing (Kayak Balıkçılığı)',
  "title_en" = 'Kayak Fishing',
  "short_desc_tr" = 'Nehrin veya gölün içinde kayak üzerinden yapılan hafif av.',
  "short_desc_en" = 'Fishing from a kayak with a short rod and compact reel, ideal for river and lake.',
  "content_tr" = 'Kayak Fishing; 1.80‑2.10 m hafif carbon kamış, 500‑800 kafa kompakt makine, 0.20‑0.30 mm fluorocarbon lider, hafif popper veya soft.

EKİPMAN:
 • Kamış: 1.8‑2.1 m, hafif, hızlı aksiyon.
 • Makine: 500‑800 kafa, düşük profil.
 • Lider: 0.20‑0.30 mm FC.
 • Çanta, su geçirmez çadır, balık tutma çubuğu.',
  "content_en" = 'Kayak fishing uses a lightweight carbon rod (1.8‑2.1 m) with a 500‑800 size compact reel and a 0.20‑0.30 mm fluorocarbon leader, casting light poppers or soft plastics while paddling on rivers or lakes.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '851181f3-83df-4da3-9add-0c3cfb1fc368';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Ice Fishing (Buz Balıkçılığı)',
  "title_en" = 'Ice Fishing',
  "short_desc_tr" = 'Donmuş su yüzeyinde delik açarak yapılan balıkçılık, genellikle ince iğne ve hafif ekipman.',
  "short_desc_en" = 'Fishing through a hole in ice using a short rod, ice jig and cold‑weather gear.',
  "content_tr" = 'Ice Fishing; 0.5‑1.5 m kısa cam kamış, 700‑1500 kafa hafif makine, 2‑4 mm çelik iğne, buzdağı ve sıcak tutma ekipmanları.

EKİPMAN:
 • Kamış: 0.5‑1.5 m hafif carbon.
 • Makine: 700‑1500 kafa, düşük sürtünme.
 • iğne: 2‑4 mm çelik.
 • Çeşitli ısıtıcı, eldiven, çadır.',
  "content_en" = 'Ice fishing uses a short rod (0.5‑1.5 m) with a light reel (700‑1500 size) and steel tip to fish through a drilled hole in frozen water.

GEAR:
 • Rod: 0.5‑1.5 m lightweight carbon.
 • Reel: 700‑1500 size, low drag.
 • Tip: 2‑4 mm steel.
 • Insulated clothing, portable heater, ice auger.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '232df961-db5f-495d-8a51-25fca3845083';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Sırtı / Trolling (Tekne Balıkçılığı)',
  "title_en" = 'Trolling',
  "short_desc_tr" = 'Hareket halindeki teknenin arkasından sahte veya canlı yem sürükleyerek yapılan pelajik avcılık.',
  "short_desc_en" = 'Trailing baited lines behind a moving boat to cover large areas of water.',
  "content_tr" = 'Sırtı (Trolling); hareket halindeki bir teknenin arkasından belirli bir hızda (genellikle 3 - 6 mil) maket balık, kaşık veya canlı yem sürüklenerek yapılan, geniş su alanlarını taramaya yönelik bir av disiplinidir.

EKİPMAN SEÇİMİ:
• Kamış: 1.60m - 2.10m uzunluğunda, esnek ama omurgası çok güçlü tek parça veya iki parça tekne kamışları. Ağır takımlar için yüzüklü değil, makaralı (Roller) kamışlar kullanılır.
• Makine: Yüksek misina kapasitesine sahip, levye kalamalı Çıkrık (Conventional/Multiplier) makineler.

HEDEF BALIKLAR:
Palamut, Torik, Akya, Sinarit, Orkinos ve Baraküda. Yem genellikle tekneden 30 ila 80 metre geriden gelir.',
  "content_en" = 'Trolling is a method of fishing where one or more fishing lines, baited with lures or bait fish, are drawn through the water behind a moving boat.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Orta'
WHERE "id" = '47b0bd62-543d-4fcf-8f73-b955e995d923';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Surfcasting (Kıyı İleri Atış & Ağır Dip)',
  "title_en" = 'Surfcasting',
  "short_desc_tr" = 'Dalgalı kumluk ve kırmalık sahillere 100-250 gramlık ağır kurşunlarla uzağa atış.',
  "short_desc_en" = 'Long-distance casting with heavy sinkers (100-250g) on sandy beaches.',
  "content_tr" = 'Surfcasting; dalgalı deniz kıyılarında 100 metre üzerindeki mesafelere ağır kurşunlu takımları fırlatarak dipteki iri balıkları avlama tekniğidir.

EKİPMAN SEÇİMİ:
• Kamış: 4.20m - 4.50m uzunluğunda, 100-200g veya 150-250g atarlı 3 parçalı veya sert teleskopik surf kamışları.
• Makine: 7000 - 10000 kafa geniş konik (Big Pit) sığ makaralı makineler.
• Misina: 0.16mm - 0.20mm Örgü İp + Konik Şok Lider (Shockleader) veya 0.30mm - 0.35mm Monofilament.

HEDEF BALIKLAR:
Çupra, Kalkan, Mırmır, Levrek, Eşkina ve Kurşun Arkası tekniği ile Çinekop / Lüfer / Palamut.',
  "content_en" = 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters into the surf zone.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Orta'
WHERE "id" = '30b0e2d2-184d-486c-ac7b-533bdd71597d';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Deep Sea Trolling (Derin Deniz Trolling)',
  "title_en" = 'Deep Sea Trolling',
  "short_desc_tr" = 'Yüksek kapasiteli makine ve uzun misina ile büyük deniz balıkları hedeflenir.',
  "short_desc_en" = 'High‑capacity reel and long line to target large offshore species.',
  "content_tr" = 'Deep Sea Trolling; 1.80‑2.20 m güçlü tek çubuk kamış, 6000‑10000 kafa çok katlı makine, 200‑300 m 1.5‑2.0 mm polyester lider, ağır (80‑150 kg) kurşun.

HEDEF BALIKLAR: Orkinos, Tünnek, Akya, Swordfish.

EKİPMAN:
 • Kamış: 1.8‑2.2 m, yüksek bükülme dayanımı.
 • Makine: 6000‑10000 kafa, çok katlı, yüksek tork.
 • Lider: 1.5‑2.0 mm polyester.
 • Kurşun: 80‑150 kg, alüminyum/taş.',
  "content_en" = 'Deep sea trolling uses a heavy rod (1.8‑2.2 m) with a high‑capacity reel (6000‑10000 size) and a 200‑300 m line with 1.5‑2.0 mm leader, casting heavy (80‑150 kg) sinkers to target offshore species such as tuna, swordfish, and wahoo.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'İleri'
WHERE "id" = 'ffac4e5c-6fe6-4e17-afc7-7fa21f8e64c5';

UPDATE "public"."wiki_articles" SET
  "category" = 'disciplines',
  "title_tr" = 'Fly Fishing (Sinek / Kamçı Balıkçılığı)',
  "title_en" = 'Fly Fishing',
  "short_desc_tr" = 'Hafif kamış, fly makine ve yapay ya da canlı yemle akıntıyı takip eden av.',
  "short_desc_en" = 'Light rod, fly reel and artificial or live bait for casting with the current.',
  "content_tr" = 'Fly Fishing; hafif 2‑parça kamış (1.50‑2.20 m), 2‑3 kafa fly reel, kurşunsuz yapay yem ve/veya canlı (örnek: trout, minnow). Tekniğin temel adımları: cast, drift, lift, mendirek.

EKİPMAN SEÇİMİ:
 • Kamış: 1.50‑2.20 m, 2‑5 lb (0.9‑2.3 kg) hafif test.
 • Makine: 2000‑3000 kafa, düşük drag, yüksek hassasiyet.
 • Lider: 0.15‑0.20 mm fluorocarbon.
 • Yem: kurşunsuz yapay ve canlı (trout, minnow).',
  "content_en" = 'Fly fishing uses a lightweight rod, a fly reel, and artificial or live bait to cast with the current.

EQUIPMENT:
 • Rod: 1.5‑2.2 m, 2‑5 lb test, fast action.
 • Reel: 2000‑3000 size, low drag, high sensitivity.
 • Leader: 0.15‑0.20 mm fluorocarbon.
 • Bait: dry flies, wet flies, nymphs, or live minnows.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'b2a40a72-24f9-41b4-bd63-3a1dcc584c4c';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Kan Düğümü (Blood Knot)',
  "title_en" = 'Blood Knot',
  "short_desc_tr" = 'İki aynı kalınlıktaki misinayı birleştirirken ideal.',
  "short_desc_en" = 'Ideal for joining two lines of equal diameter.',
  "content_tr" = 'Blood Knot; iki ip uçları birbirine geçirilir, 5‑6 tur aldırılır, iki ucu içine çekilir ve sıkılır.

ÇEKER GÜCÜ: %94‑%96.',
  "content_en" = 'The blood knot is tied by overlapping two line ends, making 5‑6 twists, then pulling both ends through the tight coil, yielding 94‑96 % strength.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '4ca0e64d-008d-4e1e-b3a7-bb05051e1531';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Gelişmiş Clinch Düğümü',
  "title_en" = 'Improved Clinch Knot',
  "short_desc_tr" = 'İğne ve lideri bağlamak için en yaygın ve güvenilir düğüm.',
  "short_desc_en" = 'Most common and reliable knot for tying a hook to a leader.',
  "content_tr" = 'Improved Clinch Knot; 5‑6 tur ip üzerinde iğne etrafında, son turu sıkıp kesilir.

ÇEKER GÜCÜ: %95‑%97.',
  "content_en" = 'The improved clinch knot is tied with 5‑6 wraps around the hook, finished with a snug pull, providing 95‑97 % tensile strength.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '559b9be9-6a64-4bfb-98f5-0388856ed6f5';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Albright Düğümü',
  "title_en" = 'Albright Knot',
  "short_desc_tr" = 'Daha kalın liderleri ince misinaya birleştirirken tercih edilir.',
  "short_desc_en" = 'Used for joining thick leaders to thin line.',
  "content_tr" = 'Albright Knot; lider iki kez katlanır, iğne etrafında 5‑6 tur yapılır, sıkılır, sonra son tur iki kez geçilir.

ÇEKER GÜCÜ: %95.',
  "content_en" = 'The albright knot involves doubling the leader, wrapping 5‑6 turns around the hook, tightening and securing with two final half‑hitches, achieving ~95 % strength.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '1b570c5b-d134-46ff-9008-6f1800599514';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Snell Düğümü (İğne Bağlama)',
  "title_en" = 'Snell Knot',
  "short_desc_tr" = 'İğneye yan taraflı sıkı bağlantı, güçlü ve sabit.',
  "short_desc_en" = 'Side‑tight knot that gives a strong, fixed hook connection.',
  "content_tr" = 'Snell Knot; ip iğneye paralel yerleştirilir, bir tur dolanır, ucu iğne deliğine geçirilir ve çekilir.

ÇEKER GÜCÜ: %95‑%97.',
  "content_en" = 'The snell knot is tied by laying the line parallel to the hook eye, looping around once, threading the tag end through the eye and pulling tight, offering 95‑97 % strength.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'b59298c2-e85c-41b0-a9eb-4e8f7b234d2c';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Uni Düğümü (Tekli ve Çiftli Uni)',
  "title_en" = 'Uni Knot',
  "short_desc_tr" = 'Hem lider hem iğne bağlamak için çok yönlü düğüm.',
  "short_desc_en" = 'Versatile knot for tying both leader and hook.',
  "content_tr" = 'Uni Knot; ip bir kez döndürülür, iğne etrafında 4‑5 tur yapılır, sıkılır ve ip ucuna bağlanır.

ÇEKER GÜCÜ: %96‑%98.',
  "content_en" = 'The uni knot consists of a single wrap followed by 4‑5 coils around the hook, tightened and capped, delivering 96‑98 % strength.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'b87911ba-6b6e-40d9-b7c2-26f4030dd4b2';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Konik Şok Lider (Tapered Surf Leader)',
  "title_en" = 'Tapered Surf Leader',
  "short_desc_tr" = 'Surfcasting atışlarında 150-220g ağır kurşun atarken kopmayı önleyen konik lider.',
  "short_desc_en" = 'Tapered leader designed for heavy surfcasting distance throws.',
  "content_tr" = 'Konik şok lider; surfcasting disiplininde 0.18mm gibi ince ana beden misinasının ucuna eklenen, 15 metrelik boyunda 0.20mm''den başlayıp 0.57mm kalınlığa doğru kademeli genişleyen özel surf lideridir.

TÜRKİYE''DE POPÜLER MARKLAR:
Trabucco T-Force XPS Tapered Leader, Daiwa Tournament Tapered Leader, Yuki Tapered Leader.',
  "content_en" = 'Tapered leaders feature a smooth gradient diameter to withstand heavy casting forces.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000023';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = '8 Kat Örgü PE İp Misina (8x Braided Line)',
  "title_en" = '8x Braided PE Line',
  "short_desc_tr" = 'Sıfır esneme, yüksek çeker gücü ve pürüzsüz yapısıyla maksimum atış erimi.',
  "short_desc_en" = 'Zero stretch, high tensile strength 8-strand braided line.',
  "content_tr" = '8 kat örgü ip misinalar; 8 adet mikro PE fiber ipliğin yuvarlak ve pürüzsüz şekilde örülmesiyle üretilir.

AVANTAJLARI:
• Esneme yapmaz (%0 esneme): En hafif tıkırtıyı kamışa iletir.
• İnce Çap / Yüksek Çeker: Rüzgar ve su direncini düşürür, sahtenin çok daha uzak mesafeye fırlatılmasını sağlar.

TÜRKİYE''DE POPÜLER MARKLAR:
Daiwa J-Braid 8x, Shimano Kairiki 8, Major Craft Dangan Braid 8x, Kendo Dynasty 8x, Sufix 832.',
  "content_en" = '8-strand braided line delivers ultra-smooth casting performance and extreme sensitivity.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000020';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Fluorocarbon (FC) Lider Misina',
  "title_en" = 'Fluorocarbon Leader',
  "short_desc_tr" = 'Su altında %99 görünmezlik, yüksek düğüm tutuşu ve kayalara karşı sürtünme direnci.',
  "short_desc_en" = 'Near 100% invisible underwater with high abrasion resistance.',
  "content_tr" = 'Fluorocarbon misinalar; kırılma indisi suyunkine çok yakın olduğu için su altında balıklar tarafından fark edilemez.

AVANTAJLARI:
• İp misinanın ucuna 50 cm - 1.5 metre lider olarak bağlanır.
• Keskin kayalara, midyelere ve balık dişlerine karşı ip misinaya göre çok daha dayanıklıdır.

TÜRKİYE''DE POPÜLER MARKLAR:
Seaguar Neox / FXR, Savage Gear Regenerator FC, Kendo FC Leader, Daiwa J-Thread FC.',
  "content_en" = 'Fluorocarbon line provides invisible presentation and abrasion resistance.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000021';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Monofilament (Naylon) Misina',
  "title_en" = 'Monofilament Line',
  "short_desc_tr" = 'Şok emici esnek yapı, yüksek düğüm mukavemeti ve ekonomik klasik misina.',
  "short_desc_en" = 'Shock absorbing flexible monofilament fishing line.',
  "content_tr" = 'Monofilament misinalar; tek parça naylon hammaddeden üretilen esnek ve ekonomik klasik misinalardır.

AVANTAJLARI:
• %15-%25 oranında esneme yapar. Balığın ani kafa darbelerinde şok emici görevi görerek takımın kopmasını engeller.
• Şamandıralı avlarda ve yemli dip takımlarında en güvenilir seçenektir.

TÜRKİYE''DE POPÜLER MARKLAR:
Trabucco T-Force, Daiwa Hyper Sensor, Caperlan 4x4, Sufix XL Strong.',
  "content_en" = 'Monofilament line stretches under load to absorb sudden shocks.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000022';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Paslanmaz Çelik Tel Lider',
  "title_en" = 'Stainless Steel Leader',
  "short_desc_tr" = 'Paslanmaz çelik, keskin dişli balık ve koral ortamları için dayanıklı.',
  "short_desc_en" = 'Corrosion‑resistant steel leader for toothy fish and reef areas.',
  "content_tr" = 'Stainless Steel Leader; 0.5‑1.0 mm çelik tel, 5‑10 m uzunluk, paslanmaz kaplama.

Avantaj: Keskin dişli balıklara karşı aşınma dayanıklı.',
  "content_en" = 'Stainless steel leader made of 0.5‑1.0 mm wire, 5‑10 m length, coated for corrosion resistance; ideal against toothy species.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '2b3b31b6-4900-49b2-abbf-bc05f6e48896';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Kevlar Lider Misina',
  "title_en" = 'Kevlar Leader',
  "short_desc_tr" = 'Yüksek çekme gücü ve aşınma direnci; büyük balık avı.',
  "short_desc_en" = 'High‑strength, abrasion‑resistant leader for big game.',
  "content_tr" = 'Kevlar Leader; 0.6‑0.8 mm kevlar ip, 3‑6 m uzunluk, kaplamalı.

Avantaj: Hafif, %90‑%95 çekme gücü.',
  "content_en" = 'Kevlar leader of 0.6‑0.8 mm, 3‑6 m length, optionally coated; offers lightweight strength of 90‑95 % of breaking load.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = 'be3ebdb4-6000-4301-bf14-0bd515b35db3';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Özel Tungsten Ağırlıklar & Kurşunlar',
  "title_en" = 'Specialty Tungsten Sinkers',
  "short_desc_tr" = 'Yüksek yoğunluklu tungsten kurşun, hızlı düşüş ve kontrol.',
  "short_desc_en" = 'High‑density tungsten sinker for rapid descent and precise depth control.',
  "content_tr" = 'Tungsten Sinkers; 6‑12 g, 10‑30 mm çap, çeşitli şekil (bullet, pyramid).

Avantaj: 2.5× daha yoğun, minimal cast drag.',
  "content_en" = 'Tungsten sinkers range 6‑12 g with 10‑30 mm diameters, offering 2.5× density of lead for faster sinking and reduced casting drag.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '700c1df0-1fa7-472e-ab39-2ac687f91c86';

UPDATE "public"."wiki_articles" SET
  "category" = 'lines',
  "title_tr" = 'Fluorocarbon Kaplı Örgü İp Misina',
  "title_en" = 'Fluorocarbon‑Coated Braid',
  "short_desc_tr" = '8‑kat örgü üzerine FC kaplama, şeffaflık + sertlik.',
  "short_desc_en" = '8‑strand braid with FC coating for invisibility plus strength.',
  "content_tr" = 'Fluorocarbon‑Coated Braid; 8‑strand PE, 0.20‑0.30 mm, FC dış katman, %0‑2 esneme.

Avantaj: FC görünmezliği, bükülme dayanımı.',
  "content_en" = 'Braid consists of 8 PE strands (0.20‑0.30 mm) with a fluorocarbon outer coating, providing near‑invisibility and low stretch.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = 'ffb3fc27-f756-4726-bf63-24f316885460';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Metal Kaşıklar & Shore Jigler',
  "title_en" = 'Metal Spoons & Shore Jigs',
  "short_desc_tr" = 'Uzak atış parıltılı kaşıklar ve asist iğneli metal jig sahteleri.',
  "short_desc_en" = 'Long casting metal spoons and assist hook jigs.',
  "content_tr" = 'Ağır yapıları ve aerodinamik şekilleri sayesinde sert rüzgarda dahi 80-100 metre mesafeye ulaşabilen parıltılı metal sahtelerdir.

TÜRKİYE''DE POPÜLER MODELLER:
Hansen Pilgrim Kaşık, Kendo Seabass Spoon, Savage Gear Psycho Sprat Jig, Major Craft Jigpara Slim.',
  "content_en" = 'Metal spoons and jigs sink fast and reflect light underwater for pelagic species.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000033';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Buzzbait (Pervaneli Su Üstü Yemi)',
  "title_en" = 'Buzzbait',
  "short_desc_tr" = 'Kanatlı titreşimli sahteler, yüzeyde gürültü üretir.',
  "short_desc_en" = 'Vibrating top‑water lure with wing blades.',
  "content_tr" = 'Buzzbait; 30‑70 g, 2‑4 cm kanat genişliği, 0.20‑0.30 mm plastik gövde.

Kullanım: Yüzey patlaması, agresif predator.',
  "content_en" = 'Buzzbait weighing 30‑70 g with 2‑4 cm wing blades and a 0.20‑0.30 mm plastic body; creates surface splash for aggressive predator strikes.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '3bd2f86c-c80b-4d8f-92c5-d38d80278700';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Metal Kaşık Sahte Yem',
  "title_en" = 'Plated Metal Spoon',
  "short_desc_tr" = 'Parlak metal kaşık, uzun mesafe ve hızlı atış.',
  "short_desc_en" = 'Shiny metal spoon for long‑distance casting.',
  "content_tr" = 'Metal Spoon; 15‑30 g, 0.25‑0.40 mm çelik, yüzey kaplaması (gümüş, bronz), 2‑4 cm uzunluk.

Kullanım: Hızlı su yüzeyi, gece avı.',
  "content_en" = 'Metal spoon weighing 15‑30 g, 0.25‑0.40 mm steel, plated in silver or bronze, length 2‑4 cm; ideal for fast surface and night fishing.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'd72dd4e1-f024-46e6-924e-e882be687eee';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Silikon Solucan (Soft Worm)',
  "title_en" = 'Soft Plastic Worm',
  "short_desc_tr" = 'Kuşaklı silikondan yapılan uzun yumuşak yem.',
  "short_desc_en" = 'Long soft plastic worm for bass and panfish.',
  "content_tr" = 'Worm; 10‑30 cm, 0.15‑0.25 mm silikondan, renk varyasyonları: kahverengi, yeşil, kırmızı.

Kullanım: Topwater, bottom, wobbler.',
  "content_en" = 'Soft worm 10‑30 cm long, 0.15‑0.25 mm silicone, color variants brown, green, red; suitable for topwater, bottom and wobble presentations.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'a42eb77e-6c45-4d63-a1e2-177ae6dacfa3';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Silikon Yemler & Jighead (Shad, Worm, Craw)',
  "title_en" = 'Soft Plastics & Jigheads',
  "short_desc_tr" = 'Balık, solucan ve karides silikonlarının kurşun kafalı iğneli modelleri.',
  "short_desc_en" = 'Soft plastic shad, worm, and craw lures with lead jigheads.',
  "content_tr" = 'Yumuşak silikon yemler; su içerisindeki yüksek esneklikleri, titreyen kürek kuyrukları (paddle tail) ve cezbedici koku özleri ile avcılığı kanıtlanmış sahtelerdir.

TÜRKİYE''DE POPÜLER MARKLAR:
Savage Gear Cannibal Shad, Berkley Gulp Alive Sandworm, Fujin Yummy Worm, Savage Gear Craft Shad.',
  "content_en" = 'Soft plastics provide natural texture and movement enticing sluggish predators.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000032';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Swimbait (Yumuşak Gövdeli Balık Sahtesi)',
  "title_en" = 'Swimbait',
  "short_desc_tr" = 'Gerçek balık vücudu taklit eden esnek sahteler.',
  "short_desc_en" = 'Soft plastic that mimics a swimming fish.',
  "content_tr" = 'Swimbait; 20‑50 cm uzunluk, 0.2‑0.35 mm plastik, doğal renk (gri, gümüş, yeşil).

Kullanım: Large predatory fish, yankı balığı.',
  "content_en" = 'Soft swimbait ranging 20‑50 cm in length, 0.2‑0.35 mm plastic, natural colors (gray, silver, green) for targeting large predatory species.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '8e978f6f-73bd-4f91-9128-75f2a3e4b392';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Ağır Metal Jig (Heavy Jig)',
  "title_en" = 'Metal Jig',
  "short_desc_tr" = 'Sert metal baş, ağırlıklı ve hızlı atış.',
  "short_desc_en" = 'Heavy metal head jig for aggressive bottom strikes.',
  "content_tr" = 'Metal Jig; 30‑80 g, 0.30‑0.45 mm çelik baş, 2‑4 mm iğne, renk: gümüş, altın.

Kullanım: Shore Jigging, Heavy Jigging.',
  "content_en" = 'Metal jig weighing 30‑80 g with a 0.30‑0.45 mm steel head and 2‑4 mm hook, available in silver or gold, used for shore and heavy jigging.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '7efbf0e4-1cc6-4907-992c-edbae44360ba';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Popper & WTD Stickbait (Su Üstü Sahteler)',
  "title_en" = 'Topwater Lures',
  "short_desc_tr" = 'Su yüzeyinde şapırtı ve WTD zikzağı ile avcı balıkları uyaran sahteler.',
  "short_desc_en" = 'Topwater splashers and zigzagging walking baits for explosive surface strikes.',
  "content_tr" = 'Su üstü sahteleri; su yüzeyinde kırılma, gürültü ve köpük çıkararak yırtıcı balıkların hücum refleksini tetikleyen en heyecanlı sahte türüdür.

TÜRKİYE''DE POPÜLER MODELLER:
Strike Pro Buster Jerk, Fujin Ziggy 90, Savage Gear Pop Walker, Kendo Seabass Popper.',
  "content_en" = 'Topwater lures splash and walk on the surface triggering aggressive predator strikes.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000031';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Floating & Sinking Minnow (Maket Balıklar)',
  "title_en" = 'Minnow Lures',
  "short_desc_tr" = 'Yüzey ve orta suda yaralı balık aksiyonu veren gagalı maket sahteler.',
  "short_desc_en" = 'Hard plastic minnows with diving lip for midwater action.',
  "content_tr" = 'Minnow sahteler; önlerindeki gaga yapısı sayesinde sarım esnasında suyun direncini kullanarak yaralı balık gibi sallanma (wobbling) ve yalpalama (rolling) aksiyonu veren klasik sahtelerdir.

TÜRKİYE''DE POPÜLER MODEL VE MARKLAR:
Kendo Seabass Minnow 125F, Duo Tide Minnow Slim, Shimano Silent Assassin 120F, Savage Gear Sandeel Jerk.',
  "content_en" = 'Minnow lures feature diving lips that generate lifelike swimming actions.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000030';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'EGI Kalamar & Sübye Zokaları',
  "title_en" = 'EGI Squid Lures',
  "short_desc_tr" = 'Kumaş kaplı, şemsiye tırnaklı gece kalamar ve sübye zokaları.',
  "short_desc_en" = 'Cloth-wrapped EGI lures with double crown hooks for squid.',
  "content_tr" = 'EGI zokaları; kumaş kaplı gerçekçi karides ve balık gövdeleri ile gece ışıklı mendirek ve limanlarda süzülerek kalamar ve sübyeleri avlayan özel zokalardır.

TÜRKİYE''DE POPÜLER MODELLER:
Yamashita Egi Oh K, Yo-Zuri Aurie-Q, Kendo Egi Sahte, Savage Gear 3D Swim Squid.',
  "content_en" = 'EGI squid lures mimic shrimp to target squid and cuttlefish during night fishing.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000034';

UPDATE "public"."wiki_articles" SET
  "category" = 'lures',
  "title_tr" = 'Metal Vibrasyon & Blade Vibe',
  "title_en" = 'Metal Vibration Blade Lures',
  "short_desc_tr" = 'Yüksek frekansta titreyerek lüfer, çinekop ve tatlı su levreğini cezbeden metal sahteler.',
  "short_desc_en" = 'High frequency vibrating metal blade lures.',
  "content_tr" = 'Metal vibrasyon sahteleri; hızlı sarım esnasında su altında yüksek frekanslı titreşimler yayarak balıkların yanal çizgi organlarını uyarır ve vuruş refleksini tetikler.

TÜRKİYE''DE POPÜLER MODELLER:
Fujin Vibe 18g/24g, Savage Gear Fat Vib, Kendo Vib 70, Strike Pro Cyber Vibe.',
  "content_en" = 'Vibration blade lures generate tight high frequency vibrations during retrieval.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000035';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Şamandıralı (Mantar) Takım',
  "title_en" = 'Float Rig',
  "short_desc_tr" = 'Kıyıdan gece veya gündüz, yemi istenilen derinlikte tutan klasik şamandıra donanımı.',
  "short_desc_en" = 'Classic float fishing setup to suspend baits at a precise depth.',
  "content_tr" = 'Şamandıralı (Mantar) Takım; özellikle denizde levrek, mırmır, kefal ve sargoz avında; tatlı suda ise sazan ve kızılkanat avında kullanılan, yemin dipten istenilen yükseklikte kalmasını sağlayan temel takımdır.

MONTAJ:
1. Ana bedene bir stoper ve fırdöndülü şamandıra takılır.
2. Altına şamandırayı dengede tutacak kadar kıstırma kurşunlar dizilir.
3. En uca 1 veya 2 köstekli iğne (uzun palalı) eklenir.

AVANTAJLARI:
Gece avlarında şamandıranın tepesine fosfor (ışık) takılarak görsel bir av zevki sunar. Yem yengeçler tarafından yenmez, hedef balığın önünde süzülür.',
  "content_en" = 'Uses a buoyant float (bobber) to keep the bait suspended at a specific depth. Perfect for night fishing with chemical lights.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '0b88eb23-6446-4972-9289-7b15e98a0760';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'FG Knot (Lider Düğümü)',
  "title_en" = 'FG Knot',
  "short_desc_tr" = 'Örgü ipi fluorocarbon lidere bağlayan, dünyanın en ince ve en sağlam sürtünme düğümü.',
  "short_desc_en" = 'The slimmest and strongest friction knot for joining braid to fluorocarbon leader.',
  "content_tr" = 'FG Knot; Spin, LRF ve Jigging disiplinlerinde ince örgü ip (Braid) misinayı, kalın fluorocarbon şok lidere bağlamak için kullanılan "Sürtünme (Friction)" prensibiyle çalışan bir düğümdür.

NEDEN EN İYİSİDİR?
Düğüm atılırken lider misina katlanmaz veya kendi etrafında dönmez. Örgü ip, düz duran liderin üzerine örgü şeklinde sarılır. Bu sayede düğüm, lider misinadan bile daha ince bir profile sahip olur. Kamışın yüzüklerinden geçerken kesinlikle takılma, sürtünme veya ses yapmaz. Atış erimini (mesafesini) düşürmez. Çeker gücü %99 seviyesindedir.',
  "content_en" = 'The FG Knot uses friction to grip the fluorocarbon leader without bending it, creating the slimmest profile possible that slides through rod guides effortlessly.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '8bbb0c74-aae4-4565-98d4-4ccbc5a87b74';

UPDATE "public"."wiki_articles" SET
  "category" = 'knots',
  "title_tr" = 'Palomar Düğümü',
  "title_en" = 'Palomar Knot',
  "short_desc_tr" = 'Klips, fırdöndü veya iğneyi misinaya bağlayan en hızlı ve en güvenilir düğüm.',
  "short_desc_en" = 'One of the strongest and most reliable knots for tying hooks and swivels.',
  "content_tr" = 'Palomar Düğümü; misinanın ikiye katlanıp iğne gözünden geçirilmesi ve oluşturulan halkanın iğnenin tamamının etrafından dolanmasıyla atılan, %95 oranında çeker gücüne sahip çok pratik bir düğümdür.

AVANTAJLARI:
Zifiri karanlıkta veya elleriniz donuyorken bile 3 saniyede atılabilir. Örgü (Braid) iplerde kayma yapmayan nadir düğümlerden biridir. Özellikle spin avlarında sahte klipsini bağlamak için idealdir.',
  "content_en" = 'The Palomar knot is a simple, highly effective knot for attaching a line to a hook, or a fly to a leader or tippet. It holds exceptionally well with braided lines.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '95a821bb-fd25-428f-a8da-f3892a293709';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Jigging Takımı (Heavy Jig Rig)',
  "title_en" = 'Jigging Rig',
  "short_desc_tr" = 'Kısa kamış, yüksek torklu makine ve ağır metal jig; dipte hızlı çekiş.',
  "short_desc_en" = 'Short rod, high‑torque reel and heavy metal jig for aggressive bottom strikes.',
  "content_tr" = 'Jigging Rig; 1.80‑2.00 m kısa kamış (Medium‑Fast), 4000‑6000 kafa yüksek torklu makine, 30‑60 g metal jig, 0.35‑0.45 mm fluorocarbon lider.

AVANTAJ:
 • Yüksek çekiş gücü, hızlı jig atışı.
 • Derin sularda 5‑20 m.',
  "content_en" = 'Jigging rig consists of a short 1.8‑2.0 m fast‑action rod, 4000‑6000 size high‑torque reel, 30‑60 g metal jig and 0.35‑0.45 mm fluorocarbon leader, ideal for deep water (5‑20 m) aggressive strikes.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'İleri'
WHERE "id" = '2dced344-8143-47c9-89bc-de69c9f8aae5';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Standart Şamandıralı Takım (Bobber Rig)',
  "title_en" = 'Bobber Rig',
  "short_desc_tr" = 'Şamandıra, hafif kurşun ve iğne; yüzeyde yem kontrolü sağlar.',
  "short_desc_en" = 'Floating bobber, light sinker and hook; maintains bait at a set depth.',
  "content_tr" = 'Bobber Rig; 1‑2 oz (30‑60 g) hafif kurşun, 0.20‑0.30 mm fluorocarbon lider, 2‑4 mm iğne, 5‑10 cm şamandıra.

KULLANIM:
 • Yüzey / orta derinlikte yemi tutma.
 • Çok yönlü (topwater, WTD, soft).',
  "content_en" = 'Bobber rig uses a 1‑2 oz light sinker, 0.20‑0.30 mm fluorocarbon leader, 2‑4 mm hook, and a 5‑10 cm float to keep the bait at a chosen depth, suitable for surface or mid‑depth presentations.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '7b99c753-285c-425f-815f-d27a31a3ecf8';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Kurşun Özlü Orkinos Takımı (Lead-Core Rig)',
  "title_en" = 'Lead‑Core (Tuna) Rig',
  "short_desc_tr" = 'Ağır kurşun (80‑120 kg) ve uzun iğne; büyük balık (tuna, dorado) hedefi.',
  "short_desc_en" = 'Heavy lead sinker (80‑120 kg) with long hook for big game fish such as tuna.',
  "content_tr" = 'Lead‑Core Rig; 80‑120 kg çelik kurşun, 0.45‑0.60 mm fluorocarbon lider, 6‑8 mm iğne, 2‑3 m kamış (hard‑action).

HEDEF: Tuna, Mahi‑Mahi, Dorado.',
  "content_en" = 'Lead‑core rig uses an 80‑120 kg lead sinker, 0.45‑0.60 mm fluorocarbon leader, 6‑8 mm hook and a 2‑3 m hard‑action rod to pursue big game species like tuna and mahi‑mahi.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'İleri'
WHERE "id" = 'e3ed25d8-85e7-4207-a943-815d355a7446';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Carolina Takımı (Carolina Rig)',
  "title_en" = 'Carolina Rig',
  "short_desc_tr" = 'Ağır kurşun üstte, ince lider ve iğne altta; dipte doğal hareket sağlar.',
  "short_desc_en" = 'Heavy sinker at the bottom, thin leader and hook above; mimics natural prey on the bottom.',
  "content_tr" = 'Carolina Rig; 2‑3 oz (55‑85 g) ağır kurşun, 0.30‑0.45 mm fluorocarbon lider, 2‑4 mm J‑Hook. İğne liderin üstünde 30‑45 cm mesafede asılıdır.

KULLANIM:
 • Bottom‑bouncing, soft‑plastic veya canlı yem.
 • Derin sularda 1‑10 m hâlinde.',
  "content_en" = 'Carolina rig uses a 2‑3 oz sinker, 0.30‑0.45 mm fluorocarbon leader, and a 2‑4 mm J‑hook with the hook positioned 30‑45 cm above the sinker.

Usage: bottom‑bouncing with soft‑plastic or live bait, effective in depths of 1‑10 m.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = '364972bd-74fc-4386-ae0a-7bd7cf0c309e';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Texas Takımı (Texas Rig)',
  "title_en" = 'Texas Rig',
  "short_desc_tr" = 'Silikon yemleri dibe takılmadan, otluk ve kayalık meralarda yüzdürme montajı.',
  "short_desc_en" = 'Weedless soft plastic rig designed for fishing in heavy cover.',
  "content_tr" = 'Texas Rig; özellikle tatlı suda turna ve levrek, denizde ise kaya diplerinde avlanırken silikon yemlerin dibe takılmasını engelleyen efsanevi bir Amerikan donanımdır.

MONTAJ (KURULUM):
1. Ana bedene önce serbest kayan bir kurşun (Bullet Weight - mermi kurşun) geçirilir.
2. Kurşunun altına misinayı korumak için bir boncuk takılır.
3. Ucuna ofset (Off-set) iğne bağlanır.
4. Silikon yemin kafasından iğne geçirilir ve iğnenin ucu silikonun gövdesine gizlenerek (Weedless) takılma önlenir.

AVANTAJLARI:
Kurşun serbestçe kaydığı için balık yemi yuttuğunda kurşun ağırlığını hissetmez, iğne ucu gizli olduğu için yosunlara ve kayalara takılmaz.',
  "content_en" = 'The Texas Rig is a classic weedless setup for soft plastics. A bullet weight slides freely on the line above an offset hook buried in the lure, preventing snags.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = 'e99cc5cd-656b-4242-ad0d-0ef5a172e8ed';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Hibrit Drop-Shot & Şamandıra Takımı',
  "title_en" = 'Hybrid Drop‑Shot / Float Rig',
  "short_desc_tr" = 'Drop‑shot iğnesi üstte, şamandıra altına; hem dip hem yüzey kontrolü.',
  "short_desc_en" = 'Drop‑shot hook on top, float below; offers both bottom and surface control.',
  "content_tr" = 'Hybrid Rig; 0.30‑0.45 mm fluorocarbon lider, 1‑2 oz hafif kurşun, 5‑8 cm şamandıra, iğne 30‑40 cm kurşundan üstte.

KULLANIM:
 • Soft‑plastic ve topwater kombinasyonu.
 • 1‑8 m arası su derinliği.',
  "content_en" = 'Hybrid rig combines a drop‑shot hook positioned 30‑40 cm above a 1‑2 oz sinker with a 5‑8 cm float, ideal for soft‑plastic and topwater combos in 1‑8 m depths.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Orta'
WHERE "id" = 'f758b07d-4f8f-4c04-a598-3506ddf6cd86';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Hair Rig (Kıl Rig)',
  "title_en" = 'Hair Rig',
  "short_desc_tr" = 'Yemi iğneden bağımsız kıl misinaya dizerek sazanın yemi tereddütsüz emmesini sağlayan efsanevi montaj.',
  "short_desc_en" = 'Classic carp hair rig layout separating the bait from the hook for natural suction.',
  "content_tr" = 'Hair Rig; sazan balıkçılığında devrim yaratmış efsanevi bir montajdır. Yem (boili, mısır veya pelet) doğrudan kancaya takılmak yerine, kancanın altından sarkan ince ip (kıl) üzerine dizilir.

ÇALIŞMA PRENSİBİ:
Sazan yemlenirken şüpheci bir şekilde yemi emer. Kanca boşta olduğu için balığın ağzına takılmadan doğal şekilde içeri girer. Balık yemi tükürmeye çalıştığında kanca alt dudağa saplanır.

EKİPMAN VE MONTAJ:
• İğne: Wide Gape veya Curve Shank #4 - #8 boy sazan iğnesi.
• Kıl Misinası: Yumuşak örgülü kaplamasız rig ipi.
• Stoper: Boili stoperi ile yem sabitlenir.
• Ideal Kullanım: Tatlı su göl ve barajlarında boili ve mısır ile sazan avı.',
  "content_en" = 'The Hair Rig is a revolutionary carp fishing rig where the bait (boilie, corn, or pellet) is threaded onto a small piece of braid (the hair) hanging below the hook rather than attached directly to it.

HOW IT WORKS:
Carp feed by sucking in debris and food. Because the hook is completely exposed and free of bait, it glides into the carp''s mouth unnoticed. When the fish tries to eject the bait, the hook catches the bottom lip cleanly.

KEY COMPONENTS:
• Hook: Wide Gape or Curve Shank #4 to #8 carp hook.
• Hair Material: Soft braided hooklink material.
• Bait Stop: Plastic boilie stop to secure the bait.
• Best For: Carp angling in lakes and reservoirs using boilies or corn.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000040';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Ronnie Rig / Spinner Rig',
  "title_en" = 'Ronnie Rig',
  "short_desc_tr" = 'Pop-up (yüzen) yemlerin dip yosunlarından yukarıda 360 derece serbest dönerek mükemmel saplanmasını sağlayan modern sazan rigi.',
  "short_desc_en" = 'Modern 360-degree rotating pop-up carp rig for supreme hook holds above debris.',
  "content_tr" = 'Ronnie Rig (Spinner Rig); pop-up (yüzen) yemlerin dipteki çamur ve yosun katmanının 2-4 cm üzerinde kusursuz bir şekilde durmasını sağlayan en popüler agresif sazan donanımıdır.

AVANTAJLARI:
1. 360 Derece Dönüş: Fırdöndü sayesinde kanca her yönden gelen balığa karşı anında döner ve saplanır.
2. Çabuk Değişim: Kanca körelirse fırdöndü halkasından saniyeler içinde değiştirilebilir.
3. Temiz Sunum: Dipteki mil ve ot tabakasının üzerinde yemi görünür kılar.

KURULUM:
• Kanca: Curve Shank sazan iğnesi (#4 - #6).
• Bağlantı: QC Ring Swivel (Hızlı değişim fırdöndüsü) ve daralan makaron (Shrink Tube).
• Yem: 12-15 mm renkli ve aromalı Pop-Up boili.',
  "content_en" = 'The Ronnie Rig (also known as the Spinner Rig) is one of the most effective modern carp rigs designed specifically for pop-up baits, keeping them popped up 2-4 cm above lakebed debris.

ADVANTAGES:
1. 360-Degree Rotation: The hook rotates freely in all directions, ensuring quick lip hooked fish.
2. Fast Hook Changes: Uses a quick-change swivel so damaged hooks can be replaced in seconds.
3. Clean Presentation: Keeps the pop-up elevated above silt and weed.

COMPONENTS:
• Hook: Curve Shank carp hook (#4 - #6).
• Connection: Quick Change (QC) Ring Swivel with shrink tubing over the eye.
• Bait: 12-15 mm high-attract pop-up boilie.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000041';

UPDATE "public"."wiki_articles" SET
  "category" = 'rigs',
  "title_tr" = 'Drop Shot Takımı',
  "title_en" = 'Drop Shot Rig',
  "short_desc_tr" = 'İğnenin ve yemin kurşundan yukarıda sabitlendiği hassas dip avı donanımı.',
  "short_desc_en" = 'Finesse rig with the hook tied above the sinker for suspended presentation.',
  "content_tr" = 'Drop Shot Rig; kurşunun en altta olduğu, iğnenin ve silikon yemin ise kurşundan 20-40 cm yukarıda ana bedene 90 derece açıyla sabitlendiği bir donanımdır.

AVANTAJLARI:
Yem dipten yukarıda, doğrudan balığın göz hizasında kalır. Kamışın ucunu çok hafif titrettiğinizde, kurşun yerinden oynamazken silikon yem olduğu yerde can çekişen bir balık gibi titreşir. Pasif ve yeme isteksiz balıkları (özellikle soğuk sularda) kışkırtmak için 1 numaralı tekniktir.',
  "content_en" = 'Features a weight at the bottom of the line with a hook tied in-line above it. Perfect for keeping lures suspended in the strike zone.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = '3bef4776-4ab4-4688-90fb-00e99239de03';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Piramit & Sıkıştırma Kurşunlar',
  "title_en" = 'Pyramid & Split‑Shot Sinkers',
  "short_desc_tr" = 'Farklı ağırlık ve şekil, derinlik kontrolü.',
  "short_desc_en" = 'Various weights and shapes for depth control.',
  "content_tr" = 'Pyramid Sinkers 5‑30 g, 10‑30 mm çap; Split‑Shot 1‑5 g, çeşitli uzunluk.

Kullanım: Drop‑shot, bottom, bobber.',
  "content_en" = 'Pyramid sinkers (5‑30 g) and split‑shot (1‑5 g) for drop‑shot, bottom and bobber rigs.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'e45de367-1e3c-482c-8468-3a3b2281e63a';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Spin Kamışı (Spinning Rod)',
  "title_en" = 'Spinning Rod',
  "short_desc_tr" = '2.40m - 2.70m uzunluğunda, 7-35g / 10-40g atarlı esnek kıyı at-çek kamışı.',
  "short_desc_en" = 'Standard 2-piece lure casting rod for shoreline angling.',
  "content_tr" = 'Spin kamışları; maket balık, kaşık ve silikon yemleri erimli fırlatmak ve yemlere kamış ucuyla aksiyon vermek için tasarlanmış 2 parçalı karbon kamışlardır.

ÖZELLİKLERİ:
• Boyut: Kıyıdan 2.40m - 2.70m, tekneden 2.10m - 2.40m.
• Atar Aralığı: 7-28g (Medium Light), 10-40g (Medium), 14-42g (Medium Heavy).
• Aksiyon: Hızlı (Fast) veya Orta-Hızlı (Medium-Fast) uç aksiyonu.

TÜRKİYE''DE POPÜLER MODELLER:
Savage Gear SG2 Shore Game, Daiwa Ninja Spin, Shimano Catana FX, Okuma Alaris, Fujin Dragon.',
  "content_en" = 'Spinning rods are 2-piece carbon rods designed for casting lures.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000013';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'LRF Kamışı (Ultra Light Rod)',
  "title_en" = 'LRF Ultra Light Rod',
  "short_desc_tr" = '2.10m - 2.30m, 0.5-7g / 1-10g atarlı hassas uçlu ultra hafif LRF kamışı.',
  "short_desc_en" = 'Ultra light carbon rod with sensitive solid or tubular tip.',
  "content_tr" = 'LRF kamışları; 1-3 gramlık mikro yemleri fırlatabilen ve kamış ucundaki en ufak balık tıkırtısını sapa ileten ultra hassas karbon kamışlardır.

UÇ YAPISI SEÇİMİ:
• Solid (Dolgu Uç): Esnek dolgu uçlu modeller silikon yemlerde vuruş hissini artırır, balık yemi emerken direnç hissetmez.
• Tubular (Boru Uç): İçi boş boru uçlu modeller mikro maket ve mikro kaşıklarda sert aksiyon vermeyi kolaylaştırır.

TÜRKİYE''DE POPÜLER MODELLER:
Savage Gear Micro Game, Fujin Boreas, Major Craft Solpara LRF, Daiwa Laguna LRF, Okuma Wave Off.',
  "content_en" = 'LRF rods feature ultra sensitive tips designed for casting micro lures weighing under 10 grams.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '00000000-0000-0000-0000-000000000014';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Sazan Makinesi (Baitrunner / Serbest Makara)',
  "title_en" = 'Carp Baitrunner Reel',
  "short_desc_tr" = 'Çift kalamalı, balık asıldığında misinayı boşa salan ve kol çevrilince devreye giren sazan makinesi.',
  "short_desc_en" = 'Dual drag free-spool reel designed specifically for static carp angling.',
  "content_tr" = 'Sazan makineleri (Baitrunner); arkada bulunan ek bir kol yardımıyla balık yemi alıp kaçarken misinayı sıfır dirençle boşa salan özel çift kalama mekanizmasına sahiptir.

AVANTAJLARI:
Balık oltaya vurup kaçarken kamışı sehpadan suya çekemez. Kol bir tur çevrildiği anda arka kalama devreden çıkar ve ön savaş kalaması devreye girer.',
  "content_en" = 'Baitrunner reels allow carp to take line freely until the angler turns the handle.',
  "water_type" = 'Tatlı Su',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '0fb67935-480e-4e56-bddb-ef25dfdaf28a';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Surfcast (Big Pit) Makine',
  "title_en" = 'Surf Big Pit Reel',
  "short_desc_tr" = 'Geniş konik makaralı, 100 metre üzeri uzağa atış ve Boğaz makinesi.',
  "short_desc_en" = 'Long cast shallow spool reel for heavy beach and current surfcasting.',
  "content_tr" = 'Surf makineleri (Big Pit); sığ ve geniş açılı konik misina makarası sayesinde atış esnasında ipin sürtünmesizce boşalmasını ve 100-150m mesafelere ulaşmasını sağlar. 

ÖZELLİKLERİ:
• 7000 - 10000 kafa boyutundadır.
• Ağır kurşunları akıntıdan rahat çekmek için güçlü dişli oranlarına (4.1:1 - 4.6:1) sahiptir.',
  "content_en" = 'Big Pit reels feature large tapered spools engineered for extreme distance casting.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Orta'
WHERE "id" = 'f220a4bc-9deb-4312-b91e-ec91a3c3fc6e';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Spin Makinesi (Spinning Reel)',
  "title_en" = 'Spinning Reel',
  "short_desc_tr" = 'At-çek balıkçılığı için ön kalamalı, yüksek torklu standart olta makinesi.',
  "short_desc_en" = 'Standard front drag reel used for lure casting and active angling.',
  "content_tr" = 'Spin makineleri; hafiflikleri, yüksek sarım kalitesi ve hassas kalama (drag) mekanizmaları ile dünyada en çok kullanılan olta makinesi türüdür.

BOYUT SEÇİMİ:
• 1000 - 2000 Kafa: LRF ve Ultra-light avlar.
• 3000 - 4000 Kafa: Spin at-çek, tatlı su levreği ve lüfer avları.
• 5000 - 6000 Kafa: Shore Jigging ve ağır kıyı avları.',
  "content_en" = 'Spinning reels offer versatile performance across all freshwater and saltwater casting applications.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'a6570b0b-248d-46d2-893d-56bb601d40e8';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Standart J-İğne (J-Hook)',
  "title_en" = 'Standard J‑Hook',
  "short_desc_tr" = 'En yaygın balık iğnesi, çeşitli boyut ve ağırlıkta.',
  "short_desc_en" = 'Most common hook, available in many sizes and weights.',
  "content_tr" = 'Standard J‑Hook; 2‑30 mm boy, 0.4‑1.5 g ağırlık, çelik, paslanmaz kaplama.

Kullanım: Neredeyse tüm disiplinlerde.',
  "content_en" = 'Standard J‑Hook ranging 2‑30 mm in length and 0.4‑1.5 g in weight, stainless steel, suitable for virtually all fishing styles.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '0cbd7a01-fac8-437b-8c00-5db6c8e91075';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Surfcast Kamışı (Surfcasting Rod)',
  "title_en" = 'Surfcasting Rod',
  "short_desc_tr" = '4.20m - 4.50m, 100-200g / 150-250g atarlı güçlü 3 parçalı boğaz ve kumsal kamışı.',
  "short_desc_en" = 'Heavy duty beach and current casting surf rod.',
  "content_tr" = 'Surfcast kamışları; dalgalı kumsal kıyılarda veya İstanbul Boğazı gibi sert akıntılı sularda 150-220 gramlık ağır kurşunları 100-150m mesafelere fırlatan 3 parçalı veya teleskopik sert kamışlardır.

TÜRKİYE''DE POPÜLER MODELLER:
Daiwa Black Widow Surf, Okuma Trio Rex Surf, Kendo Surf, Trabucco Poetica.',
  "content_en" = 'Surfcasting rods cast heavy sinkers long distances into breaking surf.',
  "water_type" = 'Tuzlu Su',
  "difficulty_level" = 'Orta'
WHERE "id" = '00000000-0000-0000-0000-000000000015';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Çıkrık Makine (Baitcasting / Conventional Reel)',
  "title_en" = 'Conventional Reel',
  "short_desc_tr" = 'Makaranın kamışla aynı hizada döndüğü, torku çok yüksek ağır yük makineleri.',
  "short_desc_en" = 'Overhead reels with high cranking power for boat fishing and heavy trolling.',
  "content_tr" = 'Çıkrık Makineler (Conventional Reels); spin makinelerin aksine, misina makarasının kamışa paralel ve dönerek misinayı boşalttığı makinelerdir.

ÖZELLİKLERİ:
İçerisindeki dişli mekanizması doğrudan güç aktarımı sağlar, bu nedenle devasa balıklarla (Orkinos, Akya) savaşırken spin makinelere göre çok daha yüksek bir tork (çekiş gücü) üretirler. Genellikle tekne balıkçılığında (Sırtı ve Ağır Jigging) veya yemli dev sazan/yayın avlarında kullanılırlar.',
  "content_en" = 'Conventional reels are mounted above the rod and feature a spool that rotates during casting and retrieval. They offer unmatched cranking power for large game fish.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'İleri'
WHERE "id" = 'c606889b-fa95-44b8-993d-92ed10db1ce8';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Kamış Sehpası (Rod Pod / Tripod)',
  "title_en" = 'Rod Pod / Tripod',
  "short_desc_tr" = 'Tekne ya da buzda kamış stabilizasyonu için çerçeve.',
  "short_desc_en" = 'Frame for stabilizing a rod on a boat or ice.',
  "content_tr" = 'Rod Pod; alüminyum, 30 cm‑45 cm çap, ayarlanabilir yükseklik, taşınabilir.

Kullanım: Trolling, Bait‑casting.',
  "content_en" = 'Aluminum rod pod with 30‑45 cm diameter, adjustable height, portable for trolling or bait‑casting.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'c8723389-3d91-4da2-8267-ae9953e63751';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Işıldak & LED Aydınlatma (Glow Stick)',
  "title_en" = 'LED Light / Glow Stick',
  "short_desc_tr" = 'Gece avında şamandıra veya yem ışıklandırması.',
  "short_desc_en" = 'Night‑time illumination for float or bait.',
  "content_tr" = 'LED Light; 3 W, 800‑lumens, su geçirmez IP68, 3‑hour battery life.

Glows: 5‑10 saniye after aktivasyon.',
  "content_en" = 'LED light rated at 3 W, 800 lumens, IP68 waterproof, 3‑hour battery life, with a 5‑10 second glow after activation.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = 'bbc9b29d-5e2d-4e88-b38a-f73df26cb08b';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Balıkçı Pensi & Misina Makası',
  "title_en" = 'Pliers / Scissors',
  "short_desc_tr" = 'Kanca ayırma ve misina kesimi için paslanmaz çelik alet.',
  "short_desc_en" = 'Stainless steel tool for hook removal and line cutting.',
  "content_tr" = 'Pliers; 10‑cm tutma, anti‑slip, cam roller; Scissors; 8‑cm bıçak, paslanmaz çelik.

Kullanım: Tüm disiplinler.',
  "content_en" = 'Stainless steel pliers (10 cm jaws, anti‑slip) and scissors (8 cm blade) for all fishing disciplines.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '5b93365b-c207-478f-b32a-b5944f80e5b0';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Fly Çıkrık Makinesi',
  "title_en" = 'Fly Reel',
  "short_desc_tr" = 'Fly balıkçılığı için hafif, düşük drag, yüksek hassasiyet.',
  "short_desc_en" = 'Light fly reel with low drag and high precision.',
  "content_tr" = 'Fly Reel; 2000‑3000 kafa, 1:4,5 gear ratio, alüminyum gövde, çelik rulman.

Kullanım: Fly Fishing, kurşunsuz av.',
  "content_en" = 'Fly reel size 2000‑3000, gear ratio 1:4.5, aluminum body, steel bearings; ideal for fly fishing with weightless baits.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '842dbb44-9511-4e1c-9338-b30408470765';

UPDATE "public"."wiki_articles" SET
  "category" = 'tackles',
  "title_tr" = 'Elektronik Vuruş Alarmı (Bite Alarm)',
  "title_en" = 'Bite Alarm',
  "short_desc_tr" = 'Balığa ısırma anında titreşimli uyarı.',
  "short_desc_en" = 'Vibration alarm that notifies when a fish bites.',
  "content_tr" = 'Bite Alarm; 12‑V batarya, su geçirmez kovan, 0‑40 °C çalışma sıcaklığı, 2‑5 dB titreşim.

Kullanım: Sazan, levrek, alabalık.',
  "content_en" = 'Bite alarm powered by 12 V battery, waterproof housing, operating between 0‑40 °C, produces 2‑5 dB vibration for carp, bass, or trout.',
  "water_type" = 'Tüm Sular',
  "difficulty_level" = 'Başlangıç'
WHERE "id" = '03996de1-48fc-4f44-b2fa-ee5a41fbad7c';

