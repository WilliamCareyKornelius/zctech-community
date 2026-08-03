'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

export function CTASection() {
  return (
    <>
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-14 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 mb-5 shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-zinc-100 tracking-tight mb-3">
            Gabung dengan Komunitas ZCTech
          </h2>

          <p className="text-zinc-400 text-xs md:text-sm max-w-md mb-8 font-normal leading-relaxed">
            Mari berdiskusi, ikuti event rutin, dan berkolaborasi bersama ratusan talent siber di Indonesia via Discord.
          </p>

          <a
            href="https://discord.gg/s67RfATTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
          >
            <span>Gabung Discord Server</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs font-mono">
                ZC
              </div>
              <span className="text-base font-bold text-zinc-100">
                ZCTech Community
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-4">
              Komunitas independen pengembangan talenta dan keamanan siber Indonesia.
            </p>
            <div className="flex gap-3 text-xs font-mono text-zinc-400">
              <a href="https://discord.gg/s67RfATTBk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
              <span>•</span>
              <a href="https://zctech.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Business Web</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">Sitemap</h4>
            <ul className="flex flex-col gap-2 text-xs text-zinc-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/training" className="hover:text-white transition-colors">Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">Resources</h4>
            <ul className="flex flex-col gap-2 text-xs text-zinc-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Writeups</Link></li>
              <li><Link href="/competitions" className="hover:text-white transition-colors">Competitions</Link></li>
              <li><a href="https://discord.gg/s67RfATTBk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community Discord</a></li>
              <li><a href="https://zctech.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bisnis Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-zinc-400">
          <p>&copy; {new Date().getFullYear()} ZCTech Community. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-zinc-400">21st.dev Popular Component Suite</p>
        </div>
      </footer>
    </>
  );
}

export default CTASection;
