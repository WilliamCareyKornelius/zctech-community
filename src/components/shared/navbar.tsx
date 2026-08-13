'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { siteConfig } from '@/lib/content';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Kontak' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-icon.png" alt={siteConfig.name} className="h-11 w-auto object-contain" />
          <span className="hidden text-lg font-bold text-foreground sm:inline">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  'transition-colors hover:text-foreground',
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
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
            className="hidden rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 sm:inline-flex dark:bg-emerald-400 dark:text-black dark:hover:bg-emerald-300"
          >
            Gabung Discord
          </a>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-b border-border bg-background/95 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-2 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'block py-2 transition-colors hover:text-foreground',
                    pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
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
              className="block w-full rounded-full bg-emerald-500 py-2 text-center text-xs font-bold text-white dark:bg-emerald-400 dark:text-black"
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
