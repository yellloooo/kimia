export type SubTopic =
  | 'Konsep Laju'
  | 'Teori Tumbukan'
  | 'Faktor Laju'
  | 'Hukum Laju & Orde';

export type Difficulty = 'Dasar' | 'Menengah' | 'Tantangan';

export interface ExperimentTable {
  headers: string[];
  rows: string[][];
}

export interface QuizQuestion {
  id: number;
  topic: SubTopic;
  difficulty: Difficulty;
  prompt: string;
  formula?: string;
  table?: ExperimentTable;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export type GameMode = 'penuh' | 'kilat' | 'pilih';

export type AppSection = 'arena' | 'minigames' | 'bank' | 'leaderboard';

export type MinigameType = 'collision' | 'catalyst' | 'sorter';

export interface ElementAvatar {
  symbol: string;
  name: string;
  atomicNumber: number;
  accentHex: string;
}

export interface Competitor {
  id: string;
  name: string;
  symbol: string;
  accentHex: string;
  score: number;
  streak: number;
  correctCount: number;
  isPlayer: boolean;
  lastDelta: number;
  skillAccuracy?: number;
}

export interface PowerUpState {
  multiplier: number; // 1, 1.5, or 2
  multiplierRoundsLeft: number;
  streakShield: boolean;
  fiftyFiftyCharges: number;
}

export interface AnswerRecord {
  questionId: number;
  selectedIndex: number | null;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSec: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  symbol: string;
  mode: GameMode;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxStreak: number;
  dateIso: string;
}
