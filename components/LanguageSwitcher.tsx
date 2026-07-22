'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = (newLocale: 'tr' | 'en') => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className="inline-flex items-center bg-[#0F172A]/5 border border-slate-200 rounded-lg p-1 text-xs font-medium">
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
      <button
        onClick={() => toggleLanguage('tr')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === 'tr'
            ? 'bg-[#0F172A] text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        TR
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          locale === 'en'
            ? 'bg-[#0F172A] text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
