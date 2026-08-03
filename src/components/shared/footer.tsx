import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/content';

const footerLinks = [
  { href: '/about', label: 'Tentang' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/training', label: 'Pelatihan' },
  { href: '/competitions', label: 'Lomba' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Kontak' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <Shield className="h-6 w-6 text-emerald-400" />
            {siteConfig.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm text-zinc-400">{siteConfig.description}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Navigasi</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-400">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Terhubung</h4>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
              Discord <ExternalLink className="h-3 w-3" />
            </a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
              Instagram <ExternalLink className="h-3 w-3" />
            </a>
            <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
              X/Twitter <ExternalLink className="h-3 w-3" />
            </a>
            <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
            <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
