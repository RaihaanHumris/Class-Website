import React from 'react';
import { Sparkles, CheckSquare, Users } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { getSiswaById, getInitials } from '../../utils/helpers';

export default function PiketCard({ piket, isToday = false }) {
  const { hari, idSiswa = [], tugasKhusus } = piket;

  // Resolusi data siswa dari ID
  const siswaList = idSiswa.map((id) => getSiswaById(id));

  return (
    <Card
      variant={isToday ? 'stackedNavy' : 'stacked'}
      className={`p-6 flex flex-col h-full relative overflow-hidden transition-all ${
        isToday ? 'border-[#03045E]' : ''
      }`}
    >
      {/* Header Hari */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-semibold text-[#0077B6] uppercase tracking-wider block">
            Jadwal Piket
          </span>
          <h3 className="text-2xl font-extrabold font-heading text-[#03045E]">
            {hari}
          </h3>
        </div>
        {isToday ? (
          <Badge variant="ocean" size="sm" icon={Sparkles}>
            Hari Ini
          </Badge>
        ) : (
          <span className="text-xs text-slate-500 font-medium">
            {siswaList.length} Petugas
          </span>
        )}
      </div>

      {/* Daftar Siswa Bertugas */}
      <div className="space-y-3 flex-1 mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#0077B6]" />
          Petugas Kebersihan:
        </p>

        <div className="space-y-2">
          {siswaList.map((siswa) => {
            const initials = getInitials(siswa.nama);

            return (
              <div
                key={siswa.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-[#CAF0F8]/50 transition-colors border border-slate-100"
              >
                {/* Avatar Mini */}
                <div className="w-8 h-8 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#03045E] truncate">
                    {siswa.nama}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Absen #{siswa.id} • {siswa.peran}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tugas Khusus */}
      {tugasKhusus && (
        <div className="mt-auto pt-4 border-t border-slate-100 bg-[#CAF0F8]/30 -mx-6 -mb-6 p-4 rounded-b-2xl">
          <p className="text-[11px] font-semibold text-[#03045E] flex items-center gap-1.5 mb-1">
            <CheckSquare className="w-3.5 h-3.5 text-[#0077B6]" />
            Fokus Tugas Hari {hari}:
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {tugasKhusus}
          </p>
        </div>
      )}
    </Card>
  );
}
