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
  ArrowRight,
  Upload,
} from 'lucide-react';
import type { EventRegistration } from '@/lib/db';

function playBeep(type: 'success' | 'warning' | 'error') {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.35);

      if (navigator.vibrate) navigator.vibrate(60);
    } else if (type === 'warning') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(370, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      if (navigator.vibrate) navigator.vibrate([40, 40]);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  } catch {
    // Ignore audio error
  }
}

function extractTicketId(rawText: string): string {
  if (!rawText) return '';
  const trimmed = rawText.trim();
  try {
    if (trimmed.includes('ticket=')) {
      const parts = trimmed.split('ticket=');
      if (parts[1]) {
        const id = parts[1].split('&')[0].split('#')[0];
        return decodeURIComponent(id).trim().toUpperCase();
      }
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const ticketParam = url.searchParams.get('ticket');
      if (ticketParam) return ticketParam.trim().toUpperCase();
    }
  } catch {
    // fallback
  }
  const match = trimmed.match(/ZCT-[A-Za-z0-9-_]+/i);
  if (match) return match[0].toUpperCase();
  return trimmed.toUpperCase();
}

export default function AdminScanPage() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
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

  // Anti-loop refs
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isBusyRef = useRef<boolean>(false);
  const lastScannedTicketRef = useRef<string>('');
  const lastScannedTimestampRef = useRef<number>(0);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const resumeScanning = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setCurrentResult(null);
    isBusyRef.current = false;
  }, []);

  const stopCamera = useCallback(async () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    isBusyRef.current = false;

    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2 || state === 3) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.warn('Stop camera err:', err);
      }
      try {
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const processTicket = useCallback(
    async (rawTicket: string) => {
      const ticketId = extractTicketId(rawTicket);
      if (!ticketId) return;

      const now = Date.now();
      // Cegah scan berulang pada tiket yang sama dalam 7 detik
      if (
        lastScannedTicketRef.current === ticketId &&
        now - lastScannedTimestampRef.current < 7000
      ) {
        return;
      }

      isBusyRef.current = true;
      lastScannedTicketRef.current = ticketId;
      lastScannedTimestampRef.current = now;

      setIsProcessing(true);
      const effectivePin =
        pin ||
        (typeof window !== 'undefined' ? sessionStorage.getItem('zctech_admin_pin') || '' : '');

      try {
        const res = await fetch('/api/events/admin/attendees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-pin': effectivePin,
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
              message: `✓ Berhasil Check-In: ${reg.fullName}`,
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
            resumeScanning();
          }, 3200);
        }
      }
    },
    [pin, soundEnabled, autoNext, resumeScanning]
  );

  const processTicketRef = useRef(processTicket);
  useEffect(() => {
    processTicketRef.current = processTicket;
  });

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCurrentResult(null);
    isBusyRef.current = false;

    try {
      const containerId = 'fullscreen-qr-reader';
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;

      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = html5QrCode;

      const cameraConfig: string | { facingMode: string } = selectedCameraId
        ? selectedCameraId
        : { facingMode };

      const scanConfig = {
        fps: 10,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdge * 0.72);
          return {
            width: Math.max(qrboxSize, 200),
            height: Math.max(qrboxSize, 200),
          };
        },
      };

      try {
        await html5QrCode.start(
          cameraConfig,
          scanConfig,
          (decodedText) => {
            if (isBusyRef.current) return;
            processTicketRef.current?.(decodedText);
          },
          () => {}
        );
      } catch (firstErr) {
        console.warn('Primary camera start failed, trying first available device:', firstErr);
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          await html5QrCode.start(
            cameras[0].id,
            scanConfig,
            (decodedText) => {
              if (isBusyRef.current) return;
              processTicketRef.current?.(decodedText);
            },
            () => {}
          );
        } else {
          throw firstErr;
        }
      }

      setCameraActive(true);

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setAvailableCameras(
            devices.map((d, i) => ({
              id: d.id,
              label: d.label || `Kamera ${i + 1}`,
            }))
          );
        }
      } catch {
        // ignore
      }
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
  }, [facingMode, selectedCameraId, stopCamera]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !html5QrCodeRef.current) return;

    setIsProcessing(true);
    try {
      const decodedText = await html5QrCodeRef.current.scanFile(file, false);
      processTicketRef.current?.(decodedText);
    } catch {
      alert('QR Code tidak terdeteksi pada gambar yang dipilih.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => {
        startCamera();
      }, 250);
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
              <h2 className="text-sm font-black text-foreground flex items-center gap-1.5">
                Scanner Registrasi Ulang
                {cameraActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </h2>
              <p className="text-[11px] text-muted-foreground">Arahkan kamera ke QR Code tiket peserta</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {availableCameras.length > 1 ? (
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="rounded-xl border border-border bg-muted/60 px-2.5 py-1 text-xs text-foreground focus:border-emerald-500 focus:outline-none max-w-[130px] truncate"
                  title="Pilih Kamera"
                >
                  <option value="">Kamera Default</option>
                  {availableCameras.map((cam) => (
                    <option key={cam.id} value={cam.id}>
                      {cam.label}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  onClick={() => {
                    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition"
                  title="Ganti Kamera"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  soundEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
                }`}
                title="Suara Beep"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition"
                title="Unggah File / Screenshot QR"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Viewfinder */}
          <div className="relative w-full min-h-[300px] max-h-[420px] bg-black overflow-hidden flex items-center justify-center">
            <div
              id="fullscreen-qr-reader"
              className="w-full flex items-center justify-center [&_video]:max-h-[420px] [&_video]:w-full [&_video]:object-contain"
            />

            {/* Target Overlay */}
            {cameraActive && !currentResult && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-60 w-60 rounded-3xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce duration-1000" />
                  <div className="absolute -top-1.5 -left-1.5 h-6 w-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  <div className="absolute -top-1.5 -right-1.5 h-6 w-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1.5 -left-1.5 h-6 w-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
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
              <div className="absolute inset-x-3 bottom-3 z-30 animate-in slide-in-from-bottom-3 duration-200">
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
                      <p className="font-black text-sm">{currentResult.message}</p>
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

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[10px] opacity-75">
                      {autoNext ? 'Lanjut otomatis dalam 3 detik...' : 'Siap tiket berikutnya'}
                    </span>
                    <button
                      onClick={resumeScanning}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30"
                    >
                      Scan Berikutnya <ArrowRight className="h-3 w-3" />
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
                  Auto-Lanjut (3s)
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
