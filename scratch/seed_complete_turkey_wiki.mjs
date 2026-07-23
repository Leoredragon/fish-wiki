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

export const COMPLETE_WIKI_ARTICLES = [
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
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.`,
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
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani.`,
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons with maximum sensitivity.',
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
• Kamış: 3.60m - 3.90m (12 - 13ft) uzunluğunda, 3.0 lb - 3.5 lb test eğrili sazan kamışları.
• Makine: 8000 - 10000 kafa serbest makaralı (Baitrunner veya Quick Drag) sazan makineleri.
• Yem ve Rig: Boilie, Pop-up, Wafters, haşlanmış mısır ve Hair Rig (Kıl Rig) takımları.`,
    content_en: 'Carp angling requires specialized tackle like Hair Rigs, boilies, rod pods, and bite alarms.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // TACKLES (KAMIŞ & MAKİNELER)
  // ==========================================
  {
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Spin Makinesi (Spinning Reel)',
    title_en: 'Spinning Reel',
    short_desc_tr: 'At-çek balıkçılığı için ön kalamalı, yüksek torklu standart olta makinesi.',
    short_desc_en: 'Standard front drag reel used for lure casting and active angling.',
    content_tr: `Spin makineleri; hafiflikleri, yüksek sarım kalitesi ve hassas kalama (drag) mekanizmaları ile dünyada en çok kullanılan olta makinesi türüdür.

BOYUT VE SEÇİM REHBERİ:
• 1000 - 2000 Kafa: LRF ve Ultra-light mikro yem avları için (180g - 210g hafiflik).
• 3000 - 4000 Kafa: Spin at-çek, deniz levreği, lüfer ve alabalık avları için ideal standart boy.
• 5000 - 6000 Kafa: Shore Jigging, tekne ve ağır kıyı avları için güçlü dişli modelleri.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Ninja LT, Shimano Catana FE, Okuma Ceymar, Savage Gear SG4, Fujin Venom.`,
    content_en: 'Spinning reels offer versatile performance across all freshwater and saltwater casting applications.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Surfcast (Big Pit) Makine',
    title_en: 'Surf Big Pit Reel',
    short_desc_tr: 'Geniş konik makaralı, 100 metre üzeri uzağa atış ve Boğaz makinesi.',
    short_desc_en: 'Long cast shallow spool reel for heavy beach and current surfcasting.',
    content_tr: `Surf makineleri (Big Pit); sığ ve geniş açılı konik misina makarası sayesinde atış esnasında ipin sürtünmesizce boşalmasını ve 100-150m mesafelere ulaşmasını sağlar.

ÖZELLİKLERİ:
• 7000 - 10000 kafa boyutundadır.
• Ağır kurşunları (150-220g) akıntıdan zorlanmadan çekmek için düşük dişli oranına (4.1:1 - 4.6:1) ve yüksek torka sahiptir.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Emcast Surf, Shimano Speedmaster 14000, Okuma Distance Surf, Ryobi Proskyer.`,
    content_en: 'Big Pit reels feature large tapered spools engineered for extreme distance casting.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Sazan Makinesi (Baitrunner / Serbest Makara)',
    title_en: 'Carp Baitrunner Reel',
    short_desc_tr: 'Çift kalamalı, balık asıldığında misinayı boşa salan ve kol çevrilince devreye giren göl makinesi.',
    short_desc_en: 'Dual drag free-spool reel designed specifically for static carp angling.',
    content_tr: `Sazan makineleri (Baitrunner); arkada bulunan ek bir kol yardımıyla balık yemi alıp kaçarken misinayı sıfır dirençle boşa salan özel çift kalama mekanizmasına sahiptir.

AVANTAJLARI:
Balık oltaya vurup kaçarken kamışı sehpadan suya çekemez. Kol bir tur çevrildiği anda arka serbest kalama devreden çıkar ve ön savaş kalaması anında kilitlenir.

TÜRKİYE'DE POPÜLER MODELLER:
Okuma Avenger ABF, Shimano Baitrunner ST/DL, Daiwa Black Widow BR.`,
    content_en: 'Baitrunner reels allow carp to take line freely until the angler turns the handle.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'Spin Kamışı (Spinning Rod)',
    title_en: 'Spinning Rod',
    short_desc_tr: '2.40m - 2.70m uzunluğunda, 7-35g / 10-40g atarlı esnek kıyı at-çek kamışı.',
    short_desc_en: 'Standard 2-piece lure casting rod for shoreline angling.',
    content_tr: `Spin kamışları; maket balık, kaşık ve silikon yemleri erimli fırlatmak ve yemlere kamış ucuyla aksiyon vermek için tasarlanmış 2 parçalı karbon kamışlardır.

ÖZELLİKLERİ:
• Boyut: Kıyıdan 2.40m - 2.70m, tekneden 2.10m - 2.40m.
• Atar Aralığı: 7-28g (Medium Light), 10-40g (Medium), 14-42g (Medium Heavy).
• Aksiyon: Hızlı (Fast) veya Orta-Hızlı (Medium-Fast) uç aksiyonu.

TÜRKİYE'DE POPÜLER MODELLER:
Savage Gear SG2 Shore Game, Daiwa Ninja Spin, Shimano Catana FX, Okuma Alaris, Fujin Dragon.`,
    content_en: 'Spinning rods are 2-piece carbon rods designed for casting and manipulating hard and soft lures.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'LRF Kamışı (Ultra Light Rod)',
    title_en: 'LRF Ultra Light Rod',
    short_desc_tr: '2.10m - 2.30m, 0.5-7g / 1-10g atarlı hassas uçlu ultra hafif LRF kamışı.',
    short_desc_en: 'Ultra light carbon rod with sensitive solid or tubular tip.',
    content_tr: `LRF kamışları; 1-3 gramlık mikro yemleri fırlatabilen ve kamış ucundaki en ufak balık tıkırtısını sapa ileten ultra hassas karbon kamışlardır.

UÇ YAPISI SEÇİMİ:
• Solid (Dolgu Uç): Esnek dolgu uçlu modeller silikon yemlerde vuruş hissini artırır, balık yemi emerken direnç hissetmez.
• Tubular (Boru Uç): İçi boş boru uçlu modeller mikro maket ve mikro kaşıklarda sert aksiyon vermeyi kolaylaştırır.

TÜRKİYE'DE POPÜLER MODELLER:
Savage Gear Micro Game, Fujin Boreas, Major Craft Solpara LRF, Daiwa Laguna LRF, Okuma Wave Off.`,
    content_en: 'LRF rods feature ultra sensitive tips designed for casting micro lures weighing under 10 grams.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'Surfcast Kamışı (Surfcasting Rod)',
    title_en: 'Surfcasting Rod',
    short_desc_tr: '4.20m - 4.50m, 100-200g / 150-250g atarlı güçlü 3 parçalı boğaz ve kumsal kamışı.',
    short_desc_en: 'Heavy duty beach and current casting surf rod.',
    content_tr: `Surfcast kamışları; dalgalı kumsal kıyılarda veya İstanbul Boğazı gibi sert akıntılı sularda 150-220 gramlık ağır kurşunları 100-150m mesafelere fırlatan 3 parçalı veya teleskopik sert kamışlardır.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Black Widow Surf, Okuma Trio Rex Surf, Kendo Surf, Trabucco Poetica, Lineaeffe Surf.`,
    content_en: 'Surfcasting rods cast heavy sinkers long distances into breaking surf and strong currents.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'Sazan Kamışı (Carp Rod)',
    title_en: 'Carp Rod',
    short_desc_tr: '3.60m - 3.90m (12-13ft), 3.0 - 3.5 lb test eğrili esnek güçlü göl kamışı.',
    short_desc_en: '12-13ft test curve carp fishing rod.',
    content_tr: `Sazan kamışları; 12ft (3.60m) veya 13ft (3.90m) boylarında, atar gramajı yerine test eğrisi (Test Curve: 3.0lb - 3.5lb) ile sınıflandırılan özel sazan kamışlarıdır. Parabolik esneme yapısı trofe sazanın sert kafa darbelerini absorbe eder.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Black Widow Carp, Okuma Custom Black Carp, Prologic C1 Alpha, Mitchell Avocet Carp.`,
    content_en: 'Carp rods feature parabolic action designed to absorb powerful runs of large carp.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // LINES (MİSİNALAR & LİDERLER)
  // ==========================================
  {
    category: 'lines',
    sub_category: 'braid',
    title_tr: '8 Kat Örgü PE İp Misina (8x Braided Line)',
    title_en: '8x Braided PE Line',
    short_desc_tr: 'Sıfır esneme, yüksek çeker gücü ve pürüzsüz yapısıyla maksimum atış erimi.',
    short_desc_en: 'Zero stretch, high tensile strength 8-strand braided line.',
    content_tr: `8 kat örgü ip misinalar; 8 adet mikro PE fiber ipliğin yuvarlak ve pürüzsüz şekilde örülmesiyle üretilir.

AVANTAJLARI:
• Esneme yapmaz (%0 esneme): En hafif tıkırtıyı kamışa iletir.
• İnce Çap / Yüksek Çeker: Rüzgar ve su direncini düşürür, sahtenin çok daha uzak mesafeye fırlatılmasını sağlar.

TÜRKİYE'DE POPÜLER MARKLAR:
Daiwa J-Braid 8x, Shimano Kairiki 8, Major Craft Dangan Braid 8x, Kendo Dynasty 8x, Sufix 832.`,
    content_en: '8-strand braided line delivers ultra-smooth casting performance and extreme sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lines',
    sub_category: 'fluorocarbon',
    title_tr: 'Fluorocarbon (FC) Lider Misina',
    title_en: 'Fluorocarbon Leader',
    short_desc_tr: 'Su altında %99 görünmezlik, yüksek düğüm tutuşu ve kayalara karşı sürtünme direnci.',
    short_desc_en: 'Near 100% invisible underwater with high abrasion resistance.',
    content_tr: `Fluorocarbon misinalar; kırılma indisi suyunkine çok yakın olduğu için su altında balıklar tarafından fark edilemez.

AVANTAJLARI:
• İp misinanın ucuna 50 cm - 1.5 metre lider olarak bağlanır.
• Keskin kayalara, midyelere ve balık dişlerine karşı ip misinaya göre çok daha dayanıklıdır.

TÜRKİYE'DE POPÜLER MARKLAR:
Seaguar Neox / FXR, Savage Gear Regenerator FC, Kendo FC Leader, Daiwa J-Thread FC, Shimano Ocea Leader.`,
    content_en: 'Fluorocarbon line provides invisible presentation and abrasion resistance.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lines',
    sub_category: 'monofilament',
    title_tr: 'Monofilament (Naylon) Misina',
    title_en: 'Monofilament Line',
    short_desc_tr: 'Şok emici esnek yapı, yüksek düğüm mukavemeti ve ekonomik klasik misina.',
    short_desc_en: 'Shock absorbing flexible monofilament fishing line.',
    content_tr: `Monofilament misinalar; tek parça naylon hammaddeden üretilen esnek ve ekonomik klasik misinalardır.

AVANTAJLARI:
• %15-%25 oranında esneme yapar. Balığın ani kafa darbelerinde şok emici görevi görerek takımın kopmasını engeller.
• Şamandıralı avlarda ve yemli dip takımlarında en güvenilir seçenektir.

TÜRKİYE'DE POPÜLER MARKLAR:
Trabucco T-Force, Daiwa Hyper Sensor, Caperlan 4x4, Sufix XL Strong.`,
    content_en: 'Monofilament line stretches under load to absorb sudden shocks during fish fights.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lines',
    sub_category: 'leader',
    title_tr: 'Konik Şok Lider (Tapered Surf Leader)',
    title_en: 'Tapered Surf Leader',
    short_desc_tr: 'Surfcasting atışlarında 150-220g ağır kurşun atarken kopmayı önleyen konik lider.',
    short_desc_en: 'Tapered leader designed for heavy surfcasting distance throws.',
    content_tr: `Konik şok lider; surfcasting disiplininde 0.18mm gibi ince ana beden misinasının ucuna eklenen, 15 metrelik boyunda 0.20mm'den başlayıp 0.57mm kalınlığa doğru kademeli genişleyen özel surf lideridir.

AVANTAJLARI:
İnce düğüm noktası sayesinde surf makineden kamış fincanlarına takılmadan akar, atış anındaki 200 gramlık patlama yükünü kalın uç göğüsler.

TÜRKİYE'DE POPÜLER MARKLAR:
Trabucco T-Force XPS Tapered Leader, Daiwa Tournament Tapered Leader, Yuki Tapered Leader.`,
    content_en: 'Tapered leaders feature a smooth gradient diameter to withstand heavy casting forces.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // LURES (SAHTE YEMLER)
  // ==========================================
  {
    category: 'lures',
    sub_category: 'minnow',
    title_tr: 'Floating & Sinking Minnow (Maket Balıklar)',
    title_en: 'Minnow Lures',
    short_desc_tr: 'Yüzey ve orta suda yaralı balık aksiyonu veren gagalı maket sahteler.',
    short_desc_en: 'Hard plastic minnows with diving lip for midwater action.',
    content_tr: `Minnow sahteler; önlerindeki gaga yapısı sayesinde sarım esnasında suyun direncini kullanarak yaralı balık gibi sallanma (wobbling) ve yalpalama (rolling) aksiyonu veren klasik sahtelerdir.

AKSİYON TÜRLERİ:
• Floating (Yüzen - F): Sarım durduğunda su yüzeyine doğru yükselir. Sığ sularda idealdir.
• Sinking (Batan - S): Sarım durduğunda dibe doğru süzülür. Derin su taramasında kullanılır.
• Suspending (Askıda Kalan - SP): Dur-kalk (Jerk) sarımında suda asılı kalarak vuruş alır.

TÜRKİYE'DE POPÜLER MODEL VE MARKLAR:
Kendo Seabass Minnow 125F, Duo Tide Minnow Slim, Shimano Silent Assassin 120F, Savage Gear Sandeel Jerk, Fujin Venum.`,
    content_en: 'Minnow lures feature diving lips that generate lifelike swimming actions when retrieved.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lures',
    sub_category: 'surface',
    title_tr: 'Popper & WTD Stickbait (Su Üstü Sahteler)',
    title_en: 'Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve WTD zikzağı ile avcı balıkları uyaran sahteler.',
    short_desc_en: 'Topwater splashers and zigzagging walking baits for explosive surface strikes.',
    content_tr: `Su üstü sahteleri; su yüzeyinde kırılma, gürültü ve köpük çıkararak yırtıcı balıkların hücum refleksini tetikleyen en heyecanlı sahte türüdür.

ÇEŞİTLERİ:
• Popper: Oyuk ağzı sayesinde kamış darbeleriyle "pop-pop" sesi fışkırtır.
• WTD (Walk The Dog) Stickbait: Gagası yoktur; kamış ucunun ritmik sekmesiyle su üstünde zikzak çizer.

TÜRKİYE'DE POPÜLER MODELLER:
Strike Pro Buster Jerk, Fujin Ziggy 90, Savage Gear Pop Walker, Kendo Seabass Popper, Megabass Dog-X.`,
    content_en: 'Topwater lures splash and walk on the surface triggering aggressive predator strikes.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lures',
    sub_category: 'silicone',
    title_tr: 'Silikon Yemler & Jighead (Shad, Worm, Craw)',
    title_en: 'Soft Plastics & Jigheads',
    short_desc_tr: 'Balık, solucan ve karides silikonlarının kurşun kafalı iğneli modelleri.',
    short_desc_en: 'Soft plastic shad, worm, and craw lures with lead jigheads.',
    content_tr: `Yumuşak silikon yemler; su içerisindeki yüksek esneklikleri, titreyen kürek kuyrukları (paddle tail) ve cezbedici koku özleri ile avcılığı kanıtlanmış sahtelerdir.

KULLANIM ALANLARI:
LRF'de kokulu solucan silikonlar (Berkley Gulp, Fujin Yummy); Spin ve Shore Jigging'de kürek kuyruklu shad silikonlar (Savage Gear Cannibal, Savage Gear Craft Shad) jighead üzerine takılarak kullanılır.`,
    content_en: 'Soft plastics provide natural texture and movement enticing sluggish predators.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lures',
    sub_category: 'spoon',
    title_tr: 'Metal Kaşıklar & Shore Jigler',
    title_en: 'Metal Spoons & Shore Jigs',
    short_desc_tr: 'Uzak atış parıltılı kaşıklar ve asist iğneli metal jig sahteleri.',
    short_desc_en: 'Long casting metal spoons and assist hook jigs.',
    content_tr: `Ağır yapıları ve aerodynamic aerodinamik şekilleri sayesinde sert rüzgarda dahi 80-100 metre mesafeye ulaşabilen parıltılı metal sahtelerdir.

TÜRKİYE'DE POPÜLER MODELLER:
Hansen Pilgrim Kaşık, Kendo Seabass Spoon, Savage Gear Psycho Sprat Jig, Major Craft Jigpara Slim, Hansen Flash.`,
    content_en: 'Metal spoons and jigs sink fast and reflect light underwater for pelagic species.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lures',
    sub_category: 'egi',
    title_tr: 'EGI Kalamar & Sübye Zokaları',
    title_en: 'EGI Squid Lures',
    short_desc_tr: 'Kumaş kaplı, şemsiye tırnaklı gece kalamar ve sübye zokaları.',
    short_desc_en: 'Cloth-wrapped EGI lures with double crown hooks for squid.',
    content_tr: `EGI zokaları; kumaş kaplı gerçekçi karides ve balık gövdeleri ile gece ışıklı mendirek ve limanlarda süzülerek kalamar ve sübyeleri avlayan özel zokalardır.

TÜRKİYE'DE POPÜLER MODELLER:
Yamashita Egi Oh K, Yo-Zuri Aurie-Q, Kendo Egi Sahte, Savage Gear 3D Swim Squid.`,
    content_en: 'EGI squid lures mimic shrimp to target squid and cuttlefish during night fishing.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lures',
    sub_category: 'vibration',
    title_tr: 'Metal Vibrasyon & Blade Vibe',
    title_en: 'Metal Vibration Blade Lures',
    short_desc_tr: 'Yüksek frekansta titreyerek lüfer, çinekop ve tatlı su levreğini cezbeden metal sahteler.',
    short_desc_en: 'High frequency vibrating metal blade lures.',
    content_tr: `Metal vibrasyon sahteleri; hızlı sarım esnasında su altında yüksek frekanslı titreşimler yayarak balıkların yanal çizgi organlarını uyarır ve vuruş refleksini tetikler.

TÜRKİYE'DE POPÜLER MODELLER:
Fujin Vibe 18g/24g, Savage Gear Fat Vib, Kendo Vib 70, Strike Pro Cyber Vibe.`,
    content_en: 'Vibration blade lures generate tight high frequency vibrations during retrieval.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // RIGS (SAZAN & DENİZ RİGLERİ)
  // ==========================================
  {
    category: 'rigs',
    sub_category: 'carp_rig',
    title_tr: 'Hair Rig (Kıl Rig)',
    title_en: 'Hair Rig',
    short_desc_tr: 'Yemi iğneden bağımsız kıl misinaya dizerek balığın emmesini sağlayan temel sazan rigi.',
    short_desc_en: 'Classic carp hair rig presentation.',
    content_tr: `Hair Rig; yemin iğneye doğrudan takılmak yerine iğne altındaki kıl misinaya dizilerek balığın temkinsiz emmesini sağlayan temel sazan montajıdır.`,
    content_en: 'Classic hair rig.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'rigs',
    sub_category: 'carp_rig',
    title_tr: 'Ronnie Rig / Spinner Rig',
    title_en: 'Ronnie Rig',
    short_desc_tr: 'Pop-up yüzen yemlerde 360 derece dönebilen en popüler agresif sazan rigi.',
    short_desc_en: '360 degree rotating pop-up rig.',
    content_tr: `Ronnie Rig; pop-up yemlerin dipteki otlardan 2-4 cm yukarıda askıda durmasını sağlayan ve iğneye 360 derece serbest dönüş vererek harika kanca tutuşu sunan rigdir.`,
    content_en: 'Pop-up spinner rig.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta',
    is_active: true
  },

  // ==========================================
  // KNOTS (BALIKÇILIK DÜĞÜMLERİ)
  // ==========================================
  {
    category: 'knots',
    sub_category: 'line_join',
    title_tr: 'FG Knot (İp + Lider Düğümü)',
    title_en: 'FG Knot',
    short_desc_tr: 'İp misina ile Fluorocarbon lider birleştirmede sıfır pürüzlü en güçlü düğüm.',
    short_desc_en: 'Slimmest braid to leader knot.',
    content_tr: `FG Knot; ip misinanın lider etrafına örülmesiyle atılan, porselen fincanlardan takılmadan geçen rakipsiz düğümdür.`,
    content_en: 'FG knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'İleri',
    is_active: true
  },
  {
    category: 'knots',
    sub_category: 'line_join',
    title_tr: 'Alberto Knot (Crazy Alberto)',
    title_en: 'Alberto Knot',
    short_desc_tr: 'İp ile lider misinayı sahada çok hızlı ve pratik birleştiren düğüm.',
    short_desc_en: 'Fast braid to leader knot.',
    content_tr: `Alberto Knot; rüzgarlı havalarda ve geceleri hızlıca atılabilen yüksek çekergüçlü lider düğümüdür.`,
    content_en: 'Alberto knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'knots',
    sub_category: 'terminal',
    title_tr: 'Palomar Knot',
    title_en: 'Palomar Knot',
    short_desc_tr: 'Klips, fırdöndü ve iğnelere misina bağlamada %95+ çeker güçlü en güvenilir düğüm.',
    short_desc_en: 'Strongest knot for terminal tackle.',
    content_tr: `Palomar Knot; ip ve misinaların klipse ve fırdöndüye kaymadan baglanmasını sağlayan en sağlam düğümdür.`,
    content_en: 'Palomar knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  }
];

async function seedCompleteTurkeyWiki() {
  console.log('Seeding complete Turkey wiki articles into public.wiki_articles...');

  for (const article of COMPLETE_WIKI_ARTICLES) {
    await supabase.from('wiki_articles').delete().eq('title_tr', article.title_tr);
    const { error } = await supabase.from('wiki_articles').insert([article]);
    if (error) {
      console.error(`Error inserting ${article.title_tr}:`, error.message);
    } else {
      console.log(`Inserted: ${article.title_tr}`);
    }
  }

  console.log('Finished seeding complete Turkey wiki!');
}

seedCompleteTurkeyWiki();
