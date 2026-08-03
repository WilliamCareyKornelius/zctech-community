'use client';

import React from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

export function MediaGallery() {
  const photos = [
    { src: '/kegiatan/img-01.jpg', title: 'Workshop Bug Bounty Live', tag: 'Workshop', col: 'md:col-span-1' },
    { src: '/kegiatan/img-02.jpg', title: 'Sesi Diskusi Keamanan Siber', tag: 'Discussion', col: 'md:col-span-1' },
    { src: '/kegiatan/img-03.jpg', title: 'Hands-on Pentest Lab', tag: 'Hands-on Lab', col: 'md:col-span-1' },
    { src: '/kegiatan/img-04.jpg', title: 'Pelatihan Malware Analysis', tag: 'Training', col: 'md:col-span-2' },
    { src: '/kegiatan/img-05.jpg', title: 'Sharing Session Industri', tag: 'Sharing', col: 'md:col-span-1' },
    { src: '/kegiatan/img-06.jpg', title: 'CTF Competition Mentoring', tag: 'CTF Contest', col: 'md:col-span-1' },
    { src: '/kegiatan/img-07.jpg', title: 'Gathering Anggota Komunitas', tag: 'Meetup', col: 'md:col-span-2' },
    { src: '/kegiatan/img-08.jpg', title: 'Persiapan Security Audit', tag: 'Audit Lab', col: 'md:col-span-1' },
    { src: '/kegiatan/img-09.jpg', title: 'Networking & Synergy', tag: 'Networking', col: 'md:col-span-1' },
    { src: '/kegiatan/img-10.jpg', title: 'Sesi Tanya Jawab Ekspertis', tag: 'Q&A Session', col: 'md:col-span-1' },
    { src: '/kegiatan/img-11.jpg', title: 'Foto Bersama Komunitas ZCTech', tag: 'Community Photo', col: 'md:col-span-3' },
  ];

  return (
    <section id="portfolio" className="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-900">
      <div className="text-center mb-14">
        <span className="px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 w-max mx-auto">
          <ImageIcon className="w-3.5 h-3.5" /> Media & Dokumentasi Lengkap
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-4 mb-3">
          Galeri Kegiatan & Rekaman Video
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
          Seluruh 11 foto dokumentasi dan video rekaman kegiatan ZCTech Community.
        </p>
      </div>

      {/* 1. Video Theater Highlight */}
      <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl relative">
        <video
          controls
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          className="w-full h-[400px] md:h-[500px] object-cover block"
        >
          <source src="/kegiatan/activity.mp4" type="video/mp4" />
          Browser Anda tidak mendukung pemutar video HTML5.
        </video>
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-zinc-950/90 border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-lg">
            <Film className="w-3.5 h-3.5" /> Video Dokumentasi Utama
          </span>
        </div>
      </div>

      {/* 2. Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {photos.map((item, idx) => (
          <div
            key={idx}
            className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 h-[300px] shadow-xl ${item.col}`}
          >
            {/* Image - 100% Opacity Instant Visible */}
            <img
              src={item.src}
              alt={item.title}
              loading="eager"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-100 block"
            />

            {/* Tag Badge */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-zinc-950/90 border border-white/10 text-[10px] font-mono text-emerald-300 shadow-md">
                {item.tag}
              </span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 z-20 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none">
              <h3 className="text-base font-bold text-white">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
