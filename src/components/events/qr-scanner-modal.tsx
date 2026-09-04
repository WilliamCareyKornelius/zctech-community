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
  ArrowRight,
  Upload,
} from 'lucide-react';
import type { EventRegistration } from '@/lib/db';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: string;
  onCheckInSuccess?: (reg: EventRegistration) => void;
}

// Suara Beep Lembut & Menyenangkan (Web Audio API)
function playScanSound(type: 'success' | 'warning' | 'error') {
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
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5

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

// Ekstrak ID Tiket dari format apa pun (URL, param, teks polos)
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
    // fallback regex
  }
  const match = trimmed.match(/ZCT-[A-Za-z0-9-_]+/i);
  if (match) return match[0].toUpperCase();
  return trimmed.toUpperCase();
}

export function QrScannerModal({ isOpen, onClose, pin, onCheckInSuccess }: QrScannerModalProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Status hasil
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'warning' | 'error';
    message: string;
    registration?: EventRegistration;
  } | null>(null);

  const [manualTicketInput, setManualTicketInput] = useState('');

  // Anti-loop refs (Kunci kestabilan & kecepatan scanner)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isBusyRef = useRef<boolean>(false);
  const lastScannedTicketRef = useRef<string>('');
  const lastScannedTimestampRef = useRef<number>(0);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lanjutkan scan berikutnya
  const resumeScanning = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setScanResult(null);
    isBusyRef.current = false;
  }, []);

  // Hentikan kamera
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
        console.warn('Stop error:', err);
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

  // Proses validasi dan check-in tiket
  const processTicket = useCallback(
    async (rawTicket: string) => {
      const ticketId = extractTicketId(rawTicket);
      if (!ticketId) return;

      const now = Date.now();
      // KUNCI: Abaikan jika tiket yang sama baru saja di-scan dalam 7 detik terakhir
      if (
        lastScannedTicketRef.current === ticketId &&
        now - lastScannedTimestampRef.current < 7000
      ) {
        return;
      }

      // Kunci pemrosesan agar tidak membaca frame video lain
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
              message: `✓ Berhasil Check-In: ${reg.fullName}`,
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
            message: data.error || `Tiket [${ticketId}] tidak valid.`,
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

        // Jika autoNext aktif, beri jeda 3.2 detik baru siap baca tiket selanjutnya
        if (autoNext) {
          resumeTimerRef.current = setTimeout(() => {
            resumeScanning();
          }, 3200);
        }
      }
    },
    [pin, soundEnabled, autoNext, onCheckInSuccess, resumeScanning]
  );

  // Simpan processTicket dalam ref agar re-render tidak menyebabkan kamera restart
  const processTicketRef = useRef(processTicket);
  useEffect(() => {
    processTicketRef.current = processTicket;
  });

  // Inisialisasi dan jalankan kamera dengan resolusi & deteksi optimal
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScanResult(null);
    isBusyRef.current = false;

    try {
      const containerId = 'interactive-qr-reader';
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;

      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      // Utamakan decoding QR Code saja untuk efisiensi CPU dan akurasi instan
      const html5QrCode = new Html5Qrcode(containerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = html5QrCode;

      // Konfigurasi target kamera
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
          () => {} // silent on normal empty frames
        );
      } catch (firstErr) {
        console.warn('Primary camera target failed, trying available camera fallback:', firstErr);
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

      // Ambil daftar kamera setelah izin aktif untuk dropdown
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
        // ignore device listing error
      }
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
  }, [facingMode, selectedCameraId, stopCamera]);

  // Scan dari file gambar jika kamera HP bermasalah
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !html5QrCodeRef.current) return;

    setIsProcessing(true);
    try {
      const decodedText = await html5QrCodeRef.current.scanFile(file, false);
      processTicketRef.current?.(decodedText);
    } catch {
      alert('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan gambar jelas dan tidak buram.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Efek buka/tutup modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startCamera();
      }, 250);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, startCamera, stopCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground flex items-center gap-1.5">
                Scanner QR Tiket Peserta
                {cameraActive && (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </h2>
              <p className="text-[11px] text-muted-foreground">Arahkan kamera ke QR Code tiket peserta</p>
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
        <div className="relative bg-black w-full overflow-hidden flex items-center justify-center min-h-[300px] max-h-[380px]">
          <div
            id="interactive-qr-reader"
            className="w-full flex items-center justify-center [&_video]:max-h-[380px] [&_video]:w-full [&_video]:object-contain"
          />

          {/* Target Frame Overlay */}
          {cameraActive && !scanResult && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-60 w-60 rounded-3xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                {/* Laser scan line */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce duration-1000" />
                {/* 4 Corner Markers */}
                <div className="absolute -top-1.5 -left-1.5 h-6 w-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute -top-1.5 -right-1.5 h-6 w-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute -bottom-1.5 -left-1.5 h-6 w-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
              </div>
            </div>
          )}

          {/* Pesan Error Akses Kamera */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 p-6 text-center z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Kamera Tidak Dapat Dibuka</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs">{cameraError}</p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Nyalakan Lagi
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm z-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-3" />
              <p className="text-xs font-bold text-emerald-400">Menyimpan Kehadiran...</p>
            </div>
          )}

          {/* Pop-Up Hasil Scan */}
          {scanResult && (
            <div className="absolute inset-x-3 bottom-3 z-30 animate-in slide-in-from-bottom-3 duration-200">
              <div
                className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                  scanResult.status === 'success'
                    ? 'border-emerald-500 bg-emerald-950/95 text-emerald-100'
                    : scanResult.status === 'warning'
                    ? 'border-amber-500 bg-amber-950/95 text-amber-100'
                    : 'border-destructive bg-destructive/95 text-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {scanResult.status === 'success' && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    )}
                    {scanResult.status === 'warning' && (
                      <AlertTriangle className="h-6 w-6 text-amber-400" />
                    )}
                    {scanResult.status === 'error' && <AlertCircle className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-black text-sm">{scanResult.message}</p>
                    {scanResult.registration && (
                      <div className="mt-1 space-y-0.5 opacity-90">
                        <p>
                          <span className="opacity-75">Nama:</span>{' '}
                          <strong className="text-white">{scanResult.registration.fullName}</strong>
                        </p>
                        <p>
                          <span className="opacity-75">Instansi:</span>{' '}
                          {scanResult.registration.institution} ({scanResult.registration.category})
                        </p>
                        <p className="font-mono text-[11px] opacity-75">
                          ID: {scanResult.registration.id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] opacity-75">
                    {autoNext ? 'Siap otomatis dalam 3 detik...' : 'Siap tiket berikutnya'}
                  </span>
                  <button
                    onClick={resumeScanning}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30 active:scale-95 transition"
                  >
                    Scan Tiket Berikutnya <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar Pengaturan */}
        <div className="border-t border-border bg-card p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {availableCameras.length > 1 ? (
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="rounded-xl border border-border bg-muted/60 px-2.5 py-1.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none max-w-[140px] truncate"
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
                  type="button"
                  onClick={toggleFacingMode}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                  title="Ganti Kamera Depan/Belakang"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  {facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}
                </button>
              )}

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

              {/* Upload Foto QR Fallback */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                title="Pilih File Gambar / Screenshot QR"
              >
                <Upload className="h-3.5 w-3.5" />
                File QR
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-500" />
                Auto-Lanjut
              </span>
            </label>
          </div>

          {/* Input Manual */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualTicketInput.trim()) {
                processTicket(manualTicketInput.trim());
                setManualTicketInput('');
              }
            }}
            className="flex gap-2 pt-1 border-t border-border/50"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={manualTicketInput}
                onChange={(e) => setManualTicketInput(e.target.value)}
                placeholder="Ketik manual ID Tiket (misal: ZCT-EXP-...)"
                className="w-full rounded-xl border border-border bg-muted/40 pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!manualTicketInput.trim() || isProcessing}
              className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition shrink-0"
            >
              Cek
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
