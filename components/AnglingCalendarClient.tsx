'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { RICH_MOCK_FISHES } from './FishGrid';
import { Link } from '@/i18n/routing';
import {
  Calendar,
  Waves,
  Mountain,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Mapping species active months for calendar matrix
const SPECIES_MONTHLY_ACTIVITY: Record<string, number[]> = {
  m1: [3, 4, 5, 9, 10, 11], // Abant Alası: İlkbahar & Sonbahar
  m2: [5, 6, 7, 8, 9, 10], // Tatlı Su Kefali: Yaz & Sonbahar
  m3: [6, 7, 8, 9, 10],    // Aynalı Sazan: Yaz & Sonbahar
  m4: [9, 10, 11, 12, 1],  // Deniz Levreği: Sonbahar & Kış
  m5: [4, 5, 9, 10, 11],   // Çupra: İlkbahar & Sonbahar
  m6: [9, 10, 11]          // Lüfer: Sonbahar (Eylül-Kasım)
};

export default function AnglingCalendarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const months = isTr ? MONTHS_TR : MONTHS_EN;

  const filteredFishes = RICH_MOCK_FISHES.filter((fish) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'tatli' && fish.water_type?.toLowerCase().includes('tatlı')) ||
      (selectedCategory === 'tuzlu' && fish.water_type?.toLowerCase().includes('tuzlu'));

    const activeMonths = SPECIES_MONTHLY_ACTIVITY[fish.id || ''] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const isMonthActive = activeMonths.includes(selectedMonth);

    return matchesCategory && isMonthActive;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isTr ? 'Aylık Av Takvimi & Sezon Rehberi' : 'Monthly Angling Calendar & Peak Guide'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Hangi Balık Hangi Ayda Avlanır?' : 'Which Fish Species to Target This Month?'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Yılın 12 ayı boyunca deniz ve tatlı su balıklarının zirve av dönemlerini, üreme yasağı tarihlerini ve dönemsel davranışlarını takip edin.'
              : 'Track peak monthly seasonal activity, closed spawning periods, and optimal angling windows for marine and freshwater species throughout the year.'}
          </p>
        </div>
      </motion.section>

      {/* Month Selector Carousel / Tabs */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{isTr ? 'Ay Seçin' : 'Select Month'}</span>
          </h2>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTr ? 'Tümü' : 'All'}
            </button>
            <button
              onClick={() => setSelectedCategory('tatli')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'tatli'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTr ? 'Tatlı Su' : 'Freshwater'}
            </button>
            <button
              onClick={() => setSelectedCategory('tuzlu')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'tuzlu'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTr ? 'Tuzlu Su' : 'Saltwater'}
            </button>
          </div>
        </div>

        {/* 12 Month Grid / Scroll */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {months.map((mName, idx) => {
            const mNum = idx + 1;
            const isSelected = selectedMonth === mNum;
            return (
              <button
                key={mNum}
                onClick={() => setSelectedMonth(mNum)}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all border text-center ${
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

      {/* Active Species for Selected Month */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>
              {months[selectedMonth - 1]} {isTr ? 'Ayında Zirve Yapan Balık Türleri' : 'Peak Target Species'}
            </span>
          </h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {filteredFishes.length} {isTr ? 'Tür Aktif' : 'Species Active'}
          </span>
        </div>

        {filteredFishes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Info className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              {isTr ? 'Seçilen ay ve kategoride aktif tür bulunamadı.' : 'No active species found for selected month.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFishes.map((fish) => {
              const name = isTr ? fish.name_tr : fish.name_en;
              const shortInfo = isTr ? fish.short_info_tr : fish.short_info_en;

              return (
                <motion.div
                  key={fish.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isTr ? 'Sezon Zirvesi' : 'Peak Season'}</span>
                      </span>

                      <span className="text-xs font-semibold text-slate-500">
                        {fish.water_type}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-[#0F172A] tracking-tight">{name}</h4>
                      {fish.scientific_name && (
                        <p className="text-xs italic text-emerald-600 font-medium">{fish.scientific_name}</p>
                      )}
                    </div>

                    {shortInfo && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {shortInfo}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[180px]">
                      {fish.recommended_gear}
                    </span>

                    <Link
                      href={`/fish/${fish.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#0F172A] hover:text-emerald-600 transition-colors"
                    >
                      <span>{isTr ? 'İncele' : 'View'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
