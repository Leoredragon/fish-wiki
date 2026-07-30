'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Users, Plus, Loader2, X, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export type MeetupRow = {
  id: string;
  host_id: string;
  title: string;
  description: string;
  city: string | null;
  spot_note: string;
  meetup_at: string;
  max_participants: number;
  fish_focus: string | null;
  status: string;
  created_at: string;
  profiles?: {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    city?: string | null;
  } | null;
  community_meetup_joins?: Array<{ user_id: string }> | null;
};

function toLocalInputValue(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MeetupsPanel({
  initialMeetups,
  currentUser,
  isAdmin,
  isTr,
  onRequireAuth,
}: {
  initialMeetups: MeetupRow[];
  currentUser: { id: string } | null;
  isAdmin: boolean;
  isTr: boolean;
  onRequireAuth: (action?: import('@/components/GuestAuthPrompt').GuestAuthAction) => void;
}) {
  const supabase = createClient();
  const [meetups, setMeetups] = useState<MeetupRow[]>(initialMeetups);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [spotNote, setSpotNote] = useState('');
  const [meetupAt, setMeetupAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(7, 0, 0, 0);
    return toLocalInputValue(d);
  });
  const [maxParticipants, setMaxParticipants] = useState('4');
  const [fishFocus, setFishFocus] = useState('');

  const upcoming = useMemo(
    () =>
      [...meetups]
        .filter((m) => m.status !== 'cancelled')
        .sort((a, b) => new Date(a.meetup_at).getTime() - new Date(b.meetup_at).getTime()),
    [meetups]
  );

  const refreshOne = async (id: string) => {
    const { data } = await supabase
      .from('community_meetups')
      .select(`*, profiles(username, full_name, avatar_url, city), community_meetup_joins(user_id)`)
      .eq('id', id)
      .single();
    if (data) {
      setMeetups((prev) => prev.map((m) => (m.id === id ? (data as MeetupRow) : m)));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth('generic');
    if (!title.trim() || !description.trim() || !spotNote.trim() || !meetupAt) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('community_meetups')
        .insert({
          host_id: currentUser.id,
          title: title.trim(),
          description: description.trim(),
          city: city.trim() || null,
          spot_note: spotNote.trim(),
          meetup_at: new Date(meetupAt).toISOString(),
          max_participants: Math.min(20, Math.max(2, parseInt(maxParticipants, 10) || 4)),
          fish_focus: fishFocus.trim() || null,
          status: 'open',
        })
        .select(`*, profiles(username, full_name, avatar_url, city), community_meetup_joins(user_id)`)
        .single();

      if (error || !data) {
        alert(isTr ? `Buluşma oluşturulamadı: ${error?.message || 'hata'}` : `Failed: ${error?.message}`);
        return;
      }

      // Host joins automatically
      await supabase.from('community_meetup_joins').insert({
        meetup_id: data.id,
        user_id: currentUser.id,
      });
      await refreshOne(data.id);
      setMeetups((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [data as MeetupRow, ...prev];
      });
      // ensure join count after host insert
      setTimeout(() => refreshOne(data.id), 200);

      setModalOpen(false);
      setTitle('');
      setDescription('');
      setCity('');
      setSpotNote('');
      setFishFocus('');
      setMaxParticipants('4');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleJoin = async (meetup: MeetupRow) => {
    if (!currentUser) return onRequireAuth('generic');
    if (meetup.status === 'cancelled') return;

    const joins = meetup.community_meetup_joins || [];
    const already = joins.some((j) => j.user_id === currentUser.id);
    const isHost = meetup.host_id === currentUser.id;

    if (isHost && already) {
      alert(isTr ? 'Organizatör olarak ayrılamazsınız. İptal edebilirsiniz.' : 'Hosts cannot leave — cancel instead.');
      return;
    }

    setJoiningId(meetup.id);
    try {
      if (already) {
        await supabase
          .from('community_meetup_joins')
          .delete()
          .eq('meetup_id', meetup.id)
          .eq('user_id', currentUser.id);
      } else {
        if (joins.length >= meetup.max_participants) {
          alert(isTr ? 'Kontenjan dolu.' : 'This meetup is full.');
          return;
        }
        const { error } = await supabase.from('community_meetup_joins').insert({
          meetup_id: meetup.id,
          user_id: currentUser.id,
        });
        if (error) {
          alert(isTr ? `Katılım başarısız: ${error.message}` : error.message);
          return;
        }
      }
      await refreshOne(meetup.id);
    } finally {
      setJoiningId(null);
    }
  };

  const handleCancel = async (meetup: MeetupRow) => {
    if (!currentUser) return;
    if (!(meetup.host_id === currentUser.id || isAdmin)) return;
    if (!confirm(isTr ? 'Bu buluşmayı iptal etmek istiyor musunuz?' : 'Cancel this meetup?')) return;

    await supabase.from('community_meetups').update({ status: 'cancelled' }).eq('id', meetup.id);
    setMeetups((prev) => prev.map((m) => (m.id === meetup.id ? { ...m, status: 'cancelled' } : m)));
  };

  const handleDelete = async (meetup: MeetupRow) => {
    if (!currentUser) return;
    if (!(meetup.host_id === currentUser.id || isAdmin)) return;
    if (!confirm(isTr ? 'Buluşmayı silmek istiyor musunuz?' : 'Delete meetup?')) return;
    await supabase.from('community_meetups').delete().eq('id', meetup.id);
    setMeetups((prev) => prev.filter((m) => m.id !== meetup.id));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-[11px] font-semibold text-amber-900 leading-relaxed">
        {isTr
          ? 'Güvenlik: İlk buluşmalarda kalabalık / gündüz tercih edin. Konum ve iletişim bilgilerini dikkatli paylaşın.'
          : 'Safety: Prefer daytime / public spots for first meetups. Share contact details carefully.'}
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            {isTr ? 'Mera Buluşmaları' : 'Fishing Meetups'}
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {isTr ? 'Bu hafta sonu meraya gidecek biri var mı? Etkinlik oluştur veya katıl.' : 'Create or join a fishing meetup.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!currentUser) return onRequireAuth('generic');
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          {isTr ? 'Buluşma Oluştur' : 'Create Meetup'}
        </button>
      </div>

      {upcoming.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 text-center">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">
            {isTr ? 'Henüz açık buluşma yok. İlkini sen oluştur.' : 'No open meetups yet. Create the first one.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((m) => {
            const joins = m.community_meetup_joins || [];
            const count = joins.length;
            const joined = Boolean(currentUser && joins.some((j) => j.user_id === currentUser.id));
            const isHost = currentUser?.id === m.host_id;
            const full = count >= m.max_participants;
            const past = new Date(m.meetup_at).getTime() < Date.now();
            const hostName =
              m.profiles?.full_name || (m.profiles?.username ? `@${m.profiles.username}` : (isTr ? 'Organizatör' : 'Host'));

            return (
              <div key={m.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#0F172A] leading-snug">{m.title}</h3>
                      {m.status === 'cancelled' && (
                        <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100">
                          {isTr ? 'İPTAL' : 'CANCELLED'}
                        </span>
                      )}
                      {full && m.status === 'open' && (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {isTr ? 'DOLU' : 'FULL'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {isTr ? 'Organizatör' : 'Host'}: {hostName}
                    </p>
                  </div>
                  {(isHost || isAdmin) && (
                    <div className="flex items-center gap-1 shrink-0">
                      {m.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleCancel(m)}
                          className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg"
                        >
                          {isTr ? 'İptal' : 'Cancel'}
                        </button>
                      )}
                      <button type="button" onClick={() => handleDelete(m)} className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">{m.description}</p>

                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(m.meetup_at).toLocaleString(isTr ? 'tr-TR' : 'en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {past ? ` · ${isTr ? 'geçti' : 'past'}` : ''}
                  </span>
                  {m.city && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg px-2.5 py-1">
                      {m.city}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="line-clamp-1">{m.spot_note}</span>
                  </span>
                  {m.fish_focus && (
                    <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">{m.fish_focus}</span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {count}/{m.max_participants}
                  </span>
                </div>

                {m.status !== 'cancelled' && !past && (
                  <button
                    type="button"
                    disabled={joiningId === m.id || (full && !joined)}
                    onClick={() => handleToggleJoin(m)}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                      joined
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#0F172A] text-white'
                    }`}
                  >
                    {joiningId === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : joined ? (
                      <UserMinus className="w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>
                      {joined
                        ? (isTr ? (isHost ? 'Katıldın (organizatör)' : 'Ayrıl') : (isHost ? 'Joined (host)' : 'Leave'))
                        : full
                          ? (isTr ? 'Kontenjan dolu' : 'Full')
                          : (isTr ? 'Bana katıl' : 'Join me')}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-[#0F172A] text-base">
                  {isTr ? 'Yeni Buluşma' : 'New Meetup'}
                </h3>
                <button type="button" onClick={() => setModalOpen(false)} className="p-2 rounded-full bg-slate-100 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Başlık *' : 'Title *'}</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    placeholder={isTr ? 'Örn: Cumartesi LRF — Moda' : 'e.g. Saturday LRF'}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Açıklama *' : 'Description *'}</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    placeholder={isTr ? 'Saat, tarz, ne getirilmeli...' : 'Time, style, what to bring...'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Şehir' : 'City'}</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Kontenjan' : 'Slots'}</label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Mera / Buluşma noktası *' : 'Spot / meetup point *'}</label>
                  <input
                    value={spotNote}
                    onChange={(e) => setSpotNote(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    placeholder={isTr ? 'Örn: Kadıköy iskele otopark girişi' : 'Meeting point...'}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Tarih & saat *' : 'Date & time *'}</label>
                  <input
                    type="datetime-local"
                    value={meetupAt}
                    onChange={(e) => setMeetupAt(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Hedef / tarz' : 'Focus'}</label>
                  <input
                    value={fishFocus}
                    onChange={(e) => setFishFocus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    placeholder={isTr ? 'Örn: LRF, feeder, spin...' : 'e.g. LRF, feeder...'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0F172A] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
                  <span>{isTr ? 'Yayınla' : 'Publish'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
