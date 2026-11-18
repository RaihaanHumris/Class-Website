import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Menu, X, Lock, Home, BookOpen, Users, Clock, Camera } from 'lucide-react';
import { infoKelas } from '../../data/kelas';

const navLinks = [
  { name: 'Beranda', to: '/', icon: Home },
  { name: 'Galeri', to: '/galeri', icon: BookOpen },
  { name: 'Anggota', to: '/anggota', icon: Users },
  { name: 'Jejak Kelas', to: '/jejak', icon: Clock },
];

const mobileBottomLinks = [
  { name: 'Beranda', to: '/', icon: Home },
  { name: 'Galeri 3D', to: '/galeri', icon: BookOpen },
  { name: 'Anggota', to: '/anggota', icon: Users },
  { name: 'Jejak', to: '/jejak', icon: Clock },
  { name: 'Kirim Foto', to: '/kirim-foto', icon: Camera },
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
    <>
      <header className="relative lg:fixed top-0 left-0 w-full z-50 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="h-14 md:h-[72px] max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="font-editorial font-bold text-lg sm:text-xl text-[#03045E] tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded"
          >
            {infoKelas.nama}
          </Link>

          {/* Zone 2: 4 Concise Single-Line Navigation Links */}
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
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#03045E] hover:bg-[#0077B6] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px]"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="lg:hidden min-h-[42px] min-w-[42px] p-2 text-[#03045E] hover:bg-slate-200/60 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
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
          className={`lg:hidden fixed inset-x-0 top-14 bottom-14 bg-[#03045E] px-5 pt-5 pb-8 overflow-y-auto transition-all duration-200 border-t border-white/10 z-50 ${
            isOpen
              ? 'opacity-100 translate-y-0 visible pointer-events-auto'
              : 'opacity-0 -translate-y-2 invisible pointer-events-none'
          }`}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-xl text-base font-semibold flex items-center justify-between transition-colors min-h-[48px] ${
                      isActive
                        ? 'bg-[#0077B6] text-white'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#90E0EF]" />
                    <span>{link.name}</span>
                  </span>
                  <span className="text-sm text-white/50">→</span>
                </NavLink>
              );
            })}

            <Link
              to="/kirim-foto"
              onClick={() => setIsOpen(false)}
              className="py-3 px-4 rounded-xl text-base font-semibold text-white/90 hover:bg-white/10 flex items-center justify-between min-h-[48px]"
            >
              <span className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Kirim Foto Kenangan</span>
              </span>
              <span className="text-sm text-white/50">→</span>
            </Link>

            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="mt-3 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#03045E] text-base font-bold flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Lock className="w-4 h-4" />
              <span>Login Admin</span>
            </Link>
          </div>

          <div className="mt-8 pt-4 text-xs text-[#90E0EF]/90 border-t border-white/10 space-y-1">
            <p className="font-semibold">{infoKelas.nama} · {infoKelas.sekolah}</p>
            <p className="text-white/60">Album Kenangan Angkatan {infoKelas.tahunAjaran}</p>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Thumb-Zone Navigation Bar for Mobile (< lg) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#050e29]/95 backdrop-blur-md border-t border-white/15 px-1"
      >
        <div className="grid grid-cols-5 h-full max-w-md mx-auto">
          {mobileBottomLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#00B4D8] font-bold'
                      : 'text-slate-300/80 hover:text-white font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00B4D8]' : 'text-slate-300'}`} />
                    <span className="text-[10px] tracking-tight whitespace-nowrap">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
