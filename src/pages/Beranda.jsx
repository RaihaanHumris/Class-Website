import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Quote,
  Clock,
} from 'lucide-react';
import Hero from '../components/common/Hero';
import StudentWall from '../components/features/StudentWall';
import SpecialAlumniSection from '../components/features/SpecialAlumniSection';
import MemoryGuestbook from '../components/features/MemoryGuestbook';
import Lightbox from '../components/common/Lightbox';
import { BirthdayBanner } from '../components/features/BirthdayCelebration';
import { infoKelas } from '../data/kelas';
import { daftarAnggota, siswaAktif, sahabatPindah } from '../data/anggota';
import { albumGaleri } from '../data/galeri';
import { fetchApprovedPhotos, isSupabaseConfigured } from '../lib/supabase';

export default function Beranda({ onOpenBirthdayModal }) {
  const [dbPhotos, setDbPhotos] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    fetchApprovedPhotos()
      .then((rows) => {
        if (mounted) setDbPhotos(rows);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const allMemories = [...dbPhotos, ...albumGaleri];

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
    if (Math.abs(walk) > 6) setHasDragged(true);
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const stopDragging = () => setIsMouseDown(false);

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen">
      {/* 1. Hero 3D Memory Constellation */}
      <Hero />

      {/* 2. Full-Width 4-Column Yearbook Summary Strip */}
      <section className="bg-[#FFFDF9] border-b border-[#E6DFD3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:divide-x divide-slate-200/80">
            <div className="p-3.5 sm:p-0 rounded-xl sm:rounded-none bg-[#FAF8F3]/65 sm:bg-transparent border border-slate-200/80 sm:border-0 lg:pr-6">
              <span className="font-editorial text-xl sm:text-3xl font-semibold text-[#03045E] tabular-nums block">
                {allMemories.length} Foto
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 mt-1 block leading-snug">
                Momen terdokumentasi di album kelas
              </span>
            </div>

            <div className="p-3.5 sm:p-0 rounded-xl sm:rounded-none bg-[#FAF8F3]/65 sm:bg-transparent border border-slate-200/80 sm:border-0 lg:px-6">
              <span className="font-editorial text-xl sm:text-3xl font-semibold text-[#03045E] tabular-nums block">
                {siswaAktif.length} Siswa
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 mt-1 block leading-snug">
                Angkatan aktif kelas XII PPLG 3
              </span>
            </div>

            <div className="p-3.5 sm:p-0 rounded-xl sm:rounded-none bg-[#FAF8F3]/65 sm:bg-transparent border border-slate-200/80 sm:border-0 lg:px-6">
              <span className="font-editorial text-xl sm:text-3xl font-semibold text-amber-700 tabular-nums block">
                {sahabatPindah.length} Sahabat
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 mt-1 block leading-snug">
                Pernah bersama sebelum pindah sekolah
              </span>
            </div>

            <div className="p-3.5 sm:p-0 rounded-xl sm:rounded-none bg-[#FAF8F3]/65 sm:bg-transparent border border-slate-200/80 sm:border-0 lg:pl-6">
              <span className="font-editorial text-xl sm:text-3xl font-semibold text-[#03045E] tabular-nums block">
                {infoKelas.tahunAjaran}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 mt-1 block leading-snug">
                Tiga tahun kebersamaan di {infoKelas.sekolah}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Ulang Tahun Otomatis jika ada anggota yang berulang tahun hari ini */}
      <BirthdayBanner onOpenPersonalModal={onOpenBirthdayModal} />

      {/* 3. Sorotan Album Kenangan Carousel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#0077B6]">
              Sorotan Dokumentasi &amp; Momen Kelas
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#03045E]">
              Lembaran Foto Kenangan
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Klik foto untuk memperbesar cerita di baliknya, atau buka mode Panggung 3D di halaman Galeri.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#03045E] flex items-center justify-center hover:border-[#0077B6] transition-colors cursor-pointer"
                aria-label="Geser ke foto sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleScrollRight}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#03045E] flex items-center justify-center hover:border-[#0077B6] transition-colors cursor-pointer"
                aria-label="Geser ke foto berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/galeri"
              className="inline-flex items-center gap-1.5 text-[#0077B6] hover:text-[#03045E] font-semibold text-xs sm:text-sm group whitespace-nowrap px-3 py-2"
            >
              <span>Buka Galeri 3D</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className={`flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 select-none ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {allMemories.map((foto, idx) => (
            <article
              key={foto.id}
              onClick={() => {
                if (!hasDragged) handleOpenLightbox(idx);
              }}
              className="w-[82vw] sm:w-[340px] shrink-0 snap-start group bg-white border border-slate-200/80 rounded-2xl overflow-hidden cursor-pointer hover:border-[#0077B6]/50 transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={foto.thumb}
                  alt={foto.judul}
                  loading="lazy"
                  draggable="false"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-[#0077B6]">{foto.kategori}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{foto.tanggal}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#03045E] line-clamp-1 group-hover:text-[#0077B6] transition-colors">
                    {foto.judul}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {foto.deskripsi}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200/70">
          <p className="text-xs text-slate-500">
            Punya foto momen kelas yang belum masuk album? Ajukan agar Admin menayangkannya.
          </p>
          <Link
            to="/kirim-foto"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-lg bg-[#03045E] hover:bg-[#0077B6] text-white text-xs font-semibold transition-colors min-h-[44px] sm:min-h-[40px]"
          >
            <Camera className="w-4 h-4" />
            <span>Ajukan Tambah Foto</span>
          </Link>
        </div>
      </section>

      {/* 4. Penghormatan Spesial: 3 Sahabat Seperjuangan (Pindah Sekolah) */}
      <SpecialAlumniSection />

      {/* 5. Ringkasan Perjalanan 3 Tahun (Kelas X -> XII) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B6]">
              <Clock className="w-4 h-4" />
              <span>Kilas Balik 2023–2026</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#03045E] mt-1">
              Tiga Babak Perjalanan Kelas
            </h2>
          </div>
          <Link
            to="/jejak"
            className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:text-[#03045E] inline-flex items-center gap-1.5 group whitespace-nowrap"
          >
            <span>Buka Jejak Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoKelas.timelineKenangan.map((item, idx) => (
            <article
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={item.foto}
                  alt={item.judul}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2 flex-1 flex flex-col">
                <span className="text-xs font-mono font-medium text-[#0077B6]">
                  {item.fase}
                </span>
                <h3 className="font-editorial text-lg font-semibold text-[#03045E] leading-snug">
                  {item.judul}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Pesan Wali Kelas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-6">
        <div className="rounded-2xl sm:rounded-3xl bg-[#050e29] text-white p-5 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
            <blockquote className="font-editorial text-lg sm:text-2xl text-white leading-relaxed">
              “{infoKelas.waliKelas.sambutan}”
            </blockquote>
            <div className="pt-1 sm:pt-2 text-xs sm:text-sm text-[#90E0EF]">
              <strong className="text-white font-semibold">{infoKelas.waliKelas.nama}</strong>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{infoKelas.waliKelas.peran} {infoKelas.sekolah}</span>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl overflow-hidden border border-white/15 aspect-[16/10] sm:aspect-[4/3] bg-[#0d1f4f]">
            <img
              src="/images/kenangan/hari-pahlawan.jpg"
              alt="Foto kenangan Hari Pahlawan keluarga besar XII PPLG 3"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Buku Kenangan (Supabase) */}
      <MemoryGuestbook />

      {/* 8. Dinding 25 Nama Kenangan */}
      <StudentWall />

      <Lightbox
        isOpen={lightboxOpen}
        images={allMemories}
        currentIndex={activePhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setActivePhotoIndex(newIndex)}
      />
    </div>
  );
}
