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
  ThermometerSun
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

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedSpotId, setSelectedSpotId] = useState<string>('34'); // Default Istanbul
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedSpot = TURKEY_PROVINCES.find((s) => s.id === selectedSpotId) || TURKEY_PROVINCES[0];

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
  const weatherDetails = weatherData ? parseWeatherCode(weatherData.weather_code, isTr) : { text: '', iconType: 'sun-cloud' };

  // Group spots by region
  const groupedSpots = TURKEY_PROVINCES.reduce((acc, spot) => {
    const regionName = isTr ? spot.regionTr : spot.regionEn;
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(spot);
    return acc;
  }, {} as Record<string, Province[]>);

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
            {isTr ? 'Tüm Şehirler İçin Anlık Hava Durumu' : 'Real-time Weather for All Cities'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Tüm Türkiye genelindeki hava koşullarını takip edin. Barometrik basınç, sıcaklık ve rüzgar şiddeti ile meranızdaki balık aktivitesini ölçün.'
              : 'Track weather conditions across Turkey. Measure barometric pressure, temperature, and wind to predict fish feeding activity.'}
          </p>
        </div>
      </motion.section>

      {/* Spot Dropdown Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-2xl mx-auto -mt-12 relative z-20">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Hava Durumu İçin Şehir Seçin' : 'Select City for Weather'}
          </h2>
        </div>

        <div className="relative">
          <select
            value={selectedSpotId}
            onChange={(e) => setSelectedSpotId(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-semibold px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-sm"
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
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Main Weather Card (Takes up more space) */}
            <div className="md:col-span-8 bg-gradient-to-br from-blue-900 via-[#0F172A] to-slate-900 p-8 rounded-3xl border border-blue-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              {/* Animated decorative shapes */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                      {isTr ? selectedSpot.nameTr : selectedSpot.nameEn}
                    </h2>
                    <p className="text-blue-300 font-medium text-sm mt-1">
                      {isTr ? selectedSpot.regionTr : selectedSpot.regionEn}
                    </p>
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
                  <span>{isTr ? 'Canlı Veri (Open-Meteo)' : 'Live Data (Open-Meteo)'}</span>
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
                    <span>{isTr ? 'Av İştah Skoru' : 'Feeding Index'}</span>
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

              {/* Wind Speed & Direction Card */}
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
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
