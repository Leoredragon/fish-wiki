'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Camera, BookOpen, CloudSun, ChevronRight, X } from 'lucide-react';
import { isNativeApp } from '@/lib/capacitorUtils';

const STORAGE_KEY = 'oltaapp_onboarding_v1';

const STEPS = [
  {
    icon: Users,
    titleTr: 'Toplulukla başla',
    titleEn: 'Start with Community',
    bodyTr: 'Uygulama açılınca Av Akışı seni karşılar. Av paylaş, hikâye at, diğer balıkçıları tebrik et.',
    bodyEn: 'Community feed is your home. Share catches, post stories, and congratulate fellow anglers.'
  },
  {
    icon: Camera,
    titleTr: 'Avını kaydet',
    titleEn: 'Log your catch',
    bodyTr: 'Fotoğraf + balık türü + boy/kilo ekle. Tür rozetine basınca ansiklopedi sayfası açılır.',
    bodyEn: 'Add photo, species, length and weight. Tap the species badge to open the encyclopedia.'
  },
  {
    icon: CloudSun,
    titleTr: 'Günlük av skoru',
    titleEn: 'Daily fishing score',
    bodyTr: 'Akışın üstündeki şerit bugünün av koşulunu gösterir. Dokununca hava durumu sayfasına gidersin.',
    bodyEn: 'The strip above the feed shows today’s conditions. Tap it to open the weather page.'
  },
  {
    icon: BookOpen,
    titleTr: 'Wiki & yasal boy',
    titleEn: 'Wiki & legal size',
    bodyTr: 'Balık detayında yasal boy ve yasak dönemlerini bul. Boy girilmiş avlarda yasal durum rozeti görünür.',
    bodyEn: 'Check legal sizes and ban periods on species pages. Catch cards show a legal-size badge when length is set.'
  }
];

export default function AppOnboardingTour() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'done') return;
      // Native: after splash settles. Web: first community/home visit.
      const delay = isNativeApp() ? 1800 : 800;
      const t = setTimeout(() => setOpen(true), delay);
      return () => clearTimeout(t);
    } catch {}
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'done');
    } catch {}
    setOpen(false);
  };

  const next = () => {
    if (step >= STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  };

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                {isTr ? `Nasıl kullanılır · ${step + 1}/${STEPS.length}` : `How to use · ${step + 1}/${STEPS.length}`}
              </span>
              <button type="button" onClick={finish} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-[#0F172A]">
                {isTr ? current.titleTr : current.titleEn}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isTr ? current.bodyTr : current.bodyEn}
              </p>
              <div className="flex justify-center gap-1.5 pt-1">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-emerald-500' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <button
                type="button"
                onClick={finish}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50"
              >
                {isTr ? 'Atla' : 'Skip'}
              </button>
              <button
                type="button"
                onClick={next}
                className="flex-[1.4] py-3 rounded-xl text-sm font-bold bg-[#0F172A] text-white flex items-center justify-center gap-1.5"
              >
                <span>{step >= STEPS.length - 1 ? (isTr ? 'Başla' : 'Get started') : (isTr ? 'Devam' : 'Next')}</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
