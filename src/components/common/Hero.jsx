import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Calendar,
  Users,
  Terminal,
  Gamepad2,
  ShieldCheck,
  Server
} from 'lucide-react';
import { infoKelas } from '../../data/kelas';
import { daftarAnggota } from '../../data/anggota';

export default function Hero() {
  const totalSiswa = daftarAnggota.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-6 sm:pt-10 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
            
            {/* Overline Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
                {infoKelas.jurusan} · {infoKelas.sekolah}
              </span>
            </div>

            {/* Hero Headings */}
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#03045E] tracking-tight leading-none">
                {infoKelas.nama}
              </h1>
              <p className="font-heading text-xl sm:text-2xl font-bold text-[#03045E]/90 mt-1">
                {infoKelas.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#03045E]/85 max-w-xl leading-relaxed">
              Wadah belajar siswa madrasah aliyah kejuruan di pesisir Ende yang berdedikasi menguasai logika pemrograman modern, rekayasa perangkat lunak, dan cipta gim interaktif berlandaskan akhlak karimah.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/jadwal"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0077B6] text-white font-semibold text-sm shadow-md hover:bg-[#03045E] transition-all duration-200 transform hover:-translate-y-0.5 min-h-[44px]"
              >
                <span>Lihat Jadwal Pelajaran</span>
                <Calendar className="w-4 h-4" />
              </Link>
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#90E0EF] text-[#03045E] font-semibold text-sm shadow-xs hover:bg-white transition-all duration-200 min-h-[44px]"
              >
                <span>Kenali Pengurus Kelas</span>
                <Users className="w-4 h-4" />
              </Link>
            </div>

            {/* Mini Terminal Line */}
            <div className="mt-1 inline-flex items-center gap-2 text-xs font-mono font-medium text-[#03045E] bg-white/60 px-4 py-1.5 rounded-full border border-white/40">
              <Terminal className="w-3.5 h-3.5 text-[#0077B6]" />
              <span>makn-ende:~$ git commit -m "build the future"</span>
            </div>

          </div>

          {/* Hero Right: Stacked Capsules Visual Mosaic (Sesuai Export Stitch) */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-0">
            <div className="relative w-full max-w-sm flex flex-col gap-3 py-2">
              
              {/* Capsule 1: Navy */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-full bg-[#03045E] text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-5 h-5 text-[#90E0EF]" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm sm:text-base leading-tight">Clean Code</div>
                    <div className="text-[11px] text-[#90E0EF]/80">Architecture & Clean Logic</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#CAF0F8]">
                  v3.2
                </span>
              </div>

              {/* Capsule 2: Ocean */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-full bg-[#0077B6] text-white shadow-md sm:-ml-3 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm sm:text-base leading-tight">Game Engine</div>
                    <div className="text-[11px] text-white/80">2D & 3D Mechanics</div>
                  </div>
                </div>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  🎮
                </span>
              </div>

              {/* Capsule 3: Cyan */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-full bg-[#00B4D8] text-[#03045E] shadow-md sm:ml-3 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center flex-shrink-0">
                    <Terminal className="w-5 h-5 text-[#03045E]" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm sm:text-base leading-tight">Fullstack Dev</div>
                    <div className="text-[11px] text-[#03045E]/80 font-medium">REST API & Database</div>
                  </div>
                </div>
                <Server className="w-5 h-5 text-[#03045E] mr-2" />
              </div>

              {/* Capsule 4: Sky / Mist */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-full bg-white text-[#03045E] shadow-md transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#CAF0F8] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#0077B6]" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm sm:text-base leading-tight">Akhlak & Kolaborasi</div>
                    <div className="text-[11px] text-slate-500">Sinergi Santri Digital</div>
                  </div>
                </div>
                <div className="flex -space-x-2 mr-1">
                  <span className="w-7 h-7 rounded-full bg-[#0077B6] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span className="w-7 h-7 rounded-full bg-[#00B4D8] text-[#03045E] text-[10px] flex items-center justify-center font-bold">2</span>
                  <span className="w-7 h-7 rounded-full bg-[#03045E] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
