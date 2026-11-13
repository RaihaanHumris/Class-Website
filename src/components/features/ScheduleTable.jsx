import React, { useState } from 'react';
import { Clock, User, MapPin, Calendar, Sparkles } from 'lucide-react';
import { getHariInfo, getStatusSesiMapel } from '../../utils/helpers';

export default function ScheduleTable({ jadwal = [] }) {
  const hariInfo = getHariInfo();
  // Default ke hari ini jika hari sekolah, atau Senin jika akhir pekan
  const defaultDayIndex = hariInfo.index >= 1 && hariInfo.index <= 5 ? hariInfo.index : 1;
  const [selectedDay, setSelectedDay] = useState(defaultDayIndex);

  const activeJadwalHari = jadwal.find((j) => j.dayIndex === selectedDay) || jadwal[0];
  const isHariIniTerpilih = activeJadwalHari?.dayIndex === hariInfo.index && !hariInfo.isWeekend;

  return (
    <div className="space-y-6">
      
      {/* Navigasi Tab Hari (Pill Style Khas Beranda) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {jadwal.map((j) => {
          const isToday = j.dayIndex === hariInfo.index;
          const isSelected = j.dayIndex === selectedDay;

          return (
            <button
              key={j.hari}
              type="button"
              onClick={() => setSelectedDay(j.dayIndex)}
              className={`min-h-[44px] px-5 py-2.5 font-heading font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#0077B6] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-[#CAF0F8] hover:text-[#03045E] border border-slate-200/80 shadow-xs'
              }`}
            >
              <span>{j.hari}</span>
              {isToday && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#CAF0F8] text-[#0077B6]'
                }`}>
                  Hari Ini
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tabel Jadwal Pelajaran */}
      <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-[0_8px_24px_rgba(3,4,94,0.06)]">
        
        {/* Header Roster Pelajaran */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#90E0EF]" />
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
              Jadwal Hari {activeJadwalHari?.hari}
            </h3>
            {isHariIniTerpilih && (
              <span className="text-xs font-bold text-[#03045E] bg-[#00B4D8] px-3 py-0.5 rounded-full shadow-xs">
                Hari Ini Aktif
              </span>
            )}
          </div>
          <span className="text-xs text-[#CAF0F8] font-mono px-3 py-1 rounded-full bg-white/10">
            {activeJadwalHari?.mapel?.length || 0} Sesi Pelajaran
          </span>
        </div>

        {/* Daftar Sesi */}
        <div className="divide-y divide-slate-100">
          {activeJadwalHari?.mapel?.map((item, idx) => {
            const isBreak =
              item.nama.toLowerCase().includes('istirahat') ||
              item.nama.toLowerCase().includes('ishoma');

            const sesiStatus = isHariIniTerpilih && !isBreak
              ? getStatusSesiMapel(item.jam)
              : { status: 'upcoming', sisaMenit: null };

            const isSesiAktif = sesiStatus.status === 'active';
            const isSesiLewat = sesiStatus.status === 'passed';

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isSesiAktif
                    ? 'bg-[#CAF0F8]/80 border-l-4 border-l-[#0077B6]'
                    : isSesiLewat
                    ? 'opacity-60 bg-slate-50'
                    : isBreak
                    ? 'bg-slate-50/70 text-slate-600'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Waktu & Nama Mapel */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0077B6]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.jam}</span>
                    {isSesiAktif && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0077B6] text-white font-sans shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Sedang Berlangsung {sesiStatus.sisaMenit ? `(sisa ${sesiStatus.sisaMenit} mnt)` : ''}
                      </span>
                    )}
                  </div>

                  <h4 className={`font-heading text-base font-extrabold break-words ${
                    isBreak ? 'text-slate-600 font-semibold' : 'text-[#03045E]'
                  }`}>
                    {item.nama}
                  </h4>

                  {!isBreak && item.guru !== '-' && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="break-words">{item.guru}</span>
                    </div>
                  )}
                </div>

                {/* Ruangan */}
                <div className="flex-shrink-0 sm:text-right pt-1 sm:pt-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full ${
                      isBreak
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-[#CAF0F8] text-[#03045E] border border-[#90E0EF]'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-[#0077B6]" />
                    <span>{item.ruang}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
