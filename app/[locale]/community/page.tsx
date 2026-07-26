import { createClient } from '@/lib/supabase/server';
import CommunityClient from '@/components/community/CommunityClient';

export const revalidate = 0;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Topluluk & Av Raporları | Oltapp' : 'Community Catch Logs | Oltapp',
  };
}

export default async function CommunityPage() {
  const supabase = await createClient();

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Run all queries concurrently in parallel (4x speed boost)
  const [catchesRes, catchLogsRes, storiesRes, forumRes, marketRes, tipsRes] = await Promise.all([
    supabase
      .from('catches')
      .select(`
        *,
        profiles (username, full_name, avatar_url, bio, city)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('catch_logs')
      .select(`
        *,
        profiles (username, full_name, avatar_url, bio, city),
        tackle_sets (id, name, rod, reel, line, lure)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('community_stories')
      .select(`
        *,
        profiles (username, full_name, avatar_url)
      `)
      .gte('created_at', cutoff)
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

  // Merge catches and catch_logs (deduplicated)
  const combinedCatches = [
    ...(catchesRes.data || []),
    ...(catchLogsRes.data || [])
  ];

  const uniqueCatchesMap = new Map();
  combinedCatches.forEach((item) => {
    if (item.id && !uniqueCatchesMap.has(item.id)) {
      uniqueCatchesMap.set(item.id, item);
    }
  });

  const mergedCatches = Array.from(uniqueCatchesMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <CommunityClient
      catches={mergedCatches}
      initialStories={storiesRes.data || []}
      initialForumPosts={forumRes.data || []}
      initialMarketplaceItems={marketRes.data || []}
      initialCommunityTips={tipsRes.data || []}
    />
  );
}
