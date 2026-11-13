import React, { useState } from 'react';
import { infoKelas } from '../data/kelas';
import Button from '../components/common/Button';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    kontak: '',
    pesan: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.nama.trim()) {
      err.nama = 'Nama lengkap wajib diisi.';
    } else if (formData.nama.trim().length < 2) {
      err.nama = 'Nama minimal 2 karakter.';
    }

    if (!formData.kontak.trim()) {
      err.kontak = 'Email atau nomor WhatsApp wajib diisi.';
    }

    if (!formData.pesan.trim()) {
      err.pesan = 'Pesan tidak boleh kosong.';
    } else if (formData.pesan.trim().length < 10) {
      err.pesan = 'Pesan minimal berisi 10 karakter.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitted(true);
    setFormData({ nama: '', kontak: '', pesan: '' });
    setErrors({});
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner Penuh Navy */}
      <section className="bg-[#03045E] text-white py-12 md:py-16 border-b-4 border-[#00B4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider block">
            Pusat Komunikasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Kontak & Aspirasi Kelas
          </h1>
          <p className="text-sm sm:text-base text-[#CAF0F8] max-w-2xl leading-relaxed">
            Punya ide proyek, aspirasi kelas, atau ingin menghubungi pengurus XII PPLG 3 MAKN Ende? Silakan tinggalkan pesan.
          </p>
        </div>
      </section>

      {/* Konten Kontak */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Alamat & Narahubung (5 Kolom) */}
          <div className="md:col-span-5 space-y-6 bg-[#CAF0F8]/50 border-2 border-[#90E0EF] p-6 sm:p-8 rounded-2xl text-xs sm:text-sm text-slate-700 shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Lokasi Belajar
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] mt-0.5">
                Alamat Madrasah
              </h2>
              <p className="text-slate-700 mt-1.5 leading-relaxed">
                {infoKelas.kontak.alamat}
              </p>
            </div>

            <div className="pt-4 border-t border-[#90E0EF]">
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Narahubung
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] mt-0.5">
                Email & WhatsApp
              </h2>
              <p className="text-slate-700 mt-1.5">
                Email: <a href={`mailto:${infoKelas.kontak.email}`} className="text-[#0077B6] font-bold underline">{infoKelas.kontak.email}</a>
              </p>
              <p className="text-slate-700 mt-0.5">
                WhatsApp: <strong className="text-[#03045E]">{infoKelas.kontak.telepon}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-[#90E0EF]">
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Jadwal Madrasah
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] mt-0.5">
                Jam Operasional
              </h2>
              <p className="text-slate-700 mt-1.5 leading-relaxed">
                Senin – Kamis: 07.15 – 14.15 WITA<br />
                Jumat: 07.00 – 11.00 WITA
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Form Kirim Pesan (7 Kolom) */}
          <div className="md:col-span-7 bg-white border-2 border-slate-200 p-6 sm:p-8 rounded-2xl space-y-5 shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Kirimkan Aspirasi
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-[#03045E]">
                Formulir Pesan
              </h2>
            </div>

            {isSubmitted && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-medium">
                ✅ <strong>Pesan terkirim!</strong> Terima kasih atas masukan atau pertanyaannya untuk kelas XII PPLG 3.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
              <div>
                <label htmlFor="nama" className="block font-bold text-[#03045E] mb-1">
                  Nama Lengkap *
                </label>
                <input
                  id="nama"
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama Anda"
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-[#03045E] focus:outline-none focus:border-[#0077B6] min-h-[44px]"
                />
                {errors.nama && (
                  <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.nama}</p>
                )}
              </div>

              <div>
                <label htmlFor="kontak" className="block font-bold text-[#03045E] mb-1">
                  Email atau No. WhatsApp *
                </label>
                <input
                  id="kontak"
                  type="text"
                  value={formData.kontak}
                  onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                  placeholder="email@contoh.com atau 0812..."
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-[#03045E] focus:outline-none focus:border-[#0077B6] min-h-[44px]"
                />
                {errors.kontak && (
                  <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.kontak}</p>
                )}
              </div>

              <div>
                <label htmlFor="pesan" className="block font-bold text-[#03045E] mb-1">
                  Isi Pesan / Saran *
                </label>
                <textarea
                  id="pesan"
                  rows={4}
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  placeholder="Tuliskan pesan atau saran Anda..."
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-[#03045E] focus:outline-none focus:border-[#0077B6]"
                />
                {errors.pesan && (
                  <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.pesan}</p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" className="font-bold">
                  Kirimkan Pesan Sekarang
                </Button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
