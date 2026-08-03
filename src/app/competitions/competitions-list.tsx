'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { Competition } from '@/lib/types';

const categories = ['Semua', 'CTF', 'hackathon', 'bug bounty', 'UI/UX', 'competitive programming'];

export function CompetitionsList({ competitions }: { competitions: Competition[] }) {
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    const list =
      category === 'Semua'
        ? competitions
        : competitions.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    return list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [competitions, category]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap gap-2">
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
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((comp) => (
              <motion.div
                key={comp.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black"
              >
                <div className="relative h-44 w-full">
                  <img src={comp.coverImage} alt={comp.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {comp.category}
                  </span>
                  {comp.prizeInfo && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                      <Trophy className="h-3.5 w-3.5" /> {comp.prizeInfo}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400">
                  {comp.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{comp.organizer}</p>
                <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{comp.description}</p>

                <div className="mt-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Deadline: {formatDate(comp.deadline)}
                  </span>
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    href={`/competitions/${comp.slug}`}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                  >
                    Detail
                  </Link>
                  <a
                    href={comp.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300"
                  >
                    <ExternalLink className="h-4 w-4" /> Link resmi
                  </a>
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
