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
  Navigation,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Sparkles,
  Zap,
  Calendar,
  ChevronRight
} from 'lucide-react';

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
  { id: '68', plate: 68, nameTr: 'Aksaray', nameEn: 'Aksaray', lat: 38.369, lon: 34.037 },
  { id: '69', plate: 69, nameTr: 'Bayburt', nameEn: 'Bayburt', lat: 40.255, lon: 40.225 },
  { id: '70', plate: 70, nameTr: 'Karaman', nameEn: 'Karaman', lat: 37.176, lon: 33.221 },
  { id: '71', plate: 71, nameTr: 'Kırıkkale', nameEn: 'Kirikkale', lat: 39.845, lon: 33.506 },
  { id: '72', plate: 72, nameTr: 'Batman', nameEn: 'Batman', lat: 37.887, lon: 41.132 },
  { id: '73', plate: 73, nameTr: 'Şırnak', nameEn: 'Sirnak', lat: 37.516, lon: 42.461 },
  { id: '74', plate: 74, nameTr: 'Bartın', nameEn: 'Bartin', lat: 41.636, lon: 32.337 },
  { id: '75', plate: 75, nameTr: 'Ardahan', nameEn: 'Ardahan', lat: 41.11, lon: 42.702 },
  { id: '76', plate: 76, nameTr: 'Iğdır', nameEn: 'Igdir', lat: 39.917, lon: 44.042 },
  { id: '77', plate: 77, nameTr: 'Yalova', nameEn: 'Yalova', lat: 40.655, lon: 29.277 },
  { id: '78', plate: 78, nameTr: 'Karabük', nameEn: 'Karabuk', lat: 41.2, lon: 32.627 },
  { id: '79', plate: 79, nameTr: 'Kilis', nameEn: 'Kilis', lat: 36.717, lon: 37.115 },
  { id: '80', plate: 80, nameTr: 'Osmaniye', nameEn: 'Osmaniye', lat: 37.074, lon: 36.247 },
  { id: '81', plate: 81, nameTr: 'Düzce', nameEn: 'Duzce', lat: 40.844, lon: 31.156 }
];

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

// Weather Code Translator to WMO standards
function parseWeatherCode(code: number, isTr: boolean) {
  if (code === 0) return { text: isTr ? 'Açık / Güneşli' : 'Clear Sky', iconType: 'sun' };
  if (code === 1 || code === 2) return { text: isTr ? 'Az Bulutlu' : 'Partly Cloudy', iconType: 'sun-cloud' };
  if (code === 3) return { text: isTr ? 'Kapalı / Parçalı Bulutlu' : 'Overcast', iconType: 'cloud' };
  if (code >= 45 && code <= 48) return { text: isTr ? 'Sisli' : 'Foggy', iconType: 'fog' };
  if (code >= 51 && code <= 67) return { text: isTr ? 'Yağmurlu' : 'Rainy', iconType: 'rain' };
  if (code >= 71 && code <= 77) return { text: isTr ? 'Kar Yağışlı' : 'Snowy', iconType: 'snow' };
  if (code >= 80 && code <= 82) return { text: isTr ? 'Sağanak Yağışlı' : 'Heavy Showers', iconType: 'rain' };
  if (code >= 95 && code <= 99) return { text: isTr ? 'Fırtınalı / Gök Gürültülü' : 'Thunderstorm', iconType: 'lightning' };
  return { text: isTr ? 'Ilıman' : 'Mild', iconType: 'sun-cloud' };
}

export default function WeatherSolunarClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [selectedSpot, setSelectedSpot] = useState<CityWeatherSpot>(TURKEY_PROVINCES[33]); // Default Istanbul (34)
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<'plate' | 'alpha'>('plate');

  // Sorted Cities
  const sortedProvinces = [...TURKEY_PROVINCES].sort((a, b) => {
    if (sortMode === 'alpha') {
      const nameA = isTr ? a.nameTr : a.nameEn;
      const nameB = isTr ? b.nameTr : b.nameEn;
      return nameA.localeCompare(nameB, isTr ? 'tr' : 'en');
    }
    return a.plate - b.plate;
  });

  useEffect(() => {
    fetchWeatherForSpot(selectedSpot);
  }, [selectedSpot]);

  const fetchWeatherForSpot = async (spot: CityWeatherSpot) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.current) {
        setWeatherData(data.current);
      }

      if (data && data.daily) {
        const days: DailyForecastItem[] = [];
        const dateStrings = data.daily.time || [];
        for (let idx = 0; idx < Math.min(dateStrings.length, 5); idx++) {
          const rawDate = new Date(dateStrings[idx]);
          const dayName = rawDate.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { weekday: 'long' });
          const weatherCode = data.daily.weather_code[idx];
          const tempMax = Math.round(data.daily.temperature_2m_max[idx]);
          const tempMin = Math.round(data.daily.temperature_2m_min[idx]);
          const windMax = Math.round(data.daily.wind_speed_10m_max[idx]);

          const solunarScore = Math.min(98, Math.max(55, 90 - idx * 6 + (weatherCode === 0 ? 5 : 0)));

          days.push({
            date: dateStrings[idx],
            dayName: idx === 0 ? (isTr ? 'Bugün' : 'Today') : dayName,
            weatherCode,
            tempMax,
            tempMin,
            windMax,
            solunarScore
          });
        }
        setDailyForecast(days);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      // Fallback data
      setWeatherData({
        temperature_2m: 24,
        relative_humidity_2m: 65,
        surface_pressure: 1014,
        wind_speed_10m: 16,
        wind_direction_10m: 45,
        weather_code: 1
      });
      setDailyForecast([
        { date: '2026-07-23', dayName: isTr ? 'Bugün' : 'Today', weatherCode: 1, tempMax: 28, tempMin: 20, windMax: 14, solunarScore: 88 },
        { date: '2026-07-24', dayName: isTr ? 'Yarın' : 'Tomorrow', weatherCode: 0, tempMax: 29, tempMin: 21, windMax: 12, solunarScore: 92 },
        { date: '2026-07-25', dayName: 'Cuma', weatherCode: 3, tempMax: 26, tempMin: 19, windMax: 18, solunarScore: 78 },
        { date: '2026-07-26', dayName: 'Cumartesi', weatherCode: 61, tempMax: 24, tempMin: 18, windMax: 22, solunarScore: 65 },
        { date: '2026-07-27', dayName: 'Pazar', weatherCode: 2, tempMax: 27, tempMin: 19, windMax: 15, solunarScore: 84 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherIcon = (iconType: string, className: string = "w-6 h-6") => {
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'sun-cloud':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-cyan-500`} />;
      case 'lightning':
        return <CloudLightning className={`${className} text-purple-500`} />;
      case 'snow':
        return <CloudSnow className={`${className} text-blue-300`} />;
      case 'fog':
        return <CloudFog className={`${className} text-slate-400`} />;
      default:
        return <CloudSun className={`${className} text-amber-400`} />;
    }
  };

  const calculateSolunarScore = (pressure: number = 1013, wind: number = 10) => {
    let score = 75;
    if (pressure >= 1010 && pressure <= 1018) score += 15;
    if (wind <= 15) score += 10;
    else if (wind > 30) score -= 15;
    return Math.min(99, Math.max(40, score));
  };

  const solunarScore = weatherData ? calculateSolunarScore(weatherData.surface_pressure, weatherData.wind_speed_10m) : 85;
  const weatherDetails = weatherData ? parseWeatherCode(weatherData.weather_code, isTr) : { text: '', iconType: 'sun-cloud' };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-6">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Tüm Şehirler İçin Hava Durumu Tahmini' : 'Weather Forecast for All Cities'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Plaka sırasına göre 81 ilimizin canlı hava şartlarını ve 5 günlük tahminlerini inceleyin.'
              : 'Explore live weather forecasts for 81 provinces ordered by license plate number.'}
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
              onClick={() => setSortMode('alpha')}
              className={`px-3 py-1 rounded-lg transition-all ${
                sortMode === 'alpha' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isTr ? 'A-Z Alfabetik' : 'A-Z Alphabetical'}
            </button>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedSpot.id}
            onChange={(e) => {
              const spot = TURKEY_PROVINCES.find((s) => s.id === e.target.value);
              if (spot) setSelectedSpot(spot);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-base font-extrabold text-[#0F172A] appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-xs"
          >
            {sortedProvinces.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.id} - {isTr ? spot.nameTr : spot.nameEn} (Plaka: {spot.plate})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronRight className="w-5 h-5 rotate-90" />
          </div>
        </div>
      </div>

      {/* Main Weather Card & Solunar Index */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isTr ? 'Canlı meteoroloji verileri alınıyor...' : 'Loading live weather data...'}
          </p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main Weather Card */}
            <div className="md:col-span-8 bg-gradient-to-br from-[#0F172A] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start border-b border-slate-800 pb-4 relative z-10">
                <div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    Plaka {selectedSpot.id}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                    {isTr ? selectedSpot.nameTr : selectedSpot.nameEn}
                  </h2>
                </div>
                <div className="text-right text-xs font-semibold text-slate-400">
                  <div>{new Date().toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{isTr ? 'Anlık Veri' : 'Live Data'}</div>
                </div>
              </div>

              {/* Temp Display */}
              <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                    {renderWeatherIcon(weatherDetails.iconType, "w-10 h-10")}
                  </div>
                  <div>
                    <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                      {Math.round(weatherData?.temperature_2m || 0)}°
                    </div>
                    <div className="text-sm font-bold text-slate-300 capitalize mt-1">
                      {weatherDetails.text}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 text-xs font-semibold text-slate-300 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 w-full sm:w-auto">
                  <div className="flex items-center space-x-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>Nem: %{weatherData?.relative_humidity_2m}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Rüzgar: {weatherData?.wind_speed_10m} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Column: Pressure, Wind */}
            <div className="md:col-span-4 flex flex-col gap-6">
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

          {/* 🗓️ 5-DAY WEATHER FORECAST SECTION */}
          {dailyForecast.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">
                      {isTr ? '5 Günlük Hava Durumu Tahmini' : '5-Day Weather Forecast'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {isTr ? `${selectedSpot.id} - ${selectedSpot.nameTr} için gelecek günlerin tahminleri` : 'Upcoming forecast predictions'}
                    </p>
                  </div>
                </div>
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
                      <div className="space-y-1">
                        <div className="text-xs font-black uppercase tracking-wider opacity-80">
                          {day.dayName}
                        </div>
                        <div className="text-[10px] font-semibold opacity-60">
                          {new Date(day.date).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>

                      <div className="py-2 flex flex-col items-center justify-center space-y-1">
                        {renderWeatherIcon(parsed.iconType, "w-8 h-8")}
                        <div className="text-xs font-bold text-center line-clamp-1">{parsed.text}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs font-extrabold">
                        <span>{day.tempMax}°</span>
                        <span className="opacity-60">{day.tempMin}°</span>
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
