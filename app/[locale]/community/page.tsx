import { createClient } from '@/lib/supabase/server';
import CommunityClient from '@/components/community/CommunityClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Topluluk & Av Raporları | Oltapp' : 'Community Catch Logs | Oltapp',
  };
}

export default async function CommunityPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();

  // Fetch all catch logs with user profiles and tackle set details
  const { data: catches } = await supabase
    .from('catch_logs')
    .select(`
      *,
      profiles (username, full_name, avatar_url, bio, city),
      tackle_sets (id, name, rod, reel, line, lure)
    `)
    .order('created_at', { ascending: false });

  return <CommunityClient catches={catches || []} />;
}
