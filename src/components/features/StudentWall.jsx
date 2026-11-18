import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { daftarAnggota } from '../../data/anggota';
import { getInitials } from '../../utils/helpers';

export default function StudentWall() {
  const paletteList = [
    { bg: 'bg-[#03045E]', text: 'text-white' },
    { bg: 'bg-[#0077B6]', text: 'text-white' },
    { bg: 'bg-[#0D47A1]', text: 'text-white' },
    { bg: 'bg-[#1E3A8A]', text: 'text-white' },
  ];

  return (
    <section className="bg-white py-14 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold text-[#0077B6]">
              Keluarga Besar Angkatan 2023–2026
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#03045E] mt-1">
              Dinding 25 Nama Kenangan XII PPLG 3
            </h2>
          </div>

          <Link
            to="/anggota"
            className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:text-[#03045E] inline-flex items-center gap-1.5 group whitespace-nowrap"
          >
            <span>Lihat Profil Lengkap ({daftarAnggota.length} Orang)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {daftarAnggota.map((siswa, idx) => {
            const initials = getInitials(siswa.nama);
            const isSpecial = siswa.status === 'pindah';
            const style = paletteList[idx % paletteList.length];
            const isPengurus = !isSpecial && siswa.peran && siswa.peran !== 'Anggota';

            return (
              <Link
                key={siswa.id}
                to="/anggota"
                className={`group flex flex-col items-center p-3.5 rounded-xl border transition-all ${
                  isSpecial
                    ? 'bg-amber-50/70 border-amber-300/90 hover:border-amber-500'
                    : 'bg-[#FAF8F3] border-slate-200/75 hover:border-[#0077B6] hover:bg-white'
                }`}
                title={`${siswa.nama} · ${siswa.peran}`}
              >
                <div className="relative mb-2">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-transform group-hover:scale-105 ${
                      isSpecial
                        ? 'bg-amber-600 text-white ring-2 ring-amber-200'
                        : `${style.bg} ${style.text}`
                    }`}
                  >
                    {initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 font-mono text-[9px] font-bold px-1 rounded bg-[#03045E] text-white tabular-nums">
                    {String(siswa.id).padStart(2, '0')}
                  </span>
                </div>

                <span className="font-heading font-semibold text-xs text-[#03045E] line-clamp-1 text-center w-full">
                  {siswa.nama}
                </span>

                <span
                  className={`text-[10px] line-clamp-1 text-center mt-0.5 ${
                    isSpecial
                      ? 'font-semibold text-amber-800'
                      : isPengurus
                      ? 'font-semibold text-[#0077B6]'
                      : 'text-slate-500'
                  }`}
                >
                  {isSpecial ? 'Sahabat · Pindah' : isPengurus ? siswa.peran : siswa.minat}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
