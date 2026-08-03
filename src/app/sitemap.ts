import { MetadataRoute } from 'next';
import { events, posts, trainingPrograms, competitions, siteConfig } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const routes = ['', '/about', '/events', '/training', '/competitions', '/blog', '/contact'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const eventRoutes = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: new Date(e.eventDate),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const trainingRoutes = trainingPrograms.map((t) => ({
    url: `${base}/training/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const competitionRoutes = competitions.map((c) => ({
    url: `${base}/competitions/${c.slug}`,
    lastModified: new Date(c.deadline),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...eventRoutes, ...trainingRoutes, ...competitionRoutes, ...postRoutes];
}
