import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, ClipboardList, Phone, UserCheck, ArrowRight } from 'lucide-react';
import { infoKelas } from '../data/kelas';

const arsipPages = [
  {
    judul: 'Profil & Struktur Pengurus',
    deskripsi: 'Susunan pengurus kelas dan sambutan lengkap wali kelas.',
    to: '/profil',
    icon: UserCheck,
  },
  {
    judul: 'Arsip Jadwal Pelajaran',
    deskripsi: 'Catatan jadwal mata pelajaran kejuruan dan umum XII PPLG 3.',
    to: '/jadwal',
    icon: Calendar,
  },
  {
    judul: 'Arsip Regu Piket Kelas',
    deskripsi: 'Daftar pembagian regu piket kebersihan laboratorium dan ruang kelas.',
    to: '/piket',
    icon: CheckSquare,
  },
  {
    judul: 'Arsip Tugas & Proyek',
    deskripsi: 'Rekam jejak proyek pemrograman web, PBO, dan gim angkatan.',
    to: '/tugas',
    icon: ClipboardList,
  },
  {
    judul: 'Kontak & Lokasi Madrasah',
    deskripsi: 'Alamat MAKN Ende dan kanal media sosial resmi kelas.',
    to: '/kontak',
    icon: Phone,
  },
];

export default function JejakKelas() {
  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen pb-16">
      <section className="bg-[#050e29] text-white py-12 sm:py-14 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-2.5">
          <p className="text-xs font-medium text-[#90E0EF]">
            Kilas Balik Angkatan · {infoKelas.tahunAjaran}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Jejak &amp; Kisah {infoKelas.nama}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {infoKelas.tentang}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-14">
        {/* Garis Waktu 3 Tahun */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#03045E]">
              Perjalanan dari Kelas X hingga Kelas XII
            </h2>
            <p className="text-sm text-slate-600">
              Setiap tahap menyimpan cerita perjuangan dan tawa bersama di MAKN Ende.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoKelas.timelineKenangan.map((item, idx) => (
              <article
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1">
                  <span className="text-xs font-mono font-semibold text-[#0077B6]">
                    {item.fase}
                  </span>
                  <h3 className="font-editorial text-lg font-semibold text-[#03045E]">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Visi & Misi Kenangan */}
        <section className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold text-[#0077B6]">Harapan Angkatan</p>
            <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
              Visi Kebersamaan Kami
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {infoKelas.visi}
            </p>
          </div>
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold text-[#0077B6]">Komitmen Album Kenangan</p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {infoKelas.misi.map((m, i) => (
                <li key={i} className="flex items-start gap-3 pb-2.5 border-b border-slate-100 last:border-none">
                  <span className="font-mono text-xs font-semibold text-[#0077B6] pt-0.5 tabular-nums">
                    0{i + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Arsip Aktivitas Kelas */}
        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
              Arsip Aktivitas Sekolah
            </h2>
            <p className="text-sm text-slate-600">
              Data jadwal pelajaran, piket, tugas, dan profil kelas yang tersimpan sebagai bagian dari kenangan harian kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {arsipPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.to}
                  to={page.to}
                  className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0077B6] transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <Icon className="w-5 h-5 text-[#0077B6]" />
                    <h3 className="font-heading font-bold text-base text-[#03045E] group-hover:text-[#0077B6]">
                      {page.judul}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {page.deskripsi}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B6]">
                    <span>Buka Arsip</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
