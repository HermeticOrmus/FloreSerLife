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
import { Button } from "@/components/ui/button";
import { papercut, characters } from "@/assets";
import {
  Sprout,
  Users,
  Sparkles,
  Heart,
  Calendar,
  Shield,
  Bot,
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

  const handleBeginWithMaia = () => {
    setLocation("/quiz");
  };

  return (
    <div className="min-h-screen bg-papercut-neutral-light text-papercut-neutral-dark overflow-hidden">
      <Header />

      {/* Paper-cut Hero Section */}
      <HeroSection />

      {/* Meet mAIa - Begin Your Journey CTA */}
      <section
        className="py-16 relative"
        style={{
          backgroundImage: `url(${papercut.textures.paperUI})`,
          backgroundSize: '256px 256px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* mAIa Character */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={characters.maia}
                  alt="mAIa, your gentle guide"
                  className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-papercut-leaf-sage rounded-full animate-pulse" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1.5 bg-papercut-leaf-sage/20 text-papercut-leaf-deep rounded-full text-sm font-medium mb-4">
                <Bot className="w-4 h-4 mr-2" />
                Meet Your Guide
              </div>

              <h2 className="font-heading text-2xl md:text-3xl text-papercut-neutral-dark mb-3">
                mAIa is here to help you find your way
              </h2>

              <p className="text-body text-papercut-neutral-dark/70 mb-6 max-w-xl">
                A gentle, nature-wise guide who helps you discover your unique path to wellness.
                Through a short, thoughtful journey, mAIa will help match you with practitioners
                who truly resonate with your needs.
              </p>

              <Button
                size="lg"
                onClick={handleBeginWithMaia}
                className="text-white hover:opacity-90 rounded-full px-8 py-6 shadow-lg transform hover:scale-105 transition-all text-lg font-medium"
                style={{
                  backgroundImage: `url(${papercut.textures.paperSage})`,
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Begin with mAIa
              </Button>
            </div>
          </div>
        </div>
      </section>

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
