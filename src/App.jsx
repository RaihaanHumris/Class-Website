import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Beranda from './pages/Beranda';
import Profil from './pages/Profil';
import Anggota from './pages/Anggota';
import Jadwal from './pages/Jadwal';
import Piket from './pages/Piket';
import Tugas from './pages/Tugas';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';
import NotFound from './pages/NotFound';

// Komponen pembantu untuk scroll otomatis ke atas saat berpindah rute
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#00B4D8] selection:text-[#03045E]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/anggota" element={<Anggota />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/piket" element={<Piket />} />
            <Route path="/tugas" element={<Tugas />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/kontak" element={<Kontak />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
