import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function checkAbantAlasi() {
  const { data, error } = await supabaseAdmin
    .from('fishes')
    .select('name_tr, image_url')
    .eq('name_tr', 'Abant Alası');

  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log(data);
  }
}

checkAbantAlasi();
