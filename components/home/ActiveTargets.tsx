'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1 to 12
  if (month >= 3 && month <= 5) return 'İlkbahar';
  if (month >= 6 && month <= 8) return 'Yaz';
  if (month >= 9 && month <= 11) return 'Sonbahar';
  return 'Kış';
}

function getSeasonNameEn(trSeason: string) {
  switch (trSeason) {
    case 'İlkbahar': return 'Spring';
    case 'Yaz': return 'Summer';
    case 'Sonbahar': return 'Autumn';
    case 'Kış': return 'Winter';
    default: return trSeason;
  }
}

function getMonthNameTr(month: number) {
  const names = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return names[month - 1];
}
function getMonthNameEn(month: number) {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[month - 1];
}

export default function ActiveTargets() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [fishes, setFishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().getMonth() + 1;
  const seasonTr = getCurrentSeason();
  const seasonEn = getSeasonNameEn(seasonTr);
  const monthName = isTr ? getMonthNameTr(currentMonth) : getMonthNameEn(currentMonth);

  useEffect(() => {
    const fetchActiveFishes = async () => {
      setLoading(true);
      const supabase = createClient();
      
      // We want to fetch fishes where active_seasons contains our current season
      const { data, error } = await supabase
        .from('fishes')
        .select('*')
        .eq('is_active', true)
        .ilike('active_seasons', `%${seasonTr}%`)
        .limit(6);
        
      if (data) {
        setFishes(data);
      }
      setLoading(false);
    };

    fetchActiveFishes();
  }, [seasonTr]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (fishes.length === 0) return null;

  return (
    <div className="my-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] flex items-center space-x-2">
            <span>{isTr ? `${monthName} Ayı Aktif Hedefleri` : `Active Targets in ${monthName}`}</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isTr ? `İçinde bulunduğumuz ${seasonTr} mevsimine göre en verimli avlar.` : `Best catches for the current ${seasonEn} season.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fishes.map((fish, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={fish.id}
          >
            <Link 
              href={`/fish/${fish.id}`}
              className="block group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {fish.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fish.image_url} alt={fish.name_tr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 font-bold text-lg">
                    {isTr ? 'Görsel Yok' : 'No Image'}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {isTr ? fish.water_type : (fish.water_type === 'Tuzlu Su' ? 'Saltwater' : 'Freshwater')}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-[#0F172A] text-lg group-hover:text-emerald-600 transition-colors">
                  {isTr ? fish.name_tr : fish.name_en}
                </h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">
                  {isTr ? fish.short_info_tr : fish.short_info_en}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-semibold text-xs tracking-wide uppercase">
                  <span>{isTr ? 'Detayları Gör' : 'View Details'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
