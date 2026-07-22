'use client';

import { motion } from 'framer-motion';
import { Waves, Mountain, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';

interface HeroSectionProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  freshwaterCount: number;
  saltwaterCount: number;
}

export default function HeroSection({
  selectedCategory,
  onSelectCategory,
  freshwaterCount,
  saltwaterCount
}: HeroSectionProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-slate-800/80"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0F172A]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6 sm:space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isTr ? 'Premium Balıkçılık & Av Kılavuzu' : 'Premium Angling & Species Encyclopedia'}</span>
        </motion.div>

        {/* Hero Headline */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]"
          >
            {isTr ? (
              <>
                Suların Dünyasını <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Keşfedin ve Avlanın
                </span>
              </>
            ) : (
              <>
                Explore & Master <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  The World of Aquatic Life
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed"
          >
            {isTr
              ? 'Denizlerin ve iç suların en popüler balık türleri, biyolojik özellikleri, av mevsimleri ve LRF, Fly-Fishing, Sazan montajı gibi profesyonel takım önerileri.'
              : 'Discover marine and freshwater fish species, peak seasonal activity, biological characteristics, and professional angling rig setups.'}
          </motion.p>
        </div>

        {/* Category Cards (Large Mobile Touch Targets) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          {/* Tatlı Su Category Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(selectedCategory === 'tatli' ? 'all' : 'tatli')}
            className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              selectedCategory === 'tatli'
                ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/40'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedCategory === 'tatli'
                    ? 'bg-[#10B981] text-[#0F172A]'
                    : 'bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20'
                }`}
              >
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {isTr ? 'Tatlı Su Türleri' : 'Freshwater Species'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr ? 'Nehir, Göl & Baraj Balıkları' : 'Rivers, Lakes & Streams'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {freshwaterCount} {isTr ? 'Tür' : 'Species'}
              </span>
            </div>
          </motion.button>

          {/* Tuzlu Su Category Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(selectedCategory === 'tuzlu' ? 'all' : 'tuzlu')}
            className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              selectedCategory === 'tuzlu'
                ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-500/40'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedCategory === 'tuzlu'
                    ? 'bg-cyan-400 text-[#0F172A]'
                    : 'bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/20'
                }`}
              >
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {isTr ? 'Tuzlu Su Türleri' : 'Saltwater Species'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr ? 'Deniz & Kıyı Balıkları' : 'Seas & Coastal Waters'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {saltwaterCount} {isTr ? 'Tür' : 'Species'}
              </span>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
