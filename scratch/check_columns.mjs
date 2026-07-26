import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('=== TESTING INSERT INTO CATCHES & STORIES ===');

  // Test catches insert
  const catchId = `test-${Date.now()}`;
  const { data: cData, error: cErr } = await supabase.from('catches').insert({
    id: catchId,
    image_url: 'https://via.placeholder.com/150',
    location_note: 'Test Location'
  }).select();

  console.log('Catches insert test result:', { data: cData, error: cErr?.message });

  // Test stories insert
  const storyId = `test-s-${Date.now()}`;
  const { data: sData, error: sErr } = await supabase.from('community_stories').insert({
    id: storyId,
    image_url: 'https://via.placeholder.com/150',
    caption: 'Test Caption'
  }).select();

  console.log('Stories insert test result:', { data: sData, error: sErr?.message });
}

testInsert();
