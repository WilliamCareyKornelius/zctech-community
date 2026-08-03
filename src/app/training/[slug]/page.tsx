import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Clock, Users, Layers, BookOpen } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { siteConfig, trainingPrograms } from '@/lib/content';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return trainingPrograms.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const program = trainingPrograms.find((t) => t.slug === slug);
  if (!program) return { title: 'Pelatihan tidak ditemukan' };
  return {
    title: program.title,
    description: program.description,
    openGraph: { title: program.title, description: program.description, images: [{ url: program.coverImage }] },
  };
}

export default async function TrainingDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const program = trainingPrograms.find((t) => t.slug === slug);
  if (!program) notFound();

  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.description,
          educationalLevel: program.level,
          courseCode: program.slug,
          url: `${siteConfig.url}/training/${program.slug}`,
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/training" className="text-sm text-emerald-400 hover:text-emerald-300">← Kembali ke pelatihan</Link>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">{program.title}</h1>
          <p className="mt-4 text-lg text-zinc-400">{program.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300 capitalize">{program.category}</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300 capitalize">{program.level}</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">{program.price}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {program.duration}</span>
            <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4" /> {program.format}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {program.trainer}</span>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <img src={program.coverImage} alt={program.title} className="h-64 w-full object-cover sm:h-80" />
          </div>
        </div>
      </section>

      <section className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h2 className="text-xl font-bold text-white">Silabus</h2>
              <ul className="mt-4 space-y-3">
                {program.syllabus.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-zinc-300">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h2 className="text-xl font-bold text-white">Prasyarat</h2>
              <p className="mt-2 text-zinc-400">{program.prerequisites}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="font-bold text-white">Daftar Pelatihan</h3>
              <p className="mt-2 text-sm text-zinc-400">Hubungi kami melalui Discord atau form kontak untuk pendaftaran.</p>
              <a
                href={siteConfig.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-xl bg-emerald-400 py-3 text-center font-bold text-black transition hover:bg-emerald-300"
              >
                Daftar via Discord
              </a>
              <Link
                href="/contact"
                className="mt-3 block w-full rounded-xl border border-white/10 bg-zinc-900 py-3 text-center font-semibold text-white transition hover:bg-zinc-800"
              >
                Daftar via Kontak
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-6">
              <h3 className="font-bold text-white">Trainer</h3>
              <p className="mt-2 text-zinc-400">{program.trainer}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
