'use client';

import { usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import MobileBottomNav from './MobileBottomNav';

const HIDDEN_ON_NATIVE = ['/login', '/register'];

export default function MobileBottomNavGate() {
  const pathname = usePathname();
  const isNative = Capacitor.isNativePlatform();

  if (isNative && HIDDEN_ON_NATIVE.some((p) => pathname.includes(p))) {
    return null;
  }

  return <MobileBottomNav />;
}
