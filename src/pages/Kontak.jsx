import React, { useState } from 'react';
import { infoKelas } from '../data/kelas';
import Button from '../components/common/Button';
import { MapPin, Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react';

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
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Header Banner Gradient Khas Beranda */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#CAF0F8] via-[#90E0EF]/80 to-[#0077B6] text-slate-800 pt-8 sm:pt-12 pb-14 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold text-[#03045E] uppercase tracking-wider">
              Pusat Komunikasi & Aspirasi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#03045E] tracking-tight leading-tight">
            Kontak & Aspirasi Kelas {infoKelas.nama}
          </h1>

          <p className="text-sm sm:text-base text-[#03045E]/85 max-w-2xl leading-relaxed">
            Punya ide proyek koding, saran kegiatan kelas, atau ingin menghubungi pengurus {infoKelas.nama} {infoKelas.sekolah}? Silakan hubungi kami.
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

      {/* 3. Konten Kontak */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Kolom Kiri: Alamat & Narahubung (5 Kolom - Aksen Mist Lembut) */}
          <div className="md:col-span-5 space-y-6 bg-[#CAF0F8]/50 border border-[#90E0EF]/60 p-6 sm:p-8 rounded-[24px] text-xs sm:text-sm text-slate-700 shadow-[0_8px_24px_rgba(3,4,94,0.04)]">
            
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Lokasi Belajar
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0077B6]" />
                <span>Alamat Madrasah</span>
              </h2>
              <p className="text-slate-700 leading-relaxed pt-1">
                {infoKelas.kontak.alamat}
              </p>
            </div>

            <div className="pt-4 border-t border-[#90E0EF]/60 space-y-2">
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Narahubung Resmi
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0077B6]" />
                <span>Email & WhatsApp</span>
              </h2>
              <p className="text-slate-700">
                Email: <a href={`mailto:${infoKelas.kontak.email}`} className="text-[#0077B6] font-bold hover:underline">{infoKelas.kontak.email}</a>
              </p>
              <p className="text-slate-700">
                WhatsApp: <strong className="text-[#03045E] font-bold">{infoKelas.kontak.telepon}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-[#90E0EF]/60 space-y-1.5">
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Jadwal Madrasah
              </span>
              <h2 className="font-heading font-extrabold text-lg text-[#03045E] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0077B6]" />
                <span>Jam Operasional</span>
              </h2>
              <p className="text-slate-700 leading-relaxed pt-1">
                Senin – Kamis: 07.15 – 14.15 WITA<br />
                Jumat: 07.00 – 11.00 WITA
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Form Kirim Pesan (7 Kolom - Latar Putih Bersih) */}
          <div className="md:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-[24px] space-y-5 shadow-[0_8px_24px_rgba(3,4,94,0.06)]">
            <div>
              <span className="text-xs font-bold text-[#0077B6] uppercase tracking-wider block">
                Kirimkan Aspirasi
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-[#03045E] mt-0.5">
                Formulir Pesan
              </h2>
            </div>

            {isSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-[20px] text-xs sm:text-sm font-medium shadow-xs">
                ✅ <strong>Pesan terkirim!</strong> Terima kasih atas masukan atau pertanyaannya untuk kelas XII PPLG 3.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs sm:text-sm">
              <div>
                <label htmlFor="nama" className="block font-bold text-[#03045E] mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  id="nama"
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-[#03045E] focus:outline-none focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#00B4D8]/20 min-h-[44px] transition-all"
                />
                {errors.nama && (
                  <p className="text-rose-600 text-xs mt-1.5 font-semibold">{errors.nama}</p>
                )}
              </div>

              <div>
                <label htmlFor="kontak" className="block font-bold text-[#03045E] mb-1.5">
                  Email atau No. WhatsApp *
                </label>
                <input
                  id="kontak"
                  type="text"
                  value={formData.kontak}
                  onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                  placeholder="email@contoh.com atau 0812..."
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-[#03045E] focus:outline-none focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#00B4D8]/20 min-h-[44px] transition-all"
                />
                {errors.kontak && (
                  <p className="text-rose-600 text-xs mt-1.5 font-semibold">{errors.kontak}</p>
                )}
              </div>

              <div>
                <label htmlFor="pesan" className="block font-bold text-[#03045E] mb-1.5">
                  Isi Pesan / Saran *
                </label>
                <textarea
                  id="pesan"
                  rows={4}
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  placeholder="Tuliskan pesan atau saran Anda..."
                  className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-[#03045E] focus:outline-none focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#00B4D8]/20 transition-all"
                />
                {errors.pesan && (
                  <p className="text-rose-600 text-xs mt-1.5 font-semibold">{errors.pesan}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0077B6] hover:bg-[#03045E] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan Pesan Sekarang</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
