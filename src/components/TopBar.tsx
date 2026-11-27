import { AppSection } from '../types/quiz';

interface TopBarProps {
  activeSection: AppSection;
  isMatchActive: boolean;
  onNavigate: (section: AppSection) => void;
  onPrimaryAction: () => void;
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'arena', label: 'Arena Kuis' },
  { id: 'minigames', label: 'Mini-Game Lab' },
  { id: 'bank', label: 'Bank 30 Soal' },
  { id: 'leaderboard', label: 'Papan Peringkat' },
];

export function TopBar({
  activeSection,
  isMatchActive,
  onNavigate,
  onPrimaryAction,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0B1120]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('arena')}
          className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
        >
          KinetiLab
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isActive
                    ? 'border-sky-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrimaryAction}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              isMatchActive
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
            }`}
          >
            {isMatchActive ? 'Keluar Arena' : 'Mulai Kuis'}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <nav
        aria-label="Navigasi seluler"
        className="flex md:hidden items-center justify-between gap-2 overflow-x-auto border-t border-slate-800/80 px-4 py-2 text-xs font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap shrink-0 px-2 py-1 rounded transition-colors ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
