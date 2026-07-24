import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Service Role Key');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function deepScanStorage() {
  console.log('=== DEEP RECOVERY: SCANNING ALL SUPABASE STORAGE BUCKETS & RECURSIVE SUBDIRECTORIES ===');

  const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets();
  if (bErr) {
    console.error('Error listing buckets:', bErr);
    return;
  }

  console.log('Buckets list:', buckets.map(b => b.name));

  const allFiles = [];

  for (const bucket of buckets) {
    console.log(`\n--- Scanning Bucket: '${bucket.name}' ---`);

    // Helper function to scan directory recursively
    async function scanDir(path = '') {
      const { data: items, error } = await supabaseAdmin.storage.from(bucket.name).list(path, { limit: 1000 });
      if (error) {
        console.error(`Error scanning ${bucket.name}/${path}:`, error.message);
        return;
      }

      if (!items || items.length === 0) return;

      for (const item of items) {
        const itemPath = path ? `${path}/${item.name}` : item.name;
        // If metadata is null or size is 0 and no mimeType, it might be a subfolder
        if (!item.id && (!item.metadata || Object.keys(item.metadata).length === 0)) {
          // Subfolder
          await scanDir(itemPath);
        } else {
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket.name}/${itemPath}`;
          allFiles.push({
            bucket: bucket.name,
            path: itemPath,
            url: publicUrl,
            name: item.name,
            created_at: item.created_at,
            size: item.metadata?.size
          });
        }
      }
    }

    await scanDir('');
  }

  console.log(`\n=== TOTAL FILES FOUND ACROSS ALL STORAGE BUCKETS: ${allFiles.length} ===`);
  allFiles.forEach((file, index) => {
    console.log(`${index + 1}. [${file.bucket}] ${file.path} (${file.size || 'N/A'} bytes) -> ${file.url}`);
  });

  return allFiles;
}

deepScanStorage();
