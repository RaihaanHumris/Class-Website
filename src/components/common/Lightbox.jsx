import React, { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Lightbox Component dengan dukungan Swipe Gesture & Efek Slide untuk Mobile
 */
export default function Lightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onNavigate
}) {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animatingKey, setAnimatingKey] = useState(currentIndex);

  const minSwipeDistance = 45;

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    },
    [isOpen, handlePrev, handleNext, onClose]
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

  useEffect(() => {
    setAnimatingKey(currentIndex);
    setDragOffset(0);
  }, [currentIndex]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  // Touch Event Handlers untuk Gesture Swipe di Mobile
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX;
    setTouchEndX(currentX);

    // Jika hanya 1 gambar, beri efek resistensi karet
    if (images.length <= 1) {
      setDragOffset(diff * 0.25);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && images.length > 1) {
        handleNext();
      } else if (isRightSwipe && images.length > 1) {
        handlePrev();
      }
    }

    setDragOffset(0);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03045E]/95 backdrop-blur-md p-3 sm:p-4 select-none touch-pan-y"
      role="dialog"
      aria-modal="true"
      aria-label="Penampil Foto Kenangan"
      onClick={onClose}
    >
      {/* Tombol Tutup */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-colors focus-visible:ring-2 focus-visible:ring-[#00B4D8] cursor-pointer shadow-lg"
        aria-label="Tutup preview gambar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Konten Gambar dengan Area Sentuh Geser */}
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gambar dengan Efek Slide & Drag Real-time */}
        <div
          key={animatingKey}
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 280ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="w-full flex justify-center items-center will-change-transform cursor-grab active:cursor-grabbing"
        >
          <img
            src={currentImage.src}
            alt={currentImage.judul || 'Foto dokumentasi kelas'}
            draggable="false"
            className="max-h-[68vh] sm:max-h-[74vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
          />
        </div>

        {/* Caption & Keterangan Foto */}
        <div className="mt-3 sm:mt-4 text-center px-4 max-w-2xl space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-[#CAF0F8] bg-white/15 px-3 py-0.5 rounded-full">
              {currentImage.kategori}
            </span>
            <span className="text-xs text-[#90E0EF]/80 font-mono">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-white font-heading leading-snug">
            {currentImage.judul}
          </h3>

          {currentImage.deskripsi && (
            <p className="text-xs sm:text-sm text-[#CAF0F8]/85 leading-relaxed max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
              {currentImage.deskripsi}
            </p>
          )}

          {/* Petunjuk Geser untuk Mobile */}
          <div className="pt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#90E0EF]/60 sm:hidden">
            <span>⟵ Geser layar ke kiri atau kanan ⟶</span>
          </div>
        </div>

        {/* Tombol Navigasi Desktop / Tablet */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:flex absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-[#00B4D8] cursor-pointer"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="hidden sm:flex absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-white/20 hover:bg-white text-white hover:text-[#03045E] transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-[#00B4D8] cursor-pointer"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
