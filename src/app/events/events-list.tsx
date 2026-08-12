'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
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
    <section className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black"
            >
              <div className="relative h-44">
                <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    event.status === 'upcoming'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : event.status === 'ongoing'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-zinc-500/20 text-zinc-300'
                  }`}
                >
                  {event.status === 'upcoming' ? 'Upcoming' : event.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400">
                  {event.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.eventDate)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                </div>
                <Link href={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  Lihat detail →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
