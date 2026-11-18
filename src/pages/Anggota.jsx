import React, { useState, useMemo } from 'react';
import { Search, X, Users, LayoutGrid, List } from 'lucide-react';
import MemberCard from '../components/features/MemberCard';
import SpecialAlumniSection from '../components/features/SpecialAlumniSection';
import YearbookDesk from '../components/features/YearbookDesk';
import { daftarAnggota, siswaAktif, sahabatPindah } from '../data/anggota';

export default function Anggota() {
  const [viewMode, setViewMode] = useState('desk'); // 'desk' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const totalKeluarga = daftarAnggota.length;

  const filteredAnggota = useMemo(() => {
    return daftarAnggota.filter((siswa) => {
      const matchSearch =
        siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (siswa.minat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (siswa.peran || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  }, [searchTerm, roleFilter]);

  const filterTabs = [
    { key: 'Semua', label: `Semua (${totalKeluarga})` },
    { key: 'Siswa Aktif', label: `Siswa Aktif (${siswaAktif.length})` },
    { key: 'Pengurus', label: 'Pengurus (4)' },
    { key: 'Sahabat Pindah', label: `Sahabat Pindah (${sahabatPindah.length})` },
  ];

  return (
    <div className={`w-full min-h-screen ${viewMode === 'desk' ? 'bg-zinc-950' : 'bg-[#FAF8F3] pb-16'}`}>
      {/* Header Direktori & Meja Kenangan */}
      <section className="bg-[#050e29] text-white py-8 sm:py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#90E0EF]">
              Buku Tahunan Digital · XII PPLG 3 MAKN Ende
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              26 Profil Keluarga Besar Kelas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {siswaAktif.length} siswa aktif (#01–#22), {sahabatPindah.length} murid spesial (#23–#25), dan 1 Wali Kelas di atas meja kenangan interaktif.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:inline-flex items-center p-1 rounded-xl bg-white/10 border border-white/15 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('desk')}
              className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'desk'
                  ? 'bg-white text-[#03045E]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Meja Polaroid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`min-h-[40px] sm:min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                viewMode === 'list'
                  ? 'bg-white text-[#03045E]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Direktori Daftar</span>
            </button>
          </div>
        </div>
      </section>

      {viewMode === 'desk' ? (
        <YearbookDesk />
      ) : (
        <>
          {/* Penghormatan Spesial untuk 3 Sahabat yang Pindah Sekolah */}
          <SpecialAlumniSection />

          {/* Pencarian & Filter Direktori */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-slate-200/80 rounded-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama teman, peran pengurus, atau nomor..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm text-[#03045E] bg-[#FAF8F3] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#0077B6] min-h-[44px]"
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
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      roleFilter === tab.key
                        ? tab.key === 'Sahabat Pindah'
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#03045E] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-xs sm:text-sm text-slate-600">
              <span className="tabular-nums">
                Menampilkan <strong className="text-[#03045E] font-bold">{filteredAnggota.length}</strong> dari {totalKeluarga} anggota keluarga kelas
              </span>
              <span className="text-xs text-[#0077B6] font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Angkatan 2023–2026</span>
              </span>
            </div>

            {filteredAnggota.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAnggota.map((siswa) => (
                  <MemberCard key={siswa.id} anggota={siswa} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
                <p className="font-heading font-bold text-base text-[#03045E]">
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

