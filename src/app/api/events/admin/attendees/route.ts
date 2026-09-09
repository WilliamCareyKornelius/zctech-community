import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getRegistrations, checkInRegistration, deleteRegistration, resetCheckInRegistration } from '@/lib/db';
import { formatDateTimeWITA } from '@/lib/date';

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
  const exportType = searchParams.get('export'); // 'xlsx' | 'excel' | 'csv'
  const eventSlug = searchParams.get('event');

  let registrations = await getRegistrations();

  if (eventSlug) {
    registrations = registrations.filter((r) => r.eventSlug === eventSlug);
  }

  // 1. EKSPOR EXCEL NATIVE (.xlsx)
  if (exportType === 'xlsx' || exportType === 'excel') {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Data Lengkap Peserta
    const participantRows = registrations.map((r, index) => ({
      'No': index + 1,
      'Kode Tiket': r.id,
      'Nama Lengkap': r.fullName,
      'Email': r.email,
      'No. WhatsApp': r.whatsapp,
      'Asal Institusi / Sekolah': r.institution,
      'Kategori Peserta': r.category,
      'NIM / NIS / Identitas': r.studentId || '-',
      'Status Kehadiran': r.status === 'attended' ? 'Hadir' : 'Belum Hadir',
      'Waktu Pendaftaran (WITA)': formatDateTimeWITA(r.createdAt),
      'Waktu Check-In (WITA)': r.checkedInAt ? formatDateTimeWITA(r.checkedInAt) : '-',
      'Motivasi / Harapan': r.motivation || '-',
    }));

    const wsParticipants = XLSX.utils.json_to_sheet(participantRows);

    // Atur lebar kolom agar rapi, lega, dan tidak terpotong (auto-fit generous width)
    wsParticipants['!cols'] = [
      { wch: 6 },   // No
      { wch: 22 },  // Kode Tiket
      { wch: 30 },  // Nama Lengkap
      { wch: 32 },  // Email
      { wch: 18 },  // WhatsApp
      { wch: 35 },  // Asal Institusi / Sekolah
      { wch: 28 },  // Kategori Peserta
      { wch: 20 },  // NIM / NIS
      { wch: 18 },  // Status Kehadiran
      { wch: 25 },  // Waktu Pendaftaran
      { wch: 25 },  // Waktu Check-In
      { wch: 50 },  // Motivasi / Harapan
    ];

    XLSX.utils.book_append_sheet(wb, wsParticipants, 'Daftar Peserta');

    // Sheet 2: Ringkasan & Statistik Panitia
    const totalCount = registrations.length;
    const attendedCount = registrations.filter((r) => r.status === 'attended').length;
    const pendingCount = totalCount - attendedCount;
    const mhsCount = registrations.filter((r) => r.category.toLowerCase().includes('mahasiswa')).length;
    const siswaCount = registrations.filter((r) => r.category.toLowerCase().includes('pelajar') || r.category.toLowerCase().includes('siswa')).length;
    const umumCount = registrations.filter((r) => r.category.toLowerCase().includes('umum')).length;

    const summaryRows = [
      { 'Indikator': 'Nama Kegiatan', 'Keterangan': 'TECH-FUTURE EXPO 2026' },
      { 'Indikator': 'Jadwal Acara', 'Keterangan': 'Selasa, 15 September 2026 (14.00 - 16.30 WITA)' },
      { 'Indikator': 'Lokasi Pelaksanaan', 'Keterangan': 'Aula Kampus Politani Samarinda' },
      { 'Indikator': 'Waktu Ekspor Laporan', 'Keterangan': formatDateTimeWITA(new Date().toISOString()) },
      { 'Indikator': '------------------------', 'Keterangan': '------------------------' },
      { 'Indikator': 'Total Pendaftar', 'Keterangan': `${totalCount} orang` },
      { 'Indikator': 'Peserta Sudah Hadir (Checked-In)', 'Keterangan': `${attendedCount} orang` },
      { 'Indikator': 'Peserta Belum Hadir', 'Keterangan': `${pendingCount} orang` },
      { 'Indikator': '------------------------', 'Keterangan': '------------------------' },
      { 'Indikator': 'Jumlah Mahasiswa', 'Keterangan': `${mhsCount} orang` },
      { 'Indikator': 'Jumlah Siswa / Pelajar', 'Keterangan': `${siswaCount} orang` },
      { 'Indikator': 'Jumlah Umum / Profesional', 'Keterangan': `${umumCount} orang` },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [
      { wch: 32 },
      { wch: 45 },
    ];

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan & Statistik');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Data-Peserta-${eventSlug || 'TECH-FUTURE-EXPO-2026'}-${Date.now()}.xlsx"`,
      },
    });
  }

  // 2. EKSPOR FILE CSV (dengan UTF-8 BOM agar rapi saat dibuka di Excel)
  if (exportType === 'csv') {
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
      'Waktu Pendaftaran (WITA)',
      'Waktu Check-In (WITA)',
      'Motivasi / Catatan',
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
      `"${r.status === 'attended' ? 'Hadir' : 'Belum Hadir'}"`,
      `"${formatDateTimeWITA(r.createdAt)}"`,
      `"${r.checkedInAt ? formatDateTimeWITA(r.checkedInAt) : '-'}"`,
      `"${(r.motivation || '-').replace(/"/g, '""')}"`,
    ]);

    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel membuka aksen & karakter secara sempurna
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

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
    const action = body.action;
    const ticketId = body.ticketId || body.id;

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
