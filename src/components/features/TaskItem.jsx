import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatTanggalIndo, getCountdownTenggat } from '../../utils/helpers';

export default function TaskItem({ tugas }) {
  const { judul, mapel, deadline, status, prioritas, deskripsi, linkPengumpulan } = tugas;
  const countdown = getCountdownTenggat(deadline);
  const isUrgent = countdown.status === 'urgent';

  const statusLabel = {
    mendesak: { text: 'Mendesak', color: 'text-rose-700 bg-rose-50 border-rose-300' },
    berjalan: { text: 'Dalam Proses', color: 'text-[#0077B6] bg-[#CAF0F8] border-[#90E0EF]' },
    selesai: { text: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' }
  }[status] || { text: status, color: 'text-slate-600 bg-slate-100 border-slate-200' };

  return (
    <div className="p-5 bg-white border-2 border-slate-200 rounded-xl space-y-3 hover:border-[#0077B6] transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-xs text-[#0077B6] bg-[#CAF0F8] px-2.5 py-1 rounded">
            {mapel}
          </span>
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded border ${statusLabel.color}`}>
            {statusLabel.text}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-extrabold px-2.5 py-0.5 rounded font-mono ${
              isUrgent
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#CAF0F8] text-[#03045E]'
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
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1 break-words">
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077B6] hover:text-[#03045E] hover:underline"
          >
            <span>Kirim Tugas ke Google Classroom</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
