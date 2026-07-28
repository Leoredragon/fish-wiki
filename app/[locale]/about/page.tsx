import { setRequestLocale } from 'next-intl/server';
import AboutClient from '@/components/about/AboutClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Hakkımızda | Oltapp (Livar)' : 'About Us | Oltapp (Livar)',
    description: locale === 'tr' 
      ? 'Doğa kampı, bushcraft, LRF ve Fly-fishing tutkusunu teknolojiyle buluşturan Düzce merkezli amatör balıkçılık platformu.' 
      : 'Düzce-based amateur angling platform combining outdoor bushcraft, LRF and fly-fishing with smart technology.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutClient />;
}
