'use client';

import { motion } from 'framer-motion';
import { Carousel_006 } from '@/components/ui/skiper-ui/skiper54';

const images = [
  { src: '/kegiatan/img-01.jpg', alt: 'Live Bug Bounty Workshop', title: 'Live Bug Bounty Workshop' },
  { src: '/kegiatan/img-02.jpg', alt: 'Community Tech Meetup', title: 'Community Tech Meetup' },
  { src: '/kegiatan/img-03.jpg', alt: 'Hands-on Pentest Lab', title: 'Hands-on Pentest Lab' },
  { src: '/kegiatan/img-04.jpg', alt: 'Malware Analysis Training', title: 'Malware Analysis Training' },
  { src: '/kegiatan/img-05.jpg', alt: 'Sharing Session Industri', title: 'Sharing Session Industri' },
  { src: '/kegiatan/img-06.jpg', alt: 'CTF Competition Mentoring', title: 'CTF Competition Mentoring' },
  { src: '/kegiatan/img-07.jpg', alt: 'Gathering Anggota Komunitas', title: 'Gathering Anggota Komunitas' },
  { src: '/kegiatan/img-08.jpg', alt: 'Persiapan Security Audit', title: 'Persiapan Security Audit' },
  { src: '/kegiatan/img-09.jpg', alt: 'Networking & Synergy', title: 'Networking & Synergy' },
  { src: '/kegiatan/img-10.jpg', alt: 'Sesi Tanya Jawab Ekspertis', title: 'Sesi Tanya Jawab Ekspertis' },
  { src: '/kegiatan/img-11.jpg', alt: 'Foto Bersama Komunitas ZCTech', title: 'Foto Bersama Komunitas ZCTech' },
];

export function SkiperGallery() {
  return (
    <section className="w-full overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Galeri & Video</span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Momen Komunitas Kami</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Dokumentasi kegiatan, meetup, dan pelatihan ZCTech Community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-12"
        >
          <Carousel_006
            images={images}
            className=""
            loop={true}
            showNavigation={true}
            showPagination={true}
            autoplay={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
        >
          <video
            controls
            poster="/kegiatan/img-01.jpg"
            className="h-auto w-full max-h-[60vh] object-cover"
          >
            <source src="/kegiatan/activity.mp4" type="video/mp4" />
            Browser Anda tidak mendukung pemutar video.
          </video>
        </motion.div>
      </div>
    </section>
  );
}
