/**
 * DATA KELUARGA BESAR KELAS XII PPLG 3 - MAKN ENDE
 * 22 Siswa Aktif Angkatan 2025/2026 + 3 Sahabat Seperjuangan (Pindah Sekolah)
 */

export const daftarAnggota = [
  { id: 1, nama: "Afni Damayanti", peran: "Anggota", foto: "", minat: "Frontend Developer", status: "aktif" },
  { id: 2, nama: "Akbar Karim Adang", peran: "Anggota", foto: "", minat: "Backend Developer", status: "aktif" },
  { id: 3, nama: "Ali Abdillah Mutawab", peran: "Anggota", foto: "", minat: "Full-Stack Web", status: "aktif" },
  { id: 4, nama: "Alif Firmansyah Prenje", peran: "Anggota", foto: "", minat: "Game Development", status: "aktif" },
  { id: 5, nama: "Aziza Ony Badu", peran: "Anggota", foto: "", minat: "UI/UX Design", status: "aktif" },
  { id: 6, nama: "Bani Wahdiani", peran: "Anggota", foto: "", minat: "Database Administration", status: "aktif" },
  { id: 7, nama: "Babby Aulia Maharani", peran: "Bendahara", foto: "", minat: "Frontend Developer", status: "aktif" },
  { id: 8, nama: "Dian Safitri Syarif", peran: "Anggota", foto: "", minat: "Financial IT & Systems", status: "aktif" },
  { id: 9, nama: "Farisul Fahmi", peran: "Anggota", foto: "", minat: "DevOps & Cloud", status: "aktif" },
  { id: 10, nama: "Hafiza Aulia Ibrahim", peran: "Anggota", foto: "", minat: "System Analyst & Web", status: "aktif" },
  { id: 11, nama: "Hania Latif", peran: "Anggota", foto: "", minat: "Mobile App Developer", status: "aktif" },
  { id: 12, nama: "Inayah", peran: "Anggota", foto: "", minat: "Quality Assurance & Web", status: "aktif" },
  { id: 13, nama: "Kholid Usman Abdul salam", peran: "Anggota", foto: "", minat: "Cyber Security & Networks", status: "aktif" },
  { id: 14, nama: "Laila Mulyani", peran: "Anggota", foto: "", minat: "Web Design", status: "aktif" },
  { id: 15, nama: "Muhammad Rafsyan", peran: "Anggota", foto: "", minat: "Backend Developer", status: "aktif" },
  { id: 16, nama: "Mufidah Abdi Rasti", peran: "Anggota", foto: "", minat: "3D Game Asset & Art", status: "aktif" },
  { id: 17, nama: "Muhammad Raihaan Humris", peran: "Ketua Kelas", foto: "", minat: "Full-Stack & Software Eng.", status: "aktif" },
  { id: 18, nama: "Nur Masitah Ina Tena", peran: "Anggota", foto: "", minat: "Frontend Developer", status: "aktif" },
  { id: 19, nama: "Putri Sazqiah", peran: "Anggota", foto: "", minat: "UI/UX Research", status: "aktif" },
  { id: 20, nama: "Salsabila", peran: "Anggota", foto: "", minat: "Game Programmer", status: "aktif" },
  { id: 21, nama: "Yunitha Olivia Putri", peran: "Sekretaris", foto: "", minat: "Database & Backend", status: "aktif" },
  { id: 22, nama: "Yusuf", peran: "Wakil Ketua Kelas", foto: "", minat: "Mobile & Web Developer", status: "aktif" },

  // 3 Sahabat Seperjuangan Spesial (Sebelumnya bersama di PPLG 3, kemudian pindah sekolah)
  {
    id: 23,
    nama: "Anshari Ramadan",
    peran: "Sahabat Seperjuangan",
    foto: "",
    minat: "Pernah Bersama di PPLG 3",
    status: "pindah",
    isSpecialAlumni: true,
    periode: "Masa Awal PPLG 3",
    catatanKenangan:
      "Pernah melangkah dan belajar bersama di barisan awal PPLG 3 sebelum melanjutkan perjalanan pendidikan ke sekolah baru. Jejak tawa dan kebersamaan tetap tersimpan hangat dalam album kelas kami.",
  },
  {
    id: 24,
    nama: "Muhammad Akbar Lafitriansyah",
    peran: "Sahabat Seperjuangan",
    foto: "",
    minat: "Pernah Bersama di PPLG 3",
    status: "pindah",
    isSpecialAlumni: true,
    periode: "Masa Awal PPLG 3",
    catatanKenangan:
      "Tawa di sela jam praktikum dan persahabatan sejak bangku awal kelas menjadi kenangan berharga yang tak tergantikan meski kini menempuh sekolah di tempat yang berbeda.",
  },
  {
    id: 25,
    nama: "Yuyun Anggaraini Adelia Hasti",
    peran: "Sahabat Seperjuangan",
    foto: "",
    minat: "Pernah Bersama di PPLG 3",
    status: "pindah",
    isSpecialAlumni: true,
    periode: "Masa Awal PPLG 3",
    catatanKenangan:
      "Kehangatan cerita, kekompakan kelas, dan momen awal perjuangan di MAKN Ende bersama PPLG 3 akan selalu dikenang. Jarak pindah sekolah tak pernah menghapus arti persaudaraan kita.",
  },
];

export const sahabatPindah = daftarAnggota.filter((a) => a.status === "pindah");
export const siswaAktif = daftarAnggota.filter((a) => a.status === "aktif");
