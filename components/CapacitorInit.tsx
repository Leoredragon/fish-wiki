'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { useRouter, usePathname } from 'next/navigation';

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Add a class to html so we can tweak CSS specifically for native app
    document.documentElement.classList.add('is-native-app');

    // Handle Status Bar
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

    // Handle Hardware Back Button
    const backButtonListener = App.addListener('backButton', async () => {
      // If we are on the home page (e.g. /tr or /en or /), ask for exit app
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
