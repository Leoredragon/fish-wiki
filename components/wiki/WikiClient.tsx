/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Layers,
  Sparkles,
  Waves,
  ShieldAlert,
  X,
  Compass,
  Zap,
  Info,
  ChevronRight,
  Anchor
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const INITIAL_WIKI_ARTICLES = [
  {
    id: '1',
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
    difficulty_level: 'Orta'
  },
  {
    id: '2',
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
    difficulty_level: 'Başlangıç'
  },
  {
    id: '3',
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
Akya, Torik, Palamut, Kuzu (Greater Amberjack), Baracuda, Lagos, Sinarit.

AV TAKTİKLERİ:
Metal jig dibe değdikten sonra ritmik olarak kamış yukarı fırlatılıp hızlıca sarılır. Jig dibe düşerken süzülme anında vuruşlar çok yoğundur.`,
    content_en: 'Shore jigging involves casting heavy metal lures from coastal rocks to target pelagic predators.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'İleri'
  },
  {
    id: '4',
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
Çupra, Kalkan, Mırmır, Levrek, Eşkina ve Kurşun Arkası tekniği ile Çinekop / Lüfer / Palamut.

AV TAKTİKLERİ:
Yem olarak boru kurdu, sülünes, canlı yengeç, madya ve taze hamsi/istavrit fletos tercih edilir. Kurşun arkası yapılıyorsa 150-200g kurşun arkasına 3-7cm maket balık bağlanarak Boğaz akıntısında uzak mesafeler taranır.`,
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },
  {
    id: '5',
    category: 'disciplines',
    title_tr: 'Tekneden Slow Jigging & Vertical Jigging',
    title_en: 'Slow Pitch Jigging',
    short_desc_tr: 'Tekneden derin deniz kanyonlarına dikey zıplatma sahteleri ile trofe avcılığı.',
    short_desc_en: 'Vertical boat angling using weighted jigs in deep sea structures.',
    content_tr: `Slow ve Vertical Jigging; açık denizde 30 metreden 150 metreye kadar olan derin taşlarda ve kanyonlarda tekneden dikine yapılan trofe avcılığı yöntemidir.

EKİPMAN SEÇİMİ:
• Kamış: 1.80m - 2.10m hassas esneme yapısına sahip tetikli (Baitcast) veya Jig kamışları.
• Makine: Güçlü çıkrık/baitcasting makinesi veya 5000-8000 boyutunda yüksek torklu spin makinesi.
• Misina: PE 2.0 - PE 4.0 örgü ip + 0.50mm - 0.70mm Fluorocarbon lider.

HEDEF BALIKLAR:
Lagos, Grida, Akya, Sinarit, Trança, Orfoz, Fangri Mercan.

AV TAKTİKLERİ:
80g ile 250g arasındaki yaprak (Slow Pitch) jigler dibe indirildikten sonra yarım tur sarım ve kamış ucu sektirmeleri ile geniş yaprak süzülmeleri yaptırılır.`,
    content_en: 'Slow pitch jigging lures sink and flutter in deep water to entice large bottom dwellers like groupers and dentex.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'İleri'
  },
  {
    id: '6',
    category: 'disciplines',
    title_tr: 'Fly Fishing (Sinek Oltacılığı)',
    title_en: 'Fly Fishing',
    short_desc_tr: 'Özel ağırlıklı misina ve el yapımı böcek/sinek sahteleri ile zarif akarsu avı.',
    short_desc_en: 'Elegant stream angling using weighted fly lines and handcrafted flies.',
    content_tr: `Fly Fishing; ağırlığı yem yerine misinada olan, el yapımı tüy ve ipliklerden üretilmiş böcek sahtelerinin akarsu yüzeyine zarifçe kondurulması sanatıdır.

EKİPMAN SEÇİMİ:
• Kamış: 2.40m - 2.70m uzunluğunda, #3 ile #6 numara arası Fly kamışları.
• Makine: Özel geniş hazneli Fly makinesi (Fly Reel).
• Misina: Yüzen (WF-Floating) ağır Fly misinası + Şeffaf incelen konik lider (Leader) + Tippet.

HEDEF BALIKLAR:
Kırmızı Benekli Alabalık, Abant Alası, Dere Alabalığı, Tatlı Su Kefali (Kasna).

AV TAKTİKLERİ:
Suların durgunlaştığı havuzcuklarda yüzeyde yüzen kuru sinekler (Dry Fly) veya dipte süzülen nimfler (Nymph) akıntıya bırakılır.`,
    content_en: 'Fly fishing relies on casting lightweight artificial flies using weighted fly lines in clear streams.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'İleri'
  },
  {
    id: '7',
    category: 'disciplines',
    title_tr: 'Yemli Dip Balıkçılığı (Kıyı & Tekne)',
    title_en: 'Bottom Bait Fishing',
    short_desc_tr: 'Doğal yemler, ağır kurşunlar ve köstekli takımlarla klasik dip balıkçılığı.',
    short_desc_en: 'Classic bottom fishing with natural baits and multi-hook rigs.',
    content_tr: `Yemli dip balıkçılığı; deniz ve tatlı su dip canlılarını taklit eden doğal yemlerin (boru kurdu, sülünes, yengeç, mısır, hamur vb.) kurşunlu takımlarla dibe yatırılmasıdır.

EKİPMAN SEÇİMİ:
• Kamış: 2.70m - 3.60m 50-150g atarlı esnek uçlu dip kamışları.
• Makine: 4000 - 6000 kafa kalamalı veya arkadan serbest makaralı (Baitrunner) makineler.
• Takım: 2'li veya 3'lü klasik beden köstek takımları, Gezer kurşunlu tek iğneli mantarlı takımlar.

HEDEF BALIKLAR:
Sazan, Yayın, Eşkina, Karagöz, Çupra, Mırmır, Mercan.

AV TAKTİKLERİ:
Akşam ve gece saatlerinde kıyı kayalıklarında boru kurdu ve mamun ile Eşkina ve Karagöz; kumluk sahil kırmalıklarında ise Çupra ve Mırmır avı için en güvenilir av disiplinidir.`,
    content_en: 'Traditional bottom fishing targeting bottom dwellers with natural baits.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '8',
    category: 'disciplines',
    title_tr: 'Şamandıralı (Bolognese & Göl) Balıkçılık',
    title_en: 'Float / Match Fishing',
    short_desc_tr: 'Hassas şamandıralar ve ince misinalarla su kolonundaki balıkları avlama.',
    short_desc_en: 'Precision angling using delicate floats to target mid-water species.',
    content_tr: `Şamandıralı balıkçılık; suyun üstünde yüzen şamandıranın batma veya sallanma hareketini takip ederek yemi belirli bir derinlikte sabit tutma yöntemidir.

EKİPMAN SEÇİMİ:
• Kamış: 4.00m - 7.00m uzunluğunda Bolognese kamışlar veya makineli esnek göl kamışları.
• Makine: 2000 - 3000 hafif spin veya kibar göl makineleri.
• Takım: Hassas stoperli gezer şamandıra, kıstırma kurşunlar ve ince beden (0.12mm - 0.18mm).

HEDEF BALIKLAR:
Kefal, Kızılkanat, Kadife, Karagöz, İstavrit, Tatlı Su Kefali.

AV TAKTİKLERİ:
Ekmek içi, solucan veya hamur kullanılan avlarda şamandıranın en ufak batma anında seri ve yumuşak tasma vurulmalıdır.`,
    content_en: 'Float fishing provides visual excitement watching the float plunge underwater upon a strike.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '9',
    category: 'disciplines',
    title_tr: 'Trolling (Sırtı Çekme / Tekne Arkası)',
    title_en: 'Trolling',
    short_desc_tr: 'Hareket halindeki teknenin arkasından sahte veya canlı yem sürütme tekniği.',
    short_desc_en: 'Boat trolling with hard lures or live bait behind a moving vessel.',
    content_tr: `Sırtı çekme (Trolling); teknenin 2 ile 5 mil arasındaki sabit hızında su üstünden veya daldırıcı aparatlar (daldırma tahtası, downrigger) ile derinden yem çekilmesi yöntemidir.

EKİPMAN SEÇİMİ:
• Kamış: 1.60m - 2.10m 20-50 lb sınıfı Trolling / Çıkrık kamışları.
• Makine: Kol kontrollü (Lever Drag) güçlü çıkrık makineleri.
• Yemler: Derin dalan uzun gaga maket balıklar, tüy silikonlar, canlı Zargana veya Kalamar.

HEDEF BALIKLAR:
Palamut, Torik, Akya, Baracuda, Kuzu, Orkinos, Kılıç Balığı.

AV TAKTİKLERİ:
Sonbahar palamut akınında yüzeyden 10-15 cm maket balıklar veya silikon çapariler çekilirken, Akya ve Kuzu avında canlı Zargana ile dibe yakın sırtı çekilir.`,
    content_en: 'Trolling covers vast water surfaces by pulling lures behind a slowly moving boat.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  }
];

export default function WikiClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [articles, setArticles] = useState<any[]>(INITIAL_WIKI_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWaterType, setSelectedWaterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('wiki_articles')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setArticles(data);
        }
      } catch {
        // use fallback initial articles
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const categories = [
    { id: 'all', label_tr: 'Tüm Rehberler', label_en: 'All Guides' },
    { id: 'disciplines', label_tr: 'Stiller & Disiplinler', label_en: 'Angling Styles' },
    { id: 'tackles', label_tr: 'Kamış & Makine', label_en: 'Rods & Reels' },
    { id: 'lines', label_tr: 'Misinalar & Liderler', label_en: 'Fishing Lines' },
    { id: 'lures', label_tr: 'Sahte Yemler', label_en: 'Lures & Baits' },
    { id: 'rigs', label_tr: 'Rig & Takımlar', label_en: 'Rigs & Assemblies' },
    { id: 'accessories', label_tr: 'Aksesuarlar', label_en: 'Accessories' }
  ];

  const filteredArticles = articles.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesWater = selectedWaterType === 'all' || item.water_type === 'Tüm Sular' || item.water_type === selectedWaterType;
    const matchesSearch =
      (item.title_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.short_desc_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content_tr || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesWater && matchesSearch;
  });

  const getCategoryLabel = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return isTr ? found?.label_tr : found?.label_en;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <BookOpen className="w-4 h-4" />
            <span>{isTr ? 'Oltapp Balıkçılık Akademisi' : 'Oltapp Angling Academy'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {isTr ? 'Balıkçılık Wiki & Ekipman Rehberi' : 'Angling Wiki & Equipment Guide'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {isTr
              ? 'Balıkçılık stilleri, makine/kamış seçimleri, dügüm teknikleri, sahte yem aksiyonları ve rig montajlarına dair aradığınız tüm profesyonel bilgiler.'
              : 'Complete expert guide on fishing styles, tackle choices, lure actions, and rig assemblies.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Wiki rehberlerinde ara (Örn: LRF, Texas Rig, Fluorocarbon...)' : 'Search wiki guides...'}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Water Type Filter Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setSelectedWaterType('all')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'all' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tüm Sular' : 'All Waters'}
            </button>
            <button
              onClick={() => setSelectedWaterType('Tuzlu Su')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'Tuzlu Su' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tuzlu Su' : 'Saltwater'}
            </button>
            <button
              onClick={() => setSelectedWaterType('Tatlı Su')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'Tatlı Su' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tatlı Su' : 'Freshwater'}
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isTr ? cat.label_tr : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base">{isTr ? 'Aramanıza uygun rehber içeriği bulunamadı.' : 'No wiki articles found.'}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWaterType('all');
              setSearchQuery('');
            }}
            className="text-xs font-extrabold text-emerald-600 hover:underline"
          >
            {isTr ? 'Filtreleri Temizle' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveArticle(article)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cover Image & Badges */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title_tr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <BookOpen className="w-10 h-10 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-[#0F172A]/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm">
                      {article.water_type || 'Tüm Sular'}
                    </span>
                  </div>

                  {article.difficulty_level && (
                    <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm">
                      {article.difficulty_level}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="px-6 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 className="font-extrabold text-[#0F172A] text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {isTr ? article.title_tr : article.title_en}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {isTr ? article.short_desc_tr : article.short_desc_en}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>{isTr ? 'Rehberi İncele' : 'Read Article'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-slate-100"
            >
              {/* Modal Cover Image */}
              <div className="relative h-56 sm:h-72 bg-slate-900 overflow-hidden">
                {activeArticle.image_url && (
                  <img src={activeArticle.image_url} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-2xl hover:bg-slate-900 transition-all border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
                      {activeArticle.water_type}
                    </span>
                    <span className="bg-slate-800/80 backdrop-blur-md text-slate-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {activeArticle.difficulty_level}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{isTr ? activeArticle.title_tr : activeArticle.title_en}</h2>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold text-xs text-slate-700">
                  {isTr ? activeArticle.short_desc_tr : activeArticle.short_desc_en}
                </div>

                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isTr ? 'Teknik Detaylar ve Püf Noktaları' : 'Technical Details & Pro Tips'}</span>
                  </h4>
                  <p className="whitespace-pre-line text-slate-600 font-medium">
                    {isTr ? activeArticle.content_tr : activeArticle.content_en}
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-2xl text-xs transition-all shadow-md"
                  >
                    {isTr ? 'Kapat' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
