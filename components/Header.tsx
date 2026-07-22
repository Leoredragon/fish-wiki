'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { Shield, Fish } from 'lucide-react';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('Header');

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6 text-[#0F172A]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {t('title')}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 border-l border-slate-700 pl-2">
                {t('subtitle')}
              </span>
            </div>
          </Link>

          {/* Right controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <LanguageSwitcher />

            <Link
              href="/admin"
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('adminPanel')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
