import { useEffect, useRef, useState } from 'react';
import { Flame, Sparkles, Timer, Zap } from 'lucide-react';
import collisionChamberImg from '../assets/images/minigame_collision_chamber_1794562877385.jpg';
import { soundFX } from '../utils/sound';

export interface MinigameResult {
  bonusPoints: number;
  multiplierEarned: number;
  streakShieldEarned: boolean;
  summaryText: string;
}

interface CollisionMinigameProps {
  onComplete: (result: MinigameResult) => void;
  standalone?: boolean;
}

interface Particle {
  id: number;
  kind: 'A' | 'B';
  x: number;
  y: number;
  vx: number;
  vy: number;
  activeWindow: number; // > 0 means ready for effective collision click
}

interface SparkBurst {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const CHAMBER_W = 640;
const CHAMBER_H = 340;
const ROUND_SECONDS = 15;

export function CollisionMinigame({
  onComplete,
  standalone = false,
}: CollisionMinigameProps) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [temperature, setTemperature] = useState<number>(340); // Kelvin
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS);
  const [hits, setHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bursts, setBursts] = useState<SparkBurst[]>([]);

  const particlesRef = useRef<Particle[]>([]);
  const tempRef = useRef<number>(temperature);
  const animRef = useRef<number | null>(null);
  const hitsRef = useRef<number>(0);

  useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  const initParticles = () => {
    const initial: Particle[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.6 + Math.random() * 1.3;
      initial.push({
        id: i,
        kind: i % 2 === 0 ? 'A' : 'B',
        x: 45 + Math.random() * (CHAMBER_W - 90),
        y: 45 + Math.random() * (CHAMBER_H - 90),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        activeWindow: i < 4 ? 100 : 0,
      });
    }
    particlesRef.current = initial;
    setParticles(initial);
    setBursts([]);
  };

  useEffect(() => {
    if (phase !== 'playing') return;

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - lastTime) / 16.67;
      lastTime = now;

      const speedFactor = 0.6 + ((tempRef.current - 270) / 180) * 1.45;
      const list = particlesRef.current.map((p) => {
        let nx = p.x + p.vx * speedFactor * dt;
        let ny = p.y + p.vy * speedFactor * dt;
        let nvx = p.vx;
        let nvy = p.vy;

        if (nx < 28 || nx > CHAMBER_W - 28) {
          nvx = -nvx;
          nx = Math.max(28, Math.min(CHAMBER_W - 28, nx));
        }
        if (ny < 28 || ny > CHAMBER_H - 28) {
          nvy = -nvy;
          ny = Math.max(28, Math.min(CHAMBER_H - 28, ny));
        }

        return {
          ...p,
          x: nx,
          y: ny,
          vx: nvx,
          vy: nvy,
          activeWindow: Math.max(0, p.activeWindow - 1.2 * dt),
        };
      });

      // Check close A-B encounters to trigger golden activation windows
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const p1 = list[i];
          const p2 = list[j];
          if (p1.kind === p2.kind) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 62) {
            const activationChance = (tempRef.current - 250) / 220;
            if (Math.random() < activationChance * 0.35 + 0.18) {
              p1.activeWindow = 100;
              p2.activeWindow = 100;
            }
          }
        }
      }

      // Keep at least 2 reactive targets glowing so player always has agency
      const glowingCount = list.filter((p) => p.activeWindow > 10).length;
      if (glowingCount < 2 && list.length > 0) {
        const candidate = list[Math.floor(Math.random() * list.length)];
        candidate.activeWindow = 100;
      }

      particlesRef.current = list;
      setParticles(list);
      setBursts((prev) => prev.filter((b) => now - b.createdAt < 450));

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPhase('done');
          soundFX.fanfare();
          return 0;
        }
        if (prev <= 4) soundFX.tick(true);
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const startGame = () => {
    soundFX.click();
    hitsRef.current = 0;
    setHits(0);
    setMisses(0);
    setTimeLeft(ROUND_SECONDS);
    initParticles();
    setPhase('playing');
  };

  const handleParticleClick = (particle: Particle) => {
    if (phase !== 'playing') return;
    if (particle.activeWindow > 5) {
      soundFX.spark();
      hitsRef.current += 1;
      setHits(hitsRef.current);
      setBursts((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), x: particle.x, y: particle.y, createdAt: performance.now() },
      ]);
      particlesRef.current = particlesRef.current.map((p) =>
        p.id === particle.id
          ? {
              ...p,
              activeWindow: 0,
              x: 40 + Math.random() * (CHAMBER_W - 80),
              y: 40 + Math.random() * (CHAMBER_H - 80),
            }
          : p
      );
    } else {
      soundFX.wrong();
      setMisses((m) => m + 1);
    }
  };

  const earnedPoints = Math.max(0, hits * 140 - misses * 30);
  const multiplier = hits >= 8 ? 2 : hits >= 4 ? 1.5 : 1;

  const finishMinigame = () => {
    soundFX.click();
    onComplete({
      bonusPoints: earnedPoints,
      multiplierEarned: multiplier,
      streakShieldEarned: false,
      summaryText: `${hits} tumbukan efektif dipicu (${multiplier}x pengali skor)`,
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-medium text-amber-400">
            Mini-Game Lab · Teori Tumbukan
          </p>
          <h2 className="font-display text-2xl font-bold text-white">
            Tabrakan Molekul Efektif
          </h2>
        </div>

        <div className="flex items-center gap-6 tabular-nums">
          <div className="text-right">
            <span className="block text-xs text-slate-400">Reaksi Terjadi</span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              {hits} produk
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400">Sisa Waktu</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-lg font-bold text-amber-400">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {timeLeft}d
            </span>
          </div>
        </div>
      </div>

      {phase === 'ready' && (
        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              Naikkan suhu reaktor agar partikel bergerak lebih cepat dan saling
              bertumbukan. Klik molekul yang memancarkan{' '}
              <strong className="text-amber-300">cincin energi emas</strong>{' '}
              (energi kinetik melampaui <span className="font-mono">Ea</span>)
              untuk memicu reaksi <span className="font-mono">A + B → AB</span>.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span>Minimal 4 reaksi efektif: Pengali Skor 1,5x</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Minimal 8 reaksi efektif: Pengali Skor 2,0x</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Mulai Simulasi (15 Detik)
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            <img
              src={collisionChamberImg}
              alt="Ilustrasi ruang reaksi tabrakan molekul"
              referrerPolicy="no-referrer"
              className="h-52 w-full object-cover"
            />
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <label
              htmlFor="chamber-temp"
              className="flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <Flame className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Suhu Reaktor:{' '}
              <span className="font-mono font-bold text-amber-300 tabular-nums">
                {temperature} K
              </span>
            </label>
            <input
              id="chamber-temp"
              type="range"
              min={280}
              max={450}
              step={10}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-52 accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="relative w-full overflow-hidden rounded-lg border border-slate-700 bg-[#070B14] select-none">
            <svg
              viewBox={`0 0 ${CHAMBER_W} ${CHAMBER_H}`}
              className="block h-auto w-full touch-none"
              role="img"
              aria-label="Bejana reaksi partikel molekul A dan B"
            >
              <defs>
                <pattern
                  id="chamberGrid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="rgba(148,163,184,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width={CHAMBER_W} height={CHAMBER_H} fill="url(#chamberGrid)" />

              {bursts.map((b) => (
                <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
                  <circle
                    r="28"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                  <text
                    y="-22"
                    textAnchor="middle"
                    className="fill-emerald-300 font-mono text-xs font-bold"
                  >
                    +140
                  </text>
                </g>
              ))}

              {particles.map((p) => {
                const isReady = p.activeWindow > 5;
                return (
                  <g
                    key={p.id}
                    transform={`translate(${p.x}, ${p.y})`}
                    onClick={() => handleParticleClick(p)}
                    className="cursor-pointer"
                  >
                    {/* Generous 44px+ hit target */}
                    <circle r="26" fill="transparent" />
                    {isReady && (
                      <circle
                        r="22"
                        fill="rgba(245, 158, 11, 0.2)"
                        stroke="#FBBF24"
                        strokeWidth="2.5"
                      />
                    )}
                    <circle
                      r="14"
                      fill={p.kind === 'A' ? '#0284C7' : '#E11D48'}
                      stroke={isReady ? '#FEF08A' : '#E2E8F0'}
                      strokeWidth={isReady ? '2.5' : '1'}
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      className="fill-white font-mono text-xs font-bold pointer-events-none"
                    >
                      {p.kind}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-slate-400">
            Tips: Naikkan suhu di atas 380 K untuk memperbanyak tumbukan emas!
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/70 p-6 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-white">
            Simulasi Selesai
          </h3>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 border-y border-slate-800 py-4 tabular-nums">
            <div>
              <span className="block text-xs text-slate-400">Tumbukan Efektif</span>
              <span className="font-mono text-xl font-bold text-emerald-400">
                {hits}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Bonus Poin</span>
              <span className="font-mono text-xl font-bold text-sky-400">
                +{earnedPoints}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Pengali Skor</span>
              <span className="font-mono text-xl font-bold text-amber-400">
                {multiplier}x
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {standalone ? (
              <button
                type="button"
                onClick={startGame}
                className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400"
              >
                Main Lagi
              </button>
            ) : (
              <button
                type="button"
                onClick={finishMinigame}
                className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
              >
                Ambil Hadiah & Lanjut Kuis
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
