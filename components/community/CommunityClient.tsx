/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Scale, Ruler, Heart, MessageSquare, Send, Users, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CatchCardExport from './CatchCardExport';
import { useRouter } from 'next/navigation';

export default function CommunityClient({ catches }: { catches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

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

      {/* Catches Feed */}
      <div className="space-y-8">
        {catches.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500">
            {isTr ? 'Henüz paylaşım yapılmamış. İlk paylaşan sen ol!' : 'No catches shared yet. Be the first!'}
          </div>
        ) : (
          catches.map((log) => (
            <CatchPostItem 
              key={log.id} 
              log={log} 
              currentUser={currentUser} 
              isTr={isTr} 
              onRequireAuth={() => router.push('/login')} 
            />
          ))
        )}
      </div>
    </div>
  );
}

function CatchPostItem({ 
  log, 
  currentUser, 
  isTr, 
  onRequireAuth 
}: { 
  log: Record<string, any>; 
  currentUser: any; 
  isTr: boolean; 
  onRequireAuth: () => void;
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
            {log.profiles?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-extrabold text-[#0F172A] text-sm">
              {log.profiles?.username || 'Gizli Balıkçı'}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

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

