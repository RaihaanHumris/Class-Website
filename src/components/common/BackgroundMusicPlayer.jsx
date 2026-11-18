import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Disc3, Play, Pause, Volume2, VolumeX, ChevronDown, Music2 } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'zswUe4xU-c8'; // TULUS - Tujuh Belas (Official Lyric Video, @musiktulus)
const LOCAL_MP3_PATH = '/audio/tujuh-belas.mp3';

export default function BackgroundMusicPlayer() {
  const playerHostRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const audioElRef = useRef(null);
  const userPausedRef = useRef(false);

  const [sourceMode, setSourceMode] = useState(null); // 'local' | 'youtube'
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Deteksi apakah file MP3 lokal tersedia, jika tidak gunakan player resmi YouTube
  useEffect(() => {
    let active = true;
    fetch(LOCAL_MP3_PATH, { method: 'HEAD' })
      .then((res) => {
        if (!active) return;
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('audio')) {
          setSourceMode('local');
        } else {
          setSourceMode('youtube');
        }
      })
      .catch(() => {
        if (active) setSourceMode('youtube');
      });
    return () => {
      active = false;
    };
  }, []);

  // Mode A: Local MP3 Autoplay + Fallback Gesture
  useEffect(() => {
    if (sourceMode !== 'local') return;
    const audio = new Audio(LOCAL_MP3_PATH);
    audio.loop = true;
    audio.volume = 0.55;
    audioElRef.current = audio;
    setIsReady(true);

    const tryPlay = async () => {
      if (userPausedRef.current) return;
      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsGesture(false);
      } catch {
        setNeedsGesture(true);
      }
    };

    tryPlay();

    const unlock = () => {
      if (!userPausedRef.current && audio.paused) {
        tryPlay();
      }
    };
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
      audio.pause();
      audioElRef.current = null;
    };
  }, [sourceMode]);

  // Mode B: YouTube IFrame API (Official Lyric Video TULUS - Tujuh Belas)
  useEffect(() => {
    if (sourceMode !== 'youtube') return;
    let cancelled = false;

    const initYouTubePlayer = () => {
      if (cancelled || !playerHostRef.current || !window.YT?.Player) return;
      if (ytPlayerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(playerHostRef.current, {
        width: '200',
        height: '113',
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
            try {
              event.target.setVolume(60);
              event.target.unMute();
              event.target.playVideo();
            } catch {
              setNeedsGesture(true);
            }
            // Cek apakah browser memblokir autoplay bersuara
            setTimeout(() => {
              if (cancelled || !ytPlayerRef.current) return;
              try {
                const state = ytPlayerRef.current.getPlayerState?.();
                if (state !== 1) {
                  setNeedsGesture(true);
                }
              } catch {}
            }, 1100);
          },
          onStateChange: (event) => {
            if (cancelled) return;
            // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              setNeedsGesture(false);
            } else if (event.data === 2 || event.data === 0) {
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
        document.head.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initYouTubePlayer();
      };
    }

    // Jika browser memblokir autoplay bersuara saat awal buka, mulai otomatis pada sentuhan/klik pertama
    const handleFirstInteraction = () => {
      if (userPausedRef.current) return;
      const p = ytPlayerRef.current;
      if (!p) return;
      try {
        const state = p.getPlayerState?.();
        if (state !== 1) {
          p.unMute?.();
          p.setVolume?.(60);
          p.playVideo?.();
        }
      } catch {}
    };

    window.addEventListener('pointerdown', handleFirstInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', handleFirstInteraction, {
      capture: true,
    });

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', handleFirstInteraction, {
        capture: true,
      });
      window.removeEventListener('keydown', handleFirstInteraction, {
        capture: true,
      });
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {}
      ytPlayerRef.current = null;
    };
  }, [sourceMode]);

  const togglePlay = useCallback(() => {
    if (sourceMode === 'local' && audioElRef.current) {
      const audio = audioElRef.current;
      if (audio.paused) {
        userPausedRef.current = false;
        audio.play().then(() => {
          setIsPlaying(true);
          setNeedsGesture(false);
        }).catch(() => {});
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
      if (isPlaying) {
        userPausedRef.current = true;
        p.pauseVideo?.();
        setIsPlaying(false);
      } else {
        userPausedRef.current = false;
        p.unMute?.();
        p.setVolume?.(60);
        p.playVideo?.();
        setIsPlaying(true);
        setNeedsGesture(false);
      }
    } catch {}
  }, [sourceMode, isPlaying]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (sourceMode === 'local' && audioElRef.current) {
      audioElRef.current.muted = nextMuted;
      return;
    }

    const p = ytPlayerRef.current;
    if (!p) return;
    try {
      if (nextMuted) {
        p.mute?.();
      } else {
        p.unMute?.();
        p.setVolume?.(60);
      }
    } catch {}
  }, [sourceMode, isMuted]);

  return (
    <>
      {/* Hidden non-zero YouTube container required by YouTube autoplay policy */}
      {sourceMode === 'youtube' && (
        <div
          aria-hidden="true"
          className="fixed bottom-0 left-0 w-[200px] h-[113px] opacity-0 pointer-events-none -z-50 overflow-hidden"
        >
          <div ref={playerHostRef} />
        </div>
      )}

      {/* Compact Floating Music Controller */}
      <div className="fixed bottom-4 left-4 z-40">
        {minimized ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label="Buka pemutar lagu Tujuh Belas"
            className="min-h-[42px] px-3 py-2 rounded-xl bg-[#050e29]/92 hover:bg-[#050e29] backdrop-blur-md border border-white/15 shadow-xl text-white inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Music2 className={`w-4 h-4 text-[#00B4D8] ${isPlaying ? 'animate-spin' : ''}`} />
            <span className="text-xs font-semibold">17 · Tulus</span>
          </button>
        ) : (
          <div className="rounded-xl bg-[#050e29]/92 backdrop-blur-md border border-white/15 shadow-2xl px-3 py-2.5 text-white flex items-center gap-3 max-w-[300px]">
            <div className="w-9 h-9 rounded-lg bg-[#0077B6]/30 border border-[#00B4D8]/35 flex items-center justify-center shrink-0">
              <Disc3
                className={`w-5 h-5 text-[#90E0EF] ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={isPlaying ? { animationDuration: '4s' } : undefined}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                Tujuh Belas — Tulus
              </p>
              <p className="text-[10px] text-[#90E0EF] truncate">
                {isPlaying
                  ? isMuted
                    ? 'Diputar (hening)'
                    : 'Sedang diputar'
                  : needsGesture
                  ? 'Klik Play / layar untuk putar'
                  : isReady
                  ? 'Siap diputar'
                  : 'Menyiapkan lagu...'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Jeda lagu' : 'Putar lagu'}
                className="w-8 h-8 rounded-lg bg-[#00B4D8] hover:bg-[#90E0EF] text-[#03045E] flex items-center justify-center cursor-pointer transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Bunyikan suara' : 'Bisukan suara'}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMinimized(true)}
                aria-label="Perkecil pemutar lagu"
                className="w-7 h-8 rounded-lg hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
