import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Button from './Button';
import AvatarStack from './AvatarStack';
import CodeEditorWindow from '../features/CodeEditorWindow';
import { infoKelas } from '../../data/kelas';
import { daftarAnggota } from '../../data/anggota';
import { getSapaanWaktu, getHariInfo } from '../../utils/helpers';

export default function Hero() {
  const sapaan = getSapaanWaktu();
  const hariInfo = getHariInfo();
  const totalSiswa = daftarAnggota.length;
  const adaFotoHero = Boolean(infoKelas.fotoHero && infoKelas.fotoHero.trim());

  return (
    <section
      className="bg-gradient-to-b from-[#03045E] via-[#03045E] to-[#003859] text-white relative overflow-hidden py-16 md:py-24"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 2.5rem), 0 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Kolom Kiri: 7 Urutan Tepat Tanpa Lapisan Berlebih (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* a) Baris kecil: sapaan + tanggal */}
            <p className="text-xs sm:text-sm font-medium text-[#CAF0F8]/80">
              {sapaan} · {hariInfo.tanggalLengkap}
            </p>

            {/* b) Judul Besar */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight leading-none">
              {infoKelas.nama}
            </h1>

            {/* c) Subjudul */}
            <p className="text-lg sm:text-xl font-medium text-[#90E0EF]">
              {infoKelas.jurusan}
            </p>

            {/* d) Baris meta kecil */}
            <p className="text-xs sm:text-sm text-[#CAF0F8]/80 font-medium">
              {infoKelas.sekolah} · Wali kelas {infoKelas.waliKelas.nama}
            </p>

            {/* e) Kalimat bersuara (20px, medium, 90% white, bukan bold) */}
            <p className="text-[20px] font-medium text-white/90 leading-relaxed max-w-xl">
              "{infoKelas.suaraKelas || '23 orang, satu kelas, satu proyek besar bernama kelulusan.'}"
            </p>

            {/* f) CTA: tombol utama + tautan sekunder */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                to="/jadwal"
                variant="primary"
                size="md"
                icon={Calendar}
                iconPosition="left"
                className="bg-[#0077B6] hover:bg-[#00B4D8] text-white hover:text-[#03045E] font-semibold min-h-[44px] px-5 py-2.5"
              >
                Cek jadwal pelajaran
              </Button>
              <Link
                to="/anggota"
                className="text-sm sm:text-base font-semibold text-[#90E0EF] hover:text-white flex items-center gap-1.5 underline underline-offset-4 min-h-[44px] py-2"
              >
                <span>Kenalan dengan {totalSiswa} siswa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* g) AvatarStack */}
            <div className="pt-1">
              <AvatarStack />
            </div>

          </div>

          {/* Kolom Kanan: Komposisi Tunggal Terpadu (5 Kolom) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            
            {/* Foto Duotone di Belakang (Hanya Tampil Jika fotoHero Terisi) */}
            {adaFotoHero ? (
              <div className="relative">
                {/* Layer Foto Belakang: Bergeser ke kanan-atas dan sebagian tertutup CodeWindow */}
                <div
                  className="absolute -top-6 -right-4 sm:-top-8 sm:-right-8 w-4/5 h-44 sm:h-56 rounded-xl overflow-hidden shadow-lg z-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="relative w-full h-full bg-[#03045E]">
                    <img
                      src={infoKelas.fotoHero}
                      alt=""
                      className="w-full h-full object-cover filter grayscale contrast-125 opacity-85"
                    />
                    {/* Duotone Murni: Navy Multiply + Cyan Screen */}
                    <div className="absolute inset-0 bg-[#03045E] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#00B4D8] mix-blend-screen opacity-35" />
                  </div>
                </div>

                {/* CodeWindow sebagai Elemen Utama di Depan */}
                <div className="relative z-10 w-full sm:w-[94%]">
                  <CodeEditorWindow />
                </div>
              </div>
            ) : (
              /* Komposisi Bersih Tanpa Foto Stok */
              <div className="relative">
                {/* Aksen Layer Kartu Halus di Belakang CodeWindow */}
                <div
                  className="hidden sm:block absolute -top-3 -right-3 w-full h-full rounded-xl bg-white/5 border border-white/10 z-0 pointer-events-none"
                  aria-hidden="true"
                />
                {/* CodeWindow Fokus Utama */}
                <div className="relative z-10 w-full">
                  <CodeEditorWindow />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
