import { getTranslations, setRequestLocale } from 'next-intl/server';
import FaqClient from '@/components/faq/FaqClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Sıkça Sorulan Sorular | Oltapp (Livar)' : 'FAQ | Oltapp (Livar)',
    description: locale === 'tr' 
      ? 'Oltapp kullanımı, mera haritası, ücretlendirme ve sirküler kuralları hakkında merak edilen sorular.' 
      : 'Frequently asked questions about Oltapp features, fishing spot map, pricing, and regulations.',
  };
}

export default async function FaqPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <FaqClient />;
}
