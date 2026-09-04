import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { CopyButton } from '@/components/shared/copy-button';
import { events, siteConfig, getEventEffectiveStatus } from '@/lib/content';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: 'Kegiatan tidak ditemukan' };
  return {
    title: event.title,
    description: event.description,
    openGraph: { title: event.title, description: event.description, images: [{ url: event.coverImage }] },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();

  const effectiveStatus = getEventEffectiveStatus(event);
  const isCompleted = effectiveStatus === 'completed';

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const shareUrl = `${siteConfig.url}/events/${event.slug}`;

  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          description: event.description,
          startDate: event.eventDate,
          endDate: event.endDate || event.eventDate,
          eventStatus: isCompleted ? 'https://schema.org/EventMovedOnline' : 'https://schema.org/EventScheduled',
          eventAttendanceMode: event.location.toLowerCase().includes('online') ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
          location: { '@type': 'Place', name: event.location },
          image: event.coverImage,
          url: shareUrl,
        }}
      />

      <section className="w-full bg-background px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/events" className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200 font-medium inline-flex items-center gap-1">
            ← Kembali ke kegiatan
          </Link>
          <h1 className={`mt-4 text-3xl font-extrabold sm:text-5xl ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
            {event.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5">
              <Calendar className="h-4 w-4 text-emerald-500" />
              {formatDate(event.eventDate)}
            </span>
            {event.endDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5">
                <Clock className="h-4 w-4 text-emerald-500" />
                Selesai: {formatDate(event.endDate)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5">
              <MapPin className="h-4 w-4 text-emerald-500" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 capitalize">
              <Users className="h-4 w-4 text-emerald-500" />
              {event.type}
            </span>
            {event.price && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-3.5 py-1.5">
                {event.price}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className={`relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${
              isCompleted ? 'filter grayscale opacity-90' : ''
            }`}>
              <img src={event.coverImage} alt={event.title} className="w-full h-auto max-h-[520px] object-contain mx-auto bg-black/40" />
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground">Tentang Kegiatan</h2>
              <div className="space-y-4 text-muted-foreground whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {event.content}
              </div>
            </div>

            {event.topics && event.topics.length > 0 && (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-bold text-foreground text-base mb-3">Topik Pembahasan</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {event.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Status Kegiatan</h3>
              <div className="mt-3">
                <span
                  className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-bold ${
                    effectiveStatus === 'upcoming'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : effectiveStatus === 'ongoing'
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 animate-pulse'
                      : 'bg-zinc-700/30 text-muted-foreground'
                  }`}
                >
                  {effectiveStatus === 'upcoming'
                    ? '● Akan Datang'
                    : effectiveStatus === 'ongoing'
                    ? '● Sedang Berlangsung'
                    : '✕ Kegiatan Telah Selesai'}
                </span>
              </div>
              {isCompleted && (
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Pendaftaran untuk kegiatan ini telah ditutup karena acara sudah terlaksana.
                </p>
              )}
            </div>

            {event.speaker && (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">Pemateri</h3>
                <p className="mt-2 text-base font-bold text-foreground">{event.speaker}</p>
              </div>
            )}

            {event.regLink && !isCompleted && (
              event.regLink.startsWith('http') ? (
                <a
                  href={event.regLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-emerald-500 py-3.5 text-center font-bold text-white transition hover:bg-emerald-600 shadow-md hover:shadow-emerald-500/20"
                >
                  Daftar Sekarang (Gratis)
                </a>
              ) : (
                <Link
                  href={event.regLink}
                  className="block w-full rounded-xl bg-emerald-500 py-3.5 text-center font-bold text-white transition hover:bg-emerald-600 shadow-md hover:shadow-emerald-500/20"
                >
                  Daftar Sekarang (Gratis)
                </Link>
              )
            )}

            {event.benefits && event.benefits.length > 0 && (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground mb-3">Benefit Peserta</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {event.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-bold text-foreground">Bagikan</h3>
              <div className="mt-3 flex gap-2 text-sm">
                <CopyButton text={shareUrl} label="Copy link" />
                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(event.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:bg-card"
                >
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-2 text-muted-foreground hover:bg-card"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
