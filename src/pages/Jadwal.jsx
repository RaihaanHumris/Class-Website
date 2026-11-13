import React from 'react';
import ScheduleTable from '../components/features/ScheduleTable';
import { jadwalMingguan } from '../data/jadwal';
import { infoKelas } from '../data/kelas';
import { Laptop, Calendar } from 'lucide-react';

export default function Jadwal() {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Akademik & Pembelajaran
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Jadwal Pelajaran Kelas {infoKelas.nama}
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            Mata pelajaran kejuruan (Pemrograman Web, Basis Data, PBO, Pemrograman Gim) dan mata pelajaran umum semester ganjil tahun ajaran {infoKelas.tahunAjaran} {infoKelas.sekolah}.
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

      {/* 3. Konten Roster */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Catatan Praktikum Singkat (Pill Capsule Style) */}
        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-[24px] bg-[#CAF0F8]/50 border border-[#90E0EF]/60 text-xs sm:text-sm text-slate-700 shadow-[0_8px_24px_rgba(3,4,94,0.04)]">
          <div className="w-9 h-9 rounded-full bg-[#0077B6] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Laptop className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <strong className="text-[#03045E] block font-heading text-sm">Ketentuan Lab Komputer:</strong>
            <p className="leading-relaxed">
              Hadir di Lab 1 atau Lab 2 sebelum bel masuk berbunyi. Simpan seluruh repositori proyek di direktori masing-masing dan pastikan komputer dalam keadaan mati setelah sesi selesai.
            </p>
          </div>
        </div>

        {/* Schedule Table Component */}
        <ScheduleTable jadwal={jadwalMingguan} />

      </div>

    </div>
  );
}
