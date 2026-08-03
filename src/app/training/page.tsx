import type { Metadata } from 'next';
import { TrainingList } from './training-list';
import { JsonLd } from '@/components/shared/json-ld';
import { siteConfig, trainingPrograms } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Pelatihan',
  description: `Program pelatihan cybersecurity, networking, dan programming dari ${siteConfig.name}.`,
  openGraph: { images: ['/kegiatan/img-01.jpg'] },
};

export default function TrainingPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Pelatihan ZCTech',
          url: `${siteConfig.url}/training`,
          description: 'Program pelatihan komunitas ZCTech',
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Program Pelatihan</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
          Pelatihan & Bootcamp
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Tingkatkan keahlian teknis lewat pelatihan berbasis hands-on dan kurikulum komunitas.
        </p>
      </section>

      <TrainingList programs={trainingPrograms} />
    </>
  );
}
