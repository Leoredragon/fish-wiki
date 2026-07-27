'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Crown, ShieldCheck } from 'lucide-react';
import { useLocale } from 'next-intl';

interface ProLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ProLockModal({
  isOpen,
  onClose,
  title,
  description
}: ProLockModalProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  if (!isOpen) return null;

  const defaultTitle = isTr ? 'PRO Özellik 🔒' : 'PRO Feature 🔒';
  const defaultDesc = isTr
    ? 'Bu özellik sadece oltaApp PRO üyelerinde bulunmaktadır. 7 günlük solunar takvim, özel meralar, AI balık tanıma kamerası ve soru-cevap forumuna erişmek için PRO sürüme geçin.'
    : 'This feature is available exclusively for oltaApp PRO members. Upgrade to PRO to access 7-day solunar calendars, secret spots, AI fish camera, and Q&A forum.';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#0F172A] via-slate-900 to-[#0F172A] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full transition-all border border-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Badge & Lock Icon */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>oltaApp PRO ⚡</span>
            </div>

            <div className="relative p-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 my-1">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {title || defaultTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
              {description || defaultDesc}
            </p>
          </div>

          {/* Features Preview List */}
          <div className="my-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTr ? '7 Günlük Solunar & Balık Avı Takvimi' : '7-Day Solunar Fishing Calendar'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTr ? 'Gizli Mera Sıcak Noktaları & Derinlikler' : 'Secret Spots & Depth Maps'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isTr ? 'Topluluk Hikayeleri & Soru-Cevap Forumu' : 'Stories & Q&A Forum'}</span>
            </div>
          </div>

          {/* Action CTA Button (Decorational TODO) */}
          <div className="space-y-2">
            <button
              onClick={() => {
                // TODO: Connect to RevenueCat / Google Play Billing API when ready for production in-app purchases
                alert(
                  isTr
                    ? '⚡ oltaApp PRO Simülasyonu:\n\nAdmin panelinden PRO Modu Toggle\'ını AÇIK konuma getirerek tüm kilitli özellikleri anında test edebilirsiniz!'
                    : '⚡ oltaApp PRO Simulation:\n\nToggle PRO Mode in Admin Panel to unlock all features instantly for testing!'
                );
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{isTr ? "PRO'ya Geç (Test Modu)" : 'Upgrade to PRO (Test Mode)'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isTr ? 'Kapat ve Devam Et' : 'Close and Continue'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
