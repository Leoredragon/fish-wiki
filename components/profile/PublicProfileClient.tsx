'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { MapPin, BookOpen, Scale, Ruler, UserPlus, UserCheck, Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatMembershipLabel, getActivityBadge } from '@/lib/anglerTrust';
import { markFirstWeekProgress } from '@/components/community/FirstWeekChecklist';

interface PublicProfileClientProps {
  profile: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    bio: string | null;
    created_at?: string | null;
  };
  catches: Array<{
    id: string;
    image_url: string;
    weight: number | null;
    length: number | null;
    location_note: string | null;
    created_at: string;
    fishes?: { name_tr?: string | null; name_en?: string | null } | null;
  }>;
  currentUserId: string | null;
  initialIsFollowing: boolean;
  initialFollowersCount: number;
  initialFollowingCount: number;
}

export default function PublicProfileClient({
  profile,
  catches,
  currentUserId,
  initialIsFollowing,
  initialFollowersCount,
  initialFollowingCount
}: PublicProfileClientProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [viewerId, setViewerId] = useState<string | null>(currentUserId);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = Boolean(viewerId && profile?.id && viewerId === profile.id);

  const totalCatches = catches.length;
  const biggestCatch = catches.reduce((max, item) => {
    const maxWeight = Number(max?.weight || 0);
    const itemWeight = Number(item?.weight || 0);
    return itemWeight > maxWeight ? item : max;
  }, catches[0] || null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (cancelled) return;

      setViewerId(user?.id || null);
      if (user?.id && user.id !== profile.id) {
        const [{ count }, { count: followers }, { count: following }] = await Promise.all([
          supabase
            .from('follows')
            .select('follower_id', { head: true, count: 'exact' })
            .eq('follower_id', user.id)
            .eq('following_id', profile.id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id)
        ]);
        if (cancelled) return;
        setIsFollowing(Boolean((count || 0) > 0));
        setFollowersCount(followers || 0);
        setFollowingCount(following || 0);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile.id, supabase]);

  const handleToggleFollow = async () => {
    if (!viewerId) {
      router.push(`/${locale}/login`);
      return;
    }
    if (isOwnProfile || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', viewerId)
          .eq('following_id', profile.id);
      } else {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        await supabase.from('follows').insert({
          follower_id: viewerId,
          following_id: profile.id
        });
        markFirstWeekProgress('followed');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 pt-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-[#0F172A] px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-200/80 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>{isTr ? 'Geri Dön' : 'Back'}</span>
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0F172A] text-emerald-400 flex items-center justify-center text-3xl font-black relative shrink-0">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Profile avatar" fill sizes="96px" className="object-cover" />
            ) : (
              (profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                {profile?.full_name || (isTr ? 'OltaApp Üyesi' : 'Angler')}
              </h1>
              {profile?.username && (
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                  @{profile.username}
                </span>
              )}
            </div>

            {profile?.bio && <p className="text-sm text-slate-600 font-medium leading-relaxed">{profile.bio}</p>}

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
              {profile?.city && (
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.city}</span>
                </span>
              )}
              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                {followersCount} {isTr ? 'Takipçi' : 'Followers'}
              </span>
              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                {followingCount} {isTr ? 'Takip' : 'Following'}
              </span>
              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                {totalCatches} {isTr ? 'Av' : 'Catches'}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg">
                {formatMembershipLabel(profile?.created_at, isTr)}
              </span>
              <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                {getActivityBadge(totalCatches, isTr)}
              </span>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={`h-10 px-4 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                isFollowing
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-[#0F172A] text-white border-slate-900'
              }`}
            >
              {followLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isFollowing ? (
                <UserCheck className="w-3.5 h-3.5" />
              ) : (
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>
                {isFollowing
                  ? (isTr ? 'Takip Ediliyor' : 'Following')
                  : (isTr ? 'Takip Et' : 'Follow')}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-black text-[#0F172A] mb-4">
          {isTr ? 'Son Avları' : 'Recent Catches'}
        </h2>

        {catches.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-semibold">
            {isTr ? 'Henüz paylaşılmış av yok.' : 'No catches shared yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catches.map((log) => (
              <div key={log.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <div className="aspect-[4/3] relative bg-slate-100">
                  <Image src={log.image_url} alt="Catch" fill sizes="33vw" className="object-cover" />
                </div>
                <div className="p-3.5 space-y-2">
                  <div className="text-sm font-bold text-[#0F172A] line-clamp-1">
                    {log.location_note || (isTr ? 'Mera belirtilmedi' : 'No spot info')}
                  </div>
                  {(log.fishes?.name_tr || log.fishes?.name_en) && (
                    <div className="text-[11px] font-bold text-emerald-600">
                      {isTr ? (log.fishes.name_tr || log.fishes.name_en) : (log.fishes.name_en || log.fishes.name_tr)}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
                    {log.weight && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                        <Scale className="w-3.5 h-3.5 text-emerald-600" />
                        {log.weight} kg
                      </span>
                    )}
                    {log.length && (
                      <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                        <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                        {log.length} cm
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {biggestCatch?.weight && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs font-bold">
          {isTr ? 'En büyük trofe: ' : 'Biggest trophy: '}
          <span className="text-emerald-400">{biggestCatch.weight} kg</span>
          {biggestCatch.location_note ? ` · ${biggestCatch.location_note}` : ''}
        </div>
      )}
    </div>
  );
}
