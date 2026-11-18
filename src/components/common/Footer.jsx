import React from 'react';
import { Link } from 'react-router-dom';
import { infoKelas } from '../../data/kelas';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050e29] text-white border-t border-white/10 mt-10 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-32 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Identitas Album Kenangan */}
          <div className="md:col-span-5 space-y-2.5">
            <h3 className="font-editorial font-semibold text-xl text-white">
              {infoKelas.nama} · {infoKelas.sekolah}
            </h3>
            <p className="text-xs text-[#90E0EF]">
              {infoKelas.jurusan} · Angkatan {infoKelas.tahunAjaran}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm pt-1">
              "{infoKelas.tagline}" — Buku kenangan digital kelas XII PPLG 3 Madrasah Aliyah Kejuruan Negeri Ende.
            </p>
          </div>

          {/* Tautan Halaman */}
          <div className="md:col-span-4 space-y-2.5 text-xs">
            <span className="font-semibold text-[#90E0EF] block">
              Jelajahi Kenangan
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-300">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <Link to="/galeri" className="hover:text-white transition-colors">Galeri &amp; Panggung 3D</Link>
              <Link to="/anggota" className="hover:text-white transition-colors">Anggota &amp; Sahabat</Link>
              <Link to="/jejak" className="hover:text-white transition-colors">Jejak Kelas</Link>
              <Link to="/kirim-foto" className="hover:text-white transition-colors">Kirim Foto Baru</Link>
              <Link to="/admin" className="hover:text-white transition-colors">Login Admin</Link>
            </div>
          </div>

          {/* Info Wali Kelas & Lokasi */}
          <div className="md:col-span-3 space-y-2 text-xs text-slate-300">
            <span className="font-semibold text-[#90E0EF] block">
              Wali Kelas &amp; Madrasah
            </span>
            <p>
              Wali Kelas: <strong className="text-white font-semibold">{infoKelas.waliKelas.nama}</strong>
            </p>
            <p className="text-slate-400 leading-relaxed pt-1">
              {infoKelas.kontak.alamat}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {currentYear} Album Kenangan {infoKelas.nama} {infoKelas.sekolah}.</p>
          <p className="font-mono text-[11px] text-[#90E0EF]/80">22 Siswa Aktif · 3 Sahabat Seperjuangan</p>
        </div>
      </div>
    </footer>
  );
}
