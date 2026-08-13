import type { Metadata } from 'next';
import { ContactForm } from './contact-form';
import { JsonLd } from '@/components/shared/json-ld';
import { siteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: `Kontak ${siteConfig.name} melalui form, email, atau social media. Kami terbuka untuk kolaborasi dan pertanyaan.`,
  openGraph: { images: ['/kegiatan/img-07.jpg'] },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Kontak ${siteConfig.name}`,
          url: `${siteConfig.url}/contact`,
          description: siteConfig.description,
        }}
      />

      <section className="w-full bg-background px-4 pb-12 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Kontak</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-foreground sm:text-5xl">
          Hubungi Kami
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Punya pertanyaan, ide kolaborasi, atau ingin bergabung? Silakan kirim pesan ke tim kami.
        </p>
      </section>

      <section className="w-full bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-8">
            <h2 className="text-2xl font-bold text-foreground">Kirim Pesan</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-background p-8">
              <h3 className="text-xl font-bold text-foreground">Email</h3>
              <p className="mt-2 text-muted-foreground">{siteConfig.email}</p>
              <a href={`mailto:${siteConfig.email}`} className="mt-3 inline-block text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200">
                Kirim email →
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-background p-8">
              <h3 className="text-xl font-bold text-foreground">Social Media</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {Object.entries(siteConfig.socials).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card px-4 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
