'use client';

import React from 'react';

export function Marquee() {
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
    'Python & Bash',
    'Ethical Hacking',
  ];

  return (
    <div className="w-full py-5 bg-zinc-950 border-b border-zinc-900 overflow-hidden relative">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-6">
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-zinc-400 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
