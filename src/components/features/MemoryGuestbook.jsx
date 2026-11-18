import React, { useEffect, useState } from 'react';
import { MessageSquareHeart, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchMemoryNotes,
  submitMemoryNote,
} from '../../lib/supabase';

export default function MemoryGuestbook() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');
  const [nama, setNama] = useState('');
  const [peran, setPeran] = useState('Siswa XII PPLG 3');
  const [pesan, setPesan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchMemoryNotes()
      .then((rows) => {
        if (mounted) setNotes(rows);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    if (nama.trim().length < 2 || pesan.trim().length < 3) {
      setError('Mohon isi nama dan pesan kenangan minimal 3 karakter.');
      return;
    }
    setError('');
    setSubmitting(true);
    setSubmittedOk(false);
    try {
      const created = await submitMemoryNote({ nama, peran, pesan });
      setNotes((prev) => [created, ...prev]);
      setNama('');
      setPesan('');
      setSubmittedOk(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tulis Pesan Kenangan */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0077B6]">
              <MessageSquareHeart className="w-4 h-4" />
              <span>Buku Kenangan Digital</span>
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
              Tinggalkan Pesan &amp; Kesan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tulis sepatah dua patah kata untuk teman sekelas, wali kelas, atau sahabat yang pernah bersama di XII PPLG 3.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              Koneksi database Supabase belum diaktifkan pada environment ini. Pengisian Buku Kenangan akan aktif otomatis setelah <code className="font-mono">VITE_SUPABASE_URL</code> dan <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> dikonfigurasi.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Muhammad Raihaan Humris"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Peran / Status
                </label>
                <select
                  value={peran}
                  onChange={(e) => setPeran(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                >
                  <option value="Siswa XII PPLG 3">Siswa XII PPLG 3</option>
                  <option value="Sahabat Seperjuangan (Pindah Sekolah)">Sahabat Seperjuangan (Pindah Sekolah)</option>
                  <option value="Wali Kelas / Guru MAKN Ende">Wali Kelas / Guru MAKN Ende</option>
                  <option value="Tamu / Alumni">Tamu / Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Pesan Kenangan
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Tuliskan momen paling berkesan bersama XII PPLG 3..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {submittedOk && (
                <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Pesan kenangan berhasil disimpan ke database Supabase!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#03045E] hover:bg-[#0077B6] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : 'Kirim Pesan Kenangan'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Daftar Pesan dari Supabase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
            <h3 className="font-editorial text-xl font-semibold text-[#03045E]">
              Catatan Sahabat &amp; Angkatan
            </h3>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {notes.length} Pesan Tersimpan
            </span>
          </div>

          {loading ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center text-sm text-slate-500">
              Memuat catatan buku kenangan dari Supabase...
            </div>
          ) : notes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
              <p className="font-semibold text-sm text-[#03045E]">
                Belum ada pesan di Buku Kenangan
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Jadilah yang pertama menuliskan kesan, doa, atau cerita lucu selama bersama keluarga besar XII PPLG 3.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between space-y-3"
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    “{note.pesan}”
                  </p>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#03045E] truncate">{note.nama}</p>
                      <p className="text-[11px] text-slate-500 truncate">{note.peran}</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 tabular-nums">
                      {new Date(note.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
