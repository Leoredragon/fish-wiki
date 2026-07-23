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
    short_desc_tr: 'Sahte maket balıklar ve kaşıklar ile dinamik, aktif avlanma disiplini.',
    short_desc_en: 'Dynamic active angling technique using hard lures and spinners.',
    content_tr: 'Spinning balıkçılığı, maket balıklar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp belirli bir aksiyonla geri sarılması esasına dayanır. Çinekop, lüfer, levrek, palamut ve akya gibi yırtıcı balıkların avında en popüler ve heyecan verici yöntemdir. Akşamüstü ve sabah suyunda su üstü popperlar veya batan (sinking) maket balıklar ile harika sonuçlar verir. Kamış seçimi genellikle 2.40m-2.70m uzunluğunda, 10-40g atarlı kamışlardır.',
    content_en: 'Spinning relies on casting hard lures or spinners and retrieving them with action. It is the most popular technique for predators like seabass, bluefish, and leerfish.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '2',
    category: 'disciplines',
    title_tr: 'LRF (Light Rock Fishing)',
    title_en: 'Light Rock Fishing (LRF)',
    short_desc_tr: 'Ultra hafif kamış ve mikro yemlerle kıyı kayalıklarında ince işçilik.',
    short_desc_en: 'Ultra-light tackle angling using micro lures around coastal rocks.',
    content_tr: 'Japonya menşeili LRF (Light Rock Fishing) tekniği, 0.5-10 gram atarlı ultra hassas kamışlar, ince PE 0.3-0.6 ip misinalar ve 2-5 cm arası mikro silikonlar ile uygulanır. İstavrit, mırmır, karagöz, eşkina, tatlı su levreği gibi balıkları hedef alır. Vuruş hissiyatı kamış ucundaki yüksek hassasiyet sayesinde inanılmaz derecede yüksektir.',
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '3',
    category: 'disciplines',
    title_tr: 'Surfcasting (Kıyı Dip & İleri Atış)',
    title_en: 'Surfcasting',
    short_desc_tr: 'Dalgalı kumluk sahillere 100-200 gramlık ağır kurşunlarla uzağa atış.',
    short_desc_en: 'Long-distance casting with heavy sinkers (100-200g) on sandy beaches.',
    content_tr: '4.20m - 4.50m boyundaki güçlü surf kamışları ve geniş makaralı (Big Pit) makineler ile 100 metre üzerindeki mesafelere atış yapılır. Çupra, mırmır, kalkan, levrek ve çinekop için yengeç, boru kurdu veya balık fleto takımları kullanılır. Sert dalgalı kıyılarda gezer kurşunlu veya çapa kurşunlu montajlar tercih edilir.',
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters out into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },
  {
    id: '4',
    category: 'lines',
    title_tr: 'Örgü İp Misina (PE Braid)',
    title_en: 'Braid Line (PE)',
    short_desc_tr: 'Sıfır esneme, yüksek çeker gücü ve maksimum atış erimi.',
    short_desc_en: 'Zero stretch, extreme tensile strength, and long casting distance.',
    content_tr: 'Çoklu mikro fiber ipliklerin örülmesiyle (4 örgülü veya 8 örgülü) üretilen PE ip misinalar, esneme yapmadığı için en ufak balık tıkırtısını bile kamışa iletir. İnce yapısı rüzgar ve su direncini düşürür ve sahtenin çok uzağa erimini sağlar. Spin ve LRF disiplinlerinin vazgeçilmezidir.',
    content_en: 'PE braided lines feature zero stretch for maximum sensitivity and thin diameter for long-range casting.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '5',
    category: 'lines',
    title_tr: 'Fluorocarbon (FC) Lider Misina',
    title_en: 'Fluorocarbon Leader',
    short_desc_tr: 'Su altında kırılma indisi sayesinde %99 görünmezlik ve sürtünme direnci.',
    short_desc_en: 'Near 100% invisible underwater with high abrasion resistance.',
    content_tr: 'Işığı su ile neredeyse aynı açıda kıran Fluorocarbon misinalar, suda balıklar tarafından fark edilemez. Ayrıca keskin kayalara, midyelere ve balık dişlerine karşı örgü ipe göre çok daha dayanıklıdır. İp misinanın ucuna 50cm-1m şok lider düğümü (FG Knot veya Albright) ile bağlanır.',
    content_en: 'Fluorocarbon leaders provide stealth and abrasion resistance when tied to the end of braided mainlines.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '6',
    category: 'lures',
    title_tr: 'Popper & Su Üstü Sahteler (WTD)',
    title_en: 'Poppers & Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve "Walk the Dog" zikzağı ile yırtıcıları çeken sahteler.',
    short_desc_en: 'Surface lures creating splashing and WTD zigzag action to trigger strikes.',
    content_tr: 'Ağzı oyuk popper sahteler kamış darbeleriyle su yüzeyinde ses ve köpük çıkarır. WTD (Walk the Dog) sahteleri ise ritmik kamış vuruşlarıyla sağa-sola zikzak çizerek yaralı balık taklidi yapar. Akya, lüfer ve levrek avında en gürültülü aksiyon veren sahtelerdir.',
    content_en: 'Poppers pop and splash while WTD lures walk side-to-side on the surface, driving topwater predators crazy.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '7',
    category: 'lures',
    title_tr: 'EGI Kalamar & Sübye Zokası',
    title_en: 'EGI Squid Lures',
    short_desc_tr: 'Kumaş kaplı, iğnesiz şemsiye tırnaklı kalamar ve sübye sahtesi.',
    short_desc_en: 'Cloth-wrapped lures with crown hooks designed specifically for cephalopods.',
    content_tr: 'Japonların geleneksel EGI zokaları, karides veya küçük balık formunda tasarlanmıştır. Gece ışıklı limanlarda veya kayalıklarda dibe doğru süzülürken ritmik zıplatma aksiyonu ile kalamar ve sübyeleri cezbeder.',
    content_en: 'EGI lures mimic shrimp or small baitfish to catch squid and cuttlefish during night angling sessions.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '8',
    category: 'rigs',
    title_tr: 'Texas & Carolina Rig Montajı',
    title_en: 'Texas & Carolina Rig',
    short_desc_tr: 'Takılmayan ofset iğne ve mermi kurşun takımı ile otluk/kayalık dip avı.',
    short_desc_en: 'Weedless offset hook rig for fishing dense cover and rocky bottoms.',
    content_tr: 'Kurşunun silikon yem önünde serbest hareket ettiği bu montajda, iğne ucu silikonun sırtına saklanır. Otlara ve taş aralarına takılmadan dibi taramaya imkan verir. Tatlı suda turna ve levrek, tuzlu suda levrek ve eşkina avında benzersizdir.',
    content_en: 'Texas rig hides the offset hook point inside the soft plastic, preventing snags in heavy cover.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '9',
    category: 'rigs',
    title_tr: 'Drop Shot Rig Montajı',
    title_en: 'Drop Shot Rig',
    short_desc_tr: 'Kurşun en altta, silikon yem 20-40cm yukarıda askıda titreşim aksiyonu.',
    short_desc_en: 'Sinker at the bottom with suspended soft lure above for subtle finesse action.',
    content_tr: 'Kurşunun en dipte sabit kaldığı ve yemin dip üstünde süzüldüğü hassas finess montajıdır. Yavaş ve isteksiz balıkları kandırmak için kamış ucuyla yerinde titreşim verilir.',
    content_en: 'Drop shotting keeps the bait suspended off the bottom, ideal for targeting sluggish fish in cold waters.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
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
    { id: 'all', label_tr: '🌟 Tüm Rehberler', label_en: '🌟 All Guides' },
    { id: 'disciplines', label_tr: '🎣 Stiller & Disiplinler', label_en: '🎣 Angling Styles' },
    { id: 'tackles', label_tr: '🌀 Kamış & Makine', label_en: '🌀 Rods & Reels' },
    { id: 'lines', label_tr: '🧵 Misinalar & Liderler', label_en: '🧵 Fishing Lines' },
    { id: 'lures', label_tr: '🐟 Sahte Yemler', label_en: '🐟 Lures & Baits' },
    { id: 'rigs', label_tr: '🪝 Rig & Takımlar', label_en: '🪝 Rigs & Assemblies' },
    { id: 'accessories', label_tr: '🧰 Aksesuarlar', label_en: '🧰 Accessories' }
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
              🌊 {isTr ? 'Tuzlu Su' : 'Saltwater'}
            </button>
            <button
              onClick={() => setSelectedWaterType('Tatlı Su')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'Tatlı Su' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌲 {isTr ? 'Tatlı Su' : 'Freshwater'}
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
