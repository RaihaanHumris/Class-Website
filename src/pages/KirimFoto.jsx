import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import { isSupabaseConfigured, submitPhotoMemory } from '../lib/supabase';

const KATEGORI_OPTIONS = [
  'Kebersamaan',
  'Pramuka',
  'Praktik Lab',
  'Resmi Kelas',
  'Kenangan',
  'Masa Awal',
];

export default function KirimFoto() {
  const [pengirimNama, setPengirimNama] = useState('');
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Kebersamaan');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successRecord, setSuccessRecord] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5 MB.');
      return;
    }
    setError('');
    setFile(selected);
    const localUrl = URL.createObjectURL(selected);
    setPreviewUrl(localUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;

    setError('');
    setSubmitting(true);
    try {
      const created = await submitPhotoMemory({
        judul,
        kategori,
        tanggal,
        deskripsi,
        pengirimNama,
        file: inputMode === 'file' ? file : null,
        imageUrl: inputMode === 'url' ? imageUrl : '',
      });
      setSuccessRecord(created);
      setPengirimNama('');
      setJudul('');
      setTanggal('');
      setDeskripsi('');
      setFile(null);
      setPreviewUrl('');
      setImageUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activePreview = inputMode === 'file' ? previewUrl : imageUrl.trim();

  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen pb-16">
      <section className="bg-[#050e29] text-white py-12 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <Link
            to="/galeri"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#90E0EF] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Galeri</span>
          </Link>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-white">
            Kirim Foto Kenangan Baru
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Punya dokumentasi kebersamaan XII PPLG 3 yang belum masuk album? Unggah di sini — foto akan masuk antrean database Supabase untuk ditinjau dan disetujui (apply) oleh Admin kelas sebelum tayang di galeri.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {!isSupabaseConfigured ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-amber-300 space-y-3">
            <h2 className="font-editorial text-xl font-semibold text-[#03045E]">
              Database Supabase Belum Dikonfigurasi
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Untuk mengaktifkan pengajuan foto kenangan, Admin perlu mengatur environment variables <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> dan <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> serta menjalankan skema SQL pada halaman <Link to="/admin" className="text-[#0077B6] font-semibold underline">Admin</Link>.
            </p>
          </div>
        ) : successRecord ? (
          <div className="p-8 rounded-2xl bg-white border border-emerald-200 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
                Foto Berhasil Diajukan
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Terima kasih <strong>{successRecord.pengirim_nama}</strong>. Foto “<strong>{successRecord.judul}</strong>” telah tersimpan di database Supabase dengan status <strong>Menunggu Persetujuan Admin</strong>.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSuccessRecord(null)}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#03045E] hover:bg-[#0077B6] text-white text-sm font-semibold cursor-pointer"
              >
                Kirim Foto Lainnya
              </button>
              <Link
                to="/galeri"
                className="min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold inline-flex items-center"
              >
                Lihat Galeri Kenangan
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                    Nama Pengirim
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={pengirimNama}
                    onChange={(e) => setPengirimNama(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                    Kategori Momen
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                    Judul Kenangan
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={140}
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Makan Bersama Seusai Ujian"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                    Tanggal / Masa Kejadian
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    placeholder="Contoh: November 2025"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Cerita Singkat di Balik Foto
                </label>
                <textarea
                  required
                  rows={3}
                  minLength={5}
                  maxLength={800}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Ceritakan sedikit momen di balik foto ini..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none resize-none"
                />
              </div>

              {/* Sumber Foto: Upload File atau URL */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#03045E]">
                    Pilih Sumber Foto
                  </span>
                  <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setInputMode('file')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                        inputMode === 'file' ? 'bg-white text-[#03045E] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('url')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                        inputMode === 'url' ? 'bg-white text-[#03045E] shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Tautan URL
                    </button>
                  </div>
                </div>

                {inputMode === 'file' ? (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 rounded-xl bg-[#FAF8F3] hover:border-[#0077B6] transition-colors cursor-pointer text-center space-y-1.5">
                    <Upload className="w-6 h-6 text-[#0077B6]" />
                    <span className="text-xs font-semibold text-[#03045E]">
                      {file ? file.name : 'Klik untuk memilih foto (JPG/PNG/WEBP, maks 5 MB)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="url"
                    required={inputMode === 'url'}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                  />
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[46px] px-5 py-3 rounded-lg bg-[#03045E] hover:bg-[#0077B6] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{submitting ? 'Mengirim ke Database...' : 'Ajukan Foto Kenangan'}</span>
              </button>
            </div>

            {/* Preview Kartu Polaroid */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF8F3] border border-slate-200 space-y-3">
                <p className="text-xs font-semibold text-slate-600">Pratinjau Kartu Kenangan</p>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden">
                    {activePreview ? (
                      <img
                        src={activePreview}
                        alt="Pratinjau foto"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">Belum ada foto dipilih</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-[11px] text-[#0077B6] font-semibold">
                      {kategori} · {tanggal || 'Tanggal belum diisi'}
                    </p>
                    <h3 className="font-heading font-bold text-sm text-[#03045E] line-clamp-1">
                      {judul || 'Judul kenangan Anda'}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {deskripsi || 'Cerita singkat akan tampil di sini setelah foto disetujui Admin.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Setiap foto yang dikirim berstatus <strong>Menunggu Persetujuan</strong> sampai Admin login dan menekan tombol <strong>Apply / Setujui</strong> di panel Admin.
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
