'use client';

import { motion } from 'framer-motion';

const galleryImages = [
  '/kegiatan/img-01.jpg',
  '/kegiatan/img-02.jpg',
  '/kegiatan/img-03.jpg',
  '/kegiatan/img-04.jpg',
  '/kegiatan/img-05.jpg',
  '/kegiatan/img-06.jpg',
  '/kegiatan/img-07.jpg',
  '/kegiatan/img-08.jpg',
  '/kegiatan/img-09.jpg',
  '/kegiatan/img-10.jpg',
  '/kegiatan/img-11.jpg',
];

export function CommunityGallery() {
  return (
    <section className="w-full bg-black px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Galeri & Video</span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Momen Komunitas Kami</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Dokumentasi kegiatan, meetup, dan pelatihan ZCTech Community.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
          <video
            controls
            poster="/kegiatan/img-01.jpg"
            className="h-auto w-full max-h-[60vh] object-cover"
          >
            <source src="/kegiatan/activity.mp4" type="video/mp4" />
            Browser Anda tidak mendukung pemutar video.
          </video>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {galleryImages.map((src, index) => (
            <motion.div
              key={src}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={src}
                alt={`Momen komunitas ${index + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
