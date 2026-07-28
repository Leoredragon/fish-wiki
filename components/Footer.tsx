'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Shield, FileText, HelpCircle, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export default function Footer() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  if (Capacitor.isNativePlatform()) return null;

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          {/* Brand Name */}
          <div className="flex items-center space-x-2">
            <span className="text-base font-black tracking-tight text-white">
              OltaApp
            </span>
            <span className="text-xs text-slate-400 font-medium border-l border-slate-700 pl-2">
              {isTr ? 'Balıkçılık Asistanı' : 'Angling Assistant'}
            </span>
          </div>

          {/* Navigation Links (Hakkımızda, SSS, Gizlilik Politikası, Kullanım Koşulları) */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <Link 
              href="/about" 
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Hakkımızda' : 'About Us'}</span>
            </Link>

            <Link 
              href="/faq" 
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'SSS' : 'FAQ'}</span>
            </Link>

            <Link 
              href="/privacy" 
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}</span>
            </Link>

            <Link 
              href="/terms" 
              className="flex items-center space-x-1 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Kullanım Koşulları' : 'Terms of Service'}</span>
            </Link>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div>
            &copy; 2026 OltaApp. {isTr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
