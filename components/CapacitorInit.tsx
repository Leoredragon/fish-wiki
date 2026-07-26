'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { useRouter, usePathname } from 'next/navigation';

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Add a class to html so we can tweak CSS specifically for native app
    document.documentElement.classList.add('is-native-app');

    // 1. Handle Status Bar
    const initStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setBackgroundColor({ color: '#0F172A' });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        console.error('StatusBar init failed', e);
      }
    };
    initStatusBar();

    // 2. Setup Local Scheduled Notifications (Hava & Solunar Tahmini - Günde 2 Kere)
    const initNotifications = async () => {
      try {
        const localPerm = await LocalNotifications.requestPermissions();
        if (localPerm.display === 'granted') {
          // Cancel previous schedules to avoid duplication
          const pending = await LocalNotifications.getPending();
          if (pending.notifications.length > 0) {
            await LocalNotifications.cancel(pending);
          }

          // Schedule 2 daily recurring notifications (09:00 Sabah & 17:00 Akşam)
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

        // 3. Setup Push Notifications (Beğeni, Yorum & Etkileşim Bildirimleri)
        const pushPerm = await PushNotifications.requestPermissions();
        if (pushPerm.receive === 'granted') {
          await PushNotifications.register();
        }
      } catch (e) {
        console.error('Notifications init failed', e);
      }
    };

    initNotifications();

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
      backButtonListener.then(listener => listener.remove());
    };
  }, [pathname, router]);

  return null;
}
