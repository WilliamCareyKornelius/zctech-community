'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Search,
  FlipHorizontal,
} from 'lucide-react';
import type { EventRegistration } from '@/lib/db';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: string;
  onCheckInSuccess?: (reg: EventRegistration) => void;
}

// Audio Feedback synthesiser (Web Audio API)
function playScanSound(type: 'success' | 'warning' | 'error') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
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
    // Ignore audio permission/context errors
  }
}

// Ekstrak ticket ID dari URL atau teks mentah
function extractTicketId(rawText: string): string {
  const trimmed = rawText.trim();
  // Cek apakah format URL: ?ticket=ZCT-...
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const ticketParam = url.searchParams.get('ticket');
      if (ticketParam) return ticketParam.trim();
    }
  } catch {
    // bukan URL valid, fallback ke regex
  }

  // Cek regex pola ZCT-XXXX
  const match = trimmed.match(/ZCT-[A-Za-z0-9-_]+/i);
  if (match) return match[0].toUpperCase();

  return trimmed;
}

export function QrScannerModal({ isOpen, onClose, pin, onCheckInSuccess }: QrScannerModalProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Status hasil scan
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'warning' | 'error';
    message: string;
    registration?: EventRegistration;
  } | null>(null);

  // Manual input fallback
  const [manualTicketInput, setManualTicketInput] = useState('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera
  const stopCamera = useCallback(async () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (html5QrCodeRef.current && isScanningRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn('Error stopping html5QrCode:', err);
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

  // Proses kode tiket
  const processTicket = useCallback(
    async (rawTicket: string) => {
      const ticketId = extractTicketId(rawTicket);
      if (!ticketId) return;

      setIsProcessing(true);

      try {
        // Lakukan check-in via API admin
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

          if (reg.alreadyAttended) {
            if (soundEnabled) playScanSound('warning');
            setScanResult({
              status: 'warning',
              message: `Peserta ${reg.fullName} sudah pernah check-in sebelumnya!`,
              registration: reg,
            });
          } else {
            if (soundEnabled) playScanSound('success');
            setScanResult({
              status: 'success',
              message: `Berhasil check-in: ${reg.fullName}`,
              registration: reg,
            });
            if (onCheckInSuccess) {
              onCheckInSuccess(reg);
            }
          }
        } else {
          if (soundEnabled) playScanSound('error');
          setScanResult({
            status: 'error',
            message: data.error || `Tiket [${ticketId}] tidak valid / tidak ditemukan.`,
          });
        }
      } catch {
        if (soundEnabled) playScanSound('error');
        setScanResult({
          status: 'error',
          message: 'Gagal menghubungi server verifikasi.',
        });
      } finally {
        setIsProcessing(false);

        // Jika autoCheckIn aktif, lanjutkan scan otomatis setelah 2.5 detik
        if (autoCheckIn) {
          resumeTimerRef.current = setTimeout(() => {
            setScanResult(null);
            isScanningRef.current = true;
          }, 2500);
        }
      }
    },
    [pin, soundEnabled, autoCheckIn, onCheckInSuccess]
  );

  // Start camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScanResult(null);

    try {
      const containerId = 'interactive-qr-reader';
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;

      // Stop previous instance if exists
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
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.72);
            return {
              width: Math.max(qrboxSize, 220),
              height: Math.max(qrboxSize, 220),
            };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Hanya tangkap jika tidak sedang memproses atau jeda
          if (!isScanningRef.current) return;
          isScanningRef.current = false;
          processTicket(decodedText);
        },
        () => {
          // Frame scanner misses/in-progress, no action needed
        }
      );

      isScanningRef.current = true;
      setCameraActive(true);
    } catch (err: unknown) {
      console.error('Camera start error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        setCameraError('Izin akses kamera ditolak. Harap izinkan akses kamera di browser Anda.');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
        setCameraError('Kamera tidak ditemukan pada perangkat ini.');
      } else {
        setCameraError('Gagal menyalakan kamera. Pastikan kamera tidak digunakan aplikasi lain.');
      }
      setCameraActive(false);
    }
  }, [facingMode, stopCamera, processTicket]);

  // Efek buka/tutup modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startCamera();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
  }, [isOpen, startCamera, stopCamera]);

  // Ganti kamera Depan / Belakang
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Scanner QR Tiket Peserta</h2>
              <p className="text-[11px] text-muted-foreground">Arahkan kamera ke QR Code tiket di layar HP peserta</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Viewfinder Camera Area */}
        <div className="relative bg-black aspect-square max-h-[380px] w-full overflow-hidden flex items-center justify-center">
          {/* HTML5 QR Code Mount Div */}
          <div id="interactive-qr-reader" className="h-full w-full object-cover" />

          {/* Animated Laser Overlay ketika kamera aktif & tidak ada popup error */}
          {cameraActive && !scanResult && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-60 w-60 sm:h-64 sm:w-64 rounded-2xl border-2 border-dashed border-emerald-400/70 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                {/* Laser scan line animation */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-bounce duration-1000" />
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
                <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
                <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-emerald-400 rounded-br" />
              </div>
            </div>
          )}

          {/* Error state */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 p-6 text-center z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Kamera Tidak Dapat Diakses</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs">{cameraError}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading / Processing Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-3" />
              <p className="text-xs font-bold text-emerald-400">Memverifikasi & Menyimpan Kehadiran...</p>
            </div>
          )}

          {/* Scan Result Card Overlay */}
          {scanResult && (
            <div className="absolute inset-x-4 bottom-4 z-30 animate-in slide-in-from-bottom-5 duration-300">
              <div
                className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                  scanResult.status === 'success'
                    ? 'border-emerald-500/50 bg-emerald-950/90 text-emerald-100'
                    : scanResult.status === 'warning'
                    ? 'border-amber-500/50 bg-amber-950/90 text-amber-100'
                    : 'border-destructive/50 bg-destructive/90 text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {scanResult.status === 'success' && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                    {scanResult.status === 'warning' && <AlertTriangle className="h-6 w-6 text-amber-400" />}
                    {scanResult.status === 'error' && <AlertCircle className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-extrabold text-sm">{scanResult.message}</p>
                    {scanResult.registration && (
                      <div className="mt-1.5 space-y-0.5 opacity-90">
                        <p>
                          <span className="opacity-75">Nama:</span>{' '}
                          <strong className="text-white">{scanResult.registration.fullName}</strong>
                        </p>
                        <p>
                          <span className="opacity-75">Instansi:</span> {scanResult.registration.institution} (
                          {scanResult.registration.category})
                        </p>
                        <p className="font-mono text-[11px] opacity-80">Tiket: {scanResult.registration.id}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setScanResult(null);
                      isScanningRef.current = true;
                    }}
                    className="rounded-xl bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/30 active:scale-95 transition"
                  >
                    Scan Tiket Berikutnya →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="border-t border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                title="Ganti Kamera Depan/Belakang"
              >
                <FlipHorizontal className="h-3.5 w-3.5" />
                {facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  soundEnabled
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                    : 'border-border bg-muted/60 text-muted-foreground'
                }`}
                title="Suara Beep"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                Beep
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoCheckIn}
                onChange={(e) => setAutoCheckIn(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-500" />
                Auto-Next (2.5s)
              </span>
            </label>
          </div>

          {/* Manual Ticket Input Fallback */}
          <div className="pt-1 border-t border-border/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualTicketInput.trim()) {
                  processTicket(manualTicketInput.trim());
                  setManualTicketInput('');
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={manualTicketInput}
                  onChange={(e) => setManualTicketInput(e.target.value)}
                  placeholder="Ketik manual ID Tiket (misal: ZCT-EXP-2026-...)"
                  className="w-full rounded-xl border border-border bg-muted/40 pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!manualTicketInput.trim() || isProcessing}
                className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition shrink-0"
              >
                Cek Manual
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
