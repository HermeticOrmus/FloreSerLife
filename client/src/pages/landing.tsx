import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArchetypeShowcase from "@/components/archetype-showcase";
import CharacterShowcase from "@/components/character-showcase";
import HowItWorks from "@/components/how-it-works";
import FeaturedPractitioners from "@/components/featured-practitioners";
import StatsSection from "@/components/stats-section";
import CTASection from "@/components/cta-section";
import { Button } from "@/components/ui/button";
import { Star, Shield, Search, Calendar, UserCheck } from "lucide-react";
import { characters } from "@/assets";

export default function Landing() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "FloreSer - Find Your Ideal Wellness Practitioner";
  }, []);

  const handleFindYourMatch = () => {
    if (isAuthenticated) {
      setLocation("/practitioners");
    } else {
      setLocation("/auth/signup");
    }
  };

  const handleJoinAsPractitioner = () => {
    if (isAuthenticated) {
      // If user already has practitioner role, go to dashboard
      if (user?.roles?.includes('practitioner')) {
        setLocation("/dashboard/practitioner");
      } else {
        // If authenticated but not a practitioner, go to practitioners page to set up profile
        setLocation("/practitioners");
      }
    } else {
      setLocation("/auth/signup");
    }
  };

  const handleJoinAlphaProgram = () => {
    setLocation("/alpha");
  };

  return (
    <div className="min-h-screen bg-cream text-forest">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-cream to-light-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
                <UserCheck className="mr-2 h-4 w-4" />
                Verified Wellness Practitioners
              </div>

              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
                Beyond Traditional Therapy:<br />
                <span className="text-gold">Nature-Inspired</span> Wellness Matching
              </h1>
              <p className="text-lg text-forest/80 mb-8 leading-relaxed">
                Stop settling for mismatched practitioners. Our revolutionary pollinator archetype system
                connects you with wellness professionals who truly understand your healing journey.
                Experience the difference when practitioner and seeker are perfectly aligned.
              </p>

              {/* Main CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gold text-white hover:bg-gold/90 rounded-full px-8 py-4 font-medium shadow-lg transform hover:scale-105 transition-all"
                  onClick={handleFindYourMatch}
                  data-testid="button-find-practitioners"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Your Match
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full px-8 py-4 font-medium"
                  onClick={handleJoinAsPractitioner}
                  data-testid="button-become-practitioner"
                >
                  Start as Facilitator
                </Button>
              </div>

              {/* New Facilitator Guidance */}
              <div className="bg-gold/10 rounded-lg p-4 mb-8 border border-gold/20">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-forest text-sm">
                      <span className="font-semibold">New to wellness facilitation?</span> Start with our{" "}
                      <span className="font-semibold text-gold">Bee archetype</span> - designed as the
                      perfect foundation for developing your facilitator skills in a supportive community environment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Promise */}
              <div className="bg-white/50 rounded-lg p-6 mb-8 border border-cream">
                <div className="text-center">
                  <h3 className="font-heading text-lg font-semibold text-forest mb-3">
                    Our Promise to You
                  </h3>
                  <p className="text-forest/70 leading-relaxed">
                    Every practitioner in our community is carefully verified and embodies one of our four
                    nature-inspired archetypes. We believe healing happens best when there's genuine resonance
                    between you and your practitioner's approach to wellness.
                  </p>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="bg-sage/10 rounded-lg p-6 mb-8 border border-sage/20">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">
                  Healing is Personal
                </h3>
                <p className="text-forest/70 text-sm leading-relaxed mb-4">
                  We know that finding the right wellness practitioner isn't just about credentials or location.
                  It's about finding someone whose approach truly resonates with your journey. Our nature-inspired
                  archetype system helps you discover practitioners whose energy and methods align with your needs.
                </p>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-forest/80 text-sm font-medium">
                    Every connection matters. Every journey is unique. Every healing path deserves respect.
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-forest/70">
                  <Shield className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">Carefully Verified</strong> - Every practitioner thoughtfully reviewed</span>
                </div>
                <div className="flex items-center text-sm text-forest/70">
                  <Star className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">Nature-Inspired Wisdom</strong> - Four unique healing approaches</span>
                </div>
                <div className="flex items-center text-sm text-forest/70">
                  <Calendar className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">Meaningful Connections</strong> - Find your healing match</span>
                </div>
              </div>

              {/* Alpha Access Link - subtle */}
              <div className="mt-8 pt-6 border-t border-sage/20">
                <p className="text-xs text-forest/50">
                  Interested in contributing to our development?{" "}
                  <button
                    onClick={handleJoinAlphaProgram}
                    className="text-gold hover:text-gold/80 underline"
                  >
                    Join our Alpha Program
                  </button>
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="floating-animation">
                <img
                  src={characters.angelica}
                  alt="ANGELICA the Colibri - Your wellness guide"
                  className="w-full h-auto max-w-md mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArchetypeShowcase />
      <CharacterShowcase />
      <HowItWorks />
      <FeaturedPractitioners />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}