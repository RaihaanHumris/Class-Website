import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  FileCode2,
  FileText,
  Users,
  Images,
  CalendarDays,
  Cpu,
  ChevronRight,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { infoKelas } from '../../data/kelas';
import { siswaAktif, sahabatPindah } from '../../data/anggota';
import { albumGaleri } from '../../data/galeri';

const FOLDER_FILES = [
  {
    id: 'profil',
    name: 'profil-pplg3.md',
    kind: 'Dokumen Kelas',
    size: '14 KB',
    icon: FileText,
    iconColor: 'text-[#90E0EF]',
    badgeBg: 'bg-[#0077B6]/30 border-[#00B4D8]/40',
    title: `${infoKelas.nama} · ${infoKelas.jurusan}`,
    lines: [
      `Sekolah   : ${infoKelas.namaLengkapSekolah}`,
      `Angkatan  : ${infoKelas.tahunAjaran} (${infoKelas.angkatan})`,
      `Tagline   : "${infoKelas.tagline}"`,
    ],
    route: '/jejak',
    routeLabel: 'Lihat Jejak Kelas',
  },
  {
    id: 'anggota',
    name: 'data-25-sahabat.db',
    kind: 'Direktori Siswa',
    size: '42 KB',
    icon: Users,
    iconColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 border-amber-400/40',
    title: `${siswaAktif.length} Siswa Aktif + ${sahabatPindah.length} Sahabat Seperjuangan`,
    lines: [
      `Wali Kelas : ${infoKelas.waliKelas.nama}`,
      `Aktif      : ${siswaAktif.length} siswa XII PPLG 3`,
      `Kenangan   : Anshari, Akbar & Yuyun tetap tercatat`,
    ],
    route: '/anggota',
    routeLabel: 'Buka Daftar Anggota',
  },
  {
    id: 'kompetensi',
    name: 'kompetensi-rpl.json',
    kind: 'Kejuruan PPLG',
    size: '8 KB',
    icon: FileCode2,
    iconColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/20 border-cyan-400/40',
    title: 'Keahlian Pengembangan Perangkat Lunak & Gim',
    lines: [
      'Stack Web  : HTML, CSS, JavaScript, React & Laravel',
      'Basis Data : MySQL, PostgreSQL & Perancangan ERD',
      'Praktikum  : PBO, Pemrograman Web & Pengembangan Gim',
    ],
    route: '/jejak',
    routeLabel: 'Telusuri Kisah Lab',
  },
  {
    id: 'galeri',
    name: 'album-kenangan-3d.zip',
    kind: 'Arsip Foto',
    size: '128 MB',
    icon: Images,
    iconColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/40',
    title: `${albumGaleri.length}+ Dokumentasi Momen Kelas`,
    lines: [
      'Resmi      : Hari Pahlawan, Hari Guru & Foto Wali Kelas',
      'Pramuka    : Malam Api Unggun & Kemah Bersama',
      'Kejuruan   : After PWPB Ustadzah Ismi & Lab RPL',
    ],
    route: '/galeri',
    routeLabel: 'Buka Buku Album 3D',
  },
  {
    id: 'jadwal',
    name: 'catatan-lab-rpl.txt',
    kind: 'Agenda Praktik',
    size: '6 KB',
    icon: CalendarDays,
    iconColor: 'text-sky-300',
    badgeBg: 'bg-sky-500/20 border-sky-400/40',
    title: 'Rutinitas Laboratorium & Kebersamaan',
    lines: [
      'Seragam    : Wearpack kejuruan kebanggaan PPLG',
      'Aktivitas  : Ngoding bareng, debug tugas & classmeet',
      'Lokasi     : Lab Komputer RPL MAKN Ende',
    ],
    route: '/galeri',
    routeLabel: 'Lihat Foto Praktikum',
  },
  {
    id: 'wali',
    name: 'pesan-wali-kelas.txt',
    kind: 'Sambutan Wali',
    size: '4 KB',
    icon: Sparkles,
    iconColor: 'text-amber-200',
    badgeBg: 'bg-amber-400/15 border-amber-300/35',
    title: `Pesan ${infoKelas.waliKelas.nama}`,
    lines: [
      '"Kelas ini bukan hanya ruang mengetik baris kode,',
      'melainkan rumah tempat 25 kisah tumbuh bersama',
      'menuju masa depan yang gemilang."',
    ],
    route: '/anggota',
    routeLabel: 'Kenali Keluarga Kelas',
  },
];

export default function HeroLaptopFolder() {
  const [selectedId, setSelectedId] = useState(FOLDER_FILES[0].id);
  const activeFile = FOLDER_FILES.find((f) => f.id === selectedId) || FOLDER_FILES[0];

  return (
    <div className="w-full max-w-[540px] mx-auto lg:ml-auto select-none">
      {/* Bagian Layar Laptop (Screen Lid) */}
      <div className="relative rounded-t-2xl bg-[#101c3d] p-1.5 sm:p-2.5 border-2 border-[#334b80] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
        {/* Titik Kamera Webcam di Bezel Atas */}
        <div className="flex items-center justify-center mb-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[#060d21] border border-[#4f6fb3]/60 inline-flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="w-0.5 h-0.5 rounded-full bg-[#00B4D8]" />
          </span>
        </div>

        {/* Layar Desktop & Jendela Folder XII PPLG 3 */}
        <div className="rounded-lg overflow-hidden bg-[#06102b] border border-white/15">
          {/* Top Bar OS Mini */}
          <div className="px-2.5 sm:px-3 py-1.5 bg-[#03091d] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#00B4D8]" />
              <span className="font-semibold text-white">PPLG-OS</span>
            </div>
            <span className="text-[#90E0EF]/80 truncate">MAKN Ende · 2024–2027</span>
          </div>

          {/* Jendela File Explorer yang sedang membuka Folder XII PPLG 3 */}
          <div className="m-1.5 sm:m-2.5 rounded-lg bg-[#0b1b45] border border-[#00B4D8]/30 overflow-hidden shadow-inner">
            {/* Titlebar Jendela Folder */}
            <div className="px-2.5 sm:px-3 py-2 bg-[#081538] border-b border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 inline-block" />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white min-w-0">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400 hidden sm:inline">Arsip</span>
                <ChevronRight className="w-3 h-3 text-slate-500 hidden sm:inline shrink-0" />
                <span className="font-bold text-[#90E0EF] truncate">XII PPLG 3</span>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {FOLDER_FILES.length} file
              </span>
            </div>

            {/* Body Explorer: Sidebar Mini + Daftar File dalam Folder XII PPLG 3 */}
            <div className="grid grid-cols-12">
              {/* Sidebar Lokasi Folder */}
              <div className="hidden sm:flex sm:col-span-4 flex-col gap-1 p-2 bg-[#071230] border-r border-white/10 text-[11px]">
                <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-400">
                  Direktori
                </span>
                <div className="px-2 py-1.5 rounded-md bg-[#0077B6]/35 border border-[#00B4D8]/40 text-white font-semibold flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">XII PPLG 3</span>
                </div>
                <div className="px-2 py-1.5 rounded-md text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
                  <span className="truncate">Lab RPL</span>
                </div>
                <div className="mt-auto pt-2 border-t border-white/10 px-2 text-[10px] font-mono text-slate-400 leading-tight">
                  22 Siswa Aktif
                  <br />3 Sahabat Pindah
                </div>
              </div>

              {/* Grid Isi File Folder XII PPLG 3 */}
              <div className="col-span-12 sm:col-span-8 p-2 sm:p-2.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {FOLDER_FILES.map((file) => {
                    const Icon = file.icon;
                    const isSelected = file.id === activeFile.id;
                    return (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => setSelectedId(file.id)}
                        className={`text-left p-2 rounded-lg border transition-colors cursor-pointer flex items-center sm:items-start gap-2 min-w-0 min-h-[46px] ${
                          isSelected
                            ? 'bg-[#0077B6]/40 border-[#00B4D8] text-white'
                            : 'bg-[#081436]/80 border-white/10 text-slate-200 hover:bg-[#0f2357] hover:border-white/25'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border flex items-center justify-center shrink-0 ${file.badgeBg}`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${file.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10.5px] sm:text-[11px] font-mono font-semibold truncate text-white">
                            {file.name}
                          </p>
                          <p className="text-[9.5px] sm:text-[10px] text-slate-400 truncate">
                            {file.kind}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panel Pratinjau Isi File Terpilih tentang PPLG 3 */}
            <div className="px-2.5 sm:px-3 py-2.5 bg-[#050d26] border-t border-white/10 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <p className="text-xs font-semibold text-[#90E0EF] truncate">
                  {activeFile.title}
                </p>
                <Link
                  to={activeFile.route}
                  className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center gap-0.5 shrink-0"
                >
                  <span>{activeFile.routeLabel}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="font-mono text-[10px] sm:text-[10.5px] leading-relaxed text-slate-200 space-y-0.5">
                {activeFile.lines.map((line, i) => (
                  <p key={i} className="break-words sm:truncate">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bodi Bawah / Engsel Laptop (tanpa negative margin di mobile agar tidak overflow) */}
      <div className="relative mx-0 sm:mx-[-18px] h-3.5 sm:h-5 rounded-b-xl bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#475569] border-t border-white/50 shadow-xl flex items-start justify-center">
        <div className="w-14 sm:w-20 h-1.5 rounded-b-md bg-[#334155]/90" />
      </div>
      <div className="mx-6 h-2.5 rounded-full bg-black/45 blur-md" aria-hidden="true" />
    </div>
  );
}
