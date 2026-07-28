'use client';

import { usePathname } from 'next/navigation';
import MobileBottomNav from './MobileBottomNav';

const HIDDEN_ON_AUTH = ['/login', '/register'];

export default function MobileBottomNavGate() {
  const pathname = usePathname();

  if (HIDDEN_ON_AUTH.some((p) => pathname.includes(p))) {
    return null;
  }

  return <MobileBottomNav />;
}
