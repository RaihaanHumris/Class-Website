import { daftarAnggota } from '../data/anggota';
import { daftarProjects } from '../data/projects';
import {
  isSupabaseConfigured,
  fetchMemberProfilesFromDb,
  submitPendingMemberProfileToDb,
  fetchPendingMemberProfilesFromDb,
  fetchStudentProjectsFromDb,
  saveStudentProjectToDb,
} from '../lib/supabase';

const MEMBER_OVERRIDES_KEY = 'pplg3_member_overrides_v2';
const PENDING_MEMBER_SUBMISSIONS_KEY = 'pplg3_pending_member_submissions_v2';
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

function intInRange(val, min, max) {
  if (Number.isNaN(val) || val < min || val > max) return null;
  return val;
}

export function parseBirthdayParts(input, explicitYear = '') {
  const cleanYear = String(explicitYear || '').trim();
  const validExplicitYear = /^\d{4}$/.test(cleanYear)
    ? String(intInRange(parseInt(cleanYear, 10), 1990, 2030) || '')
    : '';

  if (!input || typeof input !== 'string') {
    return { year: validExplicitYear, month: '', day: '', mmdd: '', full: '' };
  }

  const trimmed = input.trim();
  const parts = trimmed.split('-');

  if (parts.length === 3) {
    const yRaw = parseInt(parts[0], 10);
    const y = intInRange(yRaw, 1990, 2030);
    const m = intInRange(parseInt(parts[1], 10), 1, 12);
    const d = intInRange(parseInt(parts[2], 10), 1, 31);
    const yearStr = y ? String(y) : validExplicitYear;
    if (!m || !d) {
      return { year: yearStr, month: '', day: '', mmdd: '', full: '' };
    }
    const mStr = String(m).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const mmdd = `${mStr}-${dStr}`;
    const full = yearStr ? `${yearStr}-${mmdd}` : mmdd;
    return { year: yearStr, month: mStr, day: dStr, mmdd, full };
  }

  if (parts.length === 2) {
    const m = intInRange(parseInt(parts[0], 10), 1, 12);
    const d = intInRange(parseInt(parts[1], 10), 1, 31);
    if (!m || !d) {
      return { year: validExplicitYear, month: '', day: '', mmdd: '', full: '' };
    }
    const mStr = String(m).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const mmdd = `${mStr}-${dStr}`;
    const full = validExplicitYear ? `${validExplicitYear}-${mmdd}` : mmdd;
    return { year: validExplicitYear, month: mStr, day: dStr, mmdd, full };
  }

  return { year: validExplicitYear, month: '', day: '', mmdd: '', full: '' };
}

export function normalizeBirthdayValue(input, explicitYear = '') {
  return parseBirthdayParts(input, explicitYear).full;
}

export function normalizeMMDD(input) {
  return parseBirthdayParts(input).mmdd;
}

export function formatBirthdayIndonesian(ultah, explicitYear = '') {
  const { year, mmdd } = parseBirthdayParts(ultah, explicitYear);
  if (!mmdd) return year ? `Tahun ${year}` : '';
  const [mStr, dStr] = mmdd.split('-');
  const mIdx = parseInt(mStr, 10) - 1;
  const day = parseInt(dStr, 10);
  if (mIdx < 0 || mIdx > 11 || Number.isNaN(day)) return ultah;
  return year ? `${day} ${BULAN_INDO[mIdx]} ${year}` : `${day} ${BULAN_INDO[mIdx]}`;
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

export function readPendingMemberSubmissions() {
  try {
    const raw = localStorage.getItem(PENDING_MEMBER_SUBMISSIONS_KEY);
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
  const pendingMap = readPendingMemberSubmissions();
  const customList = readCustomMembers();

  const mergedBase = daftarAnggota.map((member) => {
    const key = String(member.id);
    const override = overrides[key];
    const pendingProfile = pendingMap[key] || null;
    const baseWithApproved = override
      ? {
          ...member,
          ...override,
          id: member.id,
          isApprovedProfile: true,
        }
      : member;

    return {
      ...baseWithApproved,
      hasPendingApproval: Boolean(pendingProfile),
      pendingProfile,
    };
  });

  const mergedCustom = customList.map((member) => {
    const key = String(member.id);
    const pendingProfile = pendingMap[key] || null;
    return {
      ...member,
      hasPendingApproval: Boolean(pendingProfile),
      pendingProfile,
    };
  });

  return [...mergedBase, ...mergedCustom];
}

/**
 * Sinkronisasi data profil anggota (yang sudah disetujui Admin & yang masih menunggu konfirmasi) dari database Supabase
 */
export async function syncMembersFromDatabase() {
  if (!isSupabaseConfigured) return getMergedMembers();
  try {
    const [dbMap, pendingRes] = await Promise.all([
      fetchMemberProfilesFromDb(),
      fetchPendingMemberProfilesFromDb(),
    ]);

    const overrides = {};
    const customList = [];
    const baseIds = new Set(daftarAnggota.map((m) => Number(m.id)));

    Object.values(dbMap || {}).forEach((dbProfile) => {
      const numId = Number(dbProfile.id);
      if (baseIds.has(numId)) {
        overrides[String(numId)] = {
          ...dbProfile,
          isApprovedProfile: true,
        };
      } else {
        customList.push({
          ...dbProfile,
          isCustomLocal: true,
          isApprovedProfile: true,
        });
      }
    });

    const pendingByMemberId = pendingRes?.byMemberId || {};

    localStorage.setItem(MEMBER_OVERRIDES_KEY, JSON.stringify(overrides));
    localStorage.setItem(CUSTOM_MEMBERS_KEY, JSON.stringify(customList));
    localStorage.setItem(PENDING_MEMBER_SUBMISSIONS_KEY, JSON.stringify(pendingByMemberId));
    notifyMembersUpdated();
    return getMergedMembers();
  } catch {
    return getMergedMembers();
  }
}

/**
 * Kirim pengajuan edit/isi profil anggota ke database untuk menunggu konfirmasi Admin
 */
export async function saveMemberProfile(profileData) {
  const pendingMap = readPendingMemberSubmissions();

  const existingBase = daftarAnggota.find(
    (m) => Number(m.id) === Number(profileData.id)
  );

  const parsedBday = parseBirthdayParts(profileData.ultah, profileData.tahunLahir);
  const fullUltah = parsedBday.full || '';
  const tahunLahirVal = parsedBday.year || (profileData.tahunLahir || '').trim();
  const tahunAngkatanVal = (profileData.tahunAngkatan || '2024–2027').trim();

  const allCurrent = getMergedMembers();
  const maxId = allCurrent.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 25);
  const targetId = existingBase
    ? existingBase.id
    : profileData.id
    ? Number(profileData.id)
    : maxId + 1;

  let targetRecord = {
    id: targetId,
    nama: (profileData.nama || existingBase?.nama || 'Anggota Baru').trim(),
    panggilan: (profileData.panggilan || '').trim(),
    peran: (profileData.peran || existingBase?.peran || 'Anggota').trim(),
    minat: (profileData.minat || '').trim(),
    foto:
      profileData.foto !== undefined
        ? profileData.foto
        : existingBase?.foto || '',
    ultah: fullUltah,
    tahunLahir: tahunLahirVal,
    tahunAngkatan: tahunAngkatanVal,
    bio: (profileData.bio || '').trim(),
    github: (profileData.github || '').trim(),
    portfolio: (profileData.portfolio || '').trim(),
    status: existingBase?.status || profileData.status || 'aktif',
    approvalStatus: 'pending',
    isPendingApproval: true,
    submittedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const dbPending = await submitPendingMemberProfileToDb(targetRecord);
    targetRecord = {
      ...targetRecord,
      ...dbPending,
      approvalStatus: 'pending',
      isPendingApproval: true,
    };
  }

  pendingMap[String(targetRecord.id)] = targetRecord;
  localStorage.setItem(PENDING_MEMBER_SUBMISSIONS_KEY, JSON.stringify(pendingMap));

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
