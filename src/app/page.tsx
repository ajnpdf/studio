
import { Navbar } from '@/components/landing/navbar';
import { HeroZone } from '@/components/landing/hero-zone';
import { FormatStrip } from '@/components/landing/format-strip';
import { ToolCategories } from '@/components/landing/tool-categories';
import { LiveDemo } from '@/components/landing/live-demo';
import { TrustSecurity } from '@/components/landing/trust-security';
import { PricingPreview } from '@/components/landing/pricing-preview';
import { SocialProof } from '@/components/landing/social-proof';
import { FaqAccordion } from '@/components/landing/faq-accordion';
import { Footer } from '@/components/landing/footer';

/**
 * AJN Production Landing Page
 * Now the primary and exclusive entry point for the platform.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sufw-gradient overflow-x-hidden">
      <Navbar />
      <main>
        {/* SECTION A - Hero Zone (includes Neural Logo Animation) */}
        <HeroZone />

        {/* SECTION B - Format Support Strip */}
        <FormatStrip />

        {/* SECTION C - Tool Categories Grid */}
        <ToolCategories />

        {/* SECTION D - Live Demo Animation */}
        <LiveDemo />

        {/* SECTION E - Trust and Security Block */}
        <TrustSecurity />

        {/* SECTION F - Pricing Preview */}
        <PricingPreview />

        {/* SECTION G - Social Proof */}
        <SocialProof />

        {/* SECTION H - FAQ Accordion */}
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}
