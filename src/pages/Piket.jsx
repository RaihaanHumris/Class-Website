import React from 'react';
import PiketCard from '../components/features/PiketCard';
import { jadwalPiket } from '../data/piket';
import { getHariInfo } from '../utils/helpers';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Piket() {
  const hariInfo = getHariInfo();

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Kebersihan & Ketertiban
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Roster Piket Kebersihan Kelas
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            Pembagian giliran piket siswa kelas XII PPLG 3 dari hari Senin sampai Sabtu untuk menjaga kenyamanan ruang belajar madrasah.
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

      {/* 3. Konten Piket */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner Status Hari Ini */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-slate-100 shadow-[0_8px_24px_rgba(3,4,94,0.06)] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs sm:text-sm text-[#03045E] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077B6] animate-pulse" />
            <span>
              Status Hari Ini: <strong className="font-bold text-[#0077B6]">{hariInfo.nama}</strong>{' '}
              {hariInfo.isWeekend ? '(Libur Akhir Pekan)' : '— Regu Piket Wajib Hadir Lebih Awal'}
            </span>
          </div>
          {!hariInfo.isWeekend && (
            <span className="text-xs font-bold text-white bg-[#0077B6] px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regu Hari Ini Disorot</span>
            </span>
          )}
        </div>

        {/* Grid Kartu Piket Senin - Jumat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwalPiket.map((piket) => {
            const isToday = piket.dayIndex === hariInfo.index;
            return (
              <PiketCard key={piket.hari} piket={piket} isToday={isToday} />
            );
          })}
        </div>

        {/* SOP Piket Bersih */}
        <div className="bg-[#CAF0F8]/50 border border-[#90E0EF]/60 rounded-[24px] p-6 sm:p-8 space-y-3.5 shadow-[0_8px_24px_rgba(3,4,94,0.04)] text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2 text-[#03045E]">
            <CheckCircle2 className="w-5 h-5 text-[#0077B6]" />
            <h3 className="font-heading font-extrabold text-base sm:text-lg">
              Tanggung Jawab Petugas Piket:
            </h3>
          </div>
          <ul className="space-y-2 leading-relaxed text-slate-700 pl-1">
            <li className="flex items-start gap-2">
              <span className="text-[#0077B6] font-bold">•</span>
              <span><strong>Pagi (06.50 WITA):</strong> Menyapu ruang kelas XII PPLG 3, merapikan meja guru, dan memastikan spidol/penghapus siap pakai.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0077B6] font-bold">•</span>
              <span><strong>Sore (Setelah Bel Pulang):</strong> Mematikan komputer & proyektor, merapikan kabel, mengosongkan tempat sampah ke TPS luar, dan mengunci pintu kelas.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
