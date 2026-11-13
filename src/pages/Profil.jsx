import React from 'react';
import { infoKelas } from '../data/kelas';
import { getSiswaById, getInitials } from '../utils/helpers';

export default function Profil() {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Identitas & Visi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Profil Kelas {infoKelas.nama}
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            {infoKelas.jurusan} · {infoKelas.namaLengkapSekolah}, Kabupaten Ende, Nusa Tenggara Timur.
          </p>
        </div>
      </section>

      {/* Konten Profil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Sambutan & Profil Wali Kelas */}
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#03045E] text-white flex items-center justify-center font-heading font-extrabold text-2xl flex-shrink-0 border-2 border-[#00B4D8]">
                UD
              </div>
              <div>
                <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                  Wali Kelas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
                  {infoKelas.waliKelas.nama}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Pembina & Pengampu Akademik XII PPLG 3
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-[#CAF0F8] text-[#03045E] rounded-full self-start sm:self-auto">
              T.A. {infoKelas.tahunAjaran}
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <blockquote className="text-base sm:text-lg text-slate-700 italic border-l-4 border-l-[#0077B6] pl-4 py-1 leading-relaxed">
              "{infoKelas.waliKelas.sambutan}"
            </blockquote>
          </div>
        </section>

        {/* Visi dan Misi (Dua Kolom Asimetris Berwarna) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Visi (5 Kolom - Aksen Mist Penuh) */}
          <div className="md:col-span-5 bg-[#CAF0F8]/50 border-2 border-[#90E0EF] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
            <span className="text-xs font-extrabold text-[#0077B6] uppercase tracking-wider block">
              Visi Kelas
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#03045E]">
              Komitmen Masa Depan
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
              "{infoKelas.visi}"
            </p>
          </div>

          {/* Misi (7 Kolom - Latar Putih) */}
          <div className="md:col-span-7 bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
            <span className="text-xs font-extrabold text-[#0077B6] uppercase tracking-wider block">
              Misi Pembelajaran
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#03045E]">
              Fokus Utama Siswa
            </h3>
            <ol className="space-y-3 text-sm sm:text-base text-slate-700 list-decimal list-inside leading-relaxed pt-1">
              {infoKelas.misi.map((m, idx) => (
                <li key={idx} className="pl-1">
                  <span className="text-slate-800">{m}</span>
                </li>
              ))}
            </ol>
          </div>

        </section>

        {/* Struktur Pengurus Kelas */}
        <section className="space-y-6">
          <div className="border-b-2 border-slate-200 pb-3">
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
              Organisasi Kelas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
              Struktur Pengurus XII PPLG 3
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoKelas.pengurus.map((p, idx) => {
              const siswa = getSiswaById(p.idAnggota);
              const initials = getInitials(siswa.nama);

              return (
                <div
                  key={idx}
                  className="bg-white border-2 border-slate-200 hover:border-[#0077B6] transition-colors rounded-xl p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0077B6] bg-[#CAF0F8] px-2.5 py-1 rounded">
                      {p.peran}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{String(siswa.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-11 h-11 rounded-full bg-[#03045E] text-white flex items-center justify-center font-heading font-extrabold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-extrabold text-base text-[#03045E] truncate">
                        {siswa.nama}
                      </p>
                      <p className="text-xs text-slate-500">{siswa.minat}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Pilar Kompetensi Kejuruan PPLG */}
        <section className="space-y-6">
          <div className="border-b-2 border-slate-200 pb-3">
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
              Kurikulum Vokasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
              Kompetensi Kejuruan PPLG
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-white border-2 border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#0077B6] uppercase">Pilar 1</span>
              <h4 className="font-heading font-extrabold text-base text-[#03045E]">
                Pemrograman Web Modern (Frontend & Backend)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penguasaan HTML5, CSS3, Tailwind CSS, JavaScript ES6+, framework React.js, dan arsitektur REST API server.
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#0077B6] uppercase">Pilar 2</span>
              <h4 className="font-heading font-extrabold text-base text-[#03045E]">
                Pemrograman Berorientasi Objek (OOP)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Prinsip Clean Architecture, enkapsulasi, pewarisan (*inheritance*), polimorfisme, dan desain pola software pada Java dan C#.
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#0077B6] uppercase">Pilar 3</span>
              <h4 className="font-heading font-extrabold text-base text-[#03045E]">
                Pemrograman & Desain Gim (Game Dev)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perancangan gameplay 2D/3D, mekanik physics pergerakan karakter, tilemapping, audio, dan pengujian gim pada Unity dan Godot.
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#0077B6] uppercase">Pilar 4</span>
              <h4 className="font-heading font-extrabold text-base text-[#03045E]">
                Desain & Administrasi Basis Data
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Normalisasi tabel data relasional (1NF sampai 3NF), relasi tabel ERD, dan query SQL lanjutan di MySQL serta PostgreSQL.
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
