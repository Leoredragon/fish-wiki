import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
  const { data, error } = await supabaseAdmin.from('wiki_articles').select('id').limit(1).catch(() => ({error: {message: 'No wiki_articles'}}));
  console.log('wiki_articles:', error ? error.message : 'Exists');
  
  const { data: d2, error: e2 } = await supabaseAdmin.from('fishes').select('id').limit(1).catch(() => ({error: {message: 'No fishes'}}));
  console.log('fishes:', e2 ? e2.message : 'Exists');
}
listTables();
