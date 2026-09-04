import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticket');

  if (!ticketId) {
    return new NextResponse('Ticket ID is required', { status: 400 });
  }

  const verifyUrl = `https://community.zctech.id/events/verify?ticket=${encodeURIComponent(ticketId)}`;

  try {
    const qrPngBuffer = await QRCode.toBuffer(verifyUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#022c22',
        light: '#ffffff',
      },
    });

    return new NextResponse(qrPngBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return new NextResponse('Failed to generate QR code', { status: 500 });
  }
}
