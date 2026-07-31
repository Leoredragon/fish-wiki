-- Push notification infrastructure (applied 2026-07-31)
-- 1) push_tokens table + RLS
-- 2) Vault secrets: push_webhook_secret (auto-generated), firebase_service_account (added separately)
-- 3) notifications insert trigger -> send-push edge function (pg_net)
-- 4) register_push_token RPC for client-side token upsert

create extension if not exists pg_net;
create extension if not exists pgcrypto;

create table if not exists public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null default 'android',
  updated_at timestamptz not null default now()
);

create index if not exists push_tokens_user_idx on public.push_tokens(user_id);

alter table public.push_tokens enable row level security;

drop policy if exists push_tokens_select_own on public.push_tokens;
create policy push_tokens_select_own on public.push_tokens for select using (auth.uid() = user_id);
drop policy if exists push_tokens_insert_own on public.push_tokens;
create policy push_tokens_insert_own on public.push_tokens for insert with check (auth.uid() = user_id);
drop policy if exists push_tokens_update_own on public.push_tokens;
create policy push_tokens_update_own on public.push_tokens for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists push_tokens_delete_own on public.push_tokens;
create policy push_tokens_delete_own on public.push_tokens for delete using (auth.uid() = user_id);

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'push_webhook_secret') then
    perform vault.create_secret(encode(gen_random_bytes(32), 'hex'), 'push_webhook_secret');
  end if;
end $$;

create or replace function public.get_push_webhook_secret()
returns text
language sql
security definer
set search_path = public
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'push_webhook_secret'
$$;
revoke all on function public.get_push_webhook_secret() from public, anon, authenticated;
grant execute on function public.get_push_webhook_secret() to service_role;

create or replace function public.get_firebase_service_account()
returns text
language sql
security definer
set search_path = public
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'firebase_service_account'
$$;
revoke all on function public.get_firebase_service_account() from public, anon, authenticated;
grant execute on function public.get_firebase_service_account() to service_role;

create or replace function public.notify_push()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'push_webhook_secret';
  perform net.http_post(
    url := 'https://mrbbioabvgbutijbbcpm.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-push-secret', coalesce(v_secret, '')
    ),
    body := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
exception when others then
  -- Never block the notification insert because of push delivery issues
  return new;
end;
$$;

drop trigger if exists notifications_push_trigger on public.notifications;
create trigger notifications_push_trigger
after insert on public.notifications
for each row execute function public.notify_push();

-- Upsert push token for the calling user (handles same device switching accounts)
create or replace function public.register_push_token(p_token text, p_platform text default 'android')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into public.push_tokens (token, user_id, platform, updated_at)
  values (p_token, auth.uid(), p_platform, now())
  on conflict (token) do update
    set user_id = auth.uid(), platform = excluded.platform, updated_at = now();
end;
$$;

revoke all on function public.register_push_token(text, text) from public, anon;
grant execute on function public.register_push_token(text, text) to authenticated;
