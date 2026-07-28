'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

const AUTH_PATHS = ['/login', '/register'];

/**
 * Applies native-only body/html classes for Android app chrome.
 * Hides web footer/PWA affordances and softens layout on auth screens.
 */
export default function NativeChrome() {
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const root = document.documentElement;
    root.classList.add('is-native-app');

    const isAuth = AUTH_PATHS.some((p) => pathname.includes(p));
    root.classList.toggle('native-auth-screen', isAuth);

    return () => {
      root.classList.remove('native-auth-screen');
    };
  }, [pathname]);

  return null;
}
