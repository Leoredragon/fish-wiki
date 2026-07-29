import WikiClient from '@/components/wiki/WikiClient';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Balıkçılık Wiki & Ekipman Rehberi | Oltapp' : 'Angling Wiki & Equipment Guide | Oltapp',
    description: locale === 'tr'
      ? 'Balıkçılık disiplinleri, sahte yem çeşitleri, misina türleri ve rig montajları hakkında detaylı rehber.'
      : 'Comprehensive angling wiki for fishing styles, tackle, lures, and rig setups.'
  };
}

export const revalidate = 60;

export default async function WikiPage() {
  const supabase = await createClient();

  const [{ data: articles }, { data: categories }, { data: subcategories }] = await Promise.all([
    supabase
      .from('wiki_articles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('wiki_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('wiki_subcategories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
  ]);

  return (
    <WikiClient
      initialArticles={articles || []}
      initialCategories={categories || []}
      initialSubcategories={subcategories || []}
    />
  );
}
