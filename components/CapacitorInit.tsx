'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { useRouter, usePathname } from 'next/navigation';
import { WifiOff, RefreshCw, Anchor } from 'lucide-react';
import { triggerHapticLight } from '@/lib/capacitorUtils';
import { createClient } from '@/lib/supabase/client';

const NOTIFICATION_PROMPT_SHOWN_KEY = 'oltaapp_notification_prompt_shown_v1';

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [isBackOnline, setIsBackOnline] = useState(false);
  const offlineRef = useRef(false);
  const loginRedirectDoneRef = useRef(false);
  const nativeBootedRef = useRef(false);

  // One-time native boot: status bar, network, notifications, back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || nativeBootedRef.current) return;
    nativeBootedRef.current = true;

    document.documentElement.classList.add('is-native-app');

    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0F172A' }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});

    Network.getStatus()
      .then((status) => {
        const offline = !status.connected;
        offlineRef.current = offline;
        setIsOffline(offline);
      })
      .catch(() => {});

    const netListener = Network.addListener('networkStatusChange', (newStatus) => {
      const wasOffline = offlineRef.current;
      const nowOffline = !newStatus.connected;
      offlineRef.current = nowOffline;
      setIsOffline(nowOffline);
      if (newStatus.connected && wasOffline) {
        router.refresh();
        setIsBackOnline(true);
        setTimeout(() => setIsBackOnline(false), 2400);
      }
    });

    const scheduleDefaultLocalNotifications = async () => {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              id: 101,
              title: 'Günaydın Balıkçı! (oltaApp)',
              body: 'Bugün meralarda hava ve deniz koşulları harika! Balık iştah skorunu kontrol etmeyi unutma.',
              schedule: {
                on: { hour: 9, minute: 0 },
                repeats: true
              },
              smallIcon: 'ic_launcher',
              actionTypeId: '',
              extra: null
            },
            {
              id: 102,
              title: 'Günün En Verimli Av Saati!',
              body: 'Meralardan yeni av raporları var. Solunar tahminlerini incele.',
              schedule: {
                on: { hour: 17, minute: 0 },
                repeats: true
              },
              smallIcon: 'ic_launcher',
              actionTypeId: '',
              extra: null
            }
          ]
        });
      } catch (e) {
        console.warn('Local notification schedule skipped:', e);
      }
    };

    // Delay notification prompt; never call PushNotifications.register without Firebase
    const timer = setTimeout(async () => {
      try {
        const promptShown = localStorage.getItem(NOTIFICATION_PROMPT_SHOWN_KEY) === 'true';
        if (!promptShown) {
          const { value: allowNotifications } = await Dialog.confirm({
            title: 'Bildirim İzni',
            message: 'Av saatleri hatırlatmaları için yerel bildirim izni vermek ister misiniz?',
            okButtonTitle: 'İzin Ver',
            cancelButtonTitle: 'Şimdi Değil'
          });

          localStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
          if (!allowNotifications) return;
        }

        const localPerm = await LocalNotifications.requestPermissions();
        if (localPerm.display === 'granted') {
          await scheduleDefaultLocalNotifications();
        }
        // Firebase/FCM kurulana kadar PushNotifications.register() çağırma (native crash sebebi)
      } catch (e) {
        console.warn('Notification init skipped:', e);
      }
    }, 5000);

    const backButtonListener = App.addListener('backButton', async () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/tr' || path === '/en') {
        const { value } = await Dialog.confirm({
          title: 'Çıkış',
          message: 'Uygulamadan çıkmak istiyor musunuz?',
          okButtonTitle: 'Evet',
          cancelButtonTitle: 'Hayır'
        });
        if (value) App.exitApp();
      } else {
        router.back();
      }
    });

    return () => {
      clearTimeout(timer);
      netListener.then((l) => l.remove()).catch(() => {});
      backButtonListener.then((l) => l.remove()).catch(() => {});
      nativeBootedRef.current = false;
    };
  }, [router]);

  // Soft login gate (once): only redirect if not on auth/legal pages
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (loginRedirectDoneRef.current) return;

    const ignoredPaths = ['/login', '/register', '/privacy', '/terms', '/about', '/faq'];
    if (ignoredPaths.some((segment) => pathname.includes(segment))) {
      loginRedirectDoneRef.current = true;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const localeSegment = pathname.split('/')[1];
        const locale = localeSegment === 'en' ? 'en' : 'tr';
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          loginRedirectDoneRef.current = true;
          router.replace(`/${locale}/login`);
        } else {
          loginRedirectDoneRef.current = true;
        }
      } catch {
        // Auth check failed — leave user on current page
        loginRedirectDoneRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, supabase]);

  const handleRetry = async () => {
    triggerHapticLight();
    setRetrying(true);
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        setIsOffline(false);
        router.refresh();
        setIsBackOnline(true);
        setTimeout(() => setIsBackOnline(false), 2400);
      }
    } catch (e) {
      console.error('Retry status check failed', e);
    } finally {
      setTimeout(() => setRetrying(false), 800);
    }
  };

  if (isOffline) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center text-white select-none">
        <div className="w-20 h-20 bg-slate-800/80 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 shadow-2xl animate-pulse">
          <WifiOff className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
          <Anchor className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">oltaApp Mobil</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">İnternet Bağlantısı Yok</h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs mb-8 leading-relaxed">
          Denizdesiniz veya internetiniz kesildi. Lütfen Wi-Fi veya mobil verinizi açıp tekrar deneyin.
        </p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          <span>{retrying ? 'Kontrol Ediliyor...' : 'Tekrar Dene'}</span>
        </button>
      </div>
    );
  }

  if (isBackOnline) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
        Bağlantı geri geldi
      </div>
    );
  }

  return null;
}
