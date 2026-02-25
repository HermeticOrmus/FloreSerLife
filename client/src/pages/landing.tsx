import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/HeroSection";
import ForFacilitatorsCTA from "@/components/landing/ForFacilitatorsCTA";
import FeaturedPractitioners from "@/components/featured-practitioners";
import { Button } from "@/components/ui/button";
import { characters } from "@/assets";
import {
  Sprout,
  Users,
  Sparkles,
  Heart,
  Calendar,
  Shield,
  Bot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Values for the minimal grid
const values = [
  {
    icon: Sprout,
    title: 'Growth-Focused',
    description: 'Your journey is honoured at every stage.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with guides and seekers.',
  },
  {
    icon: Sparkles,
    title: 'Nature Wisdom',
    description: 'Four archetypes guide your match.',
  },
  {
    icon: Heart,
    title: 'Genuine Care',
    description: 'Facilitators vetted for integrity.',
  },
  {
    icon: Calendar,
    title: 'Your Rhythm',
    description: 'Sessions that fit your life.',
  },
  {
    icon: Shield,
    title: 'Safe Space',
    description: 'Privacy and trust, always.',
  },
];

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "FloreSer.Life — Welcome";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover FloreSer.Life, a nature-inspired wellness ecosystem connecting seekers with trusted holistic facilitators."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-forest origami-paper">
      <Header />

      <HeroSection />

      {/* Welcome — generous space, clean type */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-forest mb-8 tracking-tight">
            Welcome, Dear One
          </h2>
          <div className="text-base md:text-lg text-forest/60 space-y-6 leading-relaxed">
            <p>This is the garden of your becoming.</p>
            <p>
              At <span className="text-forest">FloreSer.Life</span>, we see you as a seed,
              carrying your own rhythm of becoming.
            </p>
            <p>
              We are a living ecosystem — not a directory —
              where soulful guides offer presence, wisdom, and practice
              to help you tend your inner garden.
            </p>
            <p>
              Whether you're just beginning or already deepening,
              you're welcome here.
            </p>
          </div>
        </div>
      </section>

      {/* Fold line */}
      <div className="origami-crease" />

      {/* Meet mAIa — clean layout */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-shrink-0">
              <img
                src={characters.maia}
                alt="mAIa, your gentle guide"
                className="w-28 h-28 md:w-36 md:h-36 object-contain"
                loading="lazy"
                width={144}
                height={144}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-4">
                Your Living Guide
              </p>

              <h2 className="font-heading text-2xl md:text-3xl text-forest mb-4 tracking-tight">
                Meet mAIa
              </h2>

              <p className="text-base text-forest/60 mb-3 leading-relaxed">
                Every soul blooms in its own rhythm.
                <strong className="text-forest/80"> mAIa</strong> is here to sense yours — a gentle intelligence that listens and guides you toward what you most need now.
              </p>
              <p className="text-base text-forest/60 mb-8 leading-relaxed">
                Through a few simple, soulful questions, she helps you find the practices and facilitators that can nurture your next unfolding.
              </p>

              <Button
                size="lg"
                onClick={() => setLocation("/quiz")}
                className="text-white bg-forest hover:bg-forest/90 px-8 py-6 text-base font-medium tracking-wide transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Begin your conversation with mAIa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fold line */}
      <div className="origami-crease" />

      {/* What Makes FloreSer Different — clean grid, no hexagons */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-heading text-2xl md:text-3xl text-forest mb-4 tracking-tight">
              What Makes FloreSer Different
            </h2>
            <p className="text-base text-forest/50">
              A living ecosystem where healing becomes flourishing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((item) => (
              <div key={item.title} className="text-center p-8 border border-forest/8 rounded-lg origami-paper origami-corner origami-fold-shadow">
                <item.icon className="w-8 h-8 text-forest/30 mx-auto mb-5" strokeWidth={1.5} />
                <h3 className="font-heading text-lg text-forest mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-forest/50 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold line */}
      <div className="origami-crease" />

      {/* Featured Practitioners */}
      <FeaturedPractitioners />

      {/* Fold line */}
      <div className="origami-crease" />

      {/* For Facilitators CTA */}
      <ForFacilitatorsCTA />

      {/* Alpha Program Link */}
      <section className="py-16 text-center">
        <p className="text-sm text-forest/40">
          Interested in contributing to our development?{" "}
          <button
            onClick={() => setLocation("/alpha")}
            className="text-forest/60 hover:text-forest underline underline-offset-4 transition-colors"
          >
            Join our Alpha Program
          </button>
        </p>
      </section>

      <Footer />
    </div>
  );
}
