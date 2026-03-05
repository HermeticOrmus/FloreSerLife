import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/HeroSection";
import ArchetypeCardsSection from "@/components/landing/ArchetypeCardsSection";
import WhatAwaitsInside from "@/components/landing/WhatAwaitsInside";
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
} from "lucide-react";

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

      {/* Welcome, Dear One — standalone */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-forest mb-8 tracking-tight">
            Welcome, Dear One
          </h2>
          <div className="text-base text-forest/60 space-y-5 leading-relaxed">
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

      {/* For Seekers / For Facilitators — split section */}
      <section className="py-20 md:py-28 origami-paper origami-overlay-graphite">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* Left — For Seekers */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-4">
                FOR SEEKERS
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-forest mb-6 tracking-tight">
                Meet mAIa
              </h2>
              <p className="text-base text-forest/60 mb-3 leading-relaxed">
                Every soul blooms in its own rhythm.
                <strong className="text-forest/80"> mAIa</strong> is here to sense yours — a gentle intelligence that listens and guides you toward what you most need now.
              </p>
              <p className="text-base text-forest/60 mb-8 leading-relaxed">
                Through a few simple, soulful questions, she helps you find the practices and facilitators that can nurture your next unfolding.
              </p>
              <div className="flex justify-center md:justify-start mb-8">
                <img
                  src={characters.maia}
                  alt="mAIa, your gentle guide"
                  className="w-36 h-36 md:w-48 md:h-48 object-contain"
                  loading="lazy"
                />
              </div>
              <Button
                size="lg"
                onClick={() => setLocation("/quiz")}
                className="text-white bg-forest hover:bg-forest/90 px-8 py-6 text-base font-medium tracking-wide transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Begin your conversation with mAIa
              </Button>
            </div>

            {/* Right — For Facilitators */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-4">
                FOR FACILITATORS
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-forest mb-6 tracking-tight">
                Become a Pollinator
              </h2>
              <p className="text-base text-forest/60 mb-3 leading-relaxed">
                Each Pollinator embodies a nature-inspired archetype — Bee, Hummingbird, Butterfly, or Beetle — offering a distinct way of guiding shaped by presence and lived experience.
              </p>
              <p className="text-base text-forest/60 mb-8 leading-relaxed">
                If you guide with integrity, offer your work with respect,
                and wish to grow within a thoughtful, curated field,
                we invite you to join the Hive.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  if (isAuthenticated) {
                    setLocation(user?.roles?.includes('practitioner') ? "/dashboard/practitioner" : "/become-facilitator");
                  } else {
                    setLocation("/auth/signup");
                  }
                }}
                className="text-white bg-forest hover:bg-forest/90 px-8 py-6 text-base font-medium tracking-wide transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Become a Pollinator
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Fold line */}
      <div className="origami-crease" />

      {/* Archetype Cards */}
      <ArchetypeCardsSection />

      {/* Fold line */}
      <div className="origami-crease" />

      {/* What Awaits Inside */}
      <WhatAwaitsInside />

      {/* Fold line */}
      <div className="origami-crease" />

      {/* What Makes FloreSer Different — clean grid, no hexagons */}
      <section className="py-24 md:py-32 origami-paper origami-overlay-graphite">
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


      <Footer />
    </div>
  );
}
