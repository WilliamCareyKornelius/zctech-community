'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Calendar, MapPin, User, Building, QrCode, ArrowLeft } from 'lucide-react';
import type { EventRegistration } from '@/lib/db';

function TicketVerifyContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticket');

  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  useEffect(() => {
    if (!ticketId) {
      setError('Kode tiket tidak ditemukan di URL.');
      setLoading(false);
      return;
    }

    fetch(`/api/events/verify?ticket=${encodeURIComponent(ticketId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.registration) {
          setRegistration(data.registration);
        } else {
          setError(data.error || 'Tiket tidak valid.');
        }
      })
      .catch(() => setError('Gagal menghubungi server untuk memvalidasi tiket.'))
      .finally(() => setLoading(false));
  }, [ticketId]);

  const handleCheckIn = async () => {
    if (!registration) return;
    setCheckInLoading(true);
    try {
      const res = await fetch('/api/events/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: registration.id }),
      });
      const data = await res.json();
      if (data.success && data.registration) {
        setRegistration(data.registration);
        setCheckInSuccess(true);
      } else {
        alert(data.error || 'Gagal memproses check-in.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setCheckInLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Memverifikasi keaslian e-tiket...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Tiket Tidak Valid</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error || 'Tiket tidak ditemukan dalam basis data sistem.'}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isAttended = registration.status === 'attended';

  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-2xl backdrop-blur-xl">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 p-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5" />
            E-Tiket Terverifikasi Sah
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{registration.eventTitle}</h1>
          <p className="text-xs text-emerald-100 mt-1">ZCTech Community &bull; Official Registration Pass</p>
        </div>

        {/* Status badge & booking code */}
        <div className="border-b border-border bg-muted/40 p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">KODE TIKET</span>
            <div className="text-xl font-black text-emerald-500 tracking-wider font-mono">{registration.id}</div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                isAttended
                  ? 'bg-blue-500/20 text-blue-500'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isAttended ? '✓ Sudah Hadir (Checked In)' : '● Terkonfirmasi (Ready)'}
            </span>
          </div>
        </div>

        {/* QR Code preview */}
        <div className="p-6 text-center border-b border-border bg-background">
          <img
            src={registration.qrCodeDataUrl}
            alt="QR Code Tiket"
            className="mx-auto h-44 w-44 rounded-xl border-4 border-muted shadow-md"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Tunjukkan kode tiket atau QR Code ini kepada panitia pendaftaran di lokasi.
          </p>
        </div>

        {/* Attendee details */}
        <div className="p-6 space-y-4 text-sm bg-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Data Peserta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <span className="text-muted-foreground">Nama Lengkap</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{registration.fullName}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <span className="text-muted-foreground">Asal Instansi</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{registration.institution}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <span className="text-muted-foreground">Kategori</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{registration.category}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <span className="text-muted-foreground">Email</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{registration.email}</p>
            </div>
          </div>

          {/* Event details */}
          <div className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Jadwal & Lokasi
            </h2>
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-foreground font-semibold">Selasa, 15 September 2026 | 14.00 - 16.30 WITA</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-foreground font-semibold">Aula Kampus Politani Samarinda</span>
              </div>
            </div>
          </div>

          {/* Check-in action button for committee */}
          {!isAttended ? (
            <div className="pt-4">
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading}
                className="w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {checkInLoading ? 'Memproses Check-In...' : '✓ Konfirmasi Kehadiran Peserta (Panitia)'}
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-3 text-center text-xs text-blue-500 font-bold">
              ✓ Peserta ini telah check-in pada {registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleTimeString('id-ID') : 'hari ini'}.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
          <Link href="/" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
            ← Kembali ke Beranda ZCTech
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TicketVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <TicketVerifyContent />
    </Suspense>
  );
}
