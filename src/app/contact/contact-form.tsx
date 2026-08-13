'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const subjects = [
  'Umum',
  'Kolaborasi / Partnership',
  'Permintaan Pelatihan',
  'Laporan Bug',
  'Lainnya',
];

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Umum', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('ok');
        setForm({ name: '', email: '', subject: 'Umum', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Nama</label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground">Subjek</label>
        <select
          id="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-emerald-500"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Pesan</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 font-bold text-black transition hover:bg-emerald-300 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === 'submitting' ? 'Mengirim...' : 'Kirim Pesan'}
      </button>

      {status === 'ok' && <p className="text-sm text-emerald-600 dark:text-emerald-300">Pesan berhasil dikirim. Kami akan segera merespons.</p>}
      {status === 'error' && <p className="text-sm text-destructive">Gagal mengirim pesan. Silakan coba lagi.</p>}
    </form>
  );
}
