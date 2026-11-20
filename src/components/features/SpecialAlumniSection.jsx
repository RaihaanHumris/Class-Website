import React, { useState, useEffect, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { sahabatPindah } from '../../data/anggota';
import { getInitials } from '../../utils/helpers';
import {
  getMergedMembers,
  syncMembersFromDatabase,
} from '../../utils/memberStorage';
import {
  fetchApprovedMemberPhotos,
  isSupabaseConfigured,
} from '../../lib/supabase';

export default function SpecialAlumniSection({
  members,
  approvedPhotos,
}) {
  const [internalMembers, setInternalMembers] = useState(() =>
    getMergedMembers().filter((m) => m.status === 'pindah')
  );
  const [internalPhotos, setInternalPhotos] = useState({});
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const loadPhotos = () => {
      if (!isSupabaseConfigured) return;
      fetchApprovedMemberPhotos()
        .then((map) => setInternalPhotos(map || {}))
        .catch(() => {});
    };

    const syncLocalAndDb = () => {
      const merged = getMergedMembers().filter((m) => m.status === 'pindah');
      if (merged.length > 0) {
        setInternalMembers(merged);
      }
      loadPhotos();
    };

    window.addEventListener('pplg3-members-updated', syncLocalAndDb);
    syncMembersFromDatabase();
    loadPhotos();

    return () =>
      window.removeEventListener('pplg3-members-updated', syncLocalAndDb);
  }, []);

  const effectiveApprovedPhotos = useMemo(
    () => ({
      ...internalPhotos,
      ...(approvedPhotos || {}),
    }),
    [internalPhotos, approvedPhotos]
  );

  const displayList = useMemo(() => {
    const baseList =
      Array.isArray(members) && members.length > 0
        ? members
        : internalMembers.length > 0
        ? internalMembers
        : sahabatPindah;

    return baseList.map((item) => {
      const internalMatch = internalMembers.find(
        (m) => Number(m.id) === Number(item.id)
      );
      return {
        ...item,
        ...(internalMatch || {}),
        foto: item.foto || internalMatch?.foto || '',
        bio: item.bio || internalMatch?.bio || '',
      };
    });
  }, [members, internalMembers]);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-14">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-[#FAF8F3] to-amber-100/60 border border-amber-300/70 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Heart className="w-4 h-4 text-amber-600" />
            <span>Penghormatan Khusus · Sahabat Seperjuangan</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#03045E] leading-tight">
            Pernah Melangkah Bersama Sebelum Pindah Sekolah
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed">
            Sebelum perjalanan membawa mereka ke sekolah baru, tiga sahabat kami ini pernah duduk di bangku yang sama, tertawa di ruang kelas PPLG 3, dan menjadi bagian penting dari awal cerita kami di MAKN Ende.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayList.map((sahabat, idx) => {
            const memberKey = `member-${String(sahabat.id).padStart(2, '0')}`;
            const candidatePhotos = [
              sahabat.foto,
              effectiveApprovedPhotos?.[memberKey]?.imageUrl,
              sahabat.fallbackFoto,
              effectiveApprovedPhotos?.[memberKey]?.fallbackImageUrl,
            ].filter(Boolean);
            const activePhoto = candidatePhotos.find(
              (url) => !failedImages[url]
            );

            return (
              <article
                key={sahabat.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-amber-200/90 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {activePhoto ? (
                        <img
                          src={activePhoto}
                          alt={sahabat.nama}
                          width="48"
                          height="48"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [activePhoto]: true,
                            }))
                          }
                          className="w-12 h-12 rounded-full object-cover object-[50%_20%] border-2 border-amber-600 ring-2 ring-amber-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B45309] to-[#9A3412] text-white font-editorial font-semibold text-base flex items-center justify-center shrink-0">
                          {getInitials(sahabat.nama)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-amber-800 block tabular-nums">
                          Kenangan #{String(idx + 1).padStart(2, '0')} · {sahabat.periode || 'Masa Awal PPLG 3'}
                        </span>
                        <h3 className="font-editorial font-semibold text-base sm:text-lg text-[#03045E] leading-snug">
                          {sahabat.nama}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    “{sahabat.bio || sahabat.catatanKenangan}”
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-800 font-medium">
                  <span>Selalu Bagian dari XII PPLG 3</span>
                  <span className="font-mono text-[11px] text-amber-700">MAKN Ende</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
