import { NextRequest, NextResponse } from 'next/server';
import { events, isEventRegistrationClosed } from '@/lib/content';
import { getRegistrationCountByEvent } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'tech-future-expo-2026';

  const event = events.find((e) => e.slug === slug);
  if (!event) {
    return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
  }

  const currentCount = await getRegistrationCountByEvent(event.slug);
  const maxParticipants = event.maxParticipants ?? 151;
  const isQuotaFull = currentCount >= maxParticipants;
  const isClosed = isEventRegistrationClosed(event, currentCount);
  const remainingSlots = Math.max(0, maxParticipants - currentCount);

  return NextResponse.json(
    {
      slug: event.slug,
      title: event.title,
      maxParticipants,
      currentCount,
      remainingSlots,
      isQuotaFull,
      isRegistrationClosed: isClosed,
      registrationDeadline: event.registrationDeadline,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    }
  );
}
