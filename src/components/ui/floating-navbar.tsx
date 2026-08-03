'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, Menu, X, ArrowUpRight, Terminal } from 'lucide-react';

export function FloatingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Training', href: '/training' },
    { name: 'Blog', href: '/blog' },
    { name: 'Competitions', href: '/competitions' },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] px-6 py-3 flex items-center justify-between"
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              ZCTech<span className="text-emerald-400">.</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Community</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://discord.gg/dmmMjpN9s"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-full transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.7)] hover:scale-105"
          >
            <span>Join Discord</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-20 left-4 right-4 bg-zinc-950/95 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl md:hidden flex flex-col gap-4 z-50"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-zinc-300 hover:text-emerald-400 transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://discord.gg/dmmMjpN9s"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full text-center py-3 text-sm font-bold text-black bg-emerald-400 rounded-xl"
            >
              Join Discord Community
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default FloatingNavbar;
