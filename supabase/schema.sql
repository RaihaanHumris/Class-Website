-- ============================================================================
-- SKEMA DATABASE SUPABASE - WEB KENANGAN XII PPLG 3 MAKN ENDE
-- Jalankan seluruh skrip ini pada menu SQL Editor di Dashboard Supabase Anda.
-- ============================================================================

-- 1. Tabel Pengajuan & Galeri Foto Kenangan
create table if not exists public.photo_memories (
  id uuid primary key default gen_random_uuid(),
  judul text not null check (char_length(judul) between 3 and 140),
  kategori text not null check (char_length(kategori) between 2 and 40),
  tanggal text not null check (char_length(tanggal) between 2 and 60),
  deskripsi text not null check (char_length(deskripsi) between 5 and 800),
  image_url text not null,
  pengirim_nama text not null check (char_length(pengirim_nama) between 2 and 80),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- 2. Tabel Buku Kenangan (Pesan & Kesan Angkatan)
create table if not exists public.memory_notes (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 80),
  peran text not null default 'Siswa XII PPLG 3',
  pesan text not null check (char_length(pesan) between 3 and 500),
  created_at timestamptz not null default now()
);

-- 3. Tabel Direktori Profil Anggota Kelas XII PPLG 3
create table if not exists public.member_profiles (
  member_id integer primary key,
  nama text not null,
  panggilan text not null default '',
  peran text not null default 'Anggota',
  minat text not null default '',
  ultah text not null default '',
  bio text not null default '',
  github text not null default '',
  portfolio text not null default '',
  foto text not null default '',
  status text not null default 'aktif',
  updated_at timestamptz not null default now()
);

-- 4. Tabel Karya & Projects Siswa XII PPLG 3
create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  kategori text not null default 'Web App',
  teknologi text[] not null default '{}',
  member_ids integer[] not null default '{}',
  github_url text not null default '',
  demo_url text not null default '',
  status_repo text not null default 'Public Repo · Active',
  tahun text not null default '2026',
  created_at timestamptz not null default now()
);

-- 5. Aktifkan Row Level Security (RLS)
alter table public.photo_memories enable row level security;
alter table public.memory_notes enable row level security;
alter table public.member_profiles enable row level security;
alter table public.student_projects enable row level security;

-- 6. Kebijakan RLS untuk photo_memories
drop policy if exists "Public can view approved photos" on public.photo_memories;
create policy "Public can view approved photos"
  on public.photo_memories
  for select
  using (status = 'approved');

drop policy if exists "Admin can view all photo submissions" on public.photo_memories;
create policy "Admin can view all photo submissions"
  on public.photo_memories
  for select
  to authenticated
  using (true);

drop policy if exists "Anyone can submit pending photo" on public.photo_memories;
create policy "Anyone can submit pending photo"
  on public.photo_memories
  for insert
  with check (status = 'pending');

drop policy if exists "Admin can insert approved photo" on public.photo_memories;
create policy "Admin can insert approved photo"
  on public.photo_memories
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admin can update photo submissions" on public.photo_memories;
create policy "Admin can update photo submissions"
  on public.photo_memories
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin can delete photo submissions" on public.photo_memories;
create policy "Admin can delete photo submissions"
  on public.photo_memories
  for delete
  to authenticated
  using (true);

-- 7. Kebijakan RLS untuk memory_notes
drop policy if exists "Public can read memory notes" on public.memory_notes;
create policy "Public can read memory notes"
  on public.memory_notes
  for select
  using (true);

drop policy if exists "Anyone can add memory note" on public.memory_notes;
create policy "Anyone can add memory note"
  on public.memory_notes
  for insert
  with check (true);

drop policy if exists "Admin can delete memory notes" on public.memory_notes;
create policy "Admin can delete memory notes"
  on public.memory_notes
  for delete
  to authenticated
  using (true);

-- 8. Kebijakan RLS untuk member_profiles (Direktori Anggota langsung tersimpan di DB)
drop policy if exists "Public can read member profiles" on public.member_profiles;
create policy "Public can read member profiles"
  on public.member_profiles
  for select
  using (true);

drop policy if exists "Anyone can insert member profiles" on public.member_profiles;
create policy "Anyone can insert member profiles"
  on public.member_profiles
  for insert
  with check (true);

drop policy if exists "Anyone can update member profiles" on public.member_profiles;
create policy "Anyone can update member profiles"
  on public.member_profiles
  for update
  using (true)
  with check (true);

-- 9. Kebijakan RLS untuk student_projects (Projects Siswa langsung tersimpan di DB)
drop policy if exists "Public can read student projects" on public.student_projects;
create policy "Public can read student projects"
  on public.student_projects
  for select
  using (true);

drop policy if exists "Anyone can insert student projects" on public.student_projects;
create policy "Anyone can insert student projects"
  on public.student_projects
  for insert
  with check (true);

drop policy if exists "Anyone can update student projects" on public.student_projects;
create policy "Anyone can update student projects"
  on public.student_projects
  for update
  using (true)
  with check (true);

drop policy if exists "Admin can delete student projects" on public.student_projects;
create policy "Admin can delete student projects"
  on public.student_projects
  for delete
  to authenticated
  using (true);

-- 10. Bucket Supabase Storage untuk Upload File Foto Langsung
insert into storage.buckets (id, name, public)
values ('kenangan-photos', 'kenangan-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public read kenangan photos" on storage.objects;
create policy "Public read kenangan photos"
  on storage.objects
  for select
  using (bucket_id = 'kenangan-photos');

drop policy if exists "Public upload to submissions folder" on storage.objects;
create policy "Public upload to submissions folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'kenangan-photos'
    and (storage.foldername(name))[1] = 'submissions'
  );

drop policy if exists "Admin manage kenangan photos" on storage.objects;
create policy "Admin manage kenangan photos"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'kenangan-photos')
  with check (bucket_id = 'kenangan-photos');
