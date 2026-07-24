import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Service Role Key!');
  process.exit(1);
}

// Create admin client with full service role permissions
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function findUploadedFilesAndRestore() {
  console.log('--- ADMIN STORAGE SCAN ---');
  const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets();
  
  if (bErr) {
    console.error('Error listing buckets:', bErr);
    return;
  }

  console.log('Buckets:', buckets.map(b => b.name));

  let foundStorageFiles = [];

  for (const b of buckets) {
    console.log(`Scanning bucket: '${b.name}'...`);
    const { data: files, error: fErr } = await supabaseAdmin.storage.from(b.name).list('', { limit: 1000 });
    if (fErr) {
      console.error(`Error listing ${b.name}:`, fErr.message);
    } else if (files && files.length > 0) {
      console.log(`FOUND ${files.length} files in bucket '${b.name}':`);
      files.forEach(f => {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${b.name}/${f.name}`;
        console.log(`  File: ${f.name} -> ${publicUrl}`);
        foundStorageFiles.push({ bucket: b.name, name: f.name, url: publicUrl, created_at: f.created_at });
      });
    }
  }

  // Also check if any files exist in subfolders
  for (const b of buckets) {
    const { data: subData } = await supabaseAdmin.storage.from(b.name).list('fish-images', { limit: 1000 });
    if (subData && subData.length > 0) {
      console.log(`FOUND ${subData.length} files in ${b.name}/fish-images/:`);
      subData.forEach(f => {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${b.name}/fish-images/${f.name}`;
        console.log(`  Subfile: ${f.name} -> ${publicUrl}`);
        foundStorageFiles.push({ bucket: b.name, name: f.name, url: publicUrl, created_at: f.created_at });
      });
    }
  }

  console.log(`\nTOTAL RESTORABLE FILES IN STORAGE: ${foundStorageFiles.length}`);
}

findUploadedFilesAndRestore();
