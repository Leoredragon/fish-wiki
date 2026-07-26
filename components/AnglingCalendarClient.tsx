'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Calendar,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flame,
  Waves,
  Mountain,
  Award
} from 'lucide-react';

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface CalendarSpecies {
  id: string;
  nameTr: string;
  nameEn: string;
  scientificName: string;
  waterType: 'Tuzlu Su' | 'Tatlı Su';
  image: string;
  peakMonths: number[]; // 1-12
  mediumMonths: number[];
  closedPeriodTr?: string;
  closedPeriodEn?: string;
  minSizeLimit?: string;
  recommendedLureTr: string;
  recommendedLureEn: string;
}

const ALL_SPECIES_CALENDAR: CalendarSpecies[] = [
  {
    id: 'lufer',
    nameTr: 'Lüfer & Çinekop',
    nameEn: 'Bluefish',
    scientificName: 'Pomatomus saltatrix',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    peakMonths: [9, 10, 11, 12],
    mediumMonths: [1, 5, 8],
    minSizeLimit: '18 cm',
    recommendedLureTr: 'Kurşun Arkası Rapala, Hansen Kaşık, Yaprak Yem',
    recommendedLureEn: 'Metal Spoons, Hard Minnows, Cut Bait'
  },
  {
    id: 'levrek',
    nameTr: 'Deniz Levreği',
    nameEn: 'European Seabass',
    scientificName: 'Dicentrarchus labrax',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    peakMonths: [10, 11, 12, 1, 2, 3],
    mediumMonths: [4, 5, 9],
    minSizeLimit: '25 cm',
    recommendedLureTr: 'Su Üstü Popper (WTD), Silikon Raglou, Minnow Maket',
    recommendedLureEn: 'Topwater WTD, Soft Plastics, Hard Minnows'
  },
  {
    id: 'cupra',
    nameTr: 'Çupra (Çipura)',
    nameEn: 'Gilt-head Bream',
    scientificName: 'Sparus aurata',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    peakMonths: [9, 10, 11, 4, 5],
    mediumMonths: [6, 7, 8, 12],
    minSizeLimit: '20 cm',
    recommendedLureTr: 'Yengeç, Mamun, Boru Kurdu, Gezer Kurşunlu Takım',
    recommendedLureEn: 'Crab, Marine Worms, Sliding Sinkers'
  },
  {
    id: 'palamut',
    nameTr: 'Palamut & Torik',
    nameEn: 'Atlantic Bonito',
    scientificName: 'Sarda sarda',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1516683018641-547af6c268df?auto=format&fit=crop&w=800&q=80',
    peakMonths: [9, 10, 11],
    mediumMonths: [8, 12],
    minSizeLimit: '25 cm',
    recommendedLureTr: 'Çapari (Tüy), Metal Kaşık, Striper Rapala',
    recommendedLureEn: 'Feather Rigs, Metal Spoons, Trolling Plugs'
  },
  {
    id: 'istavrit',
    nameTr: 'İstavrit',
    nameEn: 'Horse Mackerel',
    scientificName: 'Trachurus trachurus',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    peakMonths: [4, 5, 6, 9, 10, 11],
    mediumMonths: [1, 2, 3, 7, 8, 12],
    minSizeLimit: '13 cm',
    recommendedLureTr: 'İnce Çapari, Micro Jighead + Silikon (LRF)',
    recommendedLureEn: 'Sabiki Rigs, Micro Jigheads'
  },
  {
    id: 'sazan',
    nameTr: 'Aynalı Sazan',
    nameEn: 'Common Carp',
    scientificName: 'Cyprinus carpio',
    waterType: 'Tatlı Su',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    peakMonths: [6, 7, 8, 9, 10],
    mediumMonths: [5, 11],
    closedPeriodTr: '15 Mart - 15 Haziran (Av Yasağı)',
    closedPeriodEn: 'Mar 15 - Jun 15 (Closed Spawning Season)',
    minSizeLimit: '40 cm',
    recommendedLureTr: 'Boilie, Mısır Rig Montajı, Küspe',
    recommendedLureEn: 'Boilies, Hair Rigs, Sweetcorn'
  },
  {
    id: 'alabalik',
    nameTr: 'Alabalık (Abant Alası & Kırmızı Benekli)',
    nameEn: 'Trout',
    scientificName: 'Salmo trutta',
    waterType: 'Tatlı Su',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    peakMonths: [3, 4, 5, 9, 10],
    mediumMonths: [6, 11],
    closedPeriodTr: '1 Ekim - 28 Şubat (Av Yasağı)',
    closedPeriodEn: 'Oct 1 - Feb 28 (Closed Season)',
    minSizeLimit: '25 cm',
    recommendedLureTr: 'Mepps Döner Kaşık, Micro Kaşık, Fly Sineği',
    recommendedLureEn: 'Mepps Spinners, Micro Spoons, Fly Lures'
  },
  {
    id: 'kalamar',
    nameTr: 'Kalamar & Sübye',
    nameEn: 'Squid & Cuttlefish',
    scientificName: 'Loligo vulgaris',
    waterType: 'Tuzlu Su',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    peakMonths: [10, 11, 12, 1, 2],
    mediumMonths: [3, 9],
    recommendedLureTr: 'EGI Kalamar Zokası (2.5 - 3.0)',
    recommendedLureEn: 'EGI Squid Jigs (2.5 - 3.0)'
  }
];

export default function AnglingCalendarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [waterFilter, setWaterFilter] = useState<'all' | 'Tuzlu Su' | 'Tatlı Su'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'heatmap'>('cards');

  const months = isTr ? MONTHS_TR : MONTHS_EN;

  const filteredSpecies = ALL_SPECIES_CALENDAR.filter((item) => {
    const matchesWater = waterFilter === 'all' || item.waterType === waterFilter;
    const isPeak = item.peakMonths.includes(selectedMonth);
    const isMedium = item.mediumMonths.includes(selectedMonth);
    return matchesWater && (isPeak || isMedium);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 pt-2 px-4 sm:px-6">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-3"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isTr ? 'Aylık Av Takvimi & Zirve Sezon Rehberi' : 'Monthly Angling Calendar & Peak Guide'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Hangi Balık Hangi Ayda Avlanır?' : 'Which Fish to Target This Month?'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Yılın 12 ayı boyunca deniz ve tatlı su balıklarının zirve av dönemlerini, av yasaklarını ve önerilen takımları keşfedin.'
              : 'Explore peak monthly seasonal activity, closed spawning seasons, and recommended gear throughout the year.'}
          </p>
        </div>
      </motion.section>

      {/* Control Bar: Month Selector & Water Type Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
              {isTr ? 'Ay ve Su Tipi Seçimi' : 'Month & Water Type'}
            </h2>
          </div>

          {/* Water Type Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setWaterFilter('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                waterFilter === 'all' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tüm Sular' : 'All Waters'}
            </button>

            <button
              onClick={() => setWaterFilter('Tuzlu Su')}
              className={`px-3 py-1 rounded-xl transition-all flex items-center space-x-1 ${
                waterFilter === 'Tuzlu Su' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>{isTr ? 'Tuzlu Su' : 'Saltwater'}</span>
            </button>

            <button
              onClick={() => setWaterFilter('Tatlı Su')}
              className={`px-3 py-1 rounded-xl transition-all flex items-center space-x-1 ${
                waterFilter === 'Tatlı Su' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="w-3 h-3" />
              <span>{isTr ? 'Tatlı Su' : 'Freshwater'}</span>
            </button>
          </div>
        </div>

        {/* 12 Months Grid Bar */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-1">
          {months.map((mName, idx) => {
            const mNum = idx + 1;
            const isSelected = selectedMonth === mNum;
            return (
              <button
                key={mNum}
                onClick={() => setSelectedMonth(mNum)}
                className={`py-2 px-1.5 rounded-xl text-xs font-extrabold transition-all border text-center ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md scale-102 ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                {mName}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher: Target Cards vs 12-Month Heatmap Table */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-extrabold text-[#0F172A] flex items-center space-x-2">
          <Flame className="w-4 h-4 text-emerald-600" />
          <span>
            {months[selectedMonth - 1]} {isTr ? 'Ayında Zirve Yapan Balık Türleri' : 'Peak Target Species'}
          </span>
        </h3>

        <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'cards' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            {isTr ? 'Kart Görünümü' : 'Cards'}
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'heatmap' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            {isTr ? '12 Ay Yıllık Matris 📊' : '12-Month Matrix'}
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpecies.map((fish) => {
            const isPeak = fish.peakMonths.includes(selectedMonth);
            return (
              <motion.div
                key={fish.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${
                        isPeak
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isPeak ? (isTr ? 'Zirve Sezon 🔥' : 'Peak Season') : (isTr ? 'Orta Derece' : 'Moderate')}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-500">{fish.waterType}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-[#0F172A] tracking-tight">{isTr ? fish.nameTr : fish.nameEn}</h4>
                    <p className="text-xs italic text-emerald-600 font-semibold mt-0.5">{fish.scientificName}</p>
                  </div>

                  {/* Legal Min Size & Closed Season Badges */}
                  <div className="space-y-1.5 pt-1">
                    {fish.minSizeLimit && (
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{isTr ? `Yasal Asgari Boy: ${fish.minSizeLimit}` : `Min Size: ${fish.minSizeLimit}`}</span>
                      </div>
                    )}

                    {fish.closedPeriodTr && (
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{isTr ? fish.closedPeriodTr : fish.closedPeriodEn}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">{isTr ? 'Önerilen Yem & Takım:' : 'Gear:'}</span>{' '}
                    {isTr ? fish.recommendedLureTr : fish.recommendedLureEn}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: 12-MONTH HEATMAP TABLE */}
      {viewMode === 'heatmap' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs overflow-x-auto space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {isTr ? 'Türlerin 12 Aylık Av Sezonu Haritası (Yeşil: Zirve, Sarı: Orta)' : '12-Month Peak Season Matrix'}
          </div>

          <div className="min-w-[650px] space-y-2">
            {ALL_SPECIES_CALENDAR.map((fish) => (
              <div key={fish.id} className="flex items-center border-b border-slate-100 pb-2 pt-1 text-xs">
                <div className="w-44 font-extrabold text-[#0F172A] truncate pr-2">
                  {isTr ? fish.nameTr : fish.nameEn}
                </div>

                <div className="flex-1 grid grid-cols-12 gap-1 text-center font-extrabold">
                  {months.map((m, idx) => {
                    const mNum = idx + 1;
                    const isPeak = fish.peakMonths.includes(mNum);
                    const isMed = fish.mediumMonths.includes(mNum);
                    return (
                      <div
                        key={mNum}
                        className={`py-1.5 rounded-md text-[10px] transition-all ${
                          isPeak
                            ? 'bg-emerald-500 text-white font-black'
                            : isMed
                            ? 'bg-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-100 text-slate-400 font-normal'
                        }`}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
