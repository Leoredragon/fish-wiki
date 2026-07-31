'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Compass, Flame, ShieldCheck, HeartHandshake, MapPin, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AboutClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 pt-6">
      
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-slate-800 text-center sm:text-left"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>{isTr ? 'Biz Kimiz & Misyonumuz' : 'Who We Are & Our Mission'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isTr ? 'Doğanın Tutkusu, Teknolojinin Gücü' : 'Passion of Nature, Power of Tech'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {isTr 
              ? 'Düzce merkezli operasyonumuzla Türkiye’nin dört bir yanındaki amatör balıkçılara rehberlik ediyoruz.' 
              : 'Guided by our Düzce-based operations, we empower amateur anglers across Turkey.'}
          </p>

          <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
            App sürümü / Version: 1.6.2
          </p>
        </div>
      </motion.div>

      {/* Main Story Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              {isTr ? 'Oltapp (Livar) Doğuş Hikayesi' : 'The Story of Oltapp (Livar)'}
            </h2>
            <span className="text-xs text-slate-400 font-medium">Düzce, Türkiye</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
          <p className="font-medium text-slate-800 bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
            &ldquo;{isTr 
              ? 'Doğa kampı, bushcraft, LRF ve Fly-fishing tutkusunu teknolojiyle buluşturan bu platform, teknoloji ve operasyon yönetimi tecrübesiyle harmanlanarak Düzce merkezli bir operasyonla tüm Türkiye’deki amatör balıkçılara rehber olmak üzere tasarlandı. Amacımız sürdürülebilir avcılığı desteklemek ve balıkçılık kültürünü dijital bir asistanla geleceğe taşımak.'
              : 'Combining a passion for outdoor camping, bushcraft, LRF, and Fly-fishing with modern technology, this platform was designed as a Düzce-based operation to guide amateur anglers across Turkey. Our goal is to support sustainable fishing and carry angling culture into the future with a digital assistant.'}&rdquo;
          </p>
        </div>
      </motion.div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#0F172A]">{isTr ? 'Sürdürülebilir Avcılık' : 'Sustainable Fishing'}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {isTr ? 'Resmi 5/2 sirkülerindeki yasal alt boy ve av zamanı sınırlarına hassasiyetle uyulmasını teşvik ediyoruz.' : 'Encouraging strict adherence to official legal size limits and seasonal regulations.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#0F172A]">{isTr ? 'Akıllı Dijital Asistan' : 'Smart Digital Assistant'}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {isTr ? 'Hava durumu, rüzgar, basınç ve av koşulu skoru ile meraya uygun takım tavsiyeleri.' : 'Weather, wind, pressure, fishing condition score, and spot-specific tackle recommendations.'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#0F172A]">{isTr ? 'Topluluk Gücü' : 'Community Driven'}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {isTr ? 'Balıkçıların birbiriyle tecrübe paylaştığı, trofe avların sergilendiği etik bir sosyal ekosistem.' : 'An ethical community ecosystem where anglers share insights and showcase trophy catches.'}
          </p>
        </motion.div>

      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-[#0F172A]">
            {isTr ? 'Yasal & Destek' : 'Legal & Support'}
          </h3>
          <p className="text-xs text-slate-500">
            {isTr
              ? 'Gizlilik politikası, kullanım şartları ve destek için buradan ulaşabilirsiniz.'
              : 'Reach privacy policy, terms of use, and support from here.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/privacy" className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100">
            {isTr ? 'Gizlilik' : 'Privacy'}
          </Link>
          <Link href="/terms" className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100">
            {isTr ? 'Şartlar' : 'Terms'}
          </Link>
          <a href="mailto:1317838@gmail.com" className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
            1317838@gmail.com
          </a>
        </div>
      </div>

    </div>
  );
}
