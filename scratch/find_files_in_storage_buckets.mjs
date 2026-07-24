import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET_NAMES = [
  'fish-images',
  'fishes',
  'wiki-images',
  'wiki',
  'images',
  'uploads',
  'catch-photos',
  'public'
];

async function scanBuckets() {
  console.log('Scanning Supabase Storage buckets for user uploaded fish files...');

  for (const bucketName of BUCKET_NAMES) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 100 });
      if (error) {
        console.log(`Bucket '${bucketName}': error / not public / missing (${error.message})`);
      } else {
        console.log(`>>> BUCKET '${bucketName}' HAS ${data ? data.length : 0} FILES! <<<`);
        if (data && data.length > 0) {
          data.forEach((file) => {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${file.name}`;
            console.log(`   File: ${file.name} -> ${publicUrl}`);
          });
        }
      }
    } catch (e) {
      console.log(`Error scanning ${bucketName}:`, e.message);
    }
  }
}

scanBuckets();
