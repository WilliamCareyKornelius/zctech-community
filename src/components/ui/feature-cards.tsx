'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';

export function FeatureCards() {
  const programs = [
    {
      title: 'Events & Meetups',
      path: '/events',
      linkLabel: 'Lihat Kegiatan',
      desc: 'Gathering rutin, webinar, dan sesi diskusi bersama praktisi industri.',
      icon: <Calendar className="w-5 h-5 text-zinc-300" />,
      tag: 'Regular Agenda',
    },
    {
      title: 'Community & Networking',
      path: 'https://discord.gg/s67RfATTBk',
      linkLabel: 'Gabung Discord',
      desc: 'Ruang diskusi, tanya jawab, dan berjejaring bersama anggota ZCTech.',
      icon: <Users className="w-5 h-5 text-zinc-300" />,
      tag: 'Komunitas',
    },
    {
      title: 'Tech Blog & Insights',
      path: '/blog',
      linkLabel: 'Baca Blog',
      desc: 'Artikel edukatif, analisis celah keamanan (writeups), dan tutorial teknis.',
      icon: <BookOpen className="w-5 h-5 text-zinc-300" />,
      tag: 'Technical Writeups',
    },
  ];

  return (
    <section className="w-full bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <span className="text-xs font-mono font-semibold tracking-widest text-zinc-400 uppercase">
          Pilar Kami
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
          Pilar Komunitas ZCTech
        </h2>
        <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto">
          Wadah belajar, berbagi, dan berjejaring bagi para antusias cybersecurity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((prog, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
            className="group p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-5">
                {prog.icon}
              </div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                {prog.tag}
              </span>
              <h3 className="text-lg font-bold text-zinc-100 mt-1 mb-2">
                {prog.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                {prog.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
              <Link
                href={prog.path}
                target={prog.path.startsWith('http') ? '_blank' : undefined}
                rel={prog.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-xs font-medium text-zinc-300 group-hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{prog.linkLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;
