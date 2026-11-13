import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatTanggalIndo, getCountdownTenggat } from '../../utils/helpers';

export default function TaskItem({ tugas }) {
  const { judul, mapel, deadline, status, prioritas, deskripsi, linkPengumpulan } = tugas;
  const countdown = getCountdownTenggat(deadline);
  const isUrgent = countdown.status === 'urgent';

  const statusLabel = {
    mendesak: { text: 'Mendesak', color: 'text-rose-700 bg-rose-50 border-rose-200' },
    berjalan: { text: 'Dalam Proses', color: 'text-[#0077B6] bg-[#CAF0F8] border-[#90E0EF]' },
    selesai: { text: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  }[status] || { text: status, color: 'text-slate-600 bg-slate-100 border-slate-200' };

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-[24px] space-y-3.5 hover:border-[#0077B6]/40 transition-all shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-xs text-[#0077B6] bg-[#CAF0F8] px-3 py-1 rounded-full border border-[#90E0EF]/60">
            {mapel}
          </span>
          <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${statusLabel.color}`}>
            {statusLabel.text}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full font-mono ${
              isUrgent
                ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                : 'bg-[#CAF0F8] text-[#03045E] border border-[#90E0EF]/60'
            }`}
          >
            ⏱ {countdown.text}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            (Tenggat: {formatTanggalIndo(deadline)})
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#03045E] break-words">
          {judul}
        </h3>
        {deskripsi && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 break-words">
            {deskripsi}
          </p>
        )}
      </div>

      {linkPengumpulan && (
        <div className="pt-2">
          <a
            href={linkPengumpulan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CAF0F8] text-[#0077B6] hover:bg-[#0077B6] hover:text-white transition-all text-xs font-bold shadow-xs cursor-pointer"
          >
            <span>Kirim Tugas ke Google Classroom</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
