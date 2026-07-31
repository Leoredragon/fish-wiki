'use client';

import { useEffect, useState } from 'react';
import { Flag, Loader2, CheckCircle2, XCircle, Trash2, User as UserIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type ReportRow = {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  admin_note: string | null;
};

type TargetContent = {
  found: boolean;
  authorId?: string | null;
  authorName?: string;
  authorAvatar?: string | null;
  image?: string | null;
  title?: string | null;
  text?: string | null;
};

const TARGET_TABLES: Record<string, { table: string; fields: string }> = {
  catch: { table: 'catch_logs', fields: 'id, user_id, image_url, location_note, notes, weight, length' },
  forum: { table: 'community_forum_posts', fields: 'id, user_id, title, content, image_url' },
  market: { table: 'community_marketplace_items', fields: 'id, user_id, title, description, image_url' },
  tip: { table: 'community_tips', fields: 'id, user_id, title, content, image_url' },
  story: { table: 'community_stories', fields: 'id, user_id, image_url, location_note' },
  comment: { table: 'catch_comments', fields: 'id, user_id, username, comment' },
};

function rowToContent(type: string, row: Record<string, any>): TargetContent {
  switch (type) {
    case 'catch':
      return {
        found: true,
        authorId: row.user_id,
        image: row.image_url,
        title: [row.weight ? `${row.weight} kg` : null, row.length ? `${row.length} cm` : null].filter(Boolean).join(' · ') || null,
        text: row.location_note || row.notes || null,
      };
    case 'forum':
    case 'tip':
      return { found: true, authorId: row.user_id, image: row.image_url, title: row.title, text: row.content };
    case 'market':
      return { found: true, authorId: row.user_id, image: row.image_url, title: row.title, text: row.description };
    case 'story':
      return { found: true, authorId: row.user_id, image: row.image_url, title: null, text: row.location_note || null };
    case 'comment':
      return { found: true, authorId: row.user_id, image: null, title: row.username ? `@${row.username}` : null, text: row.comment };
    default:
      return { found: false };
  }
}

export default function AdminReportsClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [contents, setContents] = useState<Record<string, TargetContent>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from('content_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (filter === 'pending') q = q.eq('status', 'pending');
    const { data } = await q;
    const rows = (data as ReportRow[]) || [];
    setReports(rows);

    // Fetch the reported content per target type, then author profiles
    const contentMap: Record<string, TargetContent> = {};
    const byType = new Map<string, string[]>();
    rows.forEach((r) => {
      if (!TARGET_TABLES[r.target_type]) return;
      byType.set(r.target_type, [...(byType.get(r.target_type) || []), r.target_id]);
    });

    await Promise.all(
      [...byType.entries()].map(async ([type, ids]) => {
        const cfg = TARGET_TABLES[type];
        const { data: targetRows } = await supabase.from(cfg.table).select(cfg.fields).in('id', ids);
        (targetRows as unknown as Record<string, any>[] | null)?.forEach((row) => {
          contentMap[`${type}:${row.id}`] = rowToContent(type, row);
        });
        ids.forEach((id) => {
          if (!contentMap[`${type}:${id}`]) contentMap[`${type}:${id}`] = { found: false };
        });
      })
    );

    const authorIds = [...new Set(Object.values(contentMap).map((c) => c.authorId).filter(Boolean))] as string[];
    if (authorIds.length > 0) {
      const { data: profs } = await supabase.from('profiles').select('id, username, full_name, avatar_url').in('id', authorIds);
      const profMap = new Map((profs || []).map((p: Record<string, any>) => [p.id, p]));
      Object.values(contentMap).forEach((c) => {
        if (!c.authorId) return;
        const p = profMap.get(c.authorId);
        if (p) {
          c.authorName = p.full_name || (p.username ? `@${p.username}` : c.authorId.slice(0, 8));
          c.authorAvatar = p.avatar_url || null;
        }
      });
    }

    setContents(contentMap);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: string, status: 'dismissed' | 'actioned' | 'reviewed') => {
    setUpdatingId(id);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from('content_reports')
      .update({
        status,
        reviewed_by: user?.id || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);
    setUpdatingId(null);
    load();
  };

  const deleteContent = async (report: ReportRow) => {
    const ok = confirm(
      isTr
        ? 'Raporlanan içerik kalıcı olarak silinecek. Emin misiniz?'
        : 'The reported content will be permanently deleted. Are you sure?'
    );
    if (!ok) return;

    setUpdatingId(report.id);
    const supabase = createClient();
    const { error } = await supabase.rpc('admin_delete_reported_content', {
      p_target_type: report.target_type,
      p_target_id: report.target_id,
    });

    if (error) {
      alert(isTr ? `Silinemedi: ${error.message}` : `Delete failed: ${error.message}`);
      setUpdatingId(null);
      return;
    }

    await setStatus(report.id, 'actioned');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-500" />
            {isTr ? 'İçerik Raporları' : 'Content Reports'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isTr ? 'Kullanıcı şikayet kuyruğu — incele, yok say, işlem yap veya içeriği sil.' : 'User report queue.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
              filter === 'pending' ? 'bg-[#0F172A] text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {isTr ? 'Bekleyen' : 'Pending'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
              filter === 'all' ? 'bg-[#0F172A] text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {isTr ? 'Tümü' : 'All'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center text-sm font-semibold text-slate-500">
          {isTr ? 'Bu filtrede rapor yok.' : 'No reports for this filter.'}
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const content = contents[`${r.target_type}:${r.target_id}`];
            return (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-100 uppercase">
                      {r.target_type}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{r.reason}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md border ${
                        r.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(r.created_at).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
                  </span>
                </div>

                {r.details && (
                  <p className="text-xs text-slate-700 font-medium bg-amber-50/60 border border-amber-100 rounded-lg px-2.5 py-1.5">
                    <span className="font-bold">{isTr ? 'Rapor notu: ' : 'Report note: '}</span>
                    {r.details}
                  </p>
                )}

                {/* Reported content preview */}
                {!content || !content.found ? (
                  <div className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    {isTr ? 'İçerik bulunamadı — silinmiş olabilir.' : 'Content not found — may already be deleted.'}
                  </div>
                ) : (
                  <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                    {content.image && (
                      <a href={content.image} target="_blank" rel="noreferrer" className="shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 relative">
                          <Image src={content.image} alt="Reported content" fill sizes="80px" className="object-cover" />
                        </div>
                      </a>
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                        {content.authorAvatar ? (
                          <span className="w-5 h-5 rounded-full overflow-hidden relative shrink-0">
                            <Image src={content.authorAvatar} alt="" fill sizes="20px" className="object-cover" />
                          </span>
                        ) : (
                          <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">{content.authorName || (isTr ? 'Bilinmeyen kullanıcı' : 'Unknown user')}</span>
                      </div>
                      {content.title && <div className="text-xs font-bold text-slate-700 truncate">{content.title}</div>}
                      {content.text && <p className="text-xs text-slate-500 font-medium line-clamp-2">{content.text}</p>}
                    </div>
                  </div>
                )}

                {r.status === 'pending' && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={updatingId === r.id}
                      onClick={() => setStatus(r.id, 'dismissed')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {isTr ? 'Yok say' : 'Dismiss'}
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === r.id}
                      onClick={() => setStatus(r.id, 'actioned')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F172A] text-white disabled:opacity-60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {isTr ? 'İşlem yapıldı' : 'Actioned'}
                    </button>
                    {content?.found && (
                      <button
                        type="button"
                        disabled={updatingId === r.id}
                        onClick={() => deleteContent(r)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60"
                      >
                        {updatingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        {isTr ? 'İçeriği Sil' : 'Delete Content'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
