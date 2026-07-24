import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function inspectWikiArticles() {
  const { data: articles, error } = await supabaseAdmin.from('wiki_articles').select('id, title_tr, image_url, created_at');
  if (error) {
    console.error('Error fetching wiki_articles:', error.message);
  } else {
    console.log(`TOTAL WIKI ARTICLES IN SUPABASE: ${articles.length}`);
    articles.forEach((a, i) => {
      console.log(`${i+1}. ${a.title_tr} -> ${a.image_url}`);
    });
  }
}

inspectWikiArticles();
