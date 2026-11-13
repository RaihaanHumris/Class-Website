import React from 'react';
import { User, Code, Award } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { getInitials } from '../../utils/helpers';

export default function MemberCard({ anggota }) {
  const { id, nama, peran, foto, minat } = anggota;
  const initials = getInitials(nama);

  // Palet avatar inisial berdasar ID
  const avatarColors = [
    'bg-[#03045E] text-white',
    'bg-[#0077B6] text-white',
    'bg-[#00B4D8] text-[#03045E]',
    'bg-[#90E0EF] text-[#03045E]',
    'bg-[#CAF0F8] text-[#03045E]',
  ];
  const colorClass = avatarColors[(id - 1) % avatarColors.length];

  const isPengurus = peran && peran !== 'Anggota';

  return (
    <Card
      variant="stacked"
      className="flex flex-col items-center text-center p-6 h-full group"
    >
      {/* Container Avatar */}
      <div className="relative mb-4">
        {foto ? (
          <img
            src={foto}
            alt={nama}
            className="w-20 h-20 rounded-full object-cover border-4 border-[#CAF0F8] shadow-md group-hover:border-[#00B4D8] transition-colors"
          />
        ) : (
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center font-heading font-bold text-xl border-4 border-[#CAF0F8] shadow-md group-hover:border-[#00B4D8] transition-colors ${colorClass}`}
            aria-label={`Avatar inisial untuk ${nama}`}
          >
            {initials}
          </div>
        )}

        {/* Nomor Absen Badge Kapsul */}
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#03045E] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow">
          {id}
        </span>
      </div>

      {/* Nama Siswa */}
      <h3 className="font-heading font-bold text-lg text-[#03045E] mb-1 group-hover:text-[#0077B6] transition-colors line-clamp-1">
        {nama}
      </h3>

      {/* Peran / Jabatan */}
      <div className="mb-3">
        {isPengurus ? (
          <Badge variant="ocean" size="sm" icon={Award}>
            {peran}
          </Badge>
        ) : (
          <Badge variant="mist" size="sm">
            {peran || 'Anggota'}
          </Badge>
        )}
      </div>

      {/* Minat / Fokus IT */}
      {minat && (
        <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Code className="w-3.5 h-3.5 text-[#0077B6]" />
          <span className="font-medium text-[#0077B6]">{minat}</span>
        </div>
      )}
    </Card>
  );
}
