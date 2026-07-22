import RegisterClient from '@/components/auth/RegisterClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Kayıt Ol | Oltapp' : 'Register | Oltapp',
  };
}

export default function RegisterPage() {
  return <RegisterClient />;
}
