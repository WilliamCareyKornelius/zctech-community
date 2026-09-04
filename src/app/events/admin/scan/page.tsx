'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Search,
  FlipHorizontal,
  Lock,
  ArrowLeft,
  Users,
  Clock,
} from 'lucide-react';
import type { EventRegistration } from '@/lib/db';

// Audio Synthesizer Feedback
function playBeep(type: 'success' | 'warning' | 'error') {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      if (navigator.vibrate) navigator.vibrate(80);
    } else if (type === 'warning') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    }
  } catch {
    // Ignore audio error
  }
}

function extractTicketId(rawText: string): string {
  const trimmed = rawText.trim();
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const ticketParam = url.searchParams.get('ticket');
      if (ticketParam) return ticketParam.trim();
    }
  } catch {
    // fallback to regex
  }
  const match = trimmed.match(/ZCT-[A-Za-z0-9-_]+/i);
  if (match) return match[0].toUpperCase();
  return trimmed;
}

export default function AdminScanPage() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Results & History
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    status: 'success' | 'warning' | 'error';
    message: string;
    registration?: EventRegistration;
  } | null>(null);
  const [history, setHistory] = useState<
    Array<{ reg: EventRegistration; time: string; duplicate?: boolean }>
  >([]);
  const [stats, setStats] = useState({ total: 0, attended: 0 });

  // Manual input
  const [manualTicket, setManualTicket] = useState('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check saved PIN
  useEffect(() => {
    const saved = sessionStorage.getItem('zctech_admin_pin');
    if (saved) {
      setPin(saved);
      verifyPin(saved);
    }
  }, []);

  const verifyPin = async (testPin: string) => {
    setPinError(null);
    try {
      const res = await fetch(`/api/events/admin/attendees?pin=${encodeURIComponent(testPin)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        sessionStorage.setItem('zctech_admin_pin', testPin);
        setStats({
          total: data.stats.total,
          attended: data.stats.attended,
        });
      } else {
        setPinError(data.error || 'PIN Panitia salah.');
        setIsUnlocked(false);
        sessionStorage.removeItem('zctech_admin_pin');
      }
    } catch {
      setPinError('Gagal memverifikasi PIN dengan server.');
    }
  };

  const stopCamera = useCallback(async () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (html5QrCodeRef.current && isScanningRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn('Stop camera err:', err);
      }
      try {
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      isScanningRef.current = false;
    }
    setCameraActive(false);
  }, []);

  const processTicket = useCallback(
    async (rawTicket: string) => {
      const ticketId = extractTicketId(rawTicket);
      if (!ticketId) return;

      setIsProcessing(true);
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

        if (res.ok && data.success && data.registration) {
          const reg = data.registration as EventRegistration & { alreadyAttended?: boolean };
          const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          if (reg.alreadyAttended) {
            if (soundEnabled) playBeep('warning');
            setCurrentResult({
              status: 'warning',
              message: `⚠️ Sudah Hadir Sebelumnya (${nowStr})`,
              registration: reg,
            });
            setHistory((prev) => [{ reg, time: nowStr, duplicate: true }, ...prev.slice(0, 9)]);
          } else {
            if (soundEnabled) playBeep('success');
            setCurrentResult({
              status: 'success',
              message: `✓ Check-in Berhasil: ${reg.fullName}`,
              registration: reg,
            });
            setStats((prev) => ({ ...prev, attended: prev.attended + 1 }));
            setHistory((prev) => [{ reg, time: nowStr, duplicate: false }, ...prev.slice(0, 9)]);
          }
        } else {
          if (soundEnabled) playBeep('error');
          setCurrentResult({
            status: 'error',
            message: data.error || `Tiket [${ticketId}] tidak valid.`,
          });
        }
      } catch {
        if (soundEnabled) playBeep('error');
        setCurrentResult({
          status: 'error',
          message: 'Kesalahan jaringan saat memproses tiket.',
        });
      } finally {
        setIsProcessing(false);

        if (autoNext) {
          resumeTimerRef.current = setTimeout(() => {
            setCurrentResult(null);
            isScanningRef.current = true;
          }, 2500);
        }
      }
    },
    [pin, soundEnabled, autoNext]
  );

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCurrentResult(null);

    try {
      const containerId = 'fullscreen-qr-reader';
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;

      if (html5QrCodeRef.current && isScanningRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode },
        {
          fps: 15,
          qrbox: (w, h) => {
            const minEdge = Math.min(w, h);
            const size = Math.floor(minEdge * 0.72);
            return { width: Math.max(size, 220), height: Math.max(size, 220) };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (!isScanningRef.current) return;
          isScanningRef.current = false;
          processTicket(decodedText);
        },
        () => {}
      );

      isScanningRef.current = true;
      setCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera start error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        setCameraError('Izin akses kamera ditolak. Harap berikan izin di pengaturan browser Anda.');
      } else {
        setCameraError('Gagal membuka kamera perangkat.');
      }
      setCameraActive(false);
    }
  }, [facingMode, stopCamera, processTicket]);

  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    }
  }, [isUnlocked, startCamera, stopCamera]);

  // LOGIN VIEW
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-5">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-center text-xl font-black text-foreground">Scanner Meja Registrasi</h1>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Masukkan PIN Keamanan Panitia untuk membuka kamera scanner tiket.
          </p>

          {pinError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-xs text-destructive">
              {pinError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pin.trim()) verifyPin(pin.trim());
            }}
            className="mt-6 space-y-4"
          >
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN Panitia"
              className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition"
            >
              Nyalakan Scanner
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Akses khusus panitia registrasi kegiatan ZCTech.
          </p>
        </div>
      </div>
    );
  }

  // SCANNER VIEW
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-xl space-y-5">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/events/admin/attendees"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Ke Daftar Peserta
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
              <Users className="h-3.5 w-3.5" />
              {stats.attended} / {stats.total} Hadir
            </span>
          </div>
        </div>

        {/* Camera Container */}
        <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
            <div>
              <h2 className="text-sm font-black text-foreground">Scanner Registrasi Ulang</h2>
              <p className="text-[11px] text-muted-foreground">Arahkan kamera ke QR Code tiket peserta</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = facingMode === 'environment' ? 'user' : 'environment';
                  setFacingMode(next);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition"
                title="Ganti Kamera"
              >
                <FlipHorizontal className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  soundEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
                }`}
                title="Suara Beep"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Viewfinder */}
          <div className="relative aspect-square max-h-[360px] w-full bg-black overflow-hidden flex items-center justify-center">
            <div id="fullscreen-qr-reader" className="h-full w-full object-cover" />

            {/* Laser effect */}
            {cameraActive && !currentResult && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-60 w-60 rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <div className="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce duration-1000" />
                  <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
                  <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
                  <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-emerald-400 rounded-br" />
                </div>
              </div>
            )}

            {/* Loading */}
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm z-20">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-2" />
                <p className="text-xs font-bold text-emerald-400">Menyimpan Kehadiran...</p>
              </div>
            )}

            {/* Camera error */}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card p-6 text-center z-10">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-xs text-muted-foreground mb-3">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-black"
                >
                  Nyalakan Ulang Kamera
                </button>
              </div>
            )}

            {/* Scan result overlay */}
            {currentResult && (
              <div className="absolute inset-x-4 bottom-4 z-30 animate-in slide-in-from-bottom-3 duration-200">
                <div
                  className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                    currentResult.status === 'success'
                      ? 'border-emerald-500 bg-emerald-950/95 text-emerald-100'
                      : currentResult.status === 'warning'
                      ? 'border-amber-500 bg-amber-950/95 text-amber-100'
                      : 'border-destructive bg-destructive/95 text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {currentResult.status === 'success' && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    )}
                    {currentResult.status === 'warning' && (
                      <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                    )}
                    {currentResult.status === 'error' && (
                      <AlertCircle className="h-6 w-6 text-white shrink-0" />
                    )}

                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-extrabold text-sm">{currentResult.message}</p>
                      {currentResult.registration && (
                        <div className="mt-1 space-y-0.5 opacity-90">
                          <p>
                            Nama: <strong>{currentResult.registration.fullName}</strong>
                          </p>
                          <p>
                            Instansi: {currentResult.registration.institution} (
                            {currentResult.registration.category})
                          </p>
                          <p className="font-mono text-[10px] opacity-75">
                            ID: {currentResult.registration.id}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setCurrentResult(null);
                        isScanningRef.current = true;
                      }}
                      className="rounded-xl bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30"
                    >
                      Scan Berikutnya →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom controller */}
          <div className="p-4 bg-card border-t border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <span className="font-bold flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Zap className="h-3 w-3 text-emerald-500" />
                  Auto-Lanjut (2.5s)
                </span>
              </label>

              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Kamera
              </button>
            </div>

            {/* Manual fallback input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualTicket.trim()) {
                  processTicket(manualTicket.trim());
                  setManualTicket('');
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={manualTicket}
                  onChange={(e) => setManualTicket(e.target.value)}
                  placeholder="Ketik manual ID Tiket (ZCT-...)"
                  className="w-full rounded-xl border border-border bg-muted/40 pl-8 pr-3 py-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!manualTicket.trim() || isProcessing}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
              >
                Cek
              </button>
            </form>
          </div>
        </div>

        {/* Recent Scan History */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              Peserta Terakhir Di-Scan ({history.length})
            </h3>
            <div className="divide-y divide-border/60">
              {history.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-foreground">{item.reg.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.reg.institution} &bull; {item.reg.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.duplicate
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
