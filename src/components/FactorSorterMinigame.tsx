import { useCallback, useEffect, useState } from 'react';
import { Flame, FlaskConical, Layers, Timer, Zap } from 'lucide-react';
import { soundFX } from '../utils/sound';
import { MinigameResult } from './CollisionMinigame';

type FactorCategory = 'konsentrasi' | 'luas' | 'suhu' | 'katalis';

interface FactorCard {
  text: string;
  factor: FactorCategory;
}

const SCENARIO_CARDS: FactorCard[] = [
  { text: 'Serbuk pualam CaCO₃ habis lebih cepat daripada kepingannya', factor: 'luas' },
  { text: 'Menyimpan sayur di lemari pendingin agar tidak cepat busuk', factor: 'suhu' },
  { text: 'Menambahkan MnO₂ pada penguraian larutan H₂O₂', factor: 'katalis' },
  { text: 'Pita Mg bereaksi lebih hebat dengan HCl 2 M daripada HCl 0,5 M', factor: 'konsentrasi' },
  { text: 'Kayu dibelah menjadi potongan kecil sebelum dibakar', factor: 'luas' },
  { text: 'Menggunakan enzim amilase untuk memecah pati dalam mulut', factor: 'katalis' },
  { text: 'Pemanasan larutan Na₂S₂O₃ mempercepat munculnya endapan belerang', factor: 'suhu' },
  { text: 'Menaikkan kemolaran larutan asam cuka saat membersihkan kerak', factor: 'konsentrasi' },
  { text: 'Penggunaan serbuk besi (Fe) dalam sintesis amonia Haber-Bosch', factor: 'katalis' },
  { text: 'Gula halus larut dan bereaksi lebih cepat daripada gula batu', factor: 'luas' },
  { text: 'Merebus telur dalam air mendidih 100°C dibandingkan air hangat', factor: 'suhu' },
  { text: 'Pembakaran lebih terang di dalam tabung berisi oksigen murni 100%', factor: 'konsentrasi' },
];

const FACTOR_BUTTONS: {
  id: FactorCategory;
  label: string;
  shortcut: string;
  colorClass: string;
  icon: typeof FlaskConical;
}[] = [
  {
    id: 'konsentrasi',
    label: 'Konsentrasi',
    shortcut: '1',
    colorClass: 'border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200',
    icon: FlaskConical,
  },
  {
    id: 'luas',
    label: 'Luas Permukaan',
    shortcut: '2',
    colorClass: 'border-sky-500/40 bg-sky-950/40 hover:bg-sky-900/60 text-sky-200',
    icon: Layers,
  },
  {
    id: 'suhu',
    label: 'Suhu',
    shortcut: '3',
    colorClass: 'border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200',
    icon: Flame,
  },
  {
    id: 'katalis',
    label: 'Katalis',
    shortcut: '4',
    colorClass: 'border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200',
    icon: Zap,
  },
];

interface FactorSorterMinigameProps {
  onComplete: (result: MinigameResult) => void;
  standalone?: boolean;
}

export function FactorSorterMinigame({
  onComplete,
  standalone = false,
}: FactorSorterMinigameProps) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(16);
  const [deck, setDeck] = useState<FactorCard[]>(SCENARIO_CARDS);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const start = () => {
    soundFX.click();
    const shuffled = [...SCENARIO_CARDS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setScore(0);
    setCombo(0);
    setCorrectCount(0);
    setFeedback('');
    setTimeLeft(16);
    setPhase('playing');
  };

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
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const handleSort = useCallback(
    (chosen: FactorCategory) => {
      if (phase !== 'playing') return;
      const current = deck[index % deck.length];
      if (chosen === current.factor) {
        soundFX.correct();
        const nextCombo = combo + 1;
        const pts = 100 + Math.min(nextCombo, 5) * 25;
        setCombo(nextCombo);
        setCorrectCount((c) => c + 1);
        setScore((s) => s + pts);
        setFeedback(`Tepat! +${pts} poin (${nextCombo}x kombo)`);
      } else {
        soundFX.wrong();
        setCombo(0);
        setFeedback(`Kurang tepat — faktor sebenarnya: ${current.factor.toUpperCase()}`);
      }

      if (index + 1 >= deck.length) {
        setPhase('done');
        soundFX.fanfare();
      } else {
        setIndex((i) => i + 1);
      }
    },
    [phase, deck, index, combo]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      if (e.key === '1') handleSort('konsentrasi');
      if (e.key === '2') handleSort('luas');
      if (e.key === '3') handleSort('suhu');
      if (e.key === '4') handleSort('katalis');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, handleSort]);

  const multiplierEarned = correctCount >= 8 ? 2 : correctCount >= 4 ? 1.5 : 1;

  const finish = () => {
    soundFX.click();
    onComplete({
      bonusPoints: score,
      multiplierEarned,
      streakShieldEarned: correctCount >= 6,
      summaryText: `${correctCount} klasifikasi benar · Pengali ${multiplierEarned}x`,
    });
  };

  const currentCard = deck[index % deck.length];

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-medium text-sky-400">
            Mini-Game Lab · Faktor Laju Reaksi
          </p>
          <h2 className="font-display text-2xl font-bold text-white">
            Racik Faktor Laju Cepat
          </h2>
        </div>

        <div className="flex items-center gap-6 tabular-nums">
          <div className="text-right">
            <span className="block text-xs text-slate-400">Skor Bonus</span>
            <span className="font-mono text-lg font-bold text-sky-400">
              +{score}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-slate-400">Waktu</span>
            <span className="inline-flex items-center gap-1 font-mono text-lg font-bold text-amber-400">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {timeLeft}d
            </span>
          </div>
        </div>
      </div>

      {phase === 'ready' && (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Uji refleks kimiamu selama 16 detik! Kelompokkan setiap fenomena
            laboratorium atau kehidupan sehari-hari ke dalam faktor laju reaksi
            yang memengaruhinya (gunakan klik atau tombol angka{' '}
            <span className="font-mono text-white">1–4</span>).
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-sky-400"
          >
            Mulai Klasifikasi Cepat (16 Detik)
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-center">
            <p className="text-xs font-mono text-slate-400 tabular-nums">
              Fenomena {index + 1} dari {deck.length}
            </p>
            <p className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl">
              {currentCard.text}
            </p>
            <p className="mt-3 min-h-[20px] text-xs font-medium text-amber-300">
              {feedback}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FACTOR_BUTTONS.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleSort(btn.id)}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-transform active:scale-[0.98] ${btn.colorClass}`}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {btn.label}
                  </span>
                  <span className="font-mono text-xs opacity-75">
                    [{btn.shortcut}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/70 p-6 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-white">
            Klasifikasi Selesai
          </h3>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-4 border-y border-slate-800 py-4 tabular-nums">
            <div>
              <span className="block text-xs text-slate-400">Benar</span>
              <span className="font-mono text-xl font-bold text-emerald-400">
                {correctCount}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Bonus Poin</span>
              <span className="font-mono text-xl font-bold text-sky-400">
                +{score}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Pengali Skor</span>
              <span className="font-mono text-xl font-bold text-amber-400">
                {multiplierEarned}x
              </span>
            </div>
          </div>

          {standalone ? (
            <button
              type="button"
              onClick={start}
              className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400"
            >
              Main Lagi
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
