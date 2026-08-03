import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { CopyButton } from '@/components/shared/copy-button';
import { events, siteConfig } from '@/lib/content';

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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
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
          eventStatus: event.status === 'completed' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
          eventAttendanceMode: event.location.toLowerCase().includes('online') ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
          location: { '@type': 'Place', name: event.location },
          image: event.coverImage,
          url: shareUrl,
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/events" className="text-sm text-emerald-400 hover:text-emerald-300">← Kembali ke kegiatan</Link>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">{event.title}</h1>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
              <Calendar className="h-4 w-4" />
              {formatDate(event.eventDate)}
            </span>
            {event.endDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
                <Clock className="h-4 w-4" />
                Selesai: {formatDate(event.endDate)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1 capitalize">
              <Users className="h-4 w-4" />
              {event.type}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
              <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-8 space-y-4 text-zinc-300">
              <p className="text-lg leading-relaxed">{event.description}</p>
              <p className="leading-relaxed">{event.content}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="font-bold text-white">Status</h3>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                  event.status === 'upcoming'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : event.status === 'ongoing'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-zinc-500/20 text-zinc-300'
                }`}
              >
                {event.status === 'upcoming' ? 'Akan datang' : event.status === 'ongoing' ? 'Sedang berlangsung' : 'Selesai'}
              </span>
            </div>

            {event.regLink && (
              <a
                href={event.regLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-emerald-400 py-3 text-center font-bold text-black transition hover:bg-emerald-300"
              >
                Daftar Sekarang
              </a>
            )}

            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="font-bold text-white">Bagikan</h3>
              <div className="mt-3 flex gap-2 text-sm">
                <CopyButton text={shareUrl} label="Copy link" />
                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(event.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-3 py-2 text-zinc-300 hover:bg-zinc-900"
                >
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-3 py-2 text-zinc-300 hover:bg-zinc-900"
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
