import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import heroLabImg from '../assets/images/hero_kinetics_lab_1794562876864.jpg';
import trophyFlaskImg from '../assets/images/podium_trophy_flask_1794562876874.jpg';
import {
  CheckCircle2,
  Circle,
  Diamond,
  Flame,
  HelpCircle,
  ListChecks,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  Triangle,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from 'lucide-react';
import {
  AI_RIVALS,
  ELEMENT_AVATARS,
  LAJU_REAKSI_QUESTIONS,
} from '../data/questions';
import {
  AnswerRecord,
  Competitor,
  ElementAvatar,
  GameMode,
  LeaderboardEntry,
  MinigameType,
  PowerUpState,
  QuizQuestion,
  SubTopic,
} from '../types/quiz';
import { soundFX } from '../utils/sound';
import { CatalystMinigame } from './CatalystMinigame';
import { CollisionMinigame, MinigameResult } from './CollisionMinigame';
import { FactorSorterMinigame } from './FactorSorterMinigame';

type ArenaPhase =
  | 'LOBBY'
  | 'QUESTION'
  | 'REVEAL'
  | 'STANDINGS'
  | 'MINIGAME'
  | 'PODIUM';

interface QuizArenaProps {
  onMatchActiveChange: (active: boolean) => void;
  onSaveScore: (entry: LeaderboardEntry) => void;
  onOpenBank: () => void;
  customLaunchRequest?: { ids: number[]; key: number } | null;
  exitSignal: number;
}

const TILE_THEMES = [
  {
    letter: 'A',
    shape: Triangle,
    base: 'bg-rose-600/90 hover:bg-rose-500 border-rose-400/50 text-white',
    dimmed: 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-45',
    correct: 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300',
    wrong: 'bg-rose-900/70 border-rose-500 text-rose-100',
  },
  {
    letter: 'B',
    shape: Diamond,
    base: 'bg-sky-600/90 hover:bg-sky-500 border-sky-400/50 text-white',
    dimmed: 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-45',
    correct: 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300',
    wrong: 'bg-rose-900/70 border-rose-500 text-rose-100',
  },
  {
    letter: 'C',
    shape: Circle,
    base: 'bg-amber-600/90 hover:bg-amber-500 border-amber-400/50 text-white',
    dimmed: 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-45',
    correct: 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300',
    wrong: 'bg-rose-900/70 border-rose-500 text-rose-100',
  },
  {
    letter: 'D',
    shape: Square,
    base: 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-400/50 text-white',
    dimmed: 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-45',
    correct: 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300',
    wrong: 'bg-rose-900/70 border-rose-500 text-rose-100',
  },
] as const;

const MINIGAME_SEQUENCE: MinigameType[] = ['collision', 'catalyst', 'sorter'];

const SUBTOPICS: SubTopic[] = [
  'Konsep Laju',
  'Teori Tumbukan',
  'Faktor Laju',
  'Hukum Laju & Orde',
];

export function QuizArena({
  onMatchActiveChange,
  onSaveScore,
  onOpenBank,
  customLaunchRequest,
  exitSignal,
}: QuizArenaProps) {
  const [phase, setPhase] = useState<ArenaPhase>('LOBBY');
  const [playerName, setPlayerName] = useState<string>('Kimiawan');
  const [avatar, setAvatar] = useState<ElementAvatar>(ELEMENT_AVATARS[0]);
  const [mode, setMode] = useState<GameMode>('penuh');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(
    () => LAJU_REAKSI_QUESTIONS.map((q) => q.id)
  );
  const [previewQuestionId, setPreviewQuestionId] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(soundFX.muted);

  const [questions, setQuestions] = useState<QuizQuestion[]>(LAJU_REAKSI_QUESTIONS);
  const [qIndex, setQIndex] = useState<number>(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [recordsByQId, setRecordsByQId] = useState<Record<number, AnswerRecord>>({});
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [minigameBonusTotal, setMinigameBonusTotal] = useState<number>(0);
  const [lastMinigameSummary, setLastMinigameSummary] = useState<string>('');
  const [shieldSavedNotice, setShieldSavedNotice] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showNavigator, setShowNavigator] = useState<boolean>(false);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [trophyImgFailed, setTrophyImgFailed] = useState<boolean>(false);

  const [powerUps, setPowerUps] = useState<PowerUpState>({
    multiplier: 1,
    multiplierRoundsLeft: 0,
    streakShield: false,
    fiftyFiftyCharges: 1,
  });

  const savedMatchRef = useRef<boolean>(false);
  const lastLaunchKeyRef = useRef<number>(0);
  const minigamePlayedForCountRef = useRef<Set<number>>(new Set());

  const currentQuestion = questions[qIndex];
  const currentRecord = currentQuestion
    ? recordsByQId[currentQuestion.id]
    : undefined;
  const answeredCount = Object.keys(recordsByQId).length;

  useEffect(() => {
    onMatchActiveChange(phase !== 'LOBBY');
  }, [phase, onMatchActiveChange]);

  useEffect(() => {
    if (exitSignal > 0 && phase !== 'LOBBY') {
      setShowNavigator(false);
      setPhase('LOBBY');
    }
  }, [exitSignal, phase]);

  const toggleMute = () => {
    soundFX.muted = !muted;
    setMuted(soundFX.muted);
  };

  const launchMatchWithDeck = useCallback(
    (deck: QuizQuestion[], matchMode: GameMode) => {
      if (deck.length === 0) return;
      const cleanName = playerName.trim() || 'Kimiawan';

      const initialCompetitors: Competitor[] = [
        {
          id: 'player',
          name: cleanName,
          symbol: avatar.symbol,
          accentHex: avatar.accentHex,
          score: 0,
          streak: 0,
          correctCount: 0,
          isPlayer: true,
          lastDelta: 0,
        },
        ...AI_RIVALS.map((bot) => ({
          ...bot,
          score: 0,
          streak: 0,
          correctCount: 0,
          isPlayer: false,
          lastDelta: 0,
        })),
      ];

      savedMatchRef.current = false;
      minigamePlayedForCountRef.current = new Set();
      setMode(matchMode);
      setQuestions(deck);
      setCompetitors(initialCompetitors);
      setQIndex(0);
      setEliminatedOptions([]);
      setRecordsByQId({});
      setMaxStreak(0);
      setMinigameBonusTotal(0);
      setLastMinigameSummary('');
      setShieldSavedNotice(false);
      setShowReview(false);
      setShowNavigator(false);
      setPowerUps({
        multiplier: 1,
        multiplierRoundsLeft: 0,
        streakShield: false,
        fiftyFiftyCharges: 1,
      });
      setPhase('QUESTION');
    },
    [playerName, avatar]
  );

  // Support launching specific questions directly from Bank 30 Soal
  useEffect(() => {
    if (
      customLaunchRequest &&
      customLaunchRequest.key !== lastLaunchKeyRef.current &&
      customLaunchRequest.ids.length > 0
    ) {
      lastLaunchKeyRef.current = customLaunchRequest.key;
      const customDeck = LAJU_REAKSI_QUESTIONS.filter((q) =>
        customLaunchRequest.ids.includes(q.id)
      );
      if (customDeck.length > 0) {
        setSelectedQuestionIds(customDeck.map((q) => q.id));
        launchMatchWithDeck(customDeck, 'pilih');
      }
    }
  }, [customLaunchRequest, launchMatchWithDeck]);

  const startMatch = () => {
    soundFX.click();
    let deck: QuizQuestion[];
    if (mode === 'kilat') {
      deck = [...LAJU_REAKSI_QUESTIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
    } else if (mode === 'pilih') {
      deck = LAJU_REAKSI_QUESTIONS.filter((q) =>
        selectedQuestionIds.includes(q.id)
      );
      if (deck.length === 0) return;
    } else {
      deck = [...LAJU_REAKSI_QUESTIONS];
    }
    launchMatchWithDeck(deck, mode);
  };

  const toggleSelectQuestion = (id: number) => {
    setPreviewQuestionId(id);
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectByTopic = (topic: SubTopic) => {
    const ids = LAJU_REAKSI_QUESTIONS.filter((q) => q.topic === topic).map(
      (q) => q.id
    );
    setSelectedQuestionIds(ids);
    if (ids.length > 0) setPreviewQuestionId(ids[0]);
  };

  const resolveQuestion = useCallback(
    (chosenIdx: number) => {
      if (phase !== 'QUESTION' || !currentQuestion) return;
      if (recordsByQId[currentQuestion.id]) return;

      const isCorrect = chosenIdx === currentQuestion.correctIndex;
      let pointsEarned = 0;
      let shieldUsed = false;

      if (isCorrect) {
        soundFX.correct();
        const currentPlayer = competitors.find((c) => c.isPlayer);
        const nextStreak = (currentPlayer?.streak ?? 0) + 1;
        const base = 800;
        const streakBonus = Math.min(nextStreak - 1, 5) * 80;
        const mult = powerUps.multiplierRoundsLeft > 0 ? powerUps.multiplier : 1;
        pointsEarned = Math.round((base + streakBonus) * mult);
      } else {
        soundFX.wrong();
        if (powerUps.streakShield) {
          shieldUsed = true;
        }
      }

      setShieldSavedNotice(shieldUsed);
      setRecordsByQId((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          selectedIndex: chosenIdx,
          isCorrect,
          pointsEarned,
          timeSpentSec: 0,
        },
      }));

      setCompetitors((prev) =>
        prev.map((comp) => {
          if (comp.isPlayer) {
            const nextStreak = isCorrect
              ? comp.streak + 1
              : shieldUsed
              ? comp.streak
              : 0;
            if (nextStreak > maxStreak) setMaxStreak(nextStreak);
            return {
              ...comp,
              score: comp.score + pointsEarned,
              streak: nextStreak,
              correctCount: comp.correctCount + (isCorrect ? 1 : 0),
              lastDelta: pointsEarned,
            };
          } else {
            const acc = comp.skillAccuracy ?? 0.65;
            const botRight = Math.random() < acc;
            const botDelta = botRight
              ? Math.round(720 + Math.random() * 240 + Math.min(comp.streak, 4) * 60)
              : 0;
            return {
              ...comp,
              score: comp.score + botDelta,
              streak: botRight ? comp.streak + 1 : 0,
              correctCount: comp.correctCount + (botRight ? 1 : 0),
              lastDelta: botDelta,
            };
          }
        })
      );

      setPowerUps((prev) => {
        const nextRounds = Math.max(0, prev.multiplierRoundsLeft - 1);
        return {
          ...prev,
          multiplierRoundsLeft: nextRounds,
          multiplier: nextRounds === 0 ? 1 : prev.multiplier,
          streakShield: shieldUsed ? false : prev.streakShield,
        };
      });

      setPhase('REVEAL');
    },
    [phase, currentQuestion, recordsByQId, competitors, powerUps, maxStreak]
  );

  const jumpToQuestion = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= questions.length) return;
      soundFX.click();
      const targetQ = questions[targetIdx];
      const alreadyAnswered = !!recordsByQId[targetQ.id];
      setQIndex(targetIdx);
      setEliminatedOptions([]);
      setShieldSavedNotice(false);
      setShowNavigator(false);
      setPhase(alreadyAnswered ? 'REVEAL' : 'QUESTION');
    },
    [questions, recordsByQId]
  );

  const findNextUnansweredIndex = useCallback(
    (fromIndex: number, recMap: Record<number, AnswerRecord>): number => {
      for (let i = fromIndex + 1; i < questions.length; i++) {
        if (!recMap[questions[i].id]) return i;
      }
      for (let i = 0; i < questions.length; i++) {
        if (!recMap[questions[i].id]) return i;
      }
      return -1;
    },
    [questions]
  );

  const advanceAfterReveal = useCallback(() => {
    soundFX.click();
    const totalAnswered = Object.keys(recordsByQId).length;
    const allAnswered = totalAnswered >= questions.length;

    if (allAnswered) {
      soundFX.fanfare();
      setPhase('PODIUM');
      return;
    }

    // Trigger chemistry minigame every 5 answered questions (when >= 5 questions)
    if (
      questions.length >= 5 &&
      totalAnswered > 0 &&
      totalAnswered % 5 === 0 &&
      !minigamePlayedForCountRef.current.has(totalAnswered)
    ) {
      minigamePlayedForCountRef.current.add(totalAnswered);
      setPhase('MINIGAME');
      return;
    }

    // Show Kahoot-style standings every 3 answered questions
    if (totalAnswered > 0 && totalAnswered % 3 === 0) {
      setPhase('STANDINGS');
      return;
    }

    const nextIdx = findNextUnansweredIndex(qIndex, recordsByQId);
    if (nextIdx === -1) {
      soundFX.fanfare();
      setPhase('PODIUM');
      return;
    }

    setQIndex(nextIdx);
    setEliminatedOptions([]);
    setShieldSavedNotice(false);
    setPhase('QUESTION');
  }, [recordsByQId, questions.length, qIndex, findNextUnansweredIndex]);

  const continueFromStandings = useCallback(() => {
    soundFX.click();
    const nextIdx = findNextUnansweredIndex(qIndex, recordsByQId);
    if (nextIdx === -1) {
      setPhase('PODIUM');
      return;
    }
    setQIndex(nextIdx);
    setEliminatedOptions([]);
    setShieldSavedNotice(false);
    setPhase('QUESTION');
  }, [qIndex, recordsByQId, findNextUnansweredIndex]);

  const handleMinigameComplete = (result: MinigameResult) => {
    setMinigameBonusTotal((b) => b + result.bonusPoints);
    setLastMinigameSummary(result.summaryText);
    setCompetitors((prev) =>
      prev.map((c) =>
        c.isPlayer
          ? {
              ...c,
              score: c.score + result.bonusPoints,
              lastDelta: result.bonusPoints,
            }
          : c
      )
    );
    setPowerUps((prev) => ({
      ...prev,
      multiplier: Math.max(prev.multiplier, result.multiplierEarned),
      multiplierRoundsLeft:
        result.multiplierEarned > 1 ? 3 : prev.multiplierRoundsLeft,
      streakShield: prev.streakShield || result.streakShieldEarned,
    }));
    setPhase('STANDINGS');
  };

  // Keyboard shortcuts during quiz
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showNavigator) {
        if (e.key === 'Escape') setShowNavigator(false);
        return;
      }
      if (phase === 'QUESTION' && currentQuestion) {
        const keyMap: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
        const idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined && !eliminatedOptions.includes(idx)) {
          e.preventDefault();
          resolveQuestion(idx);
        }
      } else if (phase === 'REVEAL' && (e.key === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        advanceAfterReveal();
      } else if (
        phase === 'STANDINGS' &&
        (e.key === 'Enter' || e.code === 'Space')
      ) {
        e.preventDefault();
        continueFromStandings();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    showNavigator,
    phase,
    currentQuestion,
    eliminatedOptions,
    resolveQuestion,
    advanceAfterReveal,
    continueFromStandings,
  ]);

  // Save final score once when entering PODIUM
  useEffect(() => {
    if (phase === 'PODIUM' && !savedMatchRef.current) {
      savedMatchRef.current = true;
      const player = competitors.find((c) => c.isPlayer);
      if (player) {
        onSaveScore({
          id: `${Date.now()}`,
          playerName: player.name,
          symbol: player.symbol,
          mode,
          score: player.score,
          correctCount: player.correctCount,
          totalQuestions: questions.length,
          maxStreak,
          dateIso: new Date().toISOString(),
        });
      }
    }
  }, [phase, competitors, mode, questions.length, maxStreak, onSaveScore]);

  const useFiftyFifty = () => {
    if (
      phase !== 'QUESTION' ||
      powerUps.fiftyFiftyCharges <= 0 ||
      !currentQuestion
    ) {
      return;
    }
    soundFX.spark();
    const wrongIndices = [0, 1, 2, 3].filter(
      (i) => i !== currentQuestion.correctIndex
    );
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(shuffled);
    setPowerUps((prev) => ({
      ...prev,
      fiftyFiftyCharges: prev.fiftyFiftyCharges - 1,
    }));
  };

  const sortedCompetitors = useMemo(
    () => [...competitors].sort((a, b) => b.score - a.score),
    [competitors]
  );

  const playerComp = competitors.find((c) => c.isPlayer);
  const currentMinigameType =
    MINIGAME_SEQUENCE[
      Math.max(0, Math.floor(answeredCount / 5) - 1) % MINIGAME_SEQUENCE.length
    ];

  const previewQuestion =
    LAJU_REAKSI_QUESTIONS.find((q) => q.id === previewQuestionId) ??
    LAJU_REAKSI_QUESTIONS[0];

  // ===================== PHASE: LOBBY =====================
  if (phase === 'LOBBY') {
    const canStart = mode !== 'pilih' || selectedQuestionIds.length > 0;

    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Column: Setup & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium text-sky-400">
                Kimia SMA Kelas XI · Kinetika &amp; Laju Reaksi (30 Soal)
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
                Arena Kuis Interaktif Laju Reaksi
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                Uji pemahamanmu pada 30 soal kinetika kimia tanpa tekanan timer.
                Pilih main penuh, acak 15 soal, atau pilih sendiri nomor soal
                yang ingin kamu kerjakan.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="player-name"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Nama Pemain
                </label>
                <input
                  id="player-name"
                  type="text"
                  maxLength={22}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Masukkan nama panggilanmu"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pilih Lambang Unsur
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {ELEMENT_AVATARS.map((el) => {
                    const selected = avatar.symbol === el.symbol;
                    return (
                      <button
                        key={el.symbol}
                        type="button"
                        onClick={() => setAvatar(el)}
                        title={el.name}
                        className={`flex flex-col items-center justify-center rounded-lg border py-2 transition-colors ${
                          selected
                            ? 'border-sky-400 bg-sky-950/60 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-mono text-sm font-bold">
                          {el.symbol}
                        </span>
                        <span className="text-[10px] opacity-70 tabular-nums">
                          {el.atomicNumber}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mode Permainan (Tanpa Timer)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'penuh',
                        title: 'Penuh (30 Soal)',
                        desc: 'Semua soal + mini-game',
                      },
                      {
                        id: 'kilat',
                        title: 'Kilat (15 Soal)',
                        desc: '15 soal acak + mini-game',
                      },
                      {
                        id: 'pilih',
                        title: 'Pilih Soal Manual',
                        desc: 'Tentukan nomor soalmu',
                      },
                    ] as const
                  ).map((item) => {
                    const active = mode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          active
                            ? 'border-sky-400 bg-sky-950/40 text-white'
                            : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="block text-xs font-bold">
                          {item.title}
                        </span>
                        <span className="block text-[11px] opacity-80 mt-0.5">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual Question Selector when mode === 'pilih' */}
              {mode === 'pilih' && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white tabular-nums">
                      Terpilih: {selectedQuestionIds.length} dari 30 soal
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedQuestionIds(
                            LAJU_REAKSI_QUESTIONS.map((q) => q.id)
                          )
                        }
                        className="rounded border border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedQuestionIds([])}
                        className="rounded border border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  {/* Quick filter by subtopic */}
                  <div className="flex flex-wrap gap-1.5">
                    {SUBTOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => selectByTopic(topic)}
                        className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-sky-300 hover:border-sky-500/60"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  {/* 30-question numbered grid */}
                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 tabular-nums">
                    {LAJU_REAKSI_QUESTIONS.map((q) => {
                      const isPicked = selectedQuestionIds.includes(q.id);
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onMouseEnter={() => setPreviewQuestionId(q.id)}
                          onClick={() => toggleSelectQuestion(q.id)}
                          title={`${q.topic}: ${q.prompt}`}
                          className={`h-8 rounded-md border font-mono text-xs font-bold transition-colors ${
                            isPicked
                              ? 'border-sky-400 bg-sky-500 text-slate-950'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          {String(q.id).padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    <strong className="text-slate-200">
                      Soal {String(previewQuestion.id).padStart(2, '0')} (
                      {previewQuestion.topic}):
                    </strong>{' '}
                    {previewQuestion.prompt}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={!canStart}
                onClick={startMatch}
                className="flex-1 min-w-[180px] rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                {mode === 'pilih'
                  ? `Mulai (${selectedQuestionIds.length} Soal)`
                  : 'Mulai Pertandingan'}
              </button>
              <button
                type="button"
                onClick={onOpenBank}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-xs font-semibold text-slate-200 hover:border-sky-400 hover:text-white"
              >
                <ListChecks className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>Lihat Semua 30 Soal</span>
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Nyalakan suara efek' : 'Matikan suara efek'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                {muted ? (
                  <VolumeX className="h-4 w-4 text-rose-400" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Lab Artwork */}
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex flex-col">
            {heroImgFailed ? (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                <Sparkles className="h-12 w-12 text-sky-400 mb-3" />
                <p className="font-display text-xl font-bold text-white">
                  Laboratorium Kinetika Reaksi
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  30 Soal Terkurasi · 3 Mini-Game Interaktif
                </p>
              </div>
            ) : (
              <img
                src={heroLabImg}
                alt="Ilustrasi isometrik laboratorium kinetika kimia dan diagram energi aktivasi"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="h-64 sm:h-80 lg:h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* 3-Column Feature Strip */}
        <div className="grid gap-6 border-t border-slate-800/80 pt-8 md:grid-cols-3">
          <div className="space-y-1.5">
            <h2 className="font-display text-base font-bold text-white">
              01. 30 Soal Laju Reaksi Tanpa Timer
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Kerjakan dengan teliti tanpa tekanan waktu. Kamu bisa melihat
              seluruh daftar soal dan melompat ke nomor mana saja kapan pun.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-base font-bold text-white">
              02. 3 Mini-Game Laboratorium
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Picu tumbukan molekul, kalibrasi katalis, dan klasifikasikan faktor
              laju setiap 5 soal untuk mengaktifkan pengali skor 2x.
            </p>
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-base font-bold text-white">
              03. Persaingan Papan Peringkat
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Ketepatan dan streak jawabanmu dihitung melawan 5 rival AI
              laboratorium kimia hingga podium akhir.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ===================== PHASE: MINIGAME =====================
  if (phase === 'MINIGAME') {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            Ronde Bonus Mini-Game · Kumpulkan poin &amp; pengali sebelum lanjut
            mengerjakan soal berikutnya
          </p>
          <span className="font-mono text-sm font-bold text-sky-400 tabular-nums">
            Skor Saat Ini: {playerComp?.score.toLocaleString('id-ID') ?? 0}
          </span>
        </div>

        {currentMinigameType === 'collision' && (
          <CollisionMinigame onComplete={handleMinigameComplete} />
        )}
        {currentMinigameType === 'catalyst' && (
          <CatalystMinigame onComplete={handleMinigameComplete} />
        )}
        {currentMinigameType === 'sorter' && (
          <FactorSorterMinigame onComplete={handleMinigameComplete} />
        )}
      </section>
    );
  }

  // ===================== PHASE: STANDINGS =====================
  if (phase === 'STANDINGS') {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs font-medium text-sky-400">
                Papan Peringkat Sementara · Terjawab {answeredCount} dari{' '}
                {questions.length} Soal
              </p>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                Klasemen Arena
              </h2>
            </div>

            <button
              type="button"
              onClick={continueFromStandings}
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400"
            >
              Lanjut Soal Berikutnya (Enter)
            </button>
          </div>

          {lastMinigameSummary && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 px-4 py-3 text-sm text-emerald-200">
              Hasil Mini-Game: {lastMinigameSummary}
            </div>
          )}

          <div className="space-y-2.5 tabular-nums">
            {sortedCompetitors.map((comp, idx) => (
              <div
                key={comp.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  comp.isPlayer
                    ? 'border-sky-400 bg-sky-950/40'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 font-mono text-sm font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-mono text-xs font-bold text-white">
                    {comp.symbol}
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-white">
                      {comp.name}
                      {comp.isPlayer ? ' (Kamu)' : ''}
                    </span>
                    <span className="block text-xs text-slate-400">
                      Streak {comp.streak}x · {comp.correctCount} benar
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-mono text-base font-bold text-white">
                    {comp.score.toLocaleString('id-ID')}
                  </span>
                  {comp.lastDelta > 0 && (
                    <span className="block font-mono text-xs text-emerald-400">
                      +{comp.lastDelta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ===================== PHASE: PODIUM =====================
  if (phase === 'PODIUM') {
    const playerRank = sortedCompetitors.findIndex((c) => c.isPlayer) + 1;
    const accuracy = playerComp
      ? Math.round((playerComp.correctCount / questions.length) * 100)
      : 0;

    return (
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr] items-center">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 aspect-square">
              {trophyImgFailed ? (
                <div className="flex h-full w-full items-center justify-center text-amber-400 font-display text-2xl font-bold">
                  Peringkat #{playerRank}
                </div>
              ) : (
                <img
                  src={trophyFlaskImg}
                  alt="Piala labu Erlenmeyer emas KinetiLab"
                  referrerPolicy="no-referrer"
                  onError={() => setTrophyImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-amber-400">
                  Pertandingan Selesai · Peringkat #{playerRank} dari 6 Pemain
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {playerRank === 1
                    ? 'Juara Laboratorium Kinetika!'
                    : playerRank <= 3
                    ? 'Masuk Podium 3 Besar!'
                    : 'Kerja Bagus, Terus Berlatih!'}
                </h1>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-slate-800 py-4 tabular-nums">
                <div>
                  <span className="block text-xs text-slate-400">Total Skor</span>
                  <span className="font-mono text-xl font-bold text-white">
                    {(playerComp?.score ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Akurasi</span>
                  <span className="font-mono text-xl font-bold text-emerald-400">
                    {accuracy}%
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Streak Maks</span>
                  <span className="font-mono text-xl font-bold text-amber-400">
                    {maxStreak}x
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">
                    Bonus Mini-Game
                  </span>
                  <span className="font-mono text-xl font-bold text-sky-400">
                    +{minigameBonusTotal}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startMatch}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Main Lagi
                </button>
                <button
                  type="button"
                  onClick={() => setShowReview((r) => !r)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-600"
                >
                  {showReview ? 'Tutup Pembahasan' : 'Tinjau Semua Jawaban'}
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('LOBBY')}
                  className="rounded-lg border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white"
                >
                  Kembali ke Lobi
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <h2 className="font-display text-lg font-bold text-white mb-4">
              Klasemen Akhir Pertandingan
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2 tabular-nums">
              {sortedCompetitors.map((comp, idx) => (
                <div
                  key={comp.id}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    comp.isPlayer
                      ? 'border-sky-400 bg-sky-950/30'
                      : 'border-slate-800 bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {comp.name}
                      {comp.isPlayer ? ' (Kamu)' : ''}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {comp.score.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showReview && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              Tinjauan Pembahasan Jawaban
            </h2>
            {questions.map((q, idx) => {
              const rec = recordsByQId[q.id];
              const isRight = rec?.isCorrect;
              return (
                <article
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">
                      Soal {idx + 1} (No. {q.id}) · {q.topic}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isRight ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isRight ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                      )}
                      {isRight
                        ? `Benar (+${rec?.pointsEarned ?? 0})`
                        : 'Kurang Tepat'}
                    </span>
                  </div>
                  <p className="font-display text-base font-semibold text-white">
                    {q.prompt}
                  </p>
                  <p className="text-sm text-emerald-300">
                    Kunci: {TILE_THEMES[q.correctIndex].letter}.{' '}
                    {q.options[q.correctIndex]}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  // ===================== PHASE: QUESTION & REVEAL =====================
  if (!currentQuestion) return null;

  const progressRatio = Math.max(0, Math.min(1, answeredCount / questions.length));
  const selectedOption = currentRecord?.selectedIndex ?? null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
      {/* Compact Quiz HUD (Untimed) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 tabular-nums">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-white">
            Soal {String(qIndex + 1).padStart(2, '0')} / {questions.length}
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <span className="text-sm font-medium text-slate-300">
            Skor:{' '}
            <strong className="font-mono text-sky-400">
              {(playerComp?.score ?? 0).toLocaleString('id-ID')}
            </strong>
          </span>
          <span className="hidden sm:inline text-slate-600" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-sm text-amber-300 font-medium">
            <Flame className="h-4 w-4" aria-hidden="true" />
            Streak {playerComp?.streak ?? 0}x
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {powerUps.multiplierRoundsLeft > 0 && (
            <span className="font-mono text-xs font-bold text-amber-300">
              Pengali {powerUps.multiplier}x ({powerUps.multiplierRoundsLeft}{' '}
              soal)
            </span>
          )}
          {powerUps.streakShield && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Perisai
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowNavigator(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:border-sky-400 hover:text-white"
          >
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            Pilih / Lihat Soal
          </button>
          <button
            type="button"
            disabled={phase !== 'QUESTION' || powerUps.fiftyFiftyCharges <= 0}
            onClick={useFiftyFifty}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HelpCircle className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            50:50 ({powerUps.fiftyFiftyCharges})
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
            className="rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-slate-300 hover:text-white"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-rose-400" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar (Completion, Not Timer) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 tabular-nums">
          <span>
            Bank No. {String(currentQuestion.id).padStart(2, '0')} ·{' '}
            {currentQuestion.topic} · Tingkat {currentQuestion.difficulty}
          </span>
          <span className="font-mono text-slate-300">
            Progres: {answeredCount} / {questions.length} terjawab · Tanpa Timer
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full origin-left bg-sky-400 transition-transform duration-300"
            style={{ transform: `scaleX(${progressRatio})` }}
          />
        </div>
      </div>

      {/* Question Prompt Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white">
          {currentQuestion.prompt}
        </h2>

        {currentQuestion.formula && (
          <div className="inline-block rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 font-mono text-sm text-sky-300">
            {currentQuestion.formula}
          </div>
        )}

        {currentQuestion.table && (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="bg-slate-950 text-xs text-slate-400">
                <tr>
                  {currentQuestion.table.headers.map((h) => (
                    <th key={h} className="px-4 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50 font-mono text-slate-100">
                {currentQuestion.table.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4 Kahoot/Wayground Geometric Answer Tiles */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {currentQuestion.options.map((opt, idx) => {
          const theme = TILE_THEMES[idx];
          const ShapeIcon = theme.shape;
          const isEliminated = eliminatedOptions.includes(idx);
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQuestion.correctIndex;

          let tileClass: string = theme.base;
          if (phase === 'QUESTION') {
            if (isEliminated) tileClass = theme.dimmed;
          } else {
            if (isCorrect) tileClass = theme.correct;
            else if (isSelected) tileClass = theme.wrong;
            else tileClass = theme.dimmed;
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={phase !== 'QUESTION' || isEliminated}
              onClick={() => resolveQuestion(idx)}
              className={`group flex min-h-[76px] items-center gap-4 rounded-xl border px-5 py-4 text-left transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${tileClass}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/25 font-mono text-sm font-bold">
                <ShapeIcon className="h-4 w-4 mr-0.5" aria-hidden="true" />
                {theme.letter}
              </span>
              <span className="flex-1 text-sm sm:text-base font-semibold leading-snug">
                {opt}
              </span>
              {phase === 'REVEAL' && isCorrect && (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-white"
                  aria-hidden="true"
                />
              )}
              {phase === 'REVEAL' && isSelected && !isCorrect && (
                <XCircle
                  className="h-5 w-5 shrink-0 text-rose-200"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal Feedback & Explanation */}
      {phase === 'REVEAL' && currentRecord && (
        <div
          className={`rounded-xl border p-5 sm:p-6 space-y-3 ${
            currentRecord.isCorrect
              ? 'border-emerald-500/50 bg-emerald-950/30'
              : 'border-rose-500/50 bg-rose-950/30'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {currentRecord.isCorrect ? (
                <CheckCircle2
                  className="h-6 w-6 text-emerald-400"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  className="h-6 w-6 text-rose-400"
                  aria-hidden="true"
                />
              )}
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {currentRecord.isCorrect
                    ? `Tepat! +${currentRecord.pointsEarned} Poin`
                    : 'Kurang Tepat! +0 Poin'}
                </h3>
                {shieldSavedNotice && (
                  <p className="text-xs font-medium text-sky-300">
                    Perisai Streak melindungimu! Streak tetap bertahan.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={advanceAfterReveal}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-slate-200"
            >
              {answeredCount >= questions.length
                ? 'Lihat Hasil Akhir'
                : 'Lanjut (Enter)'}
            </button>
          </div>

          <p className="text-sm leading-relaxed text-slate-200">
            <strong className="text-white">Pembahasan:</strong>{' '}
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Question Navigator Modal ("Pilih / Lihat Semua Soal") */}
      {showNavigator && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Daftar semua soal pertandingan"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Daftar Semua Soal Pertandingan ({questions.length} Soal)
                </h3>
                <p className="text-xs text-slate-400">
                  Klik salah satu soal untuk langsung berpindah ke nomor tersebut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNavigator(false)}
                aria-label="Tutup daftar soal"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-2.5">
              {questions.map((q, idx) => {
                const rec = recordsByQId[q.id];
                const isCurrent = idx === qIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => jumpToQuestion(idx)}
                    className={`flex w-full items-start justify-between gap-4 rounded-xl border p-3.5 text-left transition-colors ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-950/40'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800 font-mono text-xs font-bold text-white tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="block text-[11px] font-medium text-slate-400">
                          Bank No. {q.id} · {q.topic} · {q.difficulty}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-slate-100 line-clamp-2">
                          {q.prompt}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        rec
                          ? rec.isCorrect
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                          : isCurrent
                          ? 'text-sky-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {rec
                        ? rec.isCorrect
                          ? 'Benar'
                          : 'Salah'
                        : isCurrent
                        ? 'Aktif'
                        : 'Belum'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
