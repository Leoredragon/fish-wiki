# Sosyal Balıkçılık & Forum (Auth) Uygulama Planı

Kullanıcının "Kayıt Ol / Giriş Yap mantığı ile uygulamayı bir forum ve sosyal dijital livar (catch log) yapısına dönüştürme" talebi üzerine hazırlanan geniş çaplı mimari plandır.

## Hedef
Projemizi sadece statik bir "Wiki (Bilgi Kaynağı)" olmaktan çıkarıp; kullanıcıların kayıt olabildiği, kendi tuttukları balıkları fotoğraf ve taktikleriyle (kullanılan sahte, mera) paylaşabildiği **sosyal bir platforma (Forum / Dijital Livar)** dönüştürmek.

## Mimari Değişiklikler ve Veritabanı (Supabase)

Bu devasa geçiş için Supabase'in gücünü sonuna kadar kullanacağız:

### 1. Supabase Authentication (Kimlik Doğrulama)
- Kullanıcılar e-posta ve şifre ile sisteme kayıt olabilecek (İleride Google ile Giriş de eklenebilir).
- Next.js `middleware.ts` güncellenerek bazı sayfalar (örn: `/profile`, `/catch-logs/new`) sadece giriş yapmış kullanıcılara özel (Protected Route) hale getirilecek.
- Supabase SSR (Server-Side Rendering) auth paketleri (`@supabase/ssr`) projeye entegre edilecek.

### 2. Yeni Veritabanı Tabloları (Public Schema)
Mevcut `fishes` tablomuza ek olarak şu tabloları oluşturacağız:
1. **`profiles` (Kullanıcı Profilleri):**
   - Supabase Auth tetikleyicisi (Trigger) ile birisi kayıt olduğunda otomatik oluşur.
   - Alanlar: `id` (auth.users referansı), `username`, `avatar_url`, `created_at`.
2. **`catch_logs` (Av Günceleri / Forum Postları):**
   - Kullanıcıların paylaştığı balık avları.
   - Alanlar: `id`, `user_id`, `fish_id` (opsiyonel, veritabanımızdaki bir balıkla eşleşmesi için), `image_url` (tuttuğu balığın fotoğrafı), `weight` (kg), `length` (cm), `lure_used` (kullanılan yem/sahte), `location_note`, `notes` (Kullanıcı yorumu), `created_at`.
3. **`comments` (Forum Yorumları) - Opsiyonel/İleri Aşama:**
   - İnsanların birbirlerinin avlarına yaptığı yorumlar.

### 3. Supabase Storage (Dosya Depolama)
- Kullanıcıların yüklediği "tuttuğu balık fotoğrafları" ve "profil resimleri" için Supabase üzerinde `user_uploads` adında yeni bir **Storage Bucket** açılacak.

### 4. Arayüz (UI) ve Sayfalar
- **`/login` & `/register`**: Modern, temiz giriş ve kayıt ekranları.
- **Navbar Güncellemesi**: Sağ üst köşeye "Giriş Yap" veya kullanıcı giriş yaptıysa "Profilim / Çıkış Yap" menüsü eklenecek.
- **`/community` (Topluluk/Forum Akışı)**: Instagram veya klasik forum gibi, diğer üyelerin son av raporlarını, fotoğraflarını ve kullandıkları taktikleri gördüğümüz ana sosyal akış ekranı.
- **`/profile` (Dijital Livarım)**: Sadece kişinin kendi yüklediği avlarını görebildiği kişisel istatistik sayfası.

---

> [!WARNING]  
> **ÖNEMLİ BİLGİLENDİRME VE ONAY BEKLENTİSİ**
> Bu geliştirme projenin boyutunu ve işlevini **tamamen** değiştirip büyüten, harika ama büyük bir adımdır. 
> 
> Eğer bu planı **onaylıyorsanız**, aşağıdaki adımları sırasıyla gerçekleştireceğiz:
> 1. Ben projeye `@supabase/ssr` kurup Next.js Auth altyapısını kodlayacağım.
> 2. Size Supabase SQL editöründe çalıştırmanız için tablo (profiles, catch_logs) ve Storage oluşturma SQL kodlarını vereceğim.
> 3. Giriş/Kayıt arayüzlerini ve "Topluluk (Forum)" sayfasını tasarlayacağım.
>
> Bu büyük dönüşüme (Login ve Forum mantığına) başlamamı onaylıyor musunuz?
