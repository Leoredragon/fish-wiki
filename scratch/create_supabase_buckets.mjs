import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createBuckets() {
  console.log('--- CREATING SUPABASE STORAGE BUCKETS ---');
  const bucketsToCreate = ['user_uploads', 'catch_photos', 'catches', 'stories', 'avatars', 'fish-images'];

  for (const bName of bucketsToCreate) {
    try {
      const { data, error } = await supabaseAdmin.storage.createBucket(bName, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });

      if (error) {
        if (error.message?.includes('already exists')) {
          console.log(`Bucket '${bName}' already exists.`);
        } else {
          console.error(`Error creating bucket '${bName}':`, error.message);
        }
      } else {
        console.log(`Successfully created public bucket '${bName}'!`, data);
      }
    } catch (e) {
      console.error(`Exception creating bucket '${bName}':`, e);
    }
  }
}

createBuckets();
