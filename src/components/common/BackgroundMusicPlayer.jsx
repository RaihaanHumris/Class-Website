import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Disc3, Play, Pause, Volume2, VolumeX, ChevronDown, Music2 } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'zswUe4xU-c8'; // TULUS - Tujuh Belas (Official Lyric Video, @musiktulus)
const LOCAL_MP3_PATH = '/audio/tujuh-belas.mp3';

export default function BackgroundMusicPlayer() {
  const playerHostRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const audioElRef = useRef(null);
  const userPausedRef = useRef(false);
  const userMutedRef = useRef(false);
  const unlockedRef = useRef(false);

  // Langsung mulai dengan mode YouTube tanpa menunggu request HEAD agar autoplay seketika saat web dibuka
  const [sourceMode, setSourceMode] = useState('youtube'); // 'local' | 'youtube'
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Cek secara paralel apakah file MP3 lokal tersedia di /audio/tujuh-belas.mp3
  useEffect(() => {
    let active = true;
    fetch(LOCAL_MP3_PATH, { method: 'HEAD' })
      .then((res) => {
        if (!active) return;
        const ct = res.headers.get('content-type') || '';
        if (res.ok && (ct.includes('audio') || ct.includes('mpeg'))) {
          setSourceMode('local');
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Mode A: Local MP3 Autoplay + Instant Unlock
  useEffect(() => {
    if (sourceMode !== 'local') return;
    const audio = new Audio(LOCAL_MP3_PATH);
    audio.loop = true;
    audio.volume = 0.65;
    audio.autoplay = true;
    audio.playsInline = true;
    audioElRef.current = audio;
    setIsReady(true);

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
      audio.pause();
      audioElRef.current = null;
    };
  }, [sourceMode]);

  // Mode B: YouTube IFrame API (Official Lyric Video TULUS - Tujuh Belas) dengan Auto-Start Seketika
  useEffect(() => {
    if (sourceMode !== 'youtube') return;
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

      ytPlayerRef.current = new window.YT.Player(playerHostRef.current, {
        width: '160',
        height: '90',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
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
              // Loop ulang jika sudah selesai
              try {
                event.target.seekTo?.(0);
                event.target.playVideo?.();
              } catch {}
            } else if (event.data === 2) {
              setIsPlaying(false);
            }
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
  }, [sourceMode]);

  const togglePlay = useCallback(() => {
    unlockedRef.current = true;
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
  }, [sourceMode, isPlaying, needsGesture]);

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
      <div className="fixed bottom-[68px] left-3 right-3 sm:right-auto lg:bottom-4 lg:left-4 z-40 pointer-events-none flex items-center justify-start">
        {minimized ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label="Buka pemutar lagu Tujuh Belas"
            className="pointer-events-auto min-h-[42px] px-3.5 py-2 rounded-full bg-[#050e29]/95 hover:bg-[#050e29] backdrop-blur-md border border-white/15 shadow-xl text-white inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Music2
              className={`w-4 h-4 text-[#00B4D8] ${isPlaying ? 'animate-spin' : ''}`}
              style={isPlaying ? { animationDuration: '4s' } : undefined}
            />
            <span className="text-xs font-semibold whitespace-nowrap">17 · Tulus</span>
          </button>
        ) : (
          <div className="pointer-events-auto w-full sm:w-auto sm:min-w-[275px] max-w-[340px] rounded-2xl bg-[#050e29]/95 backdrop-blur-md border border-white/15 shadow-2xl px-3 py-2 text-white flex items-center gap-2.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Jeda lagu Tujuh Belas' : 'Putar lagu Tujuh Belas'}
              className="w-9 h-9 rounded-xl bg-[#0077B6]/35 border border-[#00B4D8]/40 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Disc3
                className={`w-5 h-5 text-[#90E0EF] ${isPlaying ? 'animate-spin' : ''}`}
                style={isPlaying ? { animationDuration: '4s' } : undefined}
              />
            </button>

            <div
              onClick={needsGesture ? togglePlay : undefined}
              className={`min-w-0 flex-1 ${needsGesture ? 'cursor-pointer' : ''}`}
            >
              <p className="text-xs font-semibold text-white truncate">
                Tujuh Belas — Tulus
              </p>
              <p className="text-[10.5px] text-[#90E0EF] truncate">
                {isPlaying
                  ? isMuted
                    ? 'Diputar · Ketuk ikon suara untuk bunyi'
                    : 'Sedang diputar otomatis'
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
                onClick={togglePlay}
                aria-label={isPlaying ? 'Jeda lagu' : 'Putar lagu'}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-[#00B4D8] hover:bg-[#90E0EF] text-[#03045E] flex items-center justify-center cursor-pointer transition-colors"
              >
                {isPlaying && !needsGesture ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Bunyikan suara' : 'Bisukan suara'}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Perkecil pemutar lagu"
                className="w-8 h-9 sm:w-7 sm:h-8 rounded-xl hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
