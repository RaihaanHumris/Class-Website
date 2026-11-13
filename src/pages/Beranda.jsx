import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';
import Hero from '../components/common/Hero';
import StudentWall from '../components/features/StudentWall';
import { jadwalMingguan } from '../data/jadwal';
import { jadwalPiket } from '../data/piket';
import { daftarTugas } from '../data/tugas';
import { albumGaleri } from '../data/galeri';
import { infoKelas } from '../data/kelas';
import {
  getHariInfo,
  formatTanggalIndo,
  getCountdownTenggat,
  getStatusSesiMapel,
  getSiswaById,
  getInitials
} from '../utils/helpers';

export default function Beranda() {
  const hariInfo = getHariInfo();

  // Jadwal & Piket hari ini
  const jadwalHariIni =
    jadwalMingguan.find((j) => j.dayIndex === hariInfo.index) || jadwalMingguan[0];
  const piketHariIni =
    jadwalPiket.find((p) => p.dayIndex === hariInfo.index) || jadwalPiket[0];
  const petugasPiket = (piketHariIni?.idSiswa || []).map((id) => getSiswaById(id));

  // Tugas yang belum selesai
  const tugasAktif = daftarTugas.filter((t) => t.status !== 'selesai').slice(0, 3);

  // Cuplikan 3 foto galeri
  const cuplikanFoto = albumGaleri.slice(0, 3);

  return (
    <div className="space-y-0 pb-0">
      
      {/* 1. Hero Full-Bleed Navy dengan Foto Duotone & Code Window */}
      <Hero />

      {/* 2. Dinding 23 Siswa (Latar Mist Penuh) */}
      <StudentWall />

      {/* 3. Papan Informasi Harian: Jadwal & Piket Hari Ini (Latar Putih) */}
      <section className="bg-white py-12 md:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Kolom Kiri: Jadwal Hari Ini dengan Penanda Sesi Aktif (7 Kolom) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b-2 border-[#03045E] pb-3">
                <div>
                  <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                    Jadwal Pelajaran
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
                    Jadwal Hari {jadwalHariIni.hari}
                  </h2>
                </div>
                <Link
                  to="/jadwal"
                  className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:text-[#03045E] flex items-center gap-1 group"
                >
                  <span>Lihat Jadwal 5 Hari</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Status Akhir Pekan Jika Libur */}
              {hariInfo.isWeekend && (
                <div className="p-3.5 rounded-lg bg-[#CAF0F8] text-[#03045E] text-xs font-medium border border-[#90E0EF]">
                  🎉 <strong>Hari ini libur akhir pekan!</strong> Menampilkan pratinjau jadwal pelajaran untuk hari <strong>Senin</strong> mendatang.
                </div>
              )}

              {/* Daftar Sesi Pembelajaran dengan Status Real-Time */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {jadwalHariIni.mapel.map((item, idx) => {
                  const isBreak =
                    item.nama.toLowerCase().includes('istirahat') ||
                    item.nama.toLowerCase().includes('ishoma');

                  // Cek status sesi apakah sedang berlangsung saat ini
                  const sesiStatus = !hariInfo.isWeekend && !isBreak
                    ? getStatusSesiMapel(item.jam)
                    : { status: 'upcoming', sisaMenit: null };

                  const isSesiAktif = sesiStatus.status === 'active';
                  const isSesiLewat = sesiStatus.status === 'passed';

                  return (
                    <div
                      key={idx}
                      className={`p-4 transition-colors ${
                        isSesiAktif
                          ? 'bg-[#CAF0F8]/70 border-l-4 border-l-[#0077B6]'
                          : isSesiLewat
                          ? 'opacity-60 bg-slate-50'
                          : isBreak
                          ? 'bg-slate-50/70 text-slate-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0077B6]">
                              {item.jam}
                            </span>
                            {isSesiAktif && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#0077B6] text-white">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Sedang Berlangsung {sesiStatus.sisaMenit ? `(sisa ${sesiStatus.sisaMenit} mnt)` : ''}
                              </span>
                            )}
                          </div>
                          <h3 className={`font-heading font-bold text-base ${
                            isBreak ? 'text-slate-600' : 'text-[#03045E]'
                          }`}>
                            {item.nama}
                          </h3>
                          {!isBreak && item.guru !== '-' && (
                            <p className="text-xs text-slate-500">
                              Guru Pengampu: {item.guru}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right flex-shrink-0">
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded ${
                            isBreak
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-[#CAF0F8] text-[#03045E]'
                          }`}>
                            {item.ruang}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kolom Kanan: Piket Hari Ini (5 Kolom) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border-b-2 border-[#03045E] pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                    Kebersihan & Ketertiban
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
                    Piket Hari {piketHariIni.hari}
                  </h2>
                </div>
                <Link
                  to="/piket"
                  className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:underline"
                >
                  Roster Piket →
                </Link>
              </div>

              <div className="bg-[#CAF0F8]/40 border border-[#90E0EF] rounded-xl p-5 space-y-4">
                <p className="text-sm font-bold text-[#03045E]">
                  Hari ini piket: siapa yang kebagian tugas?
                </p>

                {/* Daftar Nama Petugas Hari Ini */}
                <div className="space-y-2">
                  {petugasPiket.map((siswa) => (
                    <div
                      key={siswa.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#03045E] text-white text-xs font-mono font-bold flex items-center justify-center">
                          {siswa.id}
                        </span>
                        <div>
                          <p className="font-heading font-bold text-sm text-[#03045E]">
                            {siswa.nama}
                          </p>
                          <p className="text-[11px] text-slate-500">{siswa.peran}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#0077B6] bg-[#CAF0F8] px-2 py-0.5 rounded">
                        Wajib Hadir
                      </span>
                    </div>
                  ))}
                </div>

                {piketHariIni.tugasKhusus && (
                  <div className="pt-3 border-t border-[#90E0EF] text-xs text-slate-700">
                    <strong className="text-[#03045E] block mb-0.5">Tugas Hari Ini:</strong>
                    {piketHariIni.tugasKhusus}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section Tugas: FULL OCEAN BLOCKING (Ritme Gelap-Terang yang Kuat!) */}
      <section className="bg-[#0077B6] text-white py-14 md:py-20 border-b-4 border-[#03045E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/20 pb-4">
            <div>
              <span className="text-xs font-bold text-[#CAF0F8] uppercase tracking-wider block">
                Deadline & Proyek
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                Tugas yang Bikin Deg-degan Minggu Ini
              </h2>
            </div>
            <Link
              to="/tugas"
              className="text-sm font-semibold text-[#CAF0F8] hover:text-white flex items-center gap-1 group"
            >
              <span>Semua Daftar Tugas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Tugas Berlatar Kontras */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tugasAktif.map((tugas) => {
              const countdown = getCountdownTenggat(tugas.deadline);
              const isUrgent = countdown.status === 'urgent';

              return (
                <div
                  key={tugas.id}
                  className="bg-white rounded-xl p-5 text-slate-800 shadow-lg flex flex-col justify-between border-2 border-[#CAF0F8] hover:border-white transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0077B6] bg-[#CAF0F8] px-2.5 py-1 rounded">
                        {tugas.mapel}
                      </span>
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded font-mono ${
                          isUrgent
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        ⏱ {countdown.text}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-base text-[#03045E] leading-snug">
                      {tugas.judul}
                    </h3>

                    {tugas.deskripsi && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {tugas.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Tenggat: {formatTanggalIndo(tugas.deadline)}
                    </span>
                    <Link
                      to="/tugas"
                      className="font-bold text-[#0077B6] hover:underline"
                    >
                      Buka →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Wali Kelas & Struktur Pengurus Kelas (Latar Mist) */}
      <section className="bg-[#CAF0F8]/50 py-12 md:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="border-b border-[#90E0EF] pb-4">
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
              Bimbingan & Kepengurusan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
              Wali Kelas & Pengurus XII PPLG 3
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Profil Wali Kelas Berwibawa (5 Kolom) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#03045E] text-white flex items-center justify-center font-heading font-extrabold text-xl flex-shrink-0">
                  UD
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                    Wali Kelas
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-[#03045E]">
                    {infoKelas.waliKelas.nama}
                  </h3>
                  <p className="text-xs text-slate-500">Tahun Ajaran {infoKelas.tahunAjaran}</p>
                </div>
              </div>

              <blockquote className="text-sm text-slate-700 italic border-l-4 border-[#0077B6] pl-3 py-1 leading-relaxed">
                "{infoKelas.waliKelas.sambutan}"
              </blockquote>

              <Link
                to="/profil"
                className="inline-block text-xs font-bold text-[#0077B6] hover:underline pt-1"
              >
                Baca profil kelas selengkapnya →
              </Link>
            </div>

            {/* 4 Pengurus Kelas Terstruktur (7 Kolom) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoKelas.pengurus.map((p, idx) => {
                const siswa = getSiswaById(p.idAnggota);
                const initials = getInitials(siswa.nama);

                return (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3.5 shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-extrabold text-[#0077B6] uppercase tracking-wide block">
                        {p.peran}
                      </span>
                      <p className="font-heading font-bold text-sm text-[#03045E] truncate">
                        {siswa.nama}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Absen #{String(siswa.id).padStart(2, '0')} · {siswa.minat}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 6. Cuplikan Foto Dokumentasi Kelas (Latar Putih) */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Dokumentasi & Kenangan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
                Momen Seru di Kelas & Lab
              </h2>
            </div>
            <Link
              to="/galeri"
              className="text-xs sm:text-sm font-semibold text-[#0077B6] hover:underline"
            >
              Lihat Album Galeri Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cuplikanFoto.map((foto) => (
              <Link
                key={foto.id}
                to="/galeri"
                className="group block border border-slate-200 bg-white rounded-xl overflow-hidden hover:border-[#0077B6] transition-all shadow-xs"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={foto.thumb}
                    alt={foto.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-bold text-[#0077B6] uppercase tracking-wider block">
                    {foto.kategori}
                  </span>
                  <p className="font-heading font-bold text-sm text-[#03045E] line-clamp-1 group-hover:text-[#0077B6] transition-colors">
                    {foto.judul}
                  </p>
                  <p className="text-xs text-slate-500">{foto.tanggal}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
