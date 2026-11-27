import { useState } from 'react';
import { MinigameType } from '../types/quiz';
import { CatalystMinigame } from './CatalystMinigame';
import { CollisionMinigame } from './CollisionMinigame';
import { FactorSorterMinigame } from './FactorSorterMinigame';

const GAMES: { id: MinigameType; title: string; subtitle: string }[] = [
  {
    id: 'collision',
    title: 'Tabrakan Molekul',
    subtitle: 'Kendalikan suhu & picu tumbukan efektif',
  },
  {
    id: 'catalyst',
    title: 'Kalibrasi Katalis',
    subtitle: 'Turunkan energi aktivasi tepat di puncak transisi',
  },
  {
    id: 'sorter',
    title: 'Racik Faktor Laju',
    subtitle: 'Klasifikasi cepat fenomena reaksi kimia',
  },
];

export function MinigameLabView() {
  const [selected, setSelected] = useState<MinigameType>('collision');

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs font-medium text-amber-400">
          Mode Latihan Mandiri · Bonus Poin & Pengali Skor
        </p>
        <h1 className="font-display text-3xl font-bold text-white mt-1">
          Mini-Game Laboratorium Kinetika
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Dalam pertandingan kuis, mini-game muncul otomatis setiap 4 soal untuk
          mengumpulkan bonus poin dan pengali skor. Kamu juga bisa berlatih
          langsung di sini.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {GAMES.map((game) => {
          const active = selected === game.id;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelected(game.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? 'border-sky-400 bg-sky-950/30 text-white'
                  : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="block font-display text-base font-bold">
                {game.title}
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                {game.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        {selected === 'collision' && (
          <CollisionMinigame standalone onComplete={() => {}} />
        )}
        {selected === 'catalyst' && (
          <CatalystMinigame standalone onComplete={() => {}} />
        )}
        {selected === 'sorter' && (
          <FactorSorterMinigame standalone onComplete={() => {}} />
        )}
      </div>
    </section>
  );
}
