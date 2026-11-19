import React from 'react';
import { Cake, Github, Globe, UserCheck, Pencil, Sparkles } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import {
  formatBirthdayIndonesian,
  isBirthdayToday,
} from '../../utils/memberStorage';

export default function MemberCard({
  anggota,
  approvedPhoto,
  isActiveUser = false,
  onSelectAsMe,
  onEditProfile,
  onCelebrateBirthday,
}) {
  const {
    id,
    nama,
    panggilan,
    peran,
    foto,
    minat,
    status,
    periode,
    catatanKenangan,
    ultah,
    bio,
    github,
    portfolio,
  } = anggota;

  const initials = getInitials(nama);
  const isSpecial = status === 'pindah';
  const isPengurus = !isSpecial && peran && peran !== 'Anggota';
  const effectivePhoto = approvedPhoto?.imageUrl || foto || '';
  const birthdayToday = isBirthdayToday(ultah);
  const formattedUltah = formatBirthdayIndonesian(ultah);

  const isProfileFilled = Boolean(
    panggilan || minat || ultah || bio || github || portfolio || effectivePhoto
  );

  if (isSpecial) {
    return (
      <article
        className={`flex flex-col p-6 rounded-2xl transition-all h-full ${
          birthdayToday
            ? 'bg-amber-50 border-2 border-[#D97706] shadow-md'
            : 'bg-[#FFFDF9] border border-amber-300/80 shadow-xs hover:border-[#D97706]'
        }`}
      >
        {(birthdayToday || isActiveUser) && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            {birthdayToday && (
              <button
                type="button"
                onClick={() => onCelebrateBirthday?.(anggota)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-[11px] font-bold shadow-xs cursor-pointer"
              >
                <Cake className="w-3.5 h-3.5" />
                <span>Ulang Tahun Hari Ini!</span>
              </button>
            )}
            {isActiveUser && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1D3A] text-amber-300 text-[11px] font-semibold">
                <UserCheck className="w-3 h-3" />
                <span>Ini Saya</span>
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {effectivePhoto ? (
              <img
                src={effectivePhoto}
                alt={nama}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover object-[50%_20%] border-2 border-[#D97706] ring-4 ring-amber-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white flex items-center justify-center font-editorial font-semibold text-xl ring-4 ring-amber-100 shadow-xs">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0B1D3A] text-amber-300 text-[11px] font-mono font-bold flex items-center justify-center border-2 border-white tabular-nums">
              {String(id).padStart(2, '0')}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#B45309]">
              Sahabat Seperjuangan · Pindah Sekolah
            </p>
            <h3 className="font-editorial font-semibold text-lg text-[#0B1D3A] leading-snug mt-0.5">
              {nama}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {panggilan ? `"${panggilan}" · ` : ''}
              <span className="font-mono">{periode || 'Masa Awal PPLG 3'}</span>
              {formattedUltah ? ` · ${formattedUltah}` : ''}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-auto pt-3 border-t border-amber-200/70">
          {bio || catatanKenangan}
        </p>

        <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectAsMe?.(anggota)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              isActiveUser
                ? 'bg-[#0B1D3A] text-amber-300'
                : 'bg-amber-100/80 hover:bg-amber-200/80 text-[#0B1D3A]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isActiveUser ? 'Profil Saya ✓' : 'Ini Saya'}</span>
          </button>

          <button
            type="button"
            onClick={() => onEditProfile?.(anggota)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B45309] hover:text-[#0B1D3A] bg-amber-100/60 hover:bg-amber-200/70 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Isi / Edit Profil</span>
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`flex flex-col p-6 rounded-2xl transition-all h-full ${
        birthdayToday
          ? 'bg-[#FFFDF8] border-2 border-[#D97706] shadow-md'
          : isActiveUser
          ? 'bg-[#FFFDF9] border-2 border-[#0B1D3A] shadow-sm'
          : 'bg-[#FFFDF9] border border-[#E6DFD3] shadow-xs hover:border-[#D97706]/60'
      }`}
    >
      {(birthdayToday || isActiveUser) && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {birthdayToday ? (
            <button
              type="button"
              onClick={() => onCelebrateBirthday?.(anggota)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <Cake className="w-3.5 h-3.5" />
              <span>Ulang Tahun Hari Ini!</span>
            </button>
          ) : (
            <span />
          )}

          {isActiveUser && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1D3A] text-amber-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Ini Saya</span>
            </span>
          )}
        </div>
      )}

      {/* Header: Orange/Amber Circular Initial Badge or Avatar + Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          {effectivePhoto ? (
            <img
              src={effectivePhoto}
              alt={nama}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover object-[50%_20%] border-2 border-[#D97706] ring-4 ring-amber-100/80"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white flex items-center justify-center font-editorial font-semibold text-xl ring-4 ring-amber-100/80 shadow-xs"
              aria-label={`Inisial ${nama}`}
            >
              {initials}
            </div>
          )}

          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0B1D3A] text-white text-[11px] font-mono font-bold flex items-center justify-center border-2 border-[#FFFDF9] tabular-nums">
            {String(id).padStart(2, '0')}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={isPengurus ? 'font-bold text-[#D97706]' : 'font-medium text-slate-500'}>
              {peran || 'Anggota'}
            </span>
            {panggilan && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 font-medium">"{panggilan}"</span>
              </>
            )}
          </div>

          <h3 className="font-editorial font-semibold text-lg text-[#0B1D3A] leading-snug truncate mt-0.5">
            {nama}
          </h3>

          {(minat || formattedUltah) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-1">
              {minat && <span className="font-medium text-[#0B1D3A]/80">{minat}</span>}
              {minat && formattedUltah && <span aria-hidden="true">·</span>}
              {formattedUltah && (
                <span className={`inline-flex items-center gap-1 ${birthdayToday ? 'text-[#D97706] font-bold' : 'text-slate-500'}`}>
                  <Cake className="w-3 h-3" />
                  <span>{formattedUltah}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio / Kutipan Singkat atau Status Belum Diisi */}
      {bio ? (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          “{bio}”
        </p>
      ) : !isProfileFilled ? (
        <div className="mb-4 p-3 rounded-xl bg-[#FAF6EE] border border-dashed border-[#D8CFC0] text-xs text-slate-500 leading-relaxed">
          Data profil belum diisi. Ketuk <strong className="text-[#0B1D3A]">Isi Profil</strong> di bawah untuk melengkapi data ke database.
        </div>
      ) : null}

      {/* Footer Actions: GitHub / Portfolio + Ini Saya + Isi / Edit Profil */}
      <div className="mt-auto pt-3 border-t border-[#EFE9DC] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectAsMe?.(anggota)}
            className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              isActiveUser
                ? 'bg-[#0B1D3A] text-amber-300'
                : 'bg-[#FAF6EE] hover:bg-amber-100/70 text-[#0B1D3A] border border-[#E6DFD3]'
            }`}
            title="Simpan sebagai profil aktif saya di perangkat ini"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isActiveUser ? 'Ini Saya ✓' : 'Ini Saya'}</span>
          </button>

          <button
            type="button"
            onClick={() => onEditProfile?.(anggota)}
            className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
              isProfileFilled
                ? 'text-slate-600 hover:text-[#0B1D3A] hover:bg-[#FAF6EE]'
                : 'bg-amber-100/80 hover:bg-amber-200/80 text-[#B45309]'
            }`}
            title="Lengkapi atau ubah profil anggota ini di database"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{isProfileFilled ? 'Edit Profil' : 'Isi Profil'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub ${nama}`}
              title={`GitHub ${nama}`}
              className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-[#0B1D3A] text-slate-700 hover:text-white border border-[#E6DFD3] flex items-center justify-center transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Portofolio ${nama}`}
              title={`Portofolio ${nama}`}
              className="w-8 h-8 rounded-lg bg-[#FAF6EE] hover:bg-[#D97706] text-slate-700 hover:text-white border border-[#E6DFD3] flex items-center justify-center transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
