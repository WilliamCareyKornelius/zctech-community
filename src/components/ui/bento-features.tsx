'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, GraduationCap, Trophy, BookOpen, ArrowRight, ShieldCheck, Terminal, Users, Cpu } from 'lucide-react';

export function BentoFeatures() {
  const features = [
    {
      title: 'Events & Meetups',
      path: '/events',
      desc: 'Gathering rutin, webinar interaktif, dan sesi komunal praktisi siber.',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      tag: 'Regular Events',
      col: 'md:col-span-2',
    },
    {
      title: 'Training & Labs',
      path: '/training',
      desc: 'Pelatihan hands-on ethical hacking & pentesting.',
      icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
      tag: 'Hands-on Labs',
      col: 'md:col-span-1',
    },
    {
      title: 'Competitions Aggregator',
      path: '/competitions',
      desc: 'Informasi terupdate kompetisi CTF & Bug Bounty.',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      tag: 'CTF & Contests',
      col: 'md:col-span-1',
    },
    {
      title: 'Tech Blog & Writeups',
      path: '/blog',
      desc: 'Artikel edukatif, analisis celah keamanan, dan writeups teknis.',
      icon: <BookOpen className="w-5 h-5 text-teal-400" />,
      tag: 'Technical Writeups',
      col: 'md:col-span-2',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-b border-border">
      <div className="text-center mb-14">
        <span className="px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
          Organization Pillars
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-3">
          Ekosistem Kegiatan Organisasi
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto">
          Fokus utama ZCTech Community dalam mengedukasi dan menghubungkan para praktisi teknologi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <div
            key={i}
            className={`group p-8 rounded-3xl bg-muted border border-border hover:border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${feat.col}`}
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                {feat.tag}
              </span>
              <h3 className="text-xl font-bold text-foreground mt-1 mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
              <Link
                href={feat.path}
                className="text-xs font-semibold text-muted-foreground group-hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Jelajahi Program</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BentoFeatures;
