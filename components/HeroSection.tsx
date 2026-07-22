'use client';

import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { useLocale } from 'next-intl';

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({ searchTerm, onSearchChange }: HeroSectionProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 space-y-6"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isTr ? 'Mobil Uyumlu Deniz & Tatlı Su Kılavuzu' : 'Mobile-First Angling Encyclopedia'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          {isTr ? 'Türkiye’nin Kapsamlı Balık Rehberi' : 'Comprehensive Fish Wiki Guide'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
          {isTr
            ? 'Denizlerimiz ve iç sularımızdaki balık türlerini, yasal boy limitlerini, av yasaklarını ve en etkili olta takımlarını saniyeler içinde keşfedin.'
            : 'Explore marine & freshwater species, legal size quotas, active seasons, and optimal fishing rigs.'}
        </p>
      </div>

      {/* Integrated Smart Search Input */}
      <div className="relative z-10 max-w-2xl pt-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
          <input
            type="text"
            placeholder={
              isTr
                ? "Balık adı (Örn: Kefal, Levrek, Lüfer) veya bilimsel adı yazın..."
                : "Search species (e.g. Seabass, Chub, Trout)..."
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all shadow-xl"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-lg hover:bg-white/30"
            >
              {isTr ? 'Temizle' : 'Clear'}
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
