export interface FishingConditionInput {
  weatherCode: number;
  windSpeedKmh: number;
  tempC: number;
  pressureHpa: number;
  /** Current minus ~24h ago (hPa). Positive = rising. */
  pressureChange24h?: number | null;
  sunriseIso?: string | null;
  sunsetIso?: string | null;
  now?: Date;
}

export interface FishingConditionFactor {
  key: string;
  points: number;
  maxPoints: number;
  textTr: string;
  textEn: string;
}

export interface FishingConditionResult {
  score: number;
  label: 'low' | 'moderate' | 'good';
  labelTr: string;
  labelEn: string;
  factors: FishingConditionFactor[];
  tipsTr: string[];
  tipsEn: string[];
  goldenHourNoteTr?: string;
  goldenHourNoteEn?: string;
}

function scoreWind(kmh: number): { points: number; textTr: string; textEn: string } {
  if (kmh <= 15) return { points: 25, textTr: 'Rüzgar hafif, kıyı avı için uygun', textEn: 'Light wind, suitable for shore fishing' };
  if (kmh <= 30) return { points: 20, textTr: 'Rüzgar orta seviyede', textEn: 'Moderate wind' };
  if (kmh <= 45) return { points: 12, textTr: 'Rüzgar kuvvetli, dikkatli olun', textEn: 'Strong wind, use caution' };
  if (kmh <= 60) return { points: 5, textTr: 'Rüzgar çok kuvvetli', textEn: 'Very strong wind' };
  return { points: 0, textTr: 'Rüzgar aşırı, güvenlik riski', textEn: 'Extreme wind, safety risk' };
}

function scoreWeather(code: number): { points: number; textTr: string; textEn: string } {
  if (code === 0 || code === 1 || code === 2) {
    return { points: 35, textTr: 'Hava açık veya az bulutlu', textEn: 'Clear or partly cloudy' };
  }
  if (code === 3) return { points: 28, textTr: 'Kapalı ama avlanabilir', textEn: 'Overcast but fishable' };
  if (code >= 45 && code <= 48) return { points: 18, textTr: 'Sisli görüş', textEn: 'Foggy visibility' };
  if (code >= 51 && code <= 67) return { points: 12, textTr: 'Yağış var', textEn: 'Rain present' };
  if (code >= 71 && code <= 77) return { points: 8, textTr: 'Kar yağışı', textEn: 'Snowfall' };
  if (code >= 80 && code <= 82) return { points: 8, textTr: 'Sağanak yağış', textEn: 'Heavy showers' };
  if (code >= 95) return { points: 0, textTr: 'Fırtına riski', textEn: 'Storm risk' };
  return { points: 22, textTr: 'Karışık hava', textEn: 'Mixed conditions' };
}

function scoreTemp(c: number): { points: number; textTr: string; textEn: string } {
  if (c >= 8 && c <= 28) return { points: 20, textTr: 'Sıcaklık konforlu', textEn: 'Comfortable temperature' };
  if ((c >= 5 && c < 8) || (c > 28 && c <= 32)) {
    return { points: 14, textTr: 'Sıcaklık sınırda', textEn: 'Borderline temperature' };
  }
  if ((c >= 0 && c < 5) || (c > 32 && c <= 36)) {
    return { points: 8, textTr: 'Sıcaklık zorlayıcı', textEn: 'Challenging temperature' };
  }
  return { points: 4, textTr: 'Aşırı sıcaklık', textEn: 'Extreme temperature' };
}

function scorePressure(change: number | null | undefined): { points: number; textTr: string; textEn: string } {
  if (change == null || Number.isNaN(change)) {
    return { points: 12, textTr: 'Basınç trendi belirsiz', textEn: 'Pressure trend unavailable' };
  }
  const abs = Math.abs(change);
  if (abs <= 3) return { points: 20, textTr: 'Basınç stabil', textEn: 'Stable pressure' };
  if (abs <= 6) {
    const dirTr = change > 0 ? 'yükseliyor' : 'düşüyor';
    const dirEn = change > 0 ? 'rising' : 'falling';
    return { points: 12, textTr: `Basınç hafif ${dirTr}`, textEn: `Pressure slightly ${dirEn}` };
  }
  const dirTr = change > 0 ? 'hızla yükseliyor' : 'hızla düşüyor';
  const dirEn = change > 0 ? 'rising quickly' : 'falling quickly';
  return { points: 6, textTr: `Basınç ${dirTr}`, textEn: `Pressure ${dirEn}` };
}

function goldenHourNote(
  sunriseIso: string | null | undefined,
  sunsetIso: string | null | undefined,
  now: Date
): { tr?: string; en?: string } {
  if (!sunriseIso || !sunsetIso) return {};

  const sunrise = new Date(sunriseIso);
  const sunset = new Date(sunsetIso);
  const windowMs = 90 * 60 * 1000;

  const nearSunrise = Math.abs(now.getTime() - sunrise.getTime()) <= windowMs;
  const nearSunset = Math.abs(now.getTime() - sunset.getTime()) <= windowMs;

  if (nearSunrise) {
    return {
      tr: 'Şafak penceresindesiniz; kısa at-çek serileri denenebilir.',
      en: 'You are in the dawn window; short retrieve sets may work well.'
    };
  }
  if (nearSunset) {
    return {
      tr: 'Akşam penceresindesiniz; kıyı geçişlerinde aktivite artabilir.',
      en: 'You are in the dusk window; shore transitions may pick up.'
    };
  }

  const sunriseStr = sunrise.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const sunsetStr = sunset.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return {
    tr: `Verimli pencereler: gün doğumu ~${sunriseStr}, gün batımı ~${sunsetStr}`,
    en: `Useful windows: sunrise ~${sunriseStr}, sunset ~${sunsetStr}`
  };
}

export function computeFishingConditionScore(input: FishingConditionInput): FishingConditionResult {
  const now = input.now ?? new Date();

  const wind = scoreWind(input.windSpeedKmh);
  const weather = scoreWeather(input.weatherCode);
  const temp = scoreTemp(input.tempC);
  const pressure = scorePressure(input.pressureChange24h);

  const raw = wind.points + weather.points + temp.points + pressure.points;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  let label: FishingConditionResult['label'] = 'moderate';
  if (score >= 70) label = 'good';
  else if (score < 45) label = 'low';

  const labelTr = label === 'good' ? 'İyi' : label === 'moderate' ? 'Orta' : 'Düşük';
  const labelEn = label === 'good' ? 'Good' : label === 'moderate' ? 'Moderate' : 'Low';

  const factors: FishingConditionFactor[] = [
    { key: 'wind', points: wind.points, maxPoints: 25, textTr: wind.textTr, textEn: wind.textEn },
    { key: 'weather', points: weather.points, maxPoints: 35, textTr: weather.textTr, textEn: weather.textEn },
    { key: 'temp', points: temp.points, maxPoints: 20, textTr: temp.textTr, textEn: temp.textEn },
    { key: 'pressure', points: pressure.points, maxPoints: 20, textTr: pressure.textTr, textEn: pressure.textEn }
  ];

  const tipsTr: string[] = [];
  const tipsEn: string[] = [];

  if (input.windSpeedKmh > 35) {
    tipsTr.push('Rüzgarlı havada korunaklı kıyı veya mendirek arka tarafı tercih edin.');
    tipsEn.push('In windy weather, prefer sheltered shore or lee side of structures.');
  }
  if (input.weatherCode >= 51) {
    tipsTr.push('Yağışlı havada güvenlik ve ekipman korumasına öncelik verin.');
    tipsEn.push('Prioritize safety and gear protection in rainy conditions.');
  }
  if (input.tempC < 5 || input.tempC > 32) {
    tipsTr.push('Aşırı sıcaklıkta kısa seanslar ve bol su tüketimi önerilir.');
    tipsEn.push('In extreme temperatures, keep sessions short and stay hydrated.');
  }

  const golden = goldenHourNote(input.sunriseIso, input.sunsetIso, now);

  return {
    score,
    label,
    labelTr,
    labelEn,
    factors,
    tipsTr,
    tipsEn,
    goldenHourNoteTr: golden.tr,
    goldenHourNoteEn: golden.en
  };
}
