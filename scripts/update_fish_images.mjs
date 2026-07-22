import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env vars
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=').trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Anon Key missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Studio & Clean background image map for species
const FISH_IMAGES = {
  'Deniz Levreği': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Çupra (Çipura)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Lüfer': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Abant Alası': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Tatlı Su Kefali': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Tatlı Su Kefali (Kasna)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Aynalı Sazan': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=1200&q=80',
  'Akya': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Alabalık (Gökkuşağı)': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Barbunya': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Bıyıklı Balık': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=1200&q=80',
  'Çapak Balığı': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=1200&q=80',
  'Çizgili Mercan (Mırmır)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Dil Balığı': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Eşkina': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Fener Balığı': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Gümüş Balığı': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Hamsi': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'İstavrit': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Kalkan': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Kızılkanat': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Kefal (Has Kefal)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Lagos (Kumlagosu)': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Mercan (Kırmızı Mercan)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Orkinos (Mavi Kanat)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Palamut': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Sargoz (Karagöz)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Sinarit': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Sudak (Uzun Levrek)': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
  'Trança': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'Turna': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  'Uskumru': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  'Yayın Balığı': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=1200&q=80',
  'Zargana': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80'
};

async function updateImages() {
  console.log('🖼️ Supabase Balık Görselleri Otomatik Güncelleniyor...');

  const { data: fishes, error } = await supabase.from('fishes').select('id, name_tr');

  if (error || !fishes) {
    console.error('❌ Balıklar çekilemedi:', error?.message);
    return;
  }

  let updatedCount = 0;

  for (const fish of fishes) {
    const imageUrl = FISHES_IMAGE_LOOKUP(fish.name_tr);
    if (imageUrl) {
      const { error: updateErr } = await supabase
        .from('fishes')
        .update({ image_url: imageUrl })
        .eq('id', fish.id);

      if (!updateErr) {
        console.log(`✅ ${fish.name_tr} -> Görsel atandı.`);
        updatedCount++;
      }
    }
  }

  console.log(`🎉 Toplam ${updatedCount} adet balık görseli Supabase veritabanında güncellendi!`);
}

function FISHES_IMAGE_LOOKUP(nameTr) {
  if (FISH_IMAGES[nameTr]) return FISH_IMAGES[nameTr];
  for (const key of Object.keys(FISH_IMAGES)) {
    if (nameTr.includes(key) || key.includes(nameTr)) {
      return FISH_IMAGES[key];
    }
  }
  return 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80';
}

updateImages();
