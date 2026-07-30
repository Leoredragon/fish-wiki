'use client';

import { BarChart3, MapPin, Package, Fish, Scale, Ruler } from 'lucide-react';
import { buildCatchAnalytics, type CatchLike } from '@/lib/catchAnalytics';

function RankBars({
  items,
  emptyLabel,
}: {
  items: { label: string; count: number }[];
  emptyLabel: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) {
    return <p className="text-xs text-slate-400 font-medium py-2">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between gap-2 text-[11px] font-bold text-slate-700">
            <span className="truncate">{item.label}</span>
            <span className="shrink-0 text-emerald-600">{item.count}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CatchAnalyticsPanel({
  catches,
  isTr,
}: {
  catches: CatchLike[];
  isTr: boolean;
}) {
  const analytics = buildCatchAnalytics(catches, isTr ? 'tr' : 'en');
  const monthMax = Math.max(...analytics.byMonth.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          {isTr ? 'Av Günlüğü Analitiği' : 'Catch Log Analytics'}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {isTr
            ? 'Kendi kayıtlarından: ay, yem, mera ve tür dağılımı.'
            : 'From your logs: month, lure, spot and species breakdown.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam Av' : 'Total'}</div>
          <div className="text-2xl font-black text-[#0F172A] mt-1">{analytics.totalCatches}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam kg' : 'Total kg'}</div>
          <div className="text-2xl font-black text-[#0F172A] mt-1">{analytics.totalWeight.toFixed(1)}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center justify-center gap-1">
            <Scale className="w-3 h-3" /> {isTr ? 'Ort. kg' : 'Avg kg'}
          </div>
          <div className="text-2xl font-black text-[#0F172A] mt-1">
            {analytics.avgWeight != null ? analytics.avgWeight.toFixed(1) : '—'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center justify-center gap-1">
            <Ruler className="w-3 h-3" /> {isTr ? 'Ort. cm' : 'Avg cm'}
          </div>
          <div className="text-2xl font-black text-[#0F172A] mt-1">
            {analytics.avgLength != null ? Math.round(analytics.avgLength) : '—'}
          </div>
        </div>
      </div>

      {(analytics.biggestCatch || analytics.longestCatch) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analytics.biggestCatch && (
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">
                {isTr ? 'En ağır trofe' : 'Heaviest trophy'}
              </div>
              <div className="text-lg font-black text-[#0F172A]">
                {analytics.biggestCatch.weight} kg
                {analytics.biggestCatch.location_note ? ` · ${analytics.biggestCatch.location_note}` : ''}
              </div>
            </div>
          )}
          {analytics.longestCatch && (
            <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-sm">
              <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-wide mb-1">
                {isTr ? 'En uzun av' : 'Longest catch'}
              </div>
              <div className="text-lg font-black text-[#0F172A]">
                {analytics.longestCatch.length} cm
                {analytics.longestCatch.location_note ? ` · ${analytics.longestCatch.location_note}` : ''}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#0F172A]">{isTr ? 'Aylık av sayısı' : 'Catches by month'}</h3>
        {analytics.byMonth.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium">{isTr ? 'Henüz veri yok.' : 'No data yet.'}</p>
        ) : (
          <div className="flex items-end gap-1.5 h-28">
            {analytics.byMonth.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0 h-full">
                <span className="text-[9px] font-bold text-emerald-700">{m.count || ''}</span>
                <div
                  className="w-full rounded-t-md bg-emerald-500/90 min-h-[4px]"
                  style={{ height: `${Math.max(6, (m.count / monthMax) * 100)}%` }}
                  title={`${m.label}: ${m.count}`}
                />
                <span className="text-[8px] font-semibold text-slate-400 truncate w-full text-center">
                  {m.label.replace(/ /g, '\n').split('\n')[0]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-500" />
            {isTr ? 'En çok kullanılan yem' : 'Top lures'}
          </h3>
          <RankBars
            items={analytics.topLures}
            emptyLabel={isTr ? 'Yem bilgisi girilmemiş.' : 'No lure data yet.'}
          />
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            {isTr ? 'En verimli meralar' : 'Top spots'}
          </h3>
          <RankBars
            items={analytics.topSpots}
            emptyLabel={isTr ? 'Mera notu yok.' : 'No spot notes yet.'}
          />
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <Fish className="w-4 h-4 text-emerald-500" />
            {isTr ? 'Tür dağılımı' : 'Species'}
          </h3>
          <RankBars
            items={analytics.topSpecies}
            emptyLabel={isTr ? 'Tür seçimi yapılmış av yok (yeni kayıtlarda görünecek).' : 'No species-tagged catches yet.'}
          />
        </div>
      </div>
    </div>
  );
}
