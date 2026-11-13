import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Calendar,
  Megaphone,
  ArrowRight,
  Clock,
  Laptop,
  CheckCircle2,
  Quote,
  Layers,
  Compass,
  Terminal,
  Sparkles
} from 'lucide-react';
import Hero from '../components/common/Hero';
import StudentWall from '../components/features/StudentWall';
import { infoKelas } from '../data/kelas';
import { daftarAnggota } from '../data/anggota';

export default function Beranda() {
  const totalSiswa = daftarAnggota.length;

  return (
    <div className="w-full bg-[#FBF8FF] min-h-screen">
      
      {/* 1. Hero Section (Stitch Style) */}
      <Hero />

      {/* 2. Wave Divider SVG (Stitch Style) */}
      <div className="w-full overflow-hidden leading-none bg-[#FBF8FF] -mt-px select-none pointer-events-none">
        <svg
          className="block w-full h-12 md:h-16 text-[#0077B6] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 96"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {/* 3. Quick Stats Bar Floating Overlap (Stitch Style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full -mt-6 sm:-mt-8 relative z-20 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-full bg-white shadow-[0_8px_24px_rgba(3,4,94,0.08)] hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#90E0EF] flex items-center justify-center text-[#0077B6]">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-lg sm:text-xl text-[#03045E] font-bold tracking-tight">
                {totalSiswa} Siswa
              </span>
              <span className="text-xs text-slate-500 truncate">
                Calon Software Engineer & Game Dev
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-full bg-white shadow-[0_8px_24px_rgba(3,4,94,0.08)] hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#CAF0F8] flex items-center justify-center text-[#0077B6]">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-base sm:text-lg text-[#03045E] font-bold tracking-tight truncate">
                {infoKelas.waliKelas.nama}
              </span>
              <span className="text-xs text-slate-500 truncate">
                Wali Kelas Inspiratif
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-full bg-white shadow-[0_8px_24px_rgba(3,4,94,0.08)] hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#CAF0F8] flex items-center justify-center text-[#03045E]">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-lg sm:text-xl text-[#03045E] font-bold tracking-tight">
                TA {infoKelas.tahunAjaran}
              </span>
              <span className="text-xs text-slate-500 truncate">
                Semester Genap Berkelanjutan
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Section Pengumuman Terbaru (Stitch Style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-6 sm:py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077B6] tracking-wide uppercase">
              <Megaphone className="w-4 h-4" />
              <span>Papan Informasi Terpusat</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#03045E] mt-1">
              Pengumuman Terbaru
            </h2>
          </div>
          <Link
            to="/tugas"
            className="inline-flex items-center gap-1.5 text-[#0077B6] hover:text-[#03045E] font-semibold text-xs sm:text-sm group"
          >
            <span>Arsip Seluruh Agenda</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A */}
          <div className="flex flex-col justify-between p-6 rounded-[24px] bg-white shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all border border-slate-100">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#00B4D8] text-[#03045E] text-xs font-bold">
                  Penting
                </span>
                <span className="text-xs text-slate-400 font-medium">Batas: 7 Hari</span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#03045E] mb-2 leading-snug">
                Proyek Akhir Pemrograman Web Fullstack
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Setiap kelompok wajib menyelesaikan integrasi RESTful API, otentikasi JWT, dan dashboard responsif sebelum penilaian kurikulum pekan depan.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between bg-[#CAF0F8]/50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#03045E]">
                <Clock className="w-3.5 h-3.5 text-[#0077B6]" />
                <span>Senin, 08:00 WITA</span>
              </div>
              <Link to="/tugas" className="text-xs font-bold text-[#0077B6] hover:underline">
                Detail →
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="flex flex-col justify-between p-6 rounded-[24px] bg-white shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all border border-slate-100">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#90E0EF] text-[#03045E] text-xs font-bold">
                  Baru
                </span>
                <span className="text-xs text-slate-400 font-medium">Praktikum</span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#03045E] mb-2 leading-snug">
                Persiapan Ujian Praktik PBO & Game Dev
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Instalasi dependensi Godot Engine 4.x dan JDK 21 di workstation Lab 1 wajib disinkronisasikan sebelum gladi bersih hari Kamis.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between bg-[#CAF0F8]/50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#03045E]">
                <Laptop className="w-3.5 h-3.5 text-[#0077B6]" />
                <span>Lab Komputer 1</span>
              </div>
              <Link to="/jadwal" className="text-xs font-bold text-[#0077B6] hover:underline">
                Kisi-kisi →
              </Link>
            </div>
          </div>

          {/* Card C */}
          <div className="flex flex-col justify-between p-6 rounded-[24px] bg-white shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all border border-slate-100">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#CAF0F8] text-[#0077B6] text-xs font-bold">
                  Informasi
                </span>
                <span className="text-xs text-slate-400 font-medium">Kedisiplinan</span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#03045E] mb-2 leading-snug">
                Jadwal Piket Bersih Lab Komputer 2
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Regu piket harian bertanggung jawab mematikan seluruh terminal server mini, merapikan kabel peripheral, dan mengunci kabinet perangkat keras.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between bg-[#CAF0F8]/50 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#03045E]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0077B6]" />
                <span>Setiap Sore</span>
              </div>
              <Link to="/piket" className="text-xs font-bold text-[#0077B6] hover:underline">
                Cek Regu →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Section Suasana Kelas & Visual Galeri (Stitch Style - Grid 12 Kolom) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Media Photo 1 (4 Kolom) */}
          <div className="lg:col-span-4 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(3,4,94,0.08)] bg-white flex flex-col border border-slate-100">
            <div className="relative w-full h-56 bg-slate-100">
              <img
                className="w-full h-full object-cover"
                alt="Praktikum Siswa PPLG di Lab MAKN Ende"
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0077B6] text-white">
                  Laboratorium RPL
                </span>
                <div className="font-heading text-base font-bold text-white mt-1">
                  Sesi Coding Kolaboratif
                </div>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aktivitas harian pengerjaan sprint pengembangan software dan review baris kode bersama mentor di Lab MAKN Ende.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[#0077B6] text-xs font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Git Version Control · Linux Workstation</span>
              </div>
            </div>
          </div>

          {/* Center Feature: Kutipan Inspiratif & Filosofi Wali Kelas (5 Kolom) */}
          <div className="lg:col-span-5 rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(3,4,94,0.08)] flex flex-col justify-between relative overflow-hidden border border-slate-100">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#CAF0F8]/60 blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#CAF0F8] flex items-center justify-center text-[#0077B6] mb-4">
                <Quote className="w-6 h-6" />
              </div>
              <blockquote className="font-heading text-base sm:text-lg text-[#03045E] leading-relaxed mb-4 font-bold">
                “Baris demi baris logika yang kita susun hari ini adalah ikhtiar nyata santri kejuruan dalam menjemput peradaban digital Indonesia yang berkeadaban.”
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filosofi belajar XII PPLG 3 menekankan bahwa teknologi terbaik bukan hanya sekadar canggih, namun membawa maslahat dan kemudahan bagi sesama insan.
              </p>
            </div>
            <div className="relative z-10 pt-6 flex items-center gap-3.5 border-t border-slate-100 mt-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white font-heading font-extrabold text-base shadow-sm">
                UD
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm sm:text-base text-[#03045E] leading-tight">
                  {infoKelas.waliKelas.nama}
                </span>
                <span className="text-xs text-[#0077B6] font-medium">
                  {infoKelas.waliKelas.peran} · {infoKelas.sekolah}
                </span>
              </div>
            </div>
          </div>

          {/* Media Photo 2 & Mini Metrics: Visi Prestasi (3 Kolom) */}
          <div className="lg:col-span-3 rounded-[24px] bg-gradient-to-br from-[#0077B6] to-[#03045E] text-white p-6 shadow-[0_8px_24px_rgba(3,4,94,0.12)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Layers className="w-7 h-7 text-[#90E0EF]" />
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/15 text-[#CAF0F8]">
                  TA 2025/2026
                </span>
              </div>
              <h4 className="font-heading font-bold text-lg text-white mb-2">
                Visi Prestasi
              </h4>
              <p className="text-xs sm:text-sm text-[#CAF0F8]/90 leading-relaxed mb-4">
                Menghasilkan karya rekayasa perangkat lunak mandiri, siap sertifikasi kompetensi industri, dan berkarya untuk nusa bangsa.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between text-xs font-semibold text-[#CAF0F8]">
                <span>Siklus Sprint Semester</span>
                <span className="font-bold text-white font-mono">78%</span>
              </div>
              {/* Capsule Progress Tracker */}
              <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#CAF0F8] w-[78%] transition-all duration-500" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/70 mt-1">
                <span>Modul 01 - Dasar</span>
                <span>Uji Kompetensi Akhir</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Dinding Siswa Kelas */}
      <StudentWall />

      {/* 7. Interactive Filter/Pill Fast Navigation Helper (Stitch Style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full pb-16">
        <div className="p-6 rounded-[24px] bg-[#EEECFF]/60 border border-[#90E0EF]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#CAF0F8] flex items-center justify-center text-[#0077B6] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm sm:text-base text-[#03045E]">
                Ingin mengakses informasi spesifik?
              </span>
              <span className="text-xs text-slate-500">
                Jelajahi portal digital kelas XII PPLG 3 secara instan.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/anggota"
              className="px-4 py-2 rounded-full bg-white text-[#03045E] font-semibold text-xs shadow-xs hover:bg-[#CAF0F8] transition-colors"
            >
              Daftar Siswa
            </Link>
            <Link
              to="/piket"
              className="px-4 py-2 rounded-full bg-white text-[#03045E] font-semibold text-xs shadow-xs hover:bg-[#CAF0F8] transition-colors"
            >
              Jadwal Piket
            </Link>
            <Link
              to="/galeri"
              className="px-4 py-2 rounded-full bg-white text-[#03045E] font-semibold text-xs shadow-xs hover:bg-[#CAF0F8] transition-colors"
            >
              Galeri Kegiatan
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
