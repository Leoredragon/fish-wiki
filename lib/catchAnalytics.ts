export type CatchLike = {
  id?: string;
  weight?: number | null;
  length?: number | null;
  lure_used?: string | null;
  location_note?: string | null;
  created_at?: string | null;
  fish_id?: string | null;
  fishes?: { name_tr?: string | null; name_en?: string | null } | null;
};

export type RankedItem = { label: string; count: number };

export type CatchAnalytics = {
  totalCatches: number;
  totalWeight: number;
  avgWeight: number | null;
  avgLength: number | null;
  biggestCatch: CatchLike | null;
  longestCatch: CatchLike | null;
  byMonth: RankedItem[];
  topLures: RankedItem[];
  topSpots: RankedItem[];
  topSpecies: RankedItem[];
};

function monthKey(iso?: string | null, locale = 'tr') {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' });
}

function rankMap(map: Map<string, number>, limit = 5): RankedItem[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildCatchAnalytics(catches: CatchLike[], locale: string = 'tr'): CatchAnalytics {
  const list = Array.isArray(catches) ? catches : [];
  let totalWeight = 0;
  let weightCount = 0;
  let lengthSum = 0;
  let lengthCount = 0;
  let biggestCatch: CatchLike | null = null;
  let longestCatch: CatchLike | null = null;

  const monthMap = new Map<string, number>();
  const lureMap = new Map<string, number>();
  const spotMap = new Map<string, number>();
  const speciesMap = new Map<string, number>();

  for (const c of list) {
    const w = Number(c.weight);
    if (Number.isFinite(w) && w > 0) {
      totalWeight += w;
      weightCount += 1;
      if (!biggestCatch || w > Number(biggestCatch.weight || 0)) biggestCatch = c;
    }

    const len = Number(c.length);
    if (Number.isFinite(len) && len > 0) {
      lengthSum += len;
      lengthCount += 1;
      if (!longestCatch || len > Number(longestCatch.length || 0)) longestCatch = c;
    }

    const mk = monthKey(c.created_at, locale);
    if (mk) monthMap.set(mk, (monthMap.get(mk) || 0) + 1);

    const lure = (c.lure_used || '').trim();
    if (lure) lureMap.set(lure, (lureMap.get(lure) || 0) + 1);

    const spot = (c.location_note || '').trim();
    if (spot) spotMap.set(spot, (spotMap.get(spot) || 0) + 1);

    const species =
      locale === 'tr'
        ? (c.fishes?.name_tr || c.fishes?.name_en || '')
        : (c.fishes?.name_en || c.fishes?.name_tr || '');
    const speciesLabel = species.trim();
    if (speciesLabel) speciesMap.set(speciesLabel, (speciesMap.get(speciesLabel) || 0) + 1);
  }

  // Chronological months (last 12 unique labels by date order from catches)
  const chronologicalMonths: RankedItem[] = [];
  const seen = new Set<string>();
  const sortedByDate = [...list].sort(
    (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  );
  for (const c of sortedByDate) {
    const mk = monthKey(c.created_at, locale);
    if (!mk || seen.has(mk)) continue;
    seen.add(mk);
    chronologicalMonths.push({ label: mk, count: monthMap.get(mk) || 0 });
  }

  return {
    totalCatches: list.length,
    totalWeight,
    avgWeight: weightCount ? totalWeight / weightCount : null,
    avgLength: lengthCount ? lengthSum / lengthCount : null,
    biggestCatch,
    longestCatch,
    byMonth: chronologicalMonths.slice(-12),
    topLures: rankMap(lureMap),
    topSpots: rankMap(spotMap),
    topSpecies: rankMap(speciesMap),
  };
}
