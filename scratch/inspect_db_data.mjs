import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('--- CHECKING SUPABASE TABLES DATA ---');
  const { data: catches } = await supabase.from('catches').select('id, location_note, created_at');
  console.log('Catches count in DB:', catches?.length || 0, catches);

  const { data: stories } = await supabase.from('community_stories').select('id, user_id, created_at');
  console.log('Stories count in DB:', stories?.length || 0, stories);

  const { data: catchLogs } = await supabase.from('catch_logs').select('id, location_note, created_at');
  console.log('Catch Logs (Profile) count in DB:', catchLogs?.length || 0, catchLogs);
}

checkTables();
