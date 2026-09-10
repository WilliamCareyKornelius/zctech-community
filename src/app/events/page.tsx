import type { Metadata } from 'next';
import { EventsList } from './events-list';
import { EventCountdown } from '@/components/sections/event-countdown';
import { JsonLd } from '@/components/shared/json-ld';
import { events, siteConfig, isEventRegistrationClosed } from '@/lib/content';
import { getRegistrationCountByEvent } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Kegiatan',
  description: `Kegiatan komunitas ZCTech yang fokus pada hands-on cybersecurity.`,    
  openGraph: { images: ['/kegiatan/img-01.jpg'] },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const enrichedEvents = await Promise.all(
    events.map(async (event) => {
      const count = await getRegistrationCountByEvent(event.slug);
      const isClosed = isEventRegistrationClosed(event, count);
      return {
        ...event,
        currentParticipants: count,
        isRegistrationClosed: isClosed,
      };
    })
  );

  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Kegiatan ZCTech',
          url: `${siteConfig.url}/events`,
          description: 'Kegiatan komunitas ZCTech Community',
        }}
      />

      <section className="w-full bg-background px-4 pb-8 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Jadwal Kegiatan</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-foreground sm:text-5xl">
          Kegiatan Komunitas
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Kegiatan hands-on untuk belajar cybersecurity bersama anggota ZCTech.
        </p>
      </section>

      <EventCountdown />

      <EventsList events={enrichedEvents} />
    </>
  );
}
