'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  LogOut,
  Building,
  Mail,
  Phone,
  QrCode,
  Trash2,
} from 'lucide-react';
import type { EventRegistration } from '@/lib/db';
import { QrScannerModal } from '@/components/events/qr-scanner-modal';
import { formatDateTimeWITA, formatTimeWITA } from '@/lib/date';

export default function AdminAttendeesPage() {
  const [pin, setPin] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [stats, setStats] = useState({ total: 0, attended: 0, confirmed: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'attended'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cek sessionStorage saat mount
  useEffect(() => {
    const savedPin = sessionStorage.getItem('zctech_admin_pin');
    if (savedPin) {
      setPin(savedPin);
      fetchData(savedPin);
    }
  }, []);

  const fetchData = async (activePin: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/events/admin/attendees?pin=${encodeURIComponent(activePin)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'PIN Panitia salah.');
        setIsUnlocked(false);
        sessionStorage.removeItem('zctech_admin_pin');
        return;
      }

      setIsUnlocked(true);
      sessionStorage.setItem('zctech_admin_pin', activePin);
      setRegistrations(data.registrations || []);
      setStats(data.stats || { total: 0, attended: 0, confirmed: 0 });
    } catch {
      setErrorMsg('Gagal memuat data dari server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    fetchData(pin.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zctech_admin_pin');
    setIsUnlocked(false);
    setPin('');
    setRegistrations([]);
  };

  const handleManualCheckIn = async (ticketId: string) => {
    try {
      const res = await fetch('/api/events/admin/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh list
        fetchData(pin);
      } else {
        alert(data.error || 'Gagal melakukan check-in.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleResetCheckIn = async (ticketId: string, name: string) => {
    const confirmed = window.confirm(
      `Batalkan status check-in untuk "${name}" (${ticketId}) dan ubah kembali menjadi Belum Hadir?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch('/api/events/admin/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify({ ticketId, action: 'reset' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData(pin);
      } else {
        alert(data.error || 'Gagal mereset status check-in.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleDelete = async (ticketId: string, name: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus data peserta:\n"${name}" (${ticketId})?\n\nData yang dihapus tidak dapat dipulihkan.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/events/admin/attendees?ticketId=${encodeURIComponent(ticketId)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-pin': pin,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchData(pin);
      } else {
        alert(data.error || 'Gagal menghapus data peserta.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat menghapus data.');
    }
  };

  // Filtered attendees
  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.whatsapp.includes(search);

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'attended' && r.status === 'attended') ||
      (statusFilter === 'confirmed' && r.status === 'confirmed');

    return matchSearch && matchStatus;
  });

  // JIKA BELUM LOGIN / BELUM MASUKKAN PIN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-5">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-center text-2xl font-black text-foreground">Panel Panitia ZCTech</h1>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Masukkan PIN Keamanan Panitia untuk melihat daftar peserta kegiatan dan mengelola check-in.
          </p>

          {errorMsg && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                PIN Akses Panitia
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Panitia"
                className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 shadow-md shadow-emerald-500/20"
            >
              {loading ? 'Memverifikasi PIN...' : 'Buka Data Peserta'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Akses terbatas hanya untuk panitia dan tim penyelenggara ZCTech.
          </p>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Admin & Committee Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              Daftar Peserta: TECH-FUTURE EXPO 2026
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Kelola data kehadiran, periksa status pendaftaran, atau unduh daftar peserta dalam format CSV/Excel.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Clock className="h-3 w-3" />
                Zona Waktu: WITA (Samarinda, UTC+8)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-black hover:from-emerald-400 hover:to-teal-400 transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <QrCode className="h-4 w-4" />
              Scan QR Tiket
            </button>
            <Link
              href="/events/admin/scan"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-bold text-emerald-500 hover:bg-emerald-500/20 transition"
              title="Buka Mode Layar Penuh Khusus HP Panitia"
            >
              Fullscreen Scanner
            </Link>
            <button
              onClick={() => fetchData(pin)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href={`/api/events/admin/attendees?pin=${encodeURIComponent(pin)}&export=csv`}
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Unduh CSV
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
              title="Kunci Panel"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Pendaftar</span>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-foreground">{stats.total}</div>
            <span className="text-[11px] text-muted-foreground">Peserta terdaftar di sistem</span>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Sudah Hadir (Checked In)
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.attended}</div>
            <span className="text-[11px] text-muted-foreground">Scan tiket di meja registrasi</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Belum Check-In</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-amber-500">{stats.confirmed}</div>
            <span className="text-[11px] text-muted-foreground">Menunggu di lokasi acara</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, kampus, tiket..."
              className="w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('attended')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'attended'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Hadir ({stats.attended})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'confirmed'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Belum Hadir ({stats.confirmed})
            </button>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                <tr>
                  <th className="p-4">No</th>
                  <th className="p-4">Kode Tiket</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Institusi & Kategori</th>
                  <th className="p-4">Kontak</th>
                  <th className="p-4">Waktu Daftar (WITA)</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Tidak ada data peserta yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => {
                    const isAttended = item.status === 'attended';
                    const waClean = item.whatsapp.replace(/[^0-9]/g, '');
                    const waUrl = `https://wa.me/${waClean.startsWith('0') ? '62' + waClean.slice(1) : waClean}`;

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition">
                        <td className="p-4 font-mono text-muted-foreground">{index + 1}</td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-emerald-500">{item.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-foreground text-sm">{item.fullName}</div>
                          {item.studentId && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              NIM: {item.studentId}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{item.institution}</div>
                          <span className="text-[10px] text-muted-foreground">{item.category}</span>
                        </td>
                        <td className="p-4">
                          <div className="text-foreground">{item.email}</div>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5"
                          >
                            <Phone className="h-3 w-3" />
                            {item.whatsapp}
                          </a>
                        </td>
                        <td className="p-4 text-muted-foreground whitespace-nowrap">
                          <div className="font-medium text-foreground">
                            {formatDateTimeWITA(item.createdAt)}
                          </div>
                          {item.checkedInAt && (
                            <div className="text-[10px] text-blue-500 font-semibold mt-0.5">
                              Check-In: {formatTimeWITA(item.checkedInAt)}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              isAttended
                                ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isAttended ? '✓ Hadir' : '● Terkonfirmasi'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {!isAttended ? (
                            <button
                              onClick={() => handleManualCheckIn(item.id)}
                              className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-emerald-400 transition"
                            >
                              Check-In
                            </button>
                          ) : (
                            <button
                              onClick={() => handleResetCheckIn(item.id, item.fullName)}
                              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-500 hover:bg-amber-500/20 transition"
                              title="Batalkan status Hadir kembali ke Belum Hadir"
                            >
                              Batal Hadir
                            </button>
                          )}
                          <Link
                            href={`/events/verify?ticket=${encodeURIComponent(item.id)}`}
                            target="_blank"
                            className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition inline-flex items-center"
                          >
                            Tiket
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.fullName)}
                            className="rounded-lg border border-destructive/30 px-2 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/10 transition inline-flex items-center gap-1"
                            title="Hapus Data Peserta"
                          >
                            <Trash2 className="h-3 w-3" />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Scanner Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-2xl shadow-emerald-500/50 hover:bg-emerald-400 active:scale-95 transition"
          title="Scan QR Tiket"
        >
          <QrCode className="h-7 w-7" />
        </button>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        pin={pin}
        onCheckInSuccess={() => fetchData(pin)}
      />
    </div>
  );
}
