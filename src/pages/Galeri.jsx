import React, { useState, useMemo } from 'react';
import Lightbox from '../components/common/Lightbox';
import { albumGaleri } from '../data/galeri';
import { infoKelas } from '../data/kelas';
import { Camera } from 'lucide-react';

export default function Galeri() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const categories = ['Semua', ...new Set(albumGaleri.map((item) => item.kategori))];

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'Semua') return albumGaleri;
    return albumGaleri.filter((item) => item.kategori === selectedCategory);
  }, [selectedCategory]);

  const handleOpenLightbox = (foto) => {
    const index = filteredPhotos.findIndex((item) => item.id === foto.id);
    setActivePhotoIndex(index !== -1 ? index : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Dokumentasi & Kenangan
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Galeri Foto Kenangan {infoKelas.nama}
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            Dokumentasi resmi angkatan, kegiatan kepanduan pramuka, dan potret momen kebersamaan siswa-siswi {infoKelas.nama} di {infoKelas.sekolah}.
          </p>
        </div>
      </section>

      {/* 2. Wave Divider SVG */}
      <div className="w-full overflow-hidden leading-none bg-slate-50 -mt-px select-none pointer-events-none mb-8 sm:mb-10">
        <svg
          className="block w-full h-10 md:h-14 text-[#0077B6] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 96"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {/* 3. Konten Galeri */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Filter Kategori Kapsul Pill Khas Beranda */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0077B6] text-white shadow-md'
                    : 'bg-white border border-slate-200/80 text-[#03045E] hover:bg-[#CAF0F8] shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((foto) => (
            <div
              key={foto.id}
              onClick={() => handleOpenLightbox(foto)}
              className="group bg-white border border-slate-100 rounded-[24px] overflow-hidden cursor-pointer hover:border-[#0077B6]/40 transition-all shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={foto.thumb}
                  alt={foto.judul}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold text-[#0077B6] uppercase tracking-wider px-3 py-1 rounded-full bg-[#CAF0F8] inline-block border border-[#90E0EF]/60">
                  {foto.kategori}
                </span>
                <h3 className="font-heading font-bold text-base text-[#03045E] line-clamp-1 group-hover:text-[#0077B6] transition-colors">
                  {foto.judul}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{foto.tanggal}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          isOpen={lightboxOpen}
          images={filteredPhotos}
          currentIndex={activePhotoIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIndex) => setActivePhotoIndex(newIndex)}
        />

      </div>

    </div>
  );
}
