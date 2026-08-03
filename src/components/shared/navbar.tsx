'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { siteConfig } from '@/lib/content';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/training', label: 'Pelatihan' },
  { href: '/competitions', label: 'Lomba' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Kontak' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Shield className="h-6 w-6 text-emerald-400" />
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium text-zinc-300 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  'transition-colors hover:text-white',
                  pathname === link.href ? 'text-white' : 'text-zinc-400'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={siteConfig.discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-emerald-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-emerald-300 sm:inline-flex"
          >
            Gabung Discord
          </a>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-b border-white/10 bg-black/95 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-2 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'block py-2 transition-colors hover:text-white',
                    pathname === link.href ? 'text-white' : 'text-zinc-400'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full bg-emerald-400 py-2 text-center text-xs font-bold text-black"
              >
                Gabung Discord
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
