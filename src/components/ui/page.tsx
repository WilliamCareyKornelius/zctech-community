'use client';

import React from 'react';
import { HeroSpotlight } from '@/components/ui/hero-spotlight';
import { MarqueeTicker } from '@/components/ui/marquee-ticker';
import { BentoFeatures } from '@/components/ui/bento-features';
import { MediaGallery } from '@/components/ui/media-gallery';
import { FAQSection } from '@/components/ui/faq-section';
import { CTAFooter } from '@/components/ui/cta-footer';

export default function Home() {
  return (
    <div className="w-full bg-black min-h-screen">
      <HeroSpotlight />
      <MarqueeTicker />
      <BentoFeatures />
      <MediaGallery />
      <FAQSection />
      <CTAFooter />
    </div>
  );
}
