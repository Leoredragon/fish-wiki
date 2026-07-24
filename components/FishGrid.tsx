'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Fish } from '@/lib/supabase';
import FishCard from './FishCard';
import SpotlightCarousel from './SpotlightCarousel';
import { useTranslations, useLocale } from 'next-intl';
import { useFavorites } from '@/lib/useFavorites';
import { Filter, RefreshCw, AlertCircle, Heart, Sparkles, Anchor, Mountain, Waves } from 'lucide-react';

export const RICH_MOCK_FISHES: Fish[] = [
  {
    id: 'm1',
    name_tr: 'Abant Alası',
    name_en: 'Abant Trout',
    scientific_name: 'Salmo abanticus',
    water_type: 'Tatlı Su',
    active_seasons: 'İlkbahar, Sonbahar',
    recommended_gear: 'Fly-Fishing, Hafif Kaşık, LRF',
    short_info_tr: 'Bolu Abant Gölü ve derelerine özgü koruma altındaki endemik alabalık.',
    short_info_en: 'Protected endemic trout species restricted to Lake Abant streams.',
    limit_size: 'Asgari 20 cm (Günlük Limit: 3 Adet)',
    ban_periods: '1 Ekim - 28 Şubat (Üreme Dönemi)',
    favorite_baits: 'Sinek yemi (Fly), Mikro Mepps Kaşık (#1-2), Yapay böcekler',
    primary_regions: 'Bolu Abant Gölü, Abant Deresi ve Yedigöller Akarsuları',
    taste_rating: '5/5 Yıldız - Çok Lezzetli Kırmızımsı Yağlı Et',
    cooking_tips_tr: 'Izgarada veya toprak kiremitte tereyağı ve defne yaprağı ile fırınlanması önerilir.',
    cooking_tips_en: 'Recommended baked in a clay dish with garlic butter and bay leaves.',
    description_tr: 'Yalnızca Bolu Abant Gölü ve çevresindeki yüksek irtifa derelerinde yaşayan koruma altındaki endemik bir alabalık türüdür. Sinek olta (Fly-fishing) ve mikro kaşık takımlarına istekli hamleler yapar.',
    description_en: 'Endemic trout species inhabiting Lake Abant and surrounding mountain streams. Highly responsive to fly-fishing and micro lures.',
    image_url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'm2',
    name_tr: 'Tatlı Su Kefali',
    name_en: 'Chub',
    scientific_name: 'Squalius cephalus',
    water_type: 'Tatlı Su',
    active_seasons: 'Yaz, Sonbahar',
    recommended_gear: 'LRF, Micro Crankbait, Sinek Oltası',
    short_info_tr: 'Hızlı akan berrak nehirlerde yaşayan uyanık ve akrobatik tatlı su balığı.',
    short_info_en: 'Wary and agile fish inhabiting fast-flowing clear streams.',
    limit_size: 'Asgari 20 cm',
    ban_periods: 'İç sularda 15 Mart - 15 Haziran',
    favorite_baits: 'Çekirge, Silikon Böcek, Micro Crankbait, Tavuk Göğsü',
    primary_regions: 'Sakarya Nehir Havzası, Kızılırmak, Melen Çayı ve Göksu',
    taste_rating: '3/5 Yıldız - İnce Kılçıklı & Beyaz Et',
    cooking_tips_tr: 'Kılçık yapısı nedeniyle çizik atılarak mısır ununa bulanıp tavada kızartılmalıdır.',
    cooking_tips_en: 'Scored with shallow cuts, dredged in cornmeal, and pan-fried.',
    description_tr: 'Hızlı akan akarsularda ve berrak nehirlerde sürü halinde gezen son derece uyanık ve çevik bir balıktır. Sahte böcekler ve mikro maket balıklarla (LRF) avcılığı son derece heyecan vericidir.',
    description_en: 'Wary freshwater fish inhabiting fast-flowing rivers. Popular target for Light Rock Fishing (LRF) with micro lures.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'm3',
    name_tr: 'Aynalı Sazan',
    name_en: 'Mirror Carp',
    scientific_name: 'Cyprinus carpio',
    water_type: 'Tatlı Su',
    active_seasons: 'Yaz, Sonbahar',
    recommended_gear: 'Sazan Montajı, Boilie, Dip Oltası',
    short_info_tr: 'Göl ve barajların dip bölgesinde beslenen iriyarı sazan türü.',
    short_info_en: 'Specimen freshwater species feeding along lake and reservoir bottoms.',
    limit_size: 'Asgari 40 cm (Günlük Limit: 5 Adet)',
    ban_periods: 'İç sularda 15 Mart - 15 Haziran',
    favorite_baits: 'Aromalı Boilie, Tatlı Mısır, Pelet Yem, Solucan',
    primary_regions: 'İznik Gölü, Mogan Gölü, Keban Barajı ve Hirfanlı Barajı',
    taste_rating: '4/5 Yıldız - Sıkı Etli & Besleyici',
    cooking_tips_tr: 'Fırında sebzelerle buğulama veya zencefilli özel sosla fırınlama idealdir.',
    cooking_tips_en: 'Baked with root vegetables and lemon slices in an oven dish.',
    description_tr: 'Göllerde ve barajlarda yaşayan, iri cüsseli ve mukavemeti yüksek bir tatlı su türüdür. Boilie ve mısır yemli özel sazan düzenekleri ile dipte avlanır.',
    description_en: 'Powerful freshwater fish prized by specimen carp anglers using specialized hair rigs and boilies.',
    image_url: 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'm4',
    name_tr: 'Deniz Levreği',
    name_en: 'European Seabass',
    scientific_name: 'Dicentrarchus labrax',
    water_type: 'Tuzlu Su',
    active_seasons: 'Sonbahar, Kış',
    recommended_gear: 'Spinning, Su Üstü Maket, LRF',
    short_info_tr: 'Kıyı kayalıklarının ve nehir ağızlarının usta yırtıcısı.',
    short_info_en: 'Master predator of coastal breakers and river estuaries.',
    limit_size: 'Asgari 25 cm (Kıyı ve Deniz)',
    ban_periods: 'Üreme dönemi 15 Mayıs - 15 Haziran',
    favorite_baits: 'Su Üstü Popper (WTD), Canlı Teke, Raglou Silikon, Mamun',
    primary_regions: 'Ege Kıyıları (Çeşme, Ayvalık), Marmara Ereğlisi, Saros Körfezi',
    taste_rating: '5/5 Yıldız - Yüksek Yağ Oranı & Lezzetli Beyaz Et',
    cooking_tips_tr: 'Deniz tuzu kaplamasında fırında veya zeytinyağlı ızgarada mükemmeldir.',
    cooking_tips_en: 'Salt-crusted baked or grilled whole with olive oil and oregano.',
    description_tr: 'Kıyı sularının ve nehir ağızlarının ustaca gizlenen avcısı. Özellikle dalgalı ve köpüklü havalarda su üstü sahte balıklar ve silikon yemlerle muazzam bir av deneyimi sunar.',
    description_en: 'Apex predator of coastal breakers and estuaries. Highly sought after by lure anglers using topwater plugs and soft plastics.',
    image_url: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'm5',
    name_tr: 'Çupra (Çipura)',
    name_en: 'Gilt-head Bream',
    scientific_name: 'Sparus aurata',
    water_type: 'Tuzlu Su',
    active_seasons: 'İlkbahar, Sonbahar',
    recommended_gear: 'Yemli Dip Takımı, Boru Kurdu, Surfcasting',
    short_info_tr: 'Sert çene yapısı ile kabuklu deniz canlılarını kıran ekonomik değeri yüksek tür.',
    short_info_en: 'Marine fish with powerful jaws adapted for crushing shellfish.',
    limit_size: 'Asgari 20 cm',
    ban_periods: 'Yıl boyu serbest (Yasal asgari boya uyulmalıdır)',
    favorite_baits: 'Boru Kurdu, Sülünes, Yengeç, Mamun, Midye Eti',
    primary_regions: 'İzmir Körfezi, Bodrum, Antalya Kıyıları, Didim ve Fethiye',
    taste_rating: '5/5 Yıldız - Ege Mutfaklarının Vazgeçilmezi',
    cooking_tips_tr: 'Odun ateşinde ızgara veya fırında domates ve biber sosu eşliğinde pişirilir.',
    cooking_tips_en: 'Wood-grilled whole with rosemary and lemon slices.',
    description_tr: 'Gözlerinin arasındaki altın sarısı bant ile tanınan güçlü çeneli deniz balığı. Yengeç, sülünes ve canlı yemlerle gezer kurşunlu dip takımlarında avlanır.',
    description_en: 'Identified by the golden stripe between its eyes. Targeted with bottom rigs baited with marine worms and crabs.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    id: 'm6',
    name_tr: 'Lüfer',
    name_en: 'Bluefish',
    scientific_name: 'Pomatomus saltatrix',
    water_type: 'Tuzlu Su',
    active_seasons: 'Sonbahar',
    recommended_gear: 'Spinning, Ağır Kaşık, Uzun Olta',
    short_info_tr: 'Denizlerimizin ve Boğaz\'ın en yırtıcı avcı balığı.',
    short_info_en: 'Fierce pelagic predator of the Bosphorus and Mediterranean.',
    limit_size: 'Asgari 18 cm (Yaprak ve Çinekop avı yasaktır)',
    ban_periods: '1 Mayıs - 31 Ağustos (Boğaz geçiş dönemi)',
    favorite_baits: 'Hansen Pilgrim Kaşık, Canlı Zargana, İstavrit Yaprak Yem',
    primary_regions: 'İstanbul Boğazı, Çanakkale Boğazı, Marmara Denizi',
    taste_rating: '5/5 Yıldız - Boğaz\'ın En Lezzetli Balığı',
    cooking_tips_tr: 'Sonbahar yağında kömür ateşinde ızgarası rakipsiz bir lezzete sahiptir.',
    cooking_tips_en: 'Charcoal-grilled during autumn when oil levels are peak.',
    description_tr: 'Boğaz sularının hızlı ve saldırgan yırtıcısı. Keskin dişleri nedeniyle tel bedenli takımlar, parıltılı kaşıklar ve maket yemlerle avcılığı yapılır.',
    description_en: 'Fierce predator of coastal waters. Targeted with metal spoons and wire-leader spinning rigs.',
    image_url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    is_active: true
  }
];

interface FishGridProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
}

export default function FishGrid({ selectedCategory, onSelectCategory, searchTerm }: FishGridProps) {
  const t = useTranslations('Filters');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const isTr = locale === 'tr';
  const { favorites } = useFavorites();

  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    async function loadData() {
      try {
        const orderColumn = locale === 'en' ? 'name_en' : 'name_tr';
        const { data, error } = await supabase
          .from('fishes')
          .select('*')
          .eq('is_active', true)
          .order(orderColumn, { ascending: true });

        if (isSubscribed) {
          if (error || !data || data.length === 0) {
            setFishes(RICH_MOCK_FISHES);
          } else {
            setFishes(data);
          }
          setLoading(false);
        }
      } catch {
        if (isSubscribed) {
          setFishes(RICH_MOCK_FISHES);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [locale]);

  const filteredFishes = fishes
    .filter((fish) => {
      const name = locale === 'tr' ? fish.name_tr : fish.name_en;
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fish.scientific_name && fish.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const targetId = fish.id || 'm1';

      const gearStr = (fish.recommended_gear || '').toLowerCase();
      const descStr = (fish.description_tr || '' + fish.short_info_tr || '').toLowerCase();

      let matchesCategory = true;

      if (selectedCategory === 'tatli') {
        matchesCategory = fish.water_type?.toLowerCase().includes('tatlı') || false;
      } else if (selectedCategory === 'tuzlu') {
        matchesCategory = fish.water_type?.toLowerCase().includes('tuzlu') || false;
      } else if (selectedCategory === 'favorites') {
        matchesCategory = favorites.includes(targetId);
      } else if (selectedCategory === 'lrf_fly') {
        matchesCategory = gearStr.includes('lrf') || gearStr.includes('fly');
      } else if (selectedCategory === 'carp_camp') {
        matchesCategory = gearStr.includes('sazan') || descStr.includes('sazan') || descStr.includes('göl');
      } else if (selectedCategory === 'surf') {
        matchesCategory = gearStr.includes('surf') || gearStr.includes('dip') || gearStr.includes('kıyı');
      } else if (selectedCategory === 'protected') {
        matchesCategory = descStr.includes('endemik') || descStr.includes('koruma') || (fish.limit_size || '').includes('limit');
      }

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const nameA = locale === 'tr' ? a.name_tr : a.name_en;
      const nameB = locale === 'tr' ? b.name_tr : b.name_en;
      return nameA.localeCompare(nameB, locale === 'tr' ? 'tr' : 'en');
    });

  return (
    <div className="space-y-8">
      {/* Featured Spotlight Carousel */}
      <SpotlightCarousel fishes={fishes} />

      {/* Swipeable Quick Filter Chips Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Hızlı Filtreler' : 'Quick Filters'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {/* All */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start ${
              selectedCategory === 'all'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('all')}
          </button>

          {/* Freshwater */}
          <button
            onClick={() => onSelectCategory('tatli')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1 ${
              selectedCategory === 'tatli'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>{t('freshwater')}</span>
          </button>

          {/* Saltwater */}
          <button
            onClick={() => onSelectCategory('tuzlu')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1 ${
              selectedCategory === 'tuzlu'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{t('saltwater')}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => onSelectCategory('favorites')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1.5 ${
              selectedCategory === 'favorites'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/80'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{t('favorites')} ({favorites.length})</span>
          </button>

          {/* Discipline: LRF & Fly-Fishing */}
          <button
            onClick={() => onSelectCategory('lrf_fly')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1 ${
              selectedCategory === 'lrf_fly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LRF & Fly-Fishing</span>
          </button>

          {/* Discipline: Sazan & Kamp */}
          <button
            onClick={() => onSelectCategory('carp_camp')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1 ${
              selectedCategory === 'carp_camp'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>{isTr ? 'Sazan & Kamp Avı' : 'Carp & Camping'}</span>
          </button>

          {/* Warning: Protected species */}
          <button
            onClick={() => onSelectCategory('protected')}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all snap-start flex items-center space-x-1 ${
              selectedCategory === 'protected'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <span>♻️ {isTr ? 'Koruma Altındaki Türler' : 'Protected Species'}</span>
          </button>
        </div>
      </div>

      {/* Main Fish Feed Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-[#10B981] animate-spin mr-2" />
          <span className="text-sm font-medium text-slate-600">{tCommon('loading')}</span>
        </div>
      ) : filteredFishes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 text-sm font-medium">
            {selectedCategory === 'favorites'
              ? (locale === 'tr' ? 'Henüz favorilere balık eklenmedi.' : 'No favorite species saved yet.')
              : tCommon('notFound')}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredFishes.map((fish) => (
              <FishCard key={fish.id || fish.name_tr} fish={fish} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
