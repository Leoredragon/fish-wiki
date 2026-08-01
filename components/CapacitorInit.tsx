'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { useRouter, usePathname } from 'next/navigation';
import { WifiOff, RefreshCw } from 'lucide-react';
import { triggerHapticLight } from '@/lib/capacitorUtils';
import { createClient } from '@/lib/supabase/client';
import OltaAppLogo from './OltaAppLogo';

const NOTIFICATION_PROMPT_SHOWN_KEY = 'oltaapp_notification_prompt_shown_v1';

// FCM is only bundled in APK 1.6.3+ (google-services.json); register() crashes older builds
const MIN_PUSH_VERSION = 10603;

function versionToNumber(version: string): number {
  const [maj = 0, min = 0, pat = 0] = version.split('.').map((n) => parseInt(n, 10) || 0);
  return maj * 10000 + min * 100 + pat;
}

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [isBackOnline, setIsBackOnline] = useState(false);
  const [authGateLoading, setAuthGateLoading] = useState(false);
  const offlineRef = useRef(false);
  const loginRedirectDoneRef = useRef(false);
  const nativeBootedRef = useRef(false);
  const pushInitRef = useRef(false);

  // One-time native boot: status bar, network, notifications, back button
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || nativeBootedRef.current) return;
    nativeBootedRef.current = true;

    document.documentElement.classList.add('is-native-app');

    // Native app opens on Community — usage shows it's the main destination.
    // Web homepage stays the encyclopedia (SEO / first discovery).
    try {
      const bootPath = window.location.pathname.replace(/\/$/, '');
      if (bootPath === '' || bootPath === '/tr' || bootPath === '/en') {
        const locale = bootPath === '/en' ? 'en' : 'tr';
        router.replace(`/${locale}/community`);
      }
    } catch {}

    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0F172A' }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.show().catch(() => {});

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
              body: 'Bugünkü hava koşullarına göre av planını yap. Hava Durumu modülünden av koşulu skorunu kontrol et.',
              schedule: {
                on: { hour: 9, minute: 0 },
                repeats: true
              },
              smallIcon: 'ic_stat_oltaapp',
              largeIcon: 'ic_notification',
              iconColor: '#10B981',
              actionTypeId: '',
              extra: null
            },
            {
              id: 102,
              title: 'Günün En Verimli Av Saati!',
              body: 'Akşam saatleri yaklaşıyor. Hava durumu ve av koşulu skoruna göz at.',
              schedule: {
                on: { hour: 17, minute: 0 },
                repeats: true
              },
              smallIcon: 'ic_stat_oltaapp',
              largeIcon: 'ic_notification',
              iconColor: '#10B981',
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
      // Community is the boot screen now; with no history to go back to, back = exit prompt
      const isCommunityHome =
        (path === '/tr/community' || path === '/en/community') && window.history.length <= 2;
      if (path === '/' || path === '/tr' || path === '/en' || isCommunityHome) {
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

  // FCM push registration: only on native 1.6.3+ builds and only for logged-in users
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || pushInitRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const info = await App.getInfo();
        if (versionToNumber(info.version) < MIN_PUSH_VERSION) return;

        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        pushInitRef.current = true;

        const { PushNotifications } = await import('@capacitor/push-notifications');

        let perm = await PushNotifications.checkPermissions();
        if (perm.receive === 'prompt') {
          perm = await PushNotifications.requestPermissions();
        }
        if (perm.receive !== 'granted') return;

        try {
          await PushNotifications.createChannel({
            id: 'social',
            name: 'Sosyal Bildirimler',
            description: 'Tebrik, yorum ve takip bildirimleri',
            importance: 4,
            visibility: 1
          });
        } catch {}

        await PushNotifications.addListener('registration', async (token) => {
          try {
            await supabase.rpc('register_push_token', { p_token: token.value, p_platform: 'android' });
          } catch (e) {
            console.warn('Push token save failed:', e);
          }
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', () => {
          try {
            const localeSegment = window.location.pathname.split('/')[1];
            const locale = localeSegment === 'en' ? 'en' : 'tr';
            router.push(`/${locale}/community`);
          } catch {}
        });

        await PushNotifications.register();
      } catch (e) {
        console.warn('Push init skipped:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, supabase]);

  // Soft login gate (once): guests may browse; only force login when no guest mode
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (loginRedirectDoneRef.current) return;

    const ignoredPaths = ['/login', '/register', '/privacy', '/terms', '/about', '/faq'];
    if (ignoredPaths.some((segment) => pathname.includes(segment))) {
      loginRedirectDoneRef.current = true;
      setAuthGateLoading(false);
      return;
    }

    let isGuest = false;
    try {
      isGuest = localStorage.getItem('oltaapp_guest_mode') === '1';
    } catch {}

    if (isGuest) {
      loginRedirectDoneRef.current = true;
      setAuthGateLoading(false);
      return;
    }

    setAuthGateLoading(true);
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
          try {
            localStorage.removeItem('oltaapp_guest_mode');
          } catch {}
          loginRedirectDoneRef.current = true;
        }
      } catch {
        // Auth check failed — leave user on current page
        loginRedirectDoneRef.current = true;
      } finally {
        if (!cancelled) {
          setAuthGateLoading(false);
        }
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
          <OltaAppLogo className="w-4 h-4" />
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

  if (authGateLoading) {
    return (
      <div className="fixed inset-0 z-[999998] bg-[#0F172A] flex flex-col items-center justify-center select-none">
        <div className="animate-pulse">
          <OltaAppLogo className="w-16 h-16 rounded-2xl shadow-xl shadow-emerald-500/20" />
        </div>
      </div>
    );
  }

  return null;
}
