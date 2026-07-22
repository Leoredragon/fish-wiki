import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  envFile
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=').trim()];
    })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Anon Key missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importFishes() {
  console.log('🚀 Supabase Toplu Balık Verisi İçeri Aktarma Başlatılıyor...');

  const filePath = path.join(process.cwd(), 'fishes_seed.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Dosya bulunamadı: ${filePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  const fishes = JSON.parse(rawData);

  console.log(`📋 Toplam ${fishes.length} adet balık kaydı okundu. Veritabanına aktarılıyor...`);

  const { data, error } = await supabase
    .from('fishes')
    .insert(fishes)
    .select();

  if (error) {
    console.error('❌ Aktarım sırasında hata oluştu:', error.message);
  } else {
    console.log(`✅ Başarılı! ${data.length} adet balık türü Supabase veritabanına eklendi.`);
  }
}

importFishes();
