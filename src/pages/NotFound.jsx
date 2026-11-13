import React from 'react';
import { Code2, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#03045E] text-[#90E0EF] flex items-center justify-center mx-auto shadow-xl border-4 border-[#CAF0F8]">
          <Code2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-sm font-bold text-[#0077B6] tracking-widest uppercase">
            Error 404: Route Not Found
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-[#03045E]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Halaman atau tautan yang Anda cari mungkin telah dipindahkan atau belum tersedia di sistem.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="primary" size="md" icon={Home} iconPosition="left">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
