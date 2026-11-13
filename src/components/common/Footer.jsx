import React from 'react';
import { Link } from 'react-router-dom';
import { infoKelas } from '../../data/kelas';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#03045E] text-white border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Identitas Kelas (5 Kolom) */}
          <div className="md:col-span-5 space-y-2">
            <h3 className="font-heading font-bold text-lg text-white">
              {infoKelas.nama} · {infoKelas.sekolah}
            </h3>
            <p className="text-xs text-[#90E0EF]">
              {infoKelas.jurusan}
            </p>
            <p className="text-xs text-[#CAF0F8]/80 leading-relaxed max-w-sm pt-1">
              "{infoKelas.tagline}" — Papan informasi digital kelas XII PPLG 3 Madrasah Aliyah Kejuruan Negeri Ende.
            </p>
          </div>

          {/* Kolom Tengah: Tautan Halaman (4 Kolom) */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <span className="font-bold text-[#90E0EF] uppercase tracking-wider block">
              Menu Halaman
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[#CAF0F8]">
              <Link to="/" className="hover:text-white">Beranda</Link>
              <Link to="/profil" className="hover:text-white">Profil & Wali Kelas</Link>
              <Link to="/anggota" className="hover:text-white">Daftar 23 Siswa</Link>
              <Link to="/jadwal" className="hover:text-white">Jadwal Pelajaran</Link>
              <Link to="/piket" className="hover:text-white">Jadwal Piket</Link>
              <Link to="/tugas" className="hover:text-white">Daftar Tugas</Link>
              <Link to="/galeri" className="hover:text-white">Galeri Foto</Link>
              <Link to="/kontak" className="hover:text-white">Kontak Kelas</Link>
            </div>
          </div>

          {/* Kolom Kanan: Info Wali Kelas & Madrasah (3 Kolom) */}
          <div className="md:col-span-3 space-y-2 text-xs text-[#CAF0F8]">
            <span className="font-bold text-[#90E0EF] uppercase tracking-wider block">
              Informasi
            </span>
            <p>
              Wali Kelas: <strong className="text-white">{infoKelas.waliKelas.nama}</strong>
            </p>
            <p className="text-white/70 leading-relaxed pt-1">
              {infoKelas.kontak.alamat}
            </p>
          </div>

        </div>

        {/* Baris Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {currentYear} XII PPLG 3 MAKN Ende.</p>
          <p className="font-mono text-[11px] text-[#90E0EF]/80">Code Together, Grow Together</p>
        </div>
      </div>
    </footer>
  );
}
