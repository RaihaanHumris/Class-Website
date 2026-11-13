import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Lightbox Component untuk preview gambar resolusi penuh
 */
export default function Lightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onNavigate
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        onNavigate((currentIndex + 1) % images.length);
      }
    },
    [isOpen, images.length, currentIndex, onClose, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03045E]/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Penampil Gambar"
      onClick={onClose}
    >
      {/* Tombol Tutup */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-colors focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
        aria-label="Tutup preview gambar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Konten Gambar & Caption */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.src}
          alt={currentImage.judul || 'Foto dokumentasi kelas'}
          className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/20"
        />

        {/* Caption */}
        <div className="mt-4 text-center px-4 max-w-2xl">
          <h3 className="text-lg md:text-xl font-bold text-white font-heading">
            {currentImage.judul}
          </h3>
          {currentImage.deskripsi && (
            <p className="mt-1 text-sm text-[#CAF0F8]">
              {currentImage.deskripsi}
            </p>
          )}
          {currentImage.tanggal && (
            <span className="inline-block mt-2 text-xs text-[#90E0EF]">
              {currentImage.tanggal} • {currentIndex + 1} dari {images.length}
            </span>
          )}
        </div>

        {/* Tombol Navigasi Prev/Next */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onNavigate((currentIndex - 1 + images.length) % images.length)
              }
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-colors focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-colors focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
