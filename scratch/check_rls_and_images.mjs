import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAnonFetch() {
  const { data, error } = await supabase
    .from('fishes')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Anon Fetch Error:', error.message);
  } else {
    console.log(`Anon Key fetched ${data.length} fishes.`);
    data.forEach((f, i) => {
      console.log(`${i + 1}. [${f.id}] ${f.name_tr} | Image: ${f.image_url}`);
    });
  }
}

checkAnonFetch();
