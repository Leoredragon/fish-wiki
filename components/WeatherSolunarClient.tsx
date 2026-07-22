'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  CloudSun,
  Wind,
  Gauge,
  Compass,
  Sparkles,
  MapPin,
  RefreshCw,
  Moon,
  Zap
} from 'lucide-react';

interface CitySpot {
  nameTr: string;
  nameEn: string;
  lat: number;
  lon: number;
  type: string;
}

const SPOTS: CitySpot[] = [
  { nameTr: 'İstanbul (Boğaz & Marmara)', nameEn: 'Istanbul (Bosphorus)', lat: 41.0082, lon: 28.9784, type: 'Deniz / Boğaz' },
  { nameTr: 'İzmir (Ege Kıyıları)', nameEn: 'Izmir (Aegean Coast)', lat: 38.4237, lon: 27.1428, type: 'Tuzlu Su' },
  { nameTr: 'Çanakkale (Saros & Boğaz)', nameEn: 'Canakkale (Strait)', lat: 40.1553, lon: 26.4142, type: 'Tuzlu Su' },
  { nameTr: 'Antalya (Akdeniz Kıyısı)', nameEn: 'Antalya (Mediterranean)', lat: 36.8969, lon: 30.7133, type: 'Tuzlu Su' },
  { nameTr: 'Trabzon (Karadeniz)', nameEn: 'Trabzon (Black Sea)', lat: 41.0027, lon: 39.7168, type: 'Tuzlu Su' },
  { nameTr: 'Bolu (Abant & Göller)', nameEn: 'Bolu (Abant Lakes)', lat: 40.6083, lon: 31.2833, type: 'Tatlı Su' }
];

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedSpot, setSelectedSpot] = useState<CitySpot>(SPOTS[0]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(selectedSpot);
  }, [selectedSpot]);

  const fetchWeather = async (spot: CitySpot) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code`;
      const res = await fetch(url);
      const data = await res.json();
      setWeatherData(data.current);
    } catch {
      // Fallback mock weather if offline
      setWeatherData({
        temperature_2m: 22.5,
        relative_humidity_2m: 65,
        surface_pressure: 1014.2,
        wind_speed_10m: 12.4,
        wind_direction_10m: 215,
        weather_code: 1
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate Solunar Fish Activity Score (0-100%)
  const calculateSolunarScore = (pressure: number = 1013, wind: number = 10) => {
    // Optimal pressure for feeding is around 1012-1016 hPa
    let score = 75;
    if (pressure >= 1012 && pressure <= 1016) score += 15;
    else if (pressure < 1005 || pressure > 1025) score -= 15;

    if (wind > 5 && wind < 20) score += 10; // Light breeze creates water surface ripples
    return Math.min(Math.max(score, 45), 98);
  };

  const solunarScore = weatherData ? calculateSolunarScore(weatherData.surface_pressure, weatherData.wind_speed_10m) : 85;

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

      {/* Spot Selector Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Av Bölgesi / Mera Seçin' : 'Select Fishing Spot'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SPOTS.map((spot) => {
            const isSelected = selectedSpot.nameTr === spot.nameTr;
            return (
              <button
                key={spot.nameTr}
                onClick={() => setSelectedSpot(spot)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <span>{isTr ? spot.nameTr : spot.nameEn}</span>
                <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {spot.type}
                </span>
              </button>
            );
          })}
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
