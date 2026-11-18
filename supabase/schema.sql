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

-- 3. Aktifkan Row Level Security (RLS)
alter table public.photo_memories enable row level security;
alter table public.memory_notes enable row level security;

-- 4. Kebijakan RLS untuk photo_memories
-- Siapa saja dapat melihat foto yang sudah disetujui (approved) oleh Admin
drop policy if exists "Public can view approved photos" on public.photo_memories;
create policy "Public can view approved photos"
  on public.photo_memories
  for select
  using (status = 'approved');

-- Admin yang login (authenticated) dapat melihat seluruh pengajuan (pending/approved/rejected)
drop policy if exists "Admin can view all photo submissions" on public.photo_memories;
create policy "Admin can view all photo submissions"
  on public.photo_memories
  for select
  to authenticated
  using (true);

-- Siswa/pengunjung dapat mengajukan foto baru, tetapi status wajib 'pending'
drop policy if exists "Anyone can submit pending photo" on public.photo_memories;
create policy "Anyone can submit pending photo"
  on public.photo_memories
  for insert
  with check (status = 'pending');

-- Admin yang login dapat menyetujui (apply), menolak, mengedit, atau mengunggah langsung
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

-- 5. Kebijakan RLS untuk memory_notes
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

-- 6. Bucket Supabase Storage untuk Upload File Foto Langsung
insert into storage.buckets (id, name, public)
values ('kenangan-photos', 'kenangan-photos', true)
on conflict (id) do nothing;

-- Kebijakan Storage: Publik dapat membaca file foto
drop policy if exists "Public read kenangan photos" on storage.objects;
create policy "Public read kenangan photos"
  on storage.objects
  for select
  using (bucket_id = 'kenangan-photos');

-- Kebijakan Storage: Siapa saja dapat mengunggah ke folder submissions/
drop policy if exists "Public upload to submissions folder" on storage.objects;
create policy "Public upload to submissions folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'kenangan-photos'
    and (storage.foldername(name))[1] = 'submissions'
  );

-- Kebijakan Storage: Admin yang login dapat mengelola & menghapus file
drop policy if exists "Admin manage kenangan photos" on storage.objects;
create policy "Admin manage kenangan photos"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'kenangan-photos')
  with check (bucket_id = 'kenangan-photos');
