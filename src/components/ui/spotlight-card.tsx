'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, GraduationCap, Trophy, BookOpen, ArrowRight } from 'lucide-react';

export function ProgramSpotlights() {
  const programs = [
    {
      title: 'Events & Meetups',
      path: '/events',
      desc: 'Gathering rutin, webinar, dan sesi komunal untuk berdiskusi tren cybersecurity terkini.',
      icon: <Calendar className="w-6 h-6 text-emerald-400" />,
      tag: 'Regular Events',
    },
    {
      title: 'Training & Workshops',
      path: '/training',
      desc: 'Program latihan praktis intensif dari level pemula hingga tingkat lanjut (Ethical Hacking).',
      icon: <GraduationCap className="w-6 h-6 text-teal-400" />,
      tag: 'Hands-on Learning',
    },
    {
      title: 'Competitions Aggregator',
      path: '/competitions',
      desc: 'Informasi terupdate seputar kompetisi CTF, Bug Bounty, dan perlombaan IT di Indonesia.',
      icon: <Trophy className="w-6 h-6 text-cyan-400" />,
      tag: 'CTF & Contests',
    },
    {
      title: 'Tech Blog & Insights',
      path: '/blog',
      desc: 'Artikel edukatif, analisis celah keamanan (writeups), dan tutorial teknis dari member.',
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      tag: 'Articles & Writeups',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
          Program Pillars
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-4 mb-4">
          Ekosistem Organisasi
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Fokus kegiatan utama ZCTech Community dalam mengedukasi dan menghubungkan para praktisi teknologi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {programs.map((prog, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-emerald-500/50 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all">
                {prog.icon}
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                {prog.tag}
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3 group-hover:text-emerald-300 transition-colors">
                {prog.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                {prog.desc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <Link
                href={prog.path}
                className="text-xs font-semibold text-zinc-300 group-hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Jelajahi Program</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ProgramSpotlights;
