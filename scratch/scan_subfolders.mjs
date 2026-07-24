import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function scanSubfolders() {
  console.log('Scanning sub-folders in fish-images bucket...');
  const { data, error } = await supabase.storage.from('fish-images').list('fish-images', { limit: 100 });
  if (error) {
    console.error('Error scanning fish-images/fish-images:', error.message);
  } else {
    console.log(`Found ${data ? data.length : 0} files in fish-images/fish-images/ sub-folder!`);
    if (data && data.length > 0) {
      data.forEach(f => {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/fish-images/fish-images/${f.name}`;
        console.log(`  File: ${f.name} -> ${publicUrl}`);
      });
    }
  }
}

scanSubfolders();
