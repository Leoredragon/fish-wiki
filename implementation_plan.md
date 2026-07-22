# Map ve Weather API Entegrasyon Planı

Kullanıcının "gerçek harita ve gerçek hava durumu verileri" talebi doğrultusunda yapılan inceleme ve yeni mimari planı aşağıdadır.

## 1. Hava Durumu (Weather & Solunar) Durumu
**Mevcut Durum**: Projede hali hazırda `/weather` sayfasında **Open-Meteo API** kullanılmaktadır.
- **Gerçeklik**: Open-Meteo, tamamen **gerçek zamanlı, anlık ve profesyonel meteorolojik veriler** (sıcaklık, rüzgar hızı, hPa yüzey basıncı) sunar.
- **Ücret ve API Key**: Ticari olmayan kullanımlar için **tamamen ÜCRETSİZ ve API KEY GEREKTİRMEYEN** nadir ve en kaliteli servislerden biridir.
- **Sonuç**: Hava durumu modülümüz şu an **harika ve %100 gerçek verilerle** çalışıyor. Sizin ekstra bir hava durumu API'si (Örn: OpenWeatherMap) satın almanıza veya Key almanıza **gerek yoktur**. Mevcut sistem en masrafsız ve güvenilir yoldur.

## 2. Av Meraları Haritası (Map) Revizyonu

> [!WARNING]
> Kullanıcı haklı. Vektörel SVG harita şık dursa da, gerçek bir "yakınlaşılabilir, sokak/kıyı detaylı" harita (Google Maps tarzı) hissini vermez. Bu yüzden gerçek bir harita kütüphanesine geçiş yapıyoruz.

Gerçek bir harita entegrasyonu için önümüzde 2 harika seçenek var:

### Seçenek A: Leaflet + OpenStreetMap (ÖNERİLEN & ÜCRETSİZ)
- **Avantajı**: Tamamen **ÜCRETSİZ**, hiçbir API Key, kredi kartı veya kayıt gerektirmez.
- **Özellikleri**: Gerçek Google Maps benzeri, zoom yapılabilen, sürüklenebilen detaylı sokak/kıyı haritasıdır. Meralarımızı (Örn: İstanbul Boğazı, Çeşme, Abant) harita üzerinde **gerçek Google Maps pinleri (işaretçileri)** ile göstereceğiz.
- **Kurulum**: `react-leaflet` kütüphanesi yüklenip anında kodlanabilir.

### Seçenek B: Google Maps veya Mapbox
- **Avantajı**: Daha tanınmış arayüzler ve 3D bina destekleri.
- **Dezavantajı**: Google Maps veya Mapbox sitesine gidip hesap açmanız, proje oluşturup bir **API KEY** almanız ve bunu `.env.local` dosyasına koymanız gerekir (Google Maps ayrıca kredi kartı tanımlaması zorunlu kılar).

> [!IMPORTANT]
> **Açık Soru ve Karar Beklentisi:**
> Hava durumu zaten gerçek verilerle ücretsiz çalışıyor, ona dokunmuyoruz.
> Harita için **Seçenek A (Ücretsiz Leaflet/OpenStreetMap - Anında yaparız)** ile ilerlememi onaylar mısınız? Yoksa Google Maps/Mapbox API Key'i almak ister misiniz? 

## Önerilen Uygulama Planı (Seçenek A Onaylanırsa)
1. `npm install leaflet react-leaflet` ve `@types/leaflet` kütüphanelerinin projeye kurulması.
2. `components/RegionMapClient.tsx` dosyasındaki eski SVG haritanın silinip, yerine gerçek, sürüklenebilir `MapContainer` ve `Marker` bileşenlerinin entegre edilmesi.
3. Koordinatların (Latitude, Longitude) gerçek harita koordinatlarına uyarlanması (İstanbul, İzmir, Trabzon, Bolu, Antalya).
4. Pine tıklandığında alt kısımdaki "Mera Detay" kartının dinamik güncellenmesi.
