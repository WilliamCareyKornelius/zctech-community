import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ExternalLink, Trophy } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { competitions, siteConfig } from '@/lib/content';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return competitions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const comp = competitions.find((c) => c.slug === slug);
  if (!comp) return { title: 'Lomba tidak ditemukan' };
  return {
    title: comp.title,
    description: comp.description,
    openGraph: { title: comp.title, description: comp.description, images: [{ url: comp.coverImage }] },
  };
}

export default async function CompetitionDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const comp = competitions.find((c) => c.slug === slug);
  if (!comp) notFound();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: comp.title,
          description: comp.description,
          organizer: { '@type': 'Organization', name: comp.organizer },
          startDate: comp.deadline,
          url: `${siteConfig.url}/competitions/${comp.slug}`,
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/competitions" className="text-sm text-emerald-400 hover:text-emerald-300">← Kembali ke lomba</Link>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">{comp.title}</h1>
          <p className="mt-2 text-zinc-500">{comp.organizer}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">{comp.category}</span>
            {comp.prizeInfo && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-300">{comp.prizeInfo}</span>
            )}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{comp.description}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <img src={comp.coverImage} alt={comp.title} className="h-64 w-full object-cover sm:h-80" />
          </div>

          <div className="mt-6 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Deadline pendaftaran: {formatDate(comp.deadline)}
            </span>
          </div>

          <a
            href={comp.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-black transition hover:bg-emerald-300"
          >
            <ExternalLink className="h-4 w-4" /> Kunjungi halaman resmi
          </a>
        </div>
      </section>
    </>
  );
}
