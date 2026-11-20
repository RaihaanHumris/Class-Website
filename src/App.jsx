import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Beranda from './pages/Beranda';
import GlobalBirthdayModal from './components/features/BirthdayCelebration';
import {
  syncMembersFromDatabase,
  syncProjectsFromDatabase,
} from './utils/memberStorage';

const Profil = lazy(() => import('./pages/Profil'));
const Anggota = lazy(() => import('./pages/Anggota'));
const Projects = lazy(() => import('./pages/Projects'));
const Jadwal = lazy(() => import('./pages/Jadwal'));
const Piket = lazy(() => import('./pages/Piket'));
const Tugas = lazy(() => import('./pages/Tugas'));
const Galeri = lazy(() => import('./pages/Galeri'));
const Kontak = lazy(() => import('./pages/Kontak'));
const JejakKelas = lazy(() => import('./pages/JejakKelas'));
const KirimFoto = lazy(() => import('./pages/KirimFoto'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BackgroundMusicPlayer = lazy(() =>
  import('./components/common/BackgroundMusicPlayer')
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
}

export default function App() {
  const [manualBirthdayMember, setManualBirthdayMember] = useState(null);
  const [idleReady, setIdleReady] = useState(false);

  useEffect(() => {
    const runIdleTasks = () => {
      setIdleReady(true);
      syncMembersFromDatabase();
      syncProjectsFromDatabase();
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(runIdleTasks, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(runIdleTasks, 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-slate-800 font-sans selection:bg-amber-500/25 selection:text-[#0B1D3A]">
        <Navbar />
        <main className="flex-1 lg:pt-[68px]">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-600">
                Memuat halaman...
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={<Beranda onOpenBirthdayModal={(m) => setManualBirthdayMember(m)} />}
              />
              <Route path="/galeri" element={<Galeri />} />
              <Route
                path="/anggota"
                element={<Anggota onOpenBirthdayModal={(m) => setManualBirthdayMember(m)} />}
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/jejak" element={<JejakKelas />} />
              <Route path="/kirim-foto" element={<KirimFoto />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/jadwal" element={<Jadwal />} />
              <Route path="/piket" element={<Piket />} />
              <Route path="/tugas" element={<Tugas />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {idleReady && (
          <Suspense fallback={null}>
            <BackgroundMusicPlayer />
            <GlobalBirthdayModal
              manualMember={manualBirthdayMember}
              onCloseManual={() => setManualBirthdayMember(null)}
            />
          </Suspense>
        )}
      </div>
    </Router>
  );
}

