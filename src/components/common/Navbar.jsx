import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Code2, GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import { infoKelas } from '../../data/kelas';

const navLinks = [
  { name: 'Beranda', to: '/' },
  { name: 'Profil', to: '/profil' },
  { name: 'Anggota', to: '/anggota' },
  { name: 'Jadwal', to: '/jadwal' },
  { name: 'Piket', to: '/piket' },
  { name: 'Tugas', to: '/tugas' },
  { name: 'Galeri', to: '/galeri' },
  { name: 'Kontak', to: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#CAF0F8]/85 backdrop-blur-xl border-b border-[#0077B6]/15 shadow-xs">
      <div className="h-16 md:h-20 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Brand Logo Stitch Style */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded-full p-1"
        >
          <div className="w-10 h-10 rounded-full bg-[#0077B6] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,119,182,0.25)]">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base md:text-lg text-[#03045E] tracking-tight leading-none">
              {infoKelas.nama}
            </span>
            <span className="text-[11px] font-semibold text-[#0077B6] tracking-wide uppercase mt-0.5">
              {infoKelas.sekolah}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Pill Bar Stitch Style */}
        <nav
          className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-white/70 border border-slate-200/80 shadow-xs backdrop-blur-md"
          aria-label="Navigasi Utama"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-1.5 transition-all text-xs font-semibold rounded-full ${
                  isActive
                    ? 'bg-[#0077B6] text-white shadow-[0_4px_16px_rgba(0,119,182,0.25)]'
                    : 'text-slate-600 hover:bg-[#CAF0F8] hover:text-[#03045E]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Badge & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Badge TA */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CAF0F8] text-[#03045E] font-semibold text-xs border border-[#90E0EF]">
            <GraduationCap className="w-4 h-4 text-[#0077B6]" />
            <span>TA {infoKelas.tahunAjaran}</span>
          </div>

          {/* Mobile Hamburger Button dengan Animasi Rotasi Halus */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden min-h-[44px] min-w-[44px] p-2 text-[#03045E] hover:bg-[#CAF0F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] flex items-center justify-center rounded-full transition-colors cursor-pointer"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            <div
              className={`transition-transform duration-250 ${
                isOpen ? 'rotate-90 scale-105' : 'rotate-0 scale-100'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu dengan Animasi Halus (ease-out / ease-in) */}
      <div
        id="mobile-menu"
        className={`xl:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 bg-[#03045E] z-50 px-5 pt-4 pb-8 overflow-y-auto border-t border-white/10 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 visible ease-out pointer-events-auto'
            : 'opacity-0 -translate-y-3 invisible ease-in pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col divide-y divide-white/10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              tabIndex={isOpen ? 0 : -1}
              className={({ isActive }) =>
                `py-3.5 text-base font-semibold flex items-center justify-between transition-colors duration-150 ${
                  isActive ? 'text-[#00B4D8] font-bold pl-1' : 'text-white/90 hover:text-white hover:pl-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  <span
                    className={`text-xs transition-transform ${
                      isActive ? 'text-[#00B4D8] translate-x-1' : 'text-white/40'
                    }`}
                  >
                    →
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 pt-4 text-xs text-[#90E0EF]/90 border-t border-white/10 space-y-1">
          <p className="font-bold">{infoKelas.nama} · {infoKelas.sekolah}</p>
          <p className="text-white/60">Tahun Ajaran {infoKelas.tahunAjaran}</p>
        </div>
      </div>
    </header>
  );
}
