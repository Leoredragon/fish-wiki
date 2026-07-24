import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function checkUserUploadedFishImages() {
  const { data: fishes } = await supabaseAdmin.from('fishes').select('id, name_tr, image_url');
  if (fishes) {
    const userUploaded = fishes.filter(f => f.image_url && f.image_url.includes('user_uploads'));
    console.log(`Fishes with user_uploads URLs: ${userUploaded.length}`);
    userUploaded.forEach(f => {
      console.log(`  - ${f.name_tr}: ${f.image_url}`);
    });
  }
}

checkUserUploadedFishImages();
