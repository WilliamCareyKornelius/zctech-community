'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/types';

const categories = ['Semua', 'writeup', 'tutorial', 'news', 'opinion'];

const label: Record<string, string> = {
  writeup: 'Writeup',
  tutorial: 'Tutorial',
  news: 'News',
  opinion: 'Opini',
};

export function BlogList({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    if (category === 'Semua') return posts;
    return posts.filter((p) => p.category === category);
  }, [posts, category]);

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
              {label[c] || c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((post) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-black p-4"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden rounded-xl">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      {label[post.category]}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white group-hover:text-emerald-400">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{post.author}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} menit baca
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
