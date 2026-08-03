'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 w-full flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900">
      {/* Lightweight Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="container relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-mono text-zinc-300">
            ZCTech Community Platform
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-100 leading-[1.1] mb-6">
          Wadah Komunitas <br className="hidden sm:block" />
          <span className="text-zinc-400">Cybersecurity & Tech</span> Indonesia
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
          Komunitas praktisi keamanan siber, *pentester*, dan pengembang teknologi. Berbagi edukasi teknis, workshop interaktif, dan kolaborasi talenta siber Indonesia.
        </p>

        {/* Hero CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            href="https://discord.gg/s67RfATTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group hover:scale-105"
          >
            <span>Gabung Discord Server</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="#portfolio"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Lihat Galeri Kegiatan</span>
          </a>
        </div>

        {/* Minimal Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {[
            { label: 'Member Aktif', val: '500+' },
            { label: 'Event & Meetup', val: '25+' },
            { label: 'Workshop', val: '15+' },
            { label: 'Akses Komunitas', val: 'Gratis' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center"
            >
              <div className="text-xl font-bold text-zinc-100 font-mono">{stat.val}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
