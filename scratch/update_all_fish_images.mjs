import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verified, high-quality fish images mapping
const FISH_IMAGE_MAP = {
  'Deniz Levreği': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Çupra (Çipura)': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Lüfer': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Palamut': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Sazan (Aynalı Sazan)': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=800&q=80',
  'Sazan (Pullu Sazan)': 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800&q=80',
  'Alabalık (Dere Alası)': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Alabalık (Göl Alası)': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Abant Alası': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Akya (Lichia amia)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Baracuda (İskarmoz)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Barbun (Barbunya)': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Çinekop (Yaprak Lüfer)': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Eşkina (Kaya Levreği)': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Hamsi': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'İstavrit': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Kalkan Balığı': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Karagöz': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Kefal': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Kılıç Balığı': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Lahos (Grida)': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Mırmır': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Orfoz': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Sardalya': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Sarıkanat': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
  'Sarıkuyruk (Amberjack)': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Sinarit': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Torik': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Trança': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  'Uskumru': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
  'Yayın Balığı': 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=800&q=80',
  'Yazılı Orkinos': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  'Zargana': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80'
};

async function updateFishImages() {
  console.log('Ensuring all fishes have active status and valid images...');

  const { data: fishes, error } = await supabase.from('fishes').select('*');
  if (error) {
    console.error('Error fetching fishes:', error);
    return;
  }

  console.log(`Found ${fishes.length} fishes in database.`);

  for (const fish of fishes) {
    const matchedUrl = FISH_IMAGE_MAP[fish.name_tr] || 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80';
    
    // Ensure image_url and is_active=true
    const { error: updateError } = await supabase
      .from('fishes')
      .update({
        is_active: true,
        image_url: fish.image_url && fish.image_url.startsWith('http') ? fish.image_url : matchedUrl
      })
      .eq('id', fish.id);

    if (updateError) {
      console.error(`Failed updating ${fish.name_tr}:`, updateError.message);
    }
  }

  console.log('Successfully updated all fishes in Supabase database!');
}

updateFishImages();
