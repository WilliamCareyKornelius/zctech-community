'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Users, Layers } from 'lucide-react';
import type { Training } from '@/lib/types';

const categories = ['Semua', 'cybersecurity', 'networking', 'programming'];
const levels = ['Semua', 'beginner', 'intermediate', 'advanced'];

const levelLabel: Record<string, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
};

export function TrainingList({ programs }: { programs: Training[] }) {
  const [category, setCategory] = useState('Semua');
  const [level, setLevel] = useState('Semua');

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const catMatch = category === 'Semua' || p.category === category;
      const levelMatch = level === 'Semua' || p.level === level;
      return catMatch && levelMatch;
    });
  }, [programs, category, level]);

  return (
    <section className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  category === c
                    ? 'bg-emerald-400 text-black'
                    : 'border border-white/10 bg-black text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {c === 'Semua' ? c : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  level === l
                    ? 'bg-emerald-400 text-black'
                    : 'border border-white/10 bg-black text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {l === 'Semua' ? l : levelLabel[l]}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((program) => (
              <motion.div
                key={program.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black"
              >
                <div className="relative h-44 w-full">
                  <img src={program.coverImage} alt={program.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {program.category}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                    {levelLabel[program.level]}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{program.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{program.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {program.format}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {program.trainer}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <a
                    href="https://zctech.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Lihat di zctech.id →
                  </a>
                  <BookOpen className="h-5 w-5 text-zinc-600" />
                </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
