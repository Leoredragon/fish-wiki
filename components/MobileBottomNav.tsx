'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Compass, BookOpen, MapPin, CloudSun, Users } from 'lucide-react';
import { triggerHapticLight } from '@/lib/capacitorUtils';

export default function MobileBottomNav() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const pathname = usePathname();
  const [clickedHref, setClickedHref] = useState<string | null>(null);

  // Clear optimistic clicked item when route actually completes changing
  useEffect(() => {
    setClickedHref(null);
  }, [pathname]);

  const navItems = [
    { href: '/', label: isTr ? 'Keşfet' : 'Explore', icon: Compass },
    { href: '/wiki', label: isTr ? 'Wiki' : 'Wiki', icon: BookOpen },
    { href: '/map', label: isTr ? 'Harita' : 'Map', icon: MapPin },
    { href: '/weather', label: isTr ? 'Hava Durumu' : 'Weather', icon: CloudSun },
    { href: '/community', label: isTr ? 'Topluluk' : 'Social', icon: Users }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-[#0F172A] border-t border-slate-800/90 px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] shadow-md select-none"
      style={{
        position: 'fixed',
        bottom: '-2px',
        left: 0,
        right: 0,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
      {/* Seamless background extension for Android gesture swipe bar area */}
      <div className="absolute top-full left-0 right-0 h-12 bg-[#0F172A] pointer-events-none" />

      <div className="grid grid-cols-5 w-full items-center max-w-md mx-auto relative z-10 gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isRouteActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const isClicked = clickedHref === item.href;
          const isActive = isClicked || (clickedHref === null && isRouteActive);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => {
                triggerHapticLight();
                setClickedHref(item.href);
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-100 text-center w-full active:scale-90 active:bg-emerald-500/20 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold scale-100'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25px] text-emerald-400' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-1 tracking-tight whitespace-nowrap text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
