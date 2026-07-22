'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { MapPin, Compass, Anchor, Sparkles } from 'lucide-react';

interface Region {
  id: string;
  nameTr: string;
  nameEn: string;
  waterType: string;
  descriptionTr: string;
  descriptionEn: string;
  popularSpeciesTr: string[];
  popularSpeciesEn: string[];
  recommendedGearTr: string;
  recommendedGearEn: string;
  pinCoordinates: { cx: number; cy: number };
}

const REGIONS: Region[] = [
  {
    id: 'bosphorus',
    nameTr: 'İstanbul Boğazı & Marmara',
    nameEn: 'Bosphorus & Marmara Sea',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Karadeniz ile Akdeniz arasındaki balık göç koridoru. Akıntılı suları ve kıyı meralarıyla lüfer, palamut ve istavrit avcılığının başkentidir.',
    descriptionEn: 'Major migratory corridor between the Black Sea and Mediterranean. Famous for Bluefish, Bonito, and European Seabass.',
    popularSpeciesTr: ['Lüfer', 'Deniz Levreği', 'İstavrit', 'Palamut'],
    popularSpeciesEn: ['Bluefish', 'European Seabass', 'Horse Mackerel', 'Atlantic Bonito'],
    recommendedGearTr: 'Spinning, Kurşun Arkası Rapala, Hansen Kaşık, Uzun Olta',
    recommendedGearEn: 'Heavy Spinning, Metal Spoons, Wire Rigs',
    pinCoordinates: { cx: 215, cy: 95 }
  },
  {
    id: 'aegean',
    nameTr: 'Ege Kıyıları (İzmir, Çeşme, Ayvalık)',
    nameEn: 'Aegean Coast (Izmir, Cesme)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Girintili çıkıntılı koyları ve sığ kayalık meralarıyla Türkiye’nin en zengin çupra, levrek ve kalamar meralarına ev sahipliği yapar.',
    descriptionEn: 'Indented coastline offering premier habitat for Gilt-head Bream, Seabass, and Squid.',
    popularSpeciesTr: ['Çupra', 'Deniz Levreği', 'Kalamar', 'Akya'],
    popularSpeciesEn: ['Gilt-head Bream', 'European Seabass', 'Squid', 'Amberjack'],
    recommendedGearTr: 'Yemli Gezer Kurşunlu Dip Takımı, LRF, EGI Kalamar Zokası',
    recommendedGearEn: 'Bottom Rigs with Marine Worms, EGI Squid Jigs, LRF',
    pinCoordinates: { cx: 135, cy: 210 }
  },
  {
    id: 'mediterranean',
    nameTr: 'Akdeniz Kıyıları (Antalya, Alanya, Fethiye)',
    nameEn: 'Mediterranean Coast (Antalya, Fethiye)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Derin mavi sular ve kayalık kanyonlar. Büyük trofe balıklar (Grida, Akya, Kuzu) için derin su jigging ve trolling imkanı sunar.',
    descriptionEn: 'Deep waters and underwater canyons offering trophy pelagic fishing for Amberjack and Groupers.',
    popularSpeciesTr: ['Akya', 'Grida (Lagos)', 'Kuzu Balığı', 'Çupra'],
    popularSpeciesEn: ['Amberjack', 'White Grouper', 'Greater Amberjack', 'Bream'],
    recommendedGearTr: 'Slow Jigging, Sırtı (Trolling), Ağır Dip Oltası',
    recommendedGearEn: 'Slow Jigging, Offshore Trolling, Heavy Bottom Tackle',
    pinCoordinates: { cx: 310, cy: 285 }
  },
  {
    id: 'blacksea',
    nameTr: 'Karadeniz (Trabzon, Rize, Sinop)',
    nameEn: 'Black Sea (Trabzon, Sinop)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Dalgalı açık sular ve kumluk dipler. Dip avcılığında kalkan, mezgit ve zargana avı oldukça yaygındır.',
    descriptionEn: 'Open sea and sandy seabed structure. Renowned for Turbot, Whiting, and Needlefish.',
    popularSpeciesTr: ['Kalkan', 'Mezgit', 'İstavrit', 'Lüfer'],
    popularSpeciesEn: ['Turbot', 'Whiting', 'Horse Mackerel', 'Bluefish'],
    recommendedGearTr: 'Surfcasting Dip Takımı, Çapari, Kaşık',
    recommendedGearEn: 'Surfcasting Rigs, Sabiki Rigs, Metal Spoons',
    pinCoordinates: { cx: 580, cy: 75 }
  },
  {
    id: 'abant_lakes',
    nameTr: 'Bolu & Göller Bölgesi (Abant, İznik)',
    nameEn: 'Bolu & Lake District (Abant, Iznik)',
    waterType: 'Tatlı Su',
    descriptionTr: 'Yüksek irtifa dereleri ve sakin göl meraları. Endemik Abant Alası ve trofe sazan avcılığının kalbidir.',
    descriptionEn: 'High-altitude mountain streams and peaceful lakes hosting endemic trout and specimen carp.',
    popularSpeciesTr: ['Abant Alası', 'Aynalı Sazan', 'Tatlı Su Kefali'],
    popularSpeciesEn: ['Abant Trout', 'Mirror Carp', 'Chub'],
    recommendedGearTr: 'Fly-Fishing, Boilie Sazan Montajı, LRF Micro Kaşık',
    recommendedGearEn: 'Fly-Fishing, Hair Rigs with Boilies, Micro Lures',
    pinCoordinates: { cx: 290, cy: 120 }
  }
];

export default function RegionMapClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isTr ? 'İnteraktif Av Meraları ve Harita Rehberi' : 'Interactive Angling Map & Spot Guide'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Türkiye’nin Popüler Balıkçılık Meraları' : 'Premier Fishing Locations of Turkey'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Harita üzerindeki av bölgelerine tıklayarak verimli meraları, hedef balık türlerini ve kullanılan olta takımlarını keşfedin.'
              : 'Click on the interactive map regions to explore fishing spots, target species, and optimal tackle rigs.'}
          </p>
        </div>
      </motion.section>

      {/* Interactive Vector Turkey Map Card */}
      <div className="bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              {isTr ? 'Tıklamalı Türkiye Av Haritası' : 'Interactive Turkey Fishing Map'}
            </h2>
          </div>

          <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            {isTr ? 'Haritadan Bölge Seçin' : 'Click Region on Map'}
          </span>
        </div>

        {/* SVG Map Container */}
        <div className="relative w-full aspect-[2.2/1] bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 750 340"
            className="w-full h-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="turkeyBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Stylized Turkey Land Polygon */}
            <path
              d="M 120 70 L 220 55 L 350 45 L 520 40 L 680 65 L 720 120 L 710 180 L 630 220 L 520 230 L 400 240 L 300 290 L 190 280 L 110 240 L 100 170 L 120 70 Z"
              fill="url(#turkeyBg)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Sea Boundaries Visual Indicator Lines */}
            {/* Karadeniz Coast Arc */}
            <path d="M 120 70 Q 400 30 680 65" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            {/* Ege Coast Arc */}
            <path d="M 120 70 Q 90 170 110 240" fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            {/* Akdeniz Coast Arc */}
            <path d="M 110 240 Q 300 310 630 220" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

            {/* Interactive Pins for Each Region */}
            {REGIONS.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              const { cx, cy } = reg.pinCoordinates;

              return (
                <g
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      className="fill-emerald-500/20 stroke-emerald-400 animate-ping opacity-75"
                      strokeWidth="1"
                    />
                  )}

                  {/* Pin Base Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? '12' : '9'}
                    className={`transition-all duration-300 ${
                      isSelected
                        ? 'fill-emerald-500 stroke-white'
                        : 'fill-slate-700 hover:fill-emerald-400 stroke-slate-500'
                    }`}
                    strokeWidth="2"
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Pin Center Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill={isSelected ? '#0F172A' : '#FFFFFF'}
                  />

                  {/* Region Label Tag */}
                  <text
                    x={cx}
                    y={cy - 16}
                    textAnchor="middle"
                    className={`text-[11px] font-extrabold tracking-wide transition-all ${
                      isSelected ? 'fill-emerald-300 font-black scale-110' : 'fill-slate-300 group-hover:fill-white'
                    }`}
                  >
                    {isTr ? reg.nameTr.split(' ')[0] : reg.nameEn.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Region Selector Pills */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Bölge Listesi' : 'Select Region'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {REGIONS.map((reg) => {
            const isSelected = selectedRegion.id === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg)}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <span>{isTr ? reg.nameTr : reg.nameEn}</span>
                <span className={`text-[10px] mt-2 font-semibold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {reg.waterType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Region Detailed Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRegion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {isTr ? selectedRegion.nameTr : selectedRegion.nameEn}
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedRegion.waterType}
                </span>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold">
              {isTr ? 'Aktif Av Merası' : 'Active Spot'}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {isTr ? selectedRegion.descriptionTr : selectedRegion.descriptionEn}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Species */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isTr ? 'Hedef Balık Türleri' : 'Target Species'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isTr ? selectedRegion.popularSpeciesTr : selectedRegion.popularSpeciesEn).map((sp, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald-950 border border-emerald-200 font-bold px-3 py-1.5 rounded-2xl text-xs flex items-center space-x-1"
                  >
                    <span>{sp}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Gear for Region */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Anchor className="w-4 h-4 text-slate-700" />
                <span>{isTr ? 'Merada Çalışan Takımlar' : 'Effective Tackle & Rigs'}</span>
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/60">
                {isTr ? selectedRegion.recommendedGearTr : selectedRegion.recommendedGearEn}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
