'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Send,
  Printer,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Lock,
  Search,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import type { Event } from '@/lib/types';
import type { EventRegistration } from '@/lib/db';
import { REGISTERED_SCHOOLS } from '@/lib/content';
import { formatEventFullDateWITA, formatDateTimeWITA } from '@/lib/date';

export function RegisterFormClient({
  event,
  isQuotaFull,
  currentCount,
}: {
  event: Event;
  isQuotaFull?: boolean;
  currentCount?: number;
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    institution: '',
    category: 'Siswa',
    studentId: '',
    motivation: '',
  });

  const [selectedSchool, setSelectedSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');

  const isPendamping =
    formData.category === 'Guru Pendamping' || formData.category === 'Pendamping';

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ticketResult, setTicketResult] = useState<EventRegistration | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkEmail, setCheckEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleCheckExistingEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail.trim()) return;
    setErrorMessage(null);
    setCheckingEmail(true);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: event.slug,
          email: checkEmail.trim(),
          fullName: 'Peserta',
          whatsapp: '081234567890',
          institution: '-',
          category: 'Umum',
        }),
      });

      const data = await res.json();
      if (data.alreadyRegistered && data.registration) {
        setTicketResult(data.registration);
        setAlreadyRegistered(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(
          data.error || 'Email tersebut belum terdaftar pada kegiatan ini.'
        );
      }
    } catch {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSlug: event.slug,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Terjadi kesalahan saat memproses pendaftaran.');
        return;
      }

      setTicketResult(data.registration);
      setAlreadyRegistered(Boolean(data.alreadyRegistered));
      // Scroll to top to see ticket
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => formatEventFullDateWITA(iso);

  return (
    <div className="min-h-screen bg-background pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Detail Kegiatan
        </Link>

        {/* IF TICKET IS ISSUED: SHOW TRAVELOKA-STYLE E-TICKET */}
        <AnimatePresence mode="wait">
          {ticketResult ? (
            <motion.div
              key="ticket-view"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Notification Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-600 dark:text-emerald-300 flex items-start gap-3 shadow-lg shadow-emerald-950/20">
                <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {alreadyRegistered ? 'Anda Sudah Terdaftar Sebelumnya!' : 'Pendaftaran Berhasil Terkonfirmasi! 🎉'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    E-Tiket resmi dan bukti pendaftaran telah kami kirimkan secara otomatis ke email Anda:{' '}
                    <strong className="text-foreground">{ticketResult.email}</strong>. Silakan simpan tiket ini sebagai
                    tiket masuk resmi saat hari-H acara.
                  </p>
                </div>
              </div>

              {/* The Traveloka-Style E-Ticket Card */}
              <div
                id="printable-ticket"
                className="overflow-hidden rounded-3xl border border-emerald-500/40 bg-card shadow-2xl text-card-foreground backdrop-blur-2xl"
              >
                {/* Header Boarding Pass Style */}
                <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 p-6 sm:p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Official Event Pass
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">ZCTech Community</span>
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight">{ticketResult.eventTitle}</h2>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-200">
                    Cybersecurity & IT Infrastructure Awareness for the Future Generation
                  </p>
                </div>

                {/* Booking Code & Status Strip */}
                <div className="border-b-2 border-dashed border-border/80 bg-muted/50 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      KODE TIKET PENDAFTARAN
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono tracking-wider mt-0.5">
                      {ticketResult.id}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      STATUS TIKET
                    </span>
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ✓ FREE PASS (TERKONFIRMASI)
                    </div>
                  </div>
                </div>

                {/* QR Code & Scan Notice */}
                <div className="p-6 sm:p-8 text-center bg-background border-b border-border/60">
                  <div className="inline-block p-3 rounded-2xl bg-white shadow-xl border border-border/40">
                    <img
                      src={ticketResult.qrCodeDataUrl}
                      alt="QR Code Tiket"
                      className="h-44 w-44 sm:h-52 sm:w-52 object-contain"
                    />
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
                    Tunjukkan QR Code ini kepada panitia pendaftaran di meja registrasi ulang saat tiba di lokasi.
                  </p>
                </div>

                {/* Event Schedule & Venue */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 border-b border-border pb-2">
                      Rincian Acara
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 p-3">
                        <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Hari & Tanggal</span>
                          <span className="font-bold text-foreground">{formatDate(event.eventDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 p-3">
                        <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Waktu Acara</span>
                          <span className="font-bold text-foreground">14.00 - 16.30 WITA</span>
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 p-3">
                        <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Lokasi / Tempat</span>
                          <span className="font-bold text-foreground">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendee Details */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 border-b border-border pb-2">
                      Data Peserta (Attendee)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <span className="text-[11px] text-muted-foreground block">Nama Lengkap</span>
                        <span className="font-bold text-foreground">{ticketResult.fullName}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <span className="text-[11px] text-muted-foreground block">Asal Sekolah / Institusi</span>
                        <span className="font-bold text-foreground">{ticketResult.institution}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <span className="text-[11px] text-muted-foreground block">Kategori</span>
                        <span className="font-bold text-foreground">{ticketResult.category}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <span className="text-[11px] text-muted-foreground block">No. WhatsApp</span>
                        <span className="font-bold text-foreground">{ticketResult.whatsapp}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <span className="text-[11px] text-muted-foreground block">Waktu Pendaftaran</span>
                        <span className="font-bold text-foreground">{formatDateTimeWITA(ticketResult.createdAt)}</span>
                      </div>
                      {ticketResult.studentId && (
                        <div className="sm:col-span-2 rounded-xl border border-border bg-muted/30 p-3">
                          <span className="text-[11px] text-muted-foreground block">NISN / NIP / Identitas</span>
                          <span className="font-bold text-foreground">{ticketResult.studentId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-muted-foreground space-y-1.5">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">📌 Panduan Kehadiran:</div>
                    <div>1. Mohon tiba 15 menit sebelum acara dimulai untuk registrasi ulang.</div>
                    <div>2. Cukup perlihatkan layar tiket ini ke panitia di meja registrasi.</div>
                    <div>3. E-Sertifikat resmi dan akses Interactive Platform akan diberikan untuk peserta yang hadir.</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-border bg-muted/40 p-5 sm:p-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                  >
                    <Printer className="h-4 w-4" />
                    Cetak / Simpan PDF
                  </button>
                  <Link
                    href={`/events/verify?ticket=${encodeURIComponent(ticketResult.id)}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
                  >
                    <ExternalLink className="h-4 w-4 text-emerald-500" />
                    Lihat Bukti Online
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* REGISTRATION FORM VIEW */
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Event Mini Summary Header */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border border-border/80 shrink-0"
                  />
                  <div className="space-y-2">
                    {event.isRegistrationClosed ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        <Lock className="h-3.5 w-3.5" />
                        Pendaftaran Ditutup Sementara
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        Pendaftaran Gratis & Terbuka untuk Umum
                      </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                        {formatDate(event.eventDate)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                        14.00 - 16.30 WITA
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
                {errorMessage && (
                  <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive flex items-center gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {event.isRegistrationClosed ? (
                  <div className="space-y-6">
                    {/* Notice Banner */}
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 sm:p-6 text-rose-950 dark:text-rose-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold">
                            {isQuotaFull ? 'Kuota Pendaftaran Telah Penuh' : 'Masa Pendaftaran Telah Berakhir'}
                          </h3>
                          <p className="text-xs text-rose-700 dark:text-rose-300">
                            {isQuotaFull
                              ? `Kapasitas pendaftaran ${event.maxParticipants || 151} peserta telah terpenuhi (${currentCount || event.maxParticipants || 151} / ${event.maxParticipants || 151} terdaftar)`
                              : 'Pendaftaran resmi ditutup pada H-1 kegiatan (Senin, 14 September 2026 pukul 23.59 WITA)'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {event.registrationClosedMessage ||
                          (isQuotaFull
                            ? `Mohon maaf, kuota pendaftaran untuk kegiatan ini telah terpenuhi (maksimal ${event.maxParticipants || 151} peserta). Pendaftaran resmi telah ditutup oleh panitia.`
                            : 'Mohon maaf, masa pendaftaran peserta baru untuk kegiatan ini telah resmi ditutup (H-1 sebelum acara). Persiapan data peserta dan registrasi kegiatan sedang difinalisasi oleh panitia.')}
                      </p>
                      <div className="flex items-center gap-2 rounded-xl bg-card/70 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span>Data peserta yang telah terdaftar sebelumnya tetap tersimpan aman dan tiket resmi tetap berlaku sah untuk hari-H.</span>
                      </div>
                    </div>

                    {/* Section to Check & Retrieve Existing Ticket */}
                    <div className="rounded-2xl border border-border bg-muted/40 p-5 sm:p-6 space-y-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground">Sudah Pernah Mendaftar Sebelumnya?</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bagi rekan-rekan yang sudah terdaftar, masukkan alamat email yang digunakan saat pendaftaran untuk menampilkan dan mengunduh ulang e-tiket Anda:
                        </p>
                      </div>

                      <form onSubmit={handleCheckExistingEmail} className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="email"
                            required
                            value={checkEmail}
                            onChange={(e) => setCheckEmail(e.target.value)}
                            placeholder="Masukkan email terdaftar (contoh: nama@gmail.com)"
                            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                          />
                          <button
                            type="submit"
                            disabled={checkingEmail}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50 shadow-md shadow-emerald-500/20"
                          >
                            {checkingEmail ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                            <span>Cek E-Tiket Saya</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {event.maxParticipants && (
                          <div className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
                            <span className="inline-block h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                            <span>
                              Kuota: <strong>{event.maxParticipants} Peserta</strong>
                              {currentCount !== undefined && (
                                <span className="ml-1 text-teal-600/90 dark:text-teal-400/90">
                                  ({Math.max(0, event.maxParticipants - currentCount)} slot tersisa)
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <Clock className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Batas Akhir: <strong>Senin, 14 September 2026 pukul 23.59 WITA</strong> (H-1)</span>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Formulir Pendaftaran Peserta</h2>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          Isi data diri Anda dengan benar. E-tiket dan bukti pendaftaran resmi akan langsung dikirimkan ke
                          email yang Anda masukkan.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Masukkan nama lengkap sesuai sertifikat"
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>

                  {/* 2. Email Aktif */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Email Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@gmail.com"
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Bukti e-tiket dan barcode check-in akan otomatis dikirimkan ke alamat email ini.
                    </p>
                  </div>

                  {/* 3. Nomor WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Nomor WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>

                  {/* 4. Kategori Pendaftar (Dropdown) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Kategori Pendaftar <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full appearance-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer pr-10"
                      >
                        <option value="Siswa" className="bg-card text-foreground py-2">
                          Siswa (Pelajar SMK / SMA)
                        </option>
                        <option value="Guru Pendamping" className="bg-card text-foreground py-2">
                          Guru Pendamping (Pembina / Pendamping Sekolah)
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {isPendamping
                        ? 'Khusus untuk bapak/ibu guru pendamping atau pembina rombongan sekolah.'
                        : 'Untuk perwakilan siswa/siswi sekolah SMK & SMA.'}
                    </p>
                  </div>

                  {/* 5. Asal Sekolah (Drop Box 19 Sekolah) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      {isPendamping ? (
                        <>
                          Asal Sekolah / Instansi yang Didampingi <span className="text-red-500">*</span>
                        </>
                      ) : (
                        <>
                          Asal Sekolah (SMK / SMA) <span className="text-red-500">*</span>
                        </>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={selectedSchool}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSchool(val);
                          if (val !== 'Lainnya') {
                            setFormData((prev) => ({ ...prev, institution: val }));
                          } else {
                            setFormData((prev) => ({ ...prev, institution: customSchool }));
                          }
                        }}
                        className="w-full appearance-none rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer pr-10"
                      >
                        <option value="" disabled className="bg-card text-muted-foreground">
                          -- Pilih Asal Sekolah (19 SMK Terdaftar) --
                        </option>
                        {REGISTERED_SCHOOLS.map((sch, idx) => (
                          <option key={sch} value={sch} className="bg-card text-foreground py-2">
                            {idx + 1}. {sch}
                          </option>
                        ))}
                        <option value="Lainnya" className="bg-card text-foreground py-2">
                          Lainnya (Sekolah Lain di Luar Daftar)
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>

                    {selectedSchool === 'Lainnya' && (
                      <div className="mt-2.5">
                        <input
                          type="text"
                          required
                          value={customSchool}
                          onChange={(e) => {
                            setCustomSchool(e.target.value);
                            setFormData((prev) => ({ ...prev, institution: e.target.value }));
                          }}
                          placeholder={
                            isPendamping
                              ? 'Tuliskan nama sekolah yang didampingi...'
                              : 'Tuliskan nama lengkap sekolah asal Anda...'
                          }
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                    )}

                    <p className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>
                        Tersedia 19 SMK terdaftar di Samarinda. Guru pendamping & siswa tinggal memilih tanpa perlu mengetik manual.
                      </span>
                    </p>
                  </div>

                  {/* 6. Nomor Identitas / NISN / NIP */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      {isPendamping ? (
                        <>
                          NIP / NUPTK / No. Identitas Guru{' '}
                          <span className="text-muted-foreground font-normal">(Opsional)</span>
                        </>
                      ) : (
                        <>
                          NISN / NIS / Kelas{' '}
                          <span className="text-muted-foreground font-normal">(Opsional)</span>
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder={
                        isPendamping
                          ? 'Masukkan NIP atau NUPTK jika berkenan'
                          : 'Contoh: XII TKJ 1 / 0051234567'
                      }
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>

                  {/* 7. Motivasi / Catatan Rombongan */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      {isPendamping ? (
                        <>
                          Catatan Rombongan / Keterangan Pendamping{' '}
                          <span className="text-muted-foreground font-normal">(Opsional)</span>
                        </>
                      ) : (
                        <>
                          Harapan / Pertanyaan untuk Pemateri{' '}
                          <span className="text-muted-foreground font-normal">(Opsional)</span>
                        </>
                      )}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      placeholder={
                        isPendamping
                          ? 'Contoh: Membawa rombongan siswa jurusan RPL/TKJ, koordinasi pendamping...'
                          : 'Tuliskan harapan Anda atau pertanyaan yang ingin dibahas saat seminar...'
                      }
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>

                  {/* Submit Button (Mobile First) */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          <span>Menerbitkan E-Tiket & Mengirim Email...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Pendaftaran & Dapatkan E-Tiket</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-[11px] text-muted-foreground">
                      Dengan mendaftar, Anda menyetujui ketentuan kegiatan ZCTech Community. Pendaftaran ini 100% GRATIS.
                    </p>
                  </div>
                </form>
              </>
            )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
