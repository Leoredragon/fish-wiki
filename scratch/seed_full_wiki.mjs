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

export const ALL_CURATED_ARTICLES = [
  // ==========================================
  // DISIPLINES (10 Adet)
  // ==========================================
  {
    category: 'disciplines',
    title_tr: 'Spinning (At-Çek) Balıkçılığı',
    title_en: 'Spin Fishing',
    short_desc_tr: 'Sahte maket balıklar, kaşıklar ve silikonlar ile dinamik, aktif kıyı avcılığı.',
    short_desc_en: 'Dynamic active shoreline angling using hard lures and spinners.',
    content_tr: `Spinning balıkçılığı; sert plastik maket balıklar, su üstü popperlar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp kamış hareketleriyle ritmik şekilde geri sarılması esasına dayanır.

EKİPMAN SEÇİMİ:
• Kamış: 2.40m - 2.70m uzunluğunda, 10-40g veya 7-28g atarlı, orta-hızlı (Medium-Fast) aksiyonlu kamışlar.
• Makine: 3000 - 4000 kafa boyutunda, 5.2:1 veya 6.2:1 devirli spin makineleri.
• Misina: 8 kat örgü PE 0.8 - PE 1.2 ip misina + 0.30mm - 0.35mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.

AV TAKTİKLERİ:
Sabahın ilk ışıklarında ve gün batımında (sabah suyu / akşam suyu) su üstü sahteleri (WTD aksiyonu) veya sığ dalar maketler maksimum verim sağlar. Bulanık ve dalgalı havalarda beyaz, limon veya pembe renkli sahteler tercih edilmelidir.`,
    content_en: 'Spinning relies on casting hard lures or spinners and retrieving them with action.',
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
• Kamış: 2.10m - 2.30m uzunluğunda, 0.5-7g veya 1-10g atarlı, hassas uçlu (Tubular veya Solid) LRF kamışları.
• Makine: 1000 - 2000 kafa sığ makaralı (Shallow Spool) LRF makineleri.
• Misina: PE 0.2 - PE 0.4 inceliğinde mikro ip misina + 0.16mm - 0.20mm Fluorocarbon lider.

HEDEF BALIKLAR:
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani, Kaya Balığı.

AV TAKTİKLERİ:
1g-3g jighead üzerine takılan kokulu silikonlar (Gulp, Isome vb.) dibe yakın mesafeden yavaşça zıplatılarak çekilir. Gece liman ışıkları etrafında batan mikro kaşıklar ve su üstü mikro sahteler istavrit avında mükemmel aksiyon sunar.`,
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Sazan Balıkçılığı (Carp Angling)',
    title_en: 'Carp Angling',
    short_desc_tr: 'Rod podlar, ısırma alarmları, boilie yemler ve özel rig montajları ile trofe sazan avı.',
    short_desc_en: 'Specialized carp fishing using rod pods, bite alarms, boilies, and hair rigs.',
    content_tr: `Sazan balıkçılığı; yüksek sabır, nokta yemlemesi ve özel takımlarla göllerde ve barajlarda yapılan dünyanın en popüler tatlı su trofe disiplinidir.

EKİPMAN SEÇİMİ:
• Kamış: 3.60m - 3.90m (12 - 13ft) uzunluğunda, 3.0 lb - 3.5 lb test eğrili (Test Curve) sazan kamışları.
• Makine: 8000 - 10000 kafa serbest makaralı (Baitrunner veya Quick Drag) sazan makineleri.
• Destek & Elektronik: Rod Pod sehpa, elektronik ısırma alarmı (Bite Alarm) ve ışıklı Swinger takımları.

YEM VE RİG SEÇİMİ:
Boilie (haşlanmış yem topu), Pop-up (yüzen boilie), Wafters, haşlanmış mısır ve kaplan fıstığı kullanılır. İğneye yem doğrudan takılmaz; Hair Rig (Kıl Rig), Ronnie Rig veya Chod Rig ile bağımsız dizilir.

AV TAKTİKLERİ:
Yemleme roketleri (Spomb) veya kumandalı yemleme botları ile mera önceden yemlenir. Sazan yemi vakumlayarak yuttuğunda iğne alt dudağa saplanır ve alarm çalar.`,
    content_en: 'Carp angling requires specialized tackle like Hair Rigs, boilies, rod pods, and bite alarms to target massive mirror and common carp.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta',
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
• Kamış: 2.70m - 3.00m uzunluğunda, 30-80g veya 40-100g atarlı sert güçlü Jig kamışları.
• Makine: 4000 - 6000 kafa boyutunda, yüksek devirli (HG/XG) güçlü dişli yapısına sahip makineler.
• Misina: PE 1.5 - PE 3.0 örgü ip + 0.45mm - 0.65mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Akya, Torik, Palamut, Kuzu (Greater Amberjack), Baracuda, Lagos, Sinarit.`,
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
• Kamış: 4.20m - 4.50m uzunluğunda, 100-200g veya 150-250g atarlı 3 parçalı veya sert teleskopik surf kamışları.
• Makine: 7000 - 10000 kafa geniş konik (Big Pit) sığ makaralı makineler.
• Misina: 0.16mm - 0.20mm Örgü İp + Konik Şok Lider (Shockleader) veya 0.30mm - 0.35mm Monofilament.

HEDEF BALIKLAR:
Çupra, Kalkan, Mırmır, Levrek, Eşkina ve Kurşun Arkası tekniği ile Çinekop / Lüfer / Palamut.`,
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // RIGS (Sazan & Deniz Rigleri)
  // ==========================================
  {
    category: 'rigs',
    title_tr: 'Hair Rig (Kıl Rig)',
    title_en: 'Hair Rig',
    short_desc_tr: 'Yemi iğneden bağımsız kıl misinaya dizerek balığın temkinsiz emmesini sağlayan temel sazan rigi.',
    short_desc_en: 'The classic carp rig that presents the bait on a hair independent of the hook.',
    content_tr: `Hair Rig (Kıl Rig), modern sazan balıkçılığının temelini oluşturan en devrimsel montajdır. Yem (boilie veya mısır) iğne üzerine takılmaz; iğne sapının uzantısı olan ince kıl misinaya yem stoperi ile dizilir.

ÇALIŞMA MANTIĞI:
Sazan dipteki yemi vakumlayarak ağzına çekerken iğnenin varlığını hissetmez. Yemi yuttuğu anda iğne boşta olduğu için balığın alt dudağına kendiliğinden batar (Self-Hooking).

KULLANIM ALANLARI:
Batan boilieler, haşlanmış mısır ve kaplan fıstığı ile tüm sazan avlarında kullanılır.`,
    content_en: 'Hair rig is the cornerstone of carp fishing presenting bait naturally next to the hook.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'rigs',
    title_tr: 'Ronnie Rig / Spinner Rig',
    title_en: 'Ronnie Rig / Spinner Rig',
    short_desc_tr: 'Pop-up yüzen yemler için 360 derece dönebilen fırdöndülü agresif sazan rigi.',
    short_desc_en: 'Pop-up carp rig providing 360 degree rotation for aggressive hook holds.',
    content_tr: `Ronnie Rig (Spinner Rig); pop-up (dibe batmayan yüzen) boilie yemler için günümüzün en çok tercih edilen agresif sazan montajıdır.

ÇALIŞMA MANTIĞI:
İğne gözüne takılan halkalı fırdöndü (Quick Change Swivel) sayesinde iğne 360 derece serbestçe dönebilir. Balık hangi açıdan yaklaşırsa yaklaşsın iğne ucu anında aşağı döner ve alt dudağı yakalar.

AVANTAJLARI:
• İğne değişimi birkaç saniye sürer.
• Yem dipteki otların ve tortuların 2-4 cm üstünde mükemmel askıda kalır.`,
    content_en: 'Ronnie rig offers 360 rotation around a swivel for pop-up baits.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'rigs',
    title_tr: 'Chod Rig',
    title_en: 'Chod Rig',
    short_desc_tr: 'Çamurlu ve otlu zeminlerde yemin gömülmeden otların üstünde durmasını sağlayan sert pop-up rigi.',
    short_desc_en: 'Sinker-independent rig for fishing muddy and weed-covered lake bottoms.',
    content_tr: `Chod Rig; çamurlu, yosunlu ve mil kaplı göl tabanlarında kurşun çamura gömülse bile yemin lider misina üzerinde kayarak otların üstünde tertemiz durmasını sağlayan sert fluorocarbon (Mouth Trap) rigidir.

ÖZELLİKLERİ:
• Sert kavisli fluorocarbon beden kullanılır.
• Kurşun ile rig arasındaki helikopter boncuk sistemi sayesinde yem serbestçe yükselir.`,
    content_en: 'Chod rig stays on top of heavy silt and weed beds.',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'İleri',
    is_active: true
  },

  // ==========================================
  // KNOTS (Balıkçılık Düğümleri)
  // ==========================================
  {
    category: 'knots',
    title_tr: 'FG Knot (İp + Fluorocarbon Lider Düğümü)',
    title_en: 'FG Knot',
    short_desc_tr: 'İp misina ile Fluorocarbon lider birleştirmede sıfır pürüzlü en güçlü düğüm.',
    short_desc_en: 'Slimmest and strongest knot for connecting braided mainline to fluorocarbon leader.',
    content_tr: `FG Knot; örgü ip misina ile kalın Fluorocarbon lideri birbirine eklemek için geliştirilmiş dünyadaki en güçlü ve en ince profilli düğümdür.

ÖZELLİKLERİ:
• Pürüzsüz yapısı sayesinde kamış fincanlarına ve porselenlerine hiç takılmadan geçer.
• Düğüm noktası esneme yapmaz ve %100 çeker gücünü korur.
• Spin, LRF ve Shore Jigging disiplinlerinin vazgeçilmez lider düğümüdür.

NASIL ATILIR:
İp misina lider üzerine çapraz sarmallar halinde (20-24 tur) örülür ve kilit yarım kazık düğümleriyle sabitlenir.`,
    content_en: 'FG knot binds braid around fluorocarbon with no bulky knot stack, letting it pass smoothly through rod guides.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'İleri',
    is_active: true
  },
  {
    category: 'knots',
    title_tr: 'Alberto Knot (Crazy Alberto Düğümü)',
    title_en: 'Alberto Knot',
    short_desc_tr: 'İp ile lider misinayı sahada çok hızlı ve pratik birleştiren yüksek dayanımlı düğüm.',
    short_desc_en: 'Fast and reliable line-to-line knot for joining braid to fluorocarbon.',
    content_tr: `Alberto Knot; rüzgarlı sahada veya gece avlarında FG Knot'a göre çok daha kısa sürede ve kolayca atılabilen güçlü bir lider düğümüdür.

NASIL ATILIR:
1. Fluorocarbon misinada bir kıvrım (halka) oluşturulur.
2. Örgü ip halkanın içinden geçirilip öne doğru 7 tur, geriye doğru 7 tur sarılarak kilitlenir.`,
    content_en: 'Alberto knot is a quick and extremely strong braid-to-leader connection.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'knots',
    title_tr: 'Knotless Knot (Düğümsüz Düğüm)',
    title_en: 'Knotless Knot',
    short_desc_tr: 'Sazan balıkçılığında Hair Rig hazırlamak için kanca sapına sarılan temel sazan düğümü.',
    short_desc_en: 'Essential carp fishing knot used to create hair rigs.',
    content_tr: `Knotless Knot (Düğümsüz Düğüm); sazan iğnelerine kılı uzatarak yemi bağlamak için kullanılan en pratik montaj düğümüdür.

NASIL ATILIR:
Misina iğne gözünden arkadan öne geçirilip yem boyu (kıl) ayarlanır. Ardından iğne sapı etrafına 7-8 tur sıkıca sarılıp tekrar gözden arkadan öne doğru çıkarılarak çekilir.`,
    content_en: 'Knotless knot ties the hook while leaving a hair loop for boilies.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'knots',
    title_tr: 'Palomar Knot (Palomar Düğümü)',
    title_en: 'Palomar Knot',
    short_desc_tr: 'Fırdöndü, klips ve iğnelere misina bağlamada %95+ çeker güçlü en güvenilir düğüm.',
    short_desc_en: 'Simplest and strongest knot for tying hooks, swivels, and snaps.',
    content_tr: `Palomar Knot; özellikle örgü ip misinalarda kayma yapmayan, %95 çeker mukavemeti koruyan en sağlam kanca ve klips bağlama düğümüdür.

NASIL ATILIR:
Misina ikiye katlanıp klips gözünden geçirilir. Basit bir düğüm atılıp oluşan halka klipsin üzerinden geçirilerek ıslatılır ve sıkılır.`,
    content_en: 'Palomar knot is widely considered the strongest knot for braided line.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },

  // ==========================================
  // LURES (Sahte Yemler)
  // ==========================================
  {
    category: 'lures',
    title_tr: 'Floating & Sinking Minnow (Maket Balıklar)',
    title_en: 'Minnow Lures',
    short_desc_tr: 'Yüzey ve orta suda yaralı balık aksiyonu veren gagalı maket sahteler.',
    short_desc_en: 'Hard plastic minnows with diving lip for midwater action.',
    content_tr: `Minnow maketler; gaga yapıları sayesinde suyun direncini kullanarak sağa-sola sallanma (wobbling) ve yalpalama (rolling) aksiyonu veren en yaygın sahtelerdir.

TÜRLERİ:
• Floating (Yüzen): Sarım durduğunda su yüzeyine doğru yükselir. Sığ sularda idealdir.
• Sinking (Batan): Sarım durduğunda dibe doğru süzülür. Derin su taramasında tercih edilir.
• Suspending (Askıda Kalan): Suyun içinde nötr özgül ağırlıkta durarak dur-kalk (Jerk) aksiyonunda vuruş alır.`,
    content_en: 'Minnow lures imitate small forage fish with wobbling lip actions.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lures',
    title_tr: 'Popper & WTD Stickbait (Su Üstü Sahteler)',
    title_en: 'Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve WTD zikzağı ile avcı balıkları uyaran gürültülü sahteler.',
    short_desc_en: 'Surface splashers and zigzagging walking baits for topwater strikes.',
    content_tr: `Su üstü sahteleri; su yüzeyinde kırılma ve ses çıkararak yırtıcı balıkların hücum refleksini tetikleyen en heyecanlı sahte türüdür.

ÇEŞİTLERİ:
• Popper: Oyuk ağzı sayesinde kamış darbeleriyle "pop-pop" sesi ve su fışkırtması çıkarır.
• WTD (Walk The Dog) Stickbait: Gagası yoktur; kamış ucunun ritmik sekmesiyle su üstünde zikzak çizer.`,
    content_en: 'Topwater lures walk and splash on the surface to trigger explosive strikes.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // TACKLES (Kamış & Makine Çeşitleri)
  // ==========================================
  {
    category: 'tackles',
    title_tr: 'Spin Makinesi (Spinning Reel)',
    title_en: 'Spinning Reel',
    short_desc_tr: 'At-çek balıkçılığı için ön kalamalı, yüksek torklu standart olta makinesi.',
    short_desc_en: 'Standard front drag reel used for lure casting and active angling.',
    content_tr: `Spin makineleri; hafiflikleri, yüksek sarım kalitesi ve hassas kalama (drag) mekanizmaları ile dünyada en çok kullanılan olta makinesi türüdür.

BOYUT SEÇİMİ:
• 1000 - 2000 Kafa: LRF ve Ultra-light avlar.
• 3000 - 4000 Kafa: Spin at-çek, tatlı su levreği ve lüfer avları.
• 5000 - 6000 Kafa: Shore Jigging ve ağır kıyı avları.`,
    content_en: 'Spinning reels offer versatile performance across all freshwater and saltwater casting applications.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'tackles',
    title_tr: 'Surfcast (Big Pit) Makine',
    title_en: 'Surf Big Pit Reel',
    short_desc_tr: 'Geniş konik makaralı, 100 metre üzeri uzağa atış ve Boğaz makinesi.',
    short_desc_en: 'Long cast shallow spool reel for heavy beach and current surfcasting.',
    content_tr: `Surf makineleri (Big Pit); sığ ve geniş açılı konik misina makarası sayesinde atış esnasında ipin sürtünmesizce boşalmasını ve 100-150m mesafelere ulaşmasını sağlar. 

ÖZELLİKLERİ:
• 7000 - 10000 kafa boyutundadır.
• Ağır kurşunları akıntıdan rahat çekmek için güçlü dişli oranlarına (4.1:1 - 4.6:1) sahiptir.`,
    content_en: 'Big Pit reels feature large tapered spools engineered for extreme distance casting.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  }
];

async function seedFullWiki() {
  console.log('Seeding curated articles into public.wiki_articles...');

  for (const article of ALL_CURATED_ARTICLES) {
    await supabase.from('wiki_articles').delete().eq('title_tr', article.title_tr);

    const { error } = await supabase.from('wiki_articles').insert([article]);
    if (error) {
      console.error(`Error inserting ${article.title_tr}:`, error.message);
    } else {
      console.log(`Inserted: ${article.title_tr}`);
    }
  }

  console.log('Done!');
}

seedFullWiki();
