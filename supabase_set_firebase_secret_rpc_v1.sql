-- One-time setter for the Firebase service account secret.
-- Run this in the Supabase Dashboard SQL Editor, then the local script
-- (scripts/upload-firebase-secret.mjs) will call it with the actual key.
-- Only service_role can execute it; drop it afterwards if you like:
--   drop function public.set_firebase_service_account(text);

create or replace function public.set_firebase_service_account(p_json text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- sanity check: must look like a Firebase service account JSON
  if (p_json::jsonb ->> 'project_id') is null
     or (p_json::jsonb ->> 'private_key') is null
     or (p_json::jsonb ->> 'client_email') is null then
    raise exception 'invalid service account json';
  end if;

  select id into v_id from vault.secrets where name = 'firebase_service_account';
  if v_id is null then
    perform vault.create_secret(p_json, 'firebase_service_account');
  else
    perform vault.update_secret(v_id, p_json);
  end if;
end;
$$;

revoke all on function public.set_firebase_service_account(text) from public, anon, authenticated;
grant execute on function public.set_firebase_service_account(text) to service_role;
