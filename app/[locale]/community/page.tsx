import { createClient } from '@/lib/supabase/server';
import CommunityClient from '@/components/community/CommunityClient';

export const revalidate = 60;

const COMMUNITY_FEED_LIMIT = 60;
const STORIES_LIMIT = 50;
const FORUM_LIMIT = 80;
const MARKET_LIMIT = 80;
const TIPS_LIMIT = 80;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Topluluk & Av Raporları | Oltapp' : 'Community Catch Logs | Oltapp',
  };
}

export default async function CommunityPage() {
  const supabase = await createClient();

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Run all queries concurrently in parallel (4x speed boost)
  const [catchLogsRes, storiesRes, forumRes, marketRes, tipsRes] = await Promise.all([
    supabase
      .from('catch_logs')
      .select(`
        *,
        profiles (username, full_name, avatar_url, bio, city),
        tackle_sets (id, name, rod, reel, line, lure)
      `)
      .order('created_at', { ascending: false })
      .limit(COMMUNITY_FEED_LIMIT),
    supabase
      .from('community_stories')
      .select(`
        *,
        profiles (username, full_name, avatar_url)
      `)
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(STORIES_LIMIT),
    supabase
      .from('community_forum_posts')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false })
      .limit(FORUM_LIMIT),
    supabase
      .from('community_marketplace_items')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false })
      .limit(MARKET_LIMIT),
    supabase
      .from('community_tips')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false })
      .limit(TIPS_LIMIT)
  ]);

  return (
    <CommunityClient
      catches={catchLogsRes.data || []}
      initialStories={storiesRes.data || []}
      initialForumPosts={forumRes.data || []}
      initialMarketplaceItems={marketRes.data || []}
      initialCommunityTips={tipsRes.data || []}
    />
  );
}
