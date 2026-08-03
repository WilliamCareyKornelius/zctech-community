'use client';

import React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

export const HeroParallax = ({
  products,
}: {
  products?: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const defaultProducts = [
    { title: 'Live Bug Bounty Workshop', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-01.jpg' },
    { title: 'Community Tech Meetup', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-02.jpg' },
    { title: 'Hands-on Pentest Lab', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-03.jpg' },
    { title: 'Malware Analysis Training', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-04.jpg' },
    { title: 'Sharing Session Industri', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-05.jpg' },
    { title: 'CTF Competition Mentoring', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-06.jpg' },
    { title: 'Gathering Anggota Komunitas', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-07.jpg' },
    { title: 'Persiapan Security Audit', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-08.jpg' },
    { title: 'Networking & Synergy', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-09.jpg' },
    { title: 'Sesi Tanya Jawab Ekspertis', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-10.jpg' },
    { title: 'Foto Bersama Komunitas ZCTech', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-11.jpg' },
    { title: 'Cybersecurity Workshop', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-01.jpg' },
    { title: 'Ethical Hacking Lab', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-02.jpg' },
    { title: 'Community Gathering', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-03.jpg' },
    { title: 'Tech Talent Ecosystem', link: 'https://discord.gg/s67RfATTBk', thumbnail: '/kegiatan/img-04.jpg' },
  ];

  const items = products && products.length >= 15 ? products : defaultProducts;

  const firstRow = items.slice(0, 5);
  const secondRow = items.slice(5, 10);
  const thirdRow = items.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title + idx}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title + idx}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title + idx}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-6 w-full left-0 top-0 z-20">
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300 uppercase">
          Official ZCTech Community Hub
        </span>
      </div>

      <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] max-w-4xl tracking-tight">
        Pusat Ekosistem <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          Cybersecurity & Tech Talent
        </span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-zinc-400 font-normal leading-relaxed">
        Wadah terbuka bagi para antusias keamanan siber, pentester, dan pengembang teknologi Indonesia. Mari berbagi wawasan, ikuti pelatihan rutin, dan tingkatkan keahlian teknis Anda.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
        <a
          href="https://discord.gg/s67RfATTBk"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:scale-105 flex items-center justify-center gap-2 group"
        >
          <span>Gabung Discord Server</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>

        <a
          href="#gallery"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-2"
        >
          <span>Jelajahi Galeri 3D</span>
        </a>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl"
    >
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group-hover/product:shadow-2xl w-full h-full"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="eager"
          className="object-cover object-center absolute h-full w-full inset-0 opacity-80 group-hover/product:opacity-100 transition-opacity duration-300"
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300"></div>
      <h2 className="font-bold text-white absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 text-sm z-10">
        {product.title}
      </h2>
    </motion.div>
  );
};
