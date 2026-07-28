import LoginClient from '@/components/auth/LoginClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Giriş Yap | Oltapp' : 'Login | Oltapp',
  };
}

export default function LoginPage() {
  return <LoginClient />;
}
