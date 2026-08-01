'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase, Fish } from '@/lib/supabase';
import RigGuide from './fish/RigGuide';
import { RICH_MOCK_FISHES } from './FishGrid';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Share2,
  Check,
  ShieldAlert,
  Scale,
  Anchor,
  FileText,
  Utensils,
  MapPin,
  Star
} from 'lucide-react';

interface FishDetailPageClientProps {
  id: string;
}

export default function FishDetailPageClient({ id }: FishDetailPageClientProps) {
  const locale = useLocale();
  const tCommon = useTranslations('Common');
  const tDetails = useTranslations('FishDetails');
  const isTr = locale === 'tr';

  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    let isSubscribed = true;
    async function loadFishData() {
      try {
        const mockMatch = RICH_MOCK_FISHES.find((f) => f.id === id);
        if (mockMatch) {
          if (isSubscribed) {
            setFish(mockMatch);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('fishes')
          .select('*')
          .eq('id', id)
          .single();

        if (isSubscribed) {
          if (!error && data) {
            setFish(data);
          } else {
            setFish(RICH_MOCK_FISHES[0]);
          }
          setLoading(false);
        }
      } catch {
        if (isSubscribed) {
          setFish(RICH_MOCK_FISHES[0]);
          setLoading(false);
        }
      }
    }

    loadFishData();

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#10B981] animate-spin" />
        <p className="text-sm font-medium text-slate-500">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!fish) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <p className="text-base font-semibold text-slate-700">{tCommon('notFound')}</p>
        <Link
          href="/"
          className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          {tDetails('back')}
        </Link>
      </div>
    );
  }

  const name = isTr ? fish.name_tr : fish.name_en;
  const shortInfo = isTr
    ? (fish.short_info_tr || fish.short_info_en)
    : (fish.short_info_en || fish.short_info_tr);

  const description = isTr
    ? (fish.description_tr || fish.description_en)
    : (fish.description_en || fish.description_tr);

  const cookingTips = isTr
    ? (fish.cooking_tips_tr || fish.cooking_tips_en)
    : (fish.cooking_tips_en || fish.cooking_tips_tr);

  const defaultImage = "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80";
  const displayImage = (!fish.image_url || imageError) ? defaultImage : fish.image_url;

  const gearTags = fish.recommended_gear
    ? fish.recommended_gear.split(',').map((tag) => tag.trim())
    : [];

  const baitTags = fish.favorite_baits
    ? fish.favorite_baits.split(',').map((tag) => tag.trim())
    : [];

  const regionTags = fish.primary_regions
    ? fish.primary_regions.split(',').map((tag) => tag.trim())
    : [];

  const isFreshwater = fish.water_type?.toLowerCase().includes('tatlı');

  return (
    <div className="max-w-5xl mx-auto space-y-8 mobile-scroll-pad">
      {/* Top Back Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-[#0F172A] px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200/80 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>{tDetails('back')}</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-2xl text-xs font-medium border border-slate-200 shadow-sm transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">{isTr ? 'Kopyalandı' : 'Copied'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{isTr ? 'Paylaş' : 'Share'}</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Hero Header Image with Gradient Overlay & Short Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-video sm:aspect-[21/9] max-h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900 flex items-center justify-center"
      >
        <Image
          src={displayImage}
          alt={name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Title & Short Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white space-y-3">
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border ${
                isFreshwater
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900/80 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {fish.water_type || (isTr ? 'Tatlı Su' : 'Freshwater')}
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {name}
            </h1>

            {fish.scientific_name && (
              <p className="text-sm sm:text-base italic text-emerald-300 font-medium tracking-wide mt-1">
                {fish.scientific_name}
              </p>
            )}
          </div>

          {/* Short Info Banner under Title */}
          {shortInfo && (
            <div className="pt-1">
              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-3xl leading-relaxed bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                {shortInfo}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Section Grid with Staggered Animations */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="space-y-6"
      >
        {/* CARD 1: Sustainable Angling Rules & Limits */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-rose-500/5 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-3 border-b border-amber-200/60 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">
                {tDetails('rulesAndLimits')}
              </h2>
              <p className="text-xs text-slate-500">
                {isTr
                  ? 'Biyolojik çeşitliliği ve balık neslini korumak adına yasal av standartları'
                  : 'Legal angling quotas and conservation regulations'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-200/80 space-y-1">
              <div className="flex items-center space-x-2 text-amber-700 font-semibold text-xs">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>{tDetails('limitSizeLabel')}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 pl-6">
                {fish.limit_size || (isTr ? 'Yasal limit belirtilmedi (Varsayılan sirküler geçerli)' : 'Unspecified limit size')}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-rose-200/80 space-y-1">
              <div className="flex items-center space-x-2 text-rose-700 font-semibold text-xs">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span>{tDetails('banPeriodsLabel')}</span>
              </div>
              <p className="text-sm font-bold text-slate-900 pl-6">
                {fish.ban_periods || (isTr ? 'Yıl boyu serbest (Asgari boya uyulmalıdır)' : 'No closed season')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: Tactics, Recommended Gear & Favorite Baits */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6"
        >
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A]">
                {tDetails('tacticsAndGear')}
              </h2>
              <p className="text-xs text-slate-500">
                {isTr ? 'Önerilen olta takımı montajları ve en çok tercih edilen yemler' : 'Recommended tackle rigs and preferred baits'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rigs & Equipment */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tDetails('gearDetails')}</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {gearTags.length > 0 ? (
                  gearTags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-950 border border-emerald-200 font-bold px-3 py-1.5 rounded-2xl text-xs flex items-center space-x-1 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{tag}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">LRF, Fly-fishing, Sazan montajı</span>
                )}
              </div>
            </div>

            {/* Favorite Baits */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{tDetails('favoriteBaits')}</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {baitTags.length > 0 ? (
                  baitTags.map((bait, i) => (
                    <span
                      key={i}
                      className="bg-teal-50 text-teal-950 border border-teal-200 font-bold px-3 py-1.5 rounded-2xl text-xs flex items-center space-x-1 shadow-xs"
                    >
                      <span>{bait}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Boru kurdu, Sülünes, Yengeç, Silikon yemler</span>
                )}
              </div>
            </div>
          </div>

          {/* Primary Regions */}
          {regionTags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tDetails('primaryRegions')}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {regionTags.map((region, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-800 border border-slate-200 font-semibold px-3 py-1 rounded-xl text-xs flex items-center space-x-1"
                  >
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{region}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Rig Guide Diagram */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <RigGuide recommendedGear={fish.recommended_gear || ''} waterType={fish.water_type || ''} />
        </motion.div>

        {/* CARD 3: Taste Rating & Gastronomy */}
        {(fish.taste_rating || cookingTips) && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#0F172A]">
                  {tDetails('tasteAndGastronomy')}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTr ? 'Balık eti kalitesi ve mutfakta pişirme teknikleri' : 'Meat flavor rating and culinary cooking advice'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {fish.taste_rating && (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-800 font-semibold text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{tDetails('tasteRatingLabel')}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 pl-5">{fish.taste_rating}</p>
                </div>
              )}

              {cookingTips && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-semibold text-xs">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span>{tDetails('cookingTipsLabel')}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 pl-5 leading-relaxed">
                    {cookingTips}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CARD 4: Detailed Description */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              {tDetails('descriptionLabel')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line tracking-normal">
            {description || (isTr
              ? 'Bu balık türü hakkında biyolojik özellikler, beslenme alışkanlıkları ve avlanma meralarına dair detaylı bilgiler güncellenmektedir.'
              : 'Detailed biological traits, feeding habits, and habitat preferences for this species are being updated.')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
