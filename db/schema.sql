-- co.lok.kan production schema
-- Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists cafes (
  id uuid primary key default gen_random_uuid(),
  external_seed_id text unique,
  slug text not null unique,
  name text not null,
  address text,
  neighborhood text,
  latitude double precision not null,
  longitude double precision not null,
  rating double precision default 0,
  source text not null default 'seed',
  current_wifi_mbps integer,
  current_plugs text,
  current_noise text,
  forecast_summary jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  report_count integer not null default 0,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cafes_neighborhood_idx on cafes (neighborhood);
create index if not exists cafes_confidence_idx on cafes (confidence_score desc, report_count desc);

create table if not exists cafe_reports (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references cafes(id) on delete cascade,
  reporter_name text not null default 'Anon',
  wifi_mbps integer not null check (wifi_mbps between 1 and 2000),
  plugs text not null,
  noise text not null,
  notes text,
  observed_at timestamptz not null default now(),
  screenshot_path text,
  screenshot_content_type text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by text,
  submitted_at timestamptz not null default now()
);

create index if not exists cafe_reports_cafe_idx on cafe_reports (cafe_id, status, observed_at desc);
create index if not exists cafe_reports_status_idx on cafe_reports (status, submitted_at asc);

create table if not exists cafe_review_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references cafe_reports(id) on delete cascade,
  cafe_id uuid not null references cafes(id) on delete cascade,
  action text not null check (action in ('submitted', 'approved', 'rejected')),
  actor text not null,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cafes_set_updated_at on cafes;
create trigger cafes_set_updated_at
before update on cafes
for each row
execute function set_updated_at();

alter table cafes enable row level security;
alter table cafe_reports enable row level security;
alter table cafe_review_events enable row level security;

drop policy if exists "public can read cafes" on cafes;
create policy "public can read cafes"
on cafes
for select
using (true);

drop policy if exists "service role manages cafes" on cafes;
create policy "service role manages cafes"
on cafes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "public cannot read reports" on cafe_reports;
create policy "public cannot read reports"
on cafe_reports
for select
using (false);

drop policy if exists "service role manages reports" on cafe_reports;
create policy "service role manages reports"
on cafe_reports
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "public cannot read review events" on cafe_review_events;
create policy "public cannot read review events"
on cafe_review_events
for select
using (false);

drop policy if exists "service role manages review events" on cafe_review_events;
create policy "service role manages review events"
on cafe_review_events
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
