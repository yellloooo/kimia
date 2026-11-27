import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { soundFX } from '../utils/sound';
import { MinigameResult } from './CollisionMinigame';

interface CatalystMinigameProps {
  onComplete: (result: MinigameResult) => void;
  standalone?: boolean;
}

const TARGET_CENTER = 52;
const TARGET_WIDTH = 18; // 43% .. 61%

export function CatalystMinigame({
  onComplete,
  standalone = false,
}: CatalystMinigameProps) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [round, setRound] = useState<number>(1);
  const [cursorX, setCursorX] = useState<number>(10);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [perfectHits, setPerfectHits] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<string>('');

  const cursorRef = useRef<number>(10);
  const dirRef = useRef<number>(1);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'playing') return;

    let last = performance.now();
    const speed = 1.15 + (round - 1) * 0.45;

    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;

      let next = cursorRef.current + dirRef.current * speed * dt;
      if (next >= 92) {
        next = 92;
        dirRef.current = -1;
      } else if (next <= 8) {
        next = 8;
        dirRef.current = 1;
      }
      cursorRef.current = next;
      setCursorX(next);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, round]);

  const handleTrigger = useCallback(() => {
    if (phase !== 'playing') return;

    const dist = Math.abs(cursorRef.current - TARGET_CENTER);
    let points = 0;
    let msg = '';

    if (dist <= TARGET_WIDTH / 2) {
      points = 300;
      msg = 'Tepat di puncak transisi! Ea turun drastis (+300 poin)';
      setPerfectHits((p) => p + 1);
      soundFX.correct();
    } else if (dist <= TARGET_WIDTH) {
      points = 150;
      msg = 'Mendekati puncak! Katalis aktif (+150 poin)';
      soundFX.spark();
    } else {
      points = 40;
      msg = 'Melenceng dari keadaan transisi (+40 poin)';
      soundFX.wrong();
    }

    setTotalScore((s) => s + points);
    setLastFeedback(msg);

    if (round >= 3) {
      setPhase('done');
      soundFX.fanfare();
    } else {
      setRound((r) => r + 1);
    }
  }, [phase, round]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === 'playing' && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        handleTrigger();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, handleTrigger]);

  const start = () => {
    soundFX.click();
    cursorRef.current = 12;
    dirRef.current = 1;
    setRound(1);
    setTotalScore(0);
    setPerfectHits(0);
    setLastFeedback('');
    setPhase('playing');
  };

  const shieldEarned = perfectHits >= 2;
  const multiplierEarned = perfectHits === 3 ? 2 : perfectHits >= 1 ? 1.5 : 1;

  const finish = () => {
    soundFX.click();
    onComplete({
      bonusPoints: totalScore,
      multiplierEarned,
      streakShieldEarned: shieldEarned,
      summaryText: `${perfectHits}/3 kalibrasi presisi · Pengali ${multiplierEarned}x${
        shieldEarned ? ' + Pelindung Streak' : ''
      }`,
    });
  };

  const markerX = (cursorX / 100) * 600;

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-medium text-emerald-400">
            Mini-Game Lab · Energi Aktivasi & Katalis
          </p>
          <h2 className="font-display text-2xl font-bold text-white">
            Kalibrasi Jalur Katalis
          </h2>
        </div>

        <div className="flex items-center gap-6 tabular-nums">
          <div className="text-right">
            <span className="block text-xs text-slate-400">Tahap Kalibrasi</span>
            <span className="font-mono text-lg font-bold text-white">
              {phase === 'done' ? '3 / 3' : `${round} / 3`}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400">Skor Bonus</span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              +{totalScore}
            </span>
          </div>
        </div>
      </div>

      {phase === 'ready' && (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Katalis bekerja dengan menurunkan bukit energi aktivasi (
            <span className="font-mono text-emerald-300">Ea</span>) tanpa
            mengubah entalpi reaksi (<span className="font-mono">ΔH</span>).
            Hentikan penanda tepat di zona hijau puncak transisi sebanyak 3
            tahap!
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <ShieldCheck className="h-5 w-5 text-sky-400 shrink-0" aria-hidden="true" />
              <span>2+ Presisi Tepat: Pelindung Streak Aktif</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>3 Presisi Tepat: Pengali Skor 2,0x</span>
            </div>
          </div>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
          >
            Mulai Kalibrasi Katalis
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="mt-6 space-y-5">
          <div className="rounded-lg border border-slate-800 bg-[#070B14] p-4">
            <svg
              viewBox="0 0 600 240"
              className="block h-auto w-full"
              role="img"
              aria-label="Diagram profil energi aktivasi tanpa katalis dan dengan katalis"
            >
              {/* Axes */}
              <line x1="48" y1="20" x2="48" y2="210" stroke="#475569" strokeWidth="2" />
              <line x1="48" y1="210" x2="570" y2="210" stroke="#475569" strokeWidth="2" />
              <text x="16" y="120" transform="rotate(-90 16 120)" textAnchor="middle" className="fill-slate-400 text-[11px]">
                Energi Potensial
              </text>
              <text x="310" y="232" textAnchor="middle" className="fill-slate-400 text-[11px]">
                Koordinat Reaksi
              </text>

              {/* Optimal Target Zone */}
              <rect
                x={(TARGET_CENTER - TARGET_WIDTH / 2) * 6}
                y="24"
                width={TARGET_WIDTH * 6}
                height="186"
                fill="rgba(16, 185, 129, 0.14)"
                stroke="#10B981"
                strokeDasharray="4 4"
              />

              {/* Uncatalyzed Curve */}
              <path
                d="M 60 150 C 160 150, 220 30, 312 30 C 400 30, 440 180, 550 180"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <text x="312" y="20" textAnchor="middle" className="fill-rose-400 font-mono text-[11px] font-bold">
                Ea Tanpa Katalis
              </text>

              {/* Catalyzed Curve */}
              <path
                d="M 60 150 C 160 150, 230 92, 312 92 C 395 92, 440 180, 550 180"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
              />
              <text x="312" y="114" textAnchor="middle" className="fill-emerald-300 font-mono text-[11px] font-bold">
                Ea + Katalis
              </text>

              {/* Moving Calibration Cursor */}
              <line
                x1={markerX}
                y1="24"
                x2={markerX}
                y2="210"
                stroke="#FBBF24"
                strokeWidth="3"
              />
              <circle cx={markerX} cy="92" r="7" fill="#FBBF24" stroke="#0B1120" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-300">
              {lastFeedback || 'Tekan tombol atau tombol Spasi saat garis emas berada di zona hijau!'}
            </p>
            <button
              type="button"
              onClick={handleTrigger}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              Aktifkan Katalis (Spasi)
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/70 p-6 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-white">
            Kalibrasi Selesai
          </h3>
          <p className="text-sm text-slate-300">{lastFeedback}</p>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 border-y border-slate-800 py-4 tabular-nums">
            <div>
              <span className="block text-xs text-slate-400">Presisi Tepat</span>
              <span className="font-mono text-xl font-bold text-emerald-400">
                {perfectHits} / 3
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Bonus Poin</span>
              <span className="font-mono text-xl font-bold text-sky-400">
                +{totalScore}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Hadiah Aktif</span>
              <span className="font-mono text-base font-bold text-amber-400">
                {multiplierEarned}x {shieldEarned ? '+ Perisai' : ''}
              </span>
            </div>
          </div>

          {standalone ? (
            <button
              type="button"
              onClick={start}
              className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Kalibrasi Ulang
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Ambil Hadiah & Lanjut Kuis
            </button>
          )}
        </div>
      )}
    </div>
  );
}
