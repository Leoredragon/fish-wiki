-- Admin moderation: allow admins to delete reported content of any user.
-- SECURITY DEFINER bypasses per-table RLS after verifying the caller is an admin.

create or replace function public.admin_delete_reported_content(p_target_type text, p_target_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid := p_target_id::uuid;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'not authorized';
  end if;

  if p_target_type = 'catch' then
    delete from public.catch_logs where id = v_id;
  elsif p_target_type = 'forum' then
    delete from public.community_forum_posts where id = v_id;
  elsif p_target_type = 'market' then
    delete from public.community_marketplace_items where id = v_id;
  elsif p_target_type = 'tip' then
    delete from public.community_tips where id = v_id;
  elsif p_target_type = 'story' then
    delete from public.community_stories where id = v_id;
  elsif p_target_type = 'comment' then
    delete from public.catch_comments where id = v_id;
  else
    raise exception 'unknown target type: %', p_target_type;
  end if;
end;
$$;

revoke execute on function public.admin_delete_reported_content(text, text) from public, anon;
grant execute on function public.admin_delete_reported_content(text, text) to authenticated;
