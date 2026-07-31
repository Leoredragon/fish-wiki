'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { Browser } from '@capacitor/browser';
import { isNativeApp, triggerHapticLight } from '@/lib/capacitorUtils';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.oltaapp.app';
const STORAGE_KEY = 'oltaapp_rate_prompt_v1';
const MIN_OPENS = 5;
const MIN_DAYS_SINCE_FIRST_OPEN = 2;
const SNOOZE_DAYS = 7;

type RateState = {
  opens: number;
  firstOpenAt: number;
  answered: boolean;
  snoozedUntil: number;
};

function loadState(): RateState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { opens: 0, firstOpenAt: Date.now(), answered: false, snoozedUntil: 0 };
}

function saveState(state: RateState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export default function RateAppPrompt() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isNativeApp()) return;

    const state = loadState();
    state.opens += 1;
    saveState(state);

    if (state.answered) return;
    if (Date.now() < state.snoozedUntil) return;
    if (state.opens < MIN_OPENS) return;
    if (Date.now() - state.firstOpenAt < MIN_DAYS_SINCE_FIRST_OPEN * 24 * 60 * 60 * 1000) return;

    // Show after a short delay so it doesn't collide with the splash screen
    const timer = window.setTimeout(() => setVisible(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  const markAnswered = () => {
    const state = loadState();
    state.answered = true;
    saveState(state);
    setVisible(false);
  };

  const handleRate = async () => {
    triggerHapticLight();
    markAnswered();
    try {
      await Browser.open({ url: PLAY_STORE_URL });
    } catch {
      window.open(PLAY_STORE_URL, '_blank');
    }
  };

  const handleLater = () => {
    triggerHapticLight();
    const state = loadState();
    state.snoozedUntil = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    saveState(state);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-center"
          >
            <div className="w-14 h-14 mx-auto bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center">
              <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-[#0F172A]">
                {isTr ? 'Olta App işine yarıyor mu?' : 'Enjoying Olta App?'}
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {isTr
                  ? 'Play Store\u2019da yapacağın kısa bir değerlendirme, uygulamanın daha çok balıkçıya ulaşmasını sağlar.'
                  : 'A quick rating on the Play Store helps more anglers discover the app.'}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleRate}
                className="w-full flex items-center justify-center space-x-2 bg-[#0F172A] hover:bg-slate-800 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{isTr ? 'Değerlendir' : 'Rate the app'}</span>
              </button>
              <button
                onClick={handleLater}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-sm transition-colors"
              >
                {isTr ? 'Daha sonra' : 'Maybe later'}
              </button>
            </div>
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 font-medium">
              <Heart className="w-3 h-3 text-rose-400" />
              <span>{isTr ? 'Desteğin için teşekkürler!' : 'Thanks for your support!'}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
