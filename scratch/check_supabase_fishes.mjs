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

async function checkFishes() {
  const { data, error } = await supabase
    .from('fishes')
    .select('id, name_tr, image_url, is_active, water_type');

  if (error) {
    console.error('Supabase query error:', error);
  } else {
    console.log(`Total rows in Supabase fishes table: ${data ? data.length : 0}`);
    if (data && data.length > 0) {
      console.log('Sample rows:');
      data.slice(0, 15).forEach((f, i) => {
        console.log(`${i+1}. ${f.name_tr} | is_active: ${f.is_active} | image: ${f.image_url}`);
      });
    }
  }
}

checkFishes();
