import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublicProfileClient from '@/components/profile/PublicProfileClient';

function parseUserIdFromSlug(slug: string) {
  if (!slug.startsWith('id-')) return null;
  const candidate = slug.slice(3);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(candidate) ? candidate : null;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${decodeURIComponent(slug)} | Oltapp`
  };
}

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const supabase = await createClient();
  const maybeUserId = parseUserIdFromSlug(decodedSlug);

  let profileQuery = supabase.from('profiles').select('id, username, full_name, avatar_url, city, bio, created_at');
  if (maybeUserId) {
    profileQuery = profileQuery.eq('id', maybeUserId);
  } else {
    profileQuery = profileQuery.ilike('username', decodedSlug);
  }

  const { data: profile } = await profileQuery.maybeSingle();
  if (!profile) notFound();

  const { data: catches } = await supabase
    .from('catch_logs')
    .select('id, image_url, weight, length, location_note, created_at, fishes(name_tr, name_en)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(12);

  const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id)
  ]);

  return (
    <PublicProfileClient
      profile={profile}
      catches={catches || []}
      currentUserId={null}
      initialIsFollowing={false}
      initialFollowersCount={followersCount || 0}
      initialFollowingCount={followingCount || 0}
    />
  );
}
