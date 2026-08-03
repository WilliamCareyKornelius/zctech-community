import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { siteConfig } from '@/lib/content';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={clsx(
          inter.className,
          'min-h-screen bg-white text-zinc-900 antialiased selection:bg-emerald-500 selection:text-white dark:bg-black dark:text-slate-100 overflow-x-hidden'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
