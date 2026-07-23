/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Scale, Ruler, Heart, MessageSquare, Send, Users, Loader2, ChevronDown, Package, User, Trophy, Search, Flame, Filter, Medal, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CatchCardExport from './CatchCardExport';
import { useRouter } from 'next/navigation';

export default function CommunityClient({ catches }: { catches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'trophy' | 'liked'>('all');

  const [selectedAuthorModal, setSelectedAuthorModal] = useState<{
    profile: Record<string, any>;
    tackleSet?: Record<string, any> | null;
    userCatches: Record<string, any>[];
  } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  // Leaderboard Top 3 Trophy Catches (Sorted by weight or length)
  const topTrophies = useMemo(() => {
    return [...catches]
      .filter(c => c.weight || c.length)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, 3);
  }, [catches]);

  // Filtered & Searched Catches
  const filteredCatches = useMemo(() => {
    return catches.filter(c => {
      // Filter tab check
      if (activeFilter === 'trophy' && (!c.weight || c.weight < 1.5)) return false;
      
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const locationMatch = c.location_note?.toLowerCase().includes(q);
        const lureMatch = c.lure_used?.toLowerCase().includes(q);
        const usernameMatch = c.profiles?.username?.toLowerCase().includes(q);
        const nameMatch = c.profiles?.full_name?.toLowerCase().includes(q);
        return locationMatch || lureMatch || usernameMatch || nameMatch;
      }

      return true;
    });
  }, [catches, activeFilter, searchQuery]);

  const handleOpenAuthorModal = (profileData: any, tackleSetData: any, userId: string) => {
    const userCatches = catches.filter(c => c.user_id === userId);
    setSelectedAuthorModal({
      profile: profileData || { username: 'Oltapp Balıkçısı' },
      tackleSet: tackleSetData || null,
      userCatches
    });
  };

  const displayedCatches = filteredCatches.slice(0, visibleCount);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3.5 bg-emerald-50 border border-emerald-200 rounded-full mb-1 shadow-xs">
          <Users className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A]">
          {isTr ? 'Oltapp Balıkçılık Akışı' : 'Oltapp Catch Feed'}
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm">
          {isTr 
            ? 'Türkiye’nin dört bir yanından amatör balıkçıların trofe avları, taktikleri ve ekipman deneyimleri.' 
            : 'Catches, tactics, and gear reviews from amateur anglers nationwide.'}
        </p>
      </div>

      {/* 🏆 LEADERBOARD / TROPHY SHOWCASE BANNER */}
      {topTrophies.length > 0 && (
        <div className="bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-wide text-white">
                  {isTr ? 'Ayın En Büyük Trofe Avları 🏆' : 'Trophy Leaderboard'}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isTr ? 'Topluluğun en ağır ve büyüleyici yakalamaları' : 'Top catches recorded by the community'}
                </p>
              </div>
            </div>
            <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Liderlik Tablosu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topTrophies.map((trophy, idx) => (
              <div
                key={trophy.id}
                onClick={() => handleOpenAuthorModal(trophy.profiles, trophy.tackle_sets, trophy.user_id)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={trophy.image_url} alt="Trophy" className="w-full h-full object-cover" />
                  <div className={`absolute top-0 left-0 text-[10px] font-black px-1.5 py-0.5 rounded-br-lg ${
                    idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                  }`}>
                    #{idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 text-xs font-bold text-white truncate">
                    <span>{trophy.profiles?.username || 'Balıkçı'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 mt-0.5">
                    {trophy.weight && <span>{trophy.weight} kg</span>}
                    {trophy.length && <span className="text-slate-400 font-semibold text-[10px]">{trophy.length} cm</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">
                    📍 {trophy.location_note || 'Mera'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔍 SEARCH BAR & FILTER CHIPS */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTr ? 'Mera adı, balıkçı veya kullanılan yem ara... (Örn: Boğaz, Spin)' : 'Search by spot, angler, or lure...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">✕</button>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'all' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTr ? 'Tüm Avlar' : 'All Catches'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('trophy')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'trophy' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTr ? 'Trofe Avlar (>1.5kg)' : 'Trophy Catches'}</span>
          </button>
        </div>
      </div>

      {/* Catches Feed */}
      <div className="space-y-8">
        {filteredCatches.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-2">
            <p className="font-bold text-slate-700">{isTr ? 'Aradığınız kriterlere uygun av bulunamadı.' : 'No catches match your search.'}</p>
            <p className="text-xs">{isTr ? 'Arama terimini veya filtreyi değiştirmeyi deneyin.' : 'Try changing your search filters.'}</p>
          </div>
        ) : (
          displayedCatches.map((log) => (
            <CatchPostItem 
              key={log.id} 
              log={log} 
              currentUser={currentUser} 
              isTr={isTr} 
              onRequireAuth={() => router.push('/login')}
              onOpenAuthor={() => handleOpenAuthorModal(log.profiles, log.tackle_sets, log.user_id)}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredCatches.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 shadow-md text-[#0F172A] font-extrabold px-7 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <span>{isTr ? `Daha Fazla Av Göster (${filteredCatches.length - visibleCount} Av Kaldı)` : 'Load More Catches'}</span>
            <ChevronDown className="w-4 h-4 text-emerald-500" />
          </button>
        </div>
      )}

      {/* INSTAGRAM-STYLE ANGLER & GEAR DETAIL MODAL */}
      <AnimatePresence>
        {selectedAuthorModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center space-x-2 text-[#0F172A] font-extrabold text-base">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>{isTr ? 'Balıkçı Profil Kartı' : 'Angler Profile'}</span>
                </div>
                <button 
                  onClick={() => setSelectedAuthorModal(null)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content Scroll */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Profile Card Header */}
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0F172A] flex items-center justify-center text-emerald-400 font-black text-2xl shadow-md border border-slate-700 shrink-0">
                    {selectedAuthorModal.profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedAuthorModal.profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      (selectedAuthorModal.profile?.full_name || selectedAuthorModal.profile?.username)?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#0F172A]">
                      {selectedAuthorModal.profile?.full_name || selectedAuthorModal.profile?.username || 'Oltapp Balıkçısı'}
                    </h3>
                    {selectedAuthorModal.profile?.username && (
                      <p className="text-xs font-bold text-emerald-600">@{selectedAuthorModal.profile.username}</p>
                    )}
                    {selectedAuthorModal.profile?.city && (
                      <p className="text-xs text-slate-500 font-semibold flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                        {selectedAuthorModal.profile.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedAuthorModal.profile?.bio && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedAuthorModal.profile.bio}
                  </div>
                )}

                {/* Equipment Breakdown Section (Kullanılan Ekipman Takımı) */}
                {selectedAuthorModal.tackleSet ? (
                  <div className="bg-[#0F172A] text-white p-5 rounded-3xl space-y-3 shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                        <Package className="w-4 h-4" />
                        <span>{isTr ? 'Kullanılan Ekipman Seti:' : 'Gear Set Used:'}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">{selectedAuthorModal.tackleSet.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {selectedAuthorModal.tackleSet.rod && (selectedAuthorModal.tackleSet.rod.brand || selectedAuthorModal.tackleSet.rod.model) && (
                        <div className="bg-slate-800/80 p-3 rounded-xl space-y-0.5 border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🎣 Kamış</span>
                          <p className="font-bold text-slate-100">{selectedAuthorModal.tackleSet.rod.brand} {selectedAuthorModal.tackleSet.rod.model}</p>
                          {selectedAuthorModal.tackleSet.rod.length && <p className="text-[10px] text-slate-400 font-medium">{selectedAuthorModal.tackleSet.rod.length}</p>}
                        </div>
                      )}

                      {selectedAuthorModal.tackleSet.reel && (selectedAuthorModal.tackleSet.reel.brand || selectedAuthorModal.tackleSet.reel.model) && (
                        <div className="bg-slate-800/80 p-3 rounded-xl space-y-0.5 border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">⚙️ Makine</span>
                          <p className="font-bold text-slate-100">{selectedAuthorModal.tackleSet.reel.brand} {selectedAuthorModal.tackleSet.reel.model}</p>
                          {selectedAuthorModal.tackleSet.reel.size && <p className="text-[10px] text-slate-400 font-medium">{selectedAuthorModal.tackleSet.reel.size}</p>}
                        </div>
                      )}

                      {selectedAuthorModal.tackleSet.line && (selectedAuthorModal.tackleSet.line.brand || selectedAuthorModal.tackleSet.line.model) && (
                        <div className="bg-slate-800/80 p-3 rounded-xl space-y-0.5 border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🧵 Misina / İp</span>
                          <p className="font-bold text-slate-100">{selectedAuthorModal.tackleSet.line.brand} {selectedAuthorModal.tackleSet.line.model}</p>
                        </div>
                      )}

                      {selectedAuthorModal.tackleSet.lure && (selectedAuthorModal.tackleSet.lure.brand || selectedAuthorModal.tackleSet.lure.model) && (
                        <div className="bg-slate-800/80 p-3 rounded-xl space-y-0.5 border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🐟 Yem / Sahte</span>
                          <p className="font-bold text-slate-100">{selectedAuthorModal.tackleSet.lure.brand} {selectedAuthorModal.tackleSet.lure.model}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 font-semibold text-center">
                    {isTr ? 'Bu av için özel bir ekipman seti seçilmemiş.' : 'No specific gear set selected for this catch.'}
                  </div>
                )}

                {/* Angler's Catch Gallery */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isTr ? `Bu Balıkçının Diğer Avları (${selectedAuthorModal.userCatches.length})` : `Angler's Other Catches`}
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {selectedAuthorModal.userCatches.map(c => (
                      <div key={c.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.image_url} alt="Catch" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5 text-white text-[9px] font-bold">
                          {c.location_note || 'Mera'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CatchPostItem({ 
  log, 
  currentUser, 
  isTr, 
  onRequireAuth,
  onOpenAuthor
}: { 
  log: Record<string, any>; 
  currentUser: any; 
  isTr: boolean; 
  onRequireAuth: () => void;
  onOpenAuthor: () => void;
}) {
  const supabase = createClient();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  // Comments State
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [log.id, currentUser]);

  const fetchLikes = async () => {
    const { data: likesData } = await supabase
      .from('catch_likes')
      .select('user_id')
      .eq('catch_id', log.id);

    if (likesData) {
      setLikes(likesData.length);
      if (currentUser) {
        setIsLiked(likesData.some(l => l.user_id === currentUser.id));
      }
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('catch_comments')
      .select('*')
      .eq('catch_id', log.id)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handleToggleLike = async () => {
    if (!currentUser) return onRequireAuth();
    if (likeLoading) return;
    
    setLikeLoading(true);

    if (isLiked) {
      // Unlike
      setIsLiked(false);
      setLikes(prev => Math.max(0, prev - 1));
      await supabase
        .from('catch_likes')
        .delete()
        .eq('catch_id', log.id)
        .eq('user_id', currentUser.id);
    } else {
      // Like
      setIsLiked(true);
      setLikes(prev => prev + 1);
      await supabase
        .from('catch_likes')
        .insert({ catch_id: log.id, user_id: currentUser.id });

      // Trigger Notification
      if (log.user_id && log.user_id !== currentUser.id) {
        const actorName = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'Oltapp Üyesi';
        await supabase
          .from('notifications')
          .insert({
            user_id: log.user_id,
            actor_id: currentUser.id,
            actor_name: actorName,
            type: 'like',
            catch_id: log.id
          })
          .catch(() => {});
      }
    }
    setLikeLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth();
    if (!newComment.trim()) return;

    setCommenting(true);
    const username = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'Oltapp Üyesi';

    const { data, error } = await supabase
      .from('catch_comments')
      .insert({
        catch_id: log.id,
        user_id: currentUser.id,
        username,
        comment: newComment.trim()
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment('');

      // Trigger Notification
      if (log.user_id && log.user_id !== currentUser.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: log.user_id,
            actor_id: currentUser.id,
            actor_name: username,
            type: 'comment',
            catch_id: log.id
          })
          .catch(() => {});
      }
    }
    setCommenting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col"
    >
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-white">
        <button 
          onClick={onOpenAuthor}
          className="flex items-center space-x-3 text-left group transition-all cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#0F172A] rounded-full overflow-hidden flex items-center justify-center text-emerald-400 font-bold border border-slate-700 group-hover:scale-105 transition-transform shrink-0">
            {log.profiles?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={log.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (log.profiles?.full_name || log.profiles?.username)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <div className="font-extrabold text-[#0F172A] text-sm group-hover:text-emerald-600 transition-colors flex items-center space-x-1.5">
              <span>{log.profiles?.full_name || log.profiles?.username || (isTr ? 'Oltapp Balıkçısı' : 'Angler')}</span>
              {log.tackle_sets && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-md border border-emerald-200 font-bold">
                  🎣 {log.tackle_sets.name}
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </button>

        <CatchCardExport log={log} profileName={log.profiles?.username || 'Oltapp User'} />
      </div>

      {/* Catch Photo */}
      <div className="aspect-[4/5] sm:aspect-video bg-slate-100 w-full relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={log.image_url} alt="Catch" className="w-full h-full object-cover" />
      </div>

      {/* Action Bar (Tebrik Et & Yorumlar) */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Location & Interactive Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-sm font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="line-clamp-1">{log.location_note || (isTr ? 'Mera belirtilmedi' : 'Location not specified')}</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Like Button (Tebrik Et) */}
            <button 
              onClick={handleToggleLike}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                isLiked 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isLiked ? 'Tebrik Edildi' : 'Tebrik Et 👏'}</span>
              {likes > 0 && <span className="ml-1 bg-white px-1.5 py-0.5 rounded-md text-[10px] text-slate-800 border border-slate-200">{likes}</span>}
            </button>

            {/* Comment Drawer Toggle */}
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        {/* Catch Specifications */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {log.weight && (
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold">
              <Scale className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-800">{log.weight} kg</span>
            </div>
          )}
          {log.length && (
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold">
              <Ruler className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-800">{log.length} cm</span>
            </div>
          )}
        </div>

        {/* Tackle / Bait info */}
        {log.lure_used && (
          <div className="pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-bold uppercase">{isTr ? 'Kullanılan Takım / Yem: ' : 'Tackle / Lure: '}</span>
            <span className="text-slate-800 font-bold">{log.lure_used}</span>
          </div>
        )}

        {/* COMMENTS SECTION DRAWER */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-slate-100 space-y-3 overflow-hidden"
            >
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yorumlar ({comments.length})</h4>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder={currentUser ? "Harika bir av! Yorum yaz..." : "Yorum yapmak için giriş yapın..."}
                  disabled={!currentUser}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={commenting || !newComment.trim()}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white p-2 rounded-xl transition-all disabled:opacity-50"
                >
                  {commenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-emerald-400" />}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">İlk yorumu sen yaz!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#0F172A]">{c.username}</span>
                        <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 font-medium">{c.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
