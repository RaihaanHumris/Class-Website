import React, { useState, useMemo } from 'react';
import { Search, X, Users } from 'lucide-react';
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
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Direktori Siswa
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Daftar {totalSiswa} Siswa XII PPLG 3
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            {totalSiswa} calon software engineer, game developer, dan database analyst angkatan 2025/2026 MAKN Ende.
          </p>
        </div>
      </section>

      {/* 2. Wave Divider SVG */}
      <div className="w-full overflow-hidden leading-none bg-slate-50 -mt-px select-none pointer-events-none mb-8 sm:mb-10">
        <svg
          className="block w-full h-10 md:h-14 text-[#0077B6] fill-current"
          preserveAspectRatio="none"
          viewBox="0 0 1440 96"
        >
          <path d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {/* 3. Konten Direktori */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-white p-4 sm:p-5 border border-slate-100 rounded-[24px] shadow-[0_8px_24px_rgba(3,4,94,0.06)]">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama, nomor absen, atau minat..."
              className="w-full pl-11 pr-10 py-2.5 text-sm text-[#03045E] bg-slate-50/70 border border-slate-200 rounded-full focus:outline-none focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#00B4D8]/20 min-h-[44px] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Hapus kata kunci"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {['Semua', 'Pengurus', 'Anggota'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`min-h-[44px] px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
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
        <div className="flex items-center justify-between px-1 text-xs sm:text-sm text-slate-600">
          <span>
            Menampilkan <strong className="text-[#03045E] font-bold">{filteredAnggota.length}</strong> dari {totalSiswa} siswa
          </span>
          <span className="text-xs text-[#0077B6] font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>Angkatan 2025/2026</span>
          </span>
        </div>

        {/* Grid Siswa */}
        {filteredAnggota.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAnggota.map((siswa) => (
              <MemberCard key={siswa.id} anggota={siswa} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_8px_24px_rgba(3,4,94,0.06)] p-12 text-center space-y-2">
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
