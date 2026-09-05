import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { CopyButton } from '@/components/shared/copy-button';
import { posts, siteConfig, team } from '@/lib/content';
import { formatEventDateWITA } from '@/lib/date';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Artikel tidak ditemukan' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', images: [{ url: post.coverImage }] },
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const shareUrl = `${siteConfig.url}/blog/${post.slug}`;
  const related = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);
  const author = team.find((m) => m.name === post.author);

  const formatDate = (iso: string) => formatEventDateWITA(iso, 'long');

  const renderContent = (text: string) =>
    text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="leading-relaxed text-muted-foreground">
        {paragraph}
      </p>
    ));

  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          author: { '@type': 'Person', name: post.author },
          datePublished: post.publishedAt,
          image: post.coverImage,
          url: shareUrl,
        }}
      />

      <section className="w-full bg-background px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200">
            <ArrowLeft className="h-4 w-4" /> Kembali ke blog
          </Link>

          <span className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-5xl">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime} menit baca
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
            <article className="mt-8 space-y-4 text-muted-foreground">
              {renderContent(post.content)}
            </article>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              <CopyButton text={shareUrl} label="Copy link" />
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:bg-card"
              >
                Share X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:bg-card"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-bold text-foreground">Tentang Penulis</h3>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={author?.image ?? '/kegiatan/img-07.jpg'}
                  alt={post.author}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Kontributor blog ZCTech</p>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-bold text-foreground">Artikel Terkait</h3>
                <ul className="mt-4 space-y-4">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/blog/${r.slug}`} className="text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-300">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
