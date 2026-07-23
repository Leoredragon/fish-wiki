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

const initialArticles = [
  {
    category: 'disciplines',
    title_tr: 'Spinning (At-Çek) Balıkçılığı',
    title_en: 'Spin Fishing',
    short_desc_tr: 'Sahte maket balıklar ve kaşıklar ile dinamik, aktif avlanma disiplini.',
    short_desc_en: 'Dynamic active angling technique using hard lures and spinners.',
    content_tr: 'Spinning balıkçılığı, maket balıklar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp belirli bir aksiyonla geri sarılması esasına dayanır. Çinekop, lüfer, levrek, palamut ve akya gibi yırtıcı balıkların avında en popüler ve heyecan verici yöntemdir. Akşamüstü ve sabah suyunda su üstü popperlar veya batan (sinking) maket balıklar ile harika sonuçlar verir.',
    content_en: 'Spinning relies on casting hard lures or spinners and retrieving them with action. It is the most popular technique for predators like seabass, bluefish, and leerfish.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'LRF (Light Rock Fishing)',
    title_en: 'Light Rock Fishing (LRF)',
    short_desc_tr: 'Ultra hafif kamış ve mikro yemlerle kıyı kayalıklarında ince işçilik.',
    short_desc_en: 'Ultra-light tackle angling using micro lures around coastal rocks.',
    content_tr: 'Japonya menşeili LRF (Light Rock Fishing) tekniği, 0.5-10 gram atarlı ultra hassas kamışlar, küçük ip misinalar ve 2-5 cm arası mikro silikonlar ile uygulanır. İstavrit, mırmır, karagöz, eşkina, tatlı su levreği gibi balıkları hedef alır. Vuruş hissiyatı kamış ucundaki hassasiyet sayesinde muazzamdır.',
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'disciplines',
    title_tr: 'Surfcasting (Kıyı Dip & İleri Atış)',
    title_en: 'Surfcasting',
    short_desc_tr: 'Dalgalı kumluk sahillere 100-200 gramlık ağır kurşunlarla uzağa atış.',
    short_desc_en: 'Long-distance casting with heavy sinkers (100-200g) on sandy beaches.',
    content_tr: '4.20m - 4.50m boyundaki güçlü surf kamışları ve geniş makaralı makineler ile 100 metre üzerindeki mesafelere atış yapılır. Çupra, mırmır, kalkan, levrek ve çinekop için yengeç, boru kurdu veya balık fleto takımları kullanılır.',
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters out into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lines',
    title_tr: 'Örgü İp Misina (PE Braid)',
    title_en: 'Braid Line (PE)',
    short_desc_tr: 'Sıfır esneme, yüksek çeker gücü ve maksimum atış erimi.',
    short_desc_en: 'Zero stretch, extreme tensile strength, and long casting distance.',
    content_tr: 'Çoklu mikro fiber ipliklerin örülmesiyle üretilen PE ip misinalar, esneme yapmadığı için en ufak balık tıkırtısını bile kamışa iletir. İnce yapısı rüzgar direncini düşürür ve sahtenin uzağa erimini sağlar. Spin ve LRF disiplinlerinin vazgeçilmezidir.',
    content_en: 'PE braided lines feature zero stretch for maximum sensitivity and thin diameter for long-range casting.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'lines',
    title_tr: 'Fluorocarbon (FC) Lider Lider Misina',
    title_en: 'Fluorocarbon Leader',
    short_desc_tr: 'Su altında kırılma indisi sayesinde %99 görünmezlik ve sürtünme direnci.',
    short_desc_en: 'Near 100% invisible underwater with high abrasion resistance.',
    content_tr: 'Işığı su ile neredeyse aynı açıda kıran Fluorocarbon misinalar, suda balıklar tarafından fark edilemez. Ayrıca keskin kayalara, midyelere ve balık dişlerine karşı örgü ipe göre çok daha dayanıklıdır. İp misinanın ucuna 50cm-1m şok lider düğümü (FG Knot veya Albright) ile bağlanır.',
    content_en: 'Fluorocarbon leaders provide stealth and abrasion resistance when tied to the end of braided mainlines.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lures',
    title_tr: 'Popper & Su Üstü Sahteler (WTD)',
    title_en: 'Poppers & Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve "Walk the Dog" zikzağı ile yırtıcıları çeken sahteler.',
    short_desc_en: 'Surface lures creating splashing and WTD zigzag action to trigger strikes.',
    content_tr: 'Ağzı oyuk popper sahteler kamış darbeleriyle su yüzeyinde ses ve köpük çıkarır. WTD (Walk the Dog) sahteleri ise ritmik kamış vuruşlarıyla sağa-sola zikzak çizerek yaralı balık taklidi yapar. Akya, lüfer ve levrek avında en gürültülü aksiyon veren sahtelerdir.',
    content_en: 'Poppers pop and splash while WTD lures walk side-to-side on the surface, driving topwater predators crazy.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'lures',
    title_tr: 'EGI Kalamar & Sübye Zokası',
    title_en: 'EGI Squid Lures',
    short_desc_tr: 'Kumaş kaplı, iğnesiz şemsiye tırnaklı kalamar ve sübye sahtesi.',
    short_desc_en: 'Cloth-wrapped lures with crown hooks designed specifically for cephalopods.',
    content_tr: 'Japonların geleneksel EGI zokaları, karides veya küçük balık formunda tasarlanmıştır. Gece ışıklı limanlarda veya kayalıklarda dibe doğru süzülürken ritmik zıplatma aksiyonu ile kalamar ve sübyeleri cezbeder.',
    content_en: 'EGI lures mimic shrimp or small baitfish to catch squid and cuttlefish during night angling sessions.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Başlangıç',
    is_active: true
  },
  {
    category: 'rigs',
    title_tr: 'Texas & Carolina Rig Montajı',
    title_en: 'Texas & Carolina Rig',
    short_desc_tr: 'Takılmayan ofset iğne ve kurşun takımı ile otluk/kayalık dip avı.',
    short_desc_en: 'Weedless offset hook rig for fishing dense cover and rocky bottoms.',
    content_tr: 'Kurşunun silikon yem önünde serbest hareket ettiği bu montajda, iğne ucu silikonun sırtına saklanır. Otlara ve taş aralarına takılmadan dibi taramaya imkan verir. Tatlı suda turna ve levrek, tuzlu suda levrek ve eşkina avında benzersizdir.',
    content_en: 'Texas rig hides the offset hook point inside the soft plastic, preventing snags in heavy cover.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta',
    is_active: true
  },
  {
    category: 'rigs',
    title_tr: 'Drop Shot Rig Montajı',
    title_en: 'Drop Shot Rig',
    short_desc_tr: 'Kurşun en altta, silikon yem 20-40cm yukarıda askıda titreşim aksiyonu.',
    short_desc_en: 'Sinker at the bottom with suspended soft lure above for subtle finesse action.',
    content_tr: 'Kurşunun en dipte sabit kaldığı ve yemin dip üstünde süzüldüğü hassas finess montajıdır. Yavaş ve isteksiz balıkları kandırmak için kamış ucuyla yerinde titreşim verilir.',
    content_en: 'Drop shotting keeps the bait suspended off the bottom, ideal for targeting sluggish fish in cold waters.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç',
    is_active: true
  }
];

async function seedWiki() {
  console.log('Seeding wiki_articles table...');

  for (const article of initialArticles) {
    const { error } = await supabase.from('wiki_articles').insert([article]);
    if (error) {
      console.error(`Error inserting ${article.title_tr}:`, error.message);
    } else {
      console.log(`Inserted article: ${article.title_tr}`);
    }
  }

  console.log('Finished seeding Wiki Articles!');
}

seedWiki();
