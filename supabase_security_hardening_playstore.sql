-- Play Store release hardening for Supabase security and performance

-- 1) Lock down backup tables exposed in public schema
alter table if exists public.fishing_spots_backup_20260729 enable row level security;
alter table if exists public.fishing_spots_backup_west_v1 enable row level security;

revoke all on table public.fishing_spots_backup_20260729 from anon, authenticated;
revoke all on table public.fishing_spots_backup_west_v1 from anon, authenticated;

-- 2) Harden SECURITY DEFINER functions
alter function public.handle_new_user() set search_path = public, pg_temp;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.is_admin, false) = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- 3) Tighten storage object policies for user_uploads
drop policy if exists "Images are publicly accessible." on storage.objects;
drop policy if exists "Public read storage" on storage.objects;
drop policy if exists "Auth users upload storage" on storage.objects;
drop policy if exists "Users delete own storage" on storage.objects;
drop policy if exists "Users update own storage" on storage.objects;
drop policy if exists "Anyone can upload an image." on storage.objects;
drop policy if exists "Anyone can update their own image." on storage.objects;
drop policy if exists "Anyone can delete their own image." on storage.objects;

create policy "Authenticated upload user_uploads"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user_uploads'
  and auth.role() = 'authenticated'
);

create policy "Owner update user_uploads"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'user_uploads'
  and owner = auth.uid()
)
with check (
  bucket_id = 'user_uploads'
  and owner = auth.uid()
);

create policy "Owner delete user_uploads"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user_uploads'
  and owner = auth.uid()
);

-- 4) Add FK indexes reported by performance advisors
create index if not exists idx_catch_comments_catch_id on public.catch_comments (catch_id);
create index if not exists idx_catch_comments_user_id on public.catch_comments (user_id);
create index if not exists idx_catch_likes_user_id on public.catch_likes (user_id);
create index if not exists idx_catch_likes_catch_id on public.catch_likes (catch_id);
create index if not exists idx_catch_logs_fish_id on public.catch_logs (fish_id);
create index if not exists idx_catch_logs_tackle_box_id on public.catch_logs (tackle_box_id);
create index if not exists idx_catch_logs_user_id on public.catch_logs (user_id);
create index if not exists idx_catches_user_id on public.catches (user_id);
create index if not exists idx_forum_posts_user_id on public.community_forum_posts (user_id);
create index if not exists idx_forum_replies_post_id on public.community_forum_replies (post_id);
create index if not exists idx_forum_replies_user_id on public.community_forum_replies (user_id);
create index if not exists idx_market_comments_item_id on public.community_marketplace_comments (item_id);
create index if not exists idx_market_comments_user_id on public.community_marketplace_comments (user_id);
create index if not exists idx_market_items_user_id on public.community_marketplace_items (user_id);
create index if not exists idx_stories_user_id on public.community_stories (user_id);
create index if not exists idx_tip_comments_user_id on public.community_tip_comments (user_id);
create index if not exists idx_tip_comments_tip_id on public.community_tip_comments (tip_id);
create index if not exists idx_tips_user_id on public.community_tips (user_id);
create index if not exists idx_favorite_spots_spot_id on public.favorite_spots (spot_id);
create index if not exists idx_favorite_spots_user_id on public.favorite_spots (user_id);
create index if not exists idx_fishing_spots_user_id on public.fishing_spots (user_id);
create index if not exists idx_follows_follower_id on public.follows (follower_id);
create index if not exists idx_follows_following_id on public.follows (following_id);
create index if not exists idx_notifications_actor_id on public.notifications (actor_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_notifications_catch_id on public.notifications (catch_id);
create index if not exists idx_tackle_box_user_id on public.tackle_box (user_id);
create index if not exists idx_tackle_sets_user_id on public.tackle_sets (user_id);
create index if not exists idx_wiki_subcategories_category_id on public.wiki_subcategories (category_id);
