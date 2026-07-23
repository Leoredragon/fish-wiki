import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFishes() {
  const { data, error } = await supabase
    .from('fishes')
    .select('id, name_tr, name_en, water_type')
    .order('name_tr', { ascending: true });

  if (error) {
    console.error('Error fetching fishes:', error.message);
    return;
  }

  console.log(`TOTAL FISHES IN SUPABASE: ${data.length}`);
  console.log('--- FISH LIST ---');
  data.forEach((f, i) => {
    console.log(`${i + 1}. ${f.name_tr} (${f.name_en}) - [${f.water_type}]`);
  });
}

checkFishes();
