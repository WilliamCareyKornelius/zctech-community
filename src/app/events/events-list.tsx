'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { getEventEffectiveStatus } from '@/lib/content';
import type { Event } from '@/lib/types';

export function EventsList({ events }: { events: Event[] }) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <section className="w-full bg-muted px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const effectiveStatus = getEventEffectiveStatus(event);
            const isCompleted = effectiveStatus === 'completed';

            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`group overflow-hidden rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-border/60 bg-card/60 opacity-80 filter grayscale hover:grayscale-0 hover:opacity-100'
                    : 'border-border bg-background hover:border-emerald-500/30'
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isCompleted ? 'contrast-90 brightness-90' : ''
                    }`}
                  />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${
                      effectiveStatus === 'upcoming'
                        ? 'bg-emerald-500/90 text-white font-bold'
                        : effectiveStatus === 'ongoing'
                        ? 'bg-amber-500/90 text-white font-bold animate-pulse'
                        : 'bg-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    {effectiveStatus === 'upcoming'
                      ? 'Upcoming'
                      : effectiveStatus === 'ongoing'
                      ? 'Sedang Berlangsung'
                      : 'Selesai'}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`text-lg font-bold transition ${
                    isCompleted
                      ? 'text-muted-foreground group-hover:text-foreground'
                      : 'text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
                  }`}>
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                      {formatDate(event.eventDate)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      {event.location}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/50">
                    <Link
                      href={`/events/${event.slug}`}
                      className={`text-sm font-semibold transition ${
                        isCompleted
                          ? 'text-muted-foreground hover:text-foreground'
                          : 'text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'
                      }`}
                    >
                      Lihat detail →
                    </Link>
                    {event.regLink && !isCompleted && (
                      <a
                        href={event.regLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
                      >
                        Daftar
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
