import nodemailer from 'nodemailer';
import type { EventRegistration } from './db';
import { formatDateTimeWITA } from './date';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || 'cakaras2150@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'plbz bsbw yuvx oemw';
const SMTP_FROM = process.env.SMTP_FROM || '"ZCTech Community" <cakaras2150@gmail.com>';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export function generateTravelokaTicketHtml(reg: EventRegistration): string {
  const verifyUrl = `https://community.zctech.id/events/verify?ticket=${encodeURIComponent(reg.id)}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Tiket: ${reg.eventTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f17;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f17;
      padding: 30px 10px;
    }
    .ticket-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%);
      padding: 28px 24px;
      color: #ffffff;
      text-align: left;
    }
    .badge-status {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 6px 0;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 13px;
      color: #a7f3d0;
      margin: 0;
    }
    .booking-box {
      background-color: #f8fafc;
      border-bottom: 2px dashed #cbd5e1;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .booking-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .booking-code {
      font-size: 24px;
      font-weight: 900;
      color: #047857;
      letter-spacing: 1px;
      font-family: 'Courier New', Courier, monospace;
      margin-top: 4px;
    }
    .qr-container {
      text-align: center;
      padding: 24px;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }
    .qr-image {
      width: 170px;
      height: 170px;
      border: 6px solid #f8fafc;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .qr-hint {
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
    }
    .details-section {
      padding: 24px;
      background-color: #ffffff;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 14px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 6px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .info-table td {
      padding: 8px 0;
      vertical-align: top;
      font-size: 14px;
    }
    .info-label {
      width: 38%;
      color: #64748b;
      font-weight: 500;
    }
    .info-value {
      width: 62%;
      color: #0f172a;
      font-weight: 700;
    }
    .notice-box {
      background-color: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 12px;
      padding: 16px;
      margin: 16px 24px 24px 24px;
    }
    .notice-title {
      font-size: 13px;
      font-weight: 800;
      color: #065f46;
      margin-bottom: 6px;
    }
    .notice-text {
      font-size: 12px;
      color: #047857;
      line-height: 1.6;
      margin: 0;
    }
    .btn-verify {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 4px 0;
    }
    @media only screen and (max-width: 480px) {
      .header-title { font-size: 19px; }
      .booking-code { font-size: 20px; }
      .qr-image { width: 140px; height: 140px; }
      .info-table td { font-size: 13px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="ticket-card">
      <!-- Header -->
      <div class="header">
        <span class="badge-status">✓ TERKONFIRMASI / CONFIRMED</span>
        <h1 class="header-title">${reg.eventTitle}</h1>
        <p class="header-subtitle">ZCTech Community &bull; Official Event Pass & Registration Receipt</p>
      </div>

      <!-- Booking / Ticket ID Box -->
      <div class="booking-box">
        <div>
          <div class="booking-label">KODE PENDAFTARAN / TICKET ID</div>
          <div class="booking-code">${reg.id}</div>
        </div>
        <div style="text-align: right;">
          <div class="booking-label">STATUS TIKET</div>
          <div style="font-size: 14px; font-weight: 800; color: #10b981; margin-top: 4px;">FREE PASS (GRATIS)</div>
        </div>
      </div>

      <!-- QR Code Section -->
      <div class="qr-container">
        <img src="cid:ticket_qrcode" alt="QR Code Tiket: ${reg.id}" width="170" height="170" class="qr-image" style="display: inline-block; width: 170px; height: 170px; border: 6px solid #f8fafc; border-radius: 12px;" />
        <div class="qr-hint">
          Tunjukkan QR Code ini kepada panitia saat check-in registrasi ulang di lokasi.
        </div>
        <div style="margin-top: 14px;">
          <a href="${verifyUrl}" target="_blank" class="btn-verify">Buka Tiket & QR di Web &rarr;</a>
        </div>
      </div>

      <!-- Event Details -->
      <div class="details-section">
        <div class="section-title">RINCIAN KEGIATAN</div>
        <table class="info-table">
          <tr>
            <td class="info-label">🗓️ Hari / Tanggal</td>
            <td class="info-value">Selasa, 15 September 2026</td>
          </tr>
          <tr>
            <td class="info-label">⏰ Waktu Acara</td>
            <td class="info-value">14.00 - 16.30 WITA</td>
          </tr>
          <tr>
            <td class="info-label">📍 Lokasi / Tempat</td>
            <td class="info-value">Aula Kampus Politani Samarinda</td>
          </tr>
          <tr>
            <td class="info-label">🎙️ Pemateri</td>
            <td class="info-value">Muhammad Kevin Adli Pratama</td>
          </tr>
          <tr>
            <td class="info-label">💡 Topik Seminar</td>
            <td class="info-value">Cybersecurity Seminar, Live Ethical Hacking Demo, & Smart Agriculture (IoT)</td>
          </tr>
        </table>

        <div class="section-title">DATA PESERTA (ATTENDEE)</div>
        <table class="info-table">
          <tr>
            <td class="info-label">👤 Nama Lengkap</td>
            <td class="info-value">${reg.fullName}</td>
          </tr>
          <tr>
            <td class="info-label">✉️ Email</td>
            <td class="info-value">${reg.email}</td>
          </tr>
          <tr>
            <td class="info-label">📱 No. WhatsApp</td>
            <td class="info-value">${reg.whatsapp}</td>
          </tr>
          <tr>
            <td class="info-label">🏛️ Asal Instansi</td>
            <td class="info-value">${reg.institution}</td>
          </tr>
          <tr>
            <td class="info-label">🎓 Kategori Peserta</td>
            <td class="info-value">${reg.category}</td>
          </tr>
          <tr>
            <td class="info-label">🕒 Waktu Pendaftaran</td>
            <td class="info-value">${formatDateTimeWITA(reg.createdAt)}</td>
          </tr>
          ${
            reg.studentId
              ? `<tr>
            <td class="info-label">🆔 NIM / Identitas</td>
            <td class="info-value">${reg.studentId}</td>
          </tr>`
              : ''
          }
        </table>
      </div>

      <!-- Notice / Traveloka Style Guidelines -->
      <div class="notice-box">
        <div class="notice-title">📌 PETUNJUK PENTING KEHADIRAN (CHECK-IN)</div>
        <p class="notice-text">
          1. Mohon hadir 15 menit sebelum acara dimulai untuk registrasi ulang.<br>
          2. Cukup tunjukkan bukti email ini atau QR code langsung dari layar handphone Anda kepada panitia di pintu masuk.<br>
          3. Peserta yang hadir berhak memperoleh <strong>Free E-Certificate</strong> dan akses <strong>Interactive Platform Showcase</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text"><strong>ZCTech Community</strong> &bull; Pusat Ekosistem Cybersecurity & Tech Talent Indonesia</p>
        <p class="footer-text">Butuh bantuan? Hubungi WhatsApp Panitia: 0823-5327-2920 | Instagram: @zctech.id</p>
        <p class="footer-text">&copy; 2026 ZCTech Community. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEventTicketEmail(registration: EventRegistration): Promise<boolean> {
  try {
    const htmlContent = generateTravelokaTicketHtml(registration);

    // Extract base64 image data to buffer for inline CID attachment (Gmail compliant)
    const qrBase64 = registration.qrCodeDataUrl.includes(',')
      ? registration.qrCodeDataUrl.split(',')[1]
      : registration.qrCodeDataUrl;
    const qrBuffer = Buffer.from(qrBase64, 'base64');

    const mailOptions = {
      from: SMTP_FROM,
      to: registration.email,
      subject: `[E-Tiket Resmi] Bukti Pendaftaran ${registration.eventTitle} - ${registration.id}`,
      html: htmlContent,
      attachments: [
        {
          filename: `qrcode-${registration.id}.png`,
          content: qrBuffer,
          cid: 'ticket_qrcode',
          contentType: 'image/png',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] Ticket ${registration.id} sent to ${registration.email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send ticket to ${registration.email}:`, error);
    return false;
  }
}
