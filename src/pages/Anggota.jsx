import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import MemberCard from '../components/features/MemberCard';
import { daftarAnggota } from '../data/anggota';

export default function Anggota() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const totalSiswa = daftarAnggota.length;

  const filteredAnggota = useMemo(() => {
    return daftarAnggota.filter((siswa) => {
      const matchSearch =
        siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siswa.minat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(siswa.id).includes(searchTerm);

      if (roleFilter === 'Pengurus') {
        return matchSearch && siswa.peran !== 'Anggota';
      }
      if (roleFilter === 'Anggota') {
        return matchSearch && siswa.peran === 'Anggota';
      }
      return matchSearch;
    });
  }, [searchTerm, roleFilter]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Direktori Siswa
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Daftar {totalSiswa} Siswa XII PPLG 3
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            {totalSiswa} calon software engineer, game developer, dan database analyst angkatan 2025/2026 MAKN Ende.
          </p>
        </div>
      </section>

      {/* Konten Direktori */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 border-2 border-slate-200 rounded-xl shadow-xs">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama, nomor absen, atau minat..."
              className="w-full pl-10 pr-9 py-2.5 text-sm text-[#03045E] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0077B6] min-h-[44px]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Hapus kata kunci"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {['Semua', 'Pengurus', 'Anggota'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                  roleFilter === role
                    ? 'bg-[#0077B6] text-white shadow-sm'
                    : 'bg-[#CAF0F8] text-[#03045E] hover:bg-[#90E0EF]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

        </div>

        {/* Counter */}
        <div className="text-xs sm:text-sm text-slate-600">
          Menampilkan <strong className="text-[#03045E] font-bold">{filteredAnggota.length}</strong> dari {totalSiswa} siswa
        </div>

        {/* Grid Siswa */}
        {filteredAnggota.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAnggota.map((siswa) => (
              <MemberCard key={siswa.id} anggota={siswa} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-2">
            <p className="font-heading font-bold text-base text-[#03045E]">
              Tidak ada siswa yang cocok
            </p>
            <p className="text-xs text-slate-500">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
