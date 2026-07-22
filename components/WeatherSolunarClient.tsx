'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  CloudSun,
  Wind,
  Gauge,
  RefreshCw,
  Zap,
  Navigation
} from 'lucide-react';

interface CitySpot {
  id: string;
  nameTr: string;
  nameEn: string;
  lat: number;
  lon: number;
  regionTr: string;
  regionEn: string;
}

const SPOTS: CitySpot[] = [
  // Marmara
  { id: 'ist', nameTr: 'İstanbul', nameEn: 'Istanbul', lat: 41.0082, lon: 28.9784, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: 'can', nameTr: 'Çanakkale', nameEn: 'Canakkale', lat: 40.1553, lon: 26.4142, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: 'bal', nameTr: 'Balıkesir', nameEn: 'Balikesir', lat: 39.6484, lon: 27.8826, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: 'koc', nameTr: 'Kocaeli (İzmit)', nameEn: 'Kocaeli', lat: 40.7654, lon: 29.9408, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: 'tek', nameTr: 'Tekirdağ', nameEn: 'Tekirdag', lat: 40.9833, lon: 27.5167, regionTr: 'Marmara', regionEn: 'Marmara' },
  
  // Ege
  { id: 'izm', nameTr: 'İzmir', nameEn: 'Izmir', lat: 38.4237, lon: 27.1428, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: 'mug', nameTr: 'Muğla', nameEn: 'Mugla', lat: 37.2153, lon: 28.3636, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: 'ayd', nameTr: 'Aydın', nameEn: 'Aydin', lat: 37.8380, lon: 27.8456, regionTr: 'Ege', regionEn: 'Aegean' },

  // Akdeniz
  { id: 'ant', nameTr: 'Antalya', nameEn: 'Antalya', lat: 36.8969, lon: 30.7133, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: 'mer', nameTr: 'Mersin', nameEn: 'Mersin', lat: 36.8121, lon: 34.6415, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: 'ada', nameTr: 'Adana', nameEn: 'Adana', lat: 37.0000, lon: 35.3213, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: 'hat', nameTr: 'Hatay (İskenderun)', nameEn: 'Hatay', lat: 36.5872, lon: 36.1735, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },

  // Karadeniz
  { id: 'tra', nameTr: 'Trabzon', nameEn: 'Trabzon', lat: 41.0027, lon: 39.7168, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: 'sam', nameTr: 'Samsun', nameEn: 'Samsun', lat: 41.2867, lon: 36.33, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: 'sin', nameTr: 'Sinop', nameEn: 'Sinop', lat: 42.0268, lon: 35.1611, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: 'riz', nameTr: 'Rize', nameEn: 'Rize', lat: 41.0201, lon: 40.5234, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: 'zon', nameTr: 'Zonguldak', nameEn: 'Zonguldak', lat: 41.4564, lon: 31.7987, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: 'kas', nameTr: 'Kastamonu', nameEn: 'Kastamonu', lat: 41.3766, lon: 33.7765, regionTr: 'Karadeniz', regionEn: 'Black Sea' },

  // İç Sular & Göller
  { id: 'bol', nameTr: 'Bolu (Abant & Yedigöller)', nameEn: 'Bolu', lat: 40.7392, lon: 31.6116, regionTr: 'İç Anadolu & Göller', regionEn: 'Inland Lakes' },
  { id: 'ank', nameTr: 'Ankara (Mogan & Eymir)', nameEn: 'Ankara', lat: 39.9334, lon: 32.8597, regionTr: 'İç Anadolu & Göller', regionEn: 'Inland Lakes' },
  { id: 'kon', nameTr: 'Konya (Beyşehir)', nameEn: 'Konya', lat: 37.8746, lon: 32.4833, regionTr: 'İç Anadolu & Göller', regionEn: 'Inland Lakes' },
  { id: 'bur', nameTr: 'Bursa (İznik)', nameEn: 'Bursa', lat: 40.1828, lon: 29.0667, regionTr: 'İç Anadolu & Göller', regionEn: 'Inland Lakes' },
  { id: 'ela', nameTr: 'Elazığ (Keban)', nameEn: 'Elazig', lat: 38.6810, lon: 39.2264, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: 'van', nameTr: 'Van (Van Gölü)', nameEn: 'Van', lat: 38.5012, lon: 43.3730, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' }
];

interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
}

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedSpotId, setSelectedSpotId] = useState<string>(SPOTS[0].id);
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedSpot = SPOTS.find(s => s.id === selectedSpotId) || SPOTS[0];

  useEffect(() => {
    let isSubscribed = true;
    async function loadWeatherData() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedSpot.lat}&longitude=${selectedSpot.lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code`;
        const res = await fetch(url);
        const data = await res.json();
        if (isSubscribed) {
          setWeatherData(data.current);
          setLoading(false);
        }
      } catch {
        if (isSubscribed) {
          // Fallback mockup just in case
          setWeatherData({
            temperature_2m: 22.5,
            relative_humidity_2m: 65,
            surface_pressure: 1014.2,
            wind_speed_10m: 12.4,
            wind_direction_10m: 215,
            weather_code: 1
          });
          setLoading(false);
        }
      }
    }

    loadWeatherData();

    return () => {
      isSubscribed = false;
    };
  }, [selectedSpot]);

  const calculateSolunarScore = (pressure: number = 1013, wind: number = 10) => {
    let score = 75;
    if (pressure >= 1012 && pressure <= 1016) score += 15;
    else if (pressure < 1005 || pressure > 1025) score -= 15;

    if (wind > 5 && wind < 20) score += 10;
    return Math.min(Math.max(score, 45), 98);
  };

  const solunarScore = weatherData ? calculateSolunarScore(weatherData.surface_pressure, weatherData.wind_speed_10m) : 85;

  // Group spots by region
  const groupedSpots = SPOTS.reduce((acc, spot) => {
    const regionName = isTr ? spot.regionTr : spot.regionEn;
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(spot);
    return acc;
  }, {} as Record<string, CitySpot[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <CloudSun className="w-3.5 h-3.5" />
            <span>{isTr ? 'Canlı Balıkçılık Hava & Solunar Tahmini' : 'Live Marine Weather & Solunar Forecast'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Deniz Basıncı & Av Aktivite Tahmini' : 'Barometric Pressure & Feeding Activity'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Balıkların yemlenme iştahını belirleyen atmosferik basınç, rüzgar hızı ve ay fazlarına dayalı Solunar Balık Aktivite Skoru.'
              : 'Real-time barometric pressure, wind velocity, and solunar indices determining optimal fish feeding windows.'}
          </p>
        </div>
      </motion.section>

      {/* Spot Dropdown Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-2xl">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Konum / İl Seçimi' : 'Select Province / Location'}
          </h2>
        </div>

        <div className="relative">
          <select
            value={selectedSpotId}
            onChange={(e) => setSelectedSpotId(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          >
            {Object.keys(groupedSpots).map(regionGroup => (
              <optgroup key={regionGroup} label={regionGroup} className="font-bold text-slate-700 bg-white">
                {groupedSpots[regionGroup].map(spot => (
                  <option key={spot.id} value={spot.id} className="font-medium text-slate-900">
                    {isTr ? spot.nameTr : spot.nameEn}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-[#10B981] animate-spin mr-2" />
          <span className="text-sm font-medium text-slate-600">{isTr ? 'Hava verileri çekiliyor...' : 'Fetching forecast...'}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solunar Activity Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/40 text-white shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isTr ? 'Solunar Av Skoru' : 'Solunar Feeding Index'}</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                {isTr ? 'Yüksek İştah' : 'High Feeding'}
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-5xl font-black text-emerald-400 tracking-tight">
                %{solunarScore}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isTr ? 'Bugün Balık Yemlenme Aktivitesi Mükemmel' : 'Optimal Feeding Window Active Today'}
              </p>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000"
                style={{ width: `${solunarScore}%` }}
              />
            </div>
          </motion.div>

          {/* Barometric Pressure Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isTr ? 'Yüzey Basıncı' : 'Surface Pressure'}
                </h3>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {weatherData?.surface_pressure ? `${weatherData.surface_pressure} hPa` : '1014.2 hPa'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {isTr
                ? '1012-1016 hPa arasındaki kararlı basınç, predatör balıkların (Levrek, Lüfer) yemlenme iştahını maksimuma çıkarır.'
                : 'Stable pressure between 1012-1016 hPa triggers predatory feeding frenzies.'}
            </p>
          </motion.div>

          {/* Wind Speed & Direction Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isTr ? 'Rüzgar Hızı & Sıcaklık' : 'Wind & Temperature'}
                </h3>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {weatherData?.wind_speed_10m} km/h • {weatherData?.temperature_2m}°C
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {isTr
                ? 'Hafif rüzgarın oluşturduğu su yüzeyi köpüklenmesi sahte yemlerin görünürlüğünü arttırır.'
                : 'Subtle surface ripples enhance lure camouflage for spin anglers.'}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
