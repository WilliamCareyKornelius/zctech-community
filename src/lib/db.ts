import fs from 'fs';
import path from 'path';

export interface EventRegistration {
  id: string; // e.g. ZCT-2026-EXP-XXXX
  eventSlug: string;
  eventTitle: string;
  fullName: string;
  email: string;
  whatsapp: string;
  institution: string;
  category: string;
  studentId?: string;
  motivation?: string;
  qrCodeDataUrl: string;
  createdAt: string;
  status: 'confirmed' | 'attended';
  checkedInAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'registrations.json');

// Pastikan direktori data ada
function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), 'utf-8');
  }
}

// Baca semua pendaftaran
export async function getRegistrations(): Promise<EventRegistration[]> {
  ensureDbExists();
  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw) as EventRegistration[];
  } catch (error) {
    console.error('Error reading registrations DB:', error);
    return [];
  }
}

// Cari pendaftaran berdasarkan ID tiket
export async function getRegistrationById(id: string): Promise<EventRegistration | null> {
  const all = await getRegistrations();
  return all.find((r) => r.id.toLowerCase() === id.toLowerCase()) || null;
}

// Cari pendaftaran berdasarkan eventSlug dan email (cek duplikasi)
export async function findRegistrationByEmail(
  eventSlug: string,
  email: string
): Promise<EventRegistration | null> {
  const all = await getRegistrations();
  return (
    all.find(
      (r) =>
        r.eventSlug.toLowerCase() === eventSlug.toLowerCase() &&
        r.email.trim().toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
}

// Simpan pendaftaran baru secara aman (atomic write)
export async function saveRegistration(registration: EventRegistration): Promise<EventRegistration> {
  ensureDbExists();
  const all = await getRegistrations();

  // Cek apakah sudah ada (update jika ada atau tambahkan baru)
  const existingIdx = all.findIndex((r) => r.id === registration.id);
  if (existingIdx >= 0) {
    all[existingIdx] = registration;
  } else {
    all.unshift(registration);
  }

  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  await fs.promises.writeFile(tempFile, JSON.stringify(all, null, 2), 'utf-8');
  await fs.promises.rename(tempFile, DB_FILE);

  return registration;
}

// Check-in tiket saat hari-H acara
export async function checkInRegistration(
  id: string
): Promise<(EventRegistration & { alreadyAttended?: boolean }) | null> {
  const all = await getRegistrations();
  const target = all.find((r) => r.id.toLowerCase() === id.toLowerCase());
  if (!target) return null;

  const alreadyAttended = target.status === 'attended';
  if (!alreadyAttended) {
    target.status = 'attended';
    target.checkedInAt = new Date().toISOString();
    await saveRegistration(target);
  }

  return {
    ...target,
    alreadyAttended,
  };
}

// Hapus data pendaftaran peserta berdasarkan ID tiket
export async function deleteRegistration(id: string): Promise<boolean> {
  ensureDbExists();
  const all = await getRegistrations();
  const filtered = all.filter((r) => r.id.toLowerCase() !== id.toLowerCase());

  if (filtered.length === all.length) {
    return false;
  }

  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  await fs.promises.writeFile(tempFile, JSON.stringify(filtered, null, 2), 'utf-8');
  await fs.promises.rename(tempFile, DB_FILE);

  return true;
}
