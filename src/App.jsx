import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Beranda from './pages/Beranda';
import Profil from './pages/Profil';
import Anggota from './pages/Anggota';
import Projects from './pages/Projects';
import Jadwal from './pages/Jadwal';
import Piket from './pages/Piket';
import Tugas from './pages/Tugas';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';
import JejakKelas from './pages/JejakKelas';
import KirimFoto from './pages/KirimFoto';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import BackgroundMusicPlayer from './components/common/BackgroundMusicPlayer';
import GlobalBirthdayModal from './components/features/BirthdayCelebration';
import {
  syncMembersFromDatabase,
  syncProjectsFromDatabase,
} from './utils/memberStorage';

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

  useEffect(() => {
    syncMembersFromDatabase();
    syncProjectsFromDatabase();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-slate-800 font-sans selection:bg-amber-500/25 selection:text-[#0B1D3A]">
        <Navbar />
        <main className="flex-1 lg:pt-[68px]">
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
        </main>
        <Footer />
        <BackgroundMusicPlayer />
        <GlobalBirthdayModal
          manualMember={manualBirthdayMember}
          onCloseManual={() => setManualBirthdayMember(null)}
        />
      </div>
    </Router>
  );
}
