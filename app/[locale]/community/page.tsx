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

  // 1. Fetch catch logs
  const { data: catches } = await supabase
    .from('catch_logs')
    .select(`
      *,
      profiles (username, full_name, avatar_url, bio, city),
      tackle_sets (id, name, rod, reel, line, lure)
    `)
    .order('created_at', { ascending: false });

  // 2. Fetch forum posts (safe)
  let forumPosts: any[] = [];
  try {
    const { data } = await supabase
      .from('community_forum_posts')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false });
    if (data) forumPosts = data;
  } catch {}

  // 3. Fetch marketplace items (safe)
  let marketplaceItems: any[] = [];
  try {
    const { data } = await supabase
      .from('community_marketplace_items')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false });
    if (data) marketplaceItems = data;
  } catch {}

  // 4. Fetch community tips (safe)
  let communityTips: any[] = [];
  try {
    const { data } = await supabase
      .from('community_tips')
      .select(`*, profiles(username, full_name, avatar_url, city)`)
      .order('created_at', { ascending: false });
    if (data) communityTips = data;
  } catch {}

  return (
    <CommunityClient
      catches={catches || []}
      initialForumPosts={forumPosts}
      initialMarketplaceItems={marketplaceItems}
      initialCommunityTips={communityTips}
    />
  );
}
