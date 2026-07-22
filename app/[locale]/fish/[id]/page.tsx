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
    title: isTr ? `Oltapp - Balık Türü Detay Rehberi` : `Oltapp - Species Detail Guide`,
    description: isTr 
      ? `${fish.name_tr} (${fish.scientific_name}) - Türkiye balıkçılık rehberi.` 
      : `${fish.name_en} (${fish.scientific_name}) - Turkey angling guide.`,
    openGraph: {
      title: 'Oltapp - Premium Angling Guide',
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
