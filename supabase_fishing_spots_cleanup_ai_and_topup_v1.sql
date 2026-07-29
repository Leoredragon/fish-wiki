-- =========================================================
-- OLTAPP Cleanup v1
-- Purpose:
-- - Remove unverified AI-normalized dataset rows
-- - Remove the previous "Topup 100" rows (not map-verified)
--
-- Safety:
-- - Deletes ONLY rows matched by our known source_note values.
-- - Does not touch regional curated packs (e.g. "Regional pack west v1").
-- - Favorite FK is handled first.
-- =========================================================

begin;

-- 1) Remove dependent favorites
delete from public.favorite_spots
where spot_id in (
  select id
  from public.fishing_spots
  where source_note in (
    'v2 normalize',
    'v1 dataset dedupe + normalize',
    'Topup 100 v1'
  )
);

-- 2) Delete the matched spots
delete from public.fishing_spots
where source_note in (
  'v2 normalize',
  'v1 dataset dedupe + normalize',
  'Topup 100 v1'
);

commit;

-- Quick checks (optional):
-- select count(*) from public.fishing_spots;
-- select source_note, count(*) from public.fishing_spots group by source_note order by 2 desc;
