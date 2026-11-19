import React, { useState, useEffect, useMemo } from 'react';
import { Cake, Sparkles, X, PartyPopper, Heart, UserCheck } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import {
  getMergedMembers,
  getActiveMemberId,
  getTodayMMDD,
  isBirthdayToday,
  formatBirthdayIndonesian,
  isBirthdayModalDismissedToday,
  setBirthdayModalDismissedToday,
} from '../../utils/memberStorage';

export function BirthdayBanner({ onOpenPersonalModal }) {
  const [members, setMembers] = useState(() => getMergedMembers());
  const [activeMemberId, setActiveId] = useState(() => getActiveMemberId());
  const todayMMDD = getTodayMMDD();

  useEffect(() => {
    const sync = () => {
      setMembers(getMergedMembers());
      setActiveId(getActiveMemberId());
    };
    window.addEventListener('pplg3-members-updated', sync);
    return () => window.removeEventListener('pplg3-members-updated', sync);
  }, []);

  const birthdayMembers = useMemo(
    () => members.filter((m) => isBirthdayToday(m.ultah, todayMMDD)),
    [members, todayMMDD]
  );

  if (birthdayMembers.length === 0) return null;

  const activeUser = members.find((m) => Number(m.id) === Number(activeMemberId));
  const isActiveUserBirthday = activeUser && isBirthdayToday(activeUser.ultah, todayMMDD);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
      <div className="rounded-2xl bg-gradient-to-r from-[#0B1D3A] via-[#122B54] to-[#0B1D3A] text-white border border-amber-400/40 p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Cake className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-300 tracking-wide">
                Hari Spesial Keluarga XII PPLG 3 · {formatBirthdayIndonesian(todayMMDD)}
              </span>
              {isActiveUserBirthday && (
                <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md">
                  Hari Ulang Tahunmu!
                </span>
              )}
            </div>

            <p className="font-editorial text-base sm:text-lg font-semibold text-white leading-snug">
              Selamat Ulang Tahun untuk{' '}
              <span className="text-amber-300">
                {birthdayMembers.map((m) => m.nama).join(' & ')}
              </span>
              !
            </p>
            <p className="text-xs text-slate-300">
              Semoga sehat selalu, dimudahkan langkahnya, dan sukses meraih cita-cita bersama kenangan indah XII PPLG 3 MAKN Ende.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
          {birthdayMembers.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenPersonalModal?.(m)}
              className="flex-1 md:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D97706] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Kartu Ucapan {m.panggilan || m.nama.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GlobalBirthdayModal({ manualMember, onCloseManual }) {
  const [members, setMembers] = useState(() => getMergedMembers());
  const [activeMemberId, setActiveId] = useState(() => getActiveMemberId());
  const [autoOpenMember, setAutoOpenMember] = useState(null);
  const todayMMDD = getTodayMMDD();

  useEffect(() => {
    const sync = () => {
      setMembers(getMergedMembers());
      setActiveId(getActiveMemberId());
    };
    window.addEventListener('pplg3-members-updated', sync);
    return () => window.removeEventListener('pplg3-members-updated', sync);
  }, []);

  // Automatically trigger personal birthday popup if the user marked as "Ini Saya" has a birthday today
  useEffect(() => {
    if (!activeMemberId) {
      setAutoOpenMember(null);
      return;
    }
    const me = members.find((m) => Number(m.id) === Number(activeMemberId));
    if (
      me &&
      isBirthdayToday(me.ultah, todayMMDD) &&
      !isBirthdayModalDismissedToday(me.id, todayMMDD)
    ) {
      setAutoOpenMember(me);
    } else {
      setAutoOpenMember(null);
    }
  }, [activeMemberId, members, todayMMDD]);

  const targetMember = manualMember || autoOpenMember;

  useEffect(() => {
    if (!targetMember) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  if (!targetMember) return null;

  const isMe = Number(targetMember.id) === Number(activeMemberId);
  const initials = getInitials(targetMember.nama);

  const handleDismiss = () => {
    if (targetMember?.id) {
      setBirthdayModalDismissedToday(targetMember.id, todayMMDD);
    }
    setAutoOpenMember(null);
    onCloseManual?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1D3A]/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bday-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF6EE] border-2 border-[#D97706] shadow-2xl overflow-hidden text-center">
        {/* Top Navy & Amber Header Banner with Festive Accents */}
        <div className="relative bg-gradient-to-br from-[#0B1D3A] via-[#132C57] to-[#0B1D3A] text-white pt-8 pb-12 px-6 border-b border-amber-400/30">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup ucapan ulang tahun"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isMe ? 'Ucapan Spesial Hari Ulang Tahunmu' : 'Perayaan Ulang Tahun XII PPLG 3'}
            </span>
          </div>

          <h2
            id="bday-modal-title"
            className="font-editorial text-2xl sm:text-3xl font-semibold text-white leading-tight"
          >
            Barakallahu Fi Umrik,{' '}
            <span className="text-amber-300">
              {targetMember.panggilan || targetMember.nama.split(' ')[0]}!
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {formatBirthdayIndonesian(targetMember.ultah || todayMMDD)} · Keluarga Besar XII PPLG 3 MAKN Ende
          </p>
        </div>

        {/* Avatar Overlap Badge */}
        <div className="relative -mt-10 flex justify-center">
          <div className="relative">
            {targetMember.foto ? (
              <img
                src={targetMember.foto}
                alt={targetMember.nama}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#FAF6EE] ring-2 ring-[#D97706] shadow-lg bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white font-editorial font-bold text-2xl flex items-center justify-center border-4 border-[#FAF6EE] ring-2 ring-[#D97706] shadow-lg">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0B1D3A] text-amber-300 flex items-center justify-center border-2 border-[#FAF6EE] shadow">
              <Cake className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Personal Greeting Body */}
        <div className="p-6 pt-4 space-y-4">
          <div>
            <h3 className="font-editorial font-semibold text-xl text-[#0B1D3A]">
              {targetMember.nama}
            </h3>
            <p className="text-xs font-semibold text-[#D97706] mt-0.5">
              {targetMember.peran || 'Anggota'} · {targetMember.minat || 'XII PPLG 3'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6DFD3] text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 shadow-2xs">
            <p>
              {isMe
                ? `Selamat ulang tahun, ${targetMember.nama}! Terima kasih telah menjadi bagian tak tergantikan dari perjalanan, tawa, dan perjuangan kelas XII PPLG 3 MAKN Ende.`
                : `Hari ini adalah hari spesial bagi sahabat kita, ${targetMember.nama}. Mari doakan semoga langkah dan cita-citanya selalu diberkahi!`}
            </p>
            <p className="text-xs text-[#B45309] font-medium pt-1">
              “Semoga setiap baris kode dan langkah masa depanmu selalu membawa kebahagiaan serta keberkahan.”
            </p>
          </div>

          {isMe && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1D3A] bg-amber-100/80 px-3 py-1.5 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Terdeteksi otomatis dari profil "Ini Saya" di perangkat ini</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B1D3A] hover:bg-[#162d57] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Terima Kasih &amp; Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
