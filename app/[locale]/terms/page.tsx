import { setRequestLocale } from 'next-intl/server';
import TermsClient from '@/components/terms/TermsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Kullanım Koşulları | Oltapp (Livar)' : 'Terms of Service | Oltapp (Livar)',
    description: locale === 'tr' 
      ? 'Oltapp platformu üyelik sözleşmesi, mera ekleme sorumlulukları ve topluluk kuralları.' 
      : 'Oltapp platform terms of service, fishing spot sharing responsibilities, and community rules.',
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsClient />;
}
