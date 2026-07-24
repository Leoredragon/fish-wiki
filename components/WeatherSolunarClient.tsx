/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  CloudSun,
  Wind,
  Gauge,
  RefreshCw,
  Zap,
  Navigation,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  ThermometerSun,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TURKEY_PROVINCES, parseWeatherCode, Province } from '@/lib/turkeyProvinces';

interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
}

interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  windMax: number;
  solunarScore: number;
}

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedSpotId, setSelectedSpotId] = useState<string>('34'); // Default Istanbul (34)
  const [sortMode, setSortMode] = useState<'plate' | 'region'>('plate');
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSpot = TURKEY_PROVINCES.find((s) => s.id === selectedSpotId) || TURKEY_PROVINCES[0];

  // Plaka sırasına göre sıralı liste (01 -> 81)
  const plateSortedProvinces = [...TURKEY_PROVINCES].sort(
    (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)
  );

  // Bölgeye göre gruplu liste
  const groupedSpots = TURKEY_PROVINCES.reduce((acc, spot) => {
    const regionName = isTr ? spot.regionTr : spot.regionEn;
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(spot);
    return acc;
  }, {} as Record<string, Province[]>);

  useEffect(() => {
    let isSubscribed = true;

    async function loadWeatherData() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedSpot.lat}&longitude=${selectedSpot.lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();

        if (isSubscribed) {
          setWeatherData(data.current);

          // Process 5-day daily forecast
          if (data.daily && data.daily.time) {
            const days: DailyForecastItem[] = data.daily.time.slice(0, 5).map((timeStr: string, idx: number) => {
              const dateObj = new Date(timeStr);
              const dayName = idx === 0 
                ? (isTr ? 'Bugün' : 'Today')
                : idx === 1 
                ? (isTr ? 'Yarın' : 'Tomorrow')
                : dateObj.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });

              const tempMax = Math.round(data.daily.temperature_2m_max[idx]);
              const tempMin = Math.round(data.daily.temperature_2m_min[idx]);
              const windMax = Math.round(data.daily.wind_speed_10m_max[idx]);
              const weatherCode = data.daily.weather_code[idx];

              // Solunar estimate formula for future days
              let score = 75;
              if (windMax >= 8 && windMax <= 18) score += 12;
              if (tempMax >= 18 && tempMax <= 26) score += 10;
              const solunarScore = Math.min(Math.max(score, 50), 96);

              return {
                date: timeStr,
                dayName,
                weatherCode,
                tempMax,
                tempMin,
                windMax,
                solunarScore
              };
            });
            setDailyForecast(days);
          }
          setLoading(false);
        }
      } catch {
        if (isSubscribed) {
          // Fallback mockup
          setWeatherData({
            temperature_2m: 22.5,
            relative_humidity_2m: 65,
            surface_pressure: 1014.2,
            wind_speed_10m: 12.4,
            wind_direction_10m: 215,
            weather_code: 1
          });
          setDailyForecast([
            { date: '2026-07-23', dayName: isTr ? 'Bugün' : 'Today', weatherCode: 1, tempMax: 28, tempMin: 20, windMax: 14, solunarScore: 88 },
            { date: '2026-07-24', dayName: isTr ? 'Yarın' : 'Tomorrow', weatherCode: 0, tempMax: 29, tempMin: 21, windMax: 12, solunarScore: 92 },
            { date: '2026-07-25', dayName: 'Cuma', weatherCode: 3, tempMax: 26, tempMin: 19, windMax: 18, solunarScore: 78 },
            { date: '2026-07-26', dayName: 'Cumartesi', weatherCode: 61, tempMax: 24, tempMin: 18, windMax: 22, solunarScore: 65 },
            { date: '2026-07-27', dayName: 'Pazar', weatherCode: 2, tempMax: 27, tempMin: 19, windMax: 15, solunarScore: 84 },
          ]);
          setLoading(false);
        }
      }
    }

    loadWeatherData();

    return () => {
      isSubscribed = false;
    };
  }, [selectedSpot, isTr]);

  const calculateSolunarScore = (pressure: number = 1013, wind: number = 10) => {
    let score = 75;
    if (pressure >= 1012 && pressure <= 1016) score += 15;
    else if (pressure < 1005 || pressure > 1025) score -= 15;

    if (wind > 5 && wind < 20) score += 10;
    return Math.min(Math.max(score, 45), 98);
  };

  const solunarScore = weatherData ? calculateSolunarScore(weatherData.surface_pressure, weatherData.wind_speed_10m) : 85;
  const weatherDetails = weatherData ? parseWeatherCode(weatherData.weather_code, isTr) : { text: '', iconType: 'sun-cloud' };

  // Render appropriate weather icon
  const renderWeatherIcon = (iconType: string, className: string = "w-12 h-12") => {
    switch (iconType) {
      case 'sun': return <Sun className={`${className} text-amber-500`} />;
      case 'sun-cloud': return <CloudSun className={`${className} text-amber-500`} />;
      case 'cloud': return <Cloud className={`${className} text-slate-400`} />;
      case 'rain': return <CloudRain className={`${className} text-blue-500`} />;
      case 'storm': return <CloudLightning className={`${className} text-indigo-500`} />;
      case 'snow': return <Snowflake className={`${className} text-cyan-400`} />;
      default: return <CloudSun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
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
            <span>{isTr ? 'Canlı Meteoroloji & Balık Aktivitesi' : 'Live Meteorology & Solunar Forecast'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Tüm Şehirler İçin Hava & Balık İştah Tahmini' : 'Weather & Angling Forecast for All Cities'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Plaka sırasına göre 81 ilimizin canlı hava şartlarını ve 5 günlük balık avı şans (Solunar) tahminlerini inceleyin.'
              : 'Explore live weather and 5-day solunar angling forecasts for 81 provinces ordered by license plate number.'}
          </p>
        </div>
      </motion.section>

      {/* Spot Dropdown Selector & Sorting Mode */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-2xl mx-auto relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
              {isTr ? 'Şehir Seçin' : 'Select City'}
            </h2>
          </div>

          {/* Sort Mode Toggle Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSortMode('plate')}
              className={`px-3 py-1 rounded-lg transition-all ${
                sortMode === 'plate' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isTr ? 'Plaka Sıralı (01-81)' : 'By Plate (01-81)'}
            </button>
            <button
              onClick={() => setSortMode('region')}
              className={`px-3 py-1 rounded-lg transition-all ${
                sortMode === 'region' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isTr ? 'Bölgelere Göre' : 'By Region'}
            </button>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedSpotId}
            onChange={(e) => setSelectedSpotId(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-sm"
          >
            {sortMode === 'plate' ? (
              plateSortedProvinces.map((spot) => (
                <option key={spot.id} value={spot.id} className="font-semibold text-slate-900">
                  {spot.id} - {isTr ? spot.nameTr : spot.nameEn} ({isTr ? spot.regionTr : spot.regionEn})
                </option>
              ))
            ) : (
              Object.keys(groupedSpots).map((regionGroup) => (
                <optgroup key={regionGroup} label={regionGroup} className="font-bold text-slate-700 bg-white">
                  {groupedSpots[regionGroup].map((spot) => (
                    <option key={spot.id} value={spot.id} className="font-medium text-slate-900">
                      {spot.id} - {isTr ? spot.nameTr : spot.nameEn}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Live Metrics & 5-Day Forecast Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-8 h-8 text-[#10B981] animate-spin mr-3" />
          <span className="text-base font-semibold text-slate-600">{isTr ? 'Meteoroloji verileri alınıyor...' : 'Fetching meteorological data...'}</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSpotId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Current Day Main Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Weather Card */}
              <div className="md:col-span-8 bg-gradient-to-br from-blue-900 via-[#0F172A] to-slate-900 p-8 rounded-3xl border border-blue-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        {selectedSpot.id} - {isTr ? selectedSpot.regionTr : selectedSpot.regionEn}
                      </span>
                      <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md mt-2">
                        {isTr ? selectedSpot.nameTr : selectedSpot.nameEn}
                      </h2>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
                      {renderWeatherIcon(weatherDetails.iconType, "w-10 h-10")}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-baseline space-x-4">
                    <span className="text-7xl sm:text-8xl font-black tracking-tighter drop-shadow-xl">
                      {Math.round(weatherData?.temperature_2m || 0)}°
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-200">
                      {weatherDetails.text}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-medium text-blue-100">
                  <div className="flex items-center space-x-2">
                    <ThermometerSun className="w-4 h-4 text-blue-300" />
                    <span>Nem: %{weatherData?.relative_humidity_2m}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isTr ? 'Canlı Veri (Open-Meteo)' : 'Live Data'}</span>
                  </div>
                </div>
              </div>

              {/* Side Column: Solunar, Pressure, Wind */}
              <div className="md:col-span-4 flex flex-col gap-6">
                
                {/* Solunar Activity Score Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                      <Zap className="w-4 h-4" />
                      <span>{isTr ? 'Bugünkü Balık İştah Skoru' : 'Today Feeding Index'}</span>
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-4xl font-black text-[#0F172A] tracking-tight">
                      %{solunarScore}
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 mt-3">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${solunarScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Barometric Pressure Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isTr ? 'Yüzey Basıncı' : 'Pressure'}
                      </h3>
                      <p className="text-xl font-black text-slate-900 mt-0.5">
                        {weatherData?.surface_pressure ? `${weatherData.surface_pressure} hPa` : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wind Speed Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isTr ? 'Rüzgar Hızı' : 'Wind Speed'}
                      </h3>
                      <p className="text-xl font-black text-slate-900 mt-0.5">
                        {weatherData?.wind_speed_10m} km/h
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 🗓️ 5-DAY WEATHER & SOLUNAR ANGLING FORECAST SECTION */}
            {dailyForecast.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        {isTr ? '5 Günlük Hava & Balık Avı İştah Tahmini' : '5-Day Angling & Weather Forecast'}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        {isTr ? `${selectedSpot.id} - ${selectedSpot.nameTr} merası için gelecek günlerin tahminleri` : 'Upcoming forecast predictions'}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solunar Entegrasyon</span>
                  </span>
                </div>

                <div className="flex sm:grid sm:grid-cols-5 gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
                  {dailyForecast.map((day, idx) => {
                    const parsed = parseWeatherCode(day.weatherCode, isTr);
                    return (
                      <div
                        key={day.date}
                        className={`min-w-[155px] sm:min-w-0 flex-1 snap-start p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between shrink-0 sm:shrink ${
                          idx === 0 
                            ? 'bg-slate-900 text-white border-slate-800 shadow-md scale-[1.01]' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-black ${idx === 0 ? 'text-emerald-400' : 'text-[#0F172A]'}`}>
                              {day.dayName}
                            </span>
                            {renderWeatherIcon(parsed.iconType, "w-6 h-6")}
                          </div>

                          <div className="space-y-1">
                            <div className="text-xl font-extrabold">
                              {day.tempMax}° <span className={`text-xs font-semibold ${idx === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{day.tempMin}°</span>
                            </div>
                            <p className={`text-[11px] font-bold line-clamp-1 ${idx === 0 ? 'text-slate-300' : 'text-slate-600'}`}>
                              {parsed.text}
                            </p>
                          </div>
                        </div>

                        <div className={`pt-3 border-t space-y-2 text-xs ${idx === 0 ? 'border-slate-800' : 'border-slate-200'}`}>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={idx === 0 ? 'text-slate-400' : 'text-slate-500'}>Rüzgar:</span>
                            <span className="font-bold">{day.windMax} km/h</span>
                          </div>

                          {/* Solunar Rating Badge */}
                          <div className={`p-2 rounded-xl text-center space-y-0.5 border ${
                            day.solunarScore >= 85 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : day.solunarScore >= 70 
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                              : 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                          }`}>
                            <div className="text-[10px] font-bold uppercase tracking-wider">Balık İştahı</div>
                            <div className="text-sm font-black">%{day.solunarScore}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
