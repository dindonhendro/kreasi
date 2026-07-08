-- kreasi.art core schema (PRD §6)
-- Models: profiles (users/instructors), workshops, workshop_schedules (slots),
-- registrations. Seat counts are server-maintained via trigger so the site can
-- show real-time availability and never overbook.

-- ---------- profiles (Users/Instructors) ----------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 120),
  role text not null default 'user' check (role in ('user', 'instructor')),
  profile_image text,
  created_at timestamptz not null default now()
);

-- ---------- workshops ----------

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  category_id text not null,
  age_group text not null check (age_group in ('Kids', 'Adult', 'Senior')),
  duration_hours numeric(4, 2) not null check (duration_hours > 0),
  price integer not null check (price >= 0),
  instructor_name text not null,
  instructor_id uuid references public.profiles(id) on delete set null,
  max_participants integer not null check (max_participants > 0),
  created_at timestamptz not null default now()
);

-- ---------- workshop_schedules (bookable slots) ----------

create table public.workshop_schedules (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  label_date text not null,
  label_time text not null,
  seats_total integer not null check (seats_total > 0),
  seats_taken integer not null default 0 check (seats_taken >= 0),
  starts_at timestamptz,
  created_at timestamptz not null default now(),
  constraint seats_within_capacity check (seats_taken <= seats_total)
);

create index workshop_schedules_workshop_id_idx
  on public.workshop_schedules (workshop_id);

-- ---------- registrations ----------

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  schedule_id uuid not null references public.workshop_schedules(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (length(name) between 1 and 120),
  email text not null check (position('@' in email) > 1),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'attended')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  created_at timestamptz not null default now()
);

create index registrations_schedule_id_idx on public.registrations (schedule_id);
create index registrations_user_id_idx on public.registrations (user_id);

-- ---------- seat accounting (server-maintained, overbooking-proof) ----------

create or replace function public.claim_schedule_seat()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sched public.workshop_schedules%rowtype;
begin
  select * into sched
    from public.workshop_schedules
    where id = new.schedule_id
    for update;

  if not found then
    raise exception 'Jadwal tidak ditemukan';
  end if;
  if sched.workshop_id <> new.workshop_id then
    raise exception 'Jadwal tidak sesuai dengan workshop';
  end if;
  if sched.seats_taken >= sched.seats_total then
    raise exception 'Jadwal sudah penuh';
  end if;

  update public.workshop_schedules
    set seats_taken = seats_taken + 1
    where id = new.schedule_id;

  return new;
end;
$$;

create trigger registrations_claim_seat
  before insert on public.registrations
  for each row execute function public.claim_schedule_seat();

create or replace function public.release_schedule_seat()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.workshop_schedules
    set seats_taken = greatest(seats_taken - 1, 0)
    where id = old.schedule_id;
  return old;
end;
$$;

create trigger registrations_release_seat
  after delete on public.registrations
  for each row execute function public.release_schedule_seat();

-- Self-service clients may not change a profile's role (prevents escalation);
-- privileged/dashboard sessions (no auth.uid()) may.
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'Role tidak dapat diubah sendiri';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.prevent_profile_role_change();

-- ---------- privileges + RLS ----------

alter table public.profiles enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_schedules enable row level security;
alter table public.registrations enable row level security;

-- Catalog is read-only for clients; content is managed by admins/migrations.
revoke insert, update, delete on public.workshops from anon, authenticated;
revoke insert, update, delete on public.workshop_schedules from anon, authenticated;
-- Registrations are append-only from clients.
revoke update, delete on public.registrations from anon, authenticated;

create policy workshops_public_read
  on public.workshops for select
  to anon, authenticated
  using (true);

create policy schedules_public_read
  on public.workshop_schedules for select
  to anon, authenticated
  using (true);

-- Profiles: own profile always readable; instructor profiles are public.
create policy profiles_read
  on public.profiles for select
  to anon, authenticated
  using (role = 'instructor' or id = auth.uid());

create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() and role = 'user');

create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Registrations: guests may register (user_id null); logged-in users register
-- as themselves and can read their own history. Instructors can read
-- registrations for their own workshops.
create policy registrations_insert_public
  on public.registrations for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy registrations_read_own
  on public.registrations for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.workshops w
      where w.id = registrations.workshop_id
        and w.instructor_id = auth.uid()
    )
  );
