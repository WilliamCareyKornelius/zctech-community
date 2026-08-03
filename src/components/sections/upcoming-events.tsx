import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { events } from '@/lib/content';

export function UpcomingEvents() {
  const upcoming = events
    .filter((e) => new Date(e.eventDate) > new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <section className="w-full bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Kegiatan Mendatang</span>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Jangan Lewatkan</h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white"
          >
            Lihat semua kegiatan
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="flex snap-x gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {upcoming.map((event, index) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group w-[85vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black sm:w-auto"
            >
              <div className="relative h-44 w-full">
                <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
                <span
                className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  event.status === 'upcoming'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-zinc-500/20 text-zinc-300'
                }`}
              >
                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white transition group-hover:text-emerald-400">
                  {event.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(event.eventDate)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                </div>
                <Link
                  href={`/events/${event.slug}`}
                  className="mt-5 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Lihat detail →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
