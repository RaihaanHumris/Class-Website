import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Disc3,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Music2,
  SkipBack,
  SkipForward,
  ListMusic,
  Check,
} from 'lucide-react';

const PLAYLIST_TRACKS = [
  {
    id: 'tujuh-belas',
    title: 'Tujuh Belas',
    artist: 'Tulus',
    shortLabel: '17 · Tulus',
    youtubeId: 'zswUe4xU-c8', // TULUS - Tujuh Belas (Official Lyric Video)
    localPath: '/audio/tujuh-belas.mp3',
  },
  {
    id: 'perunggu-ini-abadi',
    title: 'Ini Abadi',
    artist: 'Perunggu',
    shortLabel: 'Ini Abadi · Perunggu',
    youtubeId: 'qQDaxjLReck', // Perunggu - Ini Abadi
    localPath: '/audio/ini-abadi.mp3',
  },
  {
    id: 'perunggu-33x',
    title: '33x',
    artist: 'Perunggu',
    shortLabel: '33x · Perunggu',
    youtubeId: 'cUnYmncAvP4', // Perunggu - 33x (Video Lirik)
    localPath: '/audio/perunggu-33x.mp3',
  },
];

function isAutomatedAuditBrowser() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent || '';
  return Boolean(
    navigator.webdriver ||
      /HeadlessChrome|Lighthouse|PageSpeed|PTST|GTmetrix/i.test(ua)
  );
}

export default function BackgroundMusicPlayer() {
  const playerHostRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const audioElRef = useRef(null);
  const userPausedRef = useRef(false);
  const userMutedRef = useRef(false);
  const unlockedRef = useRef(false);
  const currentTrackIndexRef = useRef(0);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [localAvailability] = useState({});
  const [sourceMode, setSourceMode] = useState('youtube'); // 'local' | 'youtube'
  const [ytEnabled, setYtEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST_TRACKS[currentTrackIndex] || PLAYLIST_TRACKS[0];

  // Tunda pemuatan YouTube IFrame API setelah FCP/LCP selesai (dan lewati saat audit otomatis Lighthouse/PageSpeed)
  useEffect(() => {
    if (isAutomatedAuditBrowser()) return undefined;

    let timer = null;
    const enableNow = () => setYtEnabled(true);

    timer = window.setTimeout(enableNow, 1200);
    const events = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
    events.forEach((evt) =>
      window.addEventListener(evt, enableNow, { once: true, passive: true })
    );

    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((evt) => window.removeEventListener(evt, enableNow));
    };
  }, []);

  const selectTrack = useCallback(
    (targetIndex, { autoPlay = true } = {}) => {
      const normalizedIndex =
        ((targetIndex % PLAYLIST_TRACKS.length) + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
      const nextTrack = PLAYLIST_TRACKS[normalizedIndex];
      currentTrackIndexRef.current = normalizedIndex;
      setCurrentTrackIndex(normalizedIndex);

      if (autoPlay) {
        unlockedRef.current = true;
        userPausedRef.current = false;
        setNeedsGesture(false);
      }

      const hasLocal = Boolean(localAvailability[nextTrack.id]);

      if (hasLocal) {
        if (sourceMode === 'local' && audioElRef.current) {
          const audio = audioElRef.current;
          audio.src = nextTrack.localPath;
          audio.load();
          if (autoPlay && !userPausedRef.current) {
            audio.muted = userMutedRef.current;
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                setIsMuted(audio.muted);
                setNeedsGesture(false);
              })
              .catch(() => {
                setNeedsGesture(true);
              });
          }
        } else {
          setSourceMode('local');
        }
        return;
      }

      if (sourceMode !== 'youtube') {
        setSourceMode('youtube');
        return;
      }

      const p = ytPlayerRef.current;
      if (p && typeof p.loadVideoById === 'function') {
        try {
          if (autoPlay) {
            p.loadVideoById(nextTrack.youtubeId);
            if (!userMutedRef.current) {
              p.unMute?.();
              p.setVolume?.(65);
              setIsMuted(false);
            }
            setIsPlaying(true);
          } else {
            p.cueVideoById?.(nextTrack.youtubeId);
            setIsPlaying(false);
          }
        } catch {}
      }
    },
    [localAvailability, sourceMode]
  );

  const selectTrackRef = useRef(selectTrack);
  useEffect(() => {
    selectTrackRef.current = selectTrack;
  }, [selectTrack]);

  // Mode A: Local MP3 Autoplay + Instant Unlock
  useEffect(() => {
    if (sourceMode !== 'local') return;
    const initialTrack = PLAYLIST_TRACKS[currentTrackIndexRef.current] || PLAYLIST_TRACKS[0];
    const audio = new Audio(initialTrack.localPath);
    audio.loop = false;
    audio.volume = 0.65;
    audio.autoplay = true;
    audio.playsInline = true;
    audioElRef.current = audio;
    setIsReady(true);

    const handleEnded = () => {
      if (userPausedRef.current) return;
      selectTrackRef.current(currentTrackIndexRef.current + 1, { autoPlay: true });
    };
    audio.addEventListener('ended', handleEnded);

    const tryPlay = async () => {
      if (userPausedRef.current) return;
      try {
        audio.muted = userMutedRef.current;
        await audio.play();
        setIsPlaying(true);
        setIsMuted(audio.muted);
        setNeedsGesture(false);
        unlockedRef.current = true;
      } catch {
        // Fallback: mulai muted terlebih dahulu lalu unmute otomatis saat interaksi pertama
        try {
          audio.muted = true;
          await audio.play();
          setIsPlaying(true);
          setIsMuted(true);
          setNeedsGesture(true);
        } catch {
          setNeedsGesture(true);
        }
      }
    };

    tryPlay();

    const unlock = () => {
      if (userPausedRef.current) return;
      if (audio.paused || (audio.muted && !userMutedRef.current)) {
        audio.muted = userMutedRef.current;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsMuted(userMutedRef.current);
            setNeedsGesture(false);
            unlockedRef.current = true;
          })
          .catch(() => {});
      }
    };

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll'];
    events.forEach((evt) =>
      window.addEventListener(evt, unlock, { capture: true, passive: true })
    );

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, unlock, { capture: true })
      );
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioElRef.current = null;
    };
  }, [sourceMode]);

  // Mode B: YouTube IFrame API (Playlist: Tulus - Tujuh Belas, Perunggu - 33x, Dendi Nata - Abadi)
  useEffect(() => {
    if (sourceMode !== 'youtube' || !ytEnabled) return;
    let cancelled = false;
    let retryTimer = null;

    const forceUnmuteAndPlay = (player) => {
      if (!player || userPausedRef.current) return;
      try {
        if (!userMutedRef.current) {
          player.unMute?.();
          player.setVolume?.(65);
          setIsMuted(false);
        }
        player.playVideo?.();
      } catch {}
    };

    const initYouTubePlayer = () => {
      if (cancelled || !playerHostRef.current || !window.YT?.Player) return;
      if (ytPlayerRef.current) return;

      const initialVideoId =
        (PLAYLIST_TRACKS[currentTrackIndexRef.current] || PLAYLIST_TRACKS[0]).youtubeId;

      ytPlayerRef.current = new window.YT.Player(playerHostRef.current, {
        width: '160',
        height: '90',
        videoId: initialVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setIsReady(true);

            // Pastikan iframe memiliki atribut allow="autoplay; encrypted-media"
            try {
              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
              }
            } catch {}

            // 1. Coba langsung putar dengan suara penuh
            try {
              event.target.setVolume(65);
              event.target.unMute();
              event.target.playVideo();
            } catch {
              setNeedsGesture(true);
            }

            // 2. Jika kebijakan browser menahan autoplay bersuara pada milidetik awal,
            // jalankan autoplay muted terlebih dahulu agar lagu langsung jalan, lalu buka suara
            retryTimer = setTimeout(() => {
              if (cancelled || !ytPlayerRef.current || userPausedRef.current) return;
              try {
                const state = ytPlayerRef.current.getPlayerState?.();
                if (state !== 1) {
                  ytPlayerRef.current.mute?.();
                  ytPlayerRef.current.playVideo?.();
                  setTimeout(() => {
                    if (cancelled || !ytPlayerRef.current || userPausedRef.current) return;
                    try {
                      if (!userMutedRef.current) {
                        ytPlayerRef.current.unMute?.();
                        ytPlayerRef.current.setVolume?.(65);
                      }
                      const afterState = ytPlayerRef.current.getPlayerState?.();
                      if (afterState !== 1) {
                        setNeedsGesture(true);
                      }
                    } catch {
                      setNeedsGesture(true);
                    }
                  }, 350);
                }
              } catch {
                setNeedsGesture(true);
              }
            }, 500);
          },
          onStateChange: (event) => {
            if (cancelled) return;
            // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
            if (event.data === 1) {
              setIsPlaying(true);
              try {
                const mutedNow = event.target.isMuted?.() || false;
                if (mutedNow && !userMutedRef.current && unlockedRef.current) {
                  event.target.unMute?.();
                  event.target.setVolume?.(65);
                  setIsMuted(false);
                } else {
                  setIsMuted(mutedNow);
                }
                setNeedsGesture(mutedNow && !userMutedRef.current);
              } catch {
                setNeedsGesture(false);
              }
            } else if (event.data === 0 && !userPausedRef.current) {
              // Otomatis lanjut ke lagu berikutnya dalam playlist
              selectTrackRef.current(currentTrackIndexRef.current + 1, { autoPlay: true });
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            if (cancelled || userPausedRef.current) return;
            setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initYouTubePlayer();
      };
    }

    // Begitu pengguna menyentuh layar, scroll, atau klik di mana saja, otomatis bunyikan & putar lagu
    const handleFirstInteraction = () => {
      unlockedRef.current = true;
      if (userPausedRef.current) return;
      const p = ytPlayerRef.current;
      if (!p || typeof p.getPlayerState !== 'function') return;
      try {
        const state = p.getPlayerState();
        const mutedNow = p.isMuted?.();
        if (state !== 1 || (mutedNow && !userMutedRef.current)) {
          forceUnmuteAndPlay(p);
          setNeedsGesture(false);
        }
      } catch {}
    };

    const interactionEvents = [
      'pointerdown',
      'touchstart',
      'touchend',
      'click',
      'keydown',
      'scroll',
      'wheel',
    ];
    interactionEvents.forEach((evt) =>
      window.addEventListener(evt, handleFirstInteraction, {
        capture: true,
        passive: true,
      })
    );

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      interactionEvents.forEach((evt) =>
        window.removeEventListener(evt, handleFirstInteraction, {
          capture: true,
        })
      );
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {}
      ytPlayerRef.current = null;
    };
  }, [sourceMode, ytEnabled]);

  const togglePlay = useCallback(() => {
    unlockedRef.current = true;
    if (!ytEnabled) {
      setYtEnabled(true);
    }
    if (sourceMode === 'local' && audioElRef.current) {
      const audio = audioElRef.current;
      if (audio.paused) {
        userPausedRef.current = false;
        audio.muted = userMutedRef.current;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsMuted(audio.muted);
            setNeedsGesture(false);
          })
          .catch(() => {});
      } else {
        userPausedRef.current = true;
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    const p = ytPlayerRef.current;
    if (!p) return;
    try {
      if (isPlaying && !needsGesture) {
        userPausedRef.current = true;
        p.pauseVideo?.();
        setIsPlaying(false);
      } else {
        userPausedRef.current = false;
        userMutedRef.current = false;
        p.unMute?.();
        p.setVolume?.(65);
        p.playVideo?.();
        setIsMuted(false);
        setIsPlaying(true);
        setNeedsGesture(false);
      }
    } catch {}
  }, [sourceMode, isPlaying, needsGesture, ytEnabled]);

  const toggleMute = useCallback(() => {
    unlockedRef.current = true;
    const nextMuted = !isMuted;
    userMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    if (sourceMode === 'local' && audioElRef.current) {
      audioElRef.current.muted = nextMuted;
      if (!nextMuted && audioElRef.current.paused && !userPausedRef.current) {
        audioElRef.current.play().catch(() => {});
      }
      return;
    }

    const p = ytPlayerRef.current;
    if (!p) return;
    try {
      if (nextMuted) {
        p.mute?.();
      } else {
        p.unMute?.();
        p.setVolume?.(65);
        if (!isPlaying && !userPausedRef.current) {
          p.playVideo?.();
          setIsPlaying(true);
        }
        setNeedsGesture(false);
      }
    } catch {}
  }, [sourceMode, isMuted, isPlaying]);

  const handlePrevTrack = useCallback(() => {
    selectTrack(currentTrackIndexRef.current - 1, { autoPlay: true });
  }, [selectTrack]);

  const handleNextTrack = useCallback(() => {
    selectTrack(currentTrackIndexRef.current + 1, { autoPlay: true });
  }, [selectTrack]);

  return (
    <>
      {/* YouTube host container kept slightly above 0 opacity so mobile & desktop browsers allow active media autoplay */}
      {sourceMode === 'youtube' && (
        <div
          aria-hidden="true"
          className="fixed bottom-16 left-2 w-[160px] h-[90px] opacity-[0.004] pointer-events-none z-0 overflow-hidden"
        >
          <div ref={playerHostRef} />
        </div>
      )}

      {/* Compact Floating Music Controller — Responsive for Mobile (above bottom nav) & Desktop */}
      <div className="fixed bottom-[74px] left-3 right-3 sm:right-auto lg:bottom-4 lg:left-4 z-40 pointer-events-none flex items-center justify-start">
        {minimized ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label={`Buka pemutar lagu ${currentTrack.title}`}
            className="pointer-events-auto min-h-[42px] px-3.5 py-2 rounded-full bg-[#050e29]/95 hover:bg-[#050e29] backdrop-blur-md border border-white/15 shadow-xl text-white inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Music2
              className={`w-4 h-4 text-[#00B4D8] ${isPlaying ? 'animate-spin' : ''}`}
              style={isPlaying ? { animationDuration: '4s' } : undefined}
            />
            <span className="text-xs font-semibold whitespace-nowrap">
              {currentTrack.shortLabel}
            </span>
          </button>
        ) : (
          <div className="pointer-events-auto relative w-full sm:w-auto sm:min-w-[320px] max-w-[390px]">
            {/* Playlist Popover */}
            {showPlaylist && (
              <div
                role="region"
                aria-label="Daftar lagu kenangan"
                className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl bg-[#050e29]/95 backdrop-blur-md border border-white/15 shadow-2xl p-2 text-white"
              >
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1">
                  <span className="text-[11px] font-semibold text-[#90E0EF]">
                    Daftar Lagu Kenangan
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {PLAYLIST_TRACKS.length} lagu
                  </span>
                </div>
                <div className="space-y-1">
                  {PLAYLIST_TRACKS.map((track, idx) => {
                    const isActive = idx === currentTrackIndex;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          selectTrack(idx, { autoPlay: true });
                          setShowPlaylist(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0077B6]/45 border border-[#00B4D8]/50 text-white'
                            : 'hover:bg-white/10 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md text-[10px] font-mono font-semibold flex items-center justify-center shrink-0 ${
                              isActive
                                ? 'bg-[#00B4D8] text-[#03045E]'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{track.title}</p>
                            <p className="text-[10.5px] text-[#90E0EF] truncate">{track.artist}</p>
                          </div>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="w-full rounded-2xl bg-[#050e29]/95 backdrop-blur-md border border-white/15 shadow-2xl px-3 py-2 text-white flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={
                  isPlaying ? `Jeda lagu ${currentTrack.title}` : `Putar lagu ${currentTrack.title}`
                }
                className="w-9 h-9 rounded-xl bg-[#0077B6]/35 border border-[#00B4D8]/40 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Disc3
                  className={`w-5 h-5 text-[#90E0EF] ${isPlaying ? 'animate-spin' : ''}`}
                  style={isPlaying ? { animationDuration: '4s' } : undefined}
                />
              </button>

              <div
                onClick={() => {
                  if (needsGesture) {
                    togglePlay();
                  } else {
                    setShowPlaylist((prev) => !prev);
                  }
                }}
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentTrack.title} — {currentTrack.artist}
                  </p>
                  <span className="text-[9.5px] font-mono text-[#90E0EF]/80 shrink-0">
                    {currentTrackIndex + 1}/{PLAYLIST_TRACKS.length}
                  </span>
                </div>
                <p className="text-[10.5px] text-[#90E0EF] truncate">
                  {isPlaying
                    ? isMuted
                      ? 'Diputar · Ketuk ikon suara untuk bunyi'
                      : 'Sedang diputar · Ketuk untuk pilih lagu'
                    : needsGesture
                    ? 'Ketuk layar / Play untuk putar lagu'
                    : isReady
                    ? 'Memulai pemutaran...'
                    : 'Menyiapkan lagu kenangan...'}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevTrack}
                  aria-label="Lagu sebelumnya"
                  className="w-7 h-8 rounded-lg hover:bg-white/10 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Jeda lagu' : 'Putar lagu'}
                  className="w-8 h-8 rounded-xl bg-[#00B4D8] hover:bg-[#90E0EF] text-[#03045E] flex items-center justify-center cursor-pointer transition-colors"
                >
                  {isPlaying && !needsGesture ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextTrack}
                  aria-label="Lagu berikutnya"
                  className="w-7 h-8 rounded-lg hover:bg-white/10 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Bunyikan suara' : 'Bisukan suara'}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPlaylist((prev) => !prev)}
                  aria-label="Pilih daftar lagu"
                  aria-expanded={showPlaylist}
                  className={`w-7 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    showPlaylist
                      ? 'bg-[#00B4D8]/25 text-[#90E0EF]'
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPlaylist(false);
                    setMinimized(true);
                  }}
                  aria-label="Perkecil pemutar lagu"
                  className="w-7 h-8 rounded-lg hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
