'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Mountain, Waves } from 'lucide-react';
import { Fish } from '@/lib/supabase';
import { RICH_MOCK_FISHES } from './FishGrid';

export default function SpotlightCarousel() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const spotlightFishes: Fish[] = [
    RICH_MOCK_FISHES[0], // Abant Alası
    RICH_MOCK_FISHES[3], // Deniz Levreği
    RICH_MOCK_FISHES[5], // Lüfer
    RICH_MOCK_FISHES[2]  // Aynalı Sazan
  ];

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            {isTr ? 'Öne Çıkan Türler Vitrini' : 'Featured Species Spotlight'}
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          {isTr ? 'Haftanın Öne Çıkanları' : 'Weekly Spotlight'}
        </span>
      </div>

      {/* Swipeable Carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
        {spotlightFishes.map((fish, idx) => {
          const name = isTr ? fish.name_tr : fish.name_en;
          const shortInfo = isTr ? fish.short_info_tr : fish.short_info_en;
          const targetId = fish.id || `m${idx + 1}`;
          const isFreshwater = fish.water_type?.toLowerCase().includes('tatlı');

          return (
            <motion.div
              key={targetId}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative group flex flex-col justify-between"
            >
              <Link href={`/fish/${targetId}`} className="block h-full">
                <div className="relative h-44 w-full">
                  <Image
                    src={fish.image_url || 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Water Type Badge */}
                  <div
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md flex items-center space-x-1 ${
                      isFreshwater
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-900/80 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {isFreshwater ? <Mountain className="w-3 h-3" /> : <Waves className="w-3 h-3" />}
                    <span>{fish.water_type}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 bg-slate-950 text-white border-t border-slate-800">
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                      {name}
                    </h3>
                    <p className="text-[11px] italic text-emerald-300/90 font-medium">
                      {fish.scientific_name}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {shortInfo}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400 border-t border-slate-800/80">
                    <span>{isTr ? 'Detayı İncele' : 'View Species'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
