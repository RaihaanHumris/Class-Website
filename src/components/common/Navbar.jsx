import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Code2, GraduationCap, Menu, X } from 'lucide-react';
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

  // Tutup menu saat berpindah rute
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Kunci scroll body saat menu mobile terbuka
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

  // Tutup menu dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Tutup otomatis saat viewport diperbesar ke desktop (xl: >= 1280px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Bar dengan Background Blur */}
      <div className="bg-[#CAF0F8]/90 backdrop-blur-xl border-b border-[#0077B6]/15 shadow-xs">
        <div className="h-16 md:h-20 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded-full p-1 min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0077B6] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,119,182,0.25)] shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-base sm:text-lg text-[#03045E] tracking-tight leading-none truncate">
                {infoKelas.nama}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#0077B6] tracking-wide uppercase mt-0.5 truncate">
                {infoKelas.sekolah}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Pill Bar */}
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

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Badge TA */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CAF0F8] text-[#03045E] font-semibold text-xs border border-[#90E0EF]">
              <GraduationCap className="w-4 h-4 text-[#0077B6]" />
              <span>TA {infoKelas.tahunAjaran}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="xl:hidden min-h-[44px] min-w-[44px] p-2 text-[#03045E] hover:bg-[#0077B6]/10 active:bg-[#0077B6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] flex items-center justify-center rounded-full transition-colors cursor-pointer"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              <div
                className={`transition-transform duration-200 ${
                  isOpen ? 'rotate-90 scale-105' : 'rotate-0 scale-100'
                }`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        className={`xl:hidden absolute top-full left-0 w-full h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] bg-[#03045E] px-5 pt-4 pb-8 overflow-y-auto transition-all duration-300 ease-in-out border-t border-white/10 shadow-2xl ${
          isOpen
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-between transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#0077B6] text-white font-bold shadow-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  <span
                    className={`text-sm transition-transform ${
                      isActive ? 'text-[#90E0EF] translate-x-1 font-bold' : 'text-white/40'
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
