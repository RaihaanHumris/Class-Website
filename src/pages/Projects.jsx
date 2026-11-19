import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  Search,
  X,
  Code2,
  Plus,
  Copy,
  Check,
  Users,
  FolderGit2,
  Database,
  Sparkles,
} from 'lucide-react';
import { getInitials } from '../utils/helpers';
import {
  getMergedMembers,
  getMergedProjects,
  saveCustomProject,
  syncMembersFromDatabase,
  syncProjectsFromDatabase,
} from '../utils/memberStorage';

const PROJECT_CATEGORIES = [
  'Semua',
  'Web App',
  'Full-Stack',
  'Game Dev',
  'Mobile App',
  'UI/UX & Design',
  'Backend & DevOps',
];

export default function Projects() {
  const [members, setMembers] = useState(() => getMergedMembers());
  const [projects, setProjects] = useState(() => getMergedProjects());
  const [loadingDb, setLoadingDb] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const [showAddForm, setShowAddForm] = useState(false);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('Web App');
  const [teknologiInput, setTeknologiInput] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [statusRepo, setStatusRepo] = useState('Public Repo · Active');
  const [savingProject, setSavingProject] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    const sync = () => {
      setMembers(getMergedMembers());
      setProjects(getMergedProjects());
    };
    window.addEventListener('pplg3-members-updated', sync);

    Promise.all([syncMembersFromDatabase(), syncProjectsFromDatabase()])
      .finally(() => setLoadingDb(false));

    return () => window.removeEventListener('pplg3-members-updated', sync);
  }, []);

  const memberMap = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[Number(m.id)] = m;
    });
    return map;
  }, [members]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchCat =
        selectedCategory === 'Semua' || proj.kategori === selectedCategory;

      if (!matchCat) return false;
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase();
      const teamMembers = (proj.memberIds || [])
        .map((id) => memberMap[Number(id)])
        .filter(Boolean);

      const matchTitle = (proj.judul || '').toLowerCase().includes(q);
      const matchDesc = (proj.deskripsi || '').toLowerCase().includes(q);
      const matchTech = (proj.teknologi || []).some((t) =>
        t.toLowerCase().includes(q)
      );
      const matchMember = teamMembers.some(
        (m) =>
          m.nama.toLowerCase().includes(q) ||
          (m.panggilan || '').toLowerCase().includes(q)
      );

      return matchTitle || matchDesc || matchTech || matchMember;
    });
  }, [projects, selectedCategory, searchTerm, memberMap]);

  const handleToggleTeamMember = (id) => {
    const numId = Number(id);
    setSelectedMemberIds((prev) =>
      prev.includes(numId) ? prev.filter((item) => item !== numId) : [...prev, numId]
    );
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    if (!judul.trim() || !deskripsi.trim()) {
      setSaveError('Judul dan deskripsi singkat proyek wajib diisi.');
      return;
    }

    setSavingProject(true);
    try {
      const created = await saveCustomProject({
        judul,
        deskripsi,
        kategori,
        teknologi: teknologiInput,
        memberIds: selectedMemberIds,
        githubUrl: githubUrl || 'https://github.com',
        demoUrl,
        statusRepo,
      });

      setProjects(getMergedProjects());
      setJudul('');
      setDeskripsi('');
      setTeknologiInput('');
      setSelectedMemberIds([]);
      setGithubUrl('');
      setDemoUrl('');
      setSaveSuccess(`Proyek "${created.judul}" berhasil disimpan ke Database Supabase!`);
      setTimeout(() => {
        setSaveSuccess('');
        setShowAddForm(false);
      }, 1500);
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan proyek ke database.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleCopyProjectsJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] pb-20">
      {/* Header Editorial Halaman Projects */}
      <section className="bg-[#0B1D3A] text-white py-8 sm:py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold text-amber-300 tracking-wide">
              Portofolio Rekayasa Perangkat Lunak &amp; Gim · XII PPLG 3 MAKN Ende
            </p>
            <h1 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              Karya &amp; Projects Siswa XII PPLG 3
            </h1>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
              Tambahkan dan bagikan karya aplikasi web, gim, mobile app, atau repositori GitHub anggota XII PPLG 3. Setiap proyek yang ditambahkan langsung tersimpan ke database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D97706] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Form Proyek' : 'Tambah Proyek Siswa'}</span>
            </button>

            {projects.length > 0 && (
              <button
                type="button"
                onClick={handleCopyProjectsJson}
                className="min-h-[42px] px-3.5 py-2.5 rounded-xl bg-[#132C57] hover:bg-[#1b3c73] text-white border border-white/15 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">JSON Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Salin JSON</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Form Tambah Proyek Baru ke Database */}
        {showAddForm && (
          <form
            onSubmit={handleAddProject}
            className="rounded-3xl bg-[#FFFDF9] border-2 border-[#0B1D3A]/15 shadow-lg overflow-hidden"
          >
            <div className="bg-[#0B1D3A] text-white px-5 sm:px-7 py-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-300 inline-flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Tersimpan Langsung ke Database Supabase</span>
                </span>
                <h2 className="font-editorial text-lg sm:text-xl font-semibold text-white mt-0.5">
                  Tambah Proyek Siswa XII PPLG 3
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Aplikasi Absensi QR Madrasah"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                    Kategori Proyek
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                  >
                    {PROJECT_CATEGORIES.filter((c) => c !== 'Semua').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  Deskripsi Singkat Proyek *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan fungsi utama proyek dan teknologi yang digunakan..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                    Teknologi (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={teknologiInput}
                    onChange={(e) => setTeknologiInput(e.target.value)}
                    placeholder="React, Tailwind CSS, MySQL"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                    Link Repository GitHub *
                  </label>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                    Link Live Demo (Opsional)
                  </label>
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://... (kosongkan jika belum ada)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              {/* Pilih Anggota Pembuat / Tim */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#0B1D3A]">
                  Pilih Pembuat / Anggota Tim ({selectedMemberIds.length} dipilih)
                </label>
                <div className="max-h-40 overflow-y-auto p-3 rounded-xl bg-[#FAF6EE] border border-[#E6DFD3] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {members.map((m) => {
                    const checked = selectedMemberIds.includes(Number(m.id));
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          checked
                            ? 'bg-[#0B1D3A] text-white font-semibold'
                            : 'bg-white text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleTeamMember(m.id)}
                          className="accent-[#D97706]"
                        />
                        <span className="truncate">
                          #{String(m.id).padStart(2, '0')} {m.nama}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {saveError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#0B1D3A] hover:bg-[#132c57] disabled:opacity-60 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>{savingProject ? 'Menyimpan ke Database...' : 'Simpan Proyek ke Database'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter Kategori & Pencarian Proyek */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#FFFDF9] p-4 sm:p-5 border border-[#E6DFD3] rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul proyek, teknologi (React, Godot, Laravel), atau nama pembuat..."
              className="w-full pl-10 pr-10 py-2.5 text-sm text-[#0B1D3A] bg-[#FAF6EE] border border-[#D8CFC0] rounded-xl focus:outline-none focus:bg-white focus:border-[#D97706] min-h-[44px]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0B1D3A] text-white'
                    : 'bg-[#FAF6EE] text-slate-700 hover:bg-amber-100/60 border border-[#E6DFD3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ringkasan Jumlah Proyek */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs sm:text-sm text-slate-600">
          <span className="tabular-nums">
            {loadingDb ? (
              'Memuat daftar proyek dari database...'
            ) : (
              <>
                Menampilkan <strong className="text-[#0B1D3A] font-bold">{filteredProjects.length}</strong> karya proyek siswa XII PPLG 3
              </>
            )}
          </span>
          <Link
            to="/anggota"
            className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] inline-flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Terhubung dengan Direktori {members.length} Anggota Kelas →</span>
          </Link>
        </div>

        {/* Grid Kartu Proyek Siswa */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const teamMembers = (proj.memberIds || [])
                .map((id) => memberMap[Number(id)])
                .filter(Boolean);

              return (
                <article
                  key={proj.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-[#FFFDF9] border border-[#E6DFD3] shadow-xs hover:border-[#D97706]/60 transition-all h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
                      <span className="font-bold text-[#D97706]">
                        {proj.kategori}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {proj.statusRepo || 'Public Repo'} · {proj.tahun || '2026'}
                      </span>
                    </div>

                    <h2 className="font-editorial text-xl font-semibold text-[#0B1D3A] leading-snug mb-2">
                      {proj.judul}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {proj.deskripsi}
                    </p>

                    {proj.teknologi && proj.teknologi.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#0B1D3A]/85 mb-5 pt-2 border-t border-[#EFE9DC]">
                        <Code2 className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        {proj.teknologi.map((tech, idx) => (
                          <React.Fragment key={tech}>
                            <span className="font-medium">{tech}</span>
                            {idx < proj.teknologi.length - 1 && (
                              <span aria-hidden="true" className="text-slate-300">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-3 border-t border-[#EFE9DC]">
                    {teamMembers.length > 0 && (
                      <div className="space-y-2">
                        <span className="block text-[11px] font-semibold text-slate-500">
                          Pembuat / Tim Pengembang:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {teamMembers.map((member) => (
                            <Link
                              key={member.id}
                              to="/anggota"
                              className="inline-flex items-center gap-2 pr-2.5 pl-1 py-1 rounded-full bg-[#FAF6EE] hover:bg-amber-100/70 border border-[#E6DFD3] transition-colors"
                              title={`${member.nama} (${member.minat || member.peran})`}
                            >
                              {member.foto ? (
                                <img
                                  src={member.foto}
                                  alt={member.nama}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover border border-[#D97706]"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white font-editorial font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {getInitials(member.nama)}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-[#0B1D3A] whitespace-nowrap">
                                {member.panggilan || member.nama.split(' ')[0]}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 pt-1">
                      <a
                        href={proj.githubUrl || 'https://github.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B1D3A] hover:bg-[#152e5c] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <Github className="w-4 h-4 text-amber-400" />
                        <span>Repository GitHub</span>
                      </a>

                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target={proj.demoUrl.startsWith('http') ? '_blank' : undefined}
                          rel={proj.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FAF6EE] hover:bg-amber-100/80 text-[#0B1D3A] border border-[#D8CFC0] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                        >
                          <span>Demo</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#D97706]" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#FFFDF9] border border-[#E6DFD3] rounded-2xl p-10 sm:p-14 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-[#D97706] flex items-center justify-center mx-auto">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <p className="font-editorial font-semibold text-xl text-[#0B1D3A]">
                {projects.length === 0
                  ? 'Belum Ada Proyek Siswa yang Ditambahkan'
                  : 'Tidak ada proyek yang cocok dengan pencarian'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {projects.length === 0
                  ? 'Silakan tambahkan proyek atau repositori GitHub karya siswa XII PPLG 3. Setiap proyek yang ditambahkan akan langsung tersimpan di database.'
                  : 'Coba pilih kategori lain atau gunakan kata kunci pencarian yang berbeda.'}
              </p>
            </div>
            {projects.length === 0 && !showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D97706] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Pertama ke Database</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
