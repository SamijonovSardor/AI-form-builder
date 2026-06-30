import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/landing/hero";
import { TechMarquee } from "@/components/landing/metrics";
import { Showcase } from "@/components/landing/showcase";
import { CodeSection } from "@/components/landing/code-section";
import { BentoFeatures } from "@/components/landing/bento-features";
import { Stats, FinalCTA } from "@/components/landing/metrics";
import { Testimonial } from "@/components/landing/testimonial";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TechMarquee />
        <Showcase />
        <CodeSection />
        <BentoFeatures />
        <Stats />
        <Testimonial />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
