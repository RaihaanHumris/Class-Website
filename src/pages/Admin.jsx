import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  Check,
  X,
  Trash2,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  AlertCircle,
  MessageSquare,
  Users,
  Camera,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getAdminSession,
  onAdminAuthChange,
  signInAdmin,
  signOutAdmin,
  fetchAllPhotosForAdmin,
  reviewPhotoSubmission,
  deletePhotoSubmission,
  adminPublishPhoto,
  adminPublishMemberPhoto,
  MEMBER_PHOTO_CATEGORY,
  fetchMemoryNotes,
  deleteMemoryNote,
} from '../lib/supabase';
import { sequentialMemberOrder } from '../data/classMembers';

const SCHEMA_SQL_SNIPPET = `-- Jalankan di Supabase SQL Editor (lihat juga file /supabase/schema.sql)
create table if not exists public.photo_memories (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text not null,
  tanggal text not null,
  deskripsi text not null,
  image_url text not null,
  pengirim_nama text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);`;

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  // Admin data state
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'students' | 'all' | 'upload' | 'notes'
  const [submissions, setSubmissions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [adminNotesById, setAdminNotesById] = useState({});
  const [copiedSql, setCopiedSql] = useState(false);

  // Direct student portrait publish state
  const [selectedMemberKey, setSelectedMemberKey] = useState(
    sequentialMemberOrder[0]?.memberKey || 'member-01'
  );
  const [studentFile, setStudentFile] = useState(null);
  const [studentUrl, setStudentUrl] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [publishingStudent, setPublishingStudent] = useState(false);

  // Direct publish state
  const [pubJudul, setPubJudul] = useState('');
  const [pubKategori, setPubKategori] = useState('Kebersamaan');
  const [pubTanggal, setPubTanggal] = useState('');
  const [pubDeskripsi, setPubDeskripsi] = useState('');
  const [pubPengirim, setPubPengirim] = useState('Admin XII PPLG 3');
  const [pubFile, setPubFile] = useState(null);
  const [pubUrl, setPubUrl] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    getAdminSession()
      .then((sess) => setSession(sess))
      .finally(() => setAuthLoading(false));

    const unsubscribe = onAdminAuthChange((sess) => {
      setSession(sess);
    });
    return unsubscribe;
  }, []);

  const loadAdminData = async () => {
    if (!isSupabaseConfigured || !session) return;
    setLoadingData(true);
    setActionErr('');
    try {
      const [photoRows, noteRows] = await Promise.all([
        fetchAllPhotosForAdmin(),
        fetchMemoryNotes(),
      ]);
      setSubmissions(photoRows);
      setNotes(noteRows);
    } catch (err) {
      setActionErr(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadAdminData();
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSigningIn(true);
    try {
      const res = await signInAdmin(email, password);
      setSession(res.session);
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Email atau kata sandi admin tidak valid.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setSession(null);
    setSubmissions([]);
  };

  const handleReview = async (id, status) => {
    setActionErr('');
    setActionMsg('');
    try {
      const updated = await reviewPhotoSubmission(
        id,
        status,
        adminNotesById[id] || ''
      );
      setSubmissions((prev) =>
        prev.map((row) => (row.id === id ? updated : row))
      );
      setActionMsg(
        status === 'approved'
          ? 'Foto telah disetujui (apply) dan langsung tayang di Galeri Kenangan!'
          : 'Pengajuan foto ditandai sebagai ditolak.'
      );
    } catch (err) {
      setActionErr(err.message);
    }
  };

  const handleDeletePhoto = async (id) => {
    setActionErr('');
    setActionMsg('');
    try {
      await deletePhotoSubmission(id);
      setSubmissions((prev) => prev.filter((row) => row.id !== id));
      setActionMsg('Data foto berhasil dihapus dari Supabase.');
    } catch (err) {
      setActionErr(err.message);
    }
  };

  const handleDirectPublish = async (e) => {
    e.preventDefault();
    setActionErr('');
    setActionMsg('');
    setPublishing(true);
    try {
      const created = await adminPublishPhoto({
        judul: pubJudul,
        kategori: pubKategori,
        tanggal: pubTanggal,
        deskripsi: pubDeskripsi,
        pengirimNama: pubPengirim,
        file: pubFile,
        imageUrl: pubUrl,
      });
      setSubmissions((prev) => [created, ...prev]);
      setPubJudul('');
      setPubTanggal('');
      setPubDeskripsi('');
      setPubFile(null);
      setPubUrl('');
      setActionMsg('Foto kenangan baru berhasil diterbitkan ke galeri.');
      setActiveTab('all');
    } catch (err) {
      setActionErr(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteNote = async (id) => {
    setActionErr('');
    try {
      await deleteMemoryNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setActionMsg('Pesan buku kenangan dihapus.');
    } catch (err) {
      setActionErr(err.message);
    }
  };

  const handleDirectStudentPublish = async (e) => {
    e.preventDefault();
    const targetMember = sequentialMemberOrder.find(
      (m) => m.memberKey === selectedMemberKey
    );
    if (!targetMember) return;
    setActionErr('');
    setActionMsg('');
    setPublishingStudent(true);
    try {
      const created = await adminPublishMemberPhoto({
        memberKey: targetMember.memberKey,
        memberName: targetMember.name,
        badgeLabel: targetMember.badgeLabel,
        catatan:
          studentNote.trim() ||
          `Foto profil Polaroid ${targetMember.name} (${targetMember.badgeLabel})`,
        file: studentFile,
        imageUrl: studentUrl,
      });
      setSubmissions((prev) => [created, ...prev]);
      setStudentFile(null);
      setStudentUrl('');
      setStudentNote('');
      setActionMsg(
        `Foto profil untuk ${targetMember.badgeLabel} ${targetMember.name} langsung terpasang di Meja Kenangan!`
      );
    } catch (err) {
      setActionErr(err.message);
    } finally {
      setPublishingStudent(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SCHEMA_SQL_SNIPPET);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {}
  };

  const eventSubmissions = submissions.filter(
    (s) => s.kategori !== MEMBER_PHOTO_CATEGORY
  );
  const studentSubmissions = submissions.filter(
    (s) => s.kategori === MEMBER_PHOTO_CATEGORY
  );

  const pendingItems = eventSubmissions.filter((s) => s.status === 'pending');
  const pendingStudentItems = studentSubmissions.filter((s) => s.status === 'pending');
  const approvedItems = submissions.filter((s) => s.status === 'approved');
  const rejectedItems = submissions.filter((s) => s.status === 'rejected');

  const approvedStudentByKey = {};
  studentSubmissions
    .filter((s) => s.status === 'approved')
    .forEach((s) => {
      if (s.tanggal && !approvedStudentByKey[s.tanggal]) {
        approvedStudentByKey[s.tanggal] = s;
      }
    });

  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen pb-16">
      <section className="bg-[#050e29] text-white py-10 sm:py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#90E0EF]">
              Panel Kurasi &amp; Database Supabase
            </p>
            <h1 className="font-editorial text-2xl sm:text-4xl font-semibold text-white">
              Admin Web Kenangan XII PPLG 3
            </h1>
          </div>

          {session && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#CAF0F8] font-mono hidden sm:inline">
                {session.user?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Admin</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {!isSupabaseConfigured ? (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Menunggu Konfigurasi Supabase</span>
              </div>
              <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
                Aktifkan Database &amp; Login Admin Supabase
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Integrasi Supabase sudah terpasang pada aplikasi ini. Agar login admin, pengajuan tambah foto, dan buku kenangan aktif terhubung ke proyek Supabase Anda, ikuti 3 langkah berikut:
              </p>
            </div>

            <ol className="space-y-3 text-sm text-slate-700 list-decimal list-inside">
              <li>
                Buat proyek di <strong>supabase.com</strong>, lalu jalankan seluruh skrip SQL dari file{' '}
                <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">supabase/schema.sql</code>{' '}
                di menu <strong>SQL Editor</strong> Supabase untuk membuat tabel <code className="font-mono text-xs">photo_memories</code>, <code className="font-mono text-xs">memory_notes</code>, RLS policies, dan bucket Storage <code className="font-mono text-xs">kenangan-photos</code>.
              </li>
              <li>
                Buat akun Admin di menu <strong>Authentication → Users → Add user</strong> (Email &amp; Password) pada Dashboard Supabase Anda.
              </li>
              <li>
                Tambahkan environment variables <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> dan{' '}
                <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> pada pengaturan Environment Variables proyek ini lalu restart server.
              </li>
            </ol>

            <div className="rounded-xl bg-[#050e29] text-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#90E0EF]">Cuplikan Skema SQL (lengkap di /supabase/schema.sql)</span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Tersalin' : 'Salin SQL'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono overflow-x-auto leading-relaxed text-slate-300">
                {SCHEMA_SQL_SNIPPET}
              </pre>
            </div>
          </div>
        ) : authLoading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Memeriksa sesi login admin...
          </div>
        ) : !session ? (
          <div className="max-w-md mx-auto bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#CAF0F8] text-[#03045E] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-editorial text-2xl font-semibold text-[#03045E]">
                Login Admin Kelas
              </h2>
              <p className="text-xs text-slate-500">
                Masuk dengan akun Admin Supabase untuk meninjau, menyetujui (apply), dan mengelola foto kenangan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Email Admin
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maknende.sch.id"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none min-h-[44px]"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={signingIn}
                className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#03045E] hover:bg-[#0077B6] disabled:opacity-60 text-white text-sm font-semibold cursor-pointer transition-colors"
              >
                {signingIn ? 'Memverifikasi...' : 'Masuk ke Panel Admin'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ringkasan KPI Admin */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-xs text-slate-500">Menunggu Persetujuan</p>
                <p className="font-editorial text-3xl font-semibold text-amber-600 mt-1 tabular-nums">
                  {pendingItems.length + pendingStudentItems.length}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-xs text-slate-500">Disetujui &amp; Tayang</p>
                <p className="font-editorial text-3xl font-semibold text-emerald-700 mt-1 tabular-nums">
                  {approvedItems.length}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-xs text-slate-500">Foto Profil Polaroid</p>
                <p className="font-editorial text-3xl font-semibold text-[#0077B6] mt-1 tabular-nums">
                  {Object.keys(approvedStudentByKey).length} / 26
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
                <p className="text-xs text-slate-500">Catatan Buku Kenangan</p>
                <p className="font-editorial text-3xl font-semibold text-[#03045E] mt-1 tabular-nums">
                  {notes.length}
                </p>
              </div>
            </div>

            {actionMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionMsg}</span>
              </div>
            )}
            {actionErr && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionErr}</span>
              </div>
            )}

            {/* Tabs Navigasi Admin */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
              {[
                { id: 'pending', label: `Antrean Foto Acara (${pendingItems.length})`, icon: Clock },
                { id: 'students', label: `Kelola Foto Siswa (${pendingStudentItems.length})`, icon: Users },
                { id: 'all', label: `Semua Foto DB (${submissions.length})`, icon: CheckCircle2 },
                { id: 'upload', label: 'Unggah Foto Acara', icon: Upload },
                { id: 'notes', label: `Buku Kenangan (${notes.length})`, icon: MessageSquare },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === t.id
                        ? 'bg-[#03045E] text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0077B6]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Antrean Pending */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {loadingData ? (
                  <p className="text-sm text-slate-500 py-8 text-center">Memuat antrean pengajuan...</p>
                ) : pendingItems.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-1.5">
                    <p className="font-semibold text-sm text-[#03045E]">Tidak ada pengajuan foto baru yang menunggu persetujuan</p>
                    <p className="text-xs text-slate-500">Setiap kiriman foto dari halaman Kirim Foto akan muncul di sini untuk Anda setujui (apply).</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pendingItems.map((item) => (
                      <article
                        key={item.id}
                        className="bg-white border border-amber-200 rounded-2xl overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.judul}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span className="font-semibold text-[#0077B6]">{item.kategori}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-[11px]">{item.tanggal}</span>
                              <span aria-hidden="true">·</span>
                              <span>Pengirim: {item.pengirim_nama}</span>
                            </div>
                            <h3 className="font-heading font-bold text-base text-[#03045E]">
                              {item.judul}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {item.deskripsi}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-slate-100">
                            <input
                              type="text"
                              value={adminNotesById[item.id] || ''}
                              onChange={(e) =>
                                setAdminNotesById((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value,
                                }))
                              }
                              placeholder="Catatan admin (opsional)..."
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-[#FAF8F3] focus:bg-white focus:border-[#0077B6] focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleReview(item.id, 'approved')}
                                className="flex-1 min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Apply &amp; Terbitkan</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReview(item.id, 'rejected')}
                                className="min-h-[40px] px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Baru: Kelola Foto Profil Siswa & Wali Kelas */}
            {activeTab === 'students' && (
              <div className="space-y-8">
                {/* Bagian A: Antrean Persetujuan Kiriman Siswa */}
                <div className="space-y-4">
                  <div>
                    <h2 className="font-editorial text-xl font-semibold text-[#03045E]">
                      Antrean Foto Profil Siswa ({pendingStudentItems.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Foto yang diunggah siswa dari Meja Kenangan membutuhkan persetujuan (apply) Admin sebelum tampil resmi untuk semua anggota kelas.
                    </p>
                  </div>

                  {pendingStudentItems.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                      <p className="font-semibold text-sm text-[#03045E]">
                        Belum ada pengajuan foto profil baru dari siswa
                      </p>
                      <p className="text-xs text-slate-500">
                        Ketika siswa mengunggah foto di kartu Polaroid Meja Kenangan, antreannya akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {pendingStudentItems.map((item) => (
                        <article
                          key={item.id}
                          className="bg-white border border-amber-200 rounded-2xl overflow-hidden flex flex-col"
                        >
                          <div className="aspect-[4/4] bg-slate-100 overflow-hidden">
                            <img
                              src={item.image_url}
                              alt={item.judul}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="font-mono text-[11px] font-bold text-[#0077B6]">
                                {item.tanggal} · Pengirim: {item.pengirim_nama}
                              </span>
                              <h3 className="font-heading font-bold text-sm text-[#03045E] mt-0.5">
                                {item.judul}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">{item.deskripsi}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleReview(item.id, 'approved')}
                                className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Apply Foto</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReview(item.id, 'rejected')}
                                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bagian B: Form Unggah Langsung Foto Siswa oleh Admin */}
                <form
                  onSubmit={handleDirectStudentPublish}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#0077B6]" />
                    <h2 className="font-editorial text-xl font-semibold text-[#03045E]">
                      Pasang / Ganti Foto Polaroid Langsung (Admin)
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                        Pilih Anggota / Wali Kelas (26 Profil)
                      </label>
                      <select
                        value={selectedMemberKey}
                        onChange={(e) => setSelectedMemberKey(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                      >
                        {sequentialMemberOrder.map((m) => (
                          <option key={m.memberKey} value={m.memberKey}>
                            {m.badgeLabel} — {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#03045E] mb-1.5">
                        Catatan Singkat (opsional)
                      </label>
                      <input
                        type="text"
                        value={studentNote}
                        onChange={(e) => setStudentNote(e.target.value)}
                        placeholder="Mis: Foto resmi yearbook 2026"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setStudentFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600"
                    />
                    <input
                      type="url"
                      value={studentUrl}
                      onChange={(e) => setStudentUrl(e.target.value)}
                      placeholder="Atau tautan URL foto portrait..."
                      className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={publishingStudent}
                    className="min-h-[42px] px-5 py-2 rounded-lg bg-[#03045E] hover:bg-[#0077B6] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{publishingStudent ? 'Memasang...' : 'Apply & Pasang ke Meja Kenangan'}</span>
                  </button>
                </form>

                {/* Bagian C: Status 26 Slot Profil Meja Kenangan */}
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-base text-[#03045E]">
                    Daftar 26 Slot Profil Meja Kenangan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {sequentialMemberOrder.map((m) => {
                      const activePhoto = approvedStudentByKey[m.memberKey];
                      return (
                        <div
                          key={m.memberKey}
                          className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3"
                        >
                          <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {activePhoto ? (
                              <img
                                src={activePhoto.image_url}
                                alt={m.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                              />
                            ) : (
                              <Camera className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#03045E]">
                                {m.badgeLabel}
                              </span>
                              <span
                                className={`text-[10px] font-semibold ${
                                  activePhoto ? 'text-emerald-700' : 'text-slate-400'
                                }`}
                              >
                                {activePhoto ? 'Terpasang' : 'Kosong'}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#03045E] truncate mt-1">
                              {m.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setSelectedMemberKey(m.memberKey)}
                                className="text-[11px] font-semibold text-[#0077B6] hover:underline cursor-pointer"
                              >
                                {activePhoto ? 'Ganti' : 'Pasang Foto'}
                              </button>
                              {activePhoto && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePhoto(activePhoto.id)}
                                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Kelola Semua Foto Database */}
            {activeTab === 'all' && (
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-sm text-slate-500">
                    Belum ada data foto di tabel Supabase.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {submissions.map((item) => (
                      <article
                        key={item.id}
                        className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.judul}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 text-xs mb-1">
                              <span className="font-semibold text-[#0077B6]">{item.kategori}</span>
                              <span
                                className={`font-semibold inline-flex items-center gap-1 ${
                                  item.status === 'approved'
                                    ? 'text-emerald-700'
                                    : item.status === 'rejected'
                                    ? 'text-rose-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {item.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {item.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                {item.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                <span>
                                  {item.status === 'approved'
                                    ? 'Tayang'
                                    : item.status === 'rejected'
                                    ? 'Ditolak'
                                    : 'Pending'}
                                </span>
                              </span>
                            </div>
                            <h3 className="font-heading font-bold text-sm text-[#03045E] line-clamp-1">
                              {item.judul}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.tanggal} · Oleh {item.pengirim_nama}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            {item.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleReview(item.id, 'approved')}
                                className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                              >
                                Terbitkan
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(item.id)}
                              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Unggah Langsung sebagai Admin */}
            {activeTab === 'upload' && (
              <form
                onSubmit={handleDirectPublish}
                className="max-w-2xl bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-editorial text-xl font-semibold text-[#03045E]">
                  Terbitkan Foto Kenangan Langsung
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={pubJudul}
                    onChange={(e) => setPubJudul(e.target.value)}
                    placeholder="Judul Foto Kenangan"
                    className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                  />
                  <input
                    type="text"
                    required
                    value={pubTanggal}
                    onChange={(e) => setPubTanggal(e.target.value)}
                    placeholder="Tanggal (mis: Mei 2026)"
                    className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={pubKategori}
                    onChange={(e) => setPubKategori(e.target.value)}
                    className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                  >
                    <option value="Kebersamaan">Kebersamaan</option>
                    <option value="Resmi Kelas">Resmi Kelas</option>
                    <option value="Pramuka">Pramuka</option>
                    <option value="Praktik Lab">Praktik Lab</option>
                    <option value="Kenangan">Kenangan</option>
                  </select>
                  <input
                    type="text"
                    value={pubPengirim}
                    onChange={(e) => setPubPengirim(e.target.value)}
                    placeholder="Nama Pengunggah"
                    className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={pubDeskripsi}
                  onChange={(e) => setPubDeskripsi(e.target.value)}
                  placeholder="Deskripsi / cerita foto..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPubFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600"
                  />
                  <input
                    type="url"
                    value={pubUrl}
                    onChange={(e) => setPubUrl(e.target.value)}
                    placeholder="Atau tautan URL foto..."
                    className="px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-[#FAF8F3] min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={publishing}
                  className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#03045E] hover:bg-[#0077B6] text-white text-sm font-semibold cursor-pointer"
                >
                  {publishing ? 'Menerbitkan...' : 'Terbitkan ke Galeri'}
                </button>
              </form>
            )}

            {/* Tab 4: Kelola Buku Kenangan */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center text-sm text-slate-500">
                    Belum ada catatan buku kenangan.
                  </div>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm text-slate-800">“{n.pesan}”</p>
                        <p className="text-xs text-slate-500">
                          <strong className="text-[#03045E]">{n.nama}</strong> · {n.peran}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(n.id)}
                        className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer shrink-0"
                        aria-label="Hapus pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
