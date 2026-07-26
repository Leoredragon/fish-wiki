import { createClient } from '@/lib/supabase/server';
import CommunityClient from '@/components/community/CommunityClient';

export const revalidate = 60;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Topluluk & Av Raporları | Oltapp' : 'Community Catch Logs | Oltapp',
  };
}

export default async function CommunityPage() {
  const supabase = await createClient();

  // Run all queries concurrently in parallel (4x speed boost)
  const [catchesRes, forumRes, marketRes, tipsRes] = await Promise.all([
    supabase
      .from('catch_logs')
      .select(`
        *,
        profiles (username, full_name, avatar_url, bio, city),
        tackle_sets (id, name, rod, reel, line, lure)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_forum_posts')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_marketplace_items')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_tips')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false })
  ]);

  return (
    <CommunityClient
      catches={catchesRes.data || []}
      initialForumPosts={forumRes.data || []}
      initialMarketplaceItems={marketRes.data || []}
      initialCommunityTips={tipsRes.data || []}
    />
  );
}
