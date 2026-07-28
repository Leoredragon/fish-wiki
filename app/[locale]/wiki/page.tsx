import WikiClient from '@/components/wiki/WikiClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Balıkçılık Wiki & Ekipman Rehberi | Oltapp' : 'Angling Wiki & Equipment Guide | Oltapp',
    description: locale === 'tr' 
      ? 'Balıkçılık disiplinleri, sahte yem çeşitleri, misina türleri ve rig montajları hakkında detaylı rehber.' 
      : 'Comprehensive angling wiki for fishing styles, tackle, lures, and rig setups.'
  };
}

import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

export default async function WikiPage() {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return <WikiClient initialArticles={data || []} />;
}
