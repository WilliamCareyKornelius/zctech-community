'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare, Terminal } from 'lucide-react';

export function CTAFooter() {
  return (
    <>
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative overflow-hidden">
        <div className="relative z-10 p-10 md:p-16 rounded-3xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <MessageSquare className="w-7 h-7" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-2xl">
            Siap Bergabung dengan Ratusan Talent Cybersecurity?
          </h2>

          <p className="text-zinc-400 text-sm md:text-base max-w-lg mb-8 font-normal">
            Diskusi terbuka, bagikan *writeups*, tanya jawab permasalahan teknis, dan ikuti kegiatan seru setiap minggunya di Discord resmi ZCTech.
          </p>

          <a
            href="https://discord.gg/s67RfATTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-9 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs tracking-wide shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Gabung Discord Sekarang</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Cyber Footer */}
      <footer className="border-t border-white/10 bg-zinc-950 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                <Terminal className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ZCTech<span className="text-emerald-400">.</span> Community
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6 font-normal">
              Komunitas independen pengembangan talenta dan keamanan siber Indonesia. Berkolaborasi, berbagi edukasi, dan membangun ekosistem teknologi aman.
            </p>
            <div className="flex gap-4 text-xs font-mono text-zinc-400">
              <a href="https://discord.gg/s67RfATTBk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Discord</a>
              <span>•</span>
              <a href="https://zctech.id" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Business Website</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-4">Navigasi Utama</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Homepage</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Tentang Organisasi</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Agenda Events</Link></li>
              <li><Link href="/training" className="hover:text-white transition-colors">Program Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-4">Resource & Hub</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/blog" className="hover:text-white transition-colors">Tech Blog & Writeups</Link></li>
              <li><Link href="/competitions" className="hover:text-white transition-colors">Competitions Agregator</Link></li>
              <li><a href="https://discord.gg/s67RfATTBk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community Discord</a></li>
              <li><a href="https://zctech.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Layanan Pentest Bisnis</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-zinc-400">
          <p>&copy; {new Date().getFullYear()} ZCTech Community. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-zinc-400">21st.dev Popular Component Suite</p>
        </div>
      </footer>
    </>
  );
}

export default CTAFooter;
