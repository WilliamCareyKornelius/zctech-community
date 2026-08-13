import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-emerald-600 dark:text-emerald-300">404</h1>
      <p className="mt-4 text-xl text-foreground">Halaman tidak ditemukan</p>
      <p className="mt-2 text-muted-foreground">Sepertinya halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-black transition hover:bg-emerald-300"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
