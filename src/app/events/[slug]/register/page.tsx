import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { events, isEventRegistrationClosed } from '@/lib/content';
import { getRegistrationCountByEvent } from '@/lib/db';
import { RegisterFormClient } from './register-form-client';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: 'Pendaftaran Kegiatan Tidak Ditemukan' };

  return {
    title: `Daftar: ${event.title}`,
    description: `Formulir pendaftaran resmi kegiatan ${event.title}. Dapatkan e-tiket masuk dan free e-certificate.`,
    openGraph: {
      title: `Daftar: ${event.title}`,
      description: `Formulir pendaftaran resmi ${event.title}.`,
      images: [{ url: event.coverImage }],
    },
  };
}

export default async function EventRegisterPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const currentCount = await getRegistrationCountByEvent(event.slug);
  const isQuotaFull = event.maxParticipants !== undefined && currentCount >= event.maxParticipants;
  const isClosed = isEventRegistrationClosed(event, currentCount);

  let closedMessage = event.registrationClosedMessage;
  if (isQuotaFull) {
    closedMessage = `Mohon maaf, kuota pendaftaran untuk kegiatan ini telah terpenuhi (${currentCount} / ${event.maxParticipants} peserta). Pendaftaran resmi telah ditutup oleh panitia.`;
  }

  const effectiveEvent = {
    ...event,
    currentParticipants: currentCount,
    isRegistrationClosed: isClosed,
    registrationClosedMessage: closedMessage,
  };

  return (
    <RegisterFormClient
      event={effectiveEvent}
      isQuotaFull={isQuotaFull}
      currentCount={currentCount}
    />
  );
}
