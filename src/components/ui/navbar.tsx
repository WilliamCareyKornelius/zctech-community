'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

export function Navbar() {
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
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md px-6 py-2.5 flex items-center justify-between shadow-xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold font-mono text-sm transition-transform group-hover:scale-105 shadow-sm">
            ZC
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">
              ZCTech Community
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950/70 px-3 py-1 rounded-full border border-zinc-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 rounded-full transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://discord.gg/s67RfATTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white rounded-full transition-all shadow-sm hover:scale-105"
          >
            <span>Join Discord</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-16 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl md:hidden flex flex-col gap-3 z-50"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://discord.gg/s67RfATTBk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full text-center py-2.5 text-xs font-bold text-zinc-950 bg-zinc-100 rounded-xl"
            >
              Join Discord Community
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
