import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Lock, Home, BookOpen, Users, Clock, Code2 } from 'lucide-react';
import { infoKelas } from '../../data/kelas';

const navLinks = [
  { name: 'Beranda', to: '/', icon: Home },
  { name: 'Galeri', to: '/galeri', icon: BookOpen },
  { name: 'Anggota', to: '/anggota', icon: Users },
  { name: 'Jejak Kelas', to: '/jejak', icon: Clock },
  { name: 'Projects', to: '/projects', icon: Code2 },
];

const mobileBottomLinks = [
  { name: 'Beranda', to: '/', icon: Home, matchPaths: ['/'] },
  { name: 'Galeri', to: '/galeri', icon: BookOpen, matchPaths: ['/galeri', '/kirim-foto'] },
  { name: 'Anggota', to: '/anggota', icon: Users, matchPaths: ['/anggota'] },
  {
    name: 'Jejak Kelas',
    to: '/jejak',
    icon: Clock,
    matchPaths: ['/jejak', '/profil', '/jadwal', '/piket', '/tugas', '/kontak'],
  },
  {
    name: 'Projects',
    to: '/projects',
    icon: Code2,
    matchPaths: ['/projects'],
  },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      {/* Top Navigation Bar — Deep Dark Navy (#0B1D3A) */}
      <header className="sticky lg:fixed top-0 left-0 w-full z-50 bg-[#0B1D3A] text-white border-b border-white/10 shadow-sm">
        <div className="h-14 lg:h-[68px] max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            to="/"
            className="font-editorial font-bold text-lg sm:text-xl text-white tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            {infoKelas.nama}
          </Link>

          {/* Zone 2: 5 Concise Single-Line Navigation Links (Beranda, Galeri, Anggota, Jejak Kelas, Projects) */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Navigasi Utama"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-200 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-amber-400 rounded-full transition-transform origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: 1 Primary CTA (Admin) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px] shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation Bar (< lg) */}
      <nav
        aria-label="Navigasi Utama Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1D3A]/95 backdrop-blur-md border-t border-white/15 shadow-[0_-8px_24px_rgba(11,29,58,0.35)] px-1.5 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
          {mobileBottomLinks.map((item) => {
            const Icon = item.icon;
            const isTabActive = item.matchPaths.includes(location.pathname);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={`relative flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[44px] py-1 rounded-xl transition-colors ${
                  isTabActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-300/80 hover:text-white font-medium'
                }`}
              >
                {isTabActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-400"
                  />
                )}
                <span
                  className={`flex items-center justify-center w-8 h-6 rounded-lg transition-colors ${
                    isTabActive ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10.5px] leading-none tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
