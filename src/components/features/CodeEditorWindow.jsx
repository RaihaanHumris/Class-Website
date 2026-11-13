import React, { useState, useEffect } from 'react';
import { infoKelas } from '../../data/kelas';
import { daftarAnggota } from '../../data/anggota';
import { jadwalMingguan } from '../../data/jadwal';
import { getHariInfo, getStatusSesiMapel } from '../../utils/helpers';

export default function CodeEditorWindow() {
  const totalSiswa = daftarAnggota.length;
  const [dynamicComment, setDynamicComment] = useState('');

  useEffect(() => {
    function hitungKomentar() {
      const hariInfo = getHariInfo();

      // Akhir pekan (Sabtu / Minggu)
      if (hariInfo.isWeekend) {
        setDynamicComment('// libur dulu, Senin 07.00 masuk lagi');
        return;
      }

      // Hari kerja (Senin - Jumat)
      const jadwalHariIni =
        jadwalMingguan.find((j) => j.dayIndex === hariInfo.index) || jadwalMingguan[0];

      let sesiAktif = null;
      let sesiMendatang = null;
      let semuaSelesai = true;

      for (const mapel of jadwalHariIni.mapel) {
        const status = getStatusSesiMapel(mapel.jam);
        if (status.status === 'active') {
          sesiAktif = { ...mapel, sisaMenit: status.sisaMenit };
          semuaSelesai = false;
          break;
        } else if (status.status === 'upcoming') {
          if (!sesiMendatang) sesiMendatang = mapel;
          semuaSelesai = false;
        }
      }

      if (sesiAktif) {
        setDynamicComment(
          `// sekarang: ${sesiAktif.nama}${
            sesiAktif.sisaMenit ? `, tinggal ${sesiAktif.sisaMenit} menit` : ''
          }`
        );
      } else if (semuaSelesai) {
        if (hariInfo.index === 5) {
          setDynamicComment('// jam sekolah selesai, Senin masuk lagi');
        } else {
          setDynamicComment('// jam sekolah selesai, besok lanjut lagi');
        }
      } else if (sesiMendatang) {
        const jamMulai = sesiMendatang.jam.split('-')[0].trim();
        setDynamicComment(`// siap-siap: ${sesiMendatang.nama} jam ${jamMulai}`);
      } else {
        setDynamicComment('// istirahat rehat sejenak');
      }
    }

    hitungKomentar();
    // Perbarui tiap 60 detik
    const timer = setInterval(hitungKomentar, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-white/20 bg-[#021844] text-[14px] font-mono shadow-2xl overflow-hidden select-none w-full">
      {/* Titlebar Netral: Sky & Ocean dots */}
      <div className="bg-[#03045E] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#90E0EF]/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00B4D8]/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#0077B6]/80 inline-block" />
        </div>
        <span className="text-xs text-[#90E0EF] font-semibold">
          kelas.config.js
        </span>
        <span className="text-[11px] text-white/40">JavaScript</span>
      </div>

      {/* Code Area dengan Font 14px & Line-height 1.6 */}
      <div className="p-4 sm:p-5 leading-[1.6] text-[#CAF0F8] overflow-x-auto">
        <div>
          <span className="text-[#00B4D8]">const</span>{' '}
          <span className="text-white font-bold">kelas</span> = &#123;
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">id</span>:{' '}
          <span className="text-white">"{infoKelas.nama}"</span>,
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">madrasah</span>:{' '}
          <span className="text-white">"{infoKelas.sekolah}"</span>,
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">waliKelas</span>:{' '}
          <span className="text-[#CAF0F8]">"{infoKelas.waliKelas.nama}"</span>,
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">totalSiswa</span>:{' '}
          <span className="text-[#00B4D8] font-bold">{totalSiswa}</span>,
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">tagline</span>:{' '}
          <span className="text-[#90E0EF]">"{infoKelas.tagline}"</span>,
        </div>
        <div className="pl-4">
          <span className="text-[#90E0EF]">kompetensi</span>: [
          <span className="text-white">"Web"</span>,{' '}
          <span className="text-white">"Database"</span>,{' '}
          <span className="text-white">"Gim"</span>,{' '}
          <span className="text-white">"PBO"</span>]
        </div>
        <div>&#125;;</div>

        {/* Komentar Dinamis Real-Time dengan Kursor Berkedip */}
        <div className="pt-2 text-[13px] text-[#90E0EF] border-t border-white/10 mt-2 flex items-center">
          <span>{dynamicComment}</span>
          <span
            className="inline-block w-2 h-4 bg-[#00B4D8] ml-1.5 animate-pulse motion-reduce:animate-none align-middle"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
