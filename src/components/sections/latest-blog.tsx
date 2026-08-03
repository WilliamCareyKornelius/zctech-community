import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { posts } from '@/lib/content';

export function LatestBlog() {
  const latest = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3);

  return (
    <section className="w-full bg-black px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Artikel Terbaru</span>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Dari Blog Komunitas</h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white"
          >
            Lihat semua artikel
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {latest.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-white/20"
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
                    {post.category}
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
        </div>
      </div>
    </section>
  );
}
