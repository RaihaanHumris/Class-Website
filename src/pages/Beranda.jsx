import React, { useState, useRef } from 'react';
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
  Sparkles,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Hero from '../components/common/Hero';
import StudentWall from '../components/features/StudentWall';
import Lightbox from '../components/common/Lightbox';
import { infoKelas } from '../data/kelas';
import { daftarAnggota } from '../data/anggota';
import { albumGaleri } from '../data/galeri';

export default function Beranda() {
  const totalSiswa = daftarAnggota.length;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Mouse drag state untuk desktop swipe & scroll
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleOpenLightbox = (index) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth >= 768 ? 380 : 310;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth >= 768 ? 380 : 310;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse Drag Handlers untuk Desktop Drag-to-Scroll
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  // Data pengurus kelas untuk Struktur Organisasi
  const pengurusData = infoKelas.pengurus.map((p) => {
    const anggota = daftarAnggota.find((a) => a.id === p.idAnggota);
    return {
      peran: p.peran,
      nama: anggota ? anggota.nama : '-',
      minat: anggota ? anggota.minat : '',
    };
  });

  // Icon & warna untuk setiap peran pengurus
  const peranStyle = {
    'Ketua Kelas': {
      icon: Sparkles,
      gradient: 'from-[#03045E] to-[#0077B6]',
      iconBg: 'bg-[#90E0EF]',
      iconColor: 'text-[#03045E]',
    },
    'Wakil Ketua Kelas': {
      icon: Users,
      gradient: 'from-[#0077B6] to-[#00B4D8]',
      iconBg: 'bg-[#CAF0F8]',
      iconColor: 'text-[#0077B6]',
    },
    'Sekretaris': {
      icon: Layers,
      gradient: 'from-[#00B4D8] to-[#90E0EF]',
      iconBg: 'bg-[#CAF0F8]',
      iconColor: 'text-[#0077B6]',
    },
    'Bendahara': {
      icon: CheckCircle2,
      gradient: 'from-[#0077B6] to-[#03045E]',
      iconBg: 'bg-[#90E0EF]',
      iconColor: 'text-[#03045E]',
    },
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Wave Divider SVG */}
      <div className="w-full overflow-hidden leading-none bg-slate-50 -mt-px select-none pointer-events-none">
        <svg
          className="block w-full h-12 md:h-16 text-[#0077B6] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 96"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {/* 3. Quick Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full -mt-6 sm:-mt-8 relative z-20 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-full bg-white shadow-[0_8px_24px_rgba(3,4,94,0.08)] hover:shadow-md transition-shadow border border-slate-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#90E0EF] flex items-center justify-center text-[#03045E]">
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#90E0EF] flex items-center justify-center text-[#03045E]">
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#90E0EF] flex items-center justify-center text-[#03045E]">
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

      {/* 4. Section Pengumuman Terbaru */}
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
                <span className="px-3 py-1 rounded-full bg-[#03045E] text-white text-xs font-bold">
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
                <span className="px-3 py-1 rounded-full bg-[#0077B6] text-white text-xs font-bold">
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
                <span className="px-3 py-1 rounded-full bg-[#00B4D8] text-white text-xs font-bold">
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

      {/* 5. Section Foto Kenangan Highlight Slider (Horizontal Carousel di Desktop & Mobile) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-14">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077B6] tracking-wide uppercase">
              <Camera className="w-4 h-4" />
              <span>Highlight Dokumentasi & Memori</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#03045E] mt-1">
              Foto Kenangan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Sorotan momen berharga, kepanduan pramuka, dan hari-hari bersejarah seluruh siswa {infoKelas.nama} di {infoKelas.sekolah}.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Tombol Navigasi Slider Kiri / Kanan (Tampil di Desktop & Mobile) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#03045E] flex items-center justify-center shadow-xs hover:bg-[#CAF0F8] hover:border-[#00B4D8] active:scale-95 transition-all cursor-pointer"
                aria-label="Geser ke foto sebelumnya"
                title="Foto Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5 text-[#0077B6]" />
              </button>
              <button
                type="button"
                onClick={handleScrollRight}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#03045E] flex items-center justify-center shadow-xs hover:bg-[#CAF0F8] hover:border-[#00B4D8] active:scale-95 transition-all cursor-pointer"
                aria-label="Geser ke foto berikutnya"
                title="Foto Berikutnya"
              >
                <ChevronRight className="w-5 h-5 text-[#0077B6]" />
              </button>
            </div>

            <Link
              to="/galeri"
              className="inline-flex items-center gap-1.5 text-[#0077B6] hover:text-[#03045E] font-semibold text-xs sm:text-sm group cursor-pointer px-3 py-2 rounded-full hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            >
              <span>Semua Galeri</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Highlight Slider Track dengan Floating Arrows & Drag Support */}
        <div className="relative group/carousel">
          {/* Floating Arrow Left (Desktop) */}
          <button
            type="button"
            onClick={handleScrollLeft}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#03045E] shadow-lg border border-slate-200 hover:bg-[#CAF0F8] hover:text-[#0077B6] hover:scale-105 active:scale-95 items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-6 h-6 text-[#0077B6]" />
          </button>

          {/* Floating Arrow Right (Desktop) */}
          <button
            type="button"
            onClick={handleScrollRight}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#03045E] shadow-lg border border-slate-200 hover:bg-[#CAF0F8] hover:text-[#0077B6] hover:scale-105 active:scale-95 items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-6 h-6 text-[#0077B6]" />
          </button>

          {/* Carousel / Slider dengan Efek Slide & Snapping Halus */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`flex gap-5 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {albumGaleri.map((foto, idx) => (
              <div
                key={foto.id}
                onClick={() => {
                  if (!hasDragged) handleOpenLightbox(idx);
                }}
                className="w-[82vw] sm:w-[340px] md:w-[350px] lg:w-[360px] shrink-0 snap-start group/card bg-white border border-slate-100 rounded-[24px] overflow-hidden cursor-pointer hover:border-[#0077B6]/40 transition-all shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={foto.thumb}
                    alt={foto.judul}
                    loading="lazy"
                    draggable="false"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold text-white bg-[#0077B6]/90 px-3 py-1 rounded-full backdrop-blur-sm">
                      Perbesar Foto ↗
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-[#0077B6] uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#CAF0F8] border border-[#90E0EF]/60">
                        {foto.kategori}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {foto.tanggal}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#03045E] line-clamp-1 group-hover/card:text-[#0077B6] transition-colors">
                      {foto.judul}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {foto.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Petunjuk Interaksi & Keterangan Geser */}
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0077B6] font-medium bg-[#CAF0F8]/50 py-1 px-3.5 rounded-full border border-[#90E0EF]/50">
            <span className="sm:hidden">⟵ Geser ke kanan atau kiri untuk melihat foto lainnya ⟶</span>
            <span className="hidden sm:inline">💡 Geser dengan mouse drag atau klik tombol panah untuk menjelajahi highlight foto kenangan.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Total {albumGaleri.length} Foto Kenangan
          </span>
        </div>
      </section>

      {/* 6. Section Kutipan Inspiratif & Visi Prestasi */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Kutipan Inspiratif (7 Kolom) */}
          <div className="lg:col-span-7 rounded-[24px] bg-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(3,4,94,0.06)] flex flex-col justify-between relative overflow-hidden border border-slate-100">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#CAF0F8]/60 blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#CAF0F8] flex items-center justify-center text-[#0077B6] mb-4">
                <Quote className="w-6 h-6" />
              </div>
              <blockquote className="font-heading text-base sm:text-lg text-[#03045E] leading-relaxed mb-4 font-bold">
                "Baris demi baris logika yang kita susun hari ini adalah ikhtiar nyata santri kejuruan dalam menjemput peradaban digital Indonesia yang berkeadaban."
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filosofi belajar XII PPLG 3 menekankan bahwa teknologi terbaik bukan hanya sekadar canggih, namun membawa maslahat dan kemudahan bagi sesama insan.
              </p>
            </div>
            <div className="relative z-10 pt-6 flex items-center gap-3.5 border-t border-slate-100 mt-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white font-heading font-extrabold text-base shadow-sm ring-2 ring-[#CAF0F8]">
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

          {/* Visi Prestasi (5 Kolom) */}
          <div className="lg:col-span-5 rounded-[24px] bg-gradient-to-br from-[#0077B6] to-[#03045E] text-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(3,4,94,0.12)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Layers className="w-7 h-7 text-[#90E0EF]" />
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/15 text-[#CAF0F8]">
                  TA {infoKelas.tahunAjaran}
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

      {/* 7. Dinding Siswa Kelas */}
      <StudentWall />

      {/* 8. Struktur Organisasi Kelas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-16">
        
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077B6] tracking-wide uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Pengurus Kelas</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#03045E]">
            Struktur Organisasi
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Pengurus kelas XII PPLG 3 yang bertanggung jawab menjalankan amanah organisasi kelas.
          </p>
        </div>

        {/* Wali Kelas di atas */}
        <div className="flex justify-center mb-8">
          <div className="relative flex flex-col items-center p-6 sm:p-8 rounded-[24px] bg-gradient-to-br from-[#03045E] to-[#0077B6] text-white shadow-[0_12px_32px_rgba(3,4,94,0.18)] max-w-sm w-full">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-heading font-extrabold text-xl mb-3 ring-4 ring-white/30">
              UD
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-white">
              {infoKelas.waliKelas.nama}
            </span>
            <span className="text-xs text-[#90E0EF] font-medium mt-0.5">
              {infoKelas.waliKelas.peran}
            </span>
            <div className="mt-3 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold text-[#CAF0F8]">
              Pembina & Penasehat Kelas
            </div>
          </div>
        </div>

        {/* Garis penghubung vertikal */}
        <div className="flex justify-center mb-8">
          <div className="w-px h-10 bg-gradient-to-b from-[#0077B6] to-[#90E0EF]"></div>
        </div>

        {/* Grid Pengurus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pengurusData.map((pengurus, idx) => {
            const style = peranStyle[pengurus.peran] || peranStyle['Ketua Kelas'];
            const IconComp = style.icon;
            
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center p-6 rounded-[24px] bg-white shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all border border-slate-100 group"
              >
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-[24px] bg-gradient-to-r ${style.gradient}`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor} mb-3 mt-2 group-hover:scale-105 transition-transform`}>
                  <IconComp className="w-7 h-7" />
                </div>

                {/* Peran */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${style.gradient} mb-3`}>
                  {pengurus.peran}
                </span>

                {/* Nama */}
                <span className="font-heading font-bold text-sm sm:text-base text-[#03045E] text-center leading-tight">
                  {pengurus.nama}
                </span>

                {/* Minat */}
                <span className="text-[11px] text-slate-500 text-center mt-1">
                  {pengurus.minat}
                </span>
              </div>
            );
          })}
        </div>

        {/* Anggota info */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#CAF0F8]/50 border border-[#90E0EF]/50">
            <Users className="w-5 h-5 text-[#0077B6]" />
            <span className="text-sm font-semibold text-[#03045E]">
              + {totalSiswa - infoKelas.pengurus.length} Anggota Kelas
            </span>
            <Link
              to="/anggota"
              className="text-xs font-bold text-[#0077B6] hover:text-[#03045E] flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Interactive Filter/Pill Fast Navigation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full pb-16">
        <div className="p-6 rounded-[24px] bg-[#CAF0F8]/40 border border-[#90E0EF]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
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

      {/* Lightbox Modal untuk Foto Kenangan */}
      <Lightbox
        isOpen={lightboxOpen}
        images={albumGaleri}
        currentIndex={activePhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setActivePhotoIndex(newIndex)}
      />

    </div>
  );
}
