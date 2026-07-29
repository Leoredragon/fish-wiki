/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Anchor,
  Filter
} from 'lucide-react';
import Image from 'next/image';

function matchesWikiSubCategory(item: any, selectedSubCategory: string) {
  if (selectedSubCategory === 'all') return true;

  // Prefer explicit DB subcategory when present
  if (item.sub_category) {
    return item.sub_category === selectedSubCategory;
  }

  const titleLower = (item.title_tr || '').toLowerCase();
  const titleEnLower = (item.title_en || '').toLowerCase();
  const combinedTitle = `${titleLower} ${titleEnLower}`;

  switch (selectedSubCategory) {
    case 'rod':
      return combinedTitle.includes('kamış') || combinedTitle.includes('rod');
    case 'reel':
      return combinedTitle.includes('makine') || combinedTitle.includes('reel');
    case 'braid':
      return combinedTitle.includes('örgü') || combinedTitle.includes('braid') || combinedTitle.includes(' pe ');
    case 'fluorocarbon':
      return combinedTitle.includes('fluorocarbon') || combinedTitle.includes('fc');
    case 'monofilament':
      return combinedTitle.includes('mono') || combinedTitle.includes('naylon');
    case 'leader':
      return combinedTitle.includes('lider') || combinedTitle.includes('leader');
    case 'minnow':
      return combinedTitle.includes('minnow') || combinedTitle.includes('maket');
    case 'surface':
      return combinedTitle.includes('popper') || combinedTitle.includes('su üstü') || combinedTitle.includes('wtd') || combinedTitle.includes('topwater');
    case 'silicone':
      return combinedTitle.includes('silikon') || combinedTitle.includes('jighead') || combinedTitle.includes('soft plastic');
    case 'spoon':
      return (combinedTitle.includes('kaşık') || combinedTitle.includes('shore jig') || combinedTitle.includes('spoon'))
        && !combinedTitle.includes('jighead')
        && !combinedTitle.includes('silikon');
    case 'egi':
      return combinedTitle.includes('egi') || combinedTitle.includes('kalamar') || combinedTitle.includes('squid');
    case 'vibration':
      return combinedTitle.includes('vibrasyon') || combinedTitle.includes('vibration');
    case 'carp_rig':
      return item.category === 'rigs' && (
        combinedTitle.includes('sazan')
        || combinedTitle.includes('hair rig')
        || combinedTitle.includes('ronnie')
        || combinedTitle.includes('boilie')
        || combinedTitle.includes('pop-up')
        || combinedTitle.includes('carp')
      );
    case 'sea_rig':
      return item.category === 'rigs' && item.water_type !== 'Tatlı Su' && !combinedTitle.includes('sazan');
    case 'line_join':
      return item.category === 'knots' && (combinedTitle.includes('fg') || combinedTitle.includes('alberto'));
    case 'terminal':
      return item.category === 'knots' && (combinedTitle.includes('palomar') || combinedTitle.includes('clinch') || combinedTitle.includes('uni'));
    default:
      return false;
  }
}

const FALLBACK_CATEGORIES = [
  { id: 'all', label_tr: 'Tüm Rehberler', label_en: 'All Guides', sort_order: 0 },
  { id: 'disciplines', label_tr: 'Stiller & Disiplinler', label_en: 'Angling Styles', sort_order: 10 },
  { id: 'tackles', label_tr: 'Kamış & Makine', label_en: 'Rods & Reels', sort_order: 20 },
  { id: 'lines', label_tr: 'Misinalar & Liderler', label_en: 'Fishing Lines', sort_order: 30 },
  { id: 'lures', label_tr: 'Sahte Yemler', label_en: 'Lures & Baits', sort_order: 40 },
  { id: 'rigs', label_tr: 'Rig & Takımlar', label_en: 'Rigs & Assemblies', sort_order: 50 },
  { id: 'knots', label_tr: 'Balıkçılık Düğümleri', label_en: 'Fishing Knots', sort_order: 60 },
  { id: 'accessories', label_tr: 'Aksesuarlar', label_en: 'Accessories', sort_order: 70 }
];

export default function WikiClient({
  initialArticles = [],
  initialCategories = [],
  initialSubcategories = []
}: {
  initialArticles?: any[];
  initialCategories?: any[];
  initialSubcategories?: any[];
}) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedWaterType, setSelectedWaterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  useEffect(() => {
    setArticles(initialArticles || []);
  }, [initialArticles]);

  const categories = useMemo(() => {
    const dbCats = (initialCategories || []).map((c) => ({
      id: c.id,
      label_tr: c.label_tr,
      label_en: c.label_en,
      sort_order: c.sort_order ?? 0
    }));
    const base = dbCats.length
      ? [{ id: 'all', label_tr: 'Tüm Rehberler', label_en: 'All Guides', sort_order: 0 }, ...dbCats]
      : FALLBACK_CATEGORIES;
    return [...base].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [initialCategories]);

  const currentSubCategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return (initialSubcategories || [])
      .filter((s) => s.category_id === selectedCategory)
      .map((s) => ({
        id: s.id,
        label_tr: s.label_tr,
        label_en: s.label_en
      }));
  }, [initialSubcategories, selectedCategory]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const visibleCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (cat.id === 'all') return true;
      return articles.some((item) => item.category === cat.id);
    });
  }, [articles, categories]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesWater = selectedWaterType === 'all' || item.water_type === 'Tüm Sular' || item.water_type === selectedWaterType;
      const matchesSearch = !query || (isTr
        ? (item.title_tr || '').toLowerCase().includes(query)
          || (item.short_desc_tr || '').toLowerCase().includes(query)
          || (item.content_tr || '').toLowerCase().includes(query)
        : (item.title_en || '').toLowerCase().includes(query)
          || (item.short_desc_en || '').toLowerCase().includes(query)
          || (item.content_en || '').toLowerCase().includes(query)
          || (item.title_tr || '').toLowerCase().includes(query));
      const matchesSub = matchesWikiSubCategory(item, selectedSubCategory);

      return matchesCategory && matchesSub && matchesWater && matchesSearch;
    });
  }, [articles, selectedCategory, selectedSubCategory, selectedWaterType, searchQuery, isTr]);

  const getCategoryLabel = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return isTr ? found?.label_tr : found?.label_en;
  };

  return (
    <div className="space-y-4 sm:space-y-6 mobile-scroll-pad">
      {/* Hero Header Banner — same scale as Keşfet / HeroSection */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-white shadow-lg border border-slate-800/80 space-y-4 sm:space-y-6">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            {isTr ? 'Balıkçılık Wiki & Ekipman Rehberi' : 'Angling Wiki & Equipment Guide'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
            {isTr
              ? 'Balıkçılık stilleri, makine ve kamış seçimleri, düğüm teknikleri, sahte yem aksiyonları ve rig montajlarına dair aradığınız tüm profesyonel bilgiler.'
              : 'Explore fishing styles, rod & reel choices, knot techniques, lure actions, and rig setups.'}
          </p>
        </div>

        <div className="relative z-10 max-w-2xl pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Wiki rehberlerinde ara (Örn: LRF, Spin Kamış, Surfcast, FG Knot...)' : 'Search wiki guides...'}
              className="w-full pl-11 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-left text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-lg hover:bg-white/30"
              >
                {isTr ? 'Temizle' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Category Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {isTr ? 'Kategoriler' : 'Categories'}
          </span>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none pt-2 border-t border-slate-100">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {isTr ? cat.label_tr : cat.label_en}
            </button>
          ))}
        </div>

        {/* 2nd Level Sub-category Horizontal Scroll Pills (Excluding 'Tümü') */}
        {currentSubCategories.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none pt-2 border-t border-dashed border-slate-200">
            <div className="flex items-center text-slate-400 space-x-1 shrink-0 text-xs font-bold mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTr ? 'Alt Filtre:' : 'Sub-filter:'}</span>
            </div>
            {currentSubCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.id ? 'all' : sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                  selectedSubCategory === sub.id
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {isTr ? sub.label_tr : sub.label_en}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Articles (Mobile 2-Column Responsive Layout) */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base">{isTr ? 'Aramanıza uygun rehber içeriği bulunamadı.' : 'No wiki articles found.'}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubCategory('all');
              setSelectedWaterType('all');
              setSearchQuery('');
            }}
            className="text-xs font-extrabold text-emerald-600 hover:underline"
          >
            {isTr ? 'Filtreleri Temizle' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredArticles.map((article: any, idx: number) => (
            <div
              key={article.id || idx}
              onClick={() => setActiveArticle(article)}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-[#0F172A] overflow-hidden">
                {article.image_url ? (
                  <Image
                    src={article.image_url}
                    alt={article.title_tr || ''}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-emerald-400/40">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                  <span className="bg-[#0F172A]/95 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                    {article.water_type || 'Tüm Sular'}
                  </span>
                </div>

                {article.difficulty_level && (
                  <div className="absolute top-2 right-2 bg-emerald-600/95 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
                    {article.difficulty_level}
                  </div>
                )}
              </div>

              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {isTr ? article.title_tr : article.title_en}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-snug font-normal">
                    {isTr ? article.short_desc_tr : article.short_desc_en}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700 pt-1">
                  <span>{isTr ? 'İncele' : 'Read'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
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
                  <Image src={activeArticle.image_url} alt="" fill sizes="100vw" className="object-cover" />
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
