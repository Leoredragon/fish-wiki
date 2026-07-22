import WeatherSolunarClient from '@/components/WeatherSolunarClient';
import { setRequestLocale } from 'next-intl/server';

export default async function WeatherPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WeatherSolunarClient />;
}
