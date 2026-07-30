#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.STORAGE_BUCKET || 'user_uploads';
const APPLY = process.argv.includes('--apply');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const URL_MARKER = '/storage/v1/object/public/user_uploads/';

function extractStoragePath(url) {
  if (!url || typeof url !== 'string') return null;
  const idx = url.indexOf(URL_MARKER);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + URL_MARKER.length));
}

async function collectReferencedPaths() {
  const refs = new Set();
  const sources = [
    { table: 'fishes', column: 'image_url' },
    { table: 'wiki_articles', column: 'image_url' },
    { table: 'catch_logs', column: 'image_url' },
    { table: 'fishing_spots', column: 'image_url' },
    { table: 'community_marketplace_items', column: 'image_url' },
    { table: 'community_tips', column: 'image_url' },
    { table: 'profiles', column: 'avatar_url' }
  ];

  for (const src of sources) {
    const { data, error } = await supabase.from(src.table).select(src.column);
    if (error) {
      console.warn(`Skip ${src.table}.${src.column}: ${error.message}`);
      continue;
    }
    for (const row of data || []) {
      const p = extractStoragePath(row[src.column]);
      if (p) refs.add(p);
    }
  }

  return refs;
}

async function listFolderFiles(folderPath) {
  const files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(folderPath, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' }
    });

    if (error) throw new Error(`List failed at "${folderPath}": ${error.message}`);
    if (!data || data.length === 0) break;

    for (const item of data) {
      const isFile = Boolean(item.id);
      if (!isFile) continue;
      const path = folderPath ? `${folderPath}/${item.name}` : item.name;
      const size = Number(item.metadata?.size || 0);
      files.push({ path, size });
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return files;
}

async function listAllFilesInBucket() {
  const files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' }
    });
    if (error) throw new Error(`Root list failed: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const item of data) {
      const isFile = Boolean(item.id);
      if (isFile) {
        files.push({ path: item.name, size: Number(item.metadata?.size || 0) });
        continue;
      }
      const nested = await listFolderFiles(item.name);
      files.push(...nested);
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return files;
}

function formatMb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

async function deleteInBatches(paths, batchSize = 100) {
  let deleted = 0;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const { error } = await supabase.storage.from(BUCKET).remove(batch);
    if (error) throw new Error(`Delete batch failed: ${error.message}`);
    deleted += batch.length;
    console.log(`Deleted ${deleted}/${paths.length}`);
  }
}

async function main() {
  console.log(`Bucket: ${BUCKET}`);
  console.log('Collecting DB references...');
  const refs = await collectReferencedPaths();
  console.log(`Referenced paths: ${refs.size}`);

  console.log('Listing bucket files...');
  const files = await listAllFilesInBucket();
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`Bucket files: ${files.length} (${formatMb(totalBytes)} MB)`);

  const orphans = files.filter((f) => !refs.has(f.path));
  const orphanBytes = orphans.reduce((sum, f) => sum + f.size, 0);

  console.log(`Orphans found: ${orphans.length} (${formatMb(orphanBytes)} MB)`);
  if (orphans.length === 0) return;

  const preview = [...orphans].sort((a, b) => b.size - a.size).slice(0, 20);
  console.log('\nTop 20 largest orphans:');
  preview.forEach((f, idx) => {
    console.log(`${String(idx + 1).padStart(2, '0')}. ${formatMb(f.size)} MB  ${f.path}`);
  });

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to delete.');
    return;
  }

  console.log('\nDeleting orphans...');
  await deleteInBatches(orphans.map((o) => o.path), 100);
  console.log(`Done. Deleted ${orphans.length} files (${formatMb(orphanBytes)} MB).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
