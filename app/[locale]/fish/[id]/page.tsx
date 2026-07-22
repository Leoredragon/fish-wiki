import FishDetailPageClient from '@/components/FishDetailPageClient';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr ? `Fish Wiki - Balık Türü Detay Rehberi` : `Fish Wiki - Species Detail Guide`,
    description: isTr
      ? 'Balık türü özellikleri, yasal av boy sınırları, av yasakları, favori yemler ve pişirme tavsiyeleri.'
      : 'Detailed species characteristics, legal size limits, closed seasons, and angling tactics.',
    openGraph: {
      title: 'Fish Wiki - Premium Angling Guide',
      description: 'Marine & Freshwater species encyclopedia'
    }
  };
}

export default async function FishDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <FishDetailPageClient id={id} />;
}
