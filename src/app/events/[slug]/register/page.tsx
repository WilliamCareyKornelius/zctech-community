import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { events } from '@/lib/content';
import { RegisterFormClient } from './register-form-client';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: 'Pendaftaran Kegiatan Tidak Ditemukan' };

  return {
    title: `Daftar: ${event.title}`,
    description: `Formulir pendaftaran resmi kegiatan ${event.title}. Dapatkan e-tiket masuk dan free e-certificate.`,
    openGraph: {
      title: `Daftar: ${event.title}`,
      description: `Formulir pendaftaran resmi ${event.title}.`,
      images: [{ url: event.coverImage }],
    },
  };
}

export default async function EventRegisterPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return <RegisterFormClient event={event} />;
}
