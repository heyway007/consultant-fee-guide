create extension if not exists "pgcrypto";

create table if not exists public.w16_rate_rows (
  id uuid primary key default gen_random_uuid(),
  professional_group text not null,
  experience_years numeric not null check (experience_years >= 0),
  experience_label text not null,
  bachelor_rate numeric,
  master_rate numeric,
  doctorate_rate numeric,
  source_page integer,
  source_table text,
  notes text,
  created_at timestamptz not null default now(),
  unique (professional_group, experience_years)
);

create table if not exists public.w16_markup_factors (
  id uuid primary key default gen_random_uuid(),
  factor_type text not null,
  factor_label text not null,
  factor_value numeric not null check (factor_value >= 0),
  description text,
  source_page integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (factor_type, factor_label)
);

create table if not exists public.w16_rate_markup_map (
  rate_row_id uuid not null references public.w16_rate_rows(id) on delete cascade,
  markup_factor_id uuid not null references public.w16_markup_factors(id) on delete cascade,
  primary key (rate_row_id, markup_factor_id)
);

create index if not exists w16_rate_rows_group_idx on public.w16_rate_rows (professional_group);
create index if not exists w16_rate_rows_experience_idx on public.w16_rate_rows (experience_years);
create index if not exists w16_markup_factors_type_idx on public.w16_markup_factors (factor_type);

alter table public.w16_rate_rows enable row level security;
alter table public.w16_markup_factors enable row level security;
alter table public.w16_rate_markup_map enable row level security;

drop policy if exists "Public can read W16 rates" on public.w16_rate_rows;
create policy "Public can read W16 rates" on public.w16_rate_rows for select to anon, authenticated using (true);

drop policy if exists "Public can read W16 markup factors" on public.w16_markup_factors;
create policy "Public can read W16 markup factors" on public.w16_markup_factors for select to anon, authenticated using (true);

drop policy if exists "Public can read W16 mappings" on public.w16_rate_markup_map;
create policy "Public can read W16 mappings" on public.w16_rate_markup_map for select to anon, authenticated using (true);
