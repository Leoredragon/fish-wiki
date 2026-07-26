'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Compass, BookOpen, MapPin, CloudSun, Users } from 'lucide-react';

export default function MobileBottomNav() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: isTr ? 'Keşfet' : 'Explore', icon: Compass },
    { href: '/wiki', label: isTr ? 'Wiki' : 'Wiki', icon: BookOpen },
    { href: '/map', label: isTr ? 'Meralar' : 'Map', icon: MapPin },
    { href: '/weather', label: isTr ? 'Solunar' : 'Solunar', icon: CloudSun },
    { href: '/community', label: isTr ? 'Topluluk' : 'Social', icon: Users }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-[#0F172A] border-t border-slate-800/90 px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-md"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
