import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-[28px] bg-[#03045E] text-[#90E0EF] flex items-center justify-center mx-auto shadow-xl ring-4 ring-[#CAF0F8]">
          <Code2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#0077B6] tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-[#CAF0F8] inline-block border border-[#90E0EF]/60">
            Error 404 · Route Not Found
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-[#03045E]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Halaman atau tautan yang Anda cari mungkin telah dipindahkan atau belum tersedia di sistem portal kelas.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0077B6] text-white font-semibold text-sm shadow-md hover:bg-[#03045E] transition-all duration-200 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
