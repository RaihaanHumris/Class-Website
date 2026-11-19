import { daftarAnggota } from '../data/anggota';
import { daftarProjects } from '../data/projects';
import {
  isSupabaseConfigured,
  fetchMemberProfilesFromDb,
  saveMemberProfileToDb,
  fetchStudentProjectsFromDb,
  saveStudentProjectToDb,
} from '../lib/supabase';

const MEMBER_OVERRIDES_KEY = 'pplg3_member_overrides_v2';
const CUSTOM_MEMBERS_KEY = 'pplg3_custom_members_v2';
const ACTIVE_MEMBER_ID_KEY = 'pplg3_active_member_id_v2';
const CUSTOM_PROJECTS_KEY = 'pplg3_custom_projects_v2';
const BDAY_MODAL_DISMISSED_KEY = 'pplg3_bday_modal_dismissed_v2';

const BULAN_INDO = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function notifyMembersUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pplg3-members-updated'));
  }
}

export function getTodayMMDD(dateObj = new Date()) {
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

export function normalizeMMDD(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    const m = intInRange(parseInt(parts[1], 10), 1, 12);
    const d = intInRange(parseInt(parts[2], 10), 1, 31);
    if (!m || !d) return '';
    return `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  if (parts.length === 2) {
    const m = intInRange(parseInt(parts[0], 10), 1, 12);
    const d = intInRange(parseInt(parts[1], 10), 1, 31);
    if (!m || !d) return '';
    return `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return '';
}

function intInRange(val, min, max) {
  if (Number.isNaN(val) || val < min || val > max) return null;
  return val;
}

export function formatBirthdayIndonesian(mmdd) {
  const norm = normalizeMMDD(mmdd);
  if (!norm) return '';
  const [mStr, dStr] = norm.split('-');
  const mIdx = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);
  if (mIdx < 0 || mIdx > 11 || Number.isNaN(day)) return norm;
  return `${day} ${BULAN_INDO[mIdx]}`;
}

export function isBirthdayToday(mmdd, todayMMDD = getTodayMMDD()) {
  const norm = normalizeMMDD(mmdd);
  if (!norm) return false;
  return norm === todayMMDD;
}

export function readMemberOverrides() {
  try {
    const raw = localStorage.getItem(MEMBER_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function readCustomMembers() {
  try {
    const raw = localStorage.getItem(CUSTOM_MEMBERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getMergedMembers() {
  const overrides = readMemberOverrides();
  const customList = readCustomMembers();

  const mergedBase = daftarAnggota.map((member) => {
    const override = overrides[String(member.id)];
    if (!override) return member;
    return {
      ...member,
      ...override,
      id: member.id,
      isUpdatedLocal: true,
    };
  });

  return [...mergedBase, ...customList];
}

/**
 * Sinkronisasi data profil anggota dari database Supabase ke state lokal
 */
export async function syncMembersFromDatabase() {
  if (!isSupabaseConfigured) return getMergedMembers();
  try {
    const dbMap = await fetchMemberProfilesFromDb();
    if (!dbMap || Object.keys(dbMap).length === 0) {
      return getMergedMembers();
    }

    const overrides = readMemberOverrides();
    const customList = readCustomMembers();
    const baseIds = new Set(daftarAnggota.map((m) => Number(m.id)));

    Object.values(dbMap).forEach((dbProfile) => {
      const numId = Number(dbProfile.id);
      if (baseIds.has(numId)) {
        overrides[String(numId)] = {
          ...(overrides[String(numId)] || {}),
          ...dbProfile,
        };
      } else {
        const idx = customList.findIndex((c) => Number(c.id) === numId);
        if (idx !== -1) {
          customList[idx] = { ...customList[idx], ...dbProfile };
        } else {
          customList.push({ ...dbProfile, isCustomLocal: true });
        }
      }
    });

    localStorage.setItem(MEMBER_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(CUSTOM_MEMBERS_KEY, JSON.stringify(customList));
    notifyMembersUpdated();
    return getMergedMembers();
  } catch {
    return getMergedMembers();
  }
}

/**
 * Simpan profil anggota ke database Supabase sekaligus cache localStorage
 */
export async function saveMemberProfile(profileData) {
  const overrides = readMemberOverrides();
  const customList = readCustomMembers();

  const existingBase = daftarAnggota.find(
    (m) => Number(m.id) === Number(profileData.id)
  );

  let targetRecord = null;

  if (existingBase) {
    targetRecord = {
      ...existingBase,
      nama: (profileData.nama || existingBase.nama).trim(),
      panggilan: (profileData.panggilan || '').trim(),
      peran: (profileData.peran || existingBase.peran || 'Anggota').trim(),
      minat: (profileData.minat || '').trim(),
      foto: profileData.foto !== undefined ? profileData.foto : existingBase.foto,
      ultah: normalizeMMDD(profileData.ultah) || '',
      bio: (profileData.bio || '').trim(),
      github: (profileData.github || '').trim(),
      portfolio: (profileData.portfolio || '').trim(),
      status: existingBase.status || 'aktif',
      updatedAt: new Date().toISOString(),
    };
  } else {
    const existingCustomIdx = customList.findIndex(
      (m) => Number(m.id) === Number(profileData.id)
    );
    if (existingCustomIdx !== -1) {
      const prev = customList[existingCustomIdx];
      targetRecord = {
        ...prev,
        nama: (profileData.nama || prev.nama).trim(),
        panggilan: (profileData.panggilan || '').trim(),
        peran: (profileData.peran || prev.peran || 'Anggota').trim(),
        minat: (profileData.minat || '').trim(),
        foto: profileData.foto !== undefined ? profileData.foto : prev.foto,
        ultah: normalizeMMDD(profileData.ultah) || '',
        bio: (profileData.bio || '').trim(),
        github: (profileData.github || '').trim(),
        portfolio: (profileData.portfolio || '').trim(),
        status: prev.status || 'aktif',
        updatedAt: new Date().toISOString(),
      };
    } else {
      const allCurrent = getMergedMembers();
      const maxId = allCurrent.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 25);
      targetRecord = {
        id: maxId + 1,
        nama: (profileData.nama || 'Anggota Baru').trim(),
        panggilan: (profileData.panggilan || '').trim(),
        peran: (profileData.peran || 'Anggota').trim(),
        minat: (profileData.minat || '').trim(),
        foto: profileData.foto || '',
        status: profileData.status || 'aktif',
        ultah: normalizeMMDD(profileData.ultah) || '',
        bio: (profileData.bio || '').trim(),
        github: (profileData.github || '').trim(),
        portfolio: (profileData.portfolio || '').trim(),
        isCustomLocal: true,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Simpan langsung ke database Supabase jika terkonfigurasi
  if (isSupabaseConfigured) {
    const dbSaved = await saveMemberProfileToDb(targetRecord);
    targetRecord = {
      ...targetRecord,
      ...dbSaved,
    };
  }

  if (existingBase) {
    overrides[String(existingBase.id)] = targetRecord;
    localStorage.setItem(MEMBER_OVERRIDES_KEY, JSON.stringify(overrides));
  } else {
    const idx = customList.findIndex((c) => Number(c.id) === Number(targetRecord.id));
    if (idx !== -1) {
      customList[idx] = targetRecord;
    } else {
      customList.push(targetRecord);
    }
    localStorage.setItem(CUSTOM_MEMBERS_KEY, JSON.stringify(customList));
  }

  notifyMembersUpdated();
  return targetRecord;
}

export function getActiveMemberId() {
  try {
    const val = localStorage.getItem(ACTIVE_MEMBER_ID_KEY);
    return val ? Number(val) : null;
  } catch {
    return null;
  }
}

export function setActiveMemberId(memberId) {
  try {
    if (memberId === null || memberId === undefined || memberId === '') {
      localStorage.removeItem(ACTIVE_MEMBER_ID_KEY);
    } else {
      localStorage.setItem(ACTIVE_MEMBER_ID_KEY, String(memberId));
    }
    notifyMembersUpdated();
  } catch {
    // ignore storage errors
  }
}

export function isBirthdayModalDismissedToday(memberId, todayMMDD = getTodayMMDD()) {
  try {
    const raw = sessionStorage.getItem(BDAY_MODAL_DISMISSED_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed[`${memberId}_${todayMMDD}`] === true;
  } catch {
    return false;
  }
}

export function setBirthdayModalDismissedToday(memberId, todayMMDD = getTodayMMDD()) {
  try {
    const raw = sessionStorage.getItem(BDAY_MODAL_DISMISSED_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[`${memberId}_${todayMMDD}`] = true;
    sessionStorage.setItem(BDAY_MODAL_DISMISSED_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

/**
 * Compress and resize uploaded image file using HTML5 Canvas
 * Max dimensions: 400x400px, quality: 0.75 (JPEG)
 */
export function compressImageToDataUrl(file, maxWidth = 400, maxHeight = 400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak valid.'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia.'));
          return;
        }

        ctx.fillStyle = '#FAF6EE';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function getMergedProjects() {
  try {
    const raw = localStorage.getItem(CUSTOM_PROJECTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    return [...custom, ...daftarProjects];
  } catch {
    return daftarProjects;
  }
}

/**
 * Sinkronisasi daftar proyek siswa dari database Supabase
 */
export async function syncProjectsFromDatabase() {
  if (!isSupabaseConfigured) return getMergedProjects();
  try {
    const dbProjects = await fetchStudentProjectsFromDb();
    localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(dbProjects));
    notifyMembersUpdated();
    return [...dbProjects, ...daftarProjects];
  } catch {
    return getMergedProjects();
  }
}

/**
 * Simpan proyek siswa baru langsung ke database Supabase & cache lokal
 */
export async function saveCustomProject(projectInput) {
  let savedProject = {
    id: `proj-${Date.now()}`,
    judul: (projectInput.judul || '').trim(),
    deskripsi: (projectInput.deskripsi || '').trim(),
    kategori: projectInput.kategori || 'Web App',
    teknologi: Array.isArray(projectInput.teknologi)
      ? projectInput.teknologi
      : String(projectInput.teknologi || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    memberIds: Array.isArray(projectInput.memberIds)
      ? projectInput.memberIds.map((id) => Number(id))
      : [],
    githubUrl: (projectInput.githubUrl || 'https://github.com').trim(),
    demoUrl: (projectInput.demoUrl || '').trim(),
    statusRepo: (projectInput.statusRepo || 'Public Repo · Active').trim(),
    tahun: projectInput.tahun || String(new Date().getFullYear()),
    isCustomLocal: true,
  };

  if (isSupabaseConfigured) {
    savedProject = await saveStudentProjectToDb(savedProject);
  }

  try {
    const raw = localStorage.getItem(CUSTOM_PROJECTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    const filtered = custom.filter((p) => String(p.id) !== String(savedProject.id));
    const next = [savedProject, ...filtered];
    localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }

  notifyMembersUpdated();
  return savedProject;
}
