create table if not exists public.film_clips (
  id text primary key,
  title text not null,
  source_label text,
  source_type text,
  clip_bucket text,
  submode text not null default 'read_key',
  run_pass text not null check (run_pass in ('run', 'pass')),
  direction text not null check (direction in ('left', 'right')),
  pass_type text check (pass_type in ('drop_back', 'boot')),
  run_scheme text check (run_scheme in ('gap', 'zone', 'man')),
  gap_puller_count integer,
  gap_one_puller_concept text,
  gap_two_puller_concept text,
  man_concept text,
  study_url text not null,
  quiz_url text,
  quiz_start_seconds double precision,
  quiz_end_seconds double precision,
  study_storage_path text,
  quiz_storage_path text,
  study_file_name text,
  quiz_file_name text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.film_clips add column if not exists source_type text;
alter table public.film_clips add column if not exists clip_bucket text;
alter table public.film_clips add column if not exists pass_type text;
alter table public.film_clips add column if not exists run_scheme text;
alter table public.film_clips add column if not exists gap_puller_count integer;
alter table public.film_clips add column if not exists gap_one_puller_concept text;
alter table public.film_clips add column if not exists gap_two_puller_concept text;
alter table public.film_clips add column if not exists man_concept text;
alter table public.film_clips add column if not exists quiz_start_seconds double precision;
alter table public.film_clips add column if not exists quiz_end_seconds double precision;

create index if not exists film_clips_created_at_idx on public.film_clips (created_at desc);
create index if not exists film_clips_submode_idx on public.film_clips (submode);

alter table public.film_clips enable row level security;

drop policy if exists "users can read all film clips" on public.film_clips;
create policy "users can read all film clips"
on public.film_clips
for select
to authenticated
using (true);

drop policy if exists "users can insert own film clips" on public.film_clips;
create policy "users can insert own film clips"
on public.film_clips
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "users can update own film clips" on public.film_clips;
create policy "users can update own film clips"
on public.film_clips
for update
to authenticated
using (auth.uid() = created_by);

drop policy if exists "users can delete own film clips" on public.film_clips;
create policy "users can delete own film clips"
on public.film_clips
for delete
to authenticated
using (auth.uid() = created_by);

insert into storage.buckets (id, name, public)
values ('film-clips', 'film-clips', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "authenticated users can view film clip storage" on storage.objects;
create policy "authenticated users can view film clip storage"
on storage.objects
for select
to authenticated
using (bucket_id = 'film-clips');

drop policy if exists "authenticated users can upload film clip storage" on storage.objects;
create policy "authenticated users can upload film clip storage"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'film-clips');

drop policy if exists "users can update own film clip storage" on storage.objects;
create policy "users can update own film clip storage"
on storage.objects
for update
to authenticated
using (bucket_id = 'film-clips' and owner = auth.uid());

drop policy if exists "users can delete own film clip storage" on storage.objects;
create policy "users can delete own film clip storage"
on storage.objects
for delete
to authenticated
using (bucket_id = 'film-clips' and owner = auth.uid());
