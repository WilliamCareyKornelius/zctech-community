'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Activity, Terminal } from 'lucide-react';

export function HeroSpotlight() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* 21st.dev Spotlight & Grid Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.2),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300 uppercase">
            Official ZCTech Community Platform
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 max-w-4xl">
          Komunitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Cybersecurity</span> & Talent Tech Indonesia
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
          Wadah terbuka untuk antusias keamanan siber, *pentester*, dan pengembang teknologi. Berbagi edukasi teknis, workshop interaktif, dan kolaborasi talenta siber Indonesia.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="https://discord.gg/s67RfATTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs tracking-wide transition-all shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <span>Gabung Discord Server</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Lihat Galeri Kegiatan</span>
          </a>
        </div>

        {/* Minimal Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { label: 'Member Aktif', val: '500+' },
            { label: 'Event & Meetup', val: '25+' },
            { label: 'Workshop & Mentoring', val: '15+' },
            { label: 'Akses Komunitas', val: '100% Gratis' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">{stat.val}</span>
              <span className="text-xs text-zinc-400 mt-1 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
