'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Fish, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getLegalMinSize } from '@/lib/fish_regulations';

export type FishOption = {
  id: string;
  name_tr: string;
  name_en: string | null;
  limit_size?: string | null;
};

function parseLimitFromText(text?: string | null): number | null {
  if (!text) return null;
  const m = text.replace(',', '.').match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export function getSoftLegalMinCm(fish: FishOption | null): number | null {
  if (!fish) return null;
  return getLegalMinSize(fish.name_tr) ?? getLegalMinSize(fish.name_en || '') ?? parseLimitFromText(fish.limit_size);
}

export default function CatchFishPicker({
  value,
  onChange,
  lengthCm,
  isTr,
  required = true,
}: {
  value: string;
  onChange: (fishId: string, fish: FishOption | null) => void;
  lengthCm?: string;
  isTr: boolean;
  required?: boolean;
}) {
  const [fishes, setFishes] = useState<FishOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('fishes')
        .select('id, name_tr, name_en, limit_size')
        .order('name_tr', { ascending: true });
      if (!cancelled) {
        setFishes((data as FishOption[]) || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(() => fishes.find((f) => f.id === value) || null, [fishes, value]);
  const minCm = getSoftLegalMinCm(selected);
  const lengthNum = lengthCm ? Number(lengthCm) : NaN;
  const underLegal =
    selected && minCm != null && Number.isFinite(lengthNum) && lengthNum > 0 && lengthNum < minCm;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fishes;
    return fishes.filter(
      (f) =>
        f.name_tr.toLowerCase().includes(q) ||
        (f.name_en || '').toLowerCase().includes(q)
    );
  }, [fishes, query]);

  return (
    <div className="space-y-2">
      <label className="block text-slate-700 font-bold mb-1">
        {isTr ? 'Balık Türü' : 'Fish Species'}
        {required ? ' *' : ''}
      </label>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold py-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          {isTr ? 'Balık listesi yükleniyor...' : 'Loading species...'}
        </div>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isTr ? 'Tür ara (örn: Lüfer, Sazan...)' : 'Search species...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500 mb-1.5"
          />
          <div className="relative">
            <Fish className="absolute left-3 top-3 w-4 h-4 text-emerald-500 pointer-events-none" />
            <select
              value={value}
              required={required}
              onChange={(e) => {
                const id = e.target.value;
                const fish = fishes.find((f) => f.id === id) || null;
                onChange(id, fish);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="">{isTr ? 'Balık seçin...' : 'Select a fish...'}</option>
              {filtered.map((f) => (
                <option key={f.id} value={f.id}>
                  {isTr ? f.name_tr : f.name_en || f.name_tr}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {selected && minCm != null && (
        <p className="text-[11px] font-semibold text-slate-500">
          {isTr
            ? `Bilgi: bu tür için yaygın yasal asgari boy ~${minCm} cm (yaklaşık).`
            : `Note: common legal min size for this species ~${minCm} cm (approx).`}
        </p>
      )}

      {underLegal && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-[11px] font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {isTr
              ? `Girdiğiniz boy (${lengthNum} cm), bu tür için kayıtlı asgari boydan (~${minCm} cm) küçük görünüyor. Paylaşım engellenmez; lütfen yasalara dikkat edin.`
              : `Entered length (${lengthNum} cm) looks below the recorded min size (~${minCm} cm). Sharing is not blocked — please follow local regulations.`}
          </span>
        </div>
      )}
    </div>
  );
}
