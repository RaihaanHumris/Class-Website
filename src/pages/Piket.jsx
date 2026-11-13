import React from 'react';
import PiketCard from '../components/features/PiketCard';
import { jadwalPiket } from '../data/piket';
import { getHariInfo } from '../utils/helpers';

export default function Piket() {
  const hariInfo = getHariInfo();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Kebersihan & Ketertiban
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Roster Piket Kebersihan Kelas
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            Pembagian giliran piket siswa kelas XII PPLG 3 dari hari Senin sampai Sabtu untuk menjaga kenyamanan ruang belajar madrasah.
          </p>
        </div>
      </section>

      {/* Konten Piket */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Status Hari Ini */}
        <div className="p-4 rounded-xl bg-[#CAF0F8]/80 border-2 border-[#90E0EF] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs sm:text-sm text-[#03045E]">
            Status Hari Ini: <strong>{hariInfo.nama}</strong> {hariInfo.isWeekend ? '(Libur Akhir Pekan)' : '— Regu Piket Wajib Hadir Lebih Awal'}
          </div>
          {!hariInfo.isWeekend && (
            <span className="text-xs font-extrabold text-white bg-[#0077B6] px-3 py-1 rounded-full">
              Regu Hari Ini Disorot
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
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 space-y-3 text-xs sm:text-sm text-slate-700">
          <h3 className="font-heading font-extrabold text-base text-[#03045E]">
            Tanggung Jawab Petugas Piket:
          </h3>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
            <li><strong>Pagi (06.50 WITA):</strong> Menyapu ruang kelas XII PPLG 3, merapikan meja guru, dan memastikan spidol/penghapus siap pakai.</li>
            <li><strong>Sore (Setelah Bel Pulang):</strong> Mematikan komputer & proyektor, merapikan kabel, mengosongkan tempat sampah ke TPS luar, dan mengunci pintu kelas.</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
