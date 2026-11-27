import { Trash2, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types/quiz';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onClear: () => void;
}

const MODE_LABELS: Record<string, string> = {
  penuh: 'Penuh (30 Soal)',
  kilat: 'Kilat (15 Soal)',
  pilih: 'Pilih Soal Manual',
  klasik: 'Klasik (20 Soal)',
  latihan: 'Latihan Santai',
};

export function LeaderboardView({ entries, onClear }: LeaderboardViewProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-medium text-amber-400">
            Rekam Jejak Skor Arena
          </p>
          <h1 className="font-display text-3xl font-bold text-white mt-1">
            Papan Peringkat Pemain
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Catatan hasil pertandingan kuis Laju Reaksi terbaik yang tersimpan
            di perangkat ini.
          </p>
        </div>

        {sorted.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-rose-500/50 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Hapus Riwayat
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-10 text-center space-y-3">
          <Trophy
            className="mx-auto h-10 w-10 text-slate-600"
            aria-hidden="true"
          />
          <p className="font-display text-lg font-semibold text-white">
            Belum ada catatan pertandingan
          </p>
          <p className="text-sm text-slate-400">
            Selesaikan satu pertandingan di Arena Kuis untuk mencatat skormu di
            papan peringkat.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-sm tabular-nums">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-xs text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Peringkat</th>
                <th className="px-4 py-3 font-semibold">Pemain</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold text-right">Akurasi</th>
                <th className="px-4 py-3 font-semibold text-right">Streak Maks</th>
                <th className="px-4 py-3 font-semibold text-right">Total Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sorted.map((entry, idx) => {
                const accuracy = Math.round(
                  (entry.correctCount / entry.totalQuestions) * 100
                );
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                      #{idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 font-mono text-xs font-bold text-sky-300">
                          {entry.symbol}
                        </span>
                        <div>
                          <span className="block font-semibold text-white">
                            {entry.playerName}
                          </span>
                          <span className="block text-xs text-slate-400">
                            {new Date(entry.dateIso).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {MODE_LABELS[entry.mode] ?? entry.mode}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-emerald-400">
                      {entry.correctCount}/{entry.totalQuestions} ({accuracy}%)
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-amber-300">
                      {entry.maxStreak}x
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-base font-bold text-white">
                      {entry.score.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
