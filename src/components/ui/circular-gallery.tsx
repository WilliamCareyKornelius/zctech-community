'use client';

import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CircularGallery() {
  const images = [
    { src: '/kegiatan/img-01.jpg', title: 'Live Bug Bounty Workshop', tag: 'Workshop' },
    { src: '/kegiatan/img-02.jpg', title: 'Community Tech Meetup', tag: 'Meetup' },
    { src: '/kegiatan/img-03.jpg', title: 'Hands-on Pentest Lab', tag: 'Hands-on' },
    { src: '/kegiatan/img-04.jpg', title: 'Malware Analysis Training', tag: 'Training' },
    { src: '/kegiatan/img-05.jpg', title: 'Sharing Session Industri', tag: 'Sharing' },
    { src: '/kegiatan/img-06.jpg', title: 'CTF Competition Mentoring', tag: 'Mentoring' },
    { src: '/kegiatan/img-07.jpg', title: 'Gathering Anggota Komunitas', tag: 'Gathering' },
    { src: '/kegiatan/img-08.jpg', title: 'Persiapan Security Audit', tag: 'Audit' },
    { src: '/kegiatan/img-09.jpg', title: 'Networking & Synergy', tag: 'Network' },
    { src: '/kegiatan/img-10.jpg', title: 'Sesi Tanya Jawab Ekspertis', tag: 'Q&A' },
    { src: '/kegiatan/img-11.jpg', title: 'Foto Bersama Komunitas ZCTech', tag: 'Photo' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsAutoPlaying(false);
    if (info.offset.x < -40) {
      handleNext();
    } else if (info.offset.x > 40) {
      handlePrev();
    }
  };

  return (
    <section id="gallery" className="py-12 px-4 max-w-7xl mx-auto border-b border-zinc-900 overflow-hidden select-none">
      {/* 3D Coverflow Stage */}
      <div 
        className="relative h-[440px] sm:h-[500px] w-full flex items-center justify-center [perspective:1000px] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          {images.map((img, idx) => {
            let distance = idx - activeIndex;
            const halfLength = Math.floor(images.length / 2);

            if (distance > halfLength) {
              distance -= images.length;
            } else if (distance < -halfLength) {
              distance += images.length;
            }

            const absDistance = Math.abs(distance);
            
            // Only render visible cards
            if (absDistance > 3) return null;

            const isCenter = distance === 0;
            const xOffset = distance * 210; 
            const rotateY = distance * -26;  
            const scale = 1 - absDistance * 0.14;
            const opacity = 1 - absDistance * 0.25;
            const zIndex = 20 - absDistance * 3;

            return (
              <motion.div
                key={idx}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(idx);
                }}
                initial={false}
                animate={{
                  x: xOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  z: isCenter ? 140 : -absDistance * 90,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                }}
                className={`absolute w-[240px] sm:w-[320px] h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border bg-zinc-950 shadow-2xl transition-colors duration-300 [transform-style:preserve-3d] ${
                  isCenter
                    ? 'border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/40 z-30'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ zIndex }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="eager"
                  className="w-full h-full object-cover block pointer-events-none"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 inset-x-0 p-5 z-20 pointer-events-none">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
                      {img.tag}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {idx + 1} / {images.length}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-md">
                    {img.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* High Z-Index Navigation Buttons (Fixed Z-[100] to prevent card drag overlap) */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-zinc-900/90 border border-white/20 text-white hover:bg-emerald-500 hover:text-black transition-all shadow-2xl hover:scale-110 z-[100] backdrop-blur-md cursor-pointer active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-zinc-900/90 border border-white/20 text-white hover:bg-emerald-500 hover:text-black transition-all shadow-2xl hover:scale-110 z-[100] backdrop-blur-md cursor-pointer active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIndex(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? 'w-8 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                : 'w-2 bg-zinc-800 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
