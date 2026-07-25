import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const articles = JSON.parse(fs.readFileSync('scratch/all_supabase_wiki_articles.json', 'utf-8'));

// Helper to escape single quotes in SQL string literals
function esc(str) {
  if (!str) return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

const mappings = {
  // Category fixes
  "FG Knot (Lider Düğümü)": { category: "knots" },
  "Palomar Düğümü": { category: "knots" },
  "Specialty Tungsten Sinkers": { category: "tackles" },
};

// Map of refined titles and contents
const updates = articles.map(art => {
  let cat = art.category;
  let title_tr = art.title_tr;
  let title_en = art.title_en;
  let short_desc_tr = art.short_desc_tr;
  let short_desc_en = art.short_desc_en;
  let content_tr = art.content_tr;
  let content_en = art.content_en;
  let water_type = art.water_type || 'Tüm Sular';
  let difficulty_level = art.difficulty_level || 'Orta';

  // 1. CATEGORY FIXES
  if (art.title_tr.includes('FG Knot')) cat = 'knots';
  if (art.title_tr.includes('Palomar')) cat = 'knots';
  if (art.title_tr.includes('Tungsten Sinkers')) cat = 'tackles';

  // 2. TITLE TR FIXES (Pure English to proper Turkish Angling Terminology)
  if (title_tr === 'Fly Fishing') {
    title_tr = 'Fly Fishing (Sinek / Kamçı Balıkçılığı)';
  } else if (title_tr === 'Albright Knot') {
    title_tr = 'Albright Düğümü';
  } else if (title_tr === 'Blood Knot') {
    title_tr = 'Kan Düğümü (Blood Knot)';
  } else if (title_tr === 'Improved Clinch Knot') {
    title_tr = 'Gelişmiş Clinch Düğümü';
  } else if (title_tr === 'Snell Knot') {
    title_tr = 'Snell Düğümü (İğne Bağlama)';
  } else if (title_tr === 'Uni Knot (Hang‑Knot)') {
    title_tr = 'Uni Düğümü (Tekli ve Çiftli Uni)';
  } else if (title_tr === 'Stainless Steel Leader') {
    title_tr = 'Paslanmaz Çelik Tel Lider';
  } else if (title_tr === 'Kevlar Leader') {
    title_tr = 'Kevlar Lider Misina';
  } else if (title_tr === 'Specialty Tungsten Sinkers') {
    title_tr = 'Özel Tungsten Ağırlıklar & Kurşunlar';
    title_en = 'Specialty Tungsten Sinkers';
  } else if (title_tr === 'Fluorocarbon Kaplı Misina') {
    title_tr = 'Fluorocarbon Kaplı Örgü İp Misina';
  } else if (title_tr === 'Buzzbait (Vibrating Topwater)') {
    title_tr = 'Buzzbait (Pervaneli Su Üstü Yemi)';
  } else if (title_tr === 'Metal Spoon (Plated)') {
    title_tr = 'Metal Kaşık Sahte Yem';
    title_en = 'Plated Metal Spoon';
  } else if (title_tr === 'Worm (Soft Plastic)') {
    title_tr = 'Silikon Solucan (Soft Worm)';
    title_en = 'Soft Plastic Worm';
  } else if (title_tr === 'Swimbait (Soft Body)') {
    title_tr = 'Swimbait (Yumuşak Gövdeli Balık Sahtesi)';
  } else if (title_tr === 'Metal Jig (Heavy Metal)') {
    title_tr = 'Ağır Metal Jig (Heavy Jig)';
  } else if (title_tr === 'Jigging Rig (Heavy Jig)') {
    title_tr = 'Jigging Takımı (Heavy Jig Rig)';
  } else if (title_tr === 'Bobber Rig (Standard Float)') {
    title_tr = 'Standart Şamandıralı Takım (Bobber Rig)';
  } else if (title_tr === 'Lead‑Core (Tuna) Rig') {
    title_tr = 'Kurşun Özlü Orkinos Takımı (Lead-Core Rig)';
  } else if (title_tr === 'Carolina Rig') {
    title_tr = 'Carolina Takımı (Carolina Rig)';
  } else if (title_tr === 'Texas Rig') {
    title_tr = 'Texas Takımı (Texas Rig)';
  } else if (title_tr === 'Hybrid Drop‑Shot / Float Rig') {
    title_tr = 'Hibrit Drop-Shot & Şamandıra Takımı';
  } else if (title_tr === 'Drop Shot Rig') {
    title_tr = 'Drop Shot Takımı';
  } else if (title_tr === 'Pyramid & Split‑Shot Sinkers') {
    title_tr = 'Piramit & Sıkıştırma Kurşunlar';
  } else if (title_tr === 'Standard J‑Hook') {
    title_tr = 'Standart J-İğne (J-Hook)';
  } else if (title_tr === 'Rod Pod / Tripod') {
    title_tr = 'Kamış Sehpası (Rod Pod / Tripod)';
  } else if (title_tr === 'LED Light / Glow Stick') {
    title_tr = 'Işıldak & LED Aydınlatma (Glow Stick)';
  } else if (title_tr === 'Pliers / Scissors') {
    title_tr = 'Balıkçı Pensi & Misina Makası';
  } else if (title_tr === 'Fly Reel (Multiplik)') {
    title_tr = 'Fly Çıkrık Makinesi';
  } else if (title_tr === 'Bite Alarm (İsırma Alarmı)') {
    title_tr = 'Elektronik Vuruş Alarmı (Bite Alarm)';
  }

  // 3. INCOMPLETE CONTENT FIXES
  if (title_tr.includes('Hair Rig')) {
    short_desc_tr = "Yemi iğneden bağımsız kıl misinaya dizerek sazanın yemi tereddütsüz emmesini sağlayan efsanevi montaj.";
    short_desc_en = "Classic carp hair rig layout separating the bait from the hook for natural suction.";
    content_tr = `Hair Rig; sazan balıkçılığında devrim yaratmış efsanevi bir montajdır. Yem (boili, mısır veya pelet) doğrudan kancaya takılmak yerine, kancanın altından sarkan ince ip (kıl) üzerine dizilir.

ÇALIŞMA PRENSİBİ:
Sazan yemlenirken şüpheci bir şekilde yemi emer. Kanca boşta olduğu için balığın ağzına takılmadan doğal şekilde içeri girer. Balık yemi tükürmeye çalıştığında kanca alt dudağa saplanır.

EKİPMAN VE MONTAJ:
• İğne: Wide Gape veya Curve Shank #4 - #8 boy sazan iğnesi.
• Kıl Misinası: Yumuşak örgülü kaplamasız rig ipi.
• Stoper: Boili stoperi ile yem sabitlenir.
• Ideal Kullanım: Tatlı su göl ve barajlarında boili ve mısır ile sazan avı.`;
    content_en = `The Hair Rig is a revolutionary carp fishing rig where the bait (boilie, corn, or pellet) is threaded onto a small piece of braid (the hair) hanging below the hook rather than attached directly to it.

HOW IT WORKS:
Carp feed by sucking in debris and food. Because the hook is completely exposed and free of bait, it glides into the carp's mouth unnoticed. When the fish tries to eject the bait, the hook catches the bottom lip cleanly.

KEY COMPONENTS:
• Hook: Wide Gape or Curve Shank #4 to #8 carp hook.
• Hair Material: Soft braided hooklink material.
• Bait Stop: Plastic boilie stop to secure the bait.
• Best For: Carp angling in lakes and reservoirs using boilies or corn.`;
  }

  if (title_tr.includes('Ronnie Rig')) {
    short_desc_tr = "Pop-up (yüzen) yemlerin dip yosunlarından yukarıda 360 derece serbest dönerek mükemmel saplanmasını sağlayan modern sazan rigi.";
    short_desc_en = "Modern 360-degree rotating pop-up carp rig for supreme hook holds above debris.";
    content_tr = `Ronnie Rig (Spinner Rig); pop-up (yüzen) yemlerin dipteki çamur ve yosun katmanının 2-4 cm üzerinde kusursuz bir şekilde durmasını sağlayan en popüler agresif sazan donanımıdır.

AVANTAJLARI:
1. 360 Derece Dönüş: Fırdöndü sayesinde kanca her yönden gelen balığa karşı anında döner ve saplanır.
2. Çabuk Değişim: Kanca körelirse fırdöndü halkasından saniyeler içinde değiştirilebilir.
3. Temiz Sunum: Dipteki mil ve ot tabakasının üzerinde yemi görünür kılar.

KURULUM:
• Kanca: Curve Shank sazan iğnesi (#4 - #6).
• Bağlantı: QC Ring Swivel (Hızlı değişim fırdöndüsü) ve daralan makaron (Shrink Tube).
• Yem: 12-15 mm renkli ve aromalı Pop-Up boili.`;
    content_en = `The Ronnie Rig (also known as the Spinner Rig) is one of the most effective modern carp rigs designed specifically for pop-up baits, keeping them popped up 2-4 cm above lakebed debris.

ADVANTAGES:
1. 360-Degree Rotation: The hook rotates freely in all directions, ensuring quick lip hooked fish.
2. Fast Hook Changes: Uses a quick-change swivel so damaged hooks can be replaced in seconds.
3. Clean Presentation: Keeps the pop-up elevated above silt and weed.

COMPONENTS:
• Hook: Curve Shank carp hook (#4 - #6).
• Connection: Quick Change (QC) Ring Swivel with shrink tubing over the eye.
• Bait: 12-15 mm high-attract pop-up boilie.`;
  }

  return {
    id: art.id,
    category: cat,
    title_tr,
    title_en,
    short_desc_tr,
    short_desc_en,
    content_tr,
    content_en,
    water_type,
    difficulty_level
  };
});

// Build SQL update queries
let sqlOutput = `-- =============================================================
-- OLTAAPP – TÜM WIKI MAKALELERİ GÜNCELLEME VE AUDIT SCRIPT
-- Bu script, public.wiki_articles tablosundaki tüm 61 kaydı günceller.
-- ÖNEMLİ: Mevcut image_url sütunu SET kelimesine DAHİL EDİLMEMİŞTİR.
-- Böylece veritabanındaki hiçbir resim URL'si silinmez veya ezilmez!
-- =============================================================\n\n`;

updates.forEach(u => {
  sqlOutput += `UPDATE "public"."wiki_articles" SET
  "category" = ${esc(u.category)},
  "title_tr" = ${esc(u.title_tr)},
  "title_en" = ${esc(u.title_en)},
  "short_desc_tr" = ${esc(u.short_desc_tr)},
  "short_desc_en" = ${esc(u.short_desc_en)},
  "content_tr" = ${esc(u.content_tr)},
  "content_en" = ${esc(u.content_en)},
  "water_type" = ${esc(u.water_type)},
  "difficulty_level" = ${esc(u.difficulty_level)}
WHERE "id" = '${u.id}';\n\n`;
});

fs.writeFileSync('scratch/update_all_wiki_articles_safe.sql', sqlOutput, 'utf-8');
console.log(`Generated ${updates.length} safe UPDATE statements in scratch/update_all_wiki_articles_safe.sql`);
