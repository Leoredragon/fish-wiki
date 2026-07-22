'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase, Fish } from '@/lib/supabase';
import { RICH_MOCK_FISHES } from './FishGrid';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Waves,
  Mountain,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Share2,
  Check
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
    fetchFish();
  }, [id]);

  const fetchFish = async () => {
    setLoading(true);
    try {
      // 1. Try matching from mock data first (for instant mock previews)
      const mockMatch = RICH_MOCK_FISHES.find((f) => f.id === id);
      if (mockMatch) {
        setFish(mockMatch);
        setLoading(false);
        return;
      }

      // 2. Query Supabase by UUID / ID
      const { data, error } = await supabase
        .from('fishes')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setFish(data);
      } else {
        // Fallback to first mock item if ID not found
        setFish(RICH_MOCK_FISHES[0]);
      }
    } catch {
      setFish(RICH_MOCK_FISHES[0]);
    } finally {
      setLoading(false);
    }
  };

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
  const description = isTr
    ? (fish.description_tr || fish.description_en)
    : (fish.description_en || fish.description_tr);

  const defaultImage = "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80";
  const displayImage = (!fish.image_url || imageError) ? defaultImage : fish.image_url;

  const gearTags = fish.recommended_gear
    ? fish.recommended_gear.split(',').map((tag) => tag.trim())
    : [];

  const isFreshwater = fish.water_type?.toLowerCase().includes('tatlı');

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
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
          className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 shadow-sm transition-all"
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

      {/* Hero Header Image with Gradient Overlay & Framer Motion Fade-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900"
      >
        <Image
          src={displayImage}
          alt={name}
          fill
          priority
          className="object-cover opacity-90"
          onError={() => setImageError(true)}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 text-white space-y-2">
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

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
            {name}
          </h1>

          {fish.scientific_name && (
            <p className="text-sm sm:text-base italic text-emerald-300 font-medium tracking-wide">
              {fish.scientific_name}
            </p>
          )}
        </div>
      </motion.div>

      {/* Info Cards Grid - Staggered Fade-up */}
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Card 1: Water Type */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {isFreshwater ? <Mountain className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {tDetails('waterTypeLabel')}
              </h3>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {fish.water_type || (isTr ? 'Belirtilmedi' : 'Unspecified')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Active Seasons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {tDetails('activeSeasonsLabel')}
              </h3>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {fish.active_seasons || (isTr ? 'Tüm Yıl' : 'All Year')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Recommended Gear & Techniques */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isTr ? 'Av Teknikleri & Ekipman' : 'Techniques & Gear'}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {gearTags.length > 0 ? (
                  gearTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">LRF, Fly-fishing, Surfcasting</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Detailed Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
      >
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Sparkles className="w-5 h-5 text-[#10B981]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
            {tDetails('descriptionLabel')}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line tracking-normal">
          {description || (isTr
            ? 'Bu balık türü hakkında biyolojik özellikler, beslenme alışkanlıkları ve avlanma meralarına dair detaylı bilgiler güncellenmektedir.'
            : 'Detailed biological traits, feeding habits, and habitat preferences for this species are being updated.')}
        </p>

        {fish.recommended_gear && (
          <div className="pt-4 border-t border-slate-100 mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {tDetails('gearDetails')}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {fish.recommended_gear}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
