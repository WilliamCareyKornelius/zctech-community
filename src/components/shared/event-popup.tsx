'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { events, getEventEffectiveStatus } from '@/lib/content';

export function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ambil event terdekat yang belum selesai
  const activeEvent = events
    .filter((e) => getEventEffectiveStatus(e) !== 'completed')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0];

  useEffect(() => {
    setMounted(true);

    if (!activeEvent) return;

    // Cek apakah user sudah pernah melihat/menutup popup event ini
    const storageKey = `zctech_event_popup_seen_${activeEvent.id}`;
    const hasSeen = localStorage.getItem(storageKey);

    if (!hasSeen) {
      // Tampilkan popup dengan delay halus 900ms setelah halaman siap
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [activeEvent]);

  // Handle close popup & simpan ke localStorage
  const handleClose = () => {
    if (activeEvent) {
      const storageKey = `zctech_event_popup_seen_${activeEvent.id}`;
      localStorage.setItem(storageKey, 'true');
    }
    setIsOpen(false);
  };

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeEvent]);

  if (!mounted || !activeEvent || !isOpen) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg sm:max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-card/95 text-card-foreground shadow-2xl shadow-emerald-950/40 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-popup-title"
          >
            {/* Top Glowing Gradient Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shrink-0" />

            {/* Floating Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-md transition-all hover:bg-black/90 hover:text-white hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Tutup pop up"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
              {/* Event Image / Poster Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/40 shadow-inner group">
                <img
                  src={activeEvent.coverImage}
                  alt={activeEvent.title}
                  className="w-full h-44 sm:h-56 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black shadow-lg backdrop-blur-md">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  Upcoming Event
                </div>

                {activeEvent.price && (
                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                    {activeEvent.price}
                  </div>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h2
                  id="event-popup-title"
                  className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-snug"
                >
                  {activeEvent.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  "Cybersecurity & IT Infrastructure Awareness for the Future Generation"
                </p>
              </div>

              {/* Event Quick Details Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/60 px-3 py-2">
                  <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">{formatDate(activeEvent.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/60 px-3 py-2">
                  <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">14.00 - 16.30 WITA</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-border/60 bg-muted/60 px-3 py-2">
                  <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">{activeEvent.location}</span>
                </div>
              </div>

              {/* Speaker & Benefits Highlights */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-4 text-xs space-y-2">
                {activeEvent.speaker && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Pemateri:</span>
                    <span className="text-foreground font-semibold">{activeEvent.speaker}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Topik:</span>
                  <span>Cybersecurity Seminar, Live Ethical Hacking Demo, & Smart Agriculture (IoT)</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Fasilitas:</span>
                  <span className="text-emerald-500 dark:text-emerald-300 font-semibold">Free E-Certificate & Interactive Showcase</span>
                </div>
              </div>

              {/* Action Buttons (Mobile First: stacked & tap-friendly) */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                {activeEvent.regLink && (
                  <a
                    href={activeEvent.regLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 active:scale-[0.98] text-center"
                  >
                    <span>Daftar Sekarang (Gratis)</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href={`/events/${activeEvent.slug}`}
                  onClick={handleClose}
                  className="flex items-center justify-center rounded-xl border border-border bg-muted/80 px-4 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98] text-center"
                >
                  Lihat Detail
                </Link>
              </div>

              {/* Dismiss footer note */}
              <div className="text-center pt-1">
                <button
                  onClick={handleClose}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition underline underline-offset-4"
                >
                  Tutup dan jangan tampilkan lagi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
