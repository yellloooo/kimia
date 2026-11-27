import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { LeaderboardView } from './components/LeaderboardView';
import { MinigameLabView } from './components/MinigameLabView';
import { QuestionBankView } from './components/QuestionBankView';
import { QuizArena } from './components/QuizArena';
import { TopBar } from './components/TopBar';
import { AppSection, LeaderboardEntry } from './types/quiz';

const STORAGE_KEY = 'kinetilab_leaderboard_v1';

export default function App() {
  const [section, setSection] = useState<AppSection>('arena');
  const [isMatchActive, setIsMatchActive] = useState<boolean>(false);
  const [exitSignal, setExitSignal] = useState<number>(0);
  const [canDownloadHtml, setCanDownloadHtml] = useState<boolean>(false);
  const [customLaunchRequest, setCustomLaunchRequest] = useState<{
    ids: number[];
    key: number;
  } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
    } catch {
      // Ignore storage quota errors
    }
  }, [leaderboard]);

  useEffect(() => {
    if (window.location.protocol === 'file:') return;
    fetch('/kinetilab-laju-reaksi.html', { method: 'HEAD' })
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        const disp = res.headers.get('content-disposition') || '';
        if (res.ok && ct.includes('text/html') && disp.includes('attachment')) {
          setCanDownloadHtml(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveScore = useCallback((entry: LeaderboardEntry) => {
    setLeaderboard((prev) => [entry, ...prev].slice(0, 25));
  }, []);

  const handleClearLeaderboard = useCallback(() => {
    setLeaderboard([]);
  }, []);

  const handleNavigate = (target: AppSection) => {
    if (isMatchActive && target !== 'arena') {
      setIsMatchActive(false);
      setExitSignal((s) => s + 1);
    }
    setSection(target);
  };

  const handleStartWithQuestions = useCallback((questionIds: number[]) => {
    setCustomLaunchRequest({ ids: questionIds, key: Date.now() });
    setSection('arena');
  }, []);

  const handlePrimaryAction = () => {
    if (isMatchActive) {
      setIsMatchActive(false);
      setExitSignal((s) => s + 1);
      setSection('arena');
    } else {
      setSection('arena');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const nameInput = document.getElementById('player-name');
      nameInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100">
      <TopBar
        activeSection={section}
        isMatchActive={isMatchActive}
        onNavigate={handleNavigate}
        onPrimaryAction={handlePrimaryAction}
      />

      <main className="flex-1">
        {section === 'arena' && (
          <QuizArena
            onMatchActiveChange={setIsMatchActive}
            onSaveScore={handleSaveScore}
            onOpenBank={() => handleNavigate('bank')}
            customLaunchRequest={customLaunchRequest}
            exitSignal={exitSignal}
          />
        )}
        {section === 'minigames' && <MinigameLabView />}
        {section === 'bank' && (
          <QuestionBankView onStartWithQuestions={handleStartWithQuestions} />
        )}
        {section === 'leaderboard' && (
          <LeaderboardView
            entries={leaderboard}
            onClear={handleClearLeaderboard}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>KinetiLab Arena · Materi Kimia Laju Reaksi (30 Soal)</span>
          <div className="flex flex-wrap items-center gap-4">
            <span>Teori Tumbukan · Faktor Laju · Hukum Laju &amp; Orde Reaksi</span>
            {canDownloadHtml && (
              <a
                href="/kinetilab-laju-reaksi.html"
                download="kinetilab-laju-reaksi.html"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 font-semibold text-sky-300 hover:border-sky-400 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Unduh File HTML
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
