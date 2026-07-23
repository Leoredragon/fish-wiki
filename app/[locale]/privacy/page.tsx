import { setRequestLocale } from 'next-intl/server';
import PrivacyClient from '@/components/privacy/PrivacyClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Gizlilik Politikası | Oltapp (Livar)' : 'Privacy Policy | Oltapp (Livar)',
    description: locale === 'tr' 
      ? 'Oltapp kullanıcı veri güvenliği, KVKK/GDPR prensipleri ve mera verilerinin anonimleştirilme şartları.' 
      : 'Oltapp user data privacy policies, KVKK/GDPR compliance, and anonymized fishing spot location handling.',
  };
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <PrivacyClient />;
}
