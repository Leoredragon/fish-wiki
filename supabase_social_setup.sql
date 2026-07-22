-- 1. Create public.profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create catch_logs table
create table public.catch_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  fish_id uuid references public.fishes(id) on delete set null, -- Optional link to species
  image_url text not null,
  weight numeric, -- in kg
  length numeric, -- in cm
  lure_used text,
  location_note text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.catch_logs enable row level security;

-- Catch logs Policies
create policy "Catch logs are viewable by everyone." on catch_logs
  for select using (true);
create policy "Users can insert their own catch logs." on catch_logs
  for insert with check (auth.uid() = user_id);
create policy "Users can update own catch logs." on catch_logs
  for update using (auth.uid() = user_id);
create policy "Users can delete own catch logs." on catch_logs
  for delete using (auth.uid() = user_id);

-- 3. Storage Setup for Catch Images
insert into storage.buckets (id, name, public) values ('user_uploads', 'user_uploads', true);

-- Storage Policies
create policy "Images are publicly accessible." on storage.objects
  for select using (bucket_id = 'user_uploads');
create policy "Anyone can upload an image." on storage.objects
  for insert with check (bucket_id = 'user_uploads' AND auth.role() = 'authenticated');
create policy "Anyone can update their own image." on storage.objects
  for update using (auth.uid() = owner);
create policy "Anyone can delete their own image." on storage.objects
  for delete using (auth.uid() = owner);
