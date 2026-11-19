import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Users,
  LayoutGrid,
  List,
  UserPlus,
  Copy,
  Check,
  UserCheck,
  Cake,
} from 'lucide-react';
import MemberCard from '../components/features/MemberCard';
import SpecialAlumniSection from '../components/features/SpecialAlumniSection';
import YearbookDesk from '../components/features/YearbookDesk';
import MemberProfileForm from '../components/features/MemberProfileForm';
import { BirthdayBanner } from '../components/features/BirthdayCelebration';
import { fetchApprovedMemberPhotos, isSupabaseConfigured } from '../lib/supabase';
import {
  getMergedMembers,
  getActiveMemberId,
  setActiveMemberId,
  isBirthdayToday,
  syncMembersFromDatabase,
} from '../utils/memberStorage';

export default function Anggota({ onOpenBirthdayModal }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' (Direktori Daftar) | 'desk' (Meja Polaroid)
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [approvedPhotos, setApprovedPhotos] = useState({});
  const [members, setMembers] = useState(() => getMergedMembers());
  const [activeMemberId, setActiveId] = useState(() => getActiveMemberId());

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [copiedAllJson, setCopiedAllJson] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      setMembers(getMergedMembers());
      setActiveId(getActiveMemberId());
    };
    window.addEventListener('pplg3-members-updated', sync);
    syncMembersFromDatabase();
    return () => window.removeEventListener('pplg3-members-updated', sync);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    fetchApprovedMemberPhotos()
      .then((map) => {
        if (mounted) setApprovedPhotos(map);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const siswaAktifList = useMemo(
    () => members.filter((m) => m.status === 'aktif'),
    [members]
  );
  const sahabatPindahList = useMemo(
    () => members.filter((m) => m.status === 'pindah'),
    [members]
  );
  const pengurusList = useMemo(
    () => members.filter((m) => m.status === 'aktif' && m.peran && m.peran !== 'Anggota'),
    [members]
  );

  const filteredAnggota = useMemo(() => {
    return members.filter((siswa) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        siswa.nama.toLowerCase().includes(q) ||
        (siswa.panggilan || '').toLowerCase().includes(q) ||
        (siswa.minat || '').toLowerCase().includes(q) ||
        (siswa.peran || '').toLowerCase().includes(q) ||
        String(siswa.id).includes(searchTerm);

      if (roleFilter === 'Siswa Aktif') {
        return matchSearch && siswa.status === 'aktif';
      }
      if (roleFilter === 'Pengurus') {
        return matchSearch && siswa.status === 'aktif' && siswa.peran !== 'Anggota';
      }
      if (roleFilter === 'Sahabat Pindah') {
        return matchSearch && siswa.status === 'pindah';
      }
      return matchSearch;
    });
  }, [members, searchTerm, roleFilter]);

  const filterTabs = [
    { key: 'Semua', label: `Semua (${members.length})` },
    { key: 'Siswa Aktif', label: `Siswa Aktif (${siswaAktifList.length})` },
    { key: 'Pengurus', label: `Pengurus (${pengurusList.length})` },
    { key: 'Sahabat Pindah', label: `Sahabat Pindah (${sahabatPindahList.length})` },
  ];

  const handleOpenEdit = (member = null) => {
    setViewMode('list');
    setEditingMember(member);
    setShowProfileForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSelectAsMe = (member) => {
    const isCurrentlyMe = Number(activeMemberId) === Number(member.id);
    if (isCurrentlyMe) {
      setActiveMemberId(null);
    } else {
      setActiveMemberId(member.id);
      if (isBirthdayToday(member.ultah)) {
        onOpenBirthdayModal?.(member);
      }
    }
  };

  const handleCopyAllJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(members, null, 2));
      setCopiedAllJson(true);
      setTimeout(() => setCopiedAllJson(false), 3000);
    } catch {
      // ignore clipboard error
    }
  };

  const activeUserObj = useMemo(
    () => members.find((m) => Number(m.id) === Number(activeMemberId)),
    [members, activeMemberId]
  );

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] pb-20">
      {/* Header Direktori & Meja Kenangan */}
      <section className="bg-[#0B1D3A] text-white py-8 sm:py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-300 tracking-wide">
              Buku Tahunan Digital · XII PPLG 3 MAKN Ende
            </p>
            <h1 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              {members.length + 1} Profil Keluarga Besar Kelas
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {siswaAktifList.length} siswa aktif (#01–#{siswaAktifList.length}), {sahabatPindahList.length} sahabat seperjuangan (#23–#25), dan 1 Wali Kelas dalam direktori profil &amp; meja polaroid interaktif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="grid grid-cols-2 sm:inline-flex items-center p-1 rounded-xl bg-[#132C57] border border-white/15 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('desk')}
                className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  viewMode === 'desk'
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Meja Polaroid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  viewMode === 'list'
                    ? 'bg-[#D97706] text-white shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Direktori Daftar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Ulang Tahun Otomatis jika ada anggota yang berulang tahun hari ini */}
      <BirthdayBanner onOpenPersonalModal={(m) => onOpenBirthdayModal?.(m)} />

      {viewMode === 'desk' ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8">
          <YearbookDesk />
        </div>
      ) : (
        <>
          {/* Penghormatan Spesial untuk 3 Sahabat yang Pindah Sekolah */}
          <SpecialAlumniSection />

          {/* Area Direktori Daftar + Tombol Tambah / Lengkapi Profil */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            {/* Baris Aksi Profil Anggota & Status "Ini Saya" */}
            <div
              ref={formRef}
              className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6DFD3] shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-editorial text-lg sm:text-xl font-semibold text-[#0B1D3A]">
                    Direktori Anggota &amp; Pembaruan Profil Mandiri
                  </h2>
                  {activeUserObj && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#0B1D3A] text-amber-300 text-xs font-semibold">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Ini Saya: {activeUserObj.panggilan || activeUserObj.nama}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Lengkapi foto profil (otomatis dikompres 400×400px), tanggal ulang tahun, minat PPLG, dan tautan GitHub Anda.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (showProfileForm && !editingMember) {
                      setShowProfileForm(false);
                    } else {
                      handleOpenEdit(activeUserObj || null);
                    }
                  }}
                  className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D97706] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {showProfileForm ? 'Tutup Form Profil' : 'Tambah / Lengkapi Profil'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyAllJson}
                  className="min-h-[42px] px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-amber-100/70 text-[#0B1D3A] border border-[#D8CFC0] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  title="Salin seluruh data anggota dalam format JSON untuk dikirim ke Admin"
                >
                  {copiedAllJson ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">JSON Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#D97706]" />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Form Input / Lengkapi Profil Anggota */}
            {showProfileForm && (
              <MemberProfileForm
                members={members}
                initialMember={editingMember}
                onClose={() => {
                  setShowProfileForm(false);
                  setEditingMember(null);
                }}
                onSaved={(saved) => {
                  setMembers(getMergedMembers());
                  setActiveId(getActiveMemberId());
                  if (
                    Number(getActiveMemberId()) === Number(saved.id) &&
                    isBirthdayToday(saved.ultah)
                  ) {
                    onOpenBirthdayModal?.(saved);
                  }
                }}
              />
            )}

            {/* Pencarian & Filter Direktori */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#FFFDF9] p-4 sm:p-5 border border-[#E6DFD3] rounded-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama teman, panggilan, minat PPLG, atau nomor absen..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm text-[#0B1D3A] bg-[#FAF6EE] border border-[#D8CFC0] rounded-xl focus:outline-none focus:bg-white focus:border-[#D97706] min-h-[44px]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    aria-label="Hapus kata kunci"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setRoleFilter(tab.key)}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      roleFilter === tab.key
                        ? tab.key === 'Sahabat Pindah'
                          ? 'bg-[#D97706] text-white'
                          : 'bg-[#0B1D3A] text-white'
                        : 'bg-[#FAF6EE] text-slate-700 hover:bg-amber-100/60 border border-[#E6DFD3]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs sm:text-sm text-slate-600">
              <span className="tabular-nums">
                Menampilkan <strong className="text-[#0B1D3A] font-bold">{filteredAnggota.length}</strong> dari {members.length} anggota keluarga kelas
              </span>
              <span className="text-xs text-[#B45309] font-semibold flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-[#D97706]" />
                <span>Ketuk "Ini Saya" pada profil Anda untuk mengaktifkan pengingat ulang tahun</span>
              </span>
            </div>

            {filteredAnggota.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAnggota.map((siswa) => (
                  <MemberCard
                    key={siswa.id}
                    anggota={siswa}
                    approvedPhoto={approvedPhotos[`member-${String(siswa.id).padStart(2, '0')}`]}
                    isActiveUser={Number(activeMemberId) === Number(siswa.id)}
                    onSelectAsMe={handleSelectAsMe}
                    onEditProfile={(m) => handleOpenEdit(m)}
                    onCelebrateBirthday={(m) => onOpenBirthdayModal?.(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFDF9] border border-[#E6DFD3] rounded-2xl p-12 text-center space-y-2">
                <p className="font-heading font-bold text-base text-[#0B1D3A]">
                  Tidak ada nama yang cocok
                </p>
                <p className="text-xs text-slate-500">
                  Coba gunakan kata kunci pencarian yang lain.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
