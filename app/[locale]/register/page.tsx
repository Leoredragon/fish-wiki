import RegisterClient from '@/components/auth/RegisterClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Kayıt Ol | Oltapp' : 'Register | Oltapp',
  };
}

export default function RegisterPage() {
  return <RegisterClient />;
}
