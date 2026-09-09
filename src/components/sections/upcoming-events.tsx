import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { events, getEventEffectiveStatus, isEventRegistrationClosed } from '@/lib/content';
import { formatEventDateWITA } from '@/lib/date';

export function UpcomingEvents() {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  if (sortedEvents.length === 0) return null;

  const formatDate = (iso: string) => formatEventDateWITA(iso);

  return (
    <section className="w-full bg-muted px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Kegiatan Komunitas</span>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Agenda Terkini</h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Lihat semua kegiatan
            <span className="text-lg">→</span>
          </Link>
        </div>

        <div className={
          sortedEvents.length === 1
            ? 'grid grid-cols-1 place-items-center gap-6'
            : 'flex snap-x gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:overflow-visible'
        }>
          {sortedEvents.map((event, index) => {
            const effectiveStatus = getEventEffectiveStatus(event);
            const isCompleted = effectiveStatus === 'completed';
            const isClosed = isEventRegistrationClosed(event);

            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group overflow-hidden rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-border/60 bg-card/60 opacity-80 filter grayscale hover:grayscale-0 hover:opacity-100'
                    : 'border-border bg-background hover:border-emerald-500/30'
                } ${sortedEvents.length === 1 ? 'w-full max-w-2xl' : 'w-[85vw] flex-shrink-0 snap-start sm:w-auto'}`}
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
                        ? isClosed
                          ? 'bg-rose-500/90 text-white font-bold'
                          : 'bg-emerald-500/90 text-white font-bold'
                        : effectiveStatus === 'ongoing'
                        ? 'bg-amber-500/90 text-white font-bold animate-pulse'
                        : 'bg-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    {effectiveStatus === 'upcoming'
                      ? isClosed
                        ? 'Pendaftaran Ditutup'
                        : 'Upcoming'
                      : effectiveStatus === 'ongoing'
                      ? 'Sedang Berlangsung'
                      : 'Selesai'}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className={`text-lg sm:text-xl font-bold transition ${
                    isCompleted
                      ? 'text-muted-foreground group-hover:text-foreground'
                      : 'text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
                  }`}>
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                      className={`text-xs sm:text-sm font-semibold transition ${
                        isCompleted
                          ? 'text-muted-foreground hover:text-foreground'
                          : 'text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'
                      }`}
                    >
                      Lihat detail →
                    </Link>
                    {event.regLink && !isCompleted && (
                      isClosed ? (
                        <Link
                          href={event.regLink}
                          className="rounded-lg bg-muted text-muted-foreground px-3 py-1.5 text-xs font-bold border border-border transition hover:bg-muted/80"
                        >
                          Ditutup (Cek Tiket)
                        </Link>
                      ) : event.regLink.startsWith('http') ? (
                        <a
                          href={event.regLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                          Daftar Gratis
                        </a>
                      ) : (
                        <Link
                          href={event.regLink}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600"
                        >
                          Daftar Gratis
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
