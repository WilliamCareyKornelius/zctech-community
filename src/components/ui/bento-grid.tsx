'use client';

import React from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

export function BentoGrid() {
  const mediaItems = [
    { type: 'video', src: '/kegiatan/activity.mp4', title: 'Video Dokumentasi Sesi Mentoring & Gathering', tag: 'Featured Video', col: 'md:col-span-3' },
    { type: 'image', src: '/kegiatan/img-01.jpg', title: 'Workshop Bug Bounty Live', tag: 'Workshop', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-02.jpg', title: 'Sesi Diskusi Keamanan Siber', tag: 'Discussion', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-03.jpg', title: 'Hands-on Pentest Lab', tag: 'Hands-on Lab', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-04.jpg', title: 'Pelatihan Malware Analysis', tag: 'Training', col: 'md:col-span-2' },
    { type: 'image', src: '/kegiatan/img-05.jpg', title: 'Sharing Session Industri', tag: 'Sharing', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-06.jpg', title: 'CTF Competition Mentoring', tag: 'CTF Contest', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-07.jpg', title: 'Gathering Anggota Komunitas', tag: 'Meetup', col: 'md:col-span-2' },
    { type: 'image', src: '/kegiatan/img-08.jpg', title: 'Persiapan Security Audit', tag: 'Audit Lab', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-09.jpg', title: 'Networking & Synergy', tag: 'Networking', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-10.jpg', title: 'Sesi Tanya Jawab Ekspertis', tag: 'Q&A Session', col: 'md:col-span-1' },
    { type: 'image', src: '/kegiatan/img-11.jpg', title: 'Foto Bersama Komunitas ZCTech', tag: 'Community Photo', col: 'md:col-span-3' },
  ];

  return (
    <section id="portfolio" className="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-900">
      <div className="text-center mb-14">
        <span className="text-xs font-mono font-semibold tracking-widest text-zinc-400 uppercase flex items-center justify-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-zinc-400" /> Media & Dokumentasi Lengkap
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100 mt-2 mb-3">
          Galeri Kegiatan & Video Dokumentasi
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto">
          Seluruh 11 foto dokumentasi dan video rekaman aktivitas anggota ZCTech Community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mediaItems.map((item, idx) => {
          if (item.type === 'video') {
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl overflow-hidden border border-zinc-800 bg-black min-h-[380px] ${item.col}`}
              >
                <video
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  preload="auto"
                  className="w-full h-full object-cover min-h-[380px] block"
                >
                  <source src={item.src} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video HTML5.
                </video>

                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="px-3 py-1 rounded-md bg-zinc-950/90 border border-zinc-800 text-xs font-mono text-zinc-100 flex items-center gap-1.5 shadow-md">
                    <Film className="w-3.5 h-3.5 text-zinc-300" /> {item.tag}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 h-[280px] ${item.col}`}
            >
              {/* Image element - 100% visible immediately */}
              <img
                src={item.src}
                alt={item.title}
                loading="eager"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-100 block"
              />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-zinc-950/90 border border-zinc-800 text-[10px] font-mono text-zinc-200 shadow-sm">
                  {item.tag}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 z-20 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent pointer-events-none">
                <h3 className="text-sm font-bold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BentoGrid;
