import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-black px-4 text-center sm:px-6 lg:px-8">
      <h1 className="text-6xl font-extrabold text-emerald-400">404</h1>
      <p className="mt-4 text-xl text-white">Halaman tidak ditemukan</p>
      <p className="mt-2 text-zinc-400">Sepertinya halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-black transition hover:bg-emerald-300"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
