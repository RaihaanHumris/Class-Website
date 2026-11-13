import React, { useState, useMemo } from 'react';
import TaskItem from '../components/features/TaskItem';
import { daftarTugas } from '../data/tugas';
import { infoKelas } from '../data/kelas';

export default function Tugas() {
  const [filterStatus, setFilterStatus] = useState('semua');

  const totalTugas = daftarTugas.length;
  const tugasMendesak = daftarTugas.filter((t) => t.status === 'mendesak').length;
  const tugasBerjalan = daftarTugas.filter((t) => t.status === 'berjalan').length;
  const tugasSelesai = daftarTugas.filter((t) => t.status === 'selesai').length;

  const filteredTugas = useMemo(() => {
    if (filterStatus === 'semua') return daftarTugas;
    return daftarTugas.filter((t) => t.status === filterStatus);
  }, [filterStatus]);

  const filterTabs = [
    { id: 'semua', label: 'Semua Tugas', count: totalTugas },
    { id: 'mendesak', label: 'Mendesak', count: tugasMendesak },
    { id: 'berjalan', label: 'Dalam Proses', count: tugasBerjalan },
    { id: 'selesai', label: 'Selesai', count: tugasSelesai }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Manajemen Tugas
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Tugas & Deadline Kelas {infoKelas.nama}
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            Rekap seluruh tugas kejuruan koding, basis data, proyek gim, dan tugas mandiri agar terselesaikan tepat waktu.
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

      {/* 3. Konten Tugas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Filter Tab Kapsul Pill Khas Beranda */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => {
            const isSelected = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0077B6] text-white shadow-md'
                    : 'bg-white border border-slate-200/80 text-[#03045E] hover:bg-[#CAF0F8] shadow-xs'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-[#CAF0F8] text-[#03045E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Daftar Kartu Tugas */}
        <div className="space-y-4">
          {filteredTugas.length > 0 ? (
            filteredTugas.map((tugas) => (
              <TaskItem key={tugas.id} tugas={tugas} />
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_8px_24px_rgba(3,4,94,0.06)] p-12 text-center text-sm text-slate-500 italic">
              Tidak ada tugas pada kategori ini.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
