-- Notification preference toggles for push + local reminders.
-- Soft defaults: all enabled. Client stores a mirror in localStorage.

alter table public.profiles
  add column if not exists notification_prefs jsonb
  not null
  default '{"likes":true,"comments":true,"follows":true,"daily_score":true}'::jsonb;

comment on column public.profiles.notification_prefs is
  'User notification toggles: likes, comments, follows, daily_score';
