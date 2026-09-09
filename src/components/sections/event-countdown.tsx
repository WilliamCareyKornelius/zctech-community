'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { events, siteConfig, getEventEffectiveStatus, isEventRegistrationClosed } from '@/lib/content';
import { formatEventWithTimeWITA } from '@/lib/date';

function getNearestUpcoming() {
  return events
    .filter((e) => getEventEffectiveStatus(e) !== 'completed')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0];
}

function useCountdown(target: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetTime = new Date(target).getTime();

    const tick = () => {
      const diff = targetTime - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export function EventCountdown() {
  const event = getNearestUpcoming();
  const { days, hours, minutes, seconds } = useCountdown(event?.eventDate ?? '');

  if (!event) return null;

  const isClosed = isEventRegistrationClosed(event);
  const formatDate = (iso: string) => formatEventWithTimeWITA(iso);

  return (
    <section className="w-full bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 to-background p-8 sm:p-12 dark:from-emerald-950/30">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
          <Calendar className="h-3.5 w-3.5" />
          Event Terdekat
        </div>

        <h2 className="text-2xl font-bold text-foreground sm:text-4xl">{event.title}</h2>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-6">
          {[
            { value: days, label: 'Hari' },
            { value: hours, label: 'Jam' },
            { value: minutes, label: 'Menit' },
            { value: seconds, label: 'Detik' },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-muted p-3 sm:p-5"
            >
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-300 sm:text-4xl">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {isClosed ? (
            <Link
              href={event.regLink || `/events/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-muted border border-border/80 px-6 py-3 text-sm font-bold text-muted-foreground transition hover:bg-muted/60"
            >
              🔒 Pendaftaran Ditutup (Cek E-Tiket)
            </Link>
          ) : (
            <a
              href={event.regLink || siteConfig.discordInvite}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
            >
              Daftar / Gabung
            </a>
          )}
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Detail Kegiatan
          </Link>
        </div>
      </div>
    </section>
  );
}
