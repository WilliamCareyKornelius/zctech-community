/**
 * Utility modul untuk penanganan format tanggal dan waktu
 * terkunci secara konsisten pada zona waktu Samarinda: WITA (Asia/Makassar, UTC+8).
 */

export const TIMEZONE_WITA = 'Asia/Makassar';

/**
 * Format tanggal dan jam lengkap: e.g. "5 Sep 2026, 01.40 WITA"
 */
export function formatDateTimeWITA(dateOrIso: string | Date | null | undefined): string {
  if (!dateOrIso) return '-';
  try {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    if (isNaN(d.getTime())) return '-';

    const formatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE_WITA,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);

    return `${formatted} WITA`;
  } catch {
    return '-';
  }
}

/**
 * Format jam dan menit saja: e.g. "01.40 WITA"
 */
export function formatTimeWITA(dateOrIso: string | Date | null | undefined): string {
  if (!dateOrIso) return '-';
  try {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    if (isNaN(d.getTime())) return '-';

    const formatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE_WITA,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);

    return `${formatted} WITA`;
  } catch {
    return '-';
  }
}

/**
 * Format tanggal panjang untuk kegiatan/acara: e.g. "Selasa, 15 September 2026"
 */
export function formatEventFullDateWITA(dateOrIso: string | Date | null | undefined): string {
  if (!dateOrIso) return '-';
  try {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE_WITA,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Format tanggal standar untuk card/list/blog: e.g. "15 Sep 2026" atau "15 September 2026"
 */
export function formatEventDateWITA(
  dateOrIso: string | Date | null | undefined,
  monthFormat: 'short' | 'long' = 'short'
): string {
  if (!dateOrIso) return '-';
  try {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE_WITA,
      day: 'numeric',
      month: monthFormat,
      year: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Format tanggal dengan jam untuk jadwal event: e.g. "Selasa, 15 September 2026, 14.00 WITA"
 */
export function formatEventWithTimeWITA(dateOrIso: string | Date | null | undefined): string {
  if (!dateOrIso) return '-';
  try {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    if (isNaN(d.getTime())) return '-';

    const formatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE_WITA,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);

    return `${formatted} WITA`;
  } catch {
    return '-';
  }
}
