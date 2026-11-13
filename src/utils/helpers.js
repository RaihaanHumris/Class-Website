import { daftarAnggota } from "../data/anggota";

/**
 * Mengambil 1-2 huruf inisial dari nama untuk avatar
 */
export function getInitials(name = "") {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (parts.includes("Siswa") && parts.length >= 3) {
    return `S${parts[parts.length - 1]}`;
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format string tanggal YYYY-MM-DD ke Bahasa Indonesia lengkap
 */
export function formatTanggalIndo(dateStr) {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Mengembalikan sapaan ramah sesuai jam saat ini
 */
export function getSapaanWaktu() {
  const jam = new Date().getHours();
  if (jam >= 4 && jam < 11) return "Selamat pagi";
  if (jam >= 11 && jam < 15) return "Selamat siang";
  if (jam >= 15 && jam < 18) return "Selamat sore";
  return "Selamat malam";
}

/**
 * Mengembalikan informasi hari ini
 */
export function getHariInfo() {
  const now = new Date();
  const dayIndex = now.getDay();
  const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const tanggalFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);

  return {
    nama: namaHari[dayIndex],
    index: dayIndex,
    isWeekend: dayIndex === 0, // Hanya Minggu yang libur penuh, karena Sabtu terdapat jadwal piket kelas
    tanggalLengkap: tanggalFormatted
  };
}

/**
 * Menghitung selisih hari tenggat waktu (human countdown)
 */
export function getCountdownTenggat(deadlineStr) {
  if (!deadlineStr) return { text: "-", status: "normal" };
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const target = new Date(deadlineStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Telah lewat", status: "expired" };
  }
  if (diffDays === 0) {
    return { text: "Hari ini!", status: "urgent" };
  }
  if (diffDays === 1) {
    return { text: "Besok!", status: "urgent" };
  }
  if (diffDays <= 3) {
    return { text: `${diffDays} hari lagi`, status: "soon" };
  }
  return { text: `${diffDays} hari lagi`, status: "normal" };
}

/**
 * Mengecek apakah sesi pelajaran sedang berlangsung saat ini
 * jamStr format contoh: "08.00 - 09.30"
 */
export function getStatusSesiMapel(jamStr) {
  if (!jamStr || !jamStr.includes("-")) {
    return { status: "upcoming", sisaMenit: null };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  try {
    const [startStr, endStr] = jamStr.split("-").map((s) => s.trim().replace(".", ":"));
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (currentMinutes >= startTotal && currentMinutes <= endTotal) {
      const sisa = endTotal - currentMinutes;
      return { status: "active", sisaMenit: sisa };
    }
    if (currentMinutes > endTotal) {
      return { status: "passed", sisaMenit: 0 };
    }
    return { status: "upcoming", sisaMenit: startTotal - currentMinutes };
  } catch {
    return { status: "upcoming", sisaMenit: null };
  }
}

/**
 * Mencari data siswa dari daftarAnggota berdasarkan ID
 */
export function getSiswaById(id) {
  return daftarAnggota.find((item) => item.id === Number(id)) || {
    id,
    nama: `Siswa #${id}`,
    peran: "Anggota",
    foto: "",
    minat: "PPLG"
  };
}
