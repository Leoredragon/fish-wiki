import RegionMapClient from '@/components/RegionMapClient';
import { setRequestLocale } from 'next-intl/server';

export default async function MapPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegionMapClient />;
}
