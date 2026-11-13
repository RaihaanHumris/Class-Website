import React from 'react';
import ScheduleTable from '../components/features/ScheduleTable';
import { jadwalMingguan } from '../data/jadwal';

export default function Jadwal() {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Akademik & Pembelajaran
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Jadwal Pelajaran Kelas XII PPLG 3
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            Mata pelajaran kejuruan (Pemrograman Web, Basis Data, PBO, Pemrograman Gim) dan mata pelajaran umum semester ganjil tahun ajaran 2025/2026 MAKN Ende.
          </p>
        </div>
      </section>

      {/* Konten Roster */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Catatan Praktikum Singkat */}
        <div className="text-xs sm:text-sm text-slate-700 bg-[#CAF0F8]/60 border-l-4 border-l-[#0077B6] p-4 rounded-r-lg">
          <strong className="text-[#03045E]">Ketentuan Lab Komputer:</strong> Hadir di Lab 1 atau Lab 2 sebelum bel masuk berbunyi. Simpan seluruh repositori proyek di direktori masing-masing dan pastikan komputer dalam keadaan mati setelah sesi selesai.
        </div>

        {/* Schedule Table Component */}
        <ScheduleTable jadwal={jadwalMingguan} />

      </div>

    </div>
  );
}
