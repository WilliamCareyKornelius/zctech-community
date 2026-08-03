import type { Metadata } from 'next';
import { BlogList } from './blog-list';
import { JsonLd } from '@/components/shared/json-ld';
import { posts, siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Artikel, tutorial, writeup, dan opini dari komunitas ${siteConfig.name}.`,
  openGraph: { images: ['/kegiatan/img-04.jpg'] },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Blog ZCTech',
          url: `${siteConfig.url}/blog`,
          description: 'Artikel komunitas ZCTech Community',
        }}
      />

      <section className="w-full bg-black px-4 pb-12 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Blog Komunitas</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
          Artikel & Opini
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Berbagi pengetahuan seputar cybersecurity, programming, dan tren teknologi.
        </p>
      </section>

      <BlogList posts={posts} />
    </>
  );
}
