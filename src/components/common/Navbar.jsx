import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#03045E] text-white border-b border-white/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Logo & Identitas Kelas */}
          <NavLink
            to="/"
            className="flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded py-1"
          >
            <span className="font-heading font-bold text-lg tracking-tight text-white">
              XII PPLG 3
            </span>
            <span className="text-xs text-[#90E0EF] font-medium hidden sm:inline">
              MAKN Ende
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                    isActive
                      ? 'border-[#00B4D8] text-white font-semibold'
                      : 'border-transparent text-[#CAF0F8]/80 hover:text-white hover:border-white/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Hamburger Button dengan Animasi Rotasi Ikon */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px] p-2 text-[#CAF0F8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] flex items-center justify-center rounded select-none cursor-pointer"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            >
              <div
                className={`transition-transform duration-250 ${
                  isOpen ? 'rotate-90 scale-105' : 'rotate-0 scale-100'
                }`}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu dengan Animasi Mulus (ease-out saat buka, ease-in saat tutup) */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-x-0 top-14 bottom-0 bg-[#03045E] z-50 px-5 pt-3 pb-8 overflow-y-auto border-t border-white/10 transition-all duration-300 ${
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
                `py-3.5 text-base font-medium flex items-center justify-between transition-colors duration-150 ${
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

        <div className="mt-8 pt-4 text-xs text-[#90E0EF]/80 border-t border-white/10">
          <p className="font-semibold">XII PPLG 3 · MAKN Ende</p>
          <p className="text-white/50 mt-0.5">Tahun Ajaran 2025/2026</p>
        </div>
      </div>
    </header>
  );
}
