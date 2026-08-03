'use client';

import HeroParallax from '@/components/ui/hero-parallax';
import { StatsBar } from '@/components/sections/stats-bar';
import { CommunityGallery } from '@/components/sections/community-gallery';
import { UpcomingEvents } from '@/components/sections/upcoming-events';
import { LatestBlog } from '@/components/sections/latest-blog';
import { DiscordCTA } from '@/components/sections/discord-cta';
import { JsonLd } from '@/components/shared/json-ld';
import { siteConfig } from '@/lib/content';

export default function Home() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          sameAs: Object.values(siteConfig.socials),
        }}
      />
      <HeroParallax />
      <StatsBar />
      <CommunityGallery />
      <UpcomingEvents />
      <LatestBlog />
      <DiscordCTA />
    </>
  );
}
