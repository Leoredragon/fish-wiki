import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function checkHistory() {
  console.log("Checking for any history or audit tables...");
  
  // Try to query postgres metadata for tables
  const { data, error } = await supabaseAdmin.rpc('get_tables_info').catch(() => ({ error: { message: 'RPC not found' } }));
  
  if (error) {
     // Alternative: Just query a known common history table name
     const { data: audit, error: auditErr } = await supabaseAdmin.from('audit_logs').select('*').limit(5);
     console.log('audit_logs table:', auditErr ? auditErr.message : 'Exists');
  } else {
     console.log('Tables:', data);
  }
}

checkHistory();
