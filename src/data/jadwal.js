/**
 * CONTOH DATA JADWAL PELAJARAN KELAS XII PPLG 3
 * CATATAN: Jadwal di bawah ini merupakan data contoh mata pelajaran kejuruan PPLG & umum.
 * Anda dapat menyesuaikan jam, nama mata pelajaran, dan pengampu sesuai roster asli kelas.
 */

export const jadwalMingguan = [
  {
    hari: "Senin",
    dayIndex: 1, // 1 = Senin (sesuai Date.getDay())
    mapel: [
      { jam: "07.15 - 08.00", nama: "Upacara Bendera", guru: "Pembina Upacara", ruang: "Lapangan" },
      { jam: "08.00 - 09.30", nama: "Pemrograman Web (Frontend & React)", guru: "Guru Pengampu Web", ruang: "Lab Komputer 1" },
      { jam: "09.30 - 09.45", nama: "Istirahat I", guru: "-", ruang: "-" },
      { jam: "09.45 - 11.45", nama: "Pemrograman Berorientasi Objek (PBO)", guru: "Guru Pengampu PBO", ruang: "Lab Komputer 1" },
      { jam: "11.45 - 12.45", nama: "Ishoma (Istirahat, Sholat, Makan)", guru: "-", ruang: "Masjid" },
      { jam: "12.45 - 14.15", nama: "Pendidikan Agama Islam (PAI)", guru: "Guru PAI", ruang: "Ruang XII PPLG 3" }
    ]
  },
  {
    hari: "Selasa",
    dayIndex: 2,
    mapel: [
      { jam: "07.30 - 09.30", nama: "Basis Data & Cloud Database", guru: "Guru Basis Data", ruang: "Lab Komputer 2" },
      { jam: "09.30 - 09.45", nama: "Istirahat I", guru: "-", ruang: "-" },
      { jam: "09.45 - 11.45", nama: "Pemrograman Gim (Unity/Godot)", guru: "Guru Pengampu Gim", ruang: "Lab Multimedia" },
      { jam: "11.45 - 12.45", nama: "Ishoma", guru: "-", ruang: "Masjid" },
      { jam: "12.45 - 14.15", nama: "Matematika Terapan", guru: "Guru Matematika", ruang: "Ruang XII PPLG 3" }
    ]
  },
  {
    hari: "Rabu",
    dayIndex: 3,
    mapel: [
      { jam: "07.30 - 09.30", nama: "Pemrograman Web (Backend & API)", guru: "Guru Pengampu Web", ruang: "Lab Komputer 1" },
      { jam: "09.30 - 09.45", nama: "Istirahat I", guru: "-", ruang: "-" },
      { jam: "09.45 - 11.45", nama: "Bahasa Inggris Komunikasi & IT", guru: "Guru B. Inggris", ruang: "Ruang XII PPLG 3" },
      { jam: "11.45 - 12.45", nama: "Ishoma", guru: "-", ruang: "Masjid" },
      { jam: "12.45 - 14.15", nama: "Bahasa Indonesia (Karya Tulis Ilmiah)", guru: "Guru B. Indonesia", ruang: "Ruang XII PPLG 3" }
    ]
  },
  {
    hari: "Kamis",
    dayIndex: 4,
    mapel: [
      { jam: "07.30 - 09.30", nama: "Pemrograman Berorientasi Objek (Lanjut)", guru: "Guru Pengampu PBO", ruang: "Lab Komputer 1" },
      { jam: "09.30 - 09.45", nama: "Istirahat I", guru: "-", ruang: "-" },
      { jam: "09.45 - 11.45", nama: "Pemodelan Perangkat Lunak (UML/Agile)", guru: "Guru Analis Sistem", ruang: "Lab Komputer 2" },
      { jam: "11.45 - 12.45", nama: "Ishoma", guru: "-", ruang: "Masjid" },
      { jam: "12.45 - 14.15", nama: "Produk Kreatif & Kewirausahaan (PKK)", guru: "Guru PKK", ruang: "Ruang XII PPLG 3" }
    ]
  },
  {
    hari: "Jumat",
    dayIndex: 5,
    mapel: [
      { jam: "07.00 - 07.45", nama: "Senam Pagi & Kebersihan Lingkungan", guru: "Tim Kesiswaan", ruang: "Halaman Madrasah" },
      { jam: "07.45 - 09.15", nama: "Proyek Kreatif Pemrograman Gim", guru: "Guru Pengampu Gim", ruang: "Lab Multimedia" },
      { jam: "09.15 - 09.30", nama: "Istirahat", guru: "-", ruang: "-" },
      { jam: "09.30 - 11.00", nama: "Kajian Keagamaan & Al-Qur'an Hadits", guru: "Ustadz Pembina", ruang: "Masjid" }
    ]
  }
];
