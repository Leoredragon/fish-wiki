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
    { href: '/wiki', label: isTr ? 'Wiki Rehber' : 'Wiki', icon: BookOpen },
    { href: '/map', label: isTr ? 'Meralar' : 'Map', icon: MapPin },
    { href: '/weather', label: isTr ? 'Av Zamanı' : 'Solunar', icon: CloudSun },
    { href: '/community', label: isTr ? 'Topluluk' : 'Social', icon: Users }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-2 py-1.5 transition-all">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
