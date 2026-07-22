'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { Shield, Fish, Calendar, CloudSun, MapPin, Compass, Camera, ChevronRight } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('navHome'), icon: Compass },
    { href: '/calendar', label: t('navCalendar'), icon: Calendar },
    { href: '/weather', label: t('navWeather'), icon: CloudSun },
    { href: '/map', label: t('navMap'), icon: MapPin },
    { href: '/reports', label: t('navReports'), icon: Camera }
  ];

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800/80 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6 text-[#0F172A]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {t('title')}
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-medium text-slate-400 border-l border-slate-700 pl-2">
                {t('subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 border-l border-r border-slate-800/80 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSwitcher />

            <Link
              href="/admin"
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t('adminPanel')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar with Scroll Hint & Gradient Mask */}
        <div className="relative lg:hidden border-t border-slate-800/60 overflow-hidden">
          <nav className="flex overflow-x-auto py-2.5 px-1 scrollbar-none space-x-1 text-xs pr-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Animated Scroll Swipe Indicator Mask on Right Edge */}
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0F172A] via-[#0F172A]/80 to-transparent pointer-events-none flex items-center justify-end pr-1.5">
            <ChevronRight className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
