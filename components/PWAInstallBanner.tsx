/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';

export default function PWAInstallBanner() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    // Check if user already dismissed banner in the last 7 days
    const dismissed = localStorage.getItem('oltapp_pwa_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Don't show for 7 days after dismiss
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    // Listen for Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert(
        isTr
          ? 'iPhone kullanıcıları için: Safari menüsündeki "Paylaş" (↑) butonuna dokunun ve "Ana Ekrana Ekle" seçeneğini seçin. 📲'
          : 'For iPhone users: Tap the "Share" (↑) button in Safari menu and select "Add to Home Screen". 📲'
      );
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('oltapp_pwa_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] text-white border-b border-emerald-500/30 sticky top-16 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 text-xs font-black text-white">
                <span className="truncate">{isTr ? 'OltaApp Mobil Uygulamasını Yükle 📲' : 'Install OltaApp Mobile App'}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-md border border-emerald-500/30 hidden sm:inline-block">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                {isTr ? 'Tek tıkla telefonunun ana ekranına ekle, tam ekran ve hızlı kullan!' : 'Add to home screen for full-screen experience!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-[#0F172A] font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isTr ? 'Uygulamayı Kur' : 'Install App'}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title={isTr ? 'Kapat' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
