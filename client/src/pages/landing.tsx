import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { PaperCutBanner } from "@/components/landing/PaperCutBanner";
import { HexagonGrid } from "@/components/landing/HexagonGrid";
import ForFacilitatorsCTA from "@/components/landing/ForFacilitatorsCTA";
import FeaturedPractitioners from "@/components/featured-practitioners";
import { papercut } from "@/assets";
import {
  Sprout,
  Users,
  Sparkles,
  Heart,
  Calendar,
  Shield,
} from "lucide-react";

// Hexagon grid items for "What Makes FloreSer Different"
const hexItems = [
  {
    id: 'growth',
    icon: Sprout,
    title: 'Growth-Focused',
    description: 'Your journey is unique, honored at every stage',
    color: 'deep-sage' as const,
  },
  {
    id: 'community',
    icon: Users,
    title: 'Community',
    description: 'Connect with seekers and guides alike',
    color: 'olive-resin' as const,
  },
  {
    id: 'wisdom',
    icon: Sparkles,
    title: 'Nature Wisdom',
    description: 'Four archetypes guide your perfect match',
    color: 'dew-gold' as const,
  },
  {
    id: 'care',
    icon: Heart,
    title: 'Genuine Care',
    description: 'Facilitators vetted for authenticity',
    color: 'forest-earth' as const,
  },
  {
    id: 'flexibility',
    icon: Calendar,
    title: 'Your Rhythm',
    description: 'Book sessions that fit your life',
    color: 'claystone' as const,
  },
  {
    id: 'trust',
    icon: Shield,
    title: 'Safe Space',
    description: 'Privacy and trust at the foundation',
    color: 'tudor-red' as const,
  },
];

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "FloreSer.Life — Nature-Inspired Guidance for Your Becoming";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover FloreSer.Life, a nature-inspired wellness ecosystem connecting seekers with trusted holistic facilitators. Find your perfect match with our Pollinator archetypes and begin your next season of growth."
      );
    }
  }, []);

  const handleJoinAlphaProgram = () => {
    setLocation("/alpha");
  };

  return (
    <div className="min-h-screen bg-papercut-neutral-light text-papercut-neutral-dark overflow-hidden">
      <Header />

      {/* Paper-cut Hero Section */}
      <HeroSection />

      {/* What Makes FloreSer Different - Hexagon Grid */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: `url(${papercut.textures.paperSage})`,
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-section-heading text-papercut-neutral-dark mb-4">
              What Makes FloreSer Different
            </h2>
            <p className="text-body-lg text-papercut-neutral-dark/70 max-w-2xl mx-auto">
              A living ecosystem where healing becomes flourishing
            </p>
          </div>
          <HexagonGrid items={hexItems} />
        </div>
      </section>

      {/* Featured Practitioners */}
      <PaperCutBanner variant="plain-forest">
        <FeaturedPractitioners />
      </PaperCutBanner>

      {/* For Facilitators CTA */}
      <PaperCutBanner variant="patterned-leaf">
        <ForFacilitatorsCTA />
      </PaperCutBanner>

      {/* Alpha Program Link */}
      <section
        className="py-12 text-center"
        style={{
          backgroundImage: `url(${papercut.textures.paperUI})`,
          backgroundSize: '256px 256px',
          backgroundRepeat: 'repeat',
        }}
      >
        <p className="text-caption text-papercut-neutral-dark/60">
          Interested in contributing to our development?{" "}
          <button
            onClick={handleJoinAlphaProgram}
            className="text-papercut-accent-crimson hover:text-papercut-accent-deep underline transition-colors"
          >
            Join our Alpha Program
          </button>
        </p>
      </section>

      <Footer />
    </div>
  );
}
