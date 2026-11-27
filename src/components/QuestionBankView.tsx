import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Search } from 'lucide-react';
import { LAJU_REAKSI_QUESTIONS } from '../data/questions';
import { SubTopic } from '../types/quiz';

const TOPICS: ('Semua' | SubTopic)[] = [
  'Semua',
  'Konsep Laju',
  'Teori Tumbukan',
  'Faktor Laju',
  'Hukum Laju & Orde',
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

interface QuestionBankViewProps {
  onStartWithQuestions?: (questionIds: number[]) => void;
}

export function QuestionBankView({ onStartWithQuestions }: QuestionBankViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<'Semua' | SubTopic>('Semua');
  const [query, setQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  const filtered = LAJU_REAKSI_QUESTIONS.filter((q) => {
    const matchTopic = selectedTopic === 'Semua' || q.topic === selectedTopic;
    const matchText =
      query.trim() === '' ||
      q.prompt.toLowerCase().includes(query.toLowerCase()) ||
      q.topic.toLowerCase().includes(query.toLowerCase());
    return matchTopic && matchText;
  });

  const toggleReveal = (id: number) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    const mapped: Record<number, boolean> = {};
    filtered.forEach((q) => {
      mapped[q.id] = next;
    });
    setRevealedIds(mapped);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-medium text-sky-400">
            Kurikulum Kimia SMA · 30 Soal Terkurasi
          </p>
          <h1 className="font-display text-3xl font-bold text-white mt-1">
            Bank Soal Materi Laju Reaksi
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Lihat seluruh 30 soal beserta data percobaan, kunci jawaban, dan
            pembahasan lengkap, atau langsung mainkan soal terpilih di arena.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari topik atau kata kunci..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Topic Filter Tabs & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-900 p-1.5 border border-slate-800">
          {TOPICS.map((topic) => {
            const active = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600"
          >
            {allExpanded ? 'Tutup Semua Kunci' : 'Buka Semua Kunci'}
          </button>
          {onStartWithQuestions && filtered.length > 0 && (
            <button
              type="button"
              onClick={() => onStartWithQuestions(filtered.map((q) => q.id))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Mainkan {filtered.length} Soal Ini
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-sm text-slate-400">
          Tidak ada soal yang cocok dengan pencarianmu.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => {
            const isOpen = !!revealedIds[q.id];
            return (
              <article
                key={q.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    Soal {String(q.id).padStart(2, '0')} · {q.topic} · Tingkat{' '}
                    {q.difficulty}
                  </span>
                  {onStartWithQuestions && (
                    <button
                      type="button"
                      onClick={() => onStartWithQuestions([q.id])}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      Uji Soal Ini
                    </button>
                  )}
                </div>

                <h2 className="mt-2 font-display text-lg font-semibold text-white">
                  {q.prompt}
                </h2>

                {q.formula && (
                  <div className="mt-3 inline-block rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-sm text-sky-300">
                    {q.formula}
                  </div>
                )}

                {q.table && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-sm tabular-nums">
                      <thead className="bg-slate-950 text-xs text-slate-400">
                        <tr>
                          {q.table.headers.map((h) => (
                            <th key={h} className="px-4 py-2.5 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/50 font-mono text-slate-200">
                        {q.table.rows.map((row, rIdx) => (
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

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, idx) => {
                    const isAnswer = idx === q.correctIndex;
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border px-3.5 py-2.5 text-sm ${
                          isOpen && isAnswer
                            ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-medium'
                            : 'border-slate-800 bg-slate-950/50 text-slate-300'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2 text-slate-400">
                          {OPTION_LETTERS[idx]}.
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <button
                    type="button"
                    onClick={() => toggleReveal(q.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        Sembunyikan Pembahasan
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        Lihat Kunci & Pembahasan
                      </>
                    )}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm text-slate-200">
                    <p className="font-semibold text-emerald-400">
                      Jawaban Benar: {OPTION_LETTERS[q.correctIndex]}
                    </p>
                    <p className="mt-1 leading-relaxed text-slate-300">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
