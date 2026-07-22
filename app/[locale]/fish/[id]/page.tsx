import FishDetailPageClient from '@/components/FishDetailPageClient';
import { setRequestLocale } from 'next-intl/server';

export default async function FishDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <FishDetailPageClient id={id} />;
}
