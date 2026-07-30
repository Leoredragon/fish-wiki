'use client';

import { useState } from 'react';
import { Flag, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const REASONS = [
  { value: 'fake', labelTr: 'Abartılı / sahte iddia', labelEn: 'Fake / exaggerated' },
  { value: 'wrong_species', labelTr: 'Yanlış tür etiketi', labelEn: 'Wrong species' },
  { value: 'spam', labelTr: 'Spam / reklam', labelEn: 'Spam' },
  { value: 'offensive', labelTr: 'Uygunsuz içerik', labelEn: 'Offensive' },
  { value: 'other', labelTr: 'Diğer', labelEn: 'Other' },
] as const;

export type ReportTargetType = 'catch' | 'forum' | 'market' | 'tip' | 'story' | 'comment';

export default function ReportContentButton({
  targetType,
  targetId,
  currentUserId,
  isTr,
  onRequireAuth,
  compact = false,
}: {
  targetType: ReportTargetType;
  targetId: string;
  currentUserId?: string | null;
  isTr: boolean;
  onRequireAuth?: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number]['value']>('fake');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleOpen = () => {
    if (!currentUserId) {
      onRequireAuth?.();
      return;
    }
    setOpen(true);
    setDone(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !targetId) return;
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('content_reports').insert({
        reporter_id: currentUserId,
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim() || null,
      });
      if (error) {
        alert(isTr ? `Rapor gönderilemedi: ${error.message}` : `Report failed: ${error.message}`);
      } else {
        setDone(true);
        setTimeout(() => {
          setOpen(false);
          setDetails('');
          setDone(false);
        }, 1200);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          compact
            ? 'p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors'
            : 'inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors'
        }
        title={isTr ? 'Rapor et' : 'Report'}
      >
        <Flag className="w-3.5 h-3.5" />
        {!compact && <span>{isTr ? 'Rapor et' : 'Report'}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-[#0F172A] text-base">
                  {isTr ? 'İçeriği rapor et' : 'Report content'}
                </h3>
                <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {done ? (
                <p className="text-sm font-bold text-emerald-600 py-6 text-center">
                  {isTr ? 'Teşekkürler — rapor alındı.' : 'Thanks — report received.'}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <p className="text-slate-500 font-medium">
                    {isTr
                      ? 'Moderasyon ekibi inceleyecek. Yanlış raporlar hesap güvenilirliğini etkilemez; tekrarlayan kötüye kullanım incelenir.'
                      : 'Mods will review. False reports won’t hurt trust; repeated abuse may be reviewed.'}
                  </p>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Sebep' : 'Reason'}</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value as typeof reason)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                    >
                      {REASONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {isTr ? r.labelTr : r.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{isTr ? 'Detay (opsiyonel)' : 'Details (optional)'}</label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold"
                      placeholder={isTr ? 'Kısaca açıklayın...' : 'Briefly explain...'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0F172A] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
                    <span>{isTr ? 'Raporu Gönder' : 'Submit Report'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
