/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CloudSun,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Calendar,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';
import { useProStatus } from '@/lib/useProStatus';
import ProLockModal from '@/components/ProLockModal';

interface CityWeatherSpot {
  id: string; // e.g. "34"
  plate: number; // e.g. 34
  nameTr: string; // e.g. "İstanbul"
  nameEn: string; // e.g. "Istanbul"
  lat: number;
  lon: number;
}

// 81 Turkish Provinces Coordinates for Live Weather
const TURKEY_PROVINCES: CityWeatherSpot[] = [
  { id: '01', plate: 1, nameTr: 'Adana', nameEn: 'Adana', lat: 37.0, lon: 35.321 },
  { id: '02', plate: 2, nameTr: 'Adıyaman', nameEn: 'Adiyaman', lat: 37.764, lon: 38.276 },
  { id: '03', plate: 3, nameTr: 'Afyonkarahisar', nameEn: 'Afyonkarahisar', lat: 38.751, lon: 30.556 },
  { id: '04', plate: 4, nameTr: 'Ağrı', nameEn: 'Agri', lat: 39.719, lon: 43.051 },
  { id: '05', plate: 5, nameTr: 'Amasya', nameEn: 'Amasya', lat: 40.65, lon: 35.833 },
  { id: '06', plate: 6, nameTr: 'Ankara', nameEn: 'Ankara', lat: 39.933, lon: 32.859 },
  { id: '07', plate: 7, nameTr: 'Antalya', nameEn: 'Antalya', lat: 36.884, lon: 30.705 },
  { id: '08', plate: 8, nameTr: 'Artvin', nameEn: 'Artvin', lat: 41.183, lon: 41.818 },
  { id: '09', plate: 9, nameTr: 'Aydın', nameEn: 'Aydin', lat: 37.856, lon: 27.842 },
  { id: '10', plate: 10, nameTr: 'Balıkesir', nameEn: 'Balikesir', lat: 39.648, lon: 27.883 },
  { id: '11', plate: 11, nameTr: 'Bilecik', nameEn: 'Bilecik', lat: 40.15, lon: 29.983 },
  { id: '12', plate: 12, nameTr: 'Bingöl', nameEn: 'Bingol', lat: 38.885, lon: 40.498 },
  { id: '13', plate: 13, nameTr: 'Bitlis', nameEn: 'Bitlis', lat: 38.401, lon: 42.108 },
  { id: '14', plate: 14, nameTr: 'Bolu', nameEn: 'Bolu', lat: 40.736, lon: 31.606 },
  { id: '15', plate: 15, nameTr: 'Burdur', nameEn: 'Burdur', lat: 37.72, lon: 30.29 },
  { id: '16', plate: 16, nameTr: 'Bursa', nameEn: 'Bursa', lat: 40.183, lon: 29.067 },
  { id: '17', plate: 17, nameTr: 'Çanakkale', nameEn: 'Canakkale', lat: 40.155, lon: 26.414 },
  { id: '18', plate: 18, nameTr: 'Çankırı', nameEn: 'Cankiri', lat: 40.601, lon: 33.613 },
  { id: '19', plate: 19, nameTr: 'Çorum', nameEn: 'Corum', lat: 40.551, lon: 34.953 },
  { id: '20', plate: 20, nameTr: 'Denizli', nameEn: 'Denizli', lat: 37.777, lon: 29.086 },
  { id: '21', plate: 21, nameTr: 'Diyarbakır', nameEn: 'Diyarbakir', lat: 37.914, lon: 40.231 },
  { id: '22', plate: 22, nameTr: 'Edirne', nameEn: 'Edirne', lat: 41.677, lon: 26.556 },
  { id: '23', plate: 23, nameTr: 'Elazığ', nameEn: 'Elazig', lat: 38.681, lon: 39.226 },
  { id: '24', plate: 24, nameTr: 'Erzincan', nameEn: 'Erzincan', lat: 39.75, lon: 39.5 },
  { id: '25', plate: 25, nameTr: 'Erzurum', nameEn: 'Erzurum', lat: 39.906, lon: 41.265 },
  { id: '26', plate: 26, nameTr: 'Eskişehir', nameEn: 'Eskisehir', lat: 39.777, lon: 30.521 },
  { id: '27', plate: 27, nameTr: 'Gaziantep', nameEn: 'Gaziantep', lat: 37.066, lon: 37.383 },
  { id: '28', plate: 28, nameTr: 'Giresun', nameEn: 'Giresun', lat: 40.913, lon: 38.387 },
  { id: '29', plate: 29, nameTr: 'Gümüşhane', nameEn: 'Gumushane', lat: 40.46, lon: 39.482 },
  { id: '30', plate: 30, nameTr: 'Hakkari', nameEn: 'Hakkari', lat: 37.583, lon: 43.733 },
  { id: '31', plate: 31, nameTr: 'Hatay', nameEn: 'Hatay', lat: 36.402, lon: 36.35 },
  { id: '32', plate: 32, nameTr: 'Isparta', nameEn: 'Isparta', lat: 37.764, lon: 30.556 },
  { id: '33', plate: 33, nameTr: 'Mersin', nameEn: 'Mersin', lat: 36.8, lon: 34.633 },
  { id: '34', plate: 34, nameTr: 'İstanbul', nameEn: 'Istanbul', lat: 41.008, lon: 28.978 },
  { id: '35', plate: 35, nameTr: 'İzmir', nameEn: 'Izmir', lat: 38.419, lon: 27.128 },
  { id: '36', plate: 36, nameTr: 'Kars', nameEn: 'Kars', lat: 40.617, lon: 43.1 },
  { id: '37', plate: 37, nameTr: 'Kastamonu', nameEn: 'Kastamonu', lat: 41.389, lon: 33.783 },
  { id: '38', plate: 38, nameTr: 'Kayseri', nameEn: 'Kayseri', lat: 38.731, lon: 35.478 },
  { id: '39', plate: 39, nameTr: 'Kırklareli', nameEn: 'Kirklareli', lat: 41.735, lon: 27.225 },
  { id: '40', plate: 40, nameTr: 'Kırşehir', nameEn: 'Kirsehir', lat: 39.143, lon: 34.171 },
  { id: '41', plate: 41, nameTr: 'Kocaeli (İzmit)', nameEn: 'Kocaeli', lat: 40.765, lon: 29.94 },
  { id: '42', plate: 42, nameTr: 'Konya', nameEn: 'Konya', lat: 37.867, lon: 32.483 },
  { id: '43', plate: 43, nameTr: 'Kütahya', nameEn: 'Kutahya', lat: 39.417, lon: 29.983 },
  { id: '44', plate: 44, nameTr: 'Malatya', nameEn: 'Malatya', lat: 38.355, lon: 38.309 },
  { id: '45', plate: 45, nameTr: 'Manisa', nameEn: 'Manisa', lat: 38.619, lon: 27.429 },
  { id: '46', plate: 46, nameTr: 'Kahramanmaraş', nameEn: 'Kahramanmaras', lat: 37.586, lon: 36.923 },
  { id: '47', plate: 47, nameTr: 'Mardin', nameEn: 'Mardin', lat: 37.321, lon: 40.724 },
  { id: '48', plate: 48, nameTr: 'Muğla', nameEn: 'Mugla', lat: 37.215, lon: 28.364 },
  { id: '49', plate: 49, nameTr: 'Muş', nameEn: 'Mus', lat: 38.743, lon: 41.506 },
  { id: '50', plate: 50, nameTr: 'Nevşehir', nameEn: 'Nevsehir', lat: 38.624, lon: 34.714 },
  { id: '51', plate: 51, nameTr: 'Niğde', nameEn: 'Nigde', lat: 37.967, lon: 34.683 },
  { id: '52', plate: 52, nameTr: 'Ordu', nameEn: 'Ordu', lat: 40.984, lon: 37.876 },
  { id: '53', plate: 53, nameTr: 'Rize', nameEn: 'Rize', lat: 41.021, lon: 40.523 },
  { id: '54', plate: 54, nameTr: 'Sakarya (Adapazarı)', nameEn: 'Sakarya', lat: 40.757, lon: 30.378 },
  { id: '55', plate: 55, nameTr: 'Samsun', nameEn: 'Samsun', lat: 41.293, lon: 36.33 },
  { id: '56', plate: 56, nameTr: 'Siirt', nameEn: 'Siirt', lat: 37.933, lon: 41.95 },
  { id: '57', plate: 57, nameTr: 'Sinop', nameEn: 'Sinop', lat: 42.027, lon: 35.151 },
  { id: '58', plate: 58, nameTr: 'Sivas', nameEn: 'Sivas', lat: 39.748, lon: 37.016 },
  { id: '59', plate: 59, nameTr: 'Tekirdağ', nameEn: 'Tekirdag', lat: 40.983, lon: 27.517 },
  { id: '60', plate: 60, nameTr: 'Tokat', nameEn: 'Tokat', lat: 40.317, lon: 36.55 },
  { id: '61', plate: 61, nameTr: 'Trabzon', nameEn: 'Trabzon', lat: 41.002, lon: 39.717 },
  { id: '62', plate: 62, nameTr: 'Tunceli', nameEn: 'Tunceli', lat: 39.108, lon: 39.547 },
  { id: '63', plate: 63, nameTr: 'Şanlıurfa', nameEn: 'Sanliurfa', lat: 37.167, lon: 38.795 },
  { id: '64', plate: 64, nameTr: 'Uşak', nameEn: 'Usak', lat: 38.682, lon: 29.408 },
  { id: '65', plate: 65, nameTr: 'Van', nameEn: 'Van', lat: 38.489, lon: 43.409 },
  { id: '66', plate: 66, nameTr: 'Yozgat', nameEn: 'Yozgat', lat: 39.818, lon: 34.815 },
  { id: '67', plate: 67, nameTr: 'Zonguldak', nameEn: 'Zonguldak', lat: 41.456, lon: 31.799 },
  { id: '68', plate: 68, nameTr: 'Aksaray', nameEn: 'Aksaray', lat: 38.368, lon: 34.037 },
  { id: '69', plate: 69, nameTr: 'Bayburt', nameEn: 'Bayburt', lat: 40.255, lon: 40.225 },
  { id: '70', plate: 70, nameTr: 'Karaman', nameEn: 'Karaman', lat: 37.176, lon: 33.215 },
  { id: '71', plate: 71, nameTr: 'Kırıkkale', nameEn: 'Kirikkale', lat: 39.845, lon: 33.511 },
  { id: '72', plate: 72, nameTr: 'Batman', nameEn: 'Batman', lat: 37.887, lon: 41.132 },
  { id: '73', plate: 73, nameTr: 'Şırnak', nameEn: 'Sirnak', lat: 37.516, lon: 42.461 },
  { id: '74', plate: 74, nameTr: 'Bartın', nameEn: 'Bartin', lat: 41.636, lon: 32.337 },
  { id: '75', plate: 75, nameTr: 'Ardahan', nameEn: 'Ardahan', lat: 41.11, lon: 42.702 },
  { id: '76', plate: 76, nameTr: 'Iğdır', nameEn: 'Igdir', lat: 39.917, lon: 44.042 },
  { id: '77', plate: 77, nameTr: 'Yalova', nameEn: 'Yalova', lat: 40.655, lon: 29.277 },
  { id: '78', plate: 78, nameTr: 'Karabük', nameEn: 'Karabuk', lat: 41.206, lon: 32.62 },
  { id: '79', plate: 79, nameTr: 'Kilis', nameEn: 'Kilis', lat: 36.718, lon: 37.115 },
  { id: '80', plate: 80, nameTr: 'Osmaniye', nameEn: 'Osmaniye', lat: 37.074, lon: 36.247 },
  { id: '81', plate: 81, nameTr: 'Düzce', nameEn: 'Duzce', lat: 40.844, lon: 31.156 }
];

function parseWeatherCode(code: number, isTr: boolean) {
  if (code === 0) return { text: isTr ? 'Açık Güneşli' : 'Clear Sky', iconType: 'sun' };
  if (code >= 1 && code <= 3) return { text: isTr ? 'Parçalı Bulutlu' : 'Partly Cloudy', iconType: 'cloud-sun' };
  if (code === 45 || code === 48) return { text: isTr ? 'Sisli' : 'Foggy', iconType: 'fog' };
  if (code >= 51 && code <= 67) return { text: isTr ? 'Yağmurlu' : 'Rainy', iconType: 'rain' };
  if (code >= 71 && code <= 77) return { text: isTr ? 'Kar Yağışlı' : 'Snowy', iconType: 'snow' };
  if (code >= 80 && code <= 82) return { text: isTr ? 'Sağanak Yağış' : 'Heavy Rain', iconType: 'rain' };
  if (code >= 95) return { text: isTr ? 'Fırtına / Yıldırım' : 'Thunderstorm', iconType: 'lightning' };
  return { text: isTr ? 'Bulutlu' : 'Cloudy', iconType: 'cloud' };
}

function renderWeatherIcon(iconType: string, className = "w-8 h-8") {
  switch (iconType) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-300`} />;
    case 'rain':
      return <CloudRain className={`${className} text-cyan-400`} />;
    case 'snow':
      return <CloudSnow className={`${className} text-[#10B981]`} />;
    case 'lightning':
      return <CloudLightning className={`${className} text-amber-400 animate-pulse`} />;
    default:
      return <Cloud className={`${className} text-slate-300`} />;
  }
}

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const { isPro } = useProStatus();

  const [selectedSpot, setSelectedSpot] = useState<CityWeatherSpot>(
    TURKEY_PROVINCES.find((p) => p.plate === 34) || TURKEY_PROVINCES[0]
  );

  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedSpot.lat}&longitude=${selectedSpot.lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.current) {
          setWeatherData(data.current);
        }
        if (data?.daily) {
          const days = data.daily.time.slice(0, 7).map((t: string, idx: number) => {
            const dateObj = new Date(t);
            const dayName = idx === 0 
              ? (isTr ? 'Bugün' : 'Today') 
              : dateObj.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { weekday: 'short' });
            return {
              date: t,
              dayName,
              weatherCode: data.daily.weather_code[idx],
              tempMax: Math.round(data.daily.temperature_2m_max[idx]),
              tempMin: Math.round(data.daily.temperature_2m_min[idx])
            };
          });
          setDailyForecast(days);
        }
      } catch {
        // Fallback static
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedSpot, isTr]);

  const weatherDetails = parseWeatherCode(weatherData?.weather_code || 0, isTr);

  const sortedProvinces = [...TURKEY_PROVINCES].sort((a, b) =>
    (isTr ? a.nameTr : a.nameEn).localeCompare(isTr ? b.nameTr : b.nameEn, isTr ? 'tr' : 'en')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-4 px-4">
      {/* Lock Modal */}
      <ProLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        title={isTr ? '7 Günlük Solunar Takvimi 🔒' : '7-Day Solunar Calendar 🔒'}
        description={
          isTr
            ? 'Gelecek günlere ait hava ve solunar takvim verisi sadece oltaApp PRO kullanıcılarına açıktır. PRO aboneliğe geçerek 7 günlük detaylı av tahminlerini açın!'
            : 'Multi-day solunar forecast is exclusive to oltaApp PRO members. Upgrade to PRO to unlock 7-day fishing calendars!'
        }
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              {isTr ? 'Hava Durumu & Solunar' : 'Weather & Solunar'}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              {isTr ? '81 İl Canlı Hava & Rüzgar Tahmini' : '81 Provinces Live Marine Weather'}
            </p>
          </div>
        </div>

        {/* 81 Provinces Dropdown Selector */}
        <div className="relative w-full sm:w-64">
          <select
            value={selectedSpot.id}
            onChange={(e) => {
              const found = TURKEY_PROVINCES.find((p) => p.id === e.target.value);
              if (found) setSelectedSpot(found);
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm rounded-2xl pl-3.5 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {sortedProvinces.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {isTr ? spot.nameTr : spot.nameEn}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      {/* Main Weather Card (Integrated Temperature, Pressure, Wind & Humidity) */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-2">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isTr ? 'Canlı hava verileri alınıyor...' : 'Loading weather data...'}
          </p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-gradient-to-br from-[#0F172A] to-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-md relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: City Name & Date */}
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isTr ? selectedSpot.nameTr : selectedSpot.nameEn}
              </h2>
              <div className="text-right text-xs font-semibold text-slate-400">
                {new Date().toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' })}
              </div>
            </div>

            {/* Temp & Main Status */}
            <div className="flex items-center justify-between py-2 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                  {renderWeatherIcon(weatherDetails.iconType, "w-9 h-9")}
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {Math.round(weatherData?.temperature_2m || 0)}°C
                  </div>
                  <div className="text-xs font-bold text-emerald-400 capitalize mt-0.5">
                    {weatherDetails.text}
                  </div>
                </div>
              </div>

              {/* Integrated Compact Metrics Grid inside Main Card */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-200 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60">
                <div className="flex flex-col items-center">
                  <Droplets className="w-4 h-4 text-cyan-400 mb-0.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isTr ? 'Nem' : 'Humidity'}</span>
                  <span className="font-extrabold text-white mt-0.5">%{weatherData?.relative_humidity_2m}</span>
                </div>

                <div className="flex flex-col items-center border-x border-slate-700/60 px-2">
                  <Wind className="w-4 h-4 text-emerald-400 mb-0.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isTr ? 'Rüzgar' : 'Wind'}</span>
                  <span className="font-extrabold text-white mt-0.5">{weatherData?.wind_speed_10m} km/h</span>
                </div>

                <div className="flex flex-col items-center">
                  <Gauge className="w-4 h-4 text-indigo-400 mb-0.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isTr ? 'Basınç' : 'Pressure'}</span>
                  <span className="font-extrabold text-white mt-0.5">{weatherData?.surface_pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-DAY WEATHER FORECAST GRID (Day 1 Unlocked, Days 2-7 Glassmorphism Locked for FREE) */}
          {dailyForecast.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                    {isTr ? '7 Günlük Solunar & Hava Tahmini' : '7-Day Solunar Forecast'}
                  </h3>
                </div>

                {!isPro && (
                  <span
                    onClick={() => setIsLockModalOpen(true)}
                    className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1 cursor-pointer hover:bg-amber-100 transition-colors"
                  >
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>{isTr ? 'ortaApp PRO ile 7 Günü Aç' : 'Unlock 7 Days with PRO'}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-1.5 w-full">
                {dailyForecast.map((day, idx) => {
                  const parsed = parseWeatherCode(day.weatherCode, isTr);
                  const isLockedDay = idx > 0 && !isPro;

                  return (
                    <div
                      key={day.date}
                      onClick={() => {
                        if (isLockedDay) {
                          setIsLockModalOpen(true);
                        }
                      }}
                      className={`p-2 rounded-2xl border transition-all flex flex-col items-center justify-between text-center relative ${
                        idx === 0 
                          ? 'bg-[#0F172A] text-white border-slate-800 shadow-xs' 
                          : isLockedDay
                          ? 'bg-slate-100/70 backdrop-blur-md opacity-60 border-slate-300 cursor-pointer select-none group hover:border-amber-400'
                          : 'bg-slate-50 text-slate-800 border-slate-200/80'
                      }`}
                    >
                      {/* Lock Icon overlay for locked days */}
                      {isLockedDay && (
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center text-slate-800 group-hover:scale-110 transition-transform">
                          <div className="p-1 rounded-full bg-white/90 shadow-md border border-slate-200">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] font-black tracking-tight">
                        {day.dayName}
                      </div>

                      <div className="my-1.5">
                        {renderWeatherIcon(parsed.iconType, "w-6 h-6")}
                      </div>

                      <div className="text-xs font-black">
                        {day.tempMax}° <span className="text-[10px] font-normal opacity-70">{day.tempMin}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
