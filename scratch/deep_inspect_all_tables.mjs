import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectAllTables() {
  console.log('=== DEEP INSPECTION OF ALL SUPABASE COMMUNITY & CATCH TABLES ===');

  console.log('\n--- 1. CATCHES TABLE ---');
  const { data: catches, error: cErr } = await supabase.from('catches').select('*');
  console.log('Error:', cErr ? cErr.message : 'none');
  console.log('Rows count:', catches?.length || 0);
  if (catches && catches.length > 0) {
    console.log(JSON.stringify(catches, null, 2));
  }

  console.log('\n--- 2. COMMUNITY STORIES TABLE ---');
  const { data: stories, error: sErr } = await supabase.from('community_stories').select('*');
  console.log('Error:', sErr ? sErr.message : 'none');
  console.log('Rows count:', stories?.length || 0);
  if (stories && stories.length > 0) {
    console.log(JSON.stringify(stories, null, 2));
  }

  console.log('\n--- 3. CATCH LOGS (PROFILE) TABLE ---');
  const { data: catchLogs, error: clErr } = await supabase.from('catch_logs').select('*');
  console.log('Error:', clErr ? clErr.message : 'none');
  console.log('Rows count:', catchLogs?.length || 0);
  if (catchLogs && catchLogs.length > 0) {
    console.log(JSON.stringify(catchLogs, null, 2));
  }

  console.log('\n--- 4. COMMUNITY FORUM POSTS TABLE ---');
  const { data: posts, error: pErr } = await supabase.from('community_forum_posts').select('*');
  console.log('Error:', pErr ? pErr.message : 'none');
  console.log('Rows count:', posts?.length || 0);
}

inspectAllTables();
