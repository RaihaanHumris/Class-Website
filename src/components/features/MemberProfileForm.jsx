import React, { useState, useEffect } from 'react';
import {
  Upload,
  Copy,
  Check,
  X,
  UserCheck,
  Cake,
  Github,
  Globe,
  Sparkles,
  Trash2,
  Code2,
  Database,
} from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import {
  compressImageToDataUrl,
  saveMemberProfile,
  setActiveMemberId,
  getActiveMemberId,
  getTodayMMDD,
  normalizeMMDD,
  formatBirthdayIndonesian,
} from '../../utils/memberStorage';

const PERAN_OPTIONS = [
  'Anggota',
  'Ketua Kelas',
  'Wakil Ketua Kelas',
  'Sekretaris',
  'Bendahara',
  'Sahabat Seperjuangan',
];

const MINAT_PRESETS = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Web',
  'UI/UX Design',
  'Game Development',
  'Mobile App Developer',
  'Database Administration',
  'Cyber Security & Networks',
  'DevOps & Cloud',
  '3D Game Asset & Art',
];

const BULAN_LIST = [
  { val: '', label: '-- Pilih Bulan --' },
  { val: '01', label: '01 - Januari' },
  { val: '02', label: '02 - Februari' },
  { val: '03', label: '03 - Maret' },
  { val: '04', label: '04 - April' },
  { val: '05', label: '05 - Mei' },
  { val: '06', label: '06 - Juni' },
  { val: '07', label: '07 - Juli' },
  { val: '08', label: '08 - Agustus' },
  { val: '09', label: '09 - September' },
  { val: '10', label: '10 - Oktober' },
  { val: '11', label: '11 - November' },
  { val: '12', label: '12 - Desember' },
];

export default function MemberProfileForm({
  members = [],
  initialMember = null,
  onClose,
  onSaved,
}) {
  const currentActiveId = getActiveMemberId();

  const [selectedId, setSelectedId] = useState(
    initialMember ? String(initialMember.id) : String(members[0]?.id || 'new')
  );
  const [nama, setNama] = useState('');
  const [panggilan, setPanggilan] = useState('');
  const [peran, setPeran] = useState('Anggota');
  const [minat, setMinat] = useState('');
  const [ultahMonth, setUltahMonth] = useState('');
  const [ultahDay, setUltahDay] = useState('');
  const [ultahRaw, setUltahRaw] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url'
  const [fotoData, setFotoData] = useState('');
  const [isMe, setIsMe] = useState(false);

  const [compressing, setCompressing] = useState(false);
  const [savingDb, setSavingDb] = useState(false);
  const [photoInfo, setPhotoInfo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [savedNotice, setSavedNotice] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  useEffect(() => {
    if (initialMember) {
      setSelectedId(String(initialMember.id));
    }
  }, [initialMember]);

  useEffect(() => {
    if (selectedId === 'new') {
      setNama('');
      setPanggilan('');
      setPeran('Anggota');
      setMinat('');
      setUltahMonth('');
      setUltahDay('');
      setUltahRaw('');
      setBio('');
      setGithub('');
      setPortfolio('');
      setFotoData('');
      setPhotoInfo('');
      setIsMe(false);
      return;
    }

    const found = members.find((m) => String(m.id) === String(selectedId));
    if (found) {
      setNama(found.nama || '');
      setPanggilan(found.panggilan || '');
      setPeran(found.peran || 'Anggota');
      setMinat(found.minat || '');
      const normUltah = normalizeMMDD(found.ultah) || '';
      if (normUltah) {
        const [m, d] = normUltah.split('-');
        setUltahMonth(m || '');
        setUltahDay(d || '');
        setUltahRaw(normUltah);
      } else {
        setUltahMonth('');
        setUltahDay('');
        setUltahRaw('');
      }
      setBio(found.bio || '');
      setGithub(found.github || '');
      setPortfolio(found.portfolio || '');
      setFotoData(found.foto || '');
      setPhotoInfo(found.foto ? 'Foto profil tersimpan' : '');
      setIsMe(Number(currentActiveId) === Number(found.id));
    }
  }, [selectedId, members, currentActiveId]);

  const handleMonthDayChange = (newMonth, newDay) => {
    setUltahMonth(newMonth);
    setUltahDay(newDay);
    if (newMonth && newDay) {
      const paddedDay = String(newDay).padStart(2, '0');
      setUltahRaw(`${newMonth}-${paddedDay}`);
    } else {
      setUltahRaw('');
    }
  };

  const handleRawUltahChange = (val) => {
    setUltahRaw(val);
    const norm = normalizeMMDD(val);
    if (norm) {
      const [m, d] = norm.split('-');
      setUltahMonth(m);
      setUltahDay(d);
    }
  };

  const handleSetBirthdayToday = () => {
    const today = getTodayMMDD();
    const [m, d] = today.split('-');
    setUltahMonth(m);
    setUltahDay(d);
    setUltahRaw(today);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setCompressing(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 400, 400, 0.75);
      const approxKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      setFotoData(compressedDataUrl);
      setPhotoInfo(`Terkompresi otomatis via Canvas (maks 400×400px, q=0.75 · ~${approxKb} KB)`);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses gambar.');
    } finally {
      setCompressing(false);
    }
  };

  const buildPayloadObject = () => {
    const normUltah =
      normalizeMMDD(ultahRaw) ||
      (ultahMonth && ultahDay ? `${ultahMonth}-${String(ultahDay).padStart(2, '0')}` : '');
    return {
      id: selectedId === 'new' ? undefined : Number(selectedId),
      nama: nama.trim(),
      panggilan: panggilan.trim(),
      peran: peran.trim() || 'Anggota',
      minat: minat.trim(),
      ultah: normUltah,
      bio: bio.trim(),
      github: github.trim(),
      portfolio: portfolio.trim(),
      foto: fotoData.trim(),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedNotice('');
    if (!nama.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    setSavingDb(true);
    try {
      const payload = buildPayloadObject();
      const savedMember = await saveMemberProfile(payload);

      if (isMe) {
        setActiveMemberId(savedMember.id);
      } else if (Number(currentActiveId) === Number(savedMember.id)) {
        setActiveMemberId(null);
      }

      setSavedNotice(`Profil ${savedMember.nama} berhasil disimpan langsung ke Database Supabase!`);
      onSaved?.(savedMember);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan profil ke database.');
    } finally {
      setSavingDb(false);
    }
  };

  const handleCopyJson = async () => {
    const payload = buildPayloadObject();
    const jsonString = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    } catch {
      setShowJsonPreview(true);
    }
  };

  const previewInitials = getInitials(nama || 'XII PPLG 3');

  return (
    <div className="rounded-3xl bg-[#FFFDF9] border-2 border-[#0B1D3A]/15 shadow-lg overflow-hidden">
      {/* Header Form */}
      <div className="bg-[#0B1D3A] text-white px-5 sm:px-7 py-5 flex items-center justify-between gap-4 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-amber-300 inline-flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>Tersimpan Langsung ke Database Supabase &amp; Perangkat</span>
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-white mt-0.5">
            Tambah / Lengkapi Profil Anggota XII PPLG 3
          </h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form profil"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
        {/* Pilihan Anggota yang Sudah Ada atau Tambah Baru */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6DFD3] space-y-2">
          <label className="block text-xs font-bold text-[#0B1D3A]">
            Pilih Nama Anggota untuk Dilengkapi (atau Tambah Baru)
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-medium text-[#0B1D3A] bg-white border border-[#D8CFC0] rounded-xl focus:outline-none focus:border-[#D97706] min-h-[44px]"
          >
            {members.map((m) => (
              <option key={m.id} value={String(m.id)}>
                #{String(m.id).padStart(2, '0')} — {m.nama} ({m.peran || 'Anggota'})
              </option>
            ))}
            <option value="new">+ Tambah Anggota Baru</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Input Data Profil */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Muhammad Raihaan Humris"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={panggilan}
                  onChange={(e) => setPanggilan(e.target.value)}
                  placeholder="Masukkan nama panggilanmu"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  Peran di Kelas
                </label>
                <select
                  value={peran}
                  onChange={(e) => setPeran(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                >
                  {PERAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  Minat / Spesialisasi PPLG
                </label>
                <input
                  type="text"
                  list="minat-presets-list"
                  value={minat}
                  onChange={(e) => setMinat(e.target.value)}
                  placeholder="Contoh: Frontend, Backend, UI/UX, Game Dev"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                />
                <datalist id="minat-presets-list">
                  {MINAT_PRESETS.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Tanggal & Bulan Ulang Tahun (MM-DD) */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6DFD3] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-[#0B1D3A] flex items-center gap-1.5">
                  <Cake className="w-4 h-4 text-[#D97706]" />
                  <span>Tanggal &amp; Bulan Ulang Tahun (Format MM-DD)</span>
                </label>
                <button
                  type="button"
                  onClick={handleSetBirthdayToday}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#B45309] text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Set Hari Ini ({getTodayMMDD()})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Bulan (MM)</span>
                  <select
                    value={ultahMonth}
                    onChange={(e) => handleMonthDayChange(e.target.value, ultahDay || '01')}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8CFC0] bg-white focus:border-[#D97706] focus:outline-none min-h-[42px]"
                  >
                    {BULAN_LIST.map((b) => (
                      <option key={b.val} value={b.val}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Tanggal (DD)</span>
                  <select
                    value={ultahDay}
                    onChange={(e) => handleMonthDayChange(ultahMonth || '01', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8CFC0] bg-white focus:border-[#D97706] focus:outline-none min-h-[42px]"
                  >
                    <option value="">-- Pilih Tanggal --</option>
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(
                      (d) => (
                        <option key={d} value={d}>
                          Tanggal {d}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Kode MM-DD</span>
                  <input
                    type="text"
                    value={ultahRaw}
                    onChange={(e) => handleRawUltahChange(e.target.value)}
                    placeholder="Contoh: 11-19"
                    className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#D8CFC0] bg-white focus:border-[#D97706] focus:outline-none min-h-[42px]"
                  />
                </div>
              </div>
            </div>

            {/* Bio / Kutipan Singkat */}
            <div>
              <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                Bio / Kutipan Kenangan Singkat
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tulis kutipan singkat, kesan di XII PPLG 3, atau semangat ngodingmu..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none resize-none"
              />
            </div>

            {/* Link GitHub & Portofolio / Sosmed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>Link GitHub</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Link Portofolio / Media Sosial</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://instagram.com/... atau web portofolio"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8CFC0] bg-[#FAF6EE] focus:bg-white focus:border-[#D97706] focus:outline-none min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Upload Foto (Canvas 400x400 q=0.75) + Pratinjau + Opsi "Ini Saya" */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#E6DFD3] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1D3A]">Foto Profil</span>
                <div className="inline-flex p-0.5 rounded-lg bg-white border border-[#D8CFC0]">
                  <button
                    type="button"
                    onClick={() => setPhotoMode('upload')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md cursor-pointer ${
                      photoMode === 'upload'
                        ? 'bg-[#0B1D3A] text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('url')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md cursor-pointer ${
                      photoMode === 'url'
                        ? 'bg-[#0B1D3A] text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    URL Foto
                  </button>
                </div>
              </div>

              {/* Pratinjau Avatar / Badge Inisial Oranye */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-[#E6DFD3]">
                {fotoData ? (
                  <img
                    src={fotoData}
                    alt={nama || 'Preview'}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D97706] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white font-editorial font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
                    {previewInitials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-editorial font-semibold text-sm text-[#0B1D3A] truncate">
                    {nama || 'Nama Anggota'}
                  </p>
                  <p className="text-xs text-[#D97706] font-medium truncate">
                    {peran} {minat ? `· ${minat}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {ultahRaw ? `Ultah: ${formatBirthdayIndonesian(ultahRaw)}` : 'Tanggal ultah belum diisi'}
                  </p>
                </div>

                {fotoData && (
                  <button
                    type="button"
                    onClick={() => {
                      setFotoData('');
                      setPhotoInfo('');
                    }}
                    title="Hapus foto dan gunakan inisial oranye"
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {photoMode === 'upload' ? (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#D97706]/50 rounded-xl bg-white hover:border-[#D97706] transition-colors cursor-pointer text-center space-y-1">
                  <Upload className="w-5 h-5 text-[#D97706]" />
                  <span className="text-xs font-semibold text-[#0B1D3A]">
                    {compressing ? 'Mengompres gambar...' : 'Pilih Foto dari Perangkat'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Otomatis dikompres via Canvas maks 400×400px (kualitas 0.75) &amp; diunggah ke Database
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <input
                  type="url"
                  value={fotoData}
                  onChange={(e) => {
                    setFotoData(e.target.value);
                    setPhotoInfo('Menggunakan tautan URL gambar');
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D8CFC0] bg-white focus:border-[#D97706] focus:outline-none min-h-[40px]"
                />
              )}

              {photoInfo && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ {photoInfo}
                </p>
              )}
            </div>

            {/* Toggle "Ini Saya" */}
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 cursor-pointer">
              <input
                type="checkbox"
                checked={isMe}
                onChange={(e) => setIsMe(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#0B1D3A] rounded cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#0B1D3A] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Tandai "Ini Saya" di Perangkat Ini</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Menyimpan profil ini sebagai pengguna aktif di perangkat Anda untuk fitur sapaan &amp; pop-up ulang tahun otomatis.
                </p>
              </div>
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Action Buttons: Simpan ke Database & Salin JSON */}
        <div className="pt-2 border-t border-[#EFE9DC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              disabled={savingDb || compressing}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B1D3A] hover:bg-[#142d59] disabled:opacity-60 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>{savingDb ? 'Menyimpan ke Database...' : 'Simpan Profil ke Database'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-amber-100/80 text-[#0B1D3A] border border-[#D8CFC0] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">JSON Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D97706]" />
                  <span>Salin JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowJsonPreview((prev) => !prev)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#0B1D3A] hover:bg-[#FAF6EE] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>{showJsonPreview ? 'Sembunyikan JSON' : 'Lihat JSON'}</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Tutup Panel
            </button>
          )}
        </div>

        {showJsonPreview && (
          <div className="p-4 rounded-2xl bg-[#0B1D3A] text-amber-200 font-mono text-xs overflow-x-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-300 border-b border-white/10 pb-1.5">
              <span>Data JSON Anggota</span>
            </div>
            <pre className="leading-relaxed">{JSON.stringify(buildPayloadObject(), null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
}
