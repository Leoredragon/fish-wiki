import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const disciplineArticles = [
  {
    category: 'disciplines',
    title_tr: 'Spinning (At-Çek) Balıkçılığı',
    title_en: 'Spin Fishing',
    short_desc_tr: 'Sahte maket balıklar, kaşıklar ve silikonlar ile dinamik, aktif kıyı avcılığı.',
    short_desc_en: 'Dynamic active shoreline angling using hard lures and spinners.',
    content_tr: `Spinning balıkçılığı; sert plastik maket balıklar, su üstü popperlar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp kamış hareketleriyle ritmik şekilde geri sarılması esasına dayanır. 

EKİPMAN SEÇİMİ:
- Kamış: 2.40m - 2.70m uzunluğunda, 10-40g veya 7-28g atarlı, orta-hızlı (Medium-Fast) aksiyonlu kamışlar.
- Makine: 3000 - 4000 kafa boyutunda, 5.2:1 veya 6.2:1 devirli spin makineleri.
- Misina: 8 kat örgü PE 0.8 - PE 1.2 ip misina + 0.30mm - 0.35mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.

AV TAKTİKLERİ:
Sabahın ilk ışıklarında ve gün batımında (sabah suyu / akşam suyu) su üstü sahteleri (WTD aksiyonu) veya sığ dalar maketler maksimum verim sağlar. Bulanık ve dalgalı havalarda beyaz, limon veya pembe renkli sahteler tercih edilmelidir.`,
    content_en: `Spinning relies on casting hard lures or spinners and retrieving them with action.

TACKLE SPECIFICATIONS:
- Rod: 2.40m - 2.70m (10-40g rating)
- Reel: 3000 - 4000 size spin reel
- Line: 8-strand PE 0.8 - PE 1.2 Braid + 0.30mm FC Leader

TARGET SPECIES:
Seabass, Bluefish, Bonito, Leerfish, Barracuda, Trout.`,
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'LRF (Light Rock Fishing / Ultra Hafif At-Çek)',
    title_en: 'Light Rock Fishing (LRF)',
    short_desc_tr: 'Ultra hafif kamışlar ve mikro yemlerle kıyı kayalıklarında hassas av disiplini.',
    short_desc_en: 'Ultra-light tackle angling using micro lures around coastal rocks.',
    content_tr: `LRF (Light Rock Fishing), Japonya kökenli ultra hafif takım balıkçılığıdır. 0.5 ile 10 gram arasındaki mikro yemlerle sığ kayalıklarda, liman içlerinde ve mendireklerde hassasiyeti en üst seviyeye çıkarır.

EKİPMAN SEÇİMİ:
- Kamış: 2.10m - 2.30m uzunluğunda, 0.5-7g veya 1-10g atarlı, hassas uçlu (Tubular veya Solid) LRF kamışları.
- Makine: 1000 - 2000 kafa sığ makaralı (Shallow Spool) LRF makineleri.
- Misina: PE 0.2 - PE 0.4 inceliğinde mikro ip misina + 0.16mm - 0.20mm Fluorocarbon lider.

HEDEF BALIKLAR:
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani, Kaya Balığı.

AV TAKTİKLERİ:
1g-3g jighead üzerine takılanKokulu silikonlar (Gulp, Isome vb.) dibe yakın mesafeden yavaşça zıplatılarak çekilir. Gece liman ışıkları etrafında batan mikro kaşıklar ve su üstü mikro sahteler istavrit avında mükemmel aksiyon sunar.`,
    content_en: `LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.`,
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Shore Jigging (Kıyı Ağır Metal Jig)',
    title_en: 'Shore Jigging',
    short_desc_tr: 'Kıyıdan ve mendirek kayalıklarından ağır metal jiglerle iri pelajik avcılığı.',
    short_desc_en: 'Heavy shore angling targeting large pelagics with metal jigs.',
    content_tr: `Shore Jigging; sert akıntılı ve derin kayalık sahillere 30 ile 100 gram arasındaki ağır metal jiglerin atılıp dikine sert vuruşlarla (High Pitch Jerk) aksiyon verilerek çekilmesidir.

EKİPMAN SEÇİMİ:
- Kamış: 2.70m - 3.00m uzunluğunda, 30-80g veya 40-100g atarlı sert güçlü Jig kamışları.
- Makine: 4000 - 6000 kafa boyutunda, yüksek devirli (HG/XG) güçlü dişli yapısına sahip makineler.
- Misina: PE 1.5 - PE 3.0 örgü ip + 0.45mm - 0.65mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Akya, Torik, Palamut, Kuzu (Greater Amberjack), Baracuda, Lagos, Sinarit.

AV TAKTİKLERİ:
Metal jig dibe değdikten sonra ritmik olarak kamış yukarı fırlatılıp hızlıca sarılır. Jig dibe düşerken süzülme anında vuruşlar çok yoğundur.`,
    content_en: 'Shore jigging involves casting heavy metal lures from coastal rocks to target pelagic predators.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'İleri',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Surfcasting (Kıyı İleri Atış & Ağır Dip)',
    title_en: 'Surfcasting',
    short_desc_tr: 'Dalgalı kumluk ve kırmalık sahillere 100-250 gramlık ağır kurşunlarla uzağa atış.',
    short_desc_en: 'Long-distance casting with heavy sinkers (100-250g) on sandy beaches.',
    content_tr: `Surfcasting; dalgalı deniz kıyılarında 100 metre üzerindeki mesafelere ağır kurşunlu takımları fırlatarak dipteki iri balıkları avlama tekniğidir.

EKİPMAN SEÇİMİ:
- Kamış: 4.20m - 4.50m uzunluğunda, 100-200g veya 150-250g atarlı 3 parçalı veya sert teleskopik surf kamışları.
- Makine: 7000 - 10000 kafa geniş konik (Big Pit) sığ makaralı makineler.
- Misina: 0.16mm - 0.20mm Örgü İp + Konik Şok Lider (Shockleader) veya 0.30mm - 0.35mm Monofilament.

HEDEF BALIKLAR:
Çupra, Kalkan, Mırmır, Levrek, Eşkina ve Kurşun Arkası tekniği ile Çinekop / Lüfer / Palamut.

AV TAKTİKLERİ:
Yem olarak boru kurdu, sülünes, canlı yengeç, madya ve taze hamsi/istavrit fletos tercih edilir. Kurşun arkası yapılıyorsa 150-200g kurşun arkasına 3-7cm maket balık bağlanarak Boğaz akıntısında uzak mesafeler taranır.`,
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Tekneden Slow Jigging & Vertical Jigging',
    title_en: 'Slow Pitch Jigging',
    short_desc_tr: 'Tekneden derin deniz kanyonlarına dikey zıplatma sahteleri ile trofe avcılığı.',
    short_desc_en: 'Vertical boat angling using weighted jigs in deep sea structures.',
    content_tr: `Slow ve Vertical Jigging; açık denizde 30 metreden 150 metreye kadar olan derin taşlarda ve kanyonlarda tekneden dikine yapılan trofe avcılığı yöntemidir.

EKİPMAN SEÇİMİ:
- Kamış: 1.80m - 2.10m hassas esneme yapısına sahip tetikli (Baitcast) veya Jig kamışları.
- Makine: Güçlü çıkrık/baitcasting makinesi veya 5000-8000 boyutunda yüksek torklu spin makinesi.
- Misina: PE 2.0 - PE 4.0 örgü ip + 0.50mm - 0.70mm Fluorocarbon lider.

HEDEF BALIKLAR:
Lagos, Grida, Akya, Sinarit, Trança, Orfoz, Fangri Mercan.

AV TAKTİKLERİ:
80g ile 250g arasındaki yaprak (Slow Pitch) jigler dibe indirildikten sonra yarım tur sarım ve kamış ucu sektirmeleri ile geniş yaprak süzülmeleri yaptırılır.`,
    content_en: 'Slow pitch jigging lures sink and flutter in deep water to entice large bottom dwellers like groupers and dentex.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'İleri',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Fly Fishing (Sinek Oltacılığı)',
    title_en: 'Fly Fishing',
    short_desc_tr: 'Özel ağırlıklı misina ve el yapımı böcek/sinek sahteleri ile zarif akarsu avı.',
    short_desc_en: 'Elegant stream angling using weighted fly lines and handcrafted flies.',
    content_tr: `Fly Fishing; ağırlığı yem yerine misinada olan, el yapımı tüy ve ipliklerden üretilmiş böcek sahtelerinin akarsu yüzeyine zarifçe kondurulması sanatıdır.

EKİPMAN SEÇİMİ:
- Kamış: 2.40m - 2.70m uzunluğunda, #3 ile #6 numara arası Fly kamışları.
- Makine: Özel geniş hazneli Fly makinesi (Fly Reel).
- Misina: Yüzen (WF-Floating) ağır Fly misinası + Şeffaf incelen konik lider (Leader) + Tippet.

HEDEF BALIKLAR:
Kırmızı Benekli Alabalık, Abant Alası, Dere Alabalığı, Tatlı Su Kefali (Kasna).

AV TAKTİKLERİ:
Suların durgunlaştığı havuzcuklarda yüzeyde yüzen kuru sinekler (Dry Fly) veya dipte süzülen nimfler (Nymph) akıntıya bırakılır.`,
    content_en: 'Fly fishing relies on casting lightweight artificial flies using weighted fly lines in clear streams.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'İleri',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Yemli Dip Balıkçılığı (Kıyı & Tekne)',
    title_en: 'Bottom Bait Fishing',
    short_desc_tr: 'Doğal yemler, ağır kurşunlar ve köstekli takımlarla klasik dip balıkçılığı.',
    short_desc_en: 'Classic bottom fishing with natural baits and multi-hook rigs.',
    content_tr: `Yemli dip balıkçılığı; deniz ve tatlı su dip canlılarını taklit eden doğal yemlerin (boru kurdu, sülünes, yengeç, mısır, hamur vb.) kurşunlu takımlarla dibe yatırılmasıdır.

EKİPMAN SEÇİMİ:
- Kamış: 2.70m - 3.60m 50-150g atarlı esnek uçlu dip kamışları.
- Makine: 4000 - 6000 kafa kalamalı veya arkadan serbest makaralı (Baitrunner) makineler.
- Takım: 2'li veya 3'lü klasik beden köstek takımları, Gezer kurşunlu tek iğneli mantarlı takımlar.

HEDEF BALIKLAR:
Sazan, Yayın, Eşkina, Karagöz, Çupra, Mırmır, Mercan.

AV TAKTİKLERİ:
Akşam ve gece saatlerinde kıyı kayalıklarında boru kurdu ve mamun ile Eşkina ve Karagöz; kumluk sahil kırmalıklarında ise Çupra ve Mırmır avı için en güvenilir av disiplinidir.`,
    content_en: 'Traditional bottom fishing targeting bottom dwellers with natural baits.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Şamandıralı (Bolognese & Göl) Balıkçılık',
    title_en: 'Float / Match Fishing',
    short_desc_tr: 'Hassas şamandıralar ve ince misinalarla su kolonundaki balıkları avlama.',
    short_desc_en: 'Precision angling using delicate floats to target mid-water species.',
    content_tr: `Şamandıralı balıkçılık; suyun üstünde yüzen şamandıranın batma veya sallanma hareketini takip ederek yemi belirli bir derinlikte sabit tutma yöntemidir.

EKİPMAN SEÇİMİ:
- Kamış: 4.00m - 7.00m uzunluğunda Bolognese kamışlar veya makineli esnek göl kamışları.
- Makine: 2000 - 3000 hafif spin veya kibar göl makineleri.
- Takım: Hassas stoperli gezer şamandıra, kıstırma kurşunlar ve ince beden (0.12mm - 0.18mm).

HEDEF BALIKLAR:
Kefal, Kızılkanat, Kadife, Karagöz, İstavrit, Tatlı Su Kefali.

AV TAKTİKLERİ:
Ekmek içi, solucan veya hamur kullanılan avlarda şamandıranın en ufak batma anında seri ve yumuşak tasma vurulmalıdır.`,
    content_en: 'Float fishing provides visual excitement watching the float plunge underwater upon a strike.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Trolling (Sırtı Çekme / Tekne Arkası)',
    title_en: 'Trolling',
    short_desc_tr: 'Hareket halindeki teknenin arkasından sahte veya canlı yem sürütme tekniği.',
    short_desc_en: 'Boat trolling with hard lures or live bait behind a moving vessel.',
    content_tr: `Sırtı çekme (Trolling); teknenin 2 ile 5 mil arasındaki sabit hızında su üstünden veya daldırıcı aparatlar (daldırma tahtası, downrigger) ile derinden yem çekilmesi yöntemidir.

EKİPMAN SEÇİMİ:
- Kamış: 1.60m - 2.10m 20-50 lb sınıfı Trolling / Çıkrık kamışları.
- Makine: Kol kontrollü (Lever Drag) güçlü çıkrık makineleri.
- Yemler: Derin dalan uzun gaga maket balıklar, tüy silikonlar, canlı Zargana veya Kalamar.

HEDEF BALIKLAR:
Palamut, Torik, Akya, Baracuda, Kuzu, Orkinos, Kılıç Balığı.

AV TAKTİKLERİ:
Sonbahar palamut akınında yüzeyden 10-15 cm maket balıklar veya silikon çapariler çekilirken, Akya ve Kuzu avında canlı Zargana ile dibe yakın sırtı çekilir.`,
    content_en: 'Trolling covers vast water surfaces by pulling lures behind a slowly moving boat.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  }
];

async function seedDisciplines() {
  console.log('Seeding 9 complete Disciplines into public.wiki_articles...');

  for (const article of disciplineArticles) {
    // Delete existing with same title_tr first to ensure clean insert/update
    await supabase.from('wiki_articles').delete().eq('title_tr', article.title_tr);

    const { error } = await supabase.from('wiki_articles').insert([article]);
    if (error) {
      console.error(`Error inserting ${article.title_tr}:`, error.message);
    } else {
      console.log(`Successfully added discipline: ${article.title_tr}`);
    }
  }

  console.log('Finished seeding Disciplines!');
}

seedDisciplines();
