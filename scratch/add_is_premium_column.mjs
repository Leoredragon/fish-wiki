import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndTestProfiles() {
  console.log('Checking profiles columns...');
  const { data, error } = await supabase.from('profiles').select('*').limit(3);
  console.log('Profiles sample:', data, 'Error:', error);
}

checkAndTestProfiles();
