import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrbbioabvgbutijbbcpm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_cmyEJsJZk-PuBt6FQDGbsg_vjtMKGz6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Fish {
  id?: string;
  name_tr: string;
  name_en: string;
  scientific_name?: string | null;
  water_type?: string | null;
  active_seasons?: string | null;
  recommended_gear?: string | null;
  description_tr?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  created_at?: string;
}
