'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

const AUTH_PATHS = ['/login', '/register'];

/**
 * Mobile/APK chrome helper:
 * - marks native app
 * - full-screen auth mode (hides header/nav chrome via CSS)
 */
export default function NativeChrome() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const isAuth = AUTH_PATHS.some((p) => pathname.includes(p));

    if (Capacitor.isNativePlatform()) {
      root.classList.add('is-native-app');
    }

    root.classList.toggle('auth-screen', isAuth);
    root.classList.toggle('native-auth-screen', isAuth && Capacitor.isNativePlatform());

    return () => {
      root.classList.remove('auth-screen');
      root.classList.remove('native-auth-screen');
    };
  }, [pathname]);

  return null;
}
