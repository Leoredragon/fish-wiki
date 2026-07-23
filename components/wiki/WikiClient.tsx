/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
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
  Anchor
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const INITIAL_WIKI_ARTICLES = [
  // ==========================================
  // DISIPLINES (BALIKÇILIK STİLLERİ & DİSİPLİNLERİ)
  // ==========================================
  {
    id: 'd1',
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
Deniz Levreği, Lüfer, Çinekop, Palamut, Akya, Baracuda ve Alabalık.

AV TAKTİKLERİ:
Sabahın ilk ışıklarında ve gün batımında su üstü sahteleri (WTD aksiyonu) veya sığ dalar maketler maksimum verim sağlar. Bulanık ve dalgalı havalarda beyaz, limon veya pembe renkli sahteler tercih edilmelidir.`,
    content_en: 'Spinning relies on casting hard lures or spinners and retrieving them with action.',
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: 'd2',
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
İstavrit, Mırmır, Eşkina, Karagöz, Tatlı Su Levreği (Perç), Gümüş Balığı, Hani, Kaya Balığı.

AV TAKTİKLERİ:
1g-3g jighead üzerine takılan kokulu silikonlar (Gulp, Isome vb.) dibe yakın mesafeden yavaşça zıplatılarak çekilir. Gece liman ışıkları etrafında batan mikro kaşıklar ve su üstü mikro sahteler istavrit avında mükemmel aksiyon sunar.`,
    content_en: 'LRF uses ultra-light rods (0.5-10g) and micro silicons to target species like horse mackerel, bream, and perch with maximum sensitivity.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: 'd3',
    category: 'disciplines',
    title_tr: 'Sazan Balıkçılığı (Carp Angling)',
    title_en: 'Carp Angling',
    short_desc_tr: 'Rod podlar, ısırma alarmları, boilie yemler ve özel rig montajları ile trofe sazan avı.',
    short_desc_en: 'Specialized carp fishing using rod pods, bite alarms, boilies, and hair rigs.',
    content_tr: `Sazan balıkçılığı; yüksek sabır, nokta yemlemesi ve özel takımlarla göllerde ve barajlarda yapılan dünyanın en popüler tatlı su trofe disiplinidir.

EKİPMAN SEÇİMİ:
• Kamış: 3.60m - 3.90m (12 - 13ft) uzunluğunda, 3.0 lb - 3.5 lb test eğrili (Test Curve) sazan kamışları.
• Makine: 8000 - 10000 kafa serbest makaralı (Baitrunner veya Quick Drag) sazan makineleri.
• Destek & Elektronik: Rod Pod sehpa, elektronik ısırma alarmı (Bite Alarm) ve ışıklı Swinger takımları.

YEM VE RİG SEÇİMİ:
Boilie (haşlanmış yem topu), Pop-up (yüzen boilie), Wafters, haşlanmış mısır ve kaplan fıstığı kullanılır. İğneye yem doğrudan takılmaz; Hair Rig (Kıl Rig), Ronnie Rig veya Chod Rig ile bağımsız dizilir.

AV TAKTİKLERİ:
Yemleme roketleri (Spomb) veya kumandalı yemleme botları ile mera önceden yemlenir. Sazan yemi vakumlayarak yuttuğunda iğne alt dudağa saplanır ve alarm çalar.`,
    content_en: 'Carp angling requires specialized tackle like Hair Rigs, boilies, rod pods, and bite alarms to target massive mirror and common carp.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta'
  },
  {
    id: 'd4',
    category: 'disciplines',
    title_tr: 'Shore Jigging (Kıyı Ağır Metal Jig)',
    title_en: 'Shore Jigging',
    short_desc_tr: 'Kıyıdan ve mendirek kayalıklarından ağır metal jiglerle iri pelajik avcılığı.',
    short_desc_en: 'Heavy shore angling targeting large pelagics with metal jigs.',
    content_tr: `Shore Jigging; sert akıntılı ve derin kayalık sahillere 30 ile 100 gram arasındaki ağır metal jiglerin atılıp dikine sert vuruşlarla (High Pitch Jerk) aksiyon verilerek çekilmesidir.

EKİPMAN SEÇİMİ:
• Kamış: 2.70m - 3.00m uzunluğunda, 30-80g veya 40-100g atarlı sert güçlü Jig kamışları.
• Makine: 4000 - 6000 kafa boyutunda, yüksek devirli (HG/XG) güçlü dişli yapısına sahip makineler.
• Misina: PE 1.5 - PE 3.0 örgü ip + 0.45mm - 0.65mm Fluorocarbon şok lider.

HEDEF BALIKLAR:
Akya, Torik, Palamut, Kuzu (Greater Amberjack), Baracuda, Lagos, Sinarit.`,
    content_en: 'Shore jigging involves casting heavy metal lures from coastal rocks to target pelagic predators.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'İleri'
  },
  {
    id: 'd5',
    category: 'disciplines',
    title_tr: 'Surfcasting (Kıyı İleri Atış & Ağır Dip)',
    title_en: 'Surfcasting',
    short_desc_tr: 'Dalgalı kumluk ve kırmalık sahillere 100-250 gramlık ağır kurşunlarla uzağa atış.',
    short_desc_en: 'Long-distance casting with heavy sinkers (100-250g) on sandy beaches.',
    content_tr: `Surfcasting; dalgalı deniz kıyılarında 100 metre üzerindeki mesafelere ağır kurşunlu takımları fırlatarak dipteki iri balıkları avlama tekniğidir.

EKİPMAN SEÇİMİ:
• Kamış: 4.20m - 4.50m uzunluğunda, 100-200g veya 150-250g atarlı 3 parçalı veya sert teleskopik surf kamışları.
• Makine: 7000 - 10000 kafa geniş konik (Big Pit) sığ makaralı makineler.
• Misina: 0.16mm - 0.20mm Örgü İp + Konik Şok Lider (Shockleader) veya 0.30mm - 0.35mm Monofilament.

HEDEF BALIKLAR:
Çupra, Kalkan, Mırmır, Levrek, Eşkina ve Kurşun Arkası tekniği ile Çinekop / Lüfer / Palamut.`,
    content_en: 'Surfcasting utilizes 4.2m-4.5m stiff rods to cast heavy sinkers over 100 meters into the surf zone.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // RIGS (SAZAN & DENİZ RİGLERİ)
  // ==========================================
  {
    id: 'r1',
    category: 'rigs',
    title_tr: 'Hair Rig (Kıl Rig)',
    title_en: 'Hair Rig',
    short_desc_tr: 'Yemi iğneden bağımsız kıl misinaya dizerek balığın temkinsiz emmesini sağlayan temel sazan rigi.',
    short_desc_en: 'The classic carp rig that presents the bait on a hair independent of the hook.',
    content_tr: `Hair Rig (Kıl Rig), modern sazan balıkçılığının temelini oluşturan en devrimsel montajdır. Yem (boilie veya mısır) iğne üzerine takılmaz; iğne sapının uzantısı olan ince kıl misinaya yem stoperi ile dizilir.

ÇALIŞMA MANTIĞI:
Sazan dipteki yemi vakumlayarak ağzına çekerken iğnenin varlığını hissetmez. Yemi yuttuğu anda iğne boşta olduğu için balığın alt dudağına kendiliğinden batar (Self-Hooking).

KULLANIM ALANLARI:
Batan boilieler, haşlanmış mısır ve kaplan fıstığı ile tüm sazan avlarında kullanılır.`,
    content_en: 'Hair rig is the cornerstone of carp fishing presenting bait naturally next to the hook.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: 'r2',
    category: 'rigs',
    title_tr: 'Ronnie Rig / Spinner Rig',
    title_en: 'Ronnie Rig / Spinner Rig',
    short_desc_tr: 'Pop-up yüzen yemler için 360 derece dönebilen fırdöndülü agresif sazan rigi.',
    short_desc_en: 'Pop-up carp rig providing 360 degree rotation for aggressive hook holds.',
    content_tr: `Ronnie Rig (Spinner Rig); pop-up (dibe batmayan yüzen) boilie yemler için günümüzün en çok tercih edilen agresif sazan montajıdır.

ÇALIŞMA MANTIĞI:
İğne gözüne takılan halkalı fırdöndü (Quick Change Swivel) sayesinde iğne 360 derece serbestçe dönebilir. Balık hangi açıdan yaklaşırsa yaklaşsın iğne ucu anında aşağı döner ve alt dudağı yakalar.

AVANTAJLARI:
• İğne değişimi birkaç saniye sürer.
• Yem dipteki otların ve tortuların 2-4 cm üstünde mükemmel askıda kalır.`,
    content_en: 'Ronnie rig offers 360 rotation around a swivel for pop-up baits.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Orta'
  },
  {
    id: 'r3',
    category: 'rigs',
    title_tr: 'Chod Rig',
    title_en: 'Chod Rig',
    short_desc_tr: 'Çamurlu ve otlu zeminlerde yemin gömülmeden otların üstünde durmasını sağlayan sert pop-up rigi.',
    short_desc_en: 'Sinker-independent rig for fishing muddy and weed-covered lake bottoms.',
    content_tr: `Chod Rig; çamurlu, yosunlu ve mil kaplı göl tabanlarında kurşun çamura gömülse bile yemin lider misina üzerinde kayarak otların üstünde tertemiz durmasını sağlayan sert fluorocarbon (Mouth Trap) rigidir.

ÖZELLİKLERİ:
• Sert kavisli fluorocarbon beden kullanılır.
• Kurşun ile rig arasındaki helikopter boncuk sistemi sayesinde yem serbestçe yükselir.`,
    content_en: 'Chod rig stays on top of heavy silt and weed beds.',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'İleri'
  },
  {
    id: 'r4',
    category: 'rigs',
    title_tr: 'Snowman Rig (Kardan Adam Rig)',
    title_en: 'Snowman Rig',
    short_desc_tr: 'Batan boilie üzerine yüzen pop-up eklenerek hazırlanan nötr dengeli kardan adam yem kombinasyonu.',
    short_desc_en: 'Combination of a bottom boilie and a pop-up creating a neutral balanced snowman presentation.',
    content_tr: `Snowman Rig; dipte doğal duran batan bir boilie'nin üzerine parlak renkli yüzen bir pop-up eklenerek üst üste dizilmesiyle oluşan kardan adam yem sunumudur.

AVANTAJLARI:
Pop-up yem batan yemin ağırlığını hafiflettiği için yem su altında nötr dengeli hale gelir. Sazan yeme dokunduğu anda yem çabucak ağzına girer.`,
    content_en: 'Snowman rig balances a bottom bait with a top pop-up for easy ingestion.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: 'r5',
    category: 'rigs',
    title_tr: 'Method Feeder Hair Rig',
    title_en: 'Method Feeder Hair Rig',
    short_desc_tr: 'Feeder kafes yemliği etrafında sıkıştırılan pelet/hamur merkezinde kısa 8-10cm hızlı kanca rigi.',
    short_desc_en: 'Short hair rig embedded inside a method feeder pellet ball.',
    content_tr: `Method Feeder Rig; özel döküm yemlik kalıbı etrafına sıkıştırılan nemli pelet veya sazan hamurunun tam ortasına 8-10 cm'lik kısa hair rig yerleştirilerek hazırlanan yüksek avcılıklı sistemdir.

AVANTAJLARI:
Yemlik dibe düştüğünde hamur dağılır ve yem tam da dağılan yemin merkezinde balığa sunulur.`,
    content_en: 'Method feeder rig places the hook bait right inside the feeding spot.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },

  // ==========================================
  // KNOTS (BALIKÇILIK DÜĞÜMLERİ)
  // ==========================================
  {
    id: 'k1',
    category: 'knots',
    title_tr: 'FG Knot (İp + Fluorocarbon Lider Düğümü)',
    title_en: 'FG Knot',
    short_desc_tr: 'İp misina ile Fluorocarbon lider birleştirmede sıfır pürüzlü en güçlü düğüm.',
    short_desc_en: 'Slimmest and strongest knot for connecting braided mainline to fluorocarbon leader.',
    content_tr: `FG Knot; örgü ip misina ile kalın Fluorocarbon lideri birbirine eklemek için geliştirilmiş dünyadaki en güçlü ve en ince profilli düğümdür.

ÖZELLİKLERİ:
• Pürüzsüz yapısı sayesinde kamış fincanlarına ve porselenlerine hiç takılmadan geçer.
• Düğüm noktası esneme yapmaz ve %100 çeker gücünü korur.
• Spin, LRF ve Shore Jigging disiplinlerinin vazgeçilmez lider düğümüdür.`,
    content_en: 'FG knot binds braid around fluorocarbon with no bulky knot stack, letting it pass smoothly through rod guides.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'İleri'
  },
  {
    id: 'k2',
    category: 'knots',
    title_tr: 'Alberto Knot (Crazy Alberto Düğümü)',
    title_en: 'Alberto Knot',
    short_desc_tr: 'İp ile lider misinayı sahada çok hızlı ve pratik birleştiren yüksek dayanımlı düğüm.',
    short_desc_en: 'Fast and reliable line-to-line knot for joining braid to fluorocarbon.',
    content_tr: `Alberto Knot; rüzgarlı sahada veya gece avlarında FG Knot'a göre çok daha kısa sürede ve kolayca atılabilen güçlü bir lider düğümüdür.

NASIL ATILIR:
1. Fluorocarbon misinada bir kıvrım (halka) oluşturulur.
2. Örgü ip halkanın içinden geçirilip öne doğru 7 tur, geriye doğru 7 tur sarılarak kilitlenir.`,
    content_en: 'Alberto knot is a quick and extremely strong braid-to-leader connection.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: 'k3',
    category: 'knots',
    title_tr: 'Knotless Knot (Düğümsüz Düğüm)',
    title_en: 'Knotless Knot',
    short_desc_tr: 'Sazan balıkçılığında Hair Rig hazırlamak için kanca sapına sarılan temel sazan düğümü.',
    short_desc_en: 'Essential carp fishing knot used to create hair rigs.',
    content_tr: `Knotless Knot (Düğümsüz Düğüm); sazan iğnelerine kılı uzatarak yemi bağlamak için kullanılan en pratik montaj düğümüdür.

NASIL ATILIR:
Misina iğne gözünden arkadan öne geçirilip yem boyu (kıl) ayarlanır. Ardından iğne sapı etrafına 7-8 tur sıkıca sarılıp tekrar gözden arkadan öne doğru çıkarılarak çekilir.`,
    content_en: 'Knotless knot ties the hook while leaving a hair loop for boilies.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  },
  {
    id: 'k4',
    category: 'knots',
    title_tr: 'Palomar Knot (Palomar Düğümü)',
    title_en: 'Palomar Knot',
    short_desc_tr: 'Fırdöndü, klips ve iğnelere misina bağlamada %95+ çeker güçlü en güvenilir düğüm.',
    short_desc_en: 'Simplest and strongest knot for tying hooks, swivels, and snaps.',
    content_tr: `Palomar Knot; özellikle örgü ip misinalarda kayma yapmayan, %95 çeker mukavemeti koruyan en sağlam kanca ve klips bağlama düğümüdür.

NASIL ATILIR:
Misina ikiye katlanıp klips gözünden geçirilir. Basit bir düğüm atılıp oluşan halka klipsin üzerinden geçirilerek ıslatılır ve sıkılır.`,
    content_en: 'Palomar knot is widely considered the strongest knot for braided line.',
    image_url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },

  // ==========================================
  // LURES (SAHTE YEMLER)
  // ==========================================
  {
    id: 'l1',
    category: 'lures',
    title_tr: 'Floating & Sinking Minnow (Maket Balıklar)',
    title_en: 'Minnow Lures',
    short_desc_tr: 'Yüzey ve orta suda yaralı balık aksiyonu veren gagalı maket sahteler.',
    short_desc_en: 'Hard plastic minnows with diving lip for midwater action.',
    content_tr: `Minnow maketler; gaga yapıları sayesinde suyun direncini kullanarak sağa-sola sallanma (wobbling) ve yalpalama (rolling) aksiyonu veren en yaygın sahtelerdir.

TÜRLERİ:
• Floating (Yüzen): Sarım durduğunda su yüzeyine doğru yükselir. Sığ sularda idealdir.
• Sinking (Batan): Sarım durduğunda dibe doğru süzülür. Derin su taramasında tercih edilir.
• Suspending (Askıda Kalan): Suyun içinde nötr özgül ağırlıkta durarak dur-kalk (Jerk) aksiyonunda vuruş alır.`,
    content_en: 'Minnow lures imitate small forage fish with wobbling lip actions.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },
  {
    id: 'l2',
    category: 'lures',
    title_tr: 'Popper & WTD Stickbait (Su Üstü Sahteler)',
    title_en: 'Topwater Lures',
    short_desc_tr: 'Su yüzeyinde şapırtı ve WTD zikzağı ile avcı balıkları uyaran gürültülü sahteler.',
    short_desc_en: 'Surface splashers and zigzagging walking baits for topwater strikes.',
    content_tr: `Su üstü sahteleri; su yüzeyinde kırılma ve ses çıkararak yırtıcı balıkların hücum refleksini tetikleyen en heyecanlı sahte türüdür.

ÇEŞİTLERİ:
• Popper: Oyuk ağzı sayesinde kamış darbeleriyle "pop-pop" sesi ve su fışkırtması çıkarır.
• WTD (Walk The Dog) Stickbait: Gagası yoktur; kamış ucunun ritmik sekmesiyle su üstünde zikzak çizer.`,
    content_en: 'Topwater lures walk and splash on the surface to trigger explosive strikes.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Orta'
  },

  // ==========================================
  // TACKLES (KAMIŞ & MAKİNE)
  // ==========================================
  {
    id: 't1',
    category: 'tackles',
    title_tr: 'Spin Makinesi (Spinning Reel)',
    title_en: 'Spinning Reel',
    short_desc_tr: 'At-çek balıkçılığı için ön kalamalı, yüksek torklu standart olta makinesi.',
    short_desc_en: 'Standard front drag reel used for lure casting and active angling.',
    content_tr: `Spin makineleri; hafiflikleri, yüksek sarım kalitesi ve hassas kalama (drag) mekanizmaları ile dünyada en çok kullanılan olta makinesi türüdür.

BOYUT SEÇİMİ:
• 1000 - 2000 Kafa: LRF ve Ultra-light avlar.
• 3000 - 4000 Kafa: Spin at-çek, tatlı su levreği ve lüfer avları.
• 5000 - 6000 Kafa: Shore Jigging ve ağır kıyı avları.`,
    content_en: 'Spinning reels offer versatile performance across all freshwater and saltwater casting applications.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tüm Sular',
    difficulty_level: 'Başlangıç'
  },
  {
    id: 't2',
    category: 'tackles',
    title_tr: 'Surfcast (Big Pit) Makine',
    title_en: 'Surf Big Pit Reel',
    short_desc_tr: 'Geniş konik makaralı, 100 metre üzeri uzağa atış ve Boğaz makinesi.',
    short_desc_en: 'Long cast shallow spool reel for heavy beach and current surfcasting.',
    content_tr: `Surf makineleri (Big Pit); sığ ve geniş açılı konik misina makarası sayesinde atış esnasında ipin sürtünmesizce boşalmasını ve 100-150m mesafelere ulaşmasını sağlar. 

ÖZELLİKLERİ:
• 7000 - 10000 kafa boyutundadır.
• Ağır kurşunları akıntıdan rahat çekmek için güçlü dişli oranlarına (4.1:1 - 4.6:1) sahiptir.`,
    content_en: 'Big Pit reels feature large tapered spools engineered for extreme distance casting.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tuzlu Su',
    difficulty_level: 'Orta'
  },
  {
    id: 't3',
    category: 'tackles',
    title_tr: 'Sazan Makinesi (Baitrunner / Serbest Makara)',
    title_en: 'Carp Baitrunner Reel',
    short_desc_tr: 'Çift kalamalı, balık asıldığında misinayı boşa salan ve kol çevrilince devreye giren sazan makinesi.',
    short_desc_en: 'Dual drag free-spool reel designed specifically for static carp angling.',
    content_tr: `Sazan makineleri (Baitrunner); arkada bulunan ek bir kol yardımıyla balık yemi alıp kaçarken misinayı sıfır dirençle boşa salan özel çift kalama mekanizmasına sahiptir.

AVANTAJLARI:
Balık oltaya vurup kaçarken kamışı sehpadan suya çekemez. Kol bir tur çevrildiği anda arka kalama devreden çıkar ve ön savaş kalaması devreye girer.`,
    content_en: 'Baitrunner reels allow carp to take line freely until the angler turns the handle.',
    image_url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
    water_type: 'Tatlı Su',
    difficulty_level: 'Başlangıç'
  }
];

export default function WikiClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [articles, setArticles] = useState<any[]>(INITIAL_WIKI_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWaterType, setSelectedWaterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('wiki_articles')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setArticles(data);
        }
      } catch {
        // use fallback initial articles
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

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

  const filteredArticles = articles.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesWater = selectedWaterType === 'all' || item.water_type === 'Tüm Sular' || item.water_type === selectedWaterType;
    const matchesSearch =
      (item.title_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.short_desc_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content_tr || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesWater && matchesSearch;
  });

  const getCategoryLabel = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return isTr ? found?.label_tr : found?.label_en;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <BookOpen className="w-4 h-4" />
            <span>{isTr ? 'Oltapp Balıkçılık Akademisi' : 'Oltapp Angling Academy'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {isTr ? 'Balıkçılık Wiki & Ekipman Rehberi' : 'Angling Wiki & Equipment Guide'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {isTr
              ? 'Balıkçılık stilleri, makine/kamış seçimleri, düğüm teknikleri, sahte yem aksiyonları ve rig montajlarına dair aradığınız tüm profesyonel bilgiler.'
              : 'Complete expert guide on fishing styles, tackle choices, lure actions, knots, and rig setups.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Wiki rehberlerinde ara (Örn: LRF, Hair Rig, FG Knot, Sazan...)' : 'Search wiki guides...'}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Water Type Filter Selector */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setSelectedWaterType('all')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'all' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tüm Sular' : 'All Waters'}
            </button>
            <button
              onClick={() => setSelectedWaterType('Tuzlu Su')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'Tuzlu Su' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tuzlu Su' : 'Saltwater'}
            </button>
            <button
              onClick={() => setSelectedWaterType('Tatlı Su')}
              className={`px-3 py-2 rounded-xl transition-all ${
                selectedWaterType === 'Tatlı Su' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isTr ? 'Tatlı Su' : 'Freshwater'}
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isTr ? cat.label_tr : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-base">{isTr ? 'Aramanıza uygun rehber içeriği bulunamadı.' : 'No wiki articles found.'}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWaterType('all');
              setSearchQuery('');
            }}
            className="text-xs font-extrabold text-emerald-600 hover:underline"
          >
            {isTr ? 'Filtreleri Temizle' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => setActiveArticle(article)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cover Image & Badges */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title_tr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <BookOpen className="w-10 h-10 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-[#0F172A]/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm">
                      {article.water_type || 'Tüm Sular'}
                    </span>
                  </div>

                  {article.difficulty_level && (
                    <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-sm">
                      {article.difficulty_level}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="px-6 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    {getCategoryLabel(article.category)}
                  </span>
                  <h3 className="font-extrabold text-[#0F172A] text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {isTr ? article.title_tr : article.title_en}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {isTr ? article.short_desc_tr : article.short_desc_en}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>{isTr ? 'Rehberi İncele' : 'Read Article'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
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
                  <img src={activeArticle.image_url} alt="" className="w-full h-full object-cover" />
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
