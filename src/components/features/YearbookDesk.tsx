import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  LayoutGrid,
  Upload,
  Crown,
  Star,
  Sparkles,
  Heart,
  Target,
  Instagram,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import {
  classMembers,
  sequentialMemberOrder,
  DESK_WIDTH,
  DESK_HEIGHT,
  ClassMember,
} from '../../data/classMembers';
import {
  isSupabaseConfigured,
  fetchApprovedMemberPhotos,
  submitMemberPhoto,
} from '../../lib/supabase';

const PENDING_CACHE_KEY = 'pplg3_pending_member_photos_v1';

interface ApprovedPhotoEntry {
  rowId: string;
  imageUrl: string;
  caption?: string;
  approvedAt?: string;
}

interface PendingLocalEntry {
  imageUrl: string;
  pengirim: string;
  submittedAt: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
}

function readPendingCache(): Record<string, PendingLocalEntry> {
  try {
    const raw = localStorage.getItem(PENDING_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePendingCache(data: Record<string, PendingLocalEntry>) {
  try {
    localStorage.setItem(PENDING_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota issues
  }
}

interface StringEdge {
  from: string;
  to: string;
  tier: 'hub' | 'special' | 'chain' | 'cross';
}

const STRING_EDGES: StringEdge[] = [
  // Centerpiece Wali Kelas -> Murid Spesial & jangkar utama kelas
  { from: 'member-wali', to: 'member-23', tier: 'hub' },
  { from: 'member-wali', to: 'member-24', tier: 'hub' },
  { from: 'member-wali', to: 'member-25', tier: 'hub' },
  { from: 'member-wali', to: 'member-01', tier: 'hub' },
  { from: 'member-wali', to: 'member-08', tier: 'hub' },
  { from: 'member-wali', to: 'member-17', tier: 'hub' },
  { from: 'member-wali', to: 'member-22', tier: 'hub' },

  // Ikatan antar 3 Murid Spesial (#23 - #25) & sambungan ke barisan reguler
  { from: 'member-23', to: 'member-24', tier: 'special' },
  { from: 'member-24', to: 'member-25', tier: 'special' },
  { from: 'member-23', to: 'member-02', tier: 'special' },
  { from: 'member-23', to: 'member-03', tier: 'special' },
  { from: 'member-24', to: 'member-04', tier: 'special' },
  { from: 'member-24', to: 'member-05', tier: 'special' },
  { from: 'member-25', to: 'member-06', tier: 'special' },
  { from: 'member-25', to: 'member-07', tier: 'special' },

  // Rantai utama urut absen #01 -> #22
  { from: 'member-01', to: 'member-02', tier: 'chain' },
  { from: 'member-02', to: 'member-03', tier: 'chain' },
  { from: 'member-03', to: 'member-04', tier: 'chain' },
  { from: 'member-04', to: 'member-05', tier: 'chain' },
  { from: 'member-05', to: 'member-06', tier: 'chain' },
  { from: 'member-06', to: 'member-07', tier: 'chain' },
  { from: 'member-07', to: 'member-08', tier: 'chain' },
  { from: 'member-08', to: 'member-09', tier: 'chain' },
  { from: 'member-09', to: 'member-10', tier: 'chain' },
  { from: 'member-10', to: 'member-11', tier: 'chain' },
  { from: 'member-11', to: 'member-12', tier: 'chain' },
  { from: 'member-12', to: 'member-13', tier: 'chain' },
  { from: 'member-13', to: 'member-14', tier: 'chain' },
  { from: 'member-14', to: 'member-15', tier: 'chain' },
  { from: 'member-15', to: 'member-16', tier: 'chain' },
  { from: 'member-16', to: 'member-17', tier: 'chain' },
  { from: 'member-17', to: 'member-18', tier: 'chain' },
  { from: 'member-18', to: 'member-19', tier: 'chain' },
  { from: 'member-19', to: 'member-20', tier: 'chain' },
  { from: 'member-20', to: 'member-21', tier: 'chain' },
  { from: 'member-21', to: 'member-22', tier: 'chain' },

  // Anyaman tali silang antar baris meja agar terasa saling terhubung erat
  { from: 'member-01', to: 'member-09', tier: 'cross' },
  { from: 'member-03', to: 'member-11', tier: 'cross' },
  { from: 'member-05', to: 'member-13', tier: 'cross' },
  { from: 'member-07', to: 'member-15', tier: 'cross' },
  { from: 'member-08', to: 'member-16', tier: 'cross' },
  { from: 'member-10', to: 'member-17', tier: 'cross' },
  { from: 'member-12', to: 'member-19', tier: 'cross' },
  { from: 'member-14', to: 'member-21', tier: 'cross' },
  { from: 'member-15', to: 'member-22', tier: 'cross' },
];

function getMemberPinCoords(member: ClassMember): { x: number; y: number } {
  const dy =
    member.category === 'homeroom_teacher'
      ? -166
      : member.category === 'special'
      ? -152
      : -136;
  const rad = (member.rotate * Math.PI) / 180;
  return {
    x: member.x - dy * Math.sin(rad),
    y: member.y + dy * Math.cos(rad),
  };
}

interface PolaroidCardProps {
  member: ClassMember;
  approvedPhoto?: ApprovedPhotoEntry;
  pendingLocal?: PendingLocalEntry;
  isFocused: boolean;
  isAnyFocused: boolean;
  isFlipped: boolean;
  onCardClick: (member: ClassMember) => void;
  onOpenUpload: (member: ClassMember) => void;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({
  member,
  approvedPhoto,
  pendingLocal,
  isFocused,
  isAnyFocused,
  isFlipped,
  onCardClick,
  onOpenUpload,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const effectivePhotoUrl =
    approvedPhoto?.imageUrl || member.photoUrl || pendingLocal?.imageUrl || '';
  const isPendingOnly = !approvedPhoto?.imageUrl && !member.photoUrl && Boolean(pendingLocal?.imageUrl);
  const showImage = Boolean(effectivePhotoUrl) && !imgFailed;

  useEffect(() => {
    setImgFailed(false);
  }, [effectivePhotoUrl]);

  // Dim cards when another card is focused; hide desk copy of focused card so native 1:1 overlay takes over crisply
  const dimOpacity = isFocused ? 0 : isAnyFocused ? 0.24 : 1;

  // Sizing & tier styles
  const isTeacher = member.category === 'homeroom_teacher';
  const isSpecial = member.category === 'special';

  const cardSizeClass = isTeacher
    ? 'w-[272px] h-[354px]'
    : isSpecial
    ? 'w-[250px] h-[324px]'
    : 'w-[226px] h-[292px]';

  const frontFrameClass = isTeacher
    ? 'bg-zinc-900 text-stone-100 border-2 border-emerald-400/80 shadow-[0_24px_55px_-12px_rgba(16,185,129,0.28)]'
    : isSpecial
    ? 'bg-zinc-900 text-stone-100 border-2 border-amber-400/75 shadow-[0_22px_48px_-12px_rgba(245,158,11,0.25)]'
    : 'bg-stone-100 text-zinc-900 border border-stone-300/90 shadow-[0_18px_36px_-10px_rgba(0,0,0,0.68)]';

  const backFrameClass = isTeacher
    ? 'bg-zinc-900 text-stone-100 border-2 border-emerald-400/80 shadow-[0_24px_55px_-12px_rgba(16,185,129,0.28)]'
    : isSpecial
    ? 'bg-zinc-900 text-stone-100 border-2 border-amber-400/75 shadow-[0_22px_48px_-12px_rgba(245,158,11,0.25)]'
    : 'bg-[#F5F1E8] text-zinc-900 border border-stone-300 shadow-[0_18px_36px_-10px_rgba(0,0,0,0.68)]';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: member.x,
        top: member.y,
        marginLeft: isTeacher ? -136 : isSpecial ? -125 : -113,
        marginTop: isTeacher ? -177 : isSpecial ? -162 : -146,
        zIndex: isFocused ? 50 : isTeacher ? 20 : isSpecial ? 15 : 10,
        perspective: 1200,
        pointerEvents: isFocused ? 'none' : 'auto',
      }}
      animate={{
        rotate: member.rotate,
        opacity: dimOpacity,
        scale: 1,
      }}
      whileHover={
        !isAnyFocused
          ? {
              scale: 1.05,
              y: -6,
              transition: { type: 'spring', stiffness: 320, damping: 22 },
            }
          : undefined
      }
      transition={{
        type: 'spring',
        stiffness: 210,
        damping: 26,
      }}
      className={`${cardSizeClass} select-none`}
    >
      {/* Inner 3D Flipper */}
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          onCardClick(member);
        }}
        animate={{
          rotateY: isFocused && isFlipped ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 22,
        }}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
        }}
        className="relative cursor-pointer"
      >
        {/* ================= FRONT FACE ================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFocused && isFlipped ? 'none' : 'auto',
          }}
          className={`absolute inset-0 rounded-sm p-3 pb-3.5 flex flex-col justify-between ${frontFrameClass} ${
            isFocused ? 'ring-2 ring-white/30' : ''
          }`}
        >
          {/* Realistic 3D Pushpin anchoring the white thread */}
          <div
            aria-hidden="true"
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full bg-black/55 blur-[1.5px] translate-y-1 translate-x-0.5 absolute" />
            <div
              className={`relative w-3.5 h-3.5 rounded-full border shadow-md flex items-center justify-center ${
                isTeacher
                  ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border-emerald-200/80'
                  : isSpecial
                  ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-amber-100/80'
                  : 'bg-gradient-to-br from-white via-stone-200 to-stone-500 border-white/90'
              }`}
            >
              <span className="w-1 h-1 rounded-full bg-white/80 -translate-x-[1px] -translate-y-[1px]" />
            </div>
          </div>

          {/* Top Hierarchy Badge & Photo Box */}
          <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Corner Badge */}
            <div className="shrink-0 flex items-center justify-between gap-1.5 mb-2">
              {isTeacher ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 whitespace-nowrap">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>WALI KELAS</span>
                </span>
              ) : isSpecial ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/45 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{member.badgeLabel} MURID SPESIAL</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-900 text-stone-100 tracking-tight">
                  {member.badgeLabel}
                </span>
              )}

              {isPendingOnly && (
                <span
                  title="Menunggu Apply Admin"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-400/40 whitespace-nowrap"
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>Pending</span>
                </span>
              )}
            </div>

            {/* Portrait Window */}
            <div
              className={`relative w-full flex-1 min-h-0 overflow-hidden rounded-[2px] ${
                isTeacher || isSpecial
                  ? 'bg-zinc-800 border border-white/10'
                  : 'bg-zinc-200 border border-stone-300'
              }`}
            >
              {showImage ? (
                <>
                  <img
                    src={effectivePhotoUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover object-[50%_20%] ${
                      isPendingOnly ? 'opacity-80' : ''
                    }`}
                  />
                  {isPendingOnly && (
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-zinc-950/85 px-2 py-1 text-[9px] text-amber-300 font-medium text-center">
                      Menunggu Apply Admin
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center px-3 text-center gap-2 ${
                    isTeacher
                      ? 'bg-gradient-to-br from-emerald-950/90 via-zinc-900 to-zinc-950 text-emerald-200'
                      : isSpecial
                      ? 'bg-gradient-to-br from-amber-950/75 via-zinc-900 to-zinc-950 text-amber-200'
                      : 'bg-gradient-to-br from-stone-200 via-stone-300/70 to-stone-200 text-zinc-700'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-editorial font-bold text-lg tracking-wide border ${
                      isTeacher
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                        : isSpecial
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                        : 'bg-white/80 border-stone-400/50 text-zinc-800'
                    }`}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold opacity-80">
                      Foto Polaroid Kosong
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUpload(member);
                      }}
                      className={`mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        isTeacher
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40'
                          : isSpecial
                          ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 border border-amber-400/40'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-stone-100'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>Upload Foto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Polaroid Caption Strip */}
          <div className="shrink-0 pt-2.5 px-0.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`font-editorial font-semibold leading-tight truncate ${
                  isTeacher ? 'text-[15px] text-white' : isSpecial ? 'text-[14px] text-amber-50' : 'text-[13px] text-zinc-900'
                }`}
              >
                {member.name}
              </p>
              <p
                className={`text-[10px] truncate mt-0.5 ${
                  isTeacher
                    ? 'text-emerald-300/90'
                    : isSpecial
                    ? 'text-amber-300/90'
                    : 'text-zinc-600'
                }`}
              >
                {member.role}
              </p>
            </div>
            {isFocused && (
              <span
                className={`shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isTeacher || isSpecial
                    ? 'bg-white/10 text-stone-300'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                Klik Balik
              </span>
            )}
          </div>
        </div>

        {/* ================= BACK FACE (3D FLIP) ================= */}
        <div
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFocused && isFlipped ? 'auto' : 'none',
          }}
          className={`absolute inset-0 rounded-sm p-3.5 flex flex-col justify-between overflow-hidden ${backFrameClass}`}
        >
          <div className="space-y-2 overflow-y-auto scrollbar-none pr-0.5">
            {/* Back Header */}
            <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-current/15">
              <div className="min-w-0">
                <span
                  className={`inline-block font-mono text-[9px] font-bold uppercase tracking-wider ${
                    isTeacher
                      ? 'text-emerald-300'
                      : isSpecial
                      ? 'text-amber-300'
                      : 'text-zinc-500'
                  }`}
                >
                  {isTeacher
                    ? '👑 WALI KELAS · CENTERPIECE'
                    : isSpecial
                    ? `★ ${member.badgeLabel} · MURID SPESIAL`
                    : `${member.badgeLabel} · XII PPLG 3`}
                </span>
                <h4 className="font-editorial font-semibold text-sm leading-snug mt-0.5 truncate">
                  {member.name}
                </h4>
              </div>
              <RotateCw className="w-3.5 h-3.5 opacity-60 shrink-0 mt-1" />
            </div>

            {isTeacher ? (
              /* Wali Kelas Back Content */
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-mono text-emerald-300/90 flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>Pembinaan &amp; Peran</span>
                  </p>
                  <p className="text-stone-200 mt-0.5">{member.subject}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-mono text-emerald-300/90">
                    Pesan &amp; Nasihat
                  </p>
                  <p className="italic text-stone-100 mt-0.5">“{member.quote}”</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-mono text-amber-300/90 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" />
                    <span>Ucapan Terima Kasih Kelas</span>
                  </p>
                  <p className="text-stone-300 mt-0.5">{member.thanksMessage}</p>
                </div>
              </div>
            ) : (
              /* Student Back Content (Regular & Special) */
              <div className="space-y-2 text-[10.5px] leading-relaxed">
                <div
                  className={`p-2 rounded border ${
                    isSpecial
                      ? 'bg-amber-500/10 border-amber-400/30 text-amber-100'
                      : 'bg-white/75 border-stone-300/80 text-zinc-800'
                  }`}
                >
                  <p className="italic">“{member.quote}”</p>
                </div>

                <div>
                  <p
                    className={`text-[9px] uppercase tracking-wider font-mono flex items-center gap-1 ${
                      isSpecial ? 'text-amber-300' : 'text-zinc-500'
                    }`}
                  >
                    <Target className="w-2.5 h-2.5" />
                    <span>Cita-cita</span>
                  </p>
                  <p className={isSpecial ? 'text-stone-100 font-medium' : 'text-zinc-900 font-medium'}>
                    {member.futureGoal}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-[9px] uppercase tracking-wider font-mono flex items-center gap-1 ${
                      isSpecial ? 'text-amber-300' : 'text-zinc-500'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Kenangan Favorit</span>
                  </p>
                  <p className={isSpecial ? 'text-stone-300' : 'text-zinc-700'}>
                    {member.favoriteMemory}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Back Footer Actions */}
          <div className="pt-2 border-t border-current/15 flex items-center justify-between gap-2 text-[10px]">
            {member.instagram ? (
              <span
                className={`inline-flex items-center gap-1 font-mono truncate ${
                  isSpecial ? 'text-amber-300' : 'text-zinc-700'
                }`}
              >
                <Instagram className="w-3 h-3 shrink-0" />
                <span className="truncate">{member.instagram}</span>
              </span>
            ) : (
              <span className="font-mono text-emerald-300/90 text-[9px]">
                MAKN Ende · 2023–2026
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpload(member);
              }}
              className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded font-semibold cursor-pointer transition-colors ${
                isTeacher
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200'
                  : isSpecial
                  ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-stone-100'
              }`}
            >
              <Upload className="w-2.5 h-2.5" />
              <span>{approvedPhoto ? 'Ganti' : 'Foto'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface FocusedPolaroidCardProps {
  member: ClassMember;
  approvedPhoto?: ApprovedPhotoEntry;
  pendingLocal?: PendingLocalEntry;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onOpenUpload: (member: ClassMember) => void;
}

const FocusedPolaroidCard: React.FC<FocusedPolaroidCardProps> = ({
  member,
  approvedPhoto,
  pendingLocal,
  isFlipped,
  onToggleFlip,
  onOpenUpload,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const effectivePhotoUrl =
    approvedPhoto?.imageUrl || member.photoUrl || pendingLocal?.imageUrl || '';
  const isPendingOnly =
    !approvedPhoto?.imageUrl && !member.photoUrl && Boolean(pendingLocal?.imageUrl);
  const showImage = Boolean(effectivePhotoUrl) && !imgFailed;

  useEffect(() => {
    setImgFailed(false);
  }, [effectivePhotoUrl, member.id]);

  const isTeacher = member.category === 'homeroom_teacher';
  const isSpecial = member.category === 'special';

  const frontFrameClass = isTeacher
    ? 'bg-zinc-900 text-stone-100 border-2 border-emerald-400/85 shadow-[0_30px_70px_-12px_rgba(16,185,129,0.34)]'
    : isSpecial
    ? 'bg-zinc-900 text-stone-100 border-2 border-amber-400/80 shadow-[0_28px_65px_-12px_rgba(245,158,11,0.3)]'
    : 'bg-stone-100 text-zinc-900 border border-stone-300 shadow-[0_28px_65px_-12px_rgba(0,0,0,0.8)]';

  const backFrameClass = isTeacher
    ? 'bg-zinc-900 text-stone-100 border-2 border-emerald-400/85 shadow-[0_30px_70px_-12px_rgba(16,185,129,0.34)]'
    : isSpecial
    ? 'bg-zinc-900 text-stone-100 border-2 border-amber-400/80 shadow-[0_28px_65px_-12px_rgba(245,158,11,0.3)]'
    : 'bg-[#F5F1E8] text-zinc-900 border border-stone-300 shadow-[0_28px_65px_-12px_rgba(0,0,0,0.8)]';

  return (
    <motion.div
      key={member.id}
      initial={{ opacity: 0.5, scale: 0.78, rotate: member.rotate }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: member.rotate }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      style={{ perspective: 1400 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFlip();
      }}
      className="pointer-events-auto w-[326px] sm:w-[376px] h-[438px] sm:h-[492px] max-h-full select-none cursor-pointer antialiased"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 185, damping: 23 }}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
        }}
        className="relative"
      >
        {/* ================= NATIVE 1:1 FRONT FACE ================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
          className={`absolute inset-0 rounded-md p-4 pb-5 flex flex-col justify-between ${frontFrameClass}`}
        >
          {/* Top 3D Pushpin */}
          <div
            aria-hidden="true"
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-black/60 blur-[2px] translate-y-1 translate-x-0.5 absolute" />
            <div
              className={`relative w-4 h-4 rounded-full border shadow-md flex items-center justify-center ${
                isTeacher
                  ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border-emerald-200/80'
                  : isSpecial
                  ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-amber-100/80'
                  : 'bg-gradient-to-br from-white via-stone-200 to-stone-500 border-white/90'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/85 -translate-x-[1px] -translate-y-[1px]" />
            </div>
          </div>

          <div className="relative flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              {isTeacher ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/45 whitespace-nowrap">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>WALI KELAS</span>
                </span>
              ) : isSpecial ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/45 whitespace-nowrap">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{member.badgeLabel} MURID SPESIAL</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-bold bg-zinc-900 text-stone-100 tracking-tight">
                  {member.badgeLabel}
                </span>
              )}

              {isPendingOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-400/40 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  <span>Pending Apply</span>
                </span>
              )}
            </div>

            <div
              className={`relative w-full flex-1 min-h-0 overflow-hidden rounded-[3px] ${
                isTeacher || isSpecial
                  ? 'bg-zinc-800 border border-white/10'
                  : 'bg-zinc-200 border border-stone-300'
              }`}
            >
              {showImage ? (
                <>
                  <img
                    src={effectivePhotoUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover object-[50%_20%] ${
                      isPendingOnly ? 'opacity-85' : ''
                    }`}
                  />
                  {isPendingOnly && (
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-zinc-950/90 px-3 py-1.5 text-[11px] text-amber-300 font-medium text-center">
                      Menunggu Persetujuan Admin
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center px-5 text-center gap-3 ${
                    isTeacher
                      ? 'bg-gradient-to-br from-emerald-950/90 via-zinc-900 to-zinc-950 text-emerald-200'
                      : isSpecial
                      ? 'bg-gradient-to-br from-amber-950/75 via-zinc-900 to-zinc-950 text-amber-200'
                      : 'bg-gradient-to-br from-stone-200 via-stone-300/70 to-stone-200 text-zinc-700'
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center font-editorial font-bold text-2xl tracking-wide border ${
                      isTeacher
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                        : isSpecial
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                        : 'bg-white/85 border-stone-400/50 text-zinc-800'
                    }`}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold opacity-85">
                      Foto Polaroid Belum Terpasang
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUpload(member);
                      }}
                      className={`mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isTeacher
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40'
                          : isSpecial
                          ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 border border-amber-400/40'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-stone-100'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Foto Profil</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 pt-3.5 px-0.5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`font-editorial font-semibold leading-tight truncate ${
                  isTeacher ? 'text-xl text-white' : isSpecial ? 'text-lg text-amber-50' : 'text-lg text-zinc-900'
                }`}
              >
                {member.name}
              </p>
              <p
                className={`text-xs truncate mt-0.5 ${
                  isTeacher
                    ? 'text-emerald-300/95'
                    : isSpecial
                    ? 'text-amber-300/95'
                    : 'text-zinc-600'
                }`}
              >
                {member.role}
              </p>
            </div>
            <span
              className={`shrink-0 text-[11px] font-mono px-2.5 py-1 rounded ${
                isTeacher || isSpecial
                  ? 'bg-white/10 text-stone-200'
                  : 'bg-zinc-200/90 text-zinc-700'
              }`}
            >
              Klik Balik
            </span>
          </div>
        </div>

        {/* ================= NATIVE 1:1 BACK FACE (CRISP & FULL TEXT) ================= */}
        <div
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
          className={`absolute inset-0 rounded-md p-5 flex flex-col justify-between overflow-hidden ${backFrameClass}`}
        >
          <div className="space-y-3 overflow-y-auto scrollbar-none pr-1">
            {/* Back Header */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-current/15">
              <div className="min-w-0">
                <span
                  className={`inline-block font-mono text-[11px] font-bold uppercase tracking-wider ${
                    isTeacher
                      ? 'text-emerald-300'
                      : isSpecial
                      ? 'text-amber-300'
                      : 'text-zinc-500'
                  }`}
                >
                  {isTeacher
                    ? '👑 WALI KELAS · CENTERPIECE'
                    : isSpecial
                    ? `★ ${member.badgeLabel} · MURID SPESIAL`
                    : `${member.badgeLabel} · XII PPLG 3`}
                </span>
                <h4 className="font-editorial font-semibold text-xl leading-snug mt-0.5">
                  {member.name}
                </h4>
                <p
                  className={`text-xs mt-0.5 ${
                    isTeacher
                      ? 'text-emerald-300/90'
                      : isSpecial
                      ? 'text-amber-300/90'
                      : 'text-zinc-600'
                  }`}
                >
                  {member.role}
                </p>
              </div>
              <RotateCw className="w-4 h-4 opacity-60 shrink-0 mt-1" />
            </div>

            {isTeacher ? (
              <div className="space-y-3 text-[13px] leading-relaxed">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Pembinaan &amp; Peran</span>
                  </p>
                  <p className="text-stone-100 mt-1 font-medium">{member.subject}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/25">
                  <p className="text-[10px] uppercase tracking-wider font-mono text-emerald-300 mb-1">
                    Pesan &amp; Nasihat
                  </p>
                  <p className="italic text-stone-100">“{member.quote}”</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-mono text-amber-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Ucapan Terima Kasih Kelas</span>
                  </p>
                  <p className="text-stone-200 mt-1">{member.thanksMessage}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-[13px] leading-relaxed">
                <div
                  className={`p-3 rounded-lg border ${
                    isSpecial
                      ? 'bg-amber-500/10 border-amber-400/30 text-amber-50'
                      : 'bg-white/85 border-stone-300/90 text-zinc-800'
                  }`}
                >
                  <p className="italic">“{member.quote}”</p>
                </div>

                <div>
                  <p
                    className={`text-[10px] uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                      isSpecial ? 'text-amber-300' : 'text-zinc-500'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Cita-cita</span>
                  </p>
                  <p
                    className={`mt-0.5 font-semibold ${
                      isSpecial ? 'text-stone-100' : 'text-zinc-900'
                    }`}
                  >
                    {member.futureGoal}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-[10px] uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                      isSpecial ? 'text-amber-300' : 'text-zinc-500'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kenangan Favorit</span>
                  </p>
                  <p className={`mt-0.5 ${isSpecial ? 'text-stone-200' : 'text-zinc-700'}`}>
                    {member.favoriteMemory}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 mt-2 border-t border-current/15 flex items-center justify-between gap-2 text-xs">
            {member.instagram ? (
              <span
                className={`inline-flex items-center gap-1.5 font-mono truncate ${
                  isSpecial ? 'text-amber-300' : 'text-zinc-700'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{member.instagram}</span>
              </span>
            ) : (
              <span className="font-mono text-emerald-300/90 text-[11px]">
                MAKN Ende · 2023–2026
              </span>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpload(member);
              }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                isTeacher
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200'
                  : isSpecial
                  ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-stone-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{approvedPhoto ? 'Ganti Foto' : 'Upload Foto'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function YearbookDesk() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 720 });

  // Approved photos from Supabase + local pending fallback feedback
  const [approvedPhotos, setApprovedPhotos] = useState<Record<string, ApprovedPhotoEntry>>({});
  const [pendingCache, setPendingCache] = useState<Record<string, PendingLocalEntry>>(() =>
    readPendingCache()
  );

  // Desk Navigation State
  const [focusedMemberId, setFocusedMemberId] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Overview pan & zoom state (desk coordinate centered on viewport)
  const [overviewCenter, setOverviewCenter] = useState({
    x: DESK_WIDTH / 2,
    y: DESK_HEIGHT / 2,
  });
  const [manualZoomMultiplier, setManualZoomMultiplier] = useState(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Photo Upload Modal state
  const [uploadTarget, setUploadTarget] = useState<ClassMember | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');
  const [uploadSender, setUploadSender] = useState('');
  const [uploadNote, setUploadNote] = useState('');
  const [submittingUpload, setSubmittingUpload] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // Pointer Drag tracking (ref avoids stale closures & clicks after drag)
  const dragStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startCenterX: DESK_WIDTH / 2,
    startCenterY: DESK_HEIGHT / 2,
    didDrag: false,
  });
  const [isDraggingDesk, setIsDraggingDesk] = useState(false);

  // Measure desk viewport container
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Load approved member portrait photos from Supabase
  const refreshMemberPhotos = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const map = await fetchApprovedMemberPhotos();
      setApprovedPhotos(map);
      // Clear local pending entry once approved version arrives from Supabase
      setPendingCache((prev) => {
        let changed = false;
        const next = { ...prev };
        Object.keys(map).forEach((k) => {
          if (next[k]) {
            delete next[k];
            changed = true;
          }
        });
        if (changed) writePendingCache(next);
        return changed ? next : prev;
      });
    } catch {
      // silent fallback to empty placeholders
    }
  }, []);

  useEffect(() => {
    refreshMemberPhotos();
  }, [refreshMemberPhotos]);

  // Fit-to-viewport base scale for overview mode
  const baseOverviewScale = useMemo(() => {
    const scaleX = (viewportSize.width - 32) / DESK_WIDTH;
    const scaleY = (viewportSize.height - 96) / DESK_HEIGHT;
    return Math.max(0.24, Math.min(0.85, Math.min(scaleX, scaleY)));
  }, [viewportSize]);

  const overviewScale = Math.min(1.15, Math.max(0.22, baseOverviewScale * manualZoomMultiplier));

  const focusScale = useMemo(() => {
    const availW = viewportSize.width - 48;
    const availH = viewportSize.height - 196;
    return Math.max(0.75, Math.min(1.05, availW / 320, availH / 410));
  }, [viewportSize]);

  const focusedMember = useMemo(
    () => classMembers.find((m) => m.id === focusedMemberId) || null,
    [focusedMemberId]
  );

  const memberByKey = useMemo(() => {
    const map: Record<string, ClassMember> = {};
    classMembers.forEach((m) => {
      map[m.memberKey] = m;
    });
    return map;
  }, []);

  const renderedStrings = useMemo(() => {
    return STRING_EDGES.map((edge, idx) => {
      const fromM = memberByKey[edge.from];
      const toM = memberByKey[edge.to];
      if (!fromM || !toM) return null;
      const p1 = getMemberPinCoords(fromM);
      const p2 = getMemberPinCoords(toM);
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const sag = Math.min(72, Math.max(18, dist * 0.13));
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2 + sag;
      const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      const shadowD = `M ${p1.x.toFixed(1)} ${(p1.y + 7).toFixed(1)} Q ${cx.toFixed(1)} ${(cy + 9).toFixed(1)} ${p2.x.toFixed(1)} ${(p2.y + 7).toFixed(1)}`;
      return {
        id: `${edge.from}-${edge.to}-${idx}`,
        from: edge.from,
        to: edge.to,
        tier: edge.tier,
        d,
        shadowD,
      };
    }).filter(Boolean) as Array<{
      id: string;
      from: string;
      to: string;
      tier: StringEdge['tier'];
      d: string;
      shadowD: string;
    }>;
  }, [memberByKey]);

  const sequentialIndex = useMemo(() => {
    if (!focusedMember) return -1;
    return sequentialMemberOrder.findIndex((m) => m.id === focusedMember.id);
  }, [focusedMember]);

  // Camera target values
  const cameraScale = focusedMember ? focusScale : overviewScale;
  const cameraRotate = focusedMember ? -focusedMember.rotate : 0;
  const cameraTargetX = focusedMember ? focusedMember.x : overviewCenter.x;
  const cameraTargetY = focusedMember ? focusedMember.y : overviewCenter.y;

  // Navigation handlers
  const focusMember = useCallback((member: ClassMember) => {
    setFocusedMemberId(member.id);
    setIsFlipped(false);
    setSearchOpen(false);
  }, []);

  const exitFocus = useCallback(() => {
    setFocusedMemberId(null);
    setIsFlipped(false);
  }, []);

  const resetOverviewView = useCallback(() => {
    setFocusedMemberId(null);
    setIsFlipped(false);
    setManualZoomMultiplier(1);
    setOverviewCenter({ x: DESK_WIDTH / 2, y: DESK_HEIGHT / 2 });
  }, []);

  const stepSequential = useCallback(
    (delta: number) => {
      if (sequentialMemberOrder.length === 0) return;
      const currentIdx = sequentialIndex >= 0 ? sequentialIndex : 0;
      const nextIdx =
        (currentIdx + delta + sequentialMemberOrder.length) %
        sequentialMemberOrder.length;
      const nextMember = sequentialMemberOrder[nextIdx];
      if (nextMember) {
        setFocusedMemberId(nextMember.id);
        setIsFlipped(false);
      }
    },
    [sequentialIndex]
  );

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (uploadTarget) {
        if (e.key === 'Escape') setUploadTarget(null);
        return;
      }
      if (!focusedMember) return;

      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        exitFocus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepSequential(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepSequential(-1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedMember, uploadTarget, exitFocus, stepSequential]);

  // Card click behavior: zoom to card OR flip if already focused
  const handleCardClick = useCallback(
    (member: ClassMember) => {
      if (dragStateRef.current.didDrag) return;
      if (focusedMemberId === member.id) {
        setIsFlipped((prev) => !prev);
      } else {
        focusMember(member);
      }
    },
    [focusedMemberId, focusMember]
  );

  // Overview Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (focusedMember) return;
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    dragStateRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startCenterX: overviewCenter.x,
      startCenterY: overviewCenter.y,
      didDrag: false,
    };
    setIsDraggingDesk(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active || focusedMember) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragStateRef.current.didDrag = true;
    }
    const nextX = Math.max(
      140,
      Math.min(DESK_WIDTH - 140, dragStateRef.current.startCenterX - dx / overviewScale)
    );
    const nextY = Math.max(
      120,
      Math.min(DESK_HEIGHT - 120, dragStateRef.current.startCenterY - dy / overviewScale)
    );
    setOverviewCenter({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    dragStateRef.current.active = false;
    setIsDraggingDesk(false);
    setTimeout(() => {
      dragStateRef.current.didDrag = false;
    }, 60);
  };

  // Search filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const normalizedNum = q.replace(/^#0*/, '');
    return sequentialMemberOrder.filter((m) => {
      const nameMatch = m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q);
      const roleMatch = m.role.toLowerCase().includes(q) || m.minat.toLowerCase().includes(q);
      const badgeMatch = m.badgeLabel.toLowerCase().includes(q);
      const numMatch =
        m.attendanceNumber !== null &&
        normalizedNum.length > 0 &&
        String(m.attendanceNumber) === normalizedNum;
      return nameMatch || roleMatch || badgeMatch || numMatch;
    });
  }, [searchQuery]);

  // Photo Upload Modal Handlers
  const openUploadModal = useCallback((member: ClassMember) => {
    setUploadTarget(member);
    setUploadFile(null);
    setUploadPreviewUrl('');
    setUploadImageUrl('');
    setUploadSender(member.name);
    setUploadNote('');
    setUploadSuccessMsg('');
    setUploadErrorMsg('');
  }, []);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    if (file) {
      setUploadPreviewUrl(URL.createObjectURL(file));
    } else {
      setUploadPreviewUrl('');
    }
  };

  const handleSubmitMemberPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTarget) return;
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    if (!isSupabaseConfigured) {
      setUploadErrorMsg('Supabase belum dikonfigurasi pada environment ini.');
      return;
    }
    if (!uploadFile && !uploadImageUrl.trim()) {
      setUploadErrorMsg('Pilih file foto portrait atau masukkan tautan URL gambar.');
      return;
    }

    setSubmittingUpload(true);
    try {
      const saved = await submitMemberPhoto({
        memberKey: uploadTarget.memberKey,
        memberName: uploadTarget.name,
        badgeLabel: uploadTarget.badgeLabel,
        pengirimNama: uploadSender || uploadTarget.name,
        catatan:
          uploadNote.trim() ||
          `Pengajuan foto profil Polaroid untuk ${uploadTarget.name} (${uploadTarget.badgeLabel})`,
        file: uploadFile,
        imageUrl: uploadImageUrl,
      });

      const nextPending: Record<string, PendingLocalEntry> = {
        ...pendingCache,
        [uploadTarget.memberKey]: {
          imageUrl: saved.image_url,
          pengirim: saved.pengirim_nama,
          submittedAt: saved.created_at,
        },
      };
      setPendingCache(nextPending);
      writePendingCache(nextPending);

      setUploadSuccessMsg(
        'Foto berhasil dikirim! Menunggu Admin menyetujui (apply) di Panel Admin sebelum tampil resmi untuk semua anggota kelas.'
      );
      setUploadFile(null);
      setUploadImageUrl('');
    } catch (err: any) {
      setUploadErrorMsg(err?.message || 'Gagal mengunggah foto.');
    } finally {
      setSubmittingUpload(false);
    }
  };

  const uploadedPhotoCount = useMemo(() => {
    return classMembers.filter(
      (m) => Boolean(approvedPhotos[m.memberKey]?.imageUrl || m.photoUrl)
    ).length;
  }, [approvedPhotos]);

  const firstRegular = sequentialMemberOrder.find((m) => m.attendanceNumber === 1);
  const firstSpecial = sequentialMemberOrder.find((m) => m.category === 'special');
  const homeroomTeacher = sequentialMemberOrder.find(
    (m) => m.category === 'homeroom_teacher'
  );

  // Sequential position description
  const positionDescription = useMemo(() => {
    if (!focusedMember) return '';
    if (focusedMember.category === 'homeroom_teacher') {
      return `26 / 26 · 👑 Wali Kelas`;
    }
    if (focusedMember.category === 'special') {
      return `${sequentialIndex + 1} / 26 · ★ Murid Spesial ${focusedMember.badgeLabel}`;
    }
    return `${sequentialIndex + 1} / 26 · Absen ${focusedMember.badgeLabel}`;
  }, [focusedMember, sequentialIndex]);

  return (
    <div className="relative w-full bg-zinc-950 text-stone-100 overflow-hidden border-y border-white/10">
      {/* ================= TOP HEADER / SHORTCUTS BAR ================= */}
      <div className="relative z-30 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title & Count */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                  Meja Kenangan Digital
                </span>
                <span className="text-zinc-600" aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                  26 Profil ({uploadedPhotoCount} Foto Terpasang)
                </span>
              </div>
              <h2 className="font-editorial text-lg sm:text-xl font-semibold text-white">
                Polaroid Angkatan XII PPLG 3
              </h2>
            </div>
          </div>

          {/* Action Shortcuts + Search */}
          <div className="flex flex-wrap items-center gap-2">
            {firstRegular && (
              <button
                type="button"
                onClick={() => focusMember(firstRegular)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-white text-zinc-900 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <span className="font-mono font-bold">#01</span>
                <span>Mulai Urut Absen (#01)</span>
              </button>
            )}

            {firstSpecial && (
              <button
                type="button"
                onClick={() => focusMember(firstSpecial)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Murid Spesial (#23–25)</span>
              </button>
            )}

            {homeroomTeacher && (
              <button
                type="button"
                onClick={() => focusMember(homeroomTeacher)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Wali Kelas</span>
              </button>
            )}

            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-none sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    focusMember(searchResults[0]);
                  }
                }}
                placeholder="Cari nama atau #01..#25..."
                className="w-full min-h-[38px] pl-8 pr-8 py-1.5 rounded-lg bg-zinc-900 border border-white/15 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search Dropdown */}
              {searchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-2 w-72 max-h-72 overflow-y-auto rounded-xl bg-zinc-900 border border-white/15 shadow-2xl z-50 divide-y divide-white/5">
                  {searchResults.length === 0 ? (
                    <div className="p-3.5 text-xs text-zinc-400 text-center">
                      Tidak ditemukan profil dengan kata kunci tersebut.
                    </div>
                  ) : (
                    searchResults.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => focusMember(m)}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-white/10 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {m.role}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            m.category === 'homeroom_teacher'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : m.category === 'special'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-stone-100 text-zinc-900'
                          }`}
                        >
                          {m.badgeLabel}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= WOODEN DESK WORKBENCH STAGE ================= */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={() => {
          setSearchOpen(false);
          if (focusedMember && !dragStateRef.current.didDrag) {
            exitFocus();
          }
        }}
        style={{ touchAction: focusedMember ? 'auto' : 'none' }}
        className={`relative w-full h-[640px] sm:h-[700px] lg:h-[760px] overflow-hidden select-none bg-[#120c08] ${
          focusedMember
            ? 'cursor-zoom-out'
            : isDraggingDesk
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
      >
        {/* Ambient Studio Room Shadow Around the Desk */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(60, 39, 24, 0.38) 0%, rgba(18, 12, 8, 0.72) 60%, rgba(7, 5, 3, 0.96) 100%)',
          }}
        />

        {/* Centered Camera Pivot Origin at (50%, 50%) */}
        <div className="absolute left-1/2 top-1/2 w-0 h-0">
          <motion.div
            animate={{
              scale: cameraScale,
              rotate: cameraRotate,
            }}
            transition={{
              type: 'spring',
              stiffness: 165,
              damping: 24,
              mass: 0.9,
            }}
            style={{ transformOrigin: '0px 0px' }}
          >
            <motion.div
              animate={{
                x: -cameraTargetX,
                y: -cameraTargetY,
              }}
              transition={
                isDraggingDesk
                  ? { duration: 0 }
                  : {
                      type: 'spring',
                      stiffness: 165,
                      damping: 24,
                      mass: 0.9,
                    }
              }
              style={{
                width: DESK_WIDTH,
                height: DESK_HEIGHT,
                backgroundColor: '#241811',
                backgroundImage: [
                  'radial-gradient(ellipse at 50% 24%, rgba(255, 224, 178, 0.13) 0%, rgba(36, 24, 17, 0) 62%)',
                  'repeating-linear-gradient(180deg, rgba(255, 218, 185, 0.03) 0px, rgba(255, 218, 185, 0.03) 2px, transparent 2px, transparent 156px, rgba(0, 0, 0, 0.36) 156px, rgba(0, 0, 0, 0.36) 160px)',
                  'repeating-linear-gradient(90deg, rgba(255, 210, 165, 0.016) 0px, rgba(255, 210, 165, 0.016) 3px, rgba(0, 0, 0, 0.05) 3px, rgba(0, 0, 0, 0.05) 9px)',
                ].join(', '),
                boxShadow:
                  '0 50px 140px rgba(0,0,0,0.92), inset 0 0 180px rgba(0,0,0,0.68)',
              }}
              className="relative rounded-2xl border-[14px] border-[#180f0a] ring-1 ring-amber-200/10 overflow-hidden"
            >
              {/* Brass Desk Corner Accents */}
              <div aria-hidden="true" className="pointer-events-none">
                <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400/25 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400/25 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400/25 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400/25 rounded-br-lg" />
              </div>

              {/* Subtle Desk Mat / Engraved Zones */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-[28px] text-center pointer-events-none"
              >
                <span className="font-mono text-xs tracking-[0.28em] uppercase text-amber-200/55">
                  ★ Centerpiece · Wali Kelas XII PPLG 3 ★
                </span>
              </div>

              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-[382px] w-[1420px] h-[390px] rounded-3xl border border-amber-400/15 bg-amber-950/15 pointer-events-none flex justify-center pt-3"
              >
                <span className="font-mono text-xs tracking-[0.26em] uppercase text-amber-200/55">
                  ★ Zona Kehormatan · Murid Spesial Tak Terlupakan (#23 – #25) ★
                </span>
              </div>

              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-[798px] w-[2420px] h-[870px] rounded-3xl border border-amber-100/[0.08] bg-black/15 pointer-events-none flex justify-center pt-3"
              >
                <span className="font-mono text-xs tracking-[0.26em] uppercase text-stone-300/45">
                  Siswa Reguler XII PPLG 3 (Absen #01 – #22)
                </span>
              </div>

              {/* White Connecting Cotton Strings Layer (Tali Putih Antar Polaroid) */}
              <svg
                width={DESK_WIDTH}
                height={DESK_HEIGHT}
                viewBox={`0 0 ${DESK_WIDTH} ${DESK_HEIGHT}`}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 6 }}
              >
                {renderedStrings.map((edge) => {
                  const isConnectedToFocused =
                    focusedMember !== null &&
                    (edge.from === focusedMember.memberKey ||
                      edge.to === focusedMember.memberKey);
                  const stringOpacity =
                    focusedMember === null
                      ? edge.tier === 'hub'
                        ? 0.78
                        : edge.tier === 'special'
                        ? 0.72
                        : edge.tier === 'chain'
                        ? 0.65
                        : 0.42
                      : isConnectedToFocused
                      ? 0.96
                      : 0.12;

                  const strokeWidth = isConnectedToFocused
                    ? 3
                    : edge.tier === 'hub'
                    ? 2.4
                    : edge.tier === 'cross'
                    ? 1.7
                    : 2.1;

                  return (
                    <g
                      key={edge.id}
                      style={{
                        opacity: stringOpacity,
                        transition: 'opacity 280ms ease',
                      }}
                    >
                      {/* Cast Shadow of White String on Wood Surface */}
                      <path
                        d={edge.shadowD}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.58)"
                        strokeWidth={strokeWidth + 1.4}
                        strokeLinecap="round"
                      />
                      {/* Primary White Cotton Cord */}
                      <path
                        d={edge.d}
                        fill="none"
                        stroke={isConnectedToFocused ? '#FFFFFF' : '#F5F5F4'}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                      />
                      {/* Subtle Twine Fiber Highlight */}
                      <path
                        d={edge.d}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.65)"
                        strokeWidth={Math.max(0.8, strokeWidth * 0.4)}
                        strokeDasharray="6 5"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Render All 26 Polaroid Cards */}
              {classMembers.map((member) => (
                <PolaroidCard
                  key={member.id}
                  member={member}
                  approvedPhoto={approvedPhotos[member.memberKey]}
                  pendingLocal={pendingCache[member.memberKey]}
                  isFocused={focusedMemberId === member.id}
                  isAnyFocused={focusedMemberId !== null}
                  isFlipped={focusedMemberId === member.id && isFlipped}
                  onCardClick={handleCardClick}
                  onOpenUpload={openUploadModal}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Native 1:1 Crisp Focused Polaroid Stage (Zero CSS scale blur, full readable back) */}
        <div className="absolute inset-x-0 top-3 bottom-[84px] z-30 flex items-center justify-center pointer-events-none px-4">
          <AnimatePresence mode="wait">
            {focusedMember && (
              <FocusedPolaroidCard
                key={focusedMember.id}
                member={focusedMember}
                approvedPhoto={approvedPhotos[focusedMember.memberKey]}
                pendingLocal={pendingCache[focusedMember.memberKey]}
                isFlipped={isFlipped}
                onToggleFlip={() => setIsFlipped((prev) => !prev)}
                onOpenUpload={openUploadModal}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Overview Mode Helper Controls (Top Left & Bottom Right) */}
        {!focusedMember && (
          <>
            <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
              <span>Geser meja dengan mouse/sentuhan · Klik Polaroid mana saja untuk zoom fokus</span>
            </div>

            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-900/85 backdrop-blur-md border border-white/10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setManualZoomMultiplier((m) => Math.max(0.65, Number((m - 0.18).toFixed(2))));
                }}
                aria-label="Perkecil meja"
                className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-200 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetOverviewView();
                }}
                aria-label="Reset tampilan meja"
                className="px-2.5 h-9 rounded-lg hover:bg-white/10 flex items-center gap-1 text-xs font-mono text-zinc-200 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setManualZoomMultiplier((m) => Math.min(1.9, Number((m + 0.18).toFixed(2))));
                }}
                aria-label="Perbesar meja"
                className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-200 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ================= FOCUS MODE FLOATING GLASSMORPHISM BAR ================= */}
        <AnimatePresence>
          {focusedMember && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-3xl bg-zinc-900/85 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Left: Prev & Position */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepSequential(-1)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-stone-200 tabular-nums whitespace-nowrap">
                    {positionDescription}
                  </div>

                  <button
                    type="button"
                    onClick={() => stepSequential(1)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Flip, Upload Photo, Back to Desk */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      isFlipped
                        ? 'bg-cyan-500 text-zinc-950'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'Lihat Foto' : 'Balik Kartu'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openUploadModal(focusedMember)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/35 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {approvedPhotos[focusedMember.memberKey] ? 'Ganti Foto' : 'Upload Foto'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={exitFocus}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-white text-zinc-900 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Kembali ke Meja</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= STUDENT PHOTO UPLOAD MODAL ================= */}
      <AnimatePresence>
        {uploadTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setUploadTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/15 text-stone-100 shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    {uploadTarget.badgeLabel} · Kirim Foto Profil Polaroid
                  </span>
                  <h3 className="font-editorial text-lg font-semibold text-white">
                    {uploadTarget.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadTarget(null)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Tutup modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitMemberPhoto} className="p-5 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Unggah foto terbaikmu untuk bingkai Polaroid ini. Foto yang kamu kirim akan masuk ke antrean moderasi dan tampil resmi setelah disetujui (apply) oleh Admin kelas.
                </p>

                {/* Preview Box if chosen */}
                {(uploadPreviewUrl || uploadImageUrl.trim()) && (
                  <div className="w-36 aspect-[4/4.2] mx-auto rounded-lg overflow-hidden border border-white/20 bg-zinc-800">
                    <img
                      src={uploadPreviewUrl || uploadImageUrl.trim()}
                      alt="Pratinjau foto"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-200">
                    Pilih File Foto (JPG/PNG/WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFilePick}
                    className="w-full text-xs text-zinc-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">
                    Atau Tautan URL Foto
                  </label>
                  <input
                    type="url"
                    value={uploadImageUrl}
                    onChange={(e) => setUploadImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg bg-zinc-950 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">
                      Nama Pengirim
                    </label>
                    <input
                      type="text"
                      value={uploadSender}
                      onChange={(e) => setUploadSender(e.target.value)}
                      placeholder="Nama kamu"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg bg-zinc-950 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">
                      Catatan untuk Admin (opsional)
                    </label>
                    <input
                      type="text"
                      value={uploadNote}
                      onChange={(e) => setUploadNote(e.target.value)}
                      placeholder="Mis: Foto terbaru wisuda/seragam"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg bg-zinc-950 border border-white/15 focus:border-emerald-400 focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

                {uploadSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-xs text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {uploadErrorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/35 text-xs text-rose-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{uploadErrorMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadTarget(null)}
                    className="min-h-[42px] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={submittingUpload}
                    className="min-h-[42px] px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{submittingUpload ? 'Mengirim...' : 'Kirim ke Antrean Admin'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
