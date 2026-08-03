'use client';

import React from 'react';

export function InfiniteMarquee() {
  const items = [
    'Penetration Testing',
    'Network Security',
    'Web Exploitation',
    'CTF Competitions',
    'Bug Bounty',
    'Cloud Security',
    'Reverse Engineering',
    'Digital Forensics',
    'Linux System Admin',
    'Python & Bash Automation',
    'Ethical Hacking',
  ];

  return (
    <div className="w-full py-6 bg-zinc-950/80 border-y border-white/5 overflow-hidden relative backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-8">
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-zinc-300 font-semibold tracking-wide whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
