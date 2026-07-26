/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Layers,
  Sparkles,
  Waves,
  ShieldAlert,
  X,
  Compass,
  Zap,
  Info,
  ChevronRight,
  Anchor,
  Filter
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export const INITIAL_WIKI_ARTICLES = [
  // ==========================================
  // DISIPLINES (BALIKÇILIK STİLLERİ & DİSİPLİNLERİ)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000001',
    category: 'disciplines',
    title_tr: 'Spinning (At-Çek) Balıkçılığı',
    title_en: 'Spin Fishing',
    short_desc_tr: 'Sahte maket balıklar, kaşıklar ve silikonlar ile dinamik, aktif kıyı avcılığı.',
    short_desc_en: 'Dynamic active shoreline angling using hard lures and spinners.',
    content_tr: `Spinning balıkçılığı; sert plastik maket balıklar, su üstü popperlar, kaşıklar ve silikon yemlerin kıyıdan veya tekneden suya atılıp kamış hareketleriyle ritmik şekilde geri sarılması esasına dayanır.

EKİPMAN SEÇİMİ:
• Kamış: 2.40m - 2.70m uzunluğunda, 10-40g veya 7-28g atarlı, orta-hızlı (Medium-Fast) aksiyonlu kamışlar.
• Makine: 3000 - 4000 kafa boyutunda, 5.2:1 veya 6.2:1 devirli spin makineleri.
• Misina: 8 kat örgü PE 0.8 - PE 1.2 ip misina + 0.30mm - 0.35mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.`,
    content_en: 'Spinning relies on casting hard lures or spinners and retrieving them with action.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    category: 'disciplines',
    title_tr: 'LRF (Light Rock Fishing / Ultra Hafif At-Çek)',
    title_en: 'Light Rock Fishing (LRF)',
    short_desc_tr: 'Ultra hafif kamışlar ve mikro yemlerle kıyı kayalıklarında hassas av disiplini.',
    short_desc_en: 'Ultra-light tackle angling using micro lures around coastal rocks.',
    content_tr: `LRF (Light Rock Fishing), Japonya kökenli ultra hafif takım balıkçılığıdır. 0.5 ile 10 gram arasındaki mikro yemlerle sığ kayalıklarda, liman içlerinde ve mendireklerde hassasiyeti en üst seviyeye çıkarır.

EKİPMAN SEÇİMİ:
• Kamış: 2.10m - 2.30m uzunluğunda, 0.5-7g veya 1-10g atarlı, hassas uçlu (Tubular veya Solid) LRF kamışları.
• Makine: 1000 - 2000 kafa sığ makaralı (Shallow Spool) LRF makineleri.
• Misina: PE 0.2 - PE 0.4 inceliğinde mikro ip misina + 0.16mm - 0.20mm Fluorocarbon lider.

HEDEF BALIKLAR:
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani.`,
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species with maximum sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    category: 'disciplines',
    title_tr: 'Sazan Balıkçılığı (Carp Angling)',
    title_en: 'Carp Angling',
    short_desc_tr: 'Rod podlar, ısırma alarmları, boilie yemler ve özel rig montajları ile trofe sazan avı.',
    short_desc_en: 'Specialized carp fishing using rod pods, bite alarms, boilies, and hair rigs.',
    content_tr: `Sazan balıkçılığı; yüksek sabır, nokta yemlemesi ve özel takımlarla göllerde ve barajlarda yapılan dünyanın en popüler tatlı su trofe disiplinidir.

EKİPMAN SEÇİMİ:
• Kamış: 3.60m - 3.90m (12 - 13ft) uzunluğunda, 3.0 lb - 3.5 lb test eğrili sazan kamışları.
• Makine: 8000 - 10000 kafa serbest makaralı (Baitrunner veya Quick Drag) sazan makineleri.
• Yem ve Rig: Boilie, Pop-up, Wafters, haşlanmış mısır ve Hair Rig (Kıl Rig) takımları.`,
    content_en: 'Carp angling requires specialized tackle like Hair Rigs, boilies, rod pods, and bite alarms.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // TACKLES (KAMIŞ & MAKİNELER)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000010',
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Spin Makinesi (Spinning Reel)',
    title_en: 'Spinning Reel',
    short_desc_tr: 'At-çek balıkçılığı için ön kalamalı, yüksek torklu standart olta makinesi.',
    short_desc_en: 'Standard front drag reel used for lure casting and active angling.',
    content_tr: `Spin makineleri; hafiflikleri, yüksek sarım kalitesi ve hassas kalama (drag) mekanizmaları ile dünyada en çok kullanılan olta makinesi türüdür.

BOYUT VE SEÇİM REHBERİ:
• 1000 - 2000 Kafa: LRF ve Ultra-light mikro yem avları için (180g - 210g hafiflik).
• 3000 - 4000 Kafa: Spin at-çek, deniz levreği, lüfer ve alabalık avları için ideal standart boy.
• 5000 - 6000 Kafa: Shore Jigging, tekne ve ağır kıyı avları için güçlü dişli modelleri.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Ninja LT, Shimano Catana FE, Okuma Ceymar, Savage Gear SG4, Fujin Venom.`,
    content_en: 'Spinning reels offer versatile performance across all freshwater and saltwater casting applications.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Surfcast (Big Pit) Makine',
    title_en: 'Surf Big Pit Reel',
    short_desc_tr: 'Geniş konik makaralı, 100 metre üzeri uzağa atış ve Boğaz makinesi.',
    short_desc_en: 'Long cast shallow spool reel for heavy beach and current surfcasting.',
    content_tr: `Surf makineleri (Big Pit); sığ ve geniş açılı konik misina makarası sayesinde atış esnasında ipin sürtünmesizce boşalmasını ve 100-150m mesafelere ulaşmasını sağlar.

ÖZELLİKLERİ:
• 7000 - 10000 kafa boyutundadır.
• Ağır kurşunları (150-220g) akıntıdan zorlanmadan çekmek için düşük dişli oranına (4.1:1 - 4.6:1) ve yüksek torka sahiptir.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Emcast Surf, Shimano Speedmaster 14000, Okuma Distance Surf, Ryobi Proskyer.`,
    content_en: 'Big Pit reels feature large tapered spools engineered for extreme distance casting.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    category: 'tackles',
    sub_category: 'reel',
    title_tr: 'Sazan Makinesi (Baitrunner / Serbest Makara)',
    title_en: 'Carp Baitrunner Reel',
    short_desc_tr: 'Çift kalamalı, balık asıldığında misinayı boşa salan ve kol çevrilince devreye giren göl makinesi.',
    short_desc_en: 'Dual drag free-spool reel designed specifically for static carp angling.',
    content_tr: `Sazan makineleri (Baitrunner); arkada bulunan ek bir kol yardımıyla balık yemi alıp kaçarken misinayı sıfır dirençle boşa salan özel çift kalama mekanizmasına sahiptir.

AVANTAJLARI:
Balık oltaya vurup kaçarken kamışı sehpadan suya çekemez. Kol bir tur çevrildiği anda arka serbest kalama devreden çıkar ve ön savaş kalaması anında kilitlenir.

TÜRKİYE'DE POPÜLER MODELLER:
Okuma Avenger ABF, Shimano Baitrunner ST/DL, Daiwa Black Widow BR.`,
    content_en: 'Baitrunner reels allow carp to take line freely until the angler turns the handle.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'Spin Kamışı (Spinning Rod)',
    title_en: 'Spinning Rod',
    short_desc_tr: '2.40m - 2.70m uzunluğunda, 7-35g / 10-40g atarlı esnek kıyı at-çek kamışı.',
    short_desc_en: 'Standard 2-piece lure casting rod for shoreline angling.',
    content_tr: `Spin kamışları; maket balık, kaşık ve silikon yemleri erimli fırlatmak ve yemlere kamış ucuyla aksiyon vermek için tasarlanmış 2 parçalı karbon kamışlardır.

ÖZELLİKLERİ:
• Boyut: Kıyıdan 2.40m - 2.70m, tekneden 2.10m - 2.40m.
• Atar Aralığı: 7-28g (Medium Light), 10-40g (Medium), 14-42g (Medium Heavy).
• Aksiyon: Hızlı (Fast) veya Orta-Hızlı (Medium-Fast) uç aksiyonu.

TÜRKİYE'DE POPÜLER MODELLER:
Savage Gear SG2 Shore Game, Daiwa Ninja Spin, Shimano Catana FX, Okuma Alaris, Fujin Dragon.`,
    content_en: 'Spinning rods are 2-piece carbon rods designed for casting lures.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'LRF Kamışı (Ultra Light Rod)',
    title_en: 'LRF Ultra Light Rod',
    short_desc_tr: '2.10m - 2.30m, 0.5-7g / 1-10g atarlı hassas uçlu ultra hafif LRF kamışı.',
    short_desc_en: 'Ultra light carbon rod with sensitive solid or tubular tip.',
    content_tr: `LRF kamışları; 1-3 gramlık mikro yemleri fırlatabilen ve kamış ucundaki en ufak balık tıkırtısını sapa ileten ultra hassas karbon kamışlardır.

UÇ YAPISI SEÇİMİ:
• Solid (Dolgu Uç): Esnek dolgu uçlu modeller silikon yemlerde vuruş hissini artırır, balık yemi emerken direnç hissetmez.
• Tubular (Boru Uç): İçi boş boru uçlu modeller mikro maket ve mikro kaşıklarda sert aksiyon vermeyi kolaylaştırır.

TÜRKİYE'DE POPÜLER MODELLER:
Savage Gear Micro Game, Fujin Boreas, Major Craft Solpara LRF, Daiwa Laguna LRF, Okuma Wave Off.`,
    content_en: 'LRF rods feature ultra sensitive tips designed for casting micro lures weighing under 10 grams.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000015',
    category: 'tackles',
    sub_category: 'rod',
    title_tr: 'Surfcast Kamışı (Surfcasting Rod)',
    title_en: 'Surfcasting Rod',
    short_desc_tr: '4.20m - 4.50m, 100-200g / 150-250g atarlı güçlü 3 parçalı boğaz ve kumsal kamışı.',
    short_desc_en: 'Heavy duty beach and current casting surf rod.',
    content_tr: `Surfcast kamışları; dalgalı kumsal kıyılarda veya İstanbul Boğazı gibi sert akıntılı sularda 150-220 gramlık ağır kurşunları 100-150m mesafelere fırlatan 3 parçalı veya teleskopik sert kamışlardır.

TÜRKİYE'DE POPÜLER MODELLER:
Daiwa Black Widow Surf, Okuma Trio Rex Surf, Kendo Surf, Trabucco Poetica.`,
    content_en: 'Surfcasting rods cast heavy sinkers long distances into breaking surf.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // LINES (MİSİNALAR & LİDERLER)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000020',
    category: 'lines',
    sub_category: 'braid',
    title_tr: '8 Kat Örgü PE İp Misina (8x Braided Line)',
    title_en: '8x Braided PE Line',
    short_desc_tr: 'Sıfır esneme, yüksek çeker gücü ve pürüzsüz yapısıyla maksimum atış erimi.',
    short_desc_en: 'Zero stretch, high tensile strength 8-strand braided line.',
    content_tr: `8 kat örgü ip misinalar; 8 adet mikro PE fiber ipliğin yuvarlak ve pürüzsüz şekilde örülmesiyle üretilir.

AVANTAJLARI:
• Esneme yapmaz (%0 esneme): En hafif tıkırtıyı kamışa iletir.
• İnce Çap / Yüksek Çeker: Rüzgar ve su direncini düşürür, sahtenin çok daha uzak mesafeye fırlatılmasını sağlar.

TÜRKİYE'DE POPÜLER MARKLAR:
Daiwa J-Braid 8x, Shimano Kairiki 8, Major Craft Dangan Braid 8x, Kendo Dynasty 8x, Sufix 832.`,
    content_en: '8-strand braided line delivers ultra-smooth casting performance and extreme sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000021',
    category: 'lines',
    sub_category: 'fluorocarbon',
    title_tr: 'Fluorocarbon (FC) Lider Misina',
    title_en: 'Fluorocarbon Leader',
    short_desc_tr: 'Su altında %99 görünmezlik, yüksek düğüm tutuşu ve kayalara karşı sürtünme direnci.',
    short_desc_en: 'Near 100% invisible underwater with high abrasion resistance.',
    content_tr: `Fluorocarbon misinalar; kırılma indisi suyunkine çok yakın olduğu için su altında balıklar tarafından fark edilemez.

AVANTAJLARI:
• İp misinanın ucuna 50 cm - 1.5 metre lider olarak bağlanır.
• Keskin kayalara, midyelere ve balık dişlerine karşı ip misinaya göre çok daha dayanıklıdır.

TÜRKİYE'DE POPÜLER MARKLAR:
Seaguar Neox / FXR, Savage Gear Regenerator FC, Kendo FC Leader, Daiwa J-Thread FC.`,
    content_en: 'Fluorocarbon line provides invisible presentation and abrasion resistance.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000022',
    category: 'lines',
    sub_category: 'monofilament',
    title_tr: 'Monofilament (Naylon) Misina',
    title_en: 'Monofilament Line',
    short_desc_tr: 'Şok emici esnek yapı, yüksek düğüm mukavemeti ve ekonomik klasik misina.',
    short_desc_en: 'Shock absorbing flexible monofilament fishing line.',
    content_tr: `Monofilament misinalar; tek parça naylon hammaddeden üretilen esnek ve ekonomik klasik misinalardır.

AVANTAJLARI:
• %15-%25 oranında esneme yapar. Balığın ani kafa darbelerinde şok emici görevi görerek takımın kopmasını engeller.
• Şamandıralı avlarda ve yemli dip takımlarında en güvenilir seçenektir.

TÜRKİYE'DE POPÜLER MARKLAR:
Trabucco T-Force, Daiwa Hyper Sensor, Caperlan 4x4, Sufix XL Strong.`,
    content_en: 'Monofilament line stretches under load to absorb sudden shocks.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000023',
    category: 'lines',
    sub_category: 'leader',
    title_tr: 'Konik Şok Lider (Tapered Surf Leader)',
    title_en: 'Tapered Surf Leader',
    short_desc_tr: 'Surfcasting atışlarında 150-220g ağır kurşun atarken kopmayı önleyen konik lider.',
    short_desc_en: 'Tapered leader designed for heavy surfcasting distance throws.',
    content_tr: `Konik şok lider; surfcasting disiplininde 0.18mm gibi ince ana beden misinasının ucuna eklenen, 15 metrelik boyunda 0.20mm'den başlayıp 0.57mm kalınlığa doğru kademeli genişleyen özel surf lideridir.

TÜRKİYE'DE POPÜLER MARKLAR:
Trabucco T-Force XPS Tapered Leader, Daiwa Tournament Tapered Leader, Yuki Tapered Leader.`,
    content_en: 'Tapered leaders feature a smooth gradient diameter to withstand heavy casting forces.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // LURES (SAHTE YEMLER)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000030',
    category: 'lures',
    sub_category: 'minnow',
    title_tr: 'Floating & Sinking Minnow (Maket Balıklar)',
    title_en: 'Minnow Lures',
    short_desc_tr: 'Yüzey ve orta suda yaralı balık aksiyonu veren gagalı maket sahteler.',
    short_desc_en: 'Hard plastic minnows with diving lip for midwater action.',
    content_tr: `Minnow sahteler; önlerindeki gaga yapısı sayesinde sarım esnasında suyun direncini kullanarak yaralı balık gibi sallanma (wobbling) ve yalpalama (rolling) aksiyonu veren klasik sahtelerdir.

TÜRKİYE'DE POPÜLER MODEL VE MARKLAR:
Kendo Seabass Minnow 125F, Duo Tide Minnow Slim, Shimano Silent Assassin 120F, Savage Gear Sandeel Jerk.`,
    content_en: 'Minnow lures feature diving lips that generate lifelike swimming actions.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000031',
    category: 'lures',
    sub_category: 'surface',
    title_tr: 'Popper & WTD Stickbait (Su Üstü Sahteler)',
    title_en: 'Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve WTD zikzağı ile avcı balıkları uyaran sahteler.',
    short_desc_en: 'Topwater splashers and zigzagging walking baits for explosive surface strikes.',
    content_tr: `Su üstü sahteleri; su yüzeyinde kırılma, gürültü ve köpük çıkararak yırtıcı balıkların hücum refleksini tetikleyen en heyecanlı sahte türüdür.

TÜRKİYE'DE POPÜLER MODELLER:
Strike Pro Buster Jerk, Fujin Ziggy 90, Savage Gear Pop Walker, Kendo Seabass Popper.`,
    content_en: 'Topwater lures splash and walk on the surface triggering aggressive predator strikes.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000032',
    category: 'lures',
    sub_category: 'silicone',
    title_tr: 'Silikon Yemler & Jighead (Shad, Worm, Craw)',
    title_en: 'Soft Plastics & Jigheads',
    short_desc_tr: 'Balık, solucan ve karides silikonlarının kurşun kafalı iğneli modelleri.',
    short_desc_en: 'Soft plastic shad, worm, and craw lures with lead jigheads.',
    content_tr: `Yumuşak silikon yemler; su içerisindeki yüksek esneklikleri, titreyen kürek kuyrukları (paddle tail) ve cezbedici koku özleri ile avcılığı kanıtlanmış sahtelerdir.

TÜRKİYE'DE POPÜLER MARKLAR:
Savage Gear Cannibal Shad, Berkley Gulp Alive Sandworm, Fujin Yummy Worm, Savage Gear Craft Shad.`,
    content_en: 'Soft plastics provide natural texture and movement enticing sluggish predators.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000033',
    category: 'lures',
    sub_category: 'spoon',
    title_tr: 'Metal Kaşıklar & Shore Jigler',
    title_en: 'Metal Spoons & Shore Jigs',
    short_desc_tr: 'Uzak atış parıltılı kaşıklar ve asist iğneli metal jig sahteleri.',
    short_desc_en: 'Long casting metal spoons and assist hook jigs.',
    content_tr: `Ağır yapıları ve aerodinamik şekilleri sayesinde sert rüzgarda dahi 80-100 metre mesafeye ulaşabilen parıltılı metal sahtelerdir.

TÜRKİYE'DE POPÜLER MODELLER:
Hansen Pilgrim Kaşık, Kendo Seabass Spoon, Savage Gear Psycho Sprat Jig, Major Craft Jigpara Slim.`,
    content_en: 'Metal spoons and jigs sink fast and reflect light underwater for pelagic species.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000034',
    category: 'lures',
    sub_category: 'egi',
    title_tr: 'EGI Kalamar & Sübye Zokaları',
    title_en: 'EGI Squid Lures',
    short_desc_tr: 'Kumaş kaplı, şemsiye tırnaklı gece kalamar ve sübye zokaları.',
    short_desc_en: 'Cloth-wrapped EGI lures with double crown hooks for squid.',
    content_tr: `EGI zokaları; kumaş kaplı gerçekçi karides ve balık gövdeleri ile gece ışıklı mendirek ve limanlarda süzülerek kalamar ve sübyeleri avlayan özel zokalardır.

TÜRKİYE'DE POPÜLER MODELLER:
Yamashita Egi Oh K, Yo-Zuri Aurie-Q, Kendo Egi Sahte, Savage Gear 3D Swim Squid.`,
    content_en: 'EGI squid lures mimic shrimp to target squid and cuttlefish during night fishing.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000035',
    category: 'lures',
    sub_category: 'vibration',
    title_tr: 'Metal Vibrasyon & Blade Vibe',
    title_en: 'Metal Vibration Blade Lures',
    short_desc_tr: 'Yüksek frekansta titreyerek lüfer, çinekop ve tatlı su levreğini cezbeden metal sahteler.',
    short_desc_en: 'High frequency vibrating metal blade lures.',
    content_tr: `Metal vibrasyon sahteleri; hızlı sarım esnasında su altında yüksek frekanslı titreşimler yayarak balıkların yanal çizgi organlarını uyarır ve vuruş refleksini tetikler.

TÜRKİYE'DE POPÜLER MODELLER:
Fujin Vibe 18g/24g, Savage Gear Fat Vib, Kendo Vib 70, Strike Pro Cyber Vibe.`,
    content_en: 'Vibration blade lures generate tight high frequency vibrations during retrieval.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // RIGS (SAZAN & DENİZ RİGLERİ)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000040',
    category: 'rigs',
    sub_category: 'carp_rig',
    title_tr: 'Hair Rig (Kıl Rig)',
    title_en: 'Hair Rig',
    short_desc_tr: 'Yemi iğneden bağımsız kıl misinaya dizerek balığın emmesini sağlayan temel sazan rigi.',
    short_desc_en: 'Classic carp hair rig presentation.',
    content_tr: `Hair Rig; yemin iğneye doğrudan takılmak yerine iğne altındaki kıl misinaya dizilerek balığın temkinsiz emmesini sağlayan temel sazan montajıdır.`,
    content_en: 'Classic hair rig.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: '00000000-0000-0000-0000-000000000041',
    category: 'rigs',
    sub_category: 'carp_rig',
    title_tr: 'Ronnie Rig / Spinner Rig',
    title_en: 'Ronnie Rig',
    short_desc_tr: 'Pop-up yüzen yemlerde 360 derece dönebilen en popüler agresif sazan rigi.',
    short_desc_en: '360 degree rotating pop-up rig.',
    content_tr: `Ronnie Rig; pop-up yemlerin dipteki otlardan 2-4 cm yukarıda askıda durmasını sağlayan ve iğneye 360 derece serbest dönüş vererek harika kanca tutuşu sunan rigdir.`,
    content_en: 'Pop-up spinner rig.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // KNOTS (BALIKÇILIK DÜĞÜMLERİ)
  // ==========================================
  {
    id: '00000000-0000-0000-0000-000000000050',
    category: 'knots',
    sub_category: 'line_join',
    title_tr: 'FG Knot (İp + Lider Düğümü)',
    title_en: 'FG Knot',
    short_desc_tr: 'İp misina ile Fluorocarbon lider birleştirmede sıfır pürüzlü en güçlü düğüm.',
    short_desc_en: 'Slimmest braid to leader knot.',
    content_tr: `FG Knot; ip misinanın lider etrafına örülmesiyle atılan, porselen fincanlardan takılmadan geçen rakipsiz düğümdür.`,
    content_en: 'FG knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'İleri'
  },
  {
    id: '00000000-0000-0000-0000-000000000051',
    category: 'knots',
    sub_category: 'line_join',
    title_tr: 'Alberto Knot (Crazy Alberto)',
    title_en: 'Alberto Knot',
    short_desc_tr: 'İp ile lider misinayı sahada çok hızlı ve pratik birleştiren düğüm.',
    short_desc_en: 'Fast braid to leader knot.',
    content_tr: `Alberto Knot; rüzgarlı havalarda ve geceleri hızlıca atılabilen yüksek çekergüçlü lider düğümüdür.`,
    content_en: 'Alberto knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: '00000000-0000-0000-0000-000000000052',
    category: 'knots',
    sub_category: 'terminal',
    title_tr: 'Palomar Knot',
    title_en: 'Palomar Knot',
    short_desc_tr: 'Klips, fırdöndü ve iğnelere misina bağlamada %95+ çeker güçlü en güvenilir düğüm.',
    short_desc_en: 'Strongest knot for terminal tackle.',
    content_tr: `Palomar Knot; ip ve misinaların klipse ve fırdöndüye kaymadan baglanmasını sağlayan en sağlam düğümdür.`,
    content_en: 'Palomar knot.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  }
];

export default function WikiClient({ initialArticles = [] }: { initialArticles?: any[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [articles, setArticles] = useState<any[]>(() => {
    if (initialArticles && initialArticles.length > 0) {
      const supabaseTitles = new Set(initialArticles.map((item: any) => (item.title_tr || '').trim().toLowerCase()));
      const remainingInitial = INITIAL_WIKI_ARTICLES.filter(
        (item: any) => !supabaseTitles.has((item.title_tr || '').trim().toLowerCase())
      );
      const merged = [...initialArticles, ...remainingInitial];
      const seen = new Set<string>();
      return merged.filter((item: any) => {
        const key = (item.title_tr || '').trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return INITIAL_WIKI_ARTICLES;
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedWaterType, setSelectedWaterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  // Articles are fetched on the server now

  const categories = [
    { id: 'all', label_tr: 'Tüm Rehberler', label_en: 'All Guides' },
    { id: 'disciplines', label_tr: 'Stiller & Disiplinler', label_en: 'Angling Styles' },
    { id: 'tackles', label_tr: 'Kamış & Makine', label_en: 'Rods & Reels' },
    { id: 'lines', label_tr: 'Misinalar & Liderler', label_en: 'Fishing Lines' },
    { id: 'lures', label_tr: 'Sahte Yemler', label_en: 'Lures & Baits' },
    { id: 'rigs', label_tr: 'Rig & Takımlar', label_en: 'Rigs & Assemblies' },
    { id: 'knots', label_tr: 'Balıkçılık Düğümleri', label_en: 'Fishing Knots' },
    { id: 'accessories', label_tr: 'Aksesuarlar', label_en: 'Accessories' }
  ];

  const subCategoriesMap: Record<string, { id: string; label_tr: string; label_en: string }[]> = {
    tackles: [
      { id: 'all', label_tr: 'Tümü (Kamış & Makine)', label_en: 'All Tackle' },
      { id: 'reel', label_tr: 'Makineler', label_en: 'Reels' },
      { id: 'rod', label_tr: 'Kamışlar', label_en: 'Rods' }
    ],
    lines: [
      { id: 'all', label_tr: 'Tüm Misinalar', label_en: 'All Lines' },
      { id: 'braid', label_tr: 'Örgü İp (PE Braid)', label_en: 'Braided Lines' },
      { id: 'fluorocarbon', label_tr: 'Fluorocarbon (FC)', label_en: 'Fluorocarbon' },
      { id: 'monofilament', label_tr: 'Monofilament (Naylon)', label_en: 'Monofilament' },
      { id: 'leader', label_tr: 'Şok Lider (Shock Leader)', label_en: 'Shock Leader' }
    ],
    lures: [
      { id: 'all', label_tr: 'Tüm Sahte Yemler', label_en: 'All Lures' },
      { id: 'minnow', label_tr: 'Minnow & Maketler', label_en: 'Hard Minnows' },
      { id: 'surface', label_tr: 'Su Üstü (Popper / WTD)', label_en: 'Topwater' },
      { id: 'silicone', label_tr: 'Silikon Yemler & Jighead', label_en: 'Soft Plastics' },
      { id: 'spoon', label_tr: 'Metal Kaşık & Shore Jig', label_en: 'Spoons & Jigs' },
      { id: 'egi', label_tr: 'Kalamar Zokası (EGI)', label_en: 'Squid EGI' },
      { id: 'vibration', label_tr: 'Metal Vibrasyon', label_en: 'Metal Vibs' }
    ],
    rigs: [
      { id: 'all', label_tr: 'Tüm Rigler', label_en: 'All Rigs' },
      { id: 'carp_rig', label_tr: 'Sazan Rigleri', label_en: 'Carp Rigs' },
      { id: 'sea_rig', label_tr: 'Tuzlu Su & LRF Rigleri', label_en: 'Saltwater Rigs' }
    ],
    knots: [
      { id: 'all', label_tr: 'Tüm Düğümler', label_en: 'All Knots' },
      { id: 'line_join', label_tr: 'Misina Birleştirme (FG / Alberto)', label_en: 'Line Join Knots' },
      { id: 'terminal', label_tr: 'Kanca & Klips Bağlama', label_en: 'Terminal Knots' }
    ]
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const currentSubCategories = subCategoriesMap[selectedCategory] || [];

  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesWater = selectedWaterType === 'all' || item.water_type === 'Tüm Sular' || item.water_type === selectedWaterType;
      const matchesSearch =
        (item.title_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.short_desc_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content_tr || '').toLowerCase().includes(searchQuery.toLowerCase());

      const titleLower = (item.title_tr || '').toLowerCase();
      const matchesSub =
        selectedSubCategory === 'all' ||
        item.sub_category === selectedSubCategory ||
        (selectedSubCategory === 'rod' && titleLower.includes('kamış')) ||
        (selectedSubCategory === 'reel' && titleLower.includes('makine')) ||
        (selectedSubCategory === 'braid' && (titleLower.includes('ip') || titleLower.includes('örgü'))) ||
        (selectedSubCategory === 'fluorocarbon' && titleLower.includes('fluorocarbon')) ||
        (selectedSubCategory === 'monofilament' && (titleLower.includes('mono') || titleLower.includes('naylon'))) ||
        (selectedSubCategory === 'leader' && titleLower.includes('lider')) ||
        (selectedSubCategory === 'minnow' && titleLower.includes('minnow')) ||
        (selectedSubCategory === 'surface' && (titleLower.includes('popper') || titleLower.includes('su üstü') || titleLower.includes('wtd'))) ||
        (selectedSubCategory === 'silicone' && (titleLower.includes('silikon') || titleLower.includes('jighead'))) ||
        (selectedSubCategory === 'spoon' && (titleLower.includes('kaşık') || titleLower.includes('jig'))) ||
        (selectedSubCategory === 'egi' && (titleLower.includes('egi') || titleLower.includes('kalamar'))) ||
        (selectedSubCategory === 'vibration' && titleLower.includes('vibrasyon')) ||
        (selectedSubCategory === 'carp_rig' && item.category === 'rigs' && (item.water_type === 'Tatlı Su' || titleLower.includes('rig'))) ||
        (selectedSubCategory === 'sea_rig' && item.category === 'rigs' && item.water_type !== 'Tatlı Su') ||
        (selectedSubCategory === 'line_join' && item.category === 'knots' && (titleLower.includes('fg') || titleLower.includes('alberto'))) ||
        (selectedSubCategory === 'terminal' && item.category === 'knots' && (titleLower.includes('palomar') || titleLower.includes('clinch')));

      return matchesCategory && matchesSub && matchesWater && matchesSearch;
    });
  }, [articles, selectedCategory, selectedSubCategory, selectedWaterType, searchQuery]);

  const getCategoryLabel = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return isTr ? found?.label_tr : found?.label_en;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Hero Header Banner (Matching Homepage Layout & Search) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-slate-800 space-y-4">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/10 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            {isTr ? 'Balıkçılık Wiki & Ekipman Rehberi' : 'Angling Wiki & Equipment Guide'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
            {isTr
              ? 'Balıkçılık stilleri, makine ve kamış seçimleri, düğüm teknikleri, sahte yem aksiyonları ve rig montajlarına dair aradığınız tüm profesyonel bilgiler.'
              : 'Explore fishing styles, rod & reel choices, knot techniques, lure actions, and rig setups.'}
          </p>
        </div>

        {/* Integrated Hero Search Input (Exact Homepage Style) */}
        <div className="relative z-10 max-w-2xl pt-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Wiki rehberlerinde ara (Örn: LRF, Spin Kamış, Surfcast, FG Knot...)' : 'Search wiki guides...'}
              className="w-full pl-10 pr-10 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white/20 text-white px-2 py-1 rounded-lg hover:bg-white/30"
              >
                {isTr ? 'Temizle' : 'Clear'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Category Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {isTr ? 'Kategoriler' : 'Categories'}
          </span>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none pt-2 border-t border-slate-100">
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {isTr ? cat.label_tr : cat.label_en}
            </button>
          ))}
        </div>

        {/* 2nd Level Sub-category Horizontal Scroll Pills (Excluding 'Tümü') */}
        {currentSubCategories.filter(s => s.id !== 'all').length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none pt-2 border-t border-dashed border-slate-200">
            <div className="flex items-center text-slate-400 space-x-1 shrink-0 text-xs font-bold mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTr ? 'Alt Filtre:' : 'Sub-filter:'}</span>
            </div>
            {currentSubCategories.filter(s => s.id !== 'all').map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.id ? 'all' : sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                  selectedSubCategory === sub.id
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {isTr ? sub.label_tr : sub.label_en}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Articles (Mobile 2-Column Responsive Layout) */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base">{isTr ? 'Aramanıza uygun rehber içeriği bulunamadı.' : 'No wiki articles found.'}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubCategory('all');
              setSelectedWaterType('all');
              setSearchQuery('');
            }}
            className="text-xs font-extrabold text-emerald-600 hover:underline"
          >
            {isTr ? 'Filtreleri Temizle' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredArticles.map((article: any, idx: number) => (
            <div
              key={article.id || idx}
              onClick={() => setActiveArticle(article)}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2 sm:space-y-4">
                {/* Cover Image & Badges */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title_tr || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <BookOpen className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 flex items-center space-x-1 sm:space-x-2">
                    <span className="bg-[#0F172A]/95 text-white text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-sm">
                      {article.water_type || 'Tüm Sular'}
                    </span>
                  </div>

                  {article.difficulty_level && (
                    <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 bg-emerald-600/95 text-white text-[9px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-sm">
                      {article.difficulty_level}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="px-3 sm:px-6 space-y-1 sm:space-y-2">
                  <span className="text-[9px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 className="font-extrabold text-[#0F172A] text-xs sm:text-lg group-hover:text-emerald-600 transition-colors line-clamp-1 leading-snug">
                    {isTr ? article.title_tr : article.title_en}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {isTr ? article.short_desc_tr : article.short_desc_en}
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-6 pt-2 sm:pt-4 mt-1 sm:mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>{isTr ? 'İncele' : 'Read'}</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-slate-100"
            >
              {/* Modal Cover Image */}
              <div className="relative h-56 sm:h-72 bg-slate-900 overflow-hidden">
                {activeArticle.image_url && (
                  <Image src={activeArticle.image_url} alt="" fill sizes="100vw" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-2xl hover:bg-slate-900 transition-all border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg">
                      {activeArticle.water_type}
                    </span>
                    <span className="bg-slate-800/80 backdrop-blur-md text-slate-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {activeArticle.difficulty_level}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{isTr ? activeArticle.title_tr : activeArticle.title_en}</h2>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold text-xs text-slate-700">
                  {isTr ? activeArticle.short_desc_tr : activeArticle.short_desc_en}
                </div>

                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isTr ? 'Teknik Detaylar ve Püf Noktaları' : 'Technical Details & Pro Tips'}</span>
                  </h4>
                  <p className="whitespace-pre-line text-slate-600 font-medium">
                    {isTr ? activeArticle.content_tr : activeArticle.content_en}
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-2xl text-xs transition-all shadow-md"
                  >
                    {isTr ? 'Kapat' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
