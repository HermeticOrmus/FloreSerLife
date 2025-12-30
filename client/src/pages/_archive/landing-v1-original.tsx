import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatAwaitsInside from "@/components/landing/WhatAwaitsInside";
import ArchetypeCardsSection from "@/components/landing/ArchetypeCardsSection";
import SeasonsOfPractice from "@/components/landing/SeasonsOfPractice";
import MaiaSection from "@/components/landing/MaiaSection";
import ForFacilitatorsCTA from "@/components/landing/ForFacilitatorsCTA";
import FeaturedPractitioners from "@/components/featured-practitioners";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Shield, Star, Calendar, Sparkles } from "lucide-react";
import { characters } from "@/assets";

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

  const handleFindYourMatch = () => {
    setLocation(isAuthenticated ? "/practitioners" : "/auth/signup");
  };

  const handleJoinAsPractitioner = () => {
    if (isAuthenticated) {
      // If already a practitioner, go to dashboard; otherwise go to onboarding
      setLocation(user?.roles?.includes('practitioner') ? "/dashboard/practitioner" : "/become-facilitator");
    } else {
      setLocation("/auth/signup");
    }
  };

  const handleJoinAlphaProgram = () => {
    setLocation("/alpha");
  };

  return (
    <div className="min-h-screen bg-cream text-forest overflow-hidden">
      <Header />

      {/* Hero Section - Unique organic design */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated organic background shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-light-green/10 to-gold/5" />

        {/* Floating organic blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-garden-accent/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-hive-accent/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-gold/5 to-light-green/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Decorative vine pattern - left side */}
        <div className="absolute left-0 top-0 w-32 h-full opacity-10">
          <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M50,0 Q30,100 50,200 T50,400 T50,600 T50,800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-forest animate-vine-grow"
            />
            <circle cx="50" cy="150" r="8" className="text-gold fill-current animate-bloom" style={{ animationDelay: '0.5s' }} />
            <circle cx="50" cy="350" r="6" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '1s' }} />
            <circle cx="50" cy="550" r="10" className="text-hive-accent fill-current animate-bloom" style={{ animationDelay: '1.5s' }} />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-petal-fade">
              {/* Trust Badge - Custom organic shape */}
              <Badge variant="bee" className="mb-6 animate-honey-drip">
                <UserCheck className="mr-2 h-4 w-4" />
                Verified Wellness Facilitators • Conscious & Ethical Practice
              </Badge>

              <h1 className="font-heading text-page-heading lg:text-[3.5rem] lg:leading-tight text-forest mb-6">
                Beyond Traditional Therapy:
                <br />
                <span className="bg-gradient-to-r from-gold via-hive-accent to-garden-accent bg-clip-text text-transparent">
                  Nature-Inspired Guidance
                </span>
                <br />
                for Your Becoming
              </h1>

              <p className="text-body-lg text-forest/80 mb-4 leading-relaxed">
                Welcome, Dear One — this is fertile ground for your unfolding. FloreSer.Life is more than an online wellness platform. It's a <strong className="text-forest">living ecosystem</strong> where verified holistic facilitators—our Pollinators—offer presence, wisdom, and embodied practices.
              </p>
              <p className="text-body-lg text-forest/80 mb-8 leading-relaxed">
                Whether you're taking first steps into self-discovery or deepening your practice, this is where <strong className="text-gold">healing becomes flourishing</strong>.
              </p>

              {/* Main CTA Buttons - Using new variants */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="hummingbird"
                  size="xl"
                  onClick={handleFindYourMatch}
                  data-testid="button-find-practitioners"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Your Pollinator
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleJoinAsPractitioner}
                  data-testid="button-become-practitioner"
                >
                  For Facilitators
                </Button>
              </div>

              {/* Facilitator Guidance - Organic card */}
              <div className="relative bg-gradient-to-r from-hive-accent/10 via-gold/5 to-transparent rounded-card-lg p-5 mb-8 border border-hive-accent/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-hive-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-start space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-br from-hive-accent to-gold rounded-full mt-1.5 flex-shrink-0 animate-hexagon-pulse" />
                  <div>
                    <p className="text-body text-forest">
                      <span className="font-semibold">New to wellness facilitation?</span> Start with our{" "}
                      <Badge variant="bee" size="sm" className="mx-1">Bee archetype</Badge>
                      — the perfect foundation for developing your facilitator skills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Promise - Glassmorphism */}
              <div className="bg-white/60 backdrop-blur-sm rounded-card-lg p-6 mb-8 border border-white/40 shadow-card">
                <div className="text-center">
                  <Sparkles className="w-6 h-6 text-gold mx-auto mb-3" />
                  <h3 className="font-heading text-card-heading text-forest mb-3">
                    Our Promise to You
                  </h3>
                  <p className="text-body-sm text-forest/70 leading-relaxed">
                    Every practitioner is carefully verified and embodies one of our four nature-inspired archetypes. Healing happens best when there's genuine resonance.
                  </p>
                </div>
              </div>

              {/* Feature Highlights - Animated on scroll */}
              <div className="space-y-3">
                {[
                  { icon: Shield, title: "Carefully Verified", desc: "Every practitioner thoughtfully reviewed" },
                  { icon: Star, title: "Nature-Inspired Wisdom", desc: "Four unique healing approaches" },
                  { icon: Calendar, title: "Meaningful Connections", desc: "Find your healing match" },
                ].map((feature, i) => (
                  <div
                    key={feature.title}
                    className="flex items-center text-body-sm text-forest/70 animate-petal-fade"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <feature.icon className="text-gold mr-3 h-4 w-4" />
                    <span>
                      <strong className="text-forest">{feature.title}</strong> - {feature.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Alpha Access Link */}
              <div className="mt-8 pt-6 border-t border-sage/20">
                <p className="text-caption text-forest/50">
                  Interested in contributing to our development?{" "}
                  <button
                    onClick={handleJoinAlphaProgram}
                    className="text-gold hover:text-gold/80 underline transition-colors"
                  >
                    Join our Alpha Program
                  </button>
                </p>
              </div>
            </div>

            {/* Hero Image - Enhanced with organic frame */}
            <div className="relative">
              {/* Organic frame behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-garden-accent/20 via-transparent to-hive-accent/20 rounded-[3rem] transform rotate-3 scale-105" />
              <div className="absolute inset-0 bg-gradient-to-tl from-gold/10 via-transparent to-light-green/10 rounded-[3rem] transform -rotate-2 scale-102" />

              <div className="relative animate-float">
                <img
                  src={characters.angelica}
                  alt="ANGELICA the Colibri - Your wellness guide"
                  className="w-full h-auto max-w-md mx-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatAwaitsInside />
      <ArchetypeCardsSection />
      <SeasonsOfPractice />
      <MaiaSection />
      <FeaturedPractitioners />
      <ForFacilitatorsCTA />
      <Footer />
    </div>
  );
}
