'use client';

import ScrollLoopInception from '@/components/ui/scroll-loop-inception';
import PixelFireButton from '@/components/ui/pixel-fire-button';
import Testimonial1, { testimonial1Demo } from '@/components/ui/testimonial1';
import Pricing01 from '@/components/ui/pricing-01';
import LogoCloud05 from '@/components/ui/logo-cloud-05';
import DevToolLandingPage from '@/components/ui/dev-tool-landing-page';
import FeaturesGrid from '@/components/ui/features-grid';
import Pricing from '@/components/ui/pricing';
import FeatureBento from '@/components/ui/feature-bento';
import Waves from '@/components/ui/waves';
import ImageExpansion from '@/components/ui/image-expansion';
import HeroComponent from '@/components/ui/hero-component';
import GlowHorizon from '@/components/ui/glow-horizon';
import HeroScrub from '@/components/ui/hero-scrub';
import GlassVideoHero from '@/components/ui/glass-video-hero';
import MotionFooter from '@/components/ui/motion-footer';
import CursorDrivenParticlesTypography from '@/components/ui/cursor-driven-particles-typography';
import FlowFieldBackground from '@/components/ui/flow-field-background';
import GlassmorphismTrustHero from '@/components/ui/glassmorphism-trust-hero';
import BoltStyleChat from '@/components/ui/bolt-style-chat';
import FeatureSpotlight from '@/components/ui/feature-spotlight';
import ReadingTextReveal from '@/components/ui/reading-text-reveal';
import FeaturesSection from '@/components/ui/features-section';
import CallToAction from '@/components/ui/call-to-action';
import MagneticCursor from '@/components/ui/magnetic-cursor';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      <section id="scroll-loop-inception" className="w-full">
        <ScrollLoopInception />
      </section>

      <section id="pixel-fire-button" className="w-full">
        <PixelFireButton>Get Started</PixelFireButton>
      </section>

      <section id="testimonial1" className="w-full">
        <Testimonial1 {...testimonial1Demo} />
      </section>

      <section id="pricing-01" className="w-full">
        <Pricing01 />
      </section>

      <section id="logo-cloud-05" className="w-full">
        <LogoCloud05 />
      </section>

      <section id="dev-tool-landing-page" className="w-full">
        <DevToolLandingPage />
      </section>

      <section id="features-grid" className="w-full">
        <FeaturesGrid />
      </section>

      <section id="pricing" className="w-full">
        <Pricing />
      </section>

      <section id="feature-bento" className="w-full">
        <FeatureBento />
      </section>

      <section id="waves" className="w-full">
        <Waves />
      </section>

      <section id="image-expansion" className="w-full">
        <ImageExpansion />
      </section>

      <section id="hero-component" className="w-full">
        <HeroComponent />
      </section>

      <section id="glow-horizon" className="w-full">
        <GlowHorizon />
      </section>

      <section id="hero-scrub" className="w-full">
        <HeroScrub frameCount={1} frameUrl={() => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'} titleTop="Build" titleBottom="Community" />
      </section>

      <section id="glass-video-hero" className="w-full">
        <GlassVideoHero />
      </section>

      <section id="motion-footer" className="w-full">
        <MotionFooter />
      </section>

      <section id="cursor-driven-particles-typography" className="w-full">
        <CursorDrivenParticlesTypography text="ZCTech Community" />
      </section>

      <section id="flow-field-background" className="w-full">
        <FlowFieldBackground />
      </section>

      <section id="glassmorphism-trust-hero" className="w-full">
        <GlassmorphismTrustHero />
      </section>

      <section id="bolt-style-chat" className="w-full">
        <BoltStyleChat />
      </section>

      <section id="feature-spotlight" className="w-full">
        <FeatureSpotlight />
      </section>

      <section id="reading-text-reveal" className="w-full">
        <ReadingTextReveal />
      </section>

      <section id="features-section" className="w-full">
        <FeaturesSection data={{ title: 'Why join us', subtitle: 'Perks and features for members', features: [{ id: 1, iconName: 'bolt', title: 'Hands-on labs', description: 'Practice in real environments' }, { id: 2, iconName: 'shield', title: 'Security first', description: 'Learn offensive and defensive security' }, { id: 3, iconName: 'layout', title: 'Community events', description: 'Meetups, workshops, and hackathons' }] }} />
      </section>

      <section id="call-to-action" className="w-full">
        <CallToAction title="Ready to join?" subtitle="Start your journey with ZCTech Community" primaryButtonText="Get Started" primaryButtonLink="#hero" secondaryButtonText="Learn More" secondaryButtonLink="#features" />
      </section>

      <section id="magnetic-cursor" className="w-full">
        <MagneticCursor><div className="flex h-64 w-full items-center justify-center">Magnetic cursor effect</div></MagneticCursor>
      </section>
    </div>
  );
}
