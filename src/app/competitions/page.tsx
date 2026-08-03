import type { Metadata } from 'next';
import { CompetitionsList } from './competitions-list';
import { JsonLd } from '@/components/shared/json-ld';
import { competitions, siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Lomba & Kompetisi',
  description: `Agregator kompetisi tech nasional dan internasional untuk komunitas ${siteConfig.name}.`,
  openGraph: { images: ['/kegiatan/img-11.jpg'] },
};

export default function CompetitionsPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Lomba ZCTech',
          url: `${siteConfig.url}/competitions`,
          description: 'Informasi lomba tech untuk komunitas ZCTech',
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Agregator Lomba</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
          Lomba & Kompetisi
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Kurasi lomba CTF, hackathon, competitive programming, dan bug bounty yang relevan untuk anggota.
        </p>
      </section>

      <CompetitionsList competitions={competitions} />
    </>
  );
}
