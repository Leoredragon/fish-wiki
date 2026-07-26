import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function runSetup() {
  console.log('--- CREATING MISSING COMMUNITY TABLES IN SUPABASE ---');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.catches (
      id TEXT PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      image_url TEXT,
      weight NUMERIC,
      length NUMERIC,
      location_note TEXT,
      lure_used TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ALTER TABLE public.catches ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public catches select" ON public.catches FOR SELECT USING (true);
    CREATE POLICY "Public catches insert" ON public.catches FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public catches delete" ON public.catches FOR DELETE USING (true);

    CREATE TABLE IF NOT EXISTS public.community_stories (
      id TEXT PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      image_url TEXT,
      location_note TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public stories select" ON public.community_stories FOR SELECT USING (true);
    CREATE POLICY "Public stories insert" ON public.community_stories FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public stories delete" ON public.community_stories FOR DELETE USING (true);
  `;

  console.log('Executing via RPC or SQL...');
  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.log('RPC exec_sql not available, please run in SQL Editor:', error.message);
    } else {
      console.log('Tables created successfully!', data);
    }
  } catch (err) {
    console.error('Exec err:', err);
  }
}

runSetup();
