import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import HeroMemoryCanvas from '../three/HeroMemoryCanvas';
import HeroLaptopFolder from '../features/HeroLaptopFolder';
import { infoKelas } from '../../data/kelas';
import { albumGaleri } from '../../data/galeri';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050e29] text-white min-h-[560px] lg:min-h-[620px] flex items-center">
      {/* Three.js 3D Memory Constellation Background */}
      <HeroMemoryCanvas photos={albumGaleri} />

      {/* Subtle directional gradient scrim for crisp contrast on left text and right laptop */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,14,41,0.92) 0%, rgba(5,14,41,0.78) 48%, rgba(5,14,41,0.62) 100%)',
        }}
      />

      {/* Semantic Foreground Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-14 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Kiri: Judul & Aksi Utama */}
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs sm:text-sm font-medium text-[#90E0EF] tracking-wide">
              Buku Tahunan &amp; Arsip Kenangan · {infoKelas.namaLengkapSekolah} · {infoKelas.tahunAjaran}
            </p>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-white tracking-tight leading-[1.08]">
              Jejak Kenangan {infoKelas.nama}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-lg">
              Tempat setiap tawa di laboratorium komputer, malam api unggun pramuka, hingga kisah 22 siswa aktif dan 3 sahabat seperjuangan yang pernah melangkah bersama tetap hidup selamanya.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00B4D8] hover:bg-[#90E0EF] text-[#03045E] font-bold text-sm transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Jelajahi Galeri 3D</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/kirim-foto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0d1f4f] hover:bg-[#152c6b] border border-white/25 text-white font-semibold text-sm transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Kirim Foto Kenangan</span>
              </Link>
            </div>
          </div>

          {/* Kanan: Laptop yang sedang membuka folder XII PPLG 3 berisi file PPLG 3 */}
          <div className="lg:col-span-6">
            <HeroLaptopFolder />
          </div>
        </div>
      </div>
    </section>
  );
}
