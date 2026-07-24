import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function scanUserUploadsSubfolders() {
  const folders = ['', 'wiki', 'tackle', 'fishes', 'fish', 'avatars', 'spots'];

  for (const folder of folders) {
    const { data: files, error } = await supabaseAdmin.storage.from('user_uploads').list(folder, { limit: 100 });
    if (!error && files) {
      console.log(`Folder 'user_uploads/${folder}': ${files.length} files`);
      files.forEach(f => {
        const path = folder ? `${folder}/${f.name}` : f.name;
        console.log(`   - https://mrbbioabvgbutijbbcpm.supabase.co/storage/v1/object/public/user_uploads/${path}`);
      });
    }
  }
}

scanUserUploadsSubfolders();
