'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Anchor, Shield, FileText, HelpCircle, Info } from 'lucide-react';

export default function Footer() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">Oltapp <span className="text-emerald-400 text-xs font-bold">(Livar)</span></span>
              <p className="text-xs text-slate-400 font-medium">
                {isTr ? 'Türkiye’nin Akıllı Balıkçılık ve Mera Asistanı' : 'Smart Fishing & Spot Assistant'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold">
            <Link 
              href="/about" 
              className="flex items-center space-x-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Hakkımızda' : 'About Us'}</span>
            </Link>

            <Link 
              href="/faq" 
              className="flex items-center space-x-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Sıkça Sorulan Sorular' : 'FAQ'}</span>
            </Link>

            <Link 
              href="/privacy" 
              className="flex items-center space-x-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}</span>
            </Link>

            <Link 
              href="/terms" 
              className="flex items-center space-x-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTr ? 'Kullanım Koşulları' : 'Terms of Service'}</span>
            </Link>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium space-y-2 sm:space-y-0">
          <div>
            &copy; 2026 Oltapp (Livar). Tüm hakları saklıdır.
          </div>
          <div className="text-[11px] text-slate-500">
            {isTr ? 'Sürdürülebilir Amatör Balıkçılık Kültürü' : 'Sustainable Amateur Angling Culture'}
          </div>
        </div>

      </div>
    </footer>
  );
}
