import WikiClient from '@/components/wiki/WikiClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Balıkçılık Wiki & Ekipman Rehberi | Oltapp' : 'Angling Wiki & Equipment Guide | Oltapp',
    description: locale === 'tr' 
      ? 'Balıkçılık disiplinleri, sahte yem çeşitleri, misina türleri ve rig montajları hakkında detaylı rehber.' 
      : 'Comprehensive angling wiki for fishing styles, tackle, lures, and rig setups.'
  };
}

export default function WikiPage() {
  return <WikiClient />;
}
