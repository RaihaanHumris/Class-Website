import React from 'react';
import { Link } from 'react-router-dom';
import { daftarAnggota } from '../../data/anggota';
import { getInitials } from '../../utils/helpers';

export default function AvatarStack() {
  const totalSiswa = daftarAnggota.length;
  const maxTampil = 8;
  const siswaTampil = daftarAnggota.slice(0, maxTampil);
  const sisaSiswa = totalSiswa - maxTampil;

  const paletteStyles = [
    { bg: 'bg-[#03045E]', text: 'text-white' },
    { bg: 'bg-[#0077B6]', text: 'text-white' },
    { bg: 'bg-[#00B4D8]', text: 'text-[#03045E]' },
    { bg: 'bg-[#90E0EF]', text: 'text-[#03045E]' },
    { bg: 'bg-[#CAF0F8]', text: 'text-[#03045E]' },
    { bg: 'bg-[#03045E]', text: 'text-white' },
    { bg: 'bg-[#0077B6]', text: 'text-white' },
    { bg: 'bg-[#00B4D8]', text: 'text-[#03045E]' },
  ];

  return (
    <Link
      to="/anggota"
      className="inline-flex items-center gap-3 pt-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded-lg"
      title={`Lihat direktori lengkap ${totalSiswa} siswa`}
    >
      {/* Tumpukan Avatar (-12px overlap) */}
      <div className="flex items-center -space-x-3">
        {siswaTampil.map((siswa, idx) => {
          const initials = getInitials(siswa.nama);
          const style = paletteStyles[idx % paletteStyles.length];

          return (
            <div
              key={siswa.id}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#03045E] flex items-center justify-center font-heading font-extrabold text-[11px] sm:text-xs shadow-sm transition-transform group-hover:scale-105 ${style.bg} ${style.text}`}
              title={siswa.nama}
            >
              {initials}
            </div>
          );
        })}

        {/* Penanda Sisa Siswa (+15) */}
        {sisaSiswa > 0 && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#03045E] bg-[#0077B6] text-white flex items-center justify-center font-heading font-extrabold text-[11px] sm:text-xs shadow-sm">
            +{sisaSiswa}
          </div>
        )}
      </div>

      {/* Label Deskriptif */}
      <span className="text-xs sm:text-sm text-[#CAF0F8]/90 font-medium group-hover:text-white group-hover:underline transition-colors">
        {totalSiswa} siswa terdaftar
      </span>
    </Link>
  );
}
