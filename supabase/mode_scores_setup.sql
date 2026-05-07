create table if not exists public.mode_scores (
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null,
  points integer not null default 0,
  attempts integer not null default 0,
  correct integer not null default 0,
  best_time_ms integer,
  updated_at timestamp with time zone not null default now(),
  primary key (user_id, mode)
);

alter table public.mode_scores add column if not exists points integer not null default 0;
alter table public.mode_scores add column if not exists attempts integer not null default 0;
alter table public.mode_scores add column if not exists correct integer not null default 0;
alter table public.mode_scores add column if not exists best_time_ms integer;
alter table public.mode_scores add column if not exists updated_at timestamp with time zone not null default now();

do $$
declare
  mode_constraint text;
begin
  select tc.constraint_name
  into mode_constraint
  from information_schema.table_constraints tc
  join information_schema.check_constraints cc
    on cc.constraint_name = tc.constraint_name
   and cc.constraint_schema = tc.constraint_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'mode_scores'
    and tc.constraint_type = 'CHECK'
    and cc.check_clause ilike '%mode%'
  limit 1;

  if mode_constraint is not null then
    execute format('alter table public.mode_scores drop constraint %I', mode_constraint);
  end if;
end $$;

alter table public.mode_scores
add constraint mode_scores_mode_check
check (mode in ('quiz', 'offense_build', 'alignment', 'film', 'concept', 'blitz', 'stunt'));

alter table public.mode_scores enable row level security;

drop policy if exists "users can read all scores" on public.mode_scores;
create policy "users can read all scores"
on public.mode_scores
for select
to authenticated
using (true);

drop policy if exists "users can insert own scores" on public.mode_scores;
create policy "users can insert own scores"
on public.mode_scores
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own scores" on public.mode_scores;
create policy "users can update own scores"
on public.mode_scores
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
