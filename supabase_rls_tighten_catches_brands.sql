-- Play Store prep: tighten permissive write policies

drop policy if exists "Public catches delete" on public.catches;
drop policy if exists "Public catches insert" on public.catches;

create policy "Users insert own catches"
on public.catches
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users delete own catches"
on public.catches
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy "Users update own catches"
on public.catches
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Allow authenticated full access for equipment_brands" on public.equipment_brands;

create policy "Admin insert equipment_brands"
on public.equipment_brands
for insert
to authenticated
with check (public.is_admin());

create policy "Admin update equipment_brands"
on public.equipment_brands
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin delete equipment_brands"
on public.equipment_brands
for delete
to authenticated
using (public.is_admin());
