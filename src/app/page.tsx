'use client';

import React from 'react';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { CircularGallery } from '@/components/ui/circular-gallery';
import { MarqueeTicker } from '@/components/ui/marquee-ticker';
import { BentoFeatures } from '@/components/ui/bento-features';
import { MediaGallery } from '@/components/ui/media-gallery';
import { FAQSection } from '@/components/ui/faq-section';
import { CTAFooter } from '@/components/ui/cta-footer';

export default function Home() {
  return (
    <div className="w-full bg-black min-h-screen">
      {/* 1. Hero Parallax 3D Showcase */}
      <section id="hero">
        <HeroParallax />
      </section>

      {/* 2. Infinite Tech Marquee Ticker */}
      <MarqueeTicker />

      {/* 3. 3D Circular Gallery Showcase */}
      <section id="gallery">
        <CircularGallery />
      </section>

      {/* 4. Organization Pillars Bento Grid */}
      <section id="features">
        <BentoFeatures />
      </section>

      {/* 5. Complete Media Gallery & Video Theater */}
      <section id="media">
        <MediaGallery />
      </section>

      {/* 6. FAQ Accordion */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* 7. CTA & Cyberpunk Footer */}
      <CTAFooter />
    </div>
  );
}
