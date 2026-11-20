import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cake } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import { getMergedMembers, isBirthdayToday } from '../../utils/memberStorage';

export default function StudentWall() {
  const [members, setMembers] = useState(() => getMergedMembers());

  useEffect(() => {
    const sync = () => setMembers(getMergedMembers());
    window.addEventListener('pplg3-members-updated', sync);
    return () => window.removeEventListener('pplg3-members-updated', sync);
  }, []);

  return (
    <section className="bg-[#FFFDF9] py-14 border-y border-[#E6DFD3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E6DFD3] pb-4">
          <div>
            <p className="text-xs font-semibold text-[#9A3412]">
              Keluarga Besar Angkatan 2024–2027
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#0B1D3A] mt-1">
              Dinding {members.length} Nama Kenangan XII PPLG 3
            </h2>
          </div>

          <Link
            to="/anggota"
            className="text-xs sm:text-sm font-semibold text-[#9A3412] hover:text-[#0B1D3A] inline-flex items-center gap-1.5 group whitespace-nowrap"
          >
            <span>Lihat Profil Lengkap ({members.length} Orang)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {members.map((siswa) => {
            const initials = getInitials(siswa.nama);
            const isSpecial = siswa.status === 'pindah';
            const isPengurus = !isSpecial && siswa.peran && siswa.peran !== 'Anggota';
            const birthdayToday = isBirthdayToday(siswa.ultah);

            return (
              <Link
                key={siswa.id}
                to="/anggota"
                className={`group flex flex-col items-center p-3.5 rounded-xl border transition-all ${
                  birthdayToday
                    ? 'bg-amber-50 border-[#B45309] shadow-xs'
                    : isSpecial
                    ? 'bg-amber-50/60 border-amber-300/80 hover:border-[#B45309]'
                    : 'bg-[#FAF6EE] border-[#E6DFD3] hover:border-[#B45309] hover:bg-white'
                }`}
                title={`${siswa.nama} · ${siswa.peran}`}
              >
                <div className="relative mb-2">
                  {siswa.foto ? (
                    <img
                      src={siswa.foto}
                      alt={siswa.nama}
                      width="44"
                      height="44"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#B45309] transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#B45309] to-[#9A3412] text-white flex items-center justify-center font-editorial font-bold text-sm transition-transform group-hover:scale-105 shadow-2xs">
                      {initials}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 font-mono text-[9px] font-bold px-1 rounded bg-[#0B1D3A] text-white tabular-nums">
                    {String(siswa.id).padStart(2, '0')}
                  </span>
                </div>

                <span className="font-heading font-semibold text-xs text-[#0B1D3A] line-clamp-1 text-center w-full">
                  {siswa.nama}
                </span>

                <span
                  className={`text-[10px] line-clamp-1 text-center mt-0.5 ${
                    birthdayToday
                      ? 'font-bold text-[#9A3412] inline-flex items-center gap-0.5'
                      : isSpecial
                      ? 'font-semibold text-amber-900'
                      : isPengurus
                      ? 'font-semibold text-[#9A3412]'
                      : 'text-slate-600'
                  }`}
                >
                  {birthdayToday ? (
                    <>
                      <Cake className="w-3 h-3" />
                      <span>Ultah Hari Ini!</span>
                    </>
                  ) : isSpecial ? (
                    'Sahabat · Pindah'
                  ) : isPengurus ? (
                    siswa.peran
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
