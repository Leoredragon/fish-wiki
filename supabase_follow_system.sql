-- Follow system for public user profiles
-- Safe to run multiple times

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  constraint follows_no_self_follow check (follower_id <> following_id),
  constraint follows_unique_pair unique (follower_id, following_id)
);

create index if not exists follows_follower_idx on public.follows (follower_id);
create index if not exists follows_following_idx on public.follows (following_id);

alter table public.follows enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'follows_public_select'
  ) then
    create policy follows_public_select
      on public.follows
      for select
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'follows_insert_own'
  ) then
    create policy follows_insert_own
      on public.follows
      for insert
      with check (auth.uid() = follower_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'follows'
      and policyname = 'follows_delete_own'
  ) then
    create policy follows_delete_own
      on public.follows
      for delete
      using (auth.uid() = follower_id);
  end if;
end $$;
