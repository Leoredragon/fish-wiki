'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Fish as FishType } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Waves, Calendar, Info, Mountain, ArrowRight } from 'lucide-react';

interface FishCardProps {
  fish: FishType;
}

export default function FishCard({ fish }: FishCardProps) {
  const locale = useLocale();
  const t = useTranslations('FishCard');
  const [imageError, setImageError] = useState(false);

  const isTr = locale === 'tr';
  const name = isTr ? fish.name_tr : fish.name_en;
  const description = isTr
    ? (fish.description_tr || fish.description_en)
    : (fish.description_en || fish.description_tr);

  // Fallback image using Unsplash fish photo if missing or error
  const defaultImage = "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80";
  const displayImage = (!fish.image_url || imageError) ? defaultImage : fish.image_url;

  // Extract gear tags into pills
  const gearTags = fish.recommended_gear
    ? fish.recommended_gear.split(',').map((tag) => tag.trim())
    : [];

  const isFreshwater = fish.water_type?.toLowerCase().includes('tatlı');
  const targetId = fish.id || 'm1';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
    >
      <Link href={`/fish/${targetId}`} className="flex-1 flex flex-col">
        {/* Image Header Container */}
        <div className="relative h-48 sm:h-52 w-full bg-slate-900 overflow-hidden">
          <Image
            src={displayImage}
            alt={name || 'Fish species'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            onError={() => setImageError(true)}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Water Type Badge */}
          {fish.water_type && (
            <div
              className={`absolute top-3 right-3 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center space-x-1 shadow-sm ${
                isFreshwater
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900/80 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {isFreshwater ? <Mountain className="w-3 h-3" /> : <Waves className="w-3 h-3" />}
              <span>{fish.water_type}</span>
            </div>
          )}

          {/* Species Name & Scientific Title */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug drop-shadow-md group-hover:text-emerald-300 transition-colors">
              {name}
            </h3>
            {fish.scientific_name && (
              <p className="text-xs font-medium italic text-emerald-300/90 tracking-wide mt-0.5">
                {fish.scientific_name}
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {description || t('noDescription')}
          </p>

          {/* Gear Tags Pills */}
          {gearTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {gearTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg"
                >
                  {tag}
                </span>
              ))}
              {gearTags.length > 3 && (
                <span className="text-[10px] text-slate-400 font-medium self-center">
                  +{gearTags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            {fish.active_seasons && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate font-medium text-slate-700">{fish.active_seasons}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full mt-2 bg-[#0F172A] group-hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-2xl flex items-center justify-center space-x-1.5 transition-all shadow-sm">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
