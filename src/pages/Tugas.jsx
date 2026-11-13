import React, { useState, useMemo } from 'react';
import TaskItem from '../components/features/TaskItem';
import { daftarTugas } from '../data/tugas';

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
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Manajemen Tugas
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Tugas & Deadline Kelas XII PPLG 3
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            Rekap seluruh tugas kejuruan koding, basis data, proyek gim, dan tugas mandiri agar terselesaikan tepat waktu.
          </p>
        </div>
      </section>

      {/* Konten Tugas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter Tab Berwarna Berani */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-[#0077B6] text-white shadow-md'
                  : 'bg-white border-2 border-slate-200 text-[#03045E] hover:bg-[#CAF0F8]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  filterStatus === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#CAF0F8] text-[#03045E]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Daftar Kartu Tugas */}
        <div className="space-y-4">
          {filteredTugas.length > 0 ? (
            filteredTugas.map((tugas) => (
              <TaskItem key={tugas.id} tugas={tugas} />
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500 italic">
              Tidak ada tugas pada kategori ini.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
