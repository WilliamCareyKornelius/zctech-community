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
      icon: <Calendar className="w-5 h-5 text-muted-foreground" />,
      tag: 'Regular Agenda',
    },
    {
      title: 'Community & Networking',
      path: 'https://discord.gg/s67RfATTBk',
      linkLabel: 'Gabung Discord',
      desc: 'Ruang diskusi, tanya jawab, dan berjejaring bersama anggota ZCTech.',
      icon: <Users className="w-5 h-5 text-muted-foreground" />,
      tag: 'Komunitas',
    },
    {
      title: 'Tech Blog & Insights',
      path: 'https://zctech.id/writeups',
      linkLabel: 'Baca Writeup',
      desc: 'Artikel edukatif, analisis celah keamanan (writeups), dan tutorial teknis.',
      icon: <BookOpen className="w-5 h-5 text-muted-foreground" />,
      tag: 'Technical Writeups',
    },
  ];

  return (
    <section className="w-full bg-muted py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
          Pilar Kami
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mt-2 mb-3">
          Pilar Komunitas ZCTech
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto">
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
            className="group p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center mb-5">
                {prog.icon}
              </div>
              <span className="text-[10px] font-mono font-semibold tracking-wider text-muted-foreground uppercase">
                {prog.tag}
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
                {prog.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                {prog.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <Link
                href={prog.path}
                target={prog.path.startsWith('http') ? '_blank' : undefined}
                rel={prog.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-xs font-medium text-muted-foreground group-hover:text-foreground flex items-center gap-1 transition-colors"
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
