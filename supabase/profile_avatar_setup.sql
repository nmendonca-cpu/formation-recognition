alter table public.profiles
add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('profile-pics', 'profile-pics', true)
on conflict (id) do nothing;

drop policy if exists "authenticated users can view profile pictures" on storage.objects;
create policy "authenticated users can view profile pictures"
on storage.objects
for select
to authenticated
using (bucket_id = 'profile-pics');

drop policy if exists "users can upload own profile pictures" on storage.objects;
create policy "users can upload own profile pictures"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-pics'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can update own profile pictures" on storage.objects;
create policy "users can update own profile pictures"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-pics'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'profile-pics'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "users can delete own profile pictures" on storage.objects;
create policy "users can delete own profile pictures"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-pics'
  and auth.uid()::text = (storage.foldername(name))[1]
);
