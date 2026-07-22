export interface Province {
  id: string;
  nameTr: string;
  nameEn: string;
  lat: number;
  lon: number;
  regionTr: string;
  regionEn: string;
}

export const TURKEY_PROVINCES: Province[] = [
  // Marmara
  { id: '34', nameTr: 'İstanbul', nameEn: 'Istanbul', lat: 41.0082, lon: 28.9784, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '16', nameTr: 'Bursa', nameEn: 'Bursa', lat: 40.1828, lon: 29.0667, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '10', nameTr: 'Balıkesir', nameEn: 'Balikesir', lat: 39.6484, lon: 27.8826, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '17', nameTr: 'Çanakkale', nameEn: 'Canakkale', lat: 40.1553, lon: 26.4142, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '41', nameTr: 'Kocaeli', nameEn: 'Kocaeli', lat: 40.7654, lon: 29.9408, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '54', nameTr: 'Sakarya', nameEn: 'Sakarya', lat: 40.7569, lon: 30.3783, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '59', nameTr: 'Tekirdağ', nameEn: 'Tekirdag', lat: 40.9833, lon: 27.5167, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '22', nameTr: 'Edirne', nameEn: 'Edirne', lat: 41.6744, lon: 26.5583, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '39', nameTr: 'Kırklareli', nameEn: 'Kirklareli', lat: 41.7333, lon: 27.2167, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '77', nameTr: 'Yalova', nameEn: 'Yalova', lat: 40.6500, lon: 29.2667, regionTr: 'Marmara', regionEn: 'Marmara' },
  { id: '11', nameTr: 'Bilecik', nameEn: 'Bilecik', lat: 40.1451, lon: 29.9798, regionTr: 'Marmara', regionEn: 'Marmara' },

  // Ege
  { id: '35', nameTr: 'İzmir', nameEn: 'Izmir', lat: 38.4237, lon: 27.1428, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '09', nameTr: 'Aydın', nameEn: 'Aydin', lat: 37.8380, lon: 27.8456, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '48', nameTr: 'Muğla', nameEn: 'Mugla', lat: 37.2153, lon: 28.3636, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '45', nameTr: 'Manisa', nameEn: 'Manisa', lat: 38.6191, lon: 27.4289, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '20', nameTr: 'Denizli', nameEn: 'Denizli', lat: 37.7765, lon: 29.0864, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '43', nameTr: 'Kütahya', nameEn: 'Kutahya', lat: 39.4167, lon: 29.9833, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '03', nameTr: 'Afyonkarahisar', nameEn: 'Afyon', lat: 38.7507, lon: 30.5567, regionTr: 'Ege', regionEn: 'Aegean' },
  { id: '64', nameTr: 'Uşak', nameEn: 'Usak', lat: 38.6823, lon: 29.4082, regionTr: 'Ege', regionEn: 'Aegean' },

  // Akdeniz
  { id: '07', nameTr: 'Antalya', nameEn: 'Antalya', lat: 36.8969, lon: 30.7133, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '01', nameTr: 'Adana', nameEn: 'Adana', lat: 37.0000, lon: 35.3213, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '33', nameTr: 'Mersin', nameEn: 'Mersin', lat: 36.8121, lon: 34.6415, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '31', nameTr: 'Hatay', nameEn: 'Hatay', lat: 36.2000, lon: 36.1667, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '46', nameTr: 'Kahramanmaraş', nameEn: 'Kahramanmaras', lat: 37.5858, lon: 36.9371, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '80', nameTr: 'Osmaniye', nameEn: 'Osmaniye', lat: 37.0742, lon: 36.2475, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '32', nameTr: 'Isparta', nameEn: 'Isparta', lat: 37.7648, lon: 30.5566, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },
  { id: '15', nameTr: 'Burdur', nameEn: 'Burdur', lat: 37.7204, lon: 30.2908, regionTr: 'Akdeniz', regionEn: 'Mediterranean' },

  // Karadeniz
  { id: '61', nameTr: 'Trabzon', nameEn: 'Trabzon', lat: 41.0027, lon: 39.7168, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '55', nameTr: 'Samsun', nameEn: 'Samsun', lat: 41.2867, lon: 36.3300, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '53', nameTr: 'Rize', nameEn: 'Rize', lat: 41.0201, lon: 40.5234, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '52', nameTr: 'Ordu', nameEn: 'Ordu', lat: 40.9780, lon: 37.8808, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '28', nameTr: 'Giresun', nameEn: 'Giresun', lat: 40.9128, lon: 38.3895, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '08', nameTr: 'Artvin', nameEn: 'Artvin', lat: 41.1828, lon: 41.8183, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '57', nameTr: 'Sinop', nameEn: 'Sinop', lat: 42.0268, lon: 35.1611, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '67', nameTr: 'Zonguldak', nameEn: 'Zonguldak', lat: 41.4564, lon: 31.7987, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '74', nameTr: 'Bartın', nameEn: 'Bartin', lat: 41.6344, lon: 32.3375, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '37', nameTr: 'Kastamonu', nameEn: 'Kastamonu', lat: 41.3766, lon: 33.7765, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '78', nameTr: 'Karabük', nameEn: 'Karabuk', lat: 41.2061, lon: 32.6228, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '81', nameTr: 'Düzce', nameEn: 'Duzce', lat: 40.8438, lon: 31.1565, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '14', nameTr: 'Bolu', nameEn: 'Bolu', lat: 40.7392, lon: 31.6116, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '05', nameTr: 'Amasya', nameEn: 'Amasya', lat: 40.6499, lon: 35.8353, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '19', nameTr: 'Çorum', nameEn: 'Corum', lat: 40.5506, lon: 34.9556, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '60', nameTr: 'Tokat', nameEn: 'Tokat', lat: 40.3167, lon: 36.5500, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '29', nameTr: 'Gümüşhane', nameEn: 'Gumushane', lat: 40.4600, lon: 39.4817, regionTr: 'Karadeniz', regionEn: 'Black Sea' },
  { id: '69', nameTr: 'Bayburt', nameEn: 'Bayburt', lat: 40.2552, lon: 40.2249, regionTr: 'Karadeniz', regionEn: 'Black Sea' },

  // İç Anadolu
  { id: '06', nameTr: 'Ankara', nameEn: 'Ankara', lat: 39.9334, lon: 32.8597, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '42', nameTr: 'Konya', nameEn: 'Konya', lat: 37.8746, lon: 32.4833, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '38', nameTr: 'Kayseri', nameEn: 'Kayseri', lat: 38.7312, lon: 35.4787, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '26', nameTr: 'Eskişehir', nameEn: 'Eskisehir', lat: 39.7767, lon: 30.5206, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '58', nameTr: 'Sivas', nameEn: 'Sivas', lat: 39.7477, lon: 37.0179, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '71', nameTr: 'Kırıkkale', nameEn: 'Kirikkale', lat: 39.8468, lon: 33.5153, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '68', nameTr: 'Aksaray', nameEn: 'Aksaray', lat: 38.3687, lon: 34.0370, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '51', nameTr: 'Niğde', nameEn: 'Nigde', lat: 37.9667, lon: 34.6833, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '50', nameTr: 'Nevşehir', nameEn: 'Nevsehir', lat: 38.6244, lon: 34.7144, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '40', nameTr: 'Kırşehir', nameEn: 'Kirsehir', lat: 39.1425, lon: 34.1709, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '70', nameTr: 'Karaman', nameEn: 'Karaman', lat: 37.1811, lon: 33.2222, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '66', nameTr: 'Yozgat', nameEn: 'Yozgat', lat: 39.8200, lon: 34.8044, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },
  { id: '18', nameTr: 'Çankırı', nameEn: 'Cankiri', lat: 40.6013, lon: 33.6134, regionTr: 'İç Anadolu', regionEn: 'Central Anatolia' },

  // Doğu Anadolu
  { id: '25', nameTr: 'Erzurum', nameEn: 'Erzurum', lat: 39.9000, lon: 41.2700, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '44', nameTr: 'Malatya', nameEn: 'Malatya', lat: 38.3552, lon: 38.3095, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '65', nameTr: 'Van', nameEn: 'Van', lat: 38.5012, lon: 43.3730, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '23', nameTr: 'Elazığ', nameEn: 'Elazig', lat: 38.6810, lon: 39.2264, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '24', nameTr: 'Erzincan', nameEn: 'Erzincan', lat: 39.7500, lon: 39.5000, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '36', nameTr: 'Kars', nameEn: 'Kars', lat: 40.6013, lon: 43.0975, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '04', nameTr: 'Ağrı', nameEn: 'Agri', lat: 39.7191, lon: 43.0503, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '12', nameTr: 'Bingöl', nameEn: 'Bingol', lat: 38.8847, lon: 40.4939, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '13', nameTr: 'Bitlis', nameEn: 'Bitlis', lat: 38.4006, lon: 42.1095, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '49', nameTr: 'Muş', nameEn: 'Mus', lat: 38.7346, lon: 41.4910, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '62', nameTr: 'Tunceli', nameEn: 'Tunceli', lat: 39.1079, lon: 39.5401, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '30', nameTr: 'Hakkari', nameEn: 'Hakkari', lat: 37.5744, lon: 43.7408, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '75', nameTr: 'Ardahan', nameEn: 'Ardahan', lat: 41.1105, lon: 42.7022, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '76', nameTr: 'Iğdır', nameEn: 'Igdir', lat: 39.9237, lon: 44.0450, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },
  { id: '73', nameTr: 'Şırnak', nameEn: 'Sirnak', lat: 37.5228, lon: 42.4594, regionTr: 'Doğu Anadolu', regionEn: 'Eastern Anatolia' },

  // Güneydoğu Anadolu
  { id: '27', nameTr: 'Gaziantep', nameEn: 'Gaziantep', lat: 37.0662, lon: 37.3833, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '21', nameTr: 'Diyarbakır', nameEn: 'Diyarbakir', lat: 37.9144, lon: 40.2306, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '63', nameTr: 'Şanlıurfa', nameEn: 'Sanliurfa', lat: 37.1500, lon: 38.7969, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '02', nameTr: 'Adıyaman', nameEn: 'Adiyaman', lat: 37.7648, lon: 38.2786, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '72', nameTr: 'Batman', nameEn: 'Batman', lat: 37.8812, lon: 41.1292, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '47', nameTr: 'Mardin', nameEn: 'Mardin', lat: 37.3122, lon: 40.7339, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '79', nameTr: 'Kilis', nameEn: 'Kilis', lat: 36.7161, lon: 37.1150, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' },
  { id: '56', nameTr: 'Siirt', nameEn: 'Siirt', lat: 37.9333, lon: 41.9500, regionTr: 'Güneydoğu Anadolu', regionEn: 'Southeastern Anatolia' }
];

// Open-Meteo Weather Code Parser
export function parseWeatherCode(code: number, isTr: boolean) {
  const codes: Record<number, { textTr: string; textEn: string; iconType: string }> = {
    0: { textTr: 'Açık, Güneşli', textEn: 'Clear sky', iconType: 'sun' },
    1: { textTr: 'Çoğunlukla Açık', textEn: 'Mainly clear', iconType: 'sun-cloud' },
    2: { textTr: 'Parçalı Bulutlu', textEn: 'Partly cloudy', iconType: 'cloud' },
    3: { textTr: 'Kapalı, Bulutlu', textEn: 'Overcast', iconType: 'cloud' },
    45: { textTr: 'Sisli', textEn: 'Fog', iconType: 'cloud' },
    48: { textTr: 'Kırağılı Sis', textEn: 'Depositing rime fog', iconType: 'cloud' },
    51: { textTr: 'Hafif Çisenti', textEn: 'Light drizzle', iconType: 'rain' },
    53: { textTr: 'Orta Çisenti', textEn: 'Moderate drizzle', iconType: 'rain' },
    55: { textTr: 'Yoğun Çisenti', textEn: 'Dense drizzle', iconType: 'rain' },
    61: { textTr: 'Hafif Yağmurlu', textEn: 'Slight rain', iconType: 'rain' },
    63: { textTr: 'Orta Şiddetli Yağmur', textEn: 'Moderate rain', iconType: 'rain' },
    65: { textTr: 'Şiddetli Yağmur', textEn: 'Heavy rain', iconType: 'rain' },
    71: { textTr: 'Hafif Kar Yağışlı', textEn: 'Slight snow', iconType: 'snow' },
    73: { textTr: 'Orta Şiddetli Kar', textEn: 'Moderate snow', iconType: 'snow' },
    75: { textTr: 'Yoğun Kar Yağışlı', textEn: 'Heavy snow', iconType: 'snow' },
    80: { textTr: 'Hafif Sağanak Yağış', textEn: 'Slight rain showers', iconType: 'rain' },
    81: { textTr: 'Orta Sağanak Yağış', textEn: 'Moderate rain showers', iconType: 'rain' },
    82: { textTr: 'Şiddetli Sağanak', textEn: 'Violent rain showers', iconType: 'rain' },
    95: { textTr: 'Gök Gürültülü Sağanak', textEn: 'Thunderstorm', iconType: 'storm' },
    96: { textTr: 'Dolu Yağışlı Fırtına', textEn: 'Thunderstorm with hail', iconType: 'storm' }
  };

  const match = codes[code];
  if (!match) return { text: isTr ? 'Bilinmeyen Hava Durumu' : 'Unknown Weather', iconType: 'sun-cloud' };
  return { text: isTr ? match.textTr : match.textEn, iconType: match.iconType };
}
