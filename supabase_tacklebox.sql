-- 1. Create tackle_box table
create table public.tackle_box (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text not null, -- 'rod', 'reel', 'line', 'lure', 'accessory'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.tackle_box enable row level security;

-- Tackle Box Policies
create policy "Users can view their own tackle box." on tackle_box
  for select using (auth.uid() = user_id);
create policy "Users can insert their own tackle items." on tackle_box
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tackle items." on tackle_box
  for update using (auth.uid() = user_id);
create policy "Users can delete own tackle items." on tackle_box
  for delete using (auth.uid() = user_id);

-- 2. Add tackle_box_id to catch_logs to link catches to equipment
alter table public.catch_logs add column tackle_box_id uuid references public.tackle_box(id) on delete set null;
