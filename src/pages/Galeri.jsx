import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Plus } from 'lucide-react';
import Lightbox from '../components/common/Lightbox';
import GalleryBook3DStage from '../components/three/GalleryBook3DStage';
import { albumGaleri } from '../data/galeri';
import { infoKelas } from '../data/kelas';
import { fetchApprovedPhotos, isSupabaseConfigured } from '../lib/supabase';

export default function Galeri() {
  const [dbPhotos, setDbPhotos] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }
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

  const combinedAlbum = useMemo(() => {
    return [...dbPhotos, ...albumGaleri];
  }, [dbPhotos]);

  const handleOpenLightbox = (foto) => {
    const index = combinedAlbum.findIndex((item) => item.id === foto.id);
    setActivePhotoIndex(index !== -1 ? index : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen pb-16">
      {/* Header Editorial Galeri Kenangan */}
      <section className="bg-[#050e29] text-white py-12 sm:py-14 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <p className="text-xs font-medium text-[#90E0EF]">
              Buku Tahunan 3D &amp; Arsip Foto · {infoKelas.nama} {infoKelas.sekolah}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              Galeri Buku Kenangan 3D
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Jelajahi seluruh foto kenangan dalam animasi buku album 3D interaktif lengkap dengan halaman polaroid kelas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/kirim-foto"
              className="min-h-[44px] px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#03045E] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* 3D Yearbook Book Animation Stage */}
        <GalleryBook3DStage
          photos={combinedAlbum}
          onSelectPhoto={handleOpenLightbox}
        />

        {combinedAlbum.length === 0 && (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <Camera className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-sm text-[#03045E]">Belum ada foto kenangan</p>
          </div>
        )}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        images={combinedAlbum}
        currentIndex={activePhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setActivePhotoIndex(newIndex)}
      />
    </div>
  );
}
