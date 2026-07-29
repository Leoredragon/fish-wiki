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
          {/* Subtle Ambient Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none" />

          {/* Animated Logo Container */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Pulsing Backlight Ring */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute w-28 h-28 rounded-3xl bg-emerald-500/20 blur-xl"
            />

            {/* Main Outer Hexagon/Circle Ring with Rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="w-24 h-24 rounded-3xl border-2 border-dashed border-emerald-500/40 flex items-center justify-center"
            />

            {/* Inner badge & spinning app logo */}
            <div className="absolute w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <motion.div
                animate={{ rotateY: [0, 180, 360] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <OltaAppLogo className="w-20 h-20 drop-shadow-md" />
              </motion.div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl font-extrabold tracking-wider text-white flex items-center justify-center space-x-2.5">
              <OltaAppLogo className="w-8 h-8" />
              <span>OltaApp</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <OltaAppLogo className="w-6 h-6 opacity-90" />
              </motion.div>
            </h1>
            <p className="mt-2 text-xs font-semibold text-emerald-400/90 uppercase tracking-widest">
              Dijital Balıkçılık & Livar
            </p>
          </motion.div>

          {/* Sleek Loading Bar */}
          <div className="w-44 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden relative border border-slate-700/60 shadow-inner">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full"
            />
          </div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 text-[11px] text-slate-400 tracking-wider font-medium flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <OltaAppLogo className="w-5 h-5" />
            </motion.div>
            <span>Türkiye Amatör Balıkçılık Topluluğu</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
