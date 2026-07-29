'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import OltaAppLogo from './OltaAppLogo';

const SPLASH_SESSION_KEY = 'oltaapp_splash_shown_v1';

function shouldShowNativeSplash() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) !== 'true';
  } catch {
    return true;
  }
}

export default function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(shouldShowNativeSplash);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    } catch {}

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center px-4 overflow-hidden select-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none" />

          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.55, 0.25]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute w-32 h-32 rounded-[2rem] bg-emerald-500/20 blur-xl"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute w-28 h-28 rounded-[1.75rem] border-2 border-dashed border-emerald-500/35"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative z-10"
            >
              <OltaAppLogo className="w-24 h-24 rounded-[1.35rem] shadow-2xl shadow-emerald-500/25" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl font-extrabold tracking-wider text-white">
              OltaApp
            </h1>
            <p className="mt-2 text-xs font-semibold text-emerald-400/90 uppercase tracking-widest">
              Dijital Balıkçılık & Livar
            </p>
          </motion.div>

          <div className="w-44 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden relative border border-slate-700/60 shadow-inner">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 text-[11px] text-slate-400 tracking-wider font-medium"
          >
            Türkiye Amatör Balıkçılık Topluluğu
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
