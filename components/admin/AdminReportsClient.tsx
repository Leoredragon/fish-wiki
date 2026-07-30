'use client';

import { useEffect, useState } from 'react';
import { Flag, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
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

export default function AdminReportsClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [reports, setReports] = useState<ReportRow[]>([]);
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
    setReports((data as ReportRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
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

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-500" />
            {isTr ? 'İçerik Raporları' : 'Content Reports'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isTr ? 'Kullanıcı şikayet kuyruğu — incele, yok say veya işlem yapıldı işaretle.' : 'User report queue.'}
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
          {reports.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
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
              <p className="text-[11px] font-mono text-slate-500 break-all">
                id: {r.target_id}
              </p>
              {r.details && <p className="text-xs text-slate-700 font-medium">{r.details}</p>}
              {r.status === 'pending' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    disabled={updatingId === r.id}
                    onClick={() => setStatus(r.id, 'dismissed')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {isTr ? 'Yok say' : 'Dismiss'}
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === r.id}
                    onClick={() => setStatus(r.id, 'actioned')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0F172A] text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {isTr ? 'İşlem yapıldı' : 'Actioned'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
