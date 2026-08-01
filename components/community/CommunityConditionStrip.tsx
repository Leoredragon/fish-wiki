'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CloudSun, Sunrise, Sunset, ChevronRight } from 'lucide-react';
import { TURKEY_PROVINCES } from '@/lib/turkeyProvinces';
import { computeFishingConditionScore } from '@/lib/fishingConditionScore';

const CACHE_KEY = 'oltaapp_condition_strip_v1';

interface StripData {
  day: string;
  provinceNameTr: string;
  provinceNameEn: string;
  score: number;
  labelTr: string;
  labelEn: string;
  sunrise: string; // HH:mm
  sunset: string; // HH:mm
  tempC: number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function findClosestProvince(lat: number, lon: number) {
  let closest = TURKEY_PROVINCES[0];
  let best = Infinity;
  for (const p of TURKEY_PROVINCES) {
    const d = (p.lat - lat) ** 2 + (p.lon - lon) ** 2;
    if (d < best) {
      best = d;
      closest = p;
    }
  }
  return closest;
}

/** Location only when permission is already granted — never prompts the user here. */
async function getQuietPosition(): Promise<{ lat: number; lon: number } | null> {
  try {
    if (!navigator.permissions || !navigator.geolocation) return null;
    const status = await navigator.permissions.query({ name: 'geolocation' });
    if (status.state !== 'granted') return null;
    return await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 4000, maximumAge: 30 * 60 * 1000 }
      );
    });
  } catch {
    return null;
  }
}

export default function CommunityConditionStrip() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [data, setData] = useState<StripData | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: StripData = JSON.parse(cachedRaw);
          if (cached.day === todayKey()) {
            setData(cached);
            return;
          }
        }
      } catch {}

      try {
        const coords = await getQuietPosition();
        const province = coords
          ? findClosestProvince(coords.lat, coords.lon)
          : TURKEY_PROVINCES.find((p) => p.id === '34') || TURKEY_PROVINCES[0];

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${province.lat}&longitude=${province.lon}&current=temperature_2m,surface_pressure,wind_speed_10m,weather_code&daily=surface_pressure_max,sunrise,sunset&past_days=1&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled || !json?.current) return;

        const dailyTimes: string[] = json.daily?.time || [];
        const today = todayKey();
        const todayIdx = dailyTimes.findIndex((t: string) => t === today);
        const yesterdayIdx = todayIdx > 0 ? todayIdx - 1 : -1;
        const pressureYesterday = yesterdayIdx >= 0 ? json.daily?.surface_pressure_max?.[yesterdayIdx] : null;

        const sunriseIso = todayIdx >= 0 ? json.daily?.sunrise?.[todayIdx] : null;
        const sunsetIso = todayIdx >= 0 ? json.daily?.sunset?.[todayIdx] : null;

        const result = computeFishingConditionScore({
          weatherCode: json.current.weather_code,
          windSpeedKmh: json.current.wind_speed_10m,
          tempC: json.current.temperature_2m,
          pressureHpa: json.current.surface_pressure,
          pressureChange24h: pressureYesterday != null ? json.current.surface_pressure - pressureYesterday : null,
          sunriseIso,
          sunsetIso
        });

        const toHm = (iso: string | null) =>
          iso ? new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--';

        const strip: StripData = {
          day: today,
          provinceNameTr: province.nameTr,
          provinceNameEn: province.nameEn,
          score: result.score,
          labelTr: result.labelTr,
          labelEn: result.labelEn,
          sunrise: toHm(sunriseIso),
          sunset: toHm(sunsetIso),
          tempC: Math.round(json.current.temperature_2m)
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(strip));
        } catch {}
        if (!cancelled) setData(strip);
      } catch {
        // weather unavailable — strip simply stays hidden
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  const scoreColor =
    data.score >= 70
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : data.score >= 45
        ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <Link
      href="/weather"
      className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors w-full overflow-hidden"
    >
      <CloudSun className="w-4 h-4 text-emerald-600 shrink-0" />
      <span className="text-xs font-bold text-[#0F172A] truncate">
        {isTr ? data.provinceNameTr : data.provinceNameEn}
      </span>
      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border shrink-0 ${scoreColor}`}>
        {isTr ? 'Av skoru' : 'Score'} {data.score}/100 · {isTr ? data.labelTr : data.labelEn}
      </span>
      <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-semibold shrink-0">
        <Sunrise className="w-3.5 h-3.5 text-amber-500" /> {data.sunrise}
        <Sunset className="w-3.5 h-3.5 text-orange-500 ml-1" /> {data.sunset}
      </span>
      <span className="text-[11px] text-slate-500 font-semibold shrink-0">{data.tempC}°</span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
    </Link>
  );
}
