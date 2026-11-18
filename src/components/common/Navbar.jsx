import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import { infoKelas } from '../../data/kelas';

const navLinks = [
  { name: 'Beranda', to: '/' },
  { name: 'Galeri', to: '/galeri' },
  { name: 'Anggota', to: '/anggota' },
  { name: 'Jejak Kelas', to: '/jejak' },
  { name: 'Admin', to: '/admin' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FAF8F3]/95 border-b border-slate-200/80">
      <div className="h-16 md:h-[72px] max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="font-editorial font-bold text-lg sm:text-xl text-[#03045E] tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded"
        >
          {infoKelas.nama}
        </Link>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Navigasi Utama"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#03045E] font-semibold'
                    : 'text-slate-600 hover:text-[#03045E]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#0077B6] transition-transform origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/kirim-foto"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#03045E] hover:bg-[#0077B6] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Camera className="w-4 h-4" />
            <span>Kirim Foto</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2 text-[#03045E] hover:bg-slate-200/60 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute top-full left-0 w-full h-[calc(100dvh-4rem)] bg-[#03045E] px-5 pt-5 pb-8 overflow-y-auto transition-all duration-200 border-t border-white/10 ${
          isOpen
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#0077B6] text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span>{link.name}</span>
              <span className="text-sm text-white/50">→</span>
            </NavLink>
          ))}

          <Link
            to="/kirim-foto"
            onClick={() => setIsOpen(false)}
            className="mt-3 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#03045E] text-base font-bold flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Kirim Foto Kenangan</span>
          </Link>
        </div>

        <div className="mt-8 pt-4 text-xs text-[#90E0EF]/90 border-t border-white/10 space-y-1">
          <p className="font-semibold">{infoKelas.nama} · {infoKelas.sekolah}</p>
          <p className="text-white/60">Album Kenangan Angkatan {infoKelas.tahunAjaran}</p>
        </div>
      </div>
    </header>
  );
}
