-- Roles + portal access (PRD §4.2.3 My Studio, §4.3 Instructor interface)
-- Adds the 'admin' role, lets admins manage the catalog, and lets
-- admins/instructors work with registrations (attendance, payment status).

-- ---------- extend roles ----------

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'instructor', 'admin'));

-- Recursion-safe role lookup for policies on profiles itself.
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ---------- catalog management (admin) ----------

grant insert, update, delete on public.workshops to authenticated;
grant insert, update, delete on public.workshop_schedules to authenticated;

create policy workshops_admin_insert
  on public.workshops for insert to authenticated
  with check (public.my_role() = 'admin');

create policy workshops_admin_update
  on public.workshops for update to authenticated
  using (public.my_role() = 'admin')
  with check (public.my_role() = 'admin');

create policy workshops_admin_delete
  on public.workshops for delete to authenticated
  using (public.my_role() = 'admin');

create policy schedules_admin_insert
  on public.workshop_schedules for insert to authenticated
  with check (public.my_role() = 'admin');

create policy schedules_admin_update
  on public.workshop_schedules for update to authenticated
  using (public.my_role() = 'admin')
  with check (public.my_role() = 'admin');

create policy schedules_admin_delete
  on public.workshop_schedules for delete to authenticated
  using (public.my_role() = 'admin');

-- ---------- registrations management ----------

-- Clients may only touch the two status fields; core booking data stays
-- append-only. Seat counters remain trigger-owned.
grant update (status, payment_status) on public.registrations to authenticated;

create policy registrations_admin_read
  on public.registrations for select to authenticated
  using (public.my_role() = 'admin');

create policy registrations_admin_update
  on public.registrations for update to authenticated
  using (public.my_role() = 'admin')
  with check (public.my_role() = 'admin');

create policy registrations_instructor_update
  on public.registrations for update to authenticated
  using (
    exists (
      select 1 from public.workshops w
      where w.id = registrations.workshop_id
        and w.instructor_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workshops w
      where w.id = registrations.workshop_id
        and w.instructor_id = auth.uid()
    )
  );

-- ---------- profiles visibility ----------

create policy profiles_admin_read
  on public.profiles for select to authenticated
  using (public.my_role() = 'admin');
