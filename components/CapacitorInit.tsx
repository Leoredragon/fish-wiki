'use client';

import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Network } from '@capacitor/network';
import { useRouter, usePathname } from 'next/navigation';
import { WifiOff, RefreshCw, Anchor } from 'lucide-react';
import { triggerHapticLight } from '@/lib/capacitorUtils';

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOffline, setIsOffline] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    document.documentElement.classList.add('is-native-app');

    // 1. Instant Status Bar (no blocking delay)
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0F172A' }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});

    // 2. Instant Network Status Check
    Network.getStatus().then((status) => {
      setIsOffline(!status.connected);
    }).catch(() => {});

    const netListener = Network.addListener('networkStatusChange', (newStatus) => {
      setIsOffline(!newStatus.connected);
      if (newStatus.connected) {
        window.location.reload();
      }
    });

    // 3. DEFER heavy notification bridge calls by 3.5s so initial UI launch is 100% lag-free
    const timer = setTimeout(async () => {
      try {
        const localPerm = await LocalNotifications.requestPermissions();
        if (localPerm.display === 'granted') {
          const pending = await LocalNotifications.getPending();
          if (pending.notifications.length > 0) {
            await LocalNotifications.cancel(pending);
          }

          await LocalNotifications.schedule({
            notifications: [
              {
                id: 101,
                title: '🎣 Günaydın Balıkçı! (oltaApp)',
                body: 'Bugün meralarda hava ve deniz koşulları harika! Balık iştah skorunu kontrol etmeyi unutma.',
                schedule: {
                  on: { hour: 9, minute: 0 },
                  repeats: true,
                  every: 'day'
                },
                sound: undefined,
                smallIcon: 'ic_launcher',
                actionTypeId: '',
                extra: null
              },
              {
                id: 102,
                title: '🌊 Günün En Verimli Av Saati Geldi!',
                body: 'Meralardan yeni av raporları var. Solunar tahminlerini incele, sahteni suya düşür!',
                schedule: {
                  on: { hour: 17, minute: 0 },
                  repeats: true,
                  every: 'day'
                },
                sound: undefined,
                smallIcon: 'ic_launcher',
                actionTypeId: '',
                extra: null
              }
            ]
          });
        }

        const pushPerm = await PushNotifications.requestPermissions();
        if (pushPerm.receive === 'granted') {
          await PushNotifications.register();
        }
      } catch (e) {
        console.error('Deferred notifications init failed', e);
      }
    }, 3500);

    // 4. Handle Hardware Back Button
    const backButtonListener = App.addListener('backButton', async () => {
      if (pathname === '/' || pathname === '/tr' || pathname === '/en') {
        const { value } = await Dialog.confirm({
          title: 'Çıkış',
          message: 'Uygulamadan çıkmak istiyor musunuz?',
          okButtonTitle: 'Evet',
          cancelButtonTitle: 'Hayır',
        });
        
        if (value) {
          App.exitApp();
        }
      } else {
        router.back();
      }
    });

    return () => {
      clearTimeout(timer);
      netListener.then((l) => l.remove());
      backButtonListener.then((l) => l.remove());
    };
  }, [pathname, router]);

  const handleRetry = async () => {
    triggerHapticLight();
    setRetrying(true);
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        setIsOffline(false);
        window.location.reload();
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

  return null;
}
