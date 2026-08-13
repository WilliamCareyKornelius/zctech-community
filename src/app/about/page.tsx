import type { Metadata } from 'next';
import { Shield, Target, Users, Zap } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/shared/fade-in';
import { DiscordCTA } from '@/components/sections/discord-cta';
import { coreValues, siteConfig, team } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: `Profil organisasi ${siteConfig.name}, visi, misi, dan tim pengurus komunitas tech dan cybersecurity Indonesia.`,
  openGraph: { images: ['/kegiatan/img-07.jpg'] },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `Tentang ${siteConfig.name}`,
          url: `${siteConfig.url}/about`,
          description: siteConfig.description,
        }}
      />

      <section className="w-full bg-background px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Profil Organisasi</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-foreground sm:text-6xl">
          Tentang {siteConfig.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{siteConfig.description}</p>
      </section>

      <section className="w-full bg-muted px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <FadeIn
            direction="left"
            className="rounded-3xl border border-border bg-background p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Visi</h2>
            <p className="mt-4 text-muted-foreground">
              Menjadi komunitas teknologi terdepan di Indonesia yang membangun ekosistem cybersecurity dan tech talent yang kolaboratif, inklusif, dan memberi dampak positif bagi industri.
            </p>
          </FadeIn>

          <FadeIn
            direction="right"
            className="rounded-3xl border border-border bg-background p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Misi</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Menyediakan wadah belajar berbasis hands-on untuk talenta cybersecurity.</li>
              <li>Mengadakan kegiatan komunitas seperti workshop dan diskusi rutin.</li>
              <li>Membangun jejaring antara praktisi, akademisi, dan industri.</li>
              <li>Mendorong etika dan tanggung jawab dalam keamanan siber.</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="w-full bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Nilai-Nilai Kami</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <FadeIn
                key={value.title}
                delay={index * 0.1}
                className="rounded-2xl border border-border bg-muted p-6 text-left"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  {index === 0 ? <Shield className="h-5 w-5" /> : index === 1 ? <Zap className="h-5 w-5" /> : index === 2 ? <Users className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Perjalanan Kami</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Sejarah Singkat</h2>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>
              ZCTech Community berawal dari grup diskusi kecil yang ingin meningkatkan awareness keamanan siber di kalangan pelajar dan profesional muda Indonesia. Seiring waktu, diskusi berkembang menjadi workshop daring dan meetup luring yang melibatkan banyak anggota.
            </p>
            <p>
              Kini kami menjadi wadah aktif untuk belajar bersama, berbagi wawasan, dan mempersiapkan talenta tech menghadapi tantangan industri yang semakin kompleks.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Tata Kelola</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Struktur Organisasi</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Community Lead', desc: 'Arah strategis dan representasi komunitas', icon: Target },
              { title: 'Program & Kegiatan', desc: 'Kurator topik, mentor, dan jadwal kegiatan komunitas', icon: Users },
              { title: 'Konten & Riset', desc: 'Artikel, sharing session, dan riset keamanan siber', icon: Zap },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-muted p-6 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Tim Pengurus Inti</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <FadeIn
                key={member.name}
                delay={index * 0.1}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <img
                  src={member.image}
                  alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">{member.role}</p>
                <div className="mt-4 flex justify-center gap-2">
                  {member.socmed.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <DiscordCTA />
    </>
  );
}
