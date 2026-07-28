import HomePageClient from '@/components/HomePageClient';
import { createClient } from '@/lib/supabase/server';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 300;

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const orderColumn = locale === 'en' ? 'name_en' : 'name_tr';
  const { data: fishes } = await supabase
    .from('fishes')
    .select('*')
    .eq('is_active', true)
    .order(orderColumn, { ascending: true });

  return <HomePageClient initialFishes={fishes || []} />;
}
