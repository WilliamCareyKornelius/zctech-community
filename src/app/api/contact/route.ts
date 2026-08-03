import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    console.log('[CONTACT FORM]', { name, email, subject, message });

    return NextResponse.json({ success: true, message: 'Pesan berhasil diterima' });
  } catch {
    return NextResponse.json({ error: 'Gagal memproses pesan' }, { status: 500 });
  }
}
