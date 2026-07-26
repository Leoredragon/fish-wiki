'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Fish as FishType } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Info, ArrowRight } from 'lucide-react';

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

  const defaultImage = "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80";
  const displayImage = (!fish.image_url || imageError) ? defaultImage : fish.image_url;
  const targetId = fish.id || 'm1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group relative"
    >
      <Link href={`/fish/${targetId}`} className="flex-1 flex flex-col">
        {/* Clean Unobscured Image Container (Full Fish Body Fit) */}
        <div className="relative aspect-[16/10] w-full bg-[#0F172A] overflow-hidden flex items-center justify-center">
          <Image
            src={displayImage}
            alt={name || 'Fish species'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Content Body with Fish Name below image */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-snug font-normal">
              {description || t('noDescription')}
            </p>
          </div>

          {/* Action Button */}
          <div className="w-full mt-1 bg-[#0F172A] group-hover:bg-slate-800 text-white text-xs font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
