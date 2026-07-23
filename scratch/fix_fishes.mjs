import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixFishes() {
  console.log('1. Checking and removing duplicates...');
  
  // Clean duplicates for Kızılkanat
  const { data: kizilkanatList } = await supabase.from('fishes').select('id').eq('name_tr', 'Kızılkanat');
  if (kizilkanatList && kizilkanatList.length > 1) {
    // Keep first, delete rest
    const toDelete = kizilkanatList.slice(1).map(f => f.id);
    await supabase.from('fishes').delete().in('id', toDelete);
    console.log(`Removed ${toDelete.length} duplicate Kızılkanat entries.`);
  }

  // Clean duplicates for Yılan Balığı
  const { data: yilanList } = await supabase.from('fishes').select('id').eq('name_tr', 'Yılan Balığı');
  if (yilanList && yilanList.length > 1) {
    const toDelete = yilanList.slice(1).map(f => f.id);
    await supabase.from('fishes').delete().in('id', toDelete);
    console.log(`Removed ${toDelete.length} duplicate Yılan Balığı entries.`);
  }

  // Check if Pullu Sazan exists, if not add it
  const { data: sazan } = await supabase.from('fishes').select('id').eq('name_tr', 'Pullu Sazan');
  if (!sazan || sazan.length === 0) {
    console.log('2. Adding Pullu Sazan...');
    const pulluSazan = {
      name_tr: 'Pullu Sazan',
      name_en: 'Common Carp',
      scientific_name: 'Cyprinus carpio',
      water_type: 'Tatlı Su',
      short_info_tr: 'Tatlı sularımızın en yaygın, güçlü ve iri pullarla kaplı ana sazan türü.',
      short_info_en: 'The most widespread native carp species with fully scaled body.',
      limit_size: 'Asgari 40 cm',
      ban_periods: '15 Mart - 15 Haziran (İç sular genel av yasağı)',
      active_seasons: 'İlkbahar, Yaz, Sonbahar',
      recommended_gear: 'Sazan Montajı (Hair Rig), Ağır Dip Takımı',
      favorite_baits: 'Boilie, Haşlanmış Mısır, Kaplan Fıstığı, Solucan',
      primary_regions: 'Tüm baraj gölleri, göller ve yavaş akan nehirler',
      taste_rating: '4/5 Yıldız - Yağlı ve Doyurucu Et',
      cooking_tips_tr: 'Fırında sebzelerle doldurularak veya dilimlenip kızartılır.',
      cooking_tips_en: 'Stuffed with fresh vegetables and baked or sliced and fried.',
      description_tr: 'Tatlı suların en efsanevi dip balıklarından biridir. Güçlü kuyruk yapısı sayesinde dip oltasına takıldığında yorucu ve heyecanlı bir mücadele sunar.',
      description_en: 'One of the most famous freshwater bottom dwellers, renowned for its strength.',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      is_active: true
    };

    const { error } = await supabase.from('fishes').insert([pulluSazan]);
    if (error) console.error('Error adding Pullu Sazan:', error.message);
    else console.log('Successfully added Pullu Sazan!');
  } else {
    console.log('Pullu Sazan already exists.');
  }

  // Print final count
  const { data: countData } = await supabase.from('fishes').select('id');
  console.log(`\nFINAL UNIQUE FISH COUNT IN SUPABASE: ${countData?.length}`);
}

fixFishes();
