import type { Metadata } from 'next';
import { Shield, Target, Users, Zap } from 'lucide-react';
import { JsonLd } from '@/components/shared/json-ld';
import { FadeIn } from '@/components/shared/fade-in';
import { coreValues, siteConfig, team } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: `Profil organisasi ${siteConfig.name}, visi, misi, dan tim pengurus komunitas tech dan cybersecurity Indonesia.`,
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

      <section className="w-full bg-black px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Profil Organisasi</span>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-6xl">
          Tentang {siteConfig.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">{siteConfig.description}</p>
      </section>

      <section className="w-full bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <FadeIn
            direction="left"
            className="rounded-3xl border border-white/10 bg-black p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Visi</h2>
            <p className="mt-4 text-zinc-400">
              Menjadi komunitas teknologi terdepan di Indonesia yang membangun ekosistem cybersecurity dan tech talent yang kolaboratif, inklusif, dan memberi dampak positif bagi industri.
            </p>
          </FadeIn>

          <FadeIn
            direction="right"
            className="rounded-3xl border border-white/10 bg-black p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Misi</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-400">
              <li>Menyediakan wadah belajar berbasis hands-on untuk talenta cybersecurity.</li>
              <li>Mengadakan kegiatan rutin: workshop, webinar, meetup, dan kompetisi.</li>
              <li>Membangun jejaring antara praktisi, akademisi, dan industri.</li>
              <li>Mendorong etika dan tanggung jawab dalam keamanan siber.</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="w-full bg-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Nilai-Nilai Kami</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <FadeIn
                key={value.title}
                delay={index * 0.1}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-left"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  {index === 0 ? <Shield className="h-5 w-5" /> : index === 1 ? <Zap className="h-5 w-5" /> : index === 2 ? <Users className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{value.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Tim Pengurus Inti</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <FadeIn
                key={member.name}
                delay={index * 0.1}
                className="rounded-2xl border border-white/10 bg-black p-6"
              >
                <img
                  src={member.image}
                  alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                />
                <h3 className="mt-4 text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-emerald-400">{member.role}</p>
                <div className="mt-4 flex justify-center gap-2">
                  {member.socmed.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white"
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
    </>
  );
}
