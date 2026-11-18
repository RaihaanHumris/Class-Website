import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function MemberCard({ anggota }) {
  const { id, nama, peran, foto, minat, status, periode, catatanKenangan } = anggota;
  const initials = getInitials(nama);
  const isSpecial = status === 'pindah';
  const isPengurus = !isSpecial && peran && peran !== 'Anggota';

  const avatarColors = [
    'bg-[#03045E] text-white',
    'bg-[#0077B6] text-white',
    'bg-[#0D47A1] text-white',
    'bg-[#1E3A8A] text-white',
  ];
  const colorClass = avatarColors[(id - 1) % avatarColors.length];

  if (isSpecial) {
    return (
      <article className="flex flex-col p-6 rounded-2xl bg-amber-50/70 border border-amber-300/80 shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-editorial font-semibold text-xl ring-4 ring-amber-100">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#03045E] text-amber-300 text-[11px] font-mono font-bold flex items-center justify-center border-2 border-white tabular-nums">
              {id}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-amber-800">
              Sahabat Seperjuangan · Pindah Sekolah
            </p>
            <h3 className="font-editorial font-semibold text-lg text-[#03045E] leading-snug mt-0.5">
              {nama}
            </h3>
            <p className="text-xs text-amber-900/75 mt-1 font-mono">
              {periode || 'Masa Awal PPLG 3'}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-auto pt-3 border-t border-amber-200/80">
          {catatanKenangan}
        </p>
      </article>
    );
  }

  return (
    <article className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0077B6]/40 transition-colors h-full">
      <div className="relative mb-4">
        {foto ? (
          <img
            src={foto}
            alt={nama}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#90E0EF]"
          />
        ) : (
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center font-heading font-bold text-xl border-2 border-[#CAF0F8] ${colorClass}`}
            aria-label={`Inisial ${nama}`}
          >
            {initials}
          </div>
        )}

        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#03045E] text-white text-[11px] font-mono font-bold flex items-center justify-center border-2 border-white tabular-nums">
          {String(id).padStart(2, '0')}
        </span>
      </div>

      <h3 className="font-heading font-bold text-base text-[#03045E] mb-1 line-clamp-1">
        {nama}
      </h3>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-3">
        <span className={isPengurus ? 'font-semibold text-[#0077B6]' : ''}>
          {peran || 'Anggota'}
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-[11px] text-slate-400 tabular-nums">No. {String(id).padStart(2, '0')}</span>
      </div>

      {minat && (
        <div className="mt-auto pt-3 border-t border-slate-100 w-full text-xs text-slate-600 font-medium">
          {minat}
        </div>
      )}
    </article>
  );
}
