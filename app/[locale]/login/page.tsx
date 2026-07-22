import LoginClient from '@/components/auth/LoginClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Giriş Yap | Oltapp' : 'Login | Oltapp',
  };
}

export default function LoginPage() {
  return <LoginClient />;
}
