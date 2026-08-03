import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { FloatingDockNavbar } from '@/components/ui/floating-dock-navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZCTech Community | Tech & Cybersecurity Ecosystem',
  description: 'Official community hub for cybersecurity practitioners and tech developers in Indonesia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={clsx(inter.className, 'min-h-screen bg-black text-slate-100 antialiased selection:bg-emerald-500 selection:text-black overflow-x-hidden')}>
        <FloatingDockNavbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
