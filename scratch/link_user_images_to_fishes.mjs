import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function inspectUserUploadsDetails() {
  console.log('--- ALL STORAGE FILES IN USER_UPLOADS ---');

  // Let's get files from storage root and user folders
  const { data: userFolders } = await supabaseAdmin.storage.from('user_uploads').list('', { limit: 100 });
  
  for (const folder of userFolders) {
    if (folder.id) {
      console.log(`Root file: https://mrbbioabvgbutijbbcpm.supabase.co/storage/v1/object/public/user_uploads/${folder.name}`);
    } else {
      const { data: subFiles } = await supabaseAdmin.storage.from('user_uploads').list(folder.name, { limit: 100 });
      if (subFiles) {
        subFiles.forEach(sf => {
          console.log(`Folder [${folder.name}] -> https://mrbbioabvgbutijbbcpm.supabase.co/storage/v1/object/public/user_uploads/${folder.name}/${sf.name}`);
        });
      }
    }
  }
}

inspectUserUploadsDetails();
