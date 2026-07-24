import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectStorageAndDatabase() {
  console.log('--- 1. INSPECTING SUPABASE STORAGE BUCKETS ---');
  try {
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
      console.error('Error listing buckets:', bError.message);
    } else {
      console.log('Storage Buckets found:', buckets.map(b => b.name));
      for (const bucket of buckets) {
        const { data: files, error: fError } = await supabase.storage.from(bucket.name).list('', { limit: 100 });
        if (fError) {
          console.error(`Error listing files in ${bucket.name}:`, fError.message);
        } else {
          console.log(`Bucket '${bucket.name}' files count: ${files ? files.length : 0}`);
          if (files && files.length > 0) {
            files.forEach(f => console.log(`  - ${f.name} (${f.metadata?.size || 'unknown'} bytes)`));
          }
        }
      }
    }
  } catch (err) {
    console.error('Storage inspection error:', err);
  }

  console.log('\n--- 2. INSPECTING FISHES TABLE FOR STORAGE URLS ---');
  try {
    const { data: fishes, error: fErr } = await supabase.from('fishes').select('id, name_tr, image_url, updated_at');
    if (!fErr && fishes) {
      const storageImages = fishes.filter(f => f.image_url && (f.image_url.includes('supabase') || f.image_url.includes('storage') || f.image_url.includes('blob') || !f.image_url.includes('unsplash')));
      console.log(`Fishes with non-Unsplash / uploaded images count: ${storageImages.length}`);
      storageImages.forEach(f => console.log(`  - ${f.name_tr}: ${f.image_url}`));
    }
  } catch (err) {
    console.error('Fishes table inspection error:', err);
  }
}

inspectStorageAndDatabase();
