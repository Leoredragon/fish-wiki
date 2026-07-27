import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCommentsAndLikes() {
  console.log('=== TESTING CATCH_COMMENTS & CATCH_LIKES TABLES ===');

  const { data: cData, error: cErr } = await supabase.from('catch_comments').select('*').limit(5);
  console.log('catch_comments query:', { count: cData?.length || 0, error: cErr?.message });

  const { data: lData, error: lErr } = await supabase.from('catch_likes').select('*').limit(5);
  console.log('catch_likes query:', { count: lData?.length || 0, error: lErr?.message });
}

testCommentsAndLikes();
