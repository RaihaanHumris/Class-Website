import React from 'react';
import { infoKelas } from '../data/kelas';
import { getSiswaById, getInitials } from '../utils/helpers';
import { Sparkles, Users, Layers, CheckCircle2, Code2, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Profil() {
  const peranStyle = {
    'Ketua Kelas': {
      gradient: 'from-[#03045E] to-[#0077B6]',
      badgeBg: 'bg-[#03045E] text-white',
    },
    'Wakil Ketua Kelas': {
      gradient: 'from-[#0077B6] to-[#00B4D8]',
      badgeBg: 'bg-[#0077B6] text-white',
    },
    'Sekretaris': {
      gradient: 'from-[#00B4D8] to-[#90E0EF]',
      badgeBg: 'bg-[#00B4D8] text-[#03045E]',
    },
    'Bendahara': {
      gradient: 'from-[#0077B6] to-[#03045E]',
      badgeBg: 'bg-[#03045E] text-white',
    },
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Identitas & Visi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Profil Kelas {infoKelas.nama}
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            {infoKelas.jurusan} · {infoKelas.namaLengkapSekolah}, Kabupaten Ende, Nusa Tenggara Timur.
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

      {/* 3. Konten Profil */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Sambutan & Profil Wali Kelas */}
        <section className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-8 space-y-6 shadow-[0_8px_24px_rgba(3,4,94,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#CAF0F8]/50 blur-3xl pointer-events-none -mr-16 -mt-16" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center font-heading font-extrabold text-2xl flex-shrink-0 shadow-md ring-4 ring-[#CAF0F8]">
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
            <span className="text-xs font-mono font-bold px-3 py-1.5 bg-[#CAF0F8] text-[#03045E] rounded-full self-start sm:self-auto border border-[#90E0EF]">
              T.A. {infoKelas.tahunAjaran}
            </span>
          </div>

          <div className="space-y-3 max-w-3xl relative z-10">
            <blockquote className="text-base sm:text-lg text-slate-700 italic border-l-4 border-l-[#0077B6] pl-4 py-1 leading-relaxed">
              "{infoKelas.waliKelas.sambutan}"
            </blockquote>
          </div>
        </section>

        {/* Visi dan Misi (Dua Kolom Asimetris Berwarna) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Visi (5 Kolom - Aksen Mist Penuh) */}
          <div className="md:col-span-5 bg-[#CAF0F8]/50 border border-[#90E0EF]/60 rounded-[24px] p-6 sm:p-8 space-y-3 shadow-[0_8px_24px_rgba(3,4,94,0.04)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#0077B6] uppercase tracking-wider block">
                Visi Kelas
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#03045E] mt-1">
                Komitmen Masa Depan
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
                "{infoKelas.visi}"
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#0077B6]">
              <Sparkles className="w-4 h-4" />
              <span>Generasi Digital Berkarakter</span>
            </div>
          </div>

          {/* Misi (7 Kolom - Latar Putih) */}
          <div className="md:col-span-7 bg-white border border-slate-100 rounded-[24px] p-6 sm:p-8 space-y-3 shadow-[0_8px_24px_rgba(3,4,94,0.06)]">
            <span className="text-xs font-extrabold text-[#0077B6] uppercase tracking-wider block">
              Misi Pembelajaran
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#03045E]">
              Fokus Utama Siswa
            </h3>
            <ol className="space-y-3 text-sm sm:text-base text-slate-700 list-decimal list-inside leading-relaxed pt-1">
              {infoKelas.misi.map((m, idx) => (
                <li key={idx} className="pl-1 leading-relaxed">
                  <span className="text-slate-800">{m}</span>
                </li>
              ))}
            </ol>
          </div>

        </section>

        {/* Struktur Pengurus Kelas */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
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
              const style = peranStyle[p.peran] || peranStyle['Ketua Kelas'];

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 hover:border-[#0077B6]/40 transition-all rounded-[24px] p-6 space-y-4 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${style.gradient}`} />

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${style.badgeBg}`}>
                      {p.peran}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{String(siswa.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-12 h-12 rounded-full bg-[#03045E] text-white flex items-center justify-center font-heading font-extrabold text-sm flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-extrabold text-base text-[#03045E] truncate">
                        {siswa.nama}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{siswa.minat}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Pilar Kompetensi Kejuruan PPLG */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
              Kurikulum Vokasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#03045E]">
              Kompetensi Kejuruan PPLG
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-white border border-slate-100 rounded-[24px] space-y-2.5 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all">
              <span className="text-xs font-bold text-[#0077B6] uppercase px-3 py-1 rounded-full bg-[#CAF0F8] inline-block">
                Pilar 1
              </span>
              <h4 className="font-heading font-extrabold text-lg text-[#03045E]">
                Pemrograman Web Modern (Frontend & Backend)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penguasaan HTML5, CSS3, Tailwind CSS, JavaScript ES6+, framework React.js, dan arsitektur REST API server.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[24px] space-y-2.5 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all">
              <span className="text-xs font-bold text-[#0077B6] uppercase px-3 py-1 rounded-full bg-[#CAF0F8] inline-block">
                Pilar 2
              </span>
              <h4 className="font-heading font-extrabold text-lg text-[#03045E]">
                Pemrograman Berorientasi Objek (OOP)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Prinsip Clean Architecture, enkapsulasi, pewarisan (*inheritance*), polimorfisme, dan desain pola software pada Java dan C#.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[24px] space-y-2.5 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all">
              <span className="text-xs font-bold text-[#0077B6] uppercase px-3 py-1 rounded-full bg-[#CAF0F8] inline-block">
                Pilar 3
              </span>
              <h4 className="font-heading font-extrabold text-lg text-[#03045E]">
                Pemrograman & Desain Gim (Game Dev)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perancangan gameplay 2D/3D, mekanik physics pergerakan karakter, tilemapping, audio, dan pengujian gim pada Unity dan Godot.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[24px] space-y-2.5 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)] transition-all">
              <span className="text-xs font-bold text-[#0077B6] uppercase px-3 py-1 rounded-full bg-[#CAF0F8] inline-block">
                Pilar 4
              </span>
              <h4 className="font-heading font-extrabold text-lg text-[#03045E]">
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
