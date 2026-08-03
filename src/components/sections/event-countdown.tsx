'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { events, siteConfig } from '@/lib/content';

function getNearestUpcoming() {
  const now = new Date().getTime();
  return events
    .filter((e) => new Date(e.eventDate).getTime() > now)
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
  if (!event) return null;

  const { days, hours, minutes, seconds } = useCountdown(event.eventDate);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <section className="w-full bg-black px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/30 to-black p-8 sm:p-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <Calendar className="h-3.5 w-3.5" />
          Event Terdekat
        </div>

        <h2 className="text-2xl font-bold text-white sm:text-4xl">{event.title}</h2>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-zinc-400">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4" />
            {formatDate(event.eventDate)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
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
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-zinc-950 p-3 sm:p-5"
            >
              <span className="text-2xl font-extrabold text-emerald-400 sm:text-4xl">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500 sm:text-xs">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={event.regLink || siteConfig.discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
          >
            Daftar / Gabung
          </a>
          <a
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Detail Kegiatan
          </a>
        </div>
      </div>
    </section>
  );
}
