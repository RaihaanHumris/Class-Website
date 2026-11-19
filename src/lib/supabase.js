import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://ajdujjhhsshtvehcwurq.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_SNik8EkuMmkuJ8Yfmtfwqw_aqLe9giq';

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof __APP_SUPABASE_URL__ !== 'undefined' ? __APP_SUPABASE_URL__ : '') ||
  FALLBACK_SUPABASE_URL
).trim();
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof __APP_SUPABASE_ANON_KEY__ !== 'undefined' ? __APP_SUPABASE_ANON_KEY__ : '') ||
  FALLBACK_SUPABASE_ANON_KEY
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

export const MEMBER_PHOTO_CATEGORY = 'Foto Profil Siswa';

/**
 * Ambil seluruh foto kenangan acara kelas yang telah disetujui (approved) oleh Admin
 */
export async function fetchApprovedPhotos() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('photo_memories')
    .select('*')
    .eq('status', 'approved')
    .neq('kategori', MEMBER_PHOTO_CATEGORY)
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
 * Ambil foto profil Polaroid seluruh siswa & wali kelas yang telah disetujui Admin
 * Mengembalikan map { [memberKey]: { imageUrl, caption, approvedAt, rowId } }
 */
export async function fetchApprovedMemberPhotos() {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('photo_memories')
    .select('*')
    .eq('status', 'approved')
    .eq('kategori', MEMBER_PHOTO_CATEGORY)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat foto profil siswa: ${error.message}`);
  }

  const map = {};
  (data || []).forEach((row) => {
    const key = row.tanggal;
    if (key && !map[key]) {
      map[key] = {
        rowId: row.id,
        imageUrl: row.image_url,
        caption: row.deskripsi,
        approvedAt: row.reviewed_at || row.created_at,
      };
    }
  });
  return map;
}

/**
 * Siswa: Ajukan foto profil Polaroid pribadi (status default: 'pending' menunggu apply Admin)
 */
export async function submitMemberPhoto({
  memberKey,
  memberName,
  badgeLabel,
  pengirimNama,
  catatan,
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

  const safeTitle = `Foto ${badgeLabel} · ${memberName}`.slice(0, 140);
  const safeDescRaw = (catatan || `Pengajuan foto profil Polaroid untuk ${memberName}`).trim();
  const safeDesc = safeDescRaw.length >= 5 ? safeDescRaw.slice(0, 800) : `${safeDescRaw} (XII PPLG 3)`;
  const safeSender = (pengirimNama || memberName).trim().slice(0, 80);

  const payload = {
    judul: safeTitle,
    kategori: MEMBER_PHOTO_CATEGORY,
    tanggal: memberKey,
    deskripsi: safeDesc,
    pengirim_nama: safeSender.length >= 2 ? safeSender : 'Siswa PPLG 3',
    image_url: finalImageUrl,
    status: 'pending',
  };

  const { error } = await client
    .from('photo_memories')
    .insert(payload);

  if (error) {
    throw new Error(`Gagal mengirim pengajuan foto siswa: ${error.message}`);
  }

  return {
    ...payload,
    created_at: new Date().toISOString(),
  };
}

/**
 * Admin: Unggah & langsung pasang (apply) foto profil Polaroid siswa
 */
export async function adminPublishMemberPhoto({
  memberKey,
  memberName,
  badgeLabel,
  catatan,
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

  const safeTitle = `Foto ${badgeLabel} · ${memberName}`.slice(0, 140);
  const safeDescRaw = (catatan || `Foto profil Polaroid ${memberName} (XII PPLG 3)`).trim();
  const safeDesc = safeDescRaw.length >= 5 ? safeDescRaw.slice(0, 800) : `${safeDescRaw} (XII PPLG 3)`;

  const { data, error } = await client
    .from('photo_memories')
    .insert({
      judul: safeTitle,
      kategori: MEMBER_PHOTO_CATEGORY,
      tanggal: memberKey,
      deskripsi: safeDesc,
      pengirim_nama: 'Admin XII PPLG 3',
      image_url: finalImageUrl,
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memasang foto siswa: ${error.message}`);
  }

  return data;
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

  const payload = {
    judul: judul.trim(),
    kategori: kategori.trim(),
    tanggal: tanggal.trim(),
    deskripsi: deskripsi.trim(),
    pengirim_nama: pengirimNama.trim(),
    image_url: finalImageUrl,
    status: 'pending',
  };

  const { error } = await client
    .from('photo_memories')
    .insert(payload);

  if (error) {
    throw new Error(`Gagal mengirim pengajuan foto: ${error.message}`);
  }

  return {
    ...payload,
    created_at: new Date().toISOString(),
  };
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

const PROFILE_SYNC_PREFIX = '__MEMBER_PROFILE_V1__:';
const PROFILE_PENDING_PREFIX = '__MEMBER_PROFILE_PENDING_V1__:';
const PROJECT_SYNC_PREFIX = '__STUDENT_PROJECT_V1__:';

/**
 * Konversi base64 dataURL (hasil kompresi canvas 400x400) ke Blob & unggah ke Supabase Storage
 */
export async function uploadDataUrlToStorage(dataUrl, prefix = 'profile') {
  if (!supabase || !dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const filePath = `submissions/${prefix}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('kenangan-photos')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type || 'image/jpeg',
      });
    if (uploadError) {
      return dataUrl;
    }
    const { data } = supabase.storage
      .from('kenangan-photos')
      .getPublicUrl(filePath);
    return data?.publicUrl || dataUrl;
  } catch {
    return dataUrl;
  }
}

/**
 * Ambil seluruh profil anggota yang telah diisi/diubah di database Supabase
 */
export async function fetchMemberProfilesFromDb() {
  if (!supabase) return {};
  const profileMap = {};

  // 1. Baca dari memory_notes fallback store (diurutkan dari terlama ke terbaru agar yang terbaru menimpa)
  try {
    const { data: noteRows } = await supabase
      .from('memory_notes')
      .select('*')
      .like('peran', `${PROFILE_SYNC_PREFIX}%`)
      .order('created_at', { ascending: true });

    (noteRows || []).forEach((row) => {
      try {
        const rawJson = row.peran.slice(PROFILE_SYNC_PREFIX.length);
        const parsed = JSON.parse(rawJson);
        if (parsed && parsed.id) {
          profileMap[String(parsed.id)] = parsed;
        }
      } catch {
        // abaikan baris yang gagal di-parse
      }
    });
  } catch {
    // abaikan jika gagal
  }

  // 2. Baca dari tabel member_profiles jika sudah dibuat di Supabase
  try {
    const { data: tableRows, error } = await supabase
      .from('member_profiles')
      .select('*')
      .order('updated_at', { ascending: true });

    if (!error && Array.isArray(tableRows)) {
      tableRows.forEach((row) => {
        if (row.member_id) {
          const prev = profileMap[String(row.member_id)] || {};
          const rawUltah = row.ultah || prev.ultah || '';
          const inferredYear =
            row.tahun_lahir ||
            prev.tahunLahir ||
            (rawUltah.split('-').length === 3 ? rawUltah.split('-')[0] : '');
          profileMap[String(row.member_id)] = {
            ...prev,
            id: Number(row.member_id),
            nama: row.nama,
            panggilan: row.panggilan || '',
            peran: row.peran || 'Anggota',
            minat: row.minat || '',
            ultah: rawUltah,
            tahunLahir: inferredYear,
            tahunAngkatan: row.tahun_angkatan || prev.tahunAngkatan || '2024–2027',
            bio: row.bio || '',
            github: row.github || '',
            portfolio: row.portfolio || '',
            foto: row.foto || '',
            status: row.status || 'aktif',
            updatedAt: row.updated_at,
          };
        }
      });
    }
  } catch {
    // tabel member_profiles belum ada, gunakan hasil dari fallback store
  }

  return profileMap;
}

/**
 * Simpan/perbarui profil anggota langsung ke database Supabase
 */
export async function saveMemberProfileToDb(profile) {
  const client = ensureClient();

  let finalFoto = profile.foto || '';
  if (finalFoto.startsWith('data:image')) {
    finalFoto = await uploadDataUrlToStorage(
      finalFoto,
      `avatar-member-${profile.id || 'new'}`
    );
  }

  const normalizedRecord = {
    id: Number(profile.id),
    nama: (profile.nama || '').trim(),
    panggilan: (profile.panggilan || '').trim(),
    peran: (profile.peran || 'Anggota').trim(),
    minat: (profile.minat || '').trim(),
    ultah: (profile.ultah || '').trim(),
    tahunLahir: (profile.tahunLahir || '').trim(),
    tahunAngkatan: (profile.tahunAngkatan || '2024–2027').trim(),
    bio: (profile.bio || '').trim(),
    github: (profile.github || '').trim(),
    portfolio: (profile.portfolio || '').trim(),
    foto: finalFoto,
    status: profile.status || 'aktif',
    updatedAt: new Date().toISOString(),
  };

  // 1. Coba upsert ke tabel member_profiles
  const { error: tableError } = await client
    .from('member_profiles')
    .upsert(
      {
        member_id: normalizedRecord.id,
        nama: normalizedRecord.nama,
        panggilan: normalizedRecord.panggilan,
        peran: normalizedRecord.peran,
        minat: normalizedRecord.minat,
        ultah: normalizedRecord.ultah,
        bio: normalizedRecord.bio,
        github: normalizedRecord.github,
        portfolio: normalizedRecord.portfolio,
        foto: normalizedRecord.foto,
        status: normalizedRecord.status,
        updated_at: normalizedRecord.updatedAt,
      },
      { onConflict: 'member_id' }
    );

  // Simpan juga ke fallback memory_notes agar field tambahan seperti tahunLahir & tahunAngkatan selalu sinkron 100%
  const safeNama = (normalizedRecord.nama || 'Anggota XII PPLG 3').slice(0, 80);
  const { error: fallbackError } = await client.from('memory_notes').insert({
    nama: safeNama.length >= 2 ? safeNama : 'Anggota PPLG 3',
    peran: `${PROFILE_SYNC_PREFIX}${JSON.stringify(normalizedRecord)}`,
    pesan: `UPDATE_PROFIL_ANGGOTA_${normalizedRecord.id}`,
  });

  if (tableError && fallbackError) {
    throw new Error(`Gagal menyimpan profil ke database: ${fallbackError.message}`);
  }

  return normalizedRecord;
}

/**
 * Siswa: Kirim pengajuan edit/isi profil anggota ke database (status: 'pending' menunggu konfirmasi Admin)
 */
export async function submitPendingMemberProfileToDb(profile) {
  const client = ensureClient();

  let finalFoto = profile.foto || '';
  if (finalFoto.startsWith('data:image')) {
    finalFoto = await uploadDataUrlToStorage(
      finalFoto,
      `pending-avatar-member-${profile.id || 'new'}`
    );
  }

  const pendingRecord = {
    id: Number(profile.id),
    nama: (profile.nama || '').trim(),
    panggilan: (profile.panggilan || '').trim(),
    peran: (profile.peran || 'Anggota').trim(),
    minat: (profile.minat || '').trim(),
    ultah: (profile.ultah || '').trim(),
    tahunLahir: (profile.tahunLahir || '').trim(),
    tahunAngkatan: (profile.tahunAngkatan || '2024–2027').trim(),
    bio: (profile.bio || '').trim(),
    github: (profile.github || '').trim(),
    portfolio: (profile.portfolio || '').trim(),
    foto: finalFoto,
    status: profile.status || 'aktif',
    approvalStatus: 'pending',
    submittedAt: new Date().toISOString(),
  };

  const safeNama = (pendingRecord.nama || 'Anggota XII PPLG 3').slice(0, 80);
  const { data, error } = await client
    .from('memory_notes')
    .insert({
      nama: safeNama.length >= 2 ? safeNama : 'Anggota PPLG 3',
      peran: `${PROFILE_PENDING_PREFIX}${JSON.stringify(pendingRecord)}`,
      pesan: `PENGAJUAN_PROFIL_ANGGOTA_${pendingRecord.id}`,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal mengirim pengajuan profil ke database: ${error.message}`);
  }

  return {
    ...pendingRecord,
    noteRowId: data?.id,
  };
}

/**
 * Ambil seluruh pengajuan edit profil anggota yang masih berstatus 'pending' (menunggu konfirmasi Admin)
 * Mengembalikan { list: [...], byMemberId: { [id]: pendingObj } }
 */
export async function fetchPendingMemberProfilesFromDb() {
  if (!supabase) return { list: [], byMemberId: {} };
  const byMemberId = {};

  try {
    const { data: noteRows, error } = await supabase
      .from('memory_notes')
      .select('*')
      .like('peran', `${PROFILE_PENDING_PREFIX}%`)
      .order('created_at', { ascending: true });

    if (error) {
      return { list: [], byMemberId: {} };
    }

    (noteRows || []).forEach((row) => {
      try {
        const rawJson = row.peran.slice(PROFILE_PENDING_PREFIX.length);
        const parsed = JSON.parse(rawJson);
        if (parsed && parsed.id) {
          const key = String(parsed.id);
          const prevRowIds = byMemberId[key]?.noteRowIds || [];
          byMemberId[key] = {
            ...parsed,
            noteRowId: row.id,
            noteRowIds: [...prevRowIds, row.id],
            submittedAt: parsed.submittedAt || row.created_at,
          };
        }
      } catch {
        // abaikan baris yang gagal di-parse
      }
    });
  } catch {
    // abaikan jika gagal
  }

  const list = Object.values(byMemberId).sort((a, b) =>
    String(b.submittedAt || '').localeCompare(String(a.submittedAt || ''))
  );

  return { list, byMemberId };
}

/**
 * Admin: Setujui (Konfirmasi & Terbitkan) pengajuan edit profil anggota
 */
export async function approvePendingMemberProfileInDb(pendingProfile) {
  const client = ensureClient();

  // 1. Simpan profil resmi ke database (status: approved)
  const approvedRecord = await saveMemberProfileToDb({
    ...pendingProfile,
    approvalStatus: 'approved',
  });

  // 2. Hapus seluruh baris antrean pending untuk anggota tersebut di memory_notes
  const rowIdsToDelete = Array.isArray(pendingProfile.noteRowIds) && pendingProfile.noteRowIds.length > 0
    ? pendingProfile.noteRowIds
    : pendingProfile.noteRowId
    ? [pendingProfile.noteRowId]
    : [];

  if (rowIdsToDelete.length > 0) {
    await client.from('memory_notes').delete().in('id', rowIdsToDelete);
  }

  return approvedRecord;
}

/**
 * Admin: Tolak & hapus pengajuan edit profil anggota dari antrean
 */
export async function rejectPendingMemberProfileInDb(pendingProfile) {
  const client = ensureClient();
  const rowIdsToDelete = Array.isArray(pendingProfile.noteRowIds) && pendingProfile.noteRowIds.length > 0
    ? pendingProfile.noteRowIds
    : pendingProfile.noteRowId
    ? [pendingProfile.noteRowId]
    : [];

  if (rowIdsToDelete.length > 0) {
    const { error } = await client
      .from('memory_notes')
      .delete()
      .in('id', rowIdsToDelete);
    if (error) {
      throw new Error(`Gagal menolak pengajuan profil: ${error.message}`);
    }
  }
  return true;
}

/**
 * Ambil seluruh proyek siswa dari database Supabase
 */
export async function fetchStudentProjectsFromDb() {
  if (!supabase) return [];
  const projectsById = new Map();

  // 1. Baca dari memory_notes fallback store
  try {
    const { data: noteRows } = await supabase
      .from('memory_notes')
      .select('*')
      .like('peran', `${PROJECT_SYNC_PREFIX}%`)
      .order('created_at', { ascending: false });

    (noteRows || []).forEach((row) => {
      try {
        const rawJson = row.peran.slice(PROJECT_SYNC_PREFIX.length);
        const parsed = JSON.parse(rawJson);
        if (parsed && parsed.id && !projectsById.has(String(parsed.id))) {
          projectsById.set(String(parsed.id), {
            ...parsed,
            dbNoteRowId: row.id,
          });
        }
      } catch {
        // abaikan
      }
    });
  } catch {
    // abaikan
  }

  // 2. Baca dari tabel student_projects jika sudah dibuat
  try {
    const { data: tableRows, error } = await supabase
      .from('student_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(tableRows)) {
      tableRows.forEach((row) => {
        const item = {
          id: String(row.id),
          judul: row.judul,
          deskripsi: row.deskripsi,
          kategori: row.kategori || 'Web App',
          teknologi: Array.isArray(row.teknologi) ? row.teknologi : [],
          memberIds: Array.isArray(row.member_ids)
            ? row.member_ids.map((n) => Number(n))
            : [],
          githubUrl: row.github_url || '',
          demoUrl: row.demo_url || '',
          statusRepo: row.status_repo || 'Public Repo · Active',
          tahun: row.tahun || '2026',
          createdAt: row.created_at,
        };
        projectsById.set(item.id, item);
      });
    }
  } catch {
    // gunakan fallback
  }

  return Array.from(projectsById.values());
}

/**
 * Simpan proyek siswa baru langsung ke database Supabase
 */
export async function saveStudentProjectToDb(projectInput) {
  const client = ensureClient();

  const teknologiArr = Array.isArray(projectInput.teknologi)
    ? projectInput.teknologi
    : String(projectInput.teknologi || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const memberIdsArr = Array.isArray(projectInput.memberIds)
    ? projectInput.memberIds.map((id) => Number(id)).filter(Boolean)
    : [];

  const record = {
    id: projectInput.id || `proj-${Date.now()}`,
    judul: (projectInput.judul || '').trim(),
    deskripsi: (projectInput.deskripsi || '').trim(),
    kategori: (projectInput.kategori || 'Web App').trim(),
    teknologi: teknologiArr,
    memberIds: memberIdsArr,
    githubUrl: (projectInput.githubUrl || 'https://github.com').trim(),
    demoUrl: (projectInput.demoUrl || '').trim(),
    statusRepo: (projectInput.statusRepo || 'Public Repo · Active').trim(),
    tahun: (projectInput.tahun || String(new Date().getFullYear())).trim(),
    createdAt: new Date().toISOString(),
  };

  // 1. Coba insert ke tabel student_projects
  const { data: insertedRow, error: tableError } = await client
    .from('student_projects')
    .insert({
      judul: record.judul,
      deskripsi: record.deskripsi,
      kategori: record.kategori,
      teknologi: record.teknologi,
      member_ids: record.memberIds,
      github_url: record.githubUrl,
      demo_url: record.demoUrl,
      status_repo: record.statusRepo,
      tahun: record.tahun,
    })
    .select()
    .single();

  if (!tableError && insertedRow) {
    return {
      ...record,
      id: String(insertedRow.id),
      createdAt: insertedRow.created_at,
    };
  }

  // 2. Fallback otomatis ke tabel memory_notes jika tabel student_projects belum dibuat
  const safeNama = (record.judul || 'Project XII PPLG 3').slice(0, 80);
  const { error: fallbackError } = await client.from('memory_notes').insert({
    nama: safeNama.length >= 2 ? safeNama : 'Project PPLG 3',
    peran: `${PROJECT_SYNC_PREFIX}${JSON.stringify(record)}`,
    pesan: `TAMBAH_PROJECT_${record.id}`,
  });

  if (fallbackError) {
    throw new Error(`Gagal menyimpan proyek ke database: ${fallbackError.message}`);
  }

  return record;
}

/**
 * Buku Kenangan: Ambil catatan/pesan angkatan (mengecualikan baris sinkronisasi profil & project)
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

  return (data || []).filter(
    (row) =>
      !String(row.peran || '').startsWith(PROFILE_SYNC_PREFIX) &&
      !String(row.peran || '').startsWith(PROFILE_PENDING_PREFIX) &&
      !String(row.peran || '').startsWith(PROJECT_SYNC_PREFIX)
  );
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
