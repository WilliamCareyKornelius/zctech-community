import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { events, getEventEffectiveStatus } from '@/lib/content';
import {
  findRegistrationByEmail,
  saveRegistration,
  type EventRegistration,
} from '@/lib/db';
import { sendEventTicketEmail } from '@/lib/mail';

function generateTicketId(prefix: string = 'ZCT'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-2026-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventSlug,
      fullName,
      email,
      whatsapp,
      institution,
      category,
      studentId,
      motivation,
    } = body;

    // 1. Validasi field wajib
    if (!eventSlug || !fullName?.trim() || !email?.trim() || !whatsapp?.trim() || !institution?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: 'Mohon lengkapi semua kolom wajib (Nama, Email, WhatsApp, Institusi, Kategori).' },
        { status: 400 }
      );
    }

    // 2. Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Format email tidak valid. Periksa kembali alamat email Anda.' },
        { status: 400 }
      );
    }

    // 3. Validasi event
    const event = events.find((e) => e.slug === eventSlug);
    if (!event) {
      return NextResponse.json({ error: 'Kegiatan tidak ditemukan.' }, { status: 404 });
    }

    // Cek status acara
    if (getEventEffectiveStatus(event) === 'completed') {
      return NextResponse.json(
        { error: 'Pendaftaran untuk kegiatan ini telah ditutup karena acara sudah selesai.' },
        { status: 400 }
      );
    }

    // 4. Cek apakah sudah pernah terdaftar
    const existing = await findRegistrationByEmail(eventSlug, email);
    if (existing) {
      // Re-kirim email jika diminta
      sendEventTicketEmail(existing).catch((err) =>
        console.error('Failed to resend existing ticket email:', err)
      );

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: 'Anda sudah terdaftar sebelumnya! Kami telah menampilkan kembali e-tiket Anda.',
        registration: existing,
      });
    }

    // 5. Generate Ticket ID & QR Code
    const ticketId = generateTicketId('ZCT-EXP');
    const verifyUrl = `https://community.zctech.id/events/verify?ticket=${encodeURIComponent(ticketId)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#022c22',
        light: '#ffffff',
      },
    });

    const newRegistration: EventRegistration = {
      id: ticketId,
      eventSlug,
      eventTitle: event.title,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      institution: institution.trim(),
      category: category.trim(),
      studentId: studentId?.trim() || undefined,
      motivation: motivation?.trim() || undefined,
      qrCodeDataUrl,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // 6. Simpan ke database
    await saveRegistration(newRegistration);

    // 7. Kirim email bukti pendaftaran Traveloka-style
    // Menjalankan pengiriman email secara asinkron agar respon cepat
    sendEventTicketEmail(newRegistration).catch((err) =>
      console.error('Background send ticket email error:', err)
    );

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      message: 'Pendaftaran berhasil! E-tiket telah dikirim ke email Anda.',
      registration: newRegistration,
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses pendaftaran. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
