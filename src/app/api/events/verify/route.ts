import { NextRequest, NextResponse } from 'next/server';
import { getRegistrationById, checkInRegistration } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticket');

  if (!ticketId) {
    return NextResponse.json({ error: 'Kode tiket diperlukan.' }, { status: 400 });
  }

  const registration = await getRegistrationById(ticketId);
  if (!registration) {
    return NextResponse.json({ error: 'Tiket tidak ditemukan atau tidak valid.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, registration });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId } = body;

    if (!ticketId) {
      return NextResponse.json({ error: 'Kode tiket diperlukan.' }, { status: 400 });
    }

    const updated = await checkInRegistration(ticketId);
    if (!updated) {
      return NextResponse.json({ error: 'Tiket tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Peserta ${updated.fullName} berhasil di-check in!`,
      registration: updated,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Gagal melakukan check-in.' }, { status: 500 });
  }
}
