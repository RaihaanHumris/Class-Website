import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

function ensureClient() {
  if (!supabase) {
    throw new Error(
      'Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada environment variables.'
    );
  }
  return supabase;
}

/**
 * Unggah file gambar ke Supabase Storage bucket `kenangan-photos`
 */
async function uploadPhotoFile(file, folder = 'submissions') {
  const client = ensureClient();
  const safeName = (file.name || 'kenangan.jpg')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from('kenangan-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    throw new Error(
      `Gagal mengunggah file ke Supabase Storage: ${uploadError.message}`
    );
  }

  const { data } = client.storage
    .from('kenangan-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Ambil seluruh foto kenangan yang telah disetujui (approved) oleh Admin
 */
export async function fetchApprovedPhotos() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('photo_memories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat foto dari Supabase: ${error.message}`);
  }

  return (data || []).map((row) => ({
    id: `sb-${row.id}`,
    rawId: row.id,
    judul: row.judul,
    kategori: row.kategori,
    tanggal: row.tanggal,
    deskripsi: row.deskripsi,
    pengirim: row.pengirim_nama,
    src: row.image_url,
    thumb: row.image_url,
    isFromDatabase: true,
    createdAt: row.created_at,
  }));
}

/**
 * Ajukan foto kenangan baru oleh siswa/pengunjung (status default: 'pending')
 */
export async function submitPhotoMemory({
  judul,
  kategori,
  tanggal,
  deskripsi,
  pengirimNama,
  file,
  imageUrl,
}) {
  const client = ensureClient();
  let finalImageUrl = (imageUrl || '').trim();

  if (file) {
    finalImageUrl = await uploadPhotoFile(file, 'submissions');
  }

  if (!finalImageUrl) {
    throw new Error('Silakan pilih file foto atau masukkan URL gambar yang valid.');
  }

  const { data, error } = await client
    .from('photo_memories')
    .insert({
      judul: judul.trim(),
      kategori: kategori.trim(),
      tanggal: tanggal.trim(),
      deskripsi: deskripsi.trim(),
      pengirim_nama: pengirimNama.trim(),
      image_url: finalImageUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal mengirim pengajuan foto: ${error.message}`);
  }

  return data;
}

/**
 * Admin: Unggah & langsung terbitkan foto kenangan (status: 'approved')
 */
export async function adminPublishPhoto({
  judul,
  kategori,
  tanggal,
  deskripsi,
  pengirimNama,
  file,
  imageUrl,
}) {
  const client = ensureClient();
  let finalImageUrl = (imageUrl || '').trim();

  if (file) {
    finalImageUrl = await uploadPhotoFile(file, 'submissions');
  }

  if (!finalImageUrl) {
    throw new Error('Silakan pilih file foto atau masukkan URL gambar yang valid.');
  }

  const { data, error } = await client
    .from('photo_memories')
    .insert({
      judul: judul.trim(),
      kategori: kategori.trim(),
      tanggal: tanggal.trim(),
      deskripsi: deskripsi.trim(),
      pengirim_nama: pengirimNama.trim() || 'Admin XII PPLG 3',
      image_url: finalImageUrl,
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menerbitkan foto: ${error.message}`);
  }

  return data;
}

/**
 * Admin: Ambil seluruh pengajuan foto (pending, approved, rejected)
 */
export async function fetchAllPhotosForAdmin() {
  const client = ensureClient();
  const { data, error } = await client
    .from('photo_memories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat daftar pengajuan: ${error.message}`);
  }

  return data || [];
}

/**
 * Admin: Setujui (Apply) atau Tolak pengajuan foto kenangan
 */
export async function reviewPhotoSubmission(id, status, adminNote = '') {
  const client = ensureClient();
  const { data, error } = await client
    .from('photo_memories')
    .update({
      status,
      admin_note: adminNote.trim() || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status pengajuan: ${error.message}`);
  }

  return data;
}

/**
 * Admin: Hapus pengajuan atau foto dari database
 */
export async function deletePhotoSubmission(id) {
  const client = ensureClient();
  const { error } = await client
    .from('photo_memories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Gagal menghapus foto: ${error.message}`);
  }
}

/**
 * Buku Kenangan: Ambil catatan/pesan angkatan
 */
export async function fetchMemoryNotes() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('memory_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat buku kenangan: ${error.message}`);
  }

  return data || [];
}

/**
 * Buku Kenangan: Kirim pesan/kesan baru
 */
export async function submitMemoryNote({ nama, peran, pesan }) {
  const client = ensureClient();
  const { data, error } = await client
    .from('memory_notes')
    .insert({
      nama: nama.trim(),
      peran: (peran || 'Siswa XII PPLG 3').trim(),
      pesan: pesan.trim(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menyimpan pesan kenangan: ${error.message}`);
  }

  return data;
}

/**
 * Admin: Hapus pesan buku kenangan
 */
export async function deleteMemoryNote(id) {
  const client = ensureClient();
  const { error } = await client
    .from('memory_notes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Gagal menghapus pesan kenangan: ${error.message}`);
  }
}

/**
 * Autentikasi Admin via Supabase Auth (Email & Password)
 */
export async function signInAdmin(email, password) {
  const client = ensureClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function signOutAdmin() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getAdminSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export function onAdminAuthChange(callback) {
  if (!supabase) return () => {};
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.unsubscribe();
}
