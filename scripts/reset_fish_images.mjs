import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

async function resetImages() {
  console.log('🧹 Yanlış görseller sıfırlanıyor (image_url = null yapılıyor)...');

  const { error } = await supabase
    .from('fishes')
    .update({ image_url: null })
    .not('id', 'is', null);

  if (error) {
    console.error('❌ Sıfırlama hatası:', error.message);
  } else {
    console.log('✅ Supabase üzerindeki tüm balık görselleri başarıyla sıfırlandı (null yapıldı).');
  }
}

resetImages();
