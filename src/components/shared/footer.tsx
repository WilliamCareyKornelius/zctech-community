import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/content';

const footerLinks = [
  { href: '/about', label: 'Tentang' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Kontak' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt={siteConfig.name} className="h-12 w-auto object-contain" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground">Navigasi</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground">Terhubung</h4>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {Object.entries(siteConfig.socials).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
