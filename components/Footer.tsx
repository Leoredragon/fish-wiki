'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Common');

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs space-y-2 sm:space-y-0">
        <div>
          <span className="font-semibold text-slate-200">Fish Wiki</span> &copy; {new Date().getFullYear()}
        </div>
        <div className="text-slate-400">
          {t('footer')}
        </div>
      </div>
    </footer>
  );
}
