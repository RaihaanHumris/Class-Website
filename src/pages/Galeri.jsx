import React, { useState, useMemo } from 'react';
import Lightbox from '../components/common/Lightbox';
import { albumGaleri } from '../data/galeri';

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
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Dokumentasi & Kenangan
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Galeri Kegiatan XII PPLG 3
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            Rekaman visual praktikum koding di lab, diskusi perancangan software, dan kebersamaan siswa di MAKN Ende.
          </p>
        </div>
      </section>

      {/* Konten Galeri */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0077B6] text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 text-[#03045E] hover:bg-[#CAF0F8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((foto) => (
            <div
              key={foto.id}
              onClick={() => handleOpenLightbox(foto)}
              className="group border-2 border-slate-200 bg-white rounded-xl overflow-hidden cursor-pointer hover:border-[#0077B6] transition-all shadow-xs"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={foto.thumb}
                  alt={foto.judul}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold text-[#0077B6] uppercase tracking-wider block">
                  {foto.kategori}
                </span>
                <h3 className="font-heading font-bold text-base text-[#03045E] line-clamp-1 group-hover:text-[#0077B6] transition-colors">
                  {foto.judul}
                </h3>
                <p className="text-xs text-slate-500">{foto.tanggal}</p>
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
