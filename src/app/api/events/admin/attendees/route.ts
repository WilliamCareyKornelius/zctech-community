import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations, checkInRegistration, deleteRegistration, resetCheckInRegistration } from '@/lib/db';

const VALID_PINS = ['zctech2026', 'amin123', 'admin'];

function isAuthorized(request: NextRequest): boolean {
  const pinHeader = request.headers.get('x-admin-pin');
  const { searchParams } = new URL(request.url);
  const pinQuery = searchParams.get('pin');
  const pin = pinHeader || pinQuery;

  return Boolean(pin && VALID_PINS.includes(pin.trim()));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Akses ditolak. PIN panitia salah.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isExport = searchParams.get('export') === 'csv';
  const eventSlug = searchParams.get('event');

  let registrations = await getRegistrations();

  if (eventSlug) {
    registrations = registrations.filter((r) => r.eventSlug === eventSlug);
  }

  // Jika minta ekspor file CSV
  if (isExport) {
    const headers = [
      'No',
      'Kode Tiket',
      'Nama Lengkap',
      'Email',
      'WhatsApp',
      'Asal Institusi',
      'Kategori',
      'NIM/NIS',
      'Status Kehadiran',
      'Waktu Pendaftaran',
      'Waktu Check-In',
    ];

    const rows = registrations.map((r, index) => [
      index + 1,
      `"${r.id}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `'${r.whatsapp}`,
      `"${r.institution.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${(r.studentId || '-').replace(/"/g, '""')}"`,
      `"${r.status === 'attended' ? 'Hadir' : 'Terkonfirmasi'}"`,
      `"${new Date(r.createdAt).toLocaleString('id-ID')}"`,
      `"${r.checkedInAt ? new Date(r.checkedInAt).toLocaleString('id-ID') : '-'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="data-peserta-${eventSlug || 'semua-event'}-${Date.now()}.csv"`,
      },
    });
  }

  // Ringkasan statistik
  const total = registrations.length;
  const attended = registrations.filter((r) => r.status === 'attended').length;
  const confirmed = total - attended;

  return NextResponse.json({
    success: true,
    stats: { total, attended, confirmed },
    registrations,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Akses ditolak. PIN panitia salah.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ticketId, action } = body;

    if (!ticketId) {
      return NextResponse.json({ error: 'Kode tiket diperlukan.' }, { status: 400 });
    }

    if (action === 'reset') {
      const reset = await resetCheckInRegistration(ticketId);
      if (!reset) {
        return NextResponse.json({ error: 'Tiket tidak ditemukan.' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Status kehadiran peserta ${reset.fullName} berhasil dibatalkan (reset).`,
        registration: reset,
      });
    }

    const updated = await checkInRegistration(ticketId);
    if (!updated) {
      return NextResponse.json({ error: 'Tiket tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Peserta ${updated.fullName} berhasil di-check in.`,
      registration: updated,
    });
  } catch (error) {
    console.error('Admin check-in error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui check-in.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Akses ditolak. PIN panitia salah.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      try {
        const body = await request.json();
        ticketId = body.ticketId;
      } catch {
        // no body
      }
    }

    if (!ticketId) {
      return NextResponse.json({ error: 'Kode tiket diperlukan.' }, { status: 400 });
    }

    const success = await deleteRegistration(ticketId);
    if (!success) {
      return NextResponse.json({ error: 'Data pendaftar tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Pendaftaran tiket ${ticketId} berhasil dihapus.`,
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pendaftaran.' }, { status: 500 });
  }
}
