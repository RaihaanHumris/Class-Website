import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { daftarAnggota } from '../../data/anggota';
import { getInitials } from '../../utils/helpers';

export default function StudentWall() {
  const paletteList = [
    { bg: 'bg-[#03045E]', text: 'text-white', border: 'border-[#0077B6]' },
    { bg: 'bg-[#0077B6]', text: 'text-white', border: 'border-[#00B4D8]' },
    { bg: 'bg-[#00B4D8]', text: 'text-[#03045E]', border: 'border-[#03045E]' },
    { bg: 'bg-[#90E0EF]', text: 'text-[#03045E]', border: 'border-[#0077B6]' },
    { bg: 'bg-[#CAF0F8]', text: 'text-[#03045E]', border: 'border-[#00B4D8]' },
  ];

  return (
    <section className="bg-white -mt-8 pt-12 md:pt-16 pb-12 md:pb-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Dinding Siswa */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
              Daftar Siswa Kelas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
              Dinding {daftarAnggota.length} Siswa XII PPLG 3
            </h2>
          </div>
          <Link
            to="/anggota"
            className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:text-[#03045E] flex items-center gap-1 group"
          >
            <span>Buka Direktori Lengkap ({daftarAnggota.length} Siswa)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid 23 Avatar Kapsul & Bulat */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {daftarAnggota.map((siswa, idx) => {
            const initials = getInitials(siswa.nama);
            const style = paletteList[idx % paletteList.length];
            const isPengurus = siswa.peran && siswa.peran !== 'Anggota';

            return (
              <Link
                key={siswa.id}
                to="/anggota"
                className="group relative flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0077B6] hover:bg-white hover:shadow-md transition-all duration-150 active:scale-95"
                title={`${siswa.nama} - ${siswa.peran}`}
              >
                {/* Avatar Inisial */}
                <div className="relative mb-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-heading font-extrabold text-sm shadow-sm transition-transform group-hover:scale-105 ${style.bg} ${style.text}`}
                  >
                    {initials}
                  </div>

                  {/* Absen Tag */}
                  <span className="absolute -bottom-1 -right-1 font-mono text-[9px] font-bold px-1 rounded bg-[#03045E] text-white">
                    {String(siswa.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Nama Siswa */}
                <span className="font-heading font-bold text-xs text-[#03045E] group-hover:text-[#0077B6] line-clamp-1 text-center w-full">
                  {siswa.nama}
                </span>

                {/* Peran / Minat */}
                <span className="text-[10px] text-slate-500 line-clamp-1 text-center mt-0.5">
                  {isPengurus ? (
                    <strong className="text-[#0077B6]">{siswa.peran}</strong>
                  ) : (
                    siswa.minat
                  )}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
